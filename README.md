# Hyperliquid Style K-Line Chart

一個完全模仿 Hyperliquid 風格的加密貨幣 K 線圖網站。

## 功能特點

- ✅ **完整的 K 線圖**：使用 TradingView Lightweight Charts 實現專業級 K 線圖
- ✅ **Hyperliquid 風格設計**：深色主題，綠色/紅色配色方案
- ✅ **實時數據模擬**：模擬實時價格更新和訂單簿動態
- ✅ **多時間週期**：支持 1m, 5m, 15m, 1h, 4h, 1D, 1W 等多個時間週期
- ✅ **交互式圖表**：懸停顯示詳細的 OHLC 數據和交易量
- ✅ **訂單簿視圖**：實時顯示買賣盤深度
- ✅ **市場列表**：快速切換不同交易對
- ✅ **響應式設計**：支持桌面和移動端

## 技術棧

- **HTML5**：結構化網頁內容
- **CSS3**：Hyperliquid 風格的深色主題設計
- **JavaScript (ES6+)**：動態交互和數據處理
- **Lightweight Charts**：TradingView 的專業圖表庫

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

### K 線圖
- 顯示完整的蠟燭圖（開盤價、最高價、最低價、收盤價）
- 包含交易量柱狀圖
- 支持十字線跟蹤，實時顯示數據
- 平滑的縮放和平移操作

### 時間週期切換
點擊圖表上方的時間週期按鈕可切換不同的 K 線週期：
- 1m, 5m, 15m（分鐘線）
- 1h, 4h（小時線）
- 1D（日線）
- 1W（週線）

### 訂單簿
右側面板顯示：
- 賣盤深度（紅色）
- 當前價格和價差
- 買盤深度（綠色）
- 實時動態更新

### 市場切換
左側面板可以快速切換不同的交易對：
- BTC/USD
- ETH/USD
- SOL/USD

## 自定義數據

如果您想使用真實的 API 數據，可以修改 `script.js` 文件中的數據生成邏輯：

```javascript
// 替換 generateKlineData() 函數
async function fetchKlineData(symbol, interval) {
    // 從您的 API 獲取數據
    const response = await fetch(`YOUR_API_ENDPOINT`);
    const data = await response.json();
    return data;
}
```

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

## 未來計劃

- [ ] 集成真實的加密貨幣 API
- [ ] 添加更多技術指標（MA, MACD, RSI 等）
- [ ] 實現真實的訂單簿連接
- [ ] 添加交易功能
- [ ] 支持更多交易對
- [ ] 添加價格警報功能

## 許可證

MIT License

## 致謝

- [TradingView Lightweight Charts](https://github.com/tradingview/lightweight-charts) - 強大的圖表庫
- [Hyperliquid](https://hyperliquid.xyz/) - UI 設計靈感來源
