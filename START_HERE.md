# 🚀 本地啟動指南（從 0 到 1）

## 📋 前置要求

確保您的電腦已安裝 Python（大多數系統都預裝了）

---

## 🎯 第一步：打開終端機/命令提示字元

### Windows 用戶：
1. 按 `Win + R` 鍵
2. 輸入 `cmd` 或 `powershell`
3. 按 Enter

### Mac 用戶：
1. 按 `Command + Space`
2. 輸入 `Terminal`
3. 按 Enter

### Linux 用戶：
1. 按 `Ctrl + Alt + T`

---

## 🎯 第二步：進入項目目錄

在終端機中輸入以下命令：

```bash
cd /home/user/test
```

按 Enter 鍵執行

**確認是否成功：**
再輸入以下命令查看文件：
```bash
ls
```

您應該看到：
- index.html
- script.js
- style.css
- test.html
- README.md

---

## 🎯 第三步：啟動本地服務器

### 方法 A：使用 Python 3（推薦）

在終端機輸入：
```bash
python3 -m http.server 9000
```

### 方法 B：使用 Python 2

如果上面的命令不行，試試：
```bash
python -m SimpleHTTPServer 9000
```

### 方法 C：使用 Node.js

如果安裝了 Node.js：
```bash
npx http-server -p 9000
```

---

## ✅ 成功的標誌

當您看到類似以下的訊息時，表示成功了：

```
Serving HTTP on 0.0.0.0 port 9000 (http://0.0.0.0:9000/) ...
```

或

```
Starting up http-server, serving ./
Available on:
  http://127.0.0.1:9000
```

**⚠️ 重要：不要關閉這個終端機視窗！保持它運行！**

---

## 🎯 第四步：打開瀏覽器

### 測試 API 連接（建議先做這個）

1. 打開瀏覽器（Chrome、Firefox、Edge 都可以）
2. 在地址欄輸入：
   ```
   http://localhost:9000/test.html
   ```
3. 按 Enter

### 您會看到：
- 一個黑色背景的測試頁面
- 三個測試按鈕

### 點擊按鈕測試：
1. 點擊「測試 K 線 API」
2. 點擊「測試 Ticker API」
3. 點擊「測試 WebSocket」

**如果都顯示綠色的 ✅ 成功，說明 API 連接正常！**

---

## 🎯 第五步：打開主網站

在瀏覽器地址欄輸入：
```
http://localhost:9000/index.html
```

或直接輸入：
```
http://localhost:9000
```

---

## 🎨 您應該看到：

1. **頂部**：
   - HYPERLIQUID 標誌（綠色）
   - BTC/USD 價格
   - Connect Wallet 按鈕

2. **左側**：
   - Markets 列表
   - BTC/USD, ETH/USD, SOL/USD

3. **中間**：
   - K 線圖表（黑色背景，綠色/紅色蠟燭）
   - 時間週期按鈕（1m, 5m, 15m, 1h, 4h, 1D, 1W）

4. **右側**：
   - Order Book（訂單簿）

5. **底部**：
   - OHLC 數據（開高低收）
   - 成交量

---

## 🔍 調試：如何查看是否有錯誤

### 打開瀏覽器開發者工具：

**Windows/Linux：**
- 按 `F12` 鍵
- 或按 `Ctrl + Shift + I`

**Mac：**
- 按 `Command + Option + I`

### 查看 Console（控制台）：

1. 在開發者工具中點擊「Console」標籤
2. 您應該看到：

```
==================================================
🚀 Hyperliquid-style K-line Chart
📊 Initializing with Binance API...
==================================================
🎬 Starting initialization...
🎨 Initializing chart...
✅ Chart initialized
🚀 Loading market: BTCUSDT - 4h
📊 Loading...
📡 Fetching data from: https://api.binance.com/api/v3/klines...
✅ Received 500 candles
```

**如果看到 ✅ 和綠色文字 = 成功！**
**如果看到 ❌ 和紅色文字 = 有錯誤**

---

## ❌ 常見問題解決

### 問題 1：顯示 "Loading market data..." 一直轉圈

**可能原因：**
- 網絡連接問題
- Binance API 被防火牆阻擋
- CORS 錯誤

**解決方法：**
1. 確保您使用本地服務器（而不是直接打開 HTML 文件）
2. 檢查控制台是否有錯誤訊息
3. 嘗試先打開 test.html 測試 API 連接

### 問題 2：Python 命令找不到

**Windows 用戶：**
嘗試：
```bash
py -m http.server 9000
```

**或下載安裝 Python：**
https://www.python.org/downloads/

### 問題 3：端口 9000 已被占用

錯誤訊息：
```
OSError: [Errno 48] Address already in use
```

**解決方法：**
換一個端口，例如 9001：
```bash
python3 -m http.server 9001
```

然後訪問：`http://localhost:9001`

### 問題 4：圖表不顯示數據

**檢查清單：**
1. ✅ 使用本地服務器啟動（不是直接打開 HTML）
2. ✅ 網絡連接正常
3. ✅ 在 test.html 測試 API 都成功
4. ✅ 控制台沒有紅色錯誤

**如果都滿足但還是不顯示：**
- 按 `Ctrl + F5`（或 `Command + Shift + R`）強制刷新頁面
- 清除瀏覽器緩存

---

## 🎉 成功標誌

當您看到：
- ✅ K 線圖正在顯示綠色和紅色的蠟燭
- ✅ 價格數據在更新
- ✅ 控制台顯示 "✅ Market loaded successfully"
- ✅ 可以點擊不同的時間週期切換

**恭喜！您已經成功運行了 Hyperliquid 風格的 K 線圖網站！** 🎊

---

## 🛑 如何停止服務器

回到終端機視窗，按：
- **Windows/Linux：** `Ctrl + C`
- **Mac：** `Command + C`

---

## 📞 需要幫助？

如果遇到問題：
1. 先打開 `test.html` 測試 API
2. 查看瀏覽器控制台的錯誤訊息
3. 截圖錯誤訊息並尋求幫助

---

## 🔗 快速參考

| 操作 | 命令/地址 |
|------|-----------|
| 啟動服務器 | `python3 -m http.server 9000` |
| 測試頁面 | http://localhost:9000/test.html |
| 主網站 | http://localhost:9000/index.html |
| 停止服務器 | `Ctrl + C` |
| 打開控制台 | `F12` |

---

**祝您使用愉快！** 🚀
