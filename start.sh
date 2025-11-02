#!/bin/bash

# Hyperliquid K-Line Chart - 啟動腳本

echo "=================================================="
echo "🚀 Hyperliquid K-Line Chart 啟動中..."
echo "=================================================="
echo ""

# 檢查是否在正確的目錄
if [ ! -f "index.html" ]; then
    echo "❌ 錯誤：找不到 index.html"
    echo "請確保您在正確的目錄中運行此腳本"
    exit 1
fi

echo "✅ 找到項目文件"
echo ""

# 選擇端口
PORT=9000

echo "📡 嘗試在端口 $PORT 啟動服務器..."
echo ""

# 檢查 Python 版本並啟動服務器
if command -v python3 &> /dev/null; then
    echo "✅ 使用 Python 3"
    echo ""
    echo "=================================================="
    echo "🎉 服務器已啟動！"
    echo "=================================================="
    echo ""
    echo "📍 請在瀏覽器中訪問："
    echo ""
    echo "   🧪 測試頁面: http://localhost:$PORT/test.html"
    echo "   🏠 主網站:   http://localhost:$PORT/index.html"
    echo ""
    echo "=================================================="
    echo ""
    echo "⚠️  按 Ctrl+C 停止服務器"
    echo ""
    python3 -m http.server $PORT
elif command -v python &> /dev/null; then
    echo "✅ 使用 Python 2"
    echo ""
    echo "=================================================="
    echo "🎉 服務器已啟動！"
    echo "=================================================="
    echo ""
    echo "📍 請在瀏覽器中訪問："
    echo ""
    echo "   🧪 測試頁面: http://localhost:$PORT/test.html"
    echo "   🏠 主網站:   http://localhost:$PORT/index.html"
    echo ""
    echo "=================================================="
    echo ""
    echo "⚠️  按 Ctrl+C 停止服務器"
    echo ""
    python -m SimpleHTTPServer $PORT
else
    echo "❌ 錯誤：未找到 Python"
    echo ""
    echo "請安裝 Python："
    echo "  - Windows: https://www.python.org/downloads/"
    echo "  - Mac: brew install python3"
    echo "  - Linux: sudo apt-get install python3"
    exit 1
fi
