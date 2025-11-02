@echo off
REM Hyperliquid K-Line Chart - Windows 啟動腳本

echo ==================================================
echo 🚀 Hyperliquid K-Line Chart 啟動中...
echo ==================================================
echo.

REM 檢查是否在正確的目錄
if not exist "index.html" (
    echo ❌ 錯誤：找不到 index.html
    echo 請確保您在正確的目錄中運行此腳本
    pause
    exit /b 1
)

echo ✅ 找到項目文件
echo.

REM 設置端口
set PORT=9000

echo 📡 嘗試在端口 %PORT% 啟動服務器...
echo.

REM 嘗試使用 Python 3
python --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ 找到 Python
    echo.
    echo ==================================================
    echo 🎉 服務器已啟動！
    echo ==================================================
    echo.
    echo 📍 請在瀏覽器中訪問：
    echo.
    echo    🧪 測試頁面: http://localhost:%PORT%/test.html
    echo    🏠 主網站:   http://localhost:%PORT%/index.html
    echo.
    echo ==================================================
    echo.
    echo ⚠️  按 Ctrl+C 停止服務器
    echo.
    python -m http.server %PORT%
    goto :end
)

REM 嘗試使用 py 命令
py --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ 找到 Python
    echo.
    echo ==================================================
    echo 🎉 服務器已啟動！
    echo ==================================================
    echo.
    echo 📍 請在瀏覽器中訪問：
    echo.
    echo    🧪 測試頁面: http://localhost:%PORT%/test.html
    echo    🏠 主網站:   http://localhost:%PORT%/index.html
    echo.
    echo ==================================================
    echo.
    echo ⚠️  按 Ctrl+C 停止服務器
    echo.
    py -m http.server %PORT%
    goto :end
)

REM 找不到 Python
echo ❌ 錯誤：未找到 Python
echo.
echo 請安裝 Python:
echo   下載地址: https://www.python.org/downloads/
echo.
echo 安裝時請勾選 "Add Python to PATH"
echo.
pause
exit /b 1

:end
