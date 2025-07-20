# 五子棋網路對戰遊戲

一個支援多人線上對戰的五子棋遊戲，使用 WebSocket 技術實現即時對戰。

## 功能特色

- 📱 響應式設計，支援手機和桌面設備
- 🌐 網路多人對戰
- 🏠 房間系統，可創建或加入房間
- ⚫⚪ 標準五子棋規則
- 🔄 重新開始和悔棋功能
- 💬 即時遊戲狀態同步
- 🎮 離線模式（本地對戰）

## 技術架構

### 前端
- HTML5 + CSS3 + JavaScript
- WebSocket 客戶端
- 響應式網格佈局
- 實時遊戲狀態更新

### 後端
- Node.js + WebSocket Server
- 房間管理系統
- 遊戲邏輯處理
- 多人連線管理

## 安裝與運行

### 1. 安裝依賴
```bash
npm install
```

### 2. 啟動伺服器
```bash
npm start
```

或使用開發模式（自動重啟）：
```bash
npm run dev
```

### 3. 開啟遊戲
在瀏覽器中打開 `gomoku.html` 文件

## 遊戲說明

### 如何開始遊戲

1. **網路對戰模式**：
   - 確保伺服器正在運行（預設端口：8080）
   - 點擊「創建房間」來建立新房間
   - 或輸入房間號碼並點擊「加入房間」
   - 等待其他玩家加入即可開始遊戲

2. **離線模式**：
   - 如果無法連接到伺服器，自動切換到離線模式
   - 可進行本地雙人對戰

### 遊戲規則

- 黑棋先下
- 在棋盤上點擊空位放置棋子
- 率先連成五子（橫、縱、斜）的玩家獲勝
- 支援悔棋功能（僅限最後一步）

### 操作說明

- **下棋**：點擊棋盤空位
- **重新開始**：點擊「重新開始」按鈕
- **悔棋**：點擊「悔棋」按鈕（僅能悔最後一步）

## 文件結構

```
.
├── gomoku.html          # 前端遊戲界面
├── server.js           # WebSocket 伺服器
├── package.json        # 專案配置
└── README.md          # 說明文件
```

## 伺服器 API

### WebSocket 訊息格式

#### 客戶端發送

```javascript
// 創建房間
{ type: 'createRoom', playerId: 'player123' }

// 加入房間
{ type: 'joinRoom', roomId: 'ABC123', playerId: 'player123' }

// 下棋
{ type: 'move', roomId: 'ABC123', row: 7, col: 7, player: 1 }

// 重新開始
{ type: 'restart', roomId: 'ABC123' }

// 悔棋
{ type: 'undo', roomId: 'ABC123' }
```

#### 伺服器回應

```javascript
// 房間創建成功
{ type: 'roomCreated', roomId: 'ABC123', color: 1 }

// 加入房間成功
{ type: 'roomJoined', roomId: 'ABC123', color: 2 }

// 遊戲開始
{ type: 'gameStart' }

// 對手下棋
{ type: 'move', row: 7, col: 7, player: 1 }

// 遊戲結束
{ type: 'gameOver', winner: 1 }

// 錯誤訊息
{ type: 'error', message: '房間不存在' }
```

## 自定義配置

### 修改伺服器端口
在 `server.js` 文件中修改：
```javascript
server.start(3000); // 改為你想要的端口
```

### 修改 WebSocket 連接地址
在 `gomoku.html` 中修改：
```javascript
this.ws = new WebSocket('ws://your-server:port');
```

## 瀏覽器支援

- Chrome 16+
- Firefox 11+
- Safari 7+
- Edge 12+

## 故障排除

### 常見問題

1. **無法連接到伺服器**
   - 確認伺服器是否正在運行
   - 檢查防火牆設置
   - 確認端口是否被佔用

2. **遊戲無法正常顯示**
   - 確認瀏覽器支援 WebSocket
   - 檢查瀏覽器控制台是否有錯誤訊息

3. **房間連接問題**
   - 確認房間號碼是否正確
   - 檢查房間是否已滿（最多2人）

## 許可證

MIT License

## 貢獻

歡迎提交 Issue 和 Pull Request！