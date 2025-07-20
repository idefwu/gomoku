const WebSocket = require('ws');
const http = require('http');

class GomokuServer {
    constructor() {
        this.rooms = new Map();
        this.clients = new Map();
        this.server = http.createServer();
        this.wss = new WebSocket.Server({ server: this.server });
        
        this.setupWebSocket();
    }

    setupWebSocket() {
        this.wss.on('connection', (ws) => {
            console.log('New client connected');
            
            ws.on('message', (message) => {
                try {
                    const data = JSON.parse(message);
                    this.handleMessage(ws, data);
                } catch (error) {
                    console.error('Error parsing message:', error);
                    ws.send(JSON.stringify({ type: 'error', message: '無效的訊息格式' }));
                }
            });

            ws.on('close', () => {
                console.log('Client disconnected');
                this.handleDisconnect(ws);
            });

            ws.on('error', (error) => {
                console.error('WebSocket error:', error);
            });
        });
    }

    handleMessage(ws, data) {
        switch (data.type) {
            case 'createRoom':
                this.createRoom(ws, data.playerId);
                break;
            case 'joinRoom':
                this.joinRoom(ws, data.roomId, data.playerId);
                break;
            case 'move':
                this.handleMove(ws, data);
                break;
            case 'restart':
                this.handleRestart(ws, data.roomId);
                break;
            case 'undo':
                this.handleUndo(ws, data.roomId);
                break;
            default:
                ws.send(JSON.stringify({ type: 'error', message: '未知的訊息類型' }));
        }
    }

    createRoom(ws, playerId) {
        const roomId = this.generateRoomId();
        const room = {
            id: roomId,
            players: [{ ws, playerId, color: 1 }], // Creator is black (1)
            board: Array(15).fill().map(() => Array(15).fill(0)),
            currentPlayer: 1,
            gameStarted: false,
            moveHistory: []
        };

        this.rooms.set(roomId, room);
        this.clients.set(ws, { roomId, playerId, color: 1 });

        ws.send(JSON.stringify({
            type: 'roomCreated',
            roomId: roomId,
            color: 1
        }));

        console.log(`Room ${roomId} created by player ${playerId}`);
    }

    joinRoom(ws, roomId, playerId) {
        const room = this.rooms.get(roomId);
        
        if (!room) {
            ws.send(JSON.stringify({ type: 'error', message: '房間不存在' }));
            return;
        }

        if (room.players.length >= 2) {
            ws.send(JSON.stringify({ type: 'error', message: '房間已滿' }));
            return;
        }

        // Check if player is already in room
        if (room.players.find(p => p.playerId === playerId)) {
            ws.send(JSON.stringify({ type: 'error', message: '你已經在這個房間中' }));
            return;
        }

        const color = 2; // Joiner is white (2)
        room.players.push({ ws, playerId, color });
        this.clients.set(ws, { roomId, playerId, color });

        // Notify both players
        room.players.forEach(player => {
            player.ws.send(JSON.stringify({
                type: 'roomJoined',
                roomId: roomId,
                color: player.color
            }));
        });

        // Start game if room is full
        if (room.players.length === 2) {
            room.gameStarted = true;
            room.players.forEach(player => {
                player.ws.send(JSON.stringify({
                    type: 'gameStart'
                }));
            });
        }

        console.log(`Player ${playerId} joined room ${roomId}`);
    }

    handleMove(ws, data) {
        const clientInfo = this.clients.get(ws);
        if (!clientInfo) return;

        const room = this.rooms.get(clientInfo.roomId);
        if (!room || !room.gameStarted) {
            ws.send(JSON.stringify({ type: 'error', message: '遊戲尚未開始' }));
            return;
        }

        const { row, col, player } = data;

        // Validate turn
        if (room.currentPlayer !== clientInfo.color) {
            ws.send(JSON.stringify({ type: 'error', message: '不是你的回合' }));
            return;
        }

        // Validate move
        if (row < 0 || row >= 15 || col < 0 || col >= 15 || room.board[row][col] !== 0) {
            ws.send(JSON.stringify({ type: 'error', message: '無效的移動' }));
            return;
        }

        // Make move
        room.board[row][col] = player;
        room.moveHistory.push({ row, col, player });

        // Check for win
        const hasWon = this.checkWin(room.board, row, col, player);

        // Broadcast move to all players in room
        room.players.forEach(p => {
            p.ws.send(JSON.stringify({
                type: 'move',
                row,
                col,
                player
            }));
        });

        if (hasWon) {
            room.players.forEach(p => {
                p.ws.send(JSON.stringify({
                    type: 'gameOver',
                    winner: player
                }));
            });
            console.log(`Game over in room ${room.id}, winner: ${player}`);
        } else {
            // Switch turn
            room.currentPlayer = room.currentPlayer === 1 ? 2 : 1;
        }
    }

    handleRestart(ws, roomId) {
        const room = this.rooms.get(roomId);
        if (!room) return;

        // Reset game state
        room.board = Array(15).fill().map(() => Array(15).fill(0));
        room.currentPlayer = 1;
        room.moveHistory = [];

        // Notify all players
        room.players.forEach(player => {
            player.ws.send(JSON.stringify({
                type: 'restart'
            }));
        });

        console.log(`Game restarted in room ${roomId}`);
    }

    handleUndo(ws, roomId) {
        const room = this.rooms.get(roomId);
        if (!room || room.moveHistory.length === 0) return;

        const lastMove = room.moveHistory.pop();
        room.board[lastMove.row][lastMove.col] = 0;
        room.currentPlayer = room.currentPlayer === 1 ? 2 : 1;

        // Notify all players
        room.players.forEach(player => {
            player.ws.send(JSON.stringify({
                type: 'undo',
                move: lastMove
            }));
        });

        console.log(`Move undone in room ${roomId}`);
    }

    handleDisconnect(ws) {
        const clientInfo = this.clients.get(ws);
        if (!clientInfo) return;

        const room = this.rooms.get(clientInfo.roomId);
        if (room) {
            // Remove player from room
            room.players = room.players.filter(p => p.ws !== ws);
            
            // Notify remaining players
            room.players.forEach(player => {
                player.ws.send(JSON.stringify({
                    type: 'playerLeft'
                }));
            });

            // Remove empty rooms
            if (room.players.length === 0) {
                this.rooms.delete(clientInfo.roomId);
                console.log(`Room ${clientInfo.roomId} deleted`);
            }
        }

        this.clients.delete(ws);
        console.log(`Player ${clientInfo.playerId} disconnected from room ${clientInfo.roomId}`);
    }

    checkWin(board, row, col, player) {
        const directions = [
            [0, 1],   // horizontal
            [1, 0],   // vertical
            [1, 1],   // diagonal \
            [1, -1]   // diagonal /
        ];

        for (let [dx, dy] of directions) {
            let count = 1;
            
            // Check positive direction
            for (let i = 1; i < 5; i++) {
                const newRow = row + dx * i;
                const newCol = col + dy * i;
                if (newRow < 0 || newRow >= 15 || newCol < 0 || newCol >= 15) break;
                if (board[newRow][newCol] !== player) break;
                count++;
            }
            
            // Check negative direction
            for (let i = 1; i < 5; i++) {
                const newRow = row - dx * i;
                const newCol = col - dy * i;
                if (newRow < 0 || newRow >= 15 || newCol < 0 || newCol >= 15) break;
                if (board[newRow][newCol] !== player) break;
                count++;
            }
            
            if (count >= 5) return true;
        }
        
        return false;
    }

    generateRoomId() {
        return Math.random().toString(36).substr(2, 6).toUpperCase();
    }

    start(port = 8080) {
        this.server.listen(port, () => {
            console.log(`五子棋伺服器運行在端口 ${port}`);
            console.log(`WebSocket 端點: ws://localhost:${port}`);
        });
    }
}

// Start server
const server = new GomokuServer();
server.start();

module.exports = GomokuServer;