# Hyperliquid Style K-Line Chart

一個完全模仿 Hyperliquid 風格的加密貨幣 K 線圖網站。

## 功能特點

- ✅ **完整的 K 線圖**：使用 TradingView Lightweight Charts 實現專業級 K 線圖
- ✅ **Hyperliquid 風格設計**：深色主題，綠色/紅色配色方案
- ✅ **Binance API 集成**：自動從 Binance 獲取真實的市場數據
- ✅ **WebSocket 實時更新**：通過 WebSocket 實時更新價格和 K 線數據
- ✅ **多時間週期**：支持 1m, 5m, 15m, 1h, 4h, 1D, 1W 等多個時間週期
- ✅ **交互式圖表**：懸停顯示詳細的 OHLC 數據和交易量
- ✅ **24小時價格變動**：實時顯示 24 小時價格變化百分比
- ✅ **市場列表**：快速切換不同交易對（BTC, ETH, SOL）
- ✅ **響應式設計**：支持桌面和移動端
- ✅ **自動重連**：WebSocket 斷線自動重連機制

## 技術棧

- **HTML5**：結構化網頁內容
- **CSS3**：Hyperliquid 風格的深色主題設計
- **JavaScript (ES6+)**：動態交互和數據處理
- **Lightweight Charts**：TradingView 的專業圖表庫
- **Binance API**：獲取真實的加密貨幣市場數據
- **WebSocket**：實時價格和 K 線數據更新

## 快速開始

### 方法 1：直接打開

1. 克隆或下載此項目
2. 用瀏覽器打開 `index.html` 文件

### 方法 2：使用本地服務器（推薦）

```bash
# 使用 Python
python -m http.server 8000

# 或使用 Node.js
npx http-server

# 或使用 PHP
php -S localhost:8000
```

然後在瀏覽器中訪問 `http://localhost:8000`

## 項目結構

```
.
├── index.html      # 主 HTML 文件
├── style.css       # Hyperliquid 風格樣式
├── script.js       # K 線圖邏輯和交互
└── README.md       # 項目說明文檔
```

## 功能說明

### K 線圖（實時數據）
- 顯示完整的蠟燭圖（開盤價、最高價、最低價、收盤價）
- 包含交易量柱狀圖
- 支持十字線跟蹤，實時顯示數據
- 平滑的縮放和平移操作
- **從 Binance API 自動獲取真實市場數據**
- **WebSocket 實時更新當前 K 線**

### 時間週期切換
點擊圖表上方的時間週期按鈕可切換不同的 K 線週期：
- 1m, 5m, 15m（分鐘線）
- 1h, 4h（小時線）
- 1D（日線）
- 1W（週線）

每次切換週期都會自動從 Binance 獲取對應的歷史數據（最多 500 根 K 線）。

### 市場切換
左側面板可以快速切換不同的交易對：
- **BTC/USD**（BTCUSDT）
- **ETH/USD**（ETHUSDT）
- **SOL/USD**（SOLUSDT）

每個市場都顯示：
- 當前價格
- 24 小時價格變化百分比
- 自動每 10 秒更新一次

### 實時更新機制

1. **歷史數據**：頁面加載時從 Binance REST API 獲取歷史 K 線
2. **實時數據**：通過 WebSocket 訂閱實時 K 線更新
3. **自動重連**：WebSocket 斷線後 5 秒自動重連
4. **價格追蹤**：實時顯示當前價格和 24 小時漲跌幅

## API 端點說明

本項目使用 Binance 公開 API（無需 API Key）：

- **REST API**: `https://api.binance.com/api/v3`
  - 獲取歷史 K 線數據
  - 獲取 24 小時價格統計

- **WebSocket**: `wss://stream.binance.com:9443/ws`
  - 實時 K 線數據流
  - 格式：`{symbol}@kline_{interval}`

## 顏色配置

主要顏色變量（可在 `style.css` 中修改）：

- 主背景：`#0a0e13`
- 次背景：`#0f1419`
- 上漲顏色：`#00ff88`（綠色）
- 下跌顏色：`#ff4444`（紅色）
- 邊框顏色：`#1a1f26`
- 文字顏色：`#e0e3e7`

## 瀏覽器支持

- Chrome / Edge（推薦）
- Firefox
- Safari
- 其他現代瀏覽器

## 注意事項

1. **CORS 問題**：如果直接用 `file://` 協議打開 HTML，可能會遇到 CORS 錯誤。建議使用本地服務器運行。

2. **網絡連接**：需要穩定的網絡連接來訪問 Binance API。

3. **WebSocket 連接**：WebSocket 會在斷線後自動重連，請確保防火牆允許 WebSocket 連接。

4. **API 限制**：
   - Binance API 有請求頻率限制
   - 本項目使用公開 API，無需註冊或 API Key
   - WebSocket 連接數有限制，建議不要同時打開過多窗口

5. **數據延遲**：實時數據可能有幾秒的延遲，這是正常現象。

## 未來增強計劃

- [x] ~~集成真實的加密貨幣 API~~ ✅ 已完成
- [x] ~~WebSocket 實時數據更新~~ ✅ 已完成
- [ ] 添加更多技術指標（MA, MACD, RSI, Bollinger Bands 等）
- [ ] 集成真實的訂單簿數據（Binance Orderbook API）
- [ ] 支持更多交易對（可自定義添加）
- [ ] 添加價格警報功能
- [ ] 添加成交記錄（Trades）顯示
- [ ] 支持多幣種切換（USDT, BUSD, BTC 等）
- [ ] 添加深色/淺色主題切換
- [ ] 圖表繪圖工具（趨勢線、水平線等）

## 許可證

MIT License

## 致謝

- [TradingView Lightweight Charts](https://github.com/tradingview/lightweight-charts) - 強大的圖表庫
- [Hyperliquid](https://hyperliquid.xyz/) - UI 設計靈感來源
