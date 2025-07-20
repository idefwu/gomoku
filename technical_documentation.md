# 五子棋遊戲技術文檔

## 項目架構

### 文件結構
```
/mnt/d/unit01/
├── gomoku_final.html          # 主要遊戲文件（推薦使用）
├── gomoku_basic.html          # 基礎版本
├── test.html                  # 功能測試文件
├── gomoku.html               # 初始複雜版本（已棄用）
├── gomoku_simple.html        # 中間版本（已棄用）
├── server.js                 # WebSocket 伺服器（可選）
├── package.json              # Node.js 配置
├── calculator.html           # 原有文件
├── development_log.md        # 開發過程記錄
├── error_log.md             # 錯誤日誌
├── technical_documentation.md # 技術文檔（本文件）
└── README.md                # 專案說明
```

## 核心技術棧

### 前端技術
- **HTML5**: 結構化文檔
- **CSS3**: 樣式和布局
  - Flexbox 佈局
  - Grid 佈局（棋盤）
  - CSS動畫和過渡效果
- **JavaScript (ES5)**: 遊戲邏輯
  - 傳統函數語法（兼容性考量）
  - DOM 操作
  - 事件處理

### 後端技術（可選）
- **Node.js**: 運行環境
- **WebSocket**: 即時通訊
- **Express**: Web框架（server.js中）

## 遊戲邏輯設計

### 核心數據結構

```javascript
// 棋盤表示
var board = []; // 15x15 二維數組
// 0 = 空位, 1 = 黑棋, 2 = 白棋

// 遊戲狀態
var gameState = {
    currentPlayer: 1,          // 當前玩家
    gameStarted: false,        // 遊戲是否開始
    gameMode: null,           // 'ai' 或 'local'
    aiDifficulty: 'medium',   // AI難度
    isAIThinking: false       // AI是否在思考
};
```

### 勝利檢測算法

```javascript
function checkWin(row, col) {
    var player = board[row][col];
    var directions = [[0,1], [1,0], [1,1], [1,-1]];
    
    for (var d = 0; d < directions.length; d++) {
        var dx = directions[d][0];
        var dy = directions[d][1];
        var count = 1;
        
        // 正方向檢查
        for (var i = 1; i < 5; i++) {
            var newRow = row + dx * i;
            var newCol = col + dy * i;
            if (newRow < 0 || newRow >= 15 || newCol < 0 || newCol >= 15) break;
            if (board[newRow][newCol] !== player) break;
            count++;
        }
        
        // 負方向檢查
        for (var i = 1; i < 5; i++) {
            var newRow = row - dx * i;
            var newCol = col - dy * i;
            if (newRow < 0 || newRow >= 15 || newCol < 0 || newCol >= 15) break;
            if (board[newRow][newCol] !== player) break;
            count++;
        }
        
        if (count >= 5) return true;
    }
    return false;
}
```

## AI系統設計

### 難度分級

#### 簡單 AI
```javascript
function getRandomMove(moves) {
    // 策略：偏好中央區域的隨機下棋
    var centerMoves = [];
    for (var i = 0; i < moves.length; i++) {
        var move = moves[i];
        if (Math.abs(move.row - 7) <= 3 && Math.abs(move.col - 7) <= 3) {
            centerMoves.push(move);
        }
    }
    var candidates = centerMoves.length > 0 ? centerMoves : moves;
    return candidates[Math.floor(Math.random() * candidates.length)];
}
```

#### 中等 AI
```javascript
function getMediumMove(moves) {
    // 1. 檢查能否獲勝
    for (var i = 0; i < moves.length; i++) {
        var move = moves[i];
        board[move.row][move.col] = 2;
        if (checkWin(move.row, move.col)) {
            board[move.row][move.col] = 0;
            return move;
        }
        board[move.row][move.col] = 0;
    }
    
    // 2. 檢查需要防守
    for (var i = 0; i < moves.length; i++) {
        var move = moves[i];
        board[move.row][move.col] = 1;
        if (checkWin(move.row, move.col)) {
            board[move.row][move.col] = 0;
            return move;
        }
        board[move.row][move.col] = 0;
    }
    
    // 3. 位置評估
    var bestMove = null;
    var bestScore = -1;
    for (var i = 0; i < moves.length; i++) {
        var move = moves[i];
        var score = evaluatePosition(move.row, move.col);
        if (score > bestScore) {
            bestScore = score;
            bestMove = move;
        }
    }
    return bestMove || getRandomMove(moves);
}
```

#### 困難 AI
```javascript
function getHardMove(moves) {
    // 使用中等AI的基礎邏輯
    var move = getMediumMove(moves);
    
    // 額外策略：避免給對手創造雙活三
    var safeMoves = [];
    for (var i = 0; i < moves.length; i++) {
        var testMove = moves[i];
        if (!createsDoubleThree(testMove.row, testMove.col, 1)) {
            safeMoves.push(testMove);
        }
    }
    
    if (safeMoves.length > 0 && safeMoves.indexOf(move) === -1) {
        return getMediumMove(safeMoves);
    }
    
    return move;
}
```

### 位置評估函數

```javascript
function evaluatePosition(row, col) {
    var score = 0;
    
    // 中央位置加分
    var centerDistance = Math.abs(row - 7) + Math.abs(col - 7);
    score += Math.max(0, 14 - centerDistance);
    
    // 檢查周圍棋子
    var directions = [[0,1], [1,0], [1,1], [1,-1], [0,-1], [-1,0], [-1,-1], [-1,1]];
    for (var d = 0; d < directions.length; d++) {
        var dx = directions[d][0];
        var dy = directions[d][1];
        var newRow = row + dx;
        var newCol = col + dy;
        
        if (newRow >= 0 && newRow < 15 && newCol >= 0 && newCol < 15) {
            if (board[newRow][newCol] === 2) {
                score += 10; // 己方棋子附近
            } else if (board[newRow][newCol] === 1) {
                score += 5; // 對手棋子附近(防守)
            }
        }
    }
    
    return score;
}
```

## 用戶界面設計

### CSS佈局結構

```css
.game-container {
    /* 主容器：卡片式設計 */
    background: white;
    border-radius: 15px;
    padding: 20px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}

.board {
    /* 棋盤：CSS Grid布局 */
    display: grid;
    grid-template-columns: repeat(15, 35px);  /* 增大格子尺寸 */
    grid-template-rows: repeat(15, 35px);
    gap: 1px;
    background: #deb887;
    border: 3px solid #8b4513;
}

.cell {
    /* 棋盤格子 */
    width: 35px;   /* 從25px增大到35px */
    height: 35px;  /* 從25px增大到35px */
    background: #f4e4bc;
    border: 1px solid #8b4513;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;  /* 增大字體 */
}

/* 實體棋子樣式 */
.stone {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: 2px solid #333;
    box-shadow: 0 2px 6px rgba(0,0,0,0.4);
    position: relative;
}

.stone.black {
    background: radial-gradient(circle at 30% 30%, #555, #000);
    border-color: #222;
}

.stone.white {
    /* 3D實體白棋效果 */
    background: radial-gradient(circle at 30% 30%, #fff, #ddd);
    border-color: #666;
    box-shadow: 0 2px 6px rgba(0,0,0,0.3), inset 0 1px 3px rgba(255,255,255,0.8);
}
```

### 響應式設計

```css
/* 平板設備適配 */
@media (max-width: 768px) {
    .game-container {
        padding: 15px;
        margin: 10px;
    }
    
    .board {
        grid-template-columns: repeat(15, 30px);
        grid-template-rows: repeat(15, 30px);
    }
    
    .cell {
        width: 30px;
        height: 30px;
        font-size: 20px;
    }
    
    .stone {
        width: 24px;
        height: 24px;
    }
}

/* 手機設備適配 */
@media (max-width: 480px) {
    .board {
        grid-template-columns: repeat(15, 25px);
        grid-template-rows: repeat(15, 25px);
    }
    
    .cell {
        width: 25px;
        height: 25px;
        font-size: 18px;
    }
    
    .stone {
        width: 20px;
        height: 20px;
    }
}
```

### 交互設計

```css
/* 按鈕懸停效果 */
button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

/* 格子懸停效果 */
.cell:hover {
    background: #e6d3a3;
}

/* AI思考動畫 */
.thinking {
    color: #ff6b6b;
    font-style: italic;
    animation: pulse 1.5s infinite;
}

@keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
}
```

## 事件處理機制

### 主要事件流

```javascript
// 1. 頁面載入
window.onload = function() {
    console.log('五子棋遊戲載入完成');
};

// 2. 模式選擇
function selectAIMode() {
    // 切換到難度選擇界面
}

function selectLocalMode() {
    // 直接開始本地遊戲
}

// 3. 遊戲開始
function startGame() {
    // 初始化遊戲狀態
    // 創建棋盤
    // 開始遊戲循環
}

// 4. 下棋事件
function clickCell(row, col) {
    // 驗證移動合法性
    // 放置棋子
    // 檢查勝利條件
    // 切換玩家/觸發AI
}

// 5. 遊戲結束
function endGame(winner) {
    // 顯示結果
    // 重置遊戲狀態
}
```

## 性能優化

### 1. AI算法優化
```javascript
// 限制搜索範圍
function getImportantMoves(moves) {
    var importantMoves = [];
    for (var i = 0; i < moves.length; i++) {
        var move = moves[i];
        // 只考慮有棋子附近的位置
        if (hasAdjacentStone(move.row, move.col)) {
            importantMoves.push(move);
        }
    }
    return importantMoves;
}
```

### 2. DOM操作優化
```javascript
// 批量更新DOM
function updateBoard() {
    var fragment = document.createDocumentFragment();
    // 創建所有元素
    // 一次性添加到DOM
    boardElement.appendChild(fragment);
}
```

### 3. 內存管理
```javascript
// 及時清理不需要的數據
function cleanup() {
    board = null;
    moveHistory = null;
    // 清理其他大型對象
}
```

## 兼容性處理

### 瀏覽器兼容性
```javascript
// 使用ES5語法確保兼容性
var game = {
    // 使用 var 而不是 let/const
    init: function() {
        // 使用傳統函數而不是箭頭函數
    }
};

// 避免使用現代API
// 使用 document.getElementById 而不是 querySelector
// 使用 onclick 而不是 addEventListener
```

### 功能降級
```javascript
// 檢測功能支持
if (typeof Array.fill === 'undefined') {
    // 提供 polyfill
    Array.prototype.fill = function(value) {
        for (var i = 0; i < this.length; i++) {
            this[i] = value;
        }
        return this;
    };
}
```

## 錯誤處理

### 輸入驗證
```javascript
function clickCell(row, col) {
    // 邊界檢查
    if (row < 0 || row >= 15 || col < 0 || col >= 15) {
        console.error('Invalid position:', row, col);
        return;
    }
    
    // 狀態檢查
    if (!gameStarted || isAIThinking) {
        return;
    }
    
    // 位置檢查
    if (board[row][col] !== 0) {
        return;
    }
    
    // 執行下棋邏輯
}
```

### 異常捕獲
```javascript
function safeFunction() {
    try {
        // 可能出錯的代碼
        riskyOperation();
    } catch (error) {
        console.error('Error occurred:', error);
        // 友好的錯誤處理
        alert('操作失敗，請重試');
    }
}
```

## 測試策略

### 單元測試
```javascript
// 測試勝利檢測
function testCheckWin() {
    // 設置測試棋盤
    board[7][7] = 1;
    board[7][8] = 1;
    board[7][9] = 1;
    board[7][10] = 1;
    board[7][11] = 1;
    
    // 驗證結果
    var result = checkWin(7, 7);
    console.assert(result === true, 'Check win test failed');
}
```

### 集成測試
```javascript
// 測試完整遊戲流程
function testGameFlow() {
    startGame();
    clickCell(7, 7); // 玩家下棋
    // 驗證AI響應
    // 驗證遊戲狀態
}
```

## 部署說明

### 靜態部署
```bash
# 只需要將HTML文件放到Web服務器
# 不需要額外的依賴
cp gomoku_final.html /var/www/html/
```

### 開發環境
```bash
# 安裝依賴（如果需要WebSocket功能）
npm install

# 啟動開發服務器
npm start
```

## 維護指南

### 代碼結構
- 保持函數簡單，單一職責
- 使用清晰的變量命名
- 添加適當的註釋
- 避免深度嵌套

### 功能擴展
- 新增AI算法時保持接口一致
- 添加新功能時確保向後兼容
- 性能測試新功能

### 問題診斷
1. 檢查瀏覽器控制台錯誤
2. 驗證JavaScript語法
3. 測試基本功能
4. 檢查兼容性

---

## 視覺優化實現

### 棋子尺寸優化

**問題**：原始棋子過小，操作不便

**解決方案**：
```css
/* 原始尺寸 */
.cell {
    width: 25px;
    height: 25px;
    font-size: 16px;
}

/* 優化後尺寸 */
.cell {
    width: 35px;        /* +40% */
    height: 35px;       /* +40% */
    font-size: 24px;    /* +50% */
}
```

### 3D實體棋子實現

**技術方案**：使用DOM元素替代文字符號

```javascript
// 舊方案：文字符號
cell.innerHTML = player === 1 ? '●' : '○';

// 新方案：實體DOM元素
var stone = document.createElement('div');
stone.className = 'stone ' + (player === 1 ? 'black' : 'white');
cell.innerHTML = '';  // 清除原有內容
cell.appendChild(stone);  // 添加3D棋子
```

**視覺效果**：
```css
.stone.white {
    /* 漸變背景模擬光澤 */
    background: radial-gradient(circle at 30% 30%, #fff, #ddd);
    /* 內陰影增強立體感 */
    box-shadow: 0 2px 6px rgba(0,0,0,0.3), inset 0 1px 3px rgba(255,255,255,0.8);
}
```

## 最新更新記錄

### 2025年7月20日 - 視覺體驗優化

**改進項目**：
1. **棋子尺寸擴大**：提升40%尺寸，改善操作體驗
2. **實體化設計**：從文字符號改為3D DOM元素
3. **響應式適配**：多設備尺寸統一優化
4. **立體視覺效果**：漸變光澤和陰影增強

## 總結

這個五子棋遊戲項目展示了從複雜到簡單的開發演進過程，最終實現了一個穩定、兼容、功能完整的遊戲。主要特點：

- ✅ **穩定性優先**：使用最穩定的技術棧
- ✅ **用戶體驗**：響應式設計和流暢交互
- ✅ **智能AI**：三種難度級別滿足不同需求
- ✅ **兼容性好**：支援各種瀏覽器環境
- ✅ **易於維護**：清晰的代碼結構和文檔
- ✅ **視覺優化**：3D實體棋子和合適尺寸
- ✅ **持續改進**：根據用戶反饋不斷優化

這個項目的成功關鍵在於：聽取用戶反饋、及時解決問題、保持代碼簡潔、確保穩定運行，以及持續的用戶體驗改進。