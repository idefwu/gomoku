# 🎮 五子棋遊戲完整指南

## 📖 目錄

1. [快速開始](#快速開始)
2. [遊戲模式介紹](#遊戲模式介紹)
3. [基本規則](#基本規則)
4. [操作說明](#操作說明)
5. [AI對戰指南](#ai對戰指南)
6. [網路對戰指南](#網路對戰指南)
7. [策略技巧](#策略技巧)
8. [常見問題](#常見問題)

## 🚀 快速開始

### 第一次遊玩
1. **選擇遊戲文件**
   - 新手推薦：`gomoku_final.html`（AI對戰版）
   - 雙人遊玩：任意HTML文件的本地對戰模式
   - 網路對戰：`gomoku.html`（需啟動伺服器）

2. **開啟遊戲**
   - 雙擊HTML文件或在瀏覽器中打開
   - 選擇您想要的遊戲模式

3. **開始對戰**
   - AI對戰：選擇難度等級即可開始
   - 本地對戰：直接開始，黑棋先手
   - 網路對戰：創建或加入房間

## 🎯 遊戲模式介紹

### 🤖 AI對戰模式（推薦新手）

**特點：**
- 單人遊戲，隨時可玩
- 三種難度等級
- 智能對手，具備戰略思維
- 適合練習和學習

**適合人群：**
- 五子棋初學者
- 想要練習棋藝的玩家
- 空閒時間想要娛樂的用戶

### 👥 本地雙人對戰

**特點：**
- 在同一設備上進行對戰
- 面對面交流互動
- 即時反應，無網路延遲
- 適合親友聚會

**適合人群：**
- 朋友聚會
- 家庭娛樂
- 教學演示

### 🌐 網路對戰模式

**特點：**
- 與世界各地玩家對戰
- 房間系統，可邀請好友
- 即時同步，流暢對戰
- 支援多人觀戰

**適合人群：**
- 遠距離好友對戰
- 喜歡挑戰的玩家
- 想要擴展社交圈的用戶

## 📏 基本規則

### 棋盤與棋子
- **棋盤規格**：15×15格線交叉點
- **棋子顏色**：黑子（●）和白子（○）
- **先手優勢**：黑棋先下，具有先手優勢

### 獲勝條件
連成五子即獲勝，包括：
- **橫向五連**：水平方向連成五子 `●●●●●`
- **縱向五連**：垂直方向連成五子
- **斜向五連**：對角線方向連成五子 `●●●●●`

### 基本規則
1. **輪流下棋**：雙方輪流在空的交叉點放置棋子
2. **不可悔棋**：棋子一旦放下不可移動（部分版本支援悔棋功能）
3. **禁手規則**：本遊戲採用自由五子棋規則，無禁手限制
4. **遊戲結束**：任一方連成五子即刻獲勝

## 🖱️ 操作說明

### 基本操作
1. **下棋**
   - 點擊棋盤上的空白交叉點
   - 系統會自動放置對應顏色的棋子
   - 下棋後自動切換到對方回合

2. **遊戲控制**
   - **重新開始**：清空棋盤，重新開始一局
   - **返回選單**：回到模式選擇界面
   - **悔棋**：撤銷最後一步（如果支援）

### 界面介紹
- **遊戲狀態顯示**：顯示當前輪到哪方下棋
- **模式指示**：顯示當前遊戲模式（AI/本地/網路）
- **難度顯示**：在AI模式下顯示當前AI難度
- **控制按鈕**：提供遊戲控制功能

## 🤖 AI對戰指南

### AI難度說明

#### 😊 簡單AI
**特徵：**
- 具備基本攻防意識
- 能識別一步獲勝和防守機會
- 偏好在中央區域下棋
- 適合五子棋初學者

**建議：**
- 新手可以先從簡單AI開始練習
- 掌握基本的攻防概念
- 學習如何形成連子威脅

#### 🤔 中等AI
**特徵：**
- 強化的攻防策略
- 能識別活四、活三等威脅模式
- 具備一定的戰略思維
- 提供適中的挑戰難度

**建議：**
- 適合有一定基礎的玩家
- 可以學習更高級的戰術
- 練習多重威脅的創造

#### 😤 困難AI
**特徵：**
- 高級戰略分析能力
- 精確的威脅計算
- 多方向影響評估
- 攻守平衡的決策能力

**建議：**
- 挑戰資深五子棋玩家
- 學習高級戰略和戰術
- 提升整體棋藝水平

### 對戰技巧
1. **觀察AI風格**：每個難度AI都有不同的下棋風格
2. **學習AI策略**：觀察AI的攻防選擇，學習其思路
3. **循序漸進**：建議從簡單難度開始，逐步提升

## 🌐 網路對戰指南

### 環境準備
1. **安裝Node.js**（如果要自己架設伺服器）
2. **啟動伺服器**：
   ```bash
   npm install
   npm start
   ```
3. **打開遊戲**：在瀏覽器中開啟`gomoku.html`

### 房間系統
1. **創建房間**：
   - 點擊「創建房間」按鈕
   - 系統自動生成房間號碼
   - 等待其他玩家加入

2. **加入房間**：
   - 輸入房間號碼
   - 點擊「加入房間」
   - 成功加入後等待遊戲開始

### 網路對戰特色
- **即時同步**：對手的每一步都會即時顯示
- **連線狀態**：顯示網路連線狀態
- **自動配對**：支援隨機配對功能
- **觀戰模式**：支援其他玩家觀戰

## 🧠 策略技巧

### 基礎策略
1. **搶佔中央**：中央位置有更多發展方向
2. **攻守兼備**：既要創造威脅，也要防守對手
3. **多線發展**：同時在多個方向布局

### 進階戰術
1. **活三戰術**：創造活三（兩端都有空位的三連）
2. **雙三殺**：同時形成兩個活三，對手無法全部防守
3. **活四必勝**：形成活四（兩端都有空位的四連）立即獲勝

### 防守要點
1. **優先防守**：對手的威脅比自己的進攻更重要
2. **斷線防守**：阻止對手形成長連
3. **預判走位**：提前防守對手可能的威脅位置

### 常見陷阱
1. **假威脅**：創造看似威脅實則無害的棋形
2. **引導對手**：迫使對手下在對自己有利的位置
3. **連環攻擊**：一步棋同時創造多個威脅

## ❓ 常見問題

### 遊戲相關

**Q: 為什麼我下不了棋？**
A: 可能的原因：
- 不是您的回合（等待對手下棋）
- 該位置已有棋子
- 遊戲已結束
- AI正在思考中

**Q: 如何判斷獲勝？**
A: 任何方向（橫、縱、斜）連成五子即獲勝，系統會自動判定並顯示結果。

**Q: 可以悔棋嗎？**
A: 部分版本支援悔棋功能，具體取決於遊戲版本設定。

### AI對戰相關

**Q: AI會作弊嗎？**
A: 不會，AI使用公平的算法，只能看到與人類玩家相同的棋盤信息。

**Q: 為什麼困難AI這麼強？**
A: 困難AI使用了先進的威脅識別和戰略分析算法，能夠進行深度思考。

**Q: AI的思考時間是固定的嗎？**
A: 是的，不同難度的AI有不同的思考時間，模擬真實的思考過程。

### 網路對戰相關

**Q: 連接不上伺服器怎麼辦？**
A: 請檢查：
- 伺服器是否正在運行
- 網路連接是否正常
- 防火牆設置
- 端口是否被佔用

**Q: 房間號碼是什麼？**
A: 房間號碼是系統自動生成的唯一標識符，用於區分不同的對戰房間。

**Q: 如果對手中途離開怎麼辦？**
A: 系統會檢測到連接斷開，並提示您對手已離線。

### 技術相關

**Q: 需要安裝什麼軟件嗎？**
A: 不需要，只需要現代瀏覽器即可運行。網路對戰需要Node.js環境。

**Q: 手機上可以玩嗎？**
A: 可以，遊戲採用響應式設計，完美支援手機和平板設備。

**Q: 支援哪些瀏覽器？**
A: 支援所有現代瀏覽器，包括Chrome、Firefox、Safari、Edge等。

---

## 🎯 結語

五子棋是一個簡單易學但深度豐富的策略遊戲。通過不斷練習和學習，您可以：

- 提升邏輯思維能力
- 增強戰略規劃意識
- 享受智力競技的樂趣
- 與朋友分享遊戲時光

祝您遊戲愉快！🎉

---

*如有其他問題，請查看其他文檔文件或提交Issue。*