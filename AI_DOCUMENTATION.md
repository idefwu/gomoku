# 🧠 五子棋AI技術文檔

## 📋 目錄

1. [AI架構概述](#ai架構概述)
2. [難度等級設計](#難度等級設計)
3. [核心算法詳解](#核心算法詳解)
4. [性能優化](#性能優化)
5. [開發指南](#開發指南)
6. [測試與調試](#測試與調試)

## 🏗️ AI架構概述

### 設計理念
五子棋AI系統採用**分層設計**理念，從簡單到複雜逐步構建智能對手：

```
AI系統架構
├── 決策層 (Decision Layer)
│   ├── 獲勝檢測
│   ├── 防守檢測  
│   ├── 威脅分析
│   └── 策略選擇
├── 評估層 (Evaluation Layer)
│   ├── 位置評估
│   ├── 威脅計算
│   ├── 戰略分析
│   └── 綜合評分
└── 基礎層 (Foundation Layer)
    ├── 棋盤分析
    ├── 連子檢測
    ├── 方向掃描
    └── 狀態管理
```

### 核心組件

#### 1. 移動生成器 (Move Generator)
- **功能**：生成所有可能的下棋位置
- **優化**：只考慮附近有棋子的位置，減少搜索空間
- **特殊處理**：開局時優先中央位置

#### 2. 評估函數 (Evaluation Function)  
- **位置評估**：基於棋盤位置的基礎分數
- **威脅評估**：識別和量化各種威脅模式
- **戰略評估**：考慮長期戰略價值

#### 3. 決策引擎 (Decision Engine)
- **簡單AI**：基本攻防 + 隨機選擇
- **中等AI**：威脅識別 + 策略選擇
- **困難AI**：深度分析 + 高級戰術

## 🎯 難度等級設計

### 😊 簡單AI (Easy AI)

**設計目標**：適合初學者，具備基本智能但不會太難

**核心特徵**：
```javascript
// 基本攻防策略
1. 檢查能否一步獲勝 → 立即獲勝
2. 檢查需要防守 → 阻止對手獲勝  
3. 偏好中央區域 → 選擇戰略位置
4. 隨機選擇 → 增加不可預測性
```

**算法實現**：
- **思考時間**：400ms
- **搜索深度**：1步（僅考慮即時威脅）
- **評估要素**：基本攻防 + 位置偏好

### 🤔 中等AI (Medium AI)

**設計目標**：提供適中挑戰，具備戰術思維

**核心特徵**：
```javascript
// 強化攻防策略
1. 獲勝檢測 → 優先獲勝機會
2. 防守檢測 → 阻止對手獲勝
3. 威脅創造 → 形成活四、活三等威脅
4. 防守威脅 → 阻止對手形成威脅
5. 位置評估 → 選擇最佳戰略位置
```

**算法實現**：
- **思考時間**：800ms
- **搜索深度**：2步（考慮對手回應）
- **評估要素**：威脅識別 + 戰術分析

### 😤 困難AI (Hard AI)

**設計目標**：挑戰高級玩家，具備戰略思維

**核心特徵**：
```javascript
// 高級策略分析
1. 獲勝檢測 → 立即獲勝
2. 防守檢測 → 關鍵防守
3. 威脅分析 → 精確威脅計算
4. 防守分析 → 深度防守思維
5. 戰略評估 → 多方向影響分析
```

**算法實現**：
- **思考時間**：1200ms
- **搜索深度**：多層評估
- **評估要素**：精確威脅計算 + 戰略分析

## 🔍 核心算法詳解

### 1. 威脅識別算法

#### calculateThreatScore函數
```javascript
function calculateThreatScore(row, col, player) {
    var score = 0;
    var directions = [[0,1], [1,0], [1,1], [1,-1]];
    
    for (var d = 0; d < directions.length; d++) {
        var lineInfo = analyzeDirection(row, col, dx, dy, player);
        
        // 根據連子數和開口數評分
        if (lineInfo.count >= 4) {
            score += 2000; // 活四或沖四
        } else if (lineInfo.count >= 3) {
            if (lineInfo.openEnds >= 2) {
                score += 800; // 活三
            } else if (lineInfo.openEnds >= 1) {
                score += 200; // 沖三  
            }
        }
        // ... 更多評分邏輯
    }
    
    return score;
}
```

#### 威脅模式分類
- **活四** (2000分)：`_●●●●_` 必勝威脅
- **沖四** (1000分)：`X●●●●_` 強威脅  
- **活三** (800分)：`_●●●_` 雙端開放
- **沖三** (200分)：`X●●●_` 單端開放
- **活二** (100分)：`_●●_` 發展潛力
- **沖二** (20分)：`X●●_` 基礎連接

### 2. 方向分析算法

#### analyzeDirection函數
```javascript
function analyzeDirection(row, col, dx, dy, player) {
    // 暫時放置棋子進行分析
    board[row][col] = player;
    
    var count = 1;
    var openEnds = 0;
    
    // 雙向掃描，計算連子數和開口數
    // 正方向掃描
    var frontCount = scanDirection(row, col, dx, dy, player);
    // 負方向掃描  
    var backCount = scanDirection(row, col, -dx, -dy, player);
    
    count += frontCount + backCount;
    
    // 計算有效開口
    openEnds = calculateOpenEnds(row, col, dx, dy, frontCount, backCount);
    
    // 恢復棋盤狀態
    board[row][col] = 0;
    
    return {count: count, openEnds: openEnds};
}
```

### 3. 戰略位置評估

#### calculatePositionValue函數
```javascript
function calculatePositionValue(row, col) {
    var score = 0;
    
    // 基礎位置分數（中央區域優勢）
    score += evaluatePosition(row, col);
    
    // 攻擊潛力（己方威脅）
    var attackScore = calculateThreatScore(row, col, AI_PLAYER);
    score += attackScore * 1.5;
    
    // 防守價值（阻止對手威脅）
    var defenseScore = calculateThreatScore(row, col, HUMAN_PLAYER);
    score += defenseScore * 1.0;
    
    // 戰略位置加分
    var strategicValue = getStrategicValue(row, col);
    score += strategicValue;
    
    return score;
}
```

#### 戰略要素
1. **中央控制**：中央位置有更多發展方向
2. **多線影響**：能同時影響多個方向的位置
3. **連接價值**：能與現有棋子形成連接的位置
4. **阻斷價值**：能阻止對手連接的關鍵位置

### 4. 智能搜索優化

#### 移動排序 (Move Ordering)
```javascript
function getAvailableMoves() {
    var moves = [];
    
    // 只考慮有戰略價值的位置
    for (var row = 0; row < 15; row++) {
        for (var col = 0; col < 15; col++) {
            if (board[row][col] === 0 && hasAdjacentStone(row, col)) {
                moves.push({
                    row: row, 
                    col: col, 
                    score: evaluatePosition(row, col)
                });
            }
        }
    }
    
    // 按評分排序，優先考慮高分位置
    moves.sort(function(a, b) { return b.score - a.score; });
    return moves;
}
```

#### 剪枝優化
- **Alpha-Beta剪枝**：在minimax算法中使用
- **位置過濾**：只考慮附近有棋子的位置
- **數量限制**：限制每層搜索的位置數量

## ⚡ 性能優化

### 1. 算法優化

#### 搜索空間縮減
```javascript
// 開局優化：直接選擇中央位置
if (isEmpty(board)) {
    return {row: 7, col: 7};
}

// 位置過濾：只考慮附近有棋子的位置
function hasAdjacentStone(row, col) {
    for (var dr = -2; dr <= 2; dr++) {
        for (var dc = -2; dc <= 2; dc++) {
            if (isValidPosition(row + dr, col + dc) && 
                board[row + dr][col + dc] !== 0) {
                return true;
            }
        }
    }
    return false;
}
```

#### 計算緩存
- **威脅計算緩存**：避免重複計算相同位置
- **評估結果緩存**：緩存位置評估結果
- **方向分析緩存**：緩存方向掃描結果

### 2. 時間管理

#### 分級思考時間
```javascript
var thinkingTime = {
    easy: 400,    // 快速反應
    medium: 800,  // 適中思考
    hard: 1200    // 深度思考
};

// 動態調整思考時間
setTimeout(function() {
    var move = getBestMove();
    makeMove(move);
}, thinkingTime[difficulty]);
```

#### 漸進式計算
- **優先級計算**：先計算重要威脅
- **時間切片**：將計算分解為多個時間片
- **早期終止**：在找到明顯最佳移動時提前結束

### 3. 內存優化

#### 狀態管理
```javascript
// 最小化內存使用
function simulateMove(row, col, player) {
    board[row][col] = player;
    var result = evaluate();
    board[row][col] = 0; // 立即恢復
    return result;
}
```

## 🛠️ 開發指南

### 1. 添加新難度等級

#### 步驟
1. **定義新的AI函數**
   ```javascript
   function getExpertMove(moves) {
       // 實現專家級AI邏輯
   }
   ```

2. **在主函數中添加調用**
   ```javascript
   if (aiDifficulty === 'expert') {
       return getExpertMove(availableMoves);
   }
   ```

3. **更新UI界面**
   ```html
   <button onclick="startAIGame('expert')">🔥 專家</button>
   ```

### 2. 自定義評估函數

#### 評估要素權重調整
```javascript
var weights = {
    position: 1.0,      // 位置權重
    attack: 1.5,        // 攻擊權重  
    defense: 1.0,       // 防守權重
    strategic: 0.5      // 戰略權重
};

function customEvaluate(row, col) {
    return weights.position * evaluatePosition(row, col) +
           weights.attack * calculateThreatScore(row, col, AI_PLAYER) +
           weights.defense * calculateThreatScore(row, col, HUMAN_PLAYER) +
           weights.strategic * getStrategicValue(row, col);
}
```

### 3. 調試工具

#### AI思考過程可視化
```javascript
function debugAI(moves) {
    console.log('AI評估結果：');
    for (var i = 0; i < Math.min(moves.length, 5); i++) {
        var move = moves[i];
        console.log(`位置(${move.row},${move.col}): ${move.score}分`);
    }
}
```

#### 性能監控
```javascript
function monitorPerformance() {
    var startTime = performance.now();
    var move = getBestMove();
    var endTime = performance.now();
    console.log(`AI思考時間: ${endTime - startTime}ms`);
    return move;
}
```

## 🧪 測試與調試

### 1. 單元測試

#### 威脅識別測試
```javascript
function testThreatDetection() {
    // 測試活四識別
    setupBoard('_●●●●_');
    assert(calculateThreatScore(5, 5, 1) >= 2000);
    
    // 測試活三識別  
    setupBoard('_●●●_');
    assert(calculateThreatScore(4, 4, 1) >= 800);
}
```

#### 評估函數測試
```javascript
function testEvaluation() {
    // 測試中央位置偏好
    assert(evaluatePosition(7, 7) > evaluatePosition(0, 0));
    
    // 測試威脅評估
    setupThreatScenario();
    assert(calculatePositionValue(threatRow, threatCol) > 1000);
}
```

### 2. 集成測試

#### AI對戰測試
```javascript
function testAIDifficulties() {
    var easyWins = simulateGames('easy', 100);
    var mediumWins = simulateGames('medium', 100);  
    var hardWins = simulateGames('hard', 100);
    
    // 困難AI應該有更高勝率
    assert(hardWins > mediumWins > easyWins);
}
```

### 3. 性能測試

#### 響應時間測試
```javascript
function testResponseTime() {
    var times = [];
    for (var i = 0; i < 10; i++) {
        var start = performance.now();
        getBestMove();
        var end = performance.now();
        times.push(end - start);
    }
    
    var avgTime = times.reduce((a, b) => a + b) / times.length;
    assert(avgTime < 2000); // 確保響應時間合理
}
```

## 📈 未來改進方向

### 1. 算法增強
- **機器學習**：使用神經網絡改進評估函數
- **開局庫**：添加開局定式庫
- **終局庫**：添加終局必勝序列

### 2. 用戶體驗
- **AI個性化**：不同風格的AI（攻擊型、防守型等）
- **提示系統**：為玩家提供下棋建議
- **分析模式**：分析棋局和復盤功能

### 3. 技術優化
- **WebWorker**：在後台線程運行AI計算
- **WebAssembly**：使用WASM提升計算性能
- **算法並行化**：利用多核CPU並行計算

---

## 📚 參考資料

1. **五子棋理論**
   - 黑先必勝證明
   - 經典開局理論
   - 職業比賽分析

2. **AI算法**
   - Minimax算法
   - Alpha-Beta剪枝
   - 蒙特卡羅樹搜索

3. **評估函數設計**
   - 模式識別方法
   - 機器學習應用
   - 專家知識整合

---

*本文檔將隨著AI系統的發展持續更新。*