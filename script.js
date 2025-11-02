// Binance API Configuration
const BINANCE_API_BASE = 'https://api.binance.com/api/v3';
const BINANCE_WS_BASE = 'wss://stream.binance.com:9443/ws';

// Current trading state
let currentSymbol = 'BTCUSDT';
let currentInterval = '4h';
let ws = null;
let klineData = [];
let chart = null;
let candlestickSeries = null;
let volumeSeries = null;

// Interval mapping for Binance API
const intervalMap = {
    '1m': '1m',
    '5m': '5m',
    '15m': '15m',
    '1h': '1h',
    '4h': '4h',
    '1d': '1d',
    '1w': '1w'
};

// DOM elements
const loadingOverlay = document.getElementById('loading-overlay');
const errorOverlay = document.getElementById('error-overlay');
const chartElement = document.getElementById('chart');

// Show/Hide loading
function showLoading() {
    if (loadingOverlay) loadingOverlay.style.display = 'flex';
    if (errorOverlay) errorOverlay.style.display = 'none';
    console.log('📊 Loading...');
}

function hideLoading() {
    if (loadingOverlay) loadingOverlay.style.display = 'none';
    console.log('✅ Loading complete');
}

// Show error
function showError(message) {
    console.error('❌ Error:', message);
    if (errorOverlay) {
        const errorText = errorOverlay.querySelector('.error-text');
        if (errorText) errorText.textContent = message;
        errorOverlay.style.display = 'flex';
    }
    if (loadingOverlay) loadingOverlay.style.display = 'none';
}

// Initialize chart
function initChart() {
    console.log('🎨 Initializing chart...');

    // Check if chart element exists and has dimensions
    if (!chartElement) {
        console.error('❌ Chart element not found!');
        showError('圖表容器未找到，請刷新頁面');
        return false;
    }

    const width = chartElement.clientWidth || 800;
    const height = chartElement.clientHeight || 600;

    console.log(`📐 Chart dimensions: ${width}x${height}`);

    if (width === 0 || height === 0) {
        console.warn('⚠️ Chart element has zero dimensions, using defaults');
    }

    try {
        chart = LightweightCharts.createChart(chartElement, {
            width: width,
            height: height,
            layout: {
                background: { color: '#0f1419' },
                textColor: '#8b8e93',
            },
            grid: {
                vertLines: { color: '#1a1f26' },
                horzLines: { color: '#1a1f26' },
            },
            crosshair: {
                mode: LightweightCharts.CrosshairMode.Normal,
                vertLine: {
                    color: '#00ff88',
                    width: 1,
                    style: LightweightCharts.LineStyle.Dashed,
                },
                horzLine: {
                    color: '#00ff88',
                    width: 1,
                    style: LightweightCharts.LineStyle.Dashed,
                },
            },
            rightPriceScale: {
                borderColor: '#1a1f26',
            },
            timeScale: {
                borderColor: '#1a1f26',
                timeVisible: true,
                secondsVisible: false,
            },
        });

        if (!chart) {
            throw new Error('Failed to create chart instance');
        }

        console.log('✅ Chart instance created');

        // Create candlestick series
        candlestickSeries = chart.addCandlestickSeries({
            upColor: '#00ff88',
            downColor: '#ff4444',
            borderUpColor: '#00ff88',
            borderDownColor: '#ff4444',
            wickUpColor: '#00ff88',
            wickDownColor: '#ff4444',
        });

        if (!candlestickSeries) {
            throw new Error('Failed to create candlestick series');
        }

        console.log('✅ Candlestick series created');

        // Create volume series
        volumeSeries = chart.addHistogramSeries({
            color: '#26a69a',
            priceFormat: {
                type: 'volume',
            },
            priceScaleId: '',
            scaleMargins: {
                top: 0.8,
                bottom: 0,
            },
        });

        if (!volumeSeries) {
            throw new Error('Failed to create volume series');
        }

        console.log('✅ Volume series created');

        // Update stats on crosshair move
        chart.subscribeCrosshairMove((param) => {
            if (param.time) {
                const data = param.seriesData.get(candlestickSeries);
                const volumePoint = param.seriesData.get(volumeSeries);

                if (data) {
                    const symbol = currentSymbol.replace('USDT', '');
                    updateStatsDisplay(data, volumePoint, symbol);
                }
            }
        });

        console.log('✅ Chart initialized successfully');
        return true;
    } catch (error) {
        console.error('❌ Error initializing chart:', error);
        showError(`圖表初始化失敗: ${error.message}`);
        return false;
    }
}

// Update stats display
function updateStatsDisplay(candle, volume, symbol) {
    document.getElementById('open').textContent = '$' + candle.open.toLocaleString('en-US', {minimumFractionDigits: 2});
    document.getElementById('high').textContent = '$' + candle.high.toLocaleString('en-US', {minimumFractionDigits: 2});
    document.getElementById('low').textContent = '$' + candle.low.toLocaleString('en-US', {minimumFractionDigits: 2});
    document.getElementById('close').textContent = '$' + candle.close.toLocaleString('en-US', {minimumFractionDigits: 2});

    if (volume) {
        document.getElementById('volume').textContent = volume.value.toFixed(2) + ' ' + symbol;
    }
}

// Fetch historical kline data from Binance
async function fetchKlineData(symbol, interval, limit = 500) {
    try {
        const url = `${BINANCE_API_BASE}/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`;
        console.log(`📡 Fetching data from: ${url}`);

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(`✅ Received ${data.length} candles`);

        // Transform Binance data to chart format
        const candleData = data.map(candle => ({
            time: Math.floor(candle[0] / 1000), // Convert to seconds
            open: parseFloat(candle[1]),
            high: parseFloat(candle[2]),
            low: parseFloat(candle[3]),
            close: parseFloat(candle[4])
        }));

        const volumeData = data.map(candle => ({
            time: Math.floor(candle[0] / 1000),
            value: parseFloat(candle[5]),
            color: parseFloat(candle[4]) >= parseFloat(candle[1]) ?
                'rgba(0, 255, 136, 0.5)' : 'rgba(255, 68, 68, 0.5)'
        }));

        console.log('📊 First candle:', candleData[0]);
        console.log('📊 Last candle:', candleData[candleData.length - 1]);

        return { candleData, volumeData };
    } catch (error) {
        console.error('❌ Error fetching kline data:', error);
        throw new Error(`無法從 Binance 獲取數據: ${error.message}\n\n請確保:\n1. 您的網絡連接正常\n2. 使用本地服務器運行 (python -m http.server)\n3. 瀏覽器允許訪問 Binance API`);
    }
}

// Fetch 24hr ticker data for price changes
async function fetch24hrTicker(symbol) {
    try {
        const url = `${BINANCE_API_BASE}/ticker/24hr?symbol=${symbol}`;
        const response = await fetch(url);

        if (!response.ok) {
            console.warn(`⚠️ Failed to fetch ticker for ${symbol}`);
            return null;
        }

        const data = await response.json();
        console.log(`💰 Ticker for ${symbol}:`, data.lastPrice);
        return data;
    } catch (error) {
        console.error('❌ Error fetching ticker data:', error);
        return null;
    }
}

// Initialize WebSocket for real-time updates
function initWebSocket(symbol, interval) {
    // Close existing connection if any
    if (ws) {
        console.log('🔌 Closing existing WebSocket...');
        ws.close();
    }

    const stream = `${symbol.toLowerCase()}@kline_${interval}`;
    const wsUrl = `${BINANCE_WS_BASE}/${stream}`;
    console.log(`🔌 Connecting to WebSocket: ${wsUrl}`);

    ws = new WebSocket(wsUrl);

    ws.onopen = () => {
        console.log('✅ WebSocket connected:', stream);
    };

    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        const kline = data.k;

        // Update the last candle
        const candle = {
            time: Math.floor(kline.t / 1000),
            open: parseFloat(kline.o),
            high: parseFloat(kline.h),
            low: parseFloat(kline.l),
            close: parseFloat(kline.c)
        };

        const volume = {
            time: Math.floor(kline.t / 1000),
            value: parseFloat(kline.v),
            color: parseFloat(kline.c) >= parseFloat(kline.o) ?
                'rgba(0, 255, 136, 0.5)' : 'rgba(255, 68, 68, 0.5)'
        };

        // Update chart
        if (candlestickSeries && volumeSeries) {
            candlestickSeries.update(candle);
            volumeSeries.update(volume);

            // Update last candle in our data array
            if (klineData.length > 0) {
                klineData[klineData.length - 1] = candle;
            }

            // Update stats in real-time
            updateStats(candle, volume);
        }
    };

    ws.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
    };

    ws.onclose = () => {
        console.log('🔌 WebSocket disconnected');
        // Attempt to reconnect after 5 seconds
        setTimeout(() => {
            if (ws && ws.readyState === WebSocket.CLOSED) {
                console.log('🔄 Attempting to reconnect...');
                initWebSocket(symbol, interval);
            }
        }, 5000);
    };
}

// Update stats display
function updateStats(candle, volume) {
    const symbol = currentSymbol.replace('USDT', '');

    document.getElementById('open').textContent = '$' + candle.open.toLocaleString('en-US', {minimumFractionDigits: 2});
    document.getElementById('high').textContent = '$' + candle.high.toLocaleString('en-US', {minimumFractionDigits: 2});
    document.getElementById('low').textContent = '$' + candle.low.toLocaleString('en-US', {minimumFractionDigits: 2});
    document.getElementById('close').textContent = '$' + candle.close.toLocaleString('en-US', {minimumFractionDigits: 2});

    if (volume) {
        document.getElementById('volume').textContent = volume.value.toFixed(2) + ' ' + symbol;
    }

    // Update header price
    document.getElementById('currentPrice').textContent = '$' + candle.close.toLocaleString('en-US', {minimumFractionDigits: 2});

    // Calculate change
    if (klineData.length > 0) {
        const firstCandle = klineData[0];
        const change = ((candle.close - firstCandle.close) / firstCandle.close * 100).toFixed(2);
        const priceChangeEl = document.getElementById('priceChange');
        priceChangeEl.textContent = (change >= 0 ? '+' : '') + change + '%';
        priceChangeEl.className = 'pair-change ' + (change >= 0 ? 'positive' : 'negative');
    }
}

// Load market data
async function loadMarket(symbol, interval) {
    currentSymbol = symbol;
    currentInterval = interval;

    console.log(`\n🚀 Loading market: ${symbol} - ${interval}`);

    // Show loading state
    showLoading();

    try {
        // Check if chart is initialized
        if (!chart || !candlestickSeries || !volumeSeries) {
            console.error('❌ Chart not properly initialized!');
            console.log('Chart:', chart);
            console.log('Candlestick Series:', candlestickSeries);
            console.log('Volume Series:', volumeSeries);
            throw new Error('圖表未正確初始化，請刷新頁面重試');
        }

        // Fetch historical data
        const data = await fetchKlineData(symbol, interval);

        if (data && data.candleData && data.candleData.length > 0) {
            klineData = data.candleData;

            // Set chart data
            console.log('📈 Setting chart data...');
            console.log(`📊 Data points: ${data.candleData.length} candles, ${data.volumeData.length} volumes`);

            candlestickSeries.setData(data.candleData);
            volumeSeries.setData(data.volumeData);

            // Fit content
            chart.timeScale().fitContent();

            // Update initial stats
            const lastCandle = data.candleData[data.candleData.length - 1];
            const lastVolume = data.volumeData[data.volumeData.length - 1];
            updateStats(lastCandle, lastVolume);

            // Initialize WebSocket for real-time updates
            initWebSocket(symbol, interval);

            // Fetch and update 24hr ticker
            const ticker = await fetch24hrTicker(symbol);
            if (ticker) {
                updateTickerInfo(ticker);
            }

            hideLoading();
            console.log('✅ Market loaded successfully\n');
        } else {
            throw new Error('No data received from API');
        }
    } catch (error) {
        console.error('❌ Failed to load market:', error);
        showError(error.message);
    }
}

// Update ticker information
function updateTickerInfo(ticker) {
    const priceChangeEl = document.getElementById('priceChange');
    const change = parseFloat(ticker.priceChangePercent).toFixed(2);
    priceChangeEl.textContent = (change >= 0 ? '+' : '') + change + '%';
    priceChangeEl.className = 'pair-change ' + (change >= 0 ? 'positive' : 'negative');
}

// Handle window resize
window.addEventListener('resize', () => {
    if (chart) {
        chart.applyOptions({
            width: chartElement.clientWidth,
            height: chartElement.clientHeight
        });
    }
});

// Timeframe selector functionality
document.querySelectorAll('.timeframe-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.timeframe-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const timeframe = btn.dataset.timeframe;
        const interval = intervalMap[timeframe];

        console.log(`⏱️ Changing timeframe to ${timeframe}`);
        loadMarket(currentSymbol, interval);
    });
});

// Market item click functionality
document.querySelectorAll('.market-item').forEach(item => {
    item.addEventListener('click', () => {
        document.querySelectorAll('.market-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');

        const marketName = item.querySelector('.market-name').textContent;
        document.querySelector('.pair-name').textContent = marketName;

        // Convert display name to Binance symbol
        const symbol = marketName.replace('/', '') + 'T'; // BTC/USD -> BTCUSDT
        console.log(`💱 Switching to ${symbol}`);
        loadMarket(symbol, currentInterval);
    });
});

// Fetch and update all market tickers
async function updateMarketList() {
    try {
        const symbols = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT'];

        for (const symbol of symbols) {
            const ticker = await fetch24hrTicker(symbol);
            if (ticker) {
                const displaySymbol = symbol.replace('USDT', '/USD');
                const marketItem = Array.from(document.querySelectorAll('.market-item')).find(
                    item => item.querySelector('.market-name').textContent === displaySymbol
                );

                if (marketItem) {
                    const priceEl = marketItem.querySelector('.market-price');
                    const changeEl = marketItem.querySelector('.market-change');

                    priceEl.textContent = '$' + parseFloat(ticker.lastPrice).toLocaleString('en-US', {minimumFractionDigits: 2});

                    const change = parseFloat(ticker.priceChangePercent).toFixed(2);
                    changeEl.textContent = (change >= 0 ? '+' : '') + change + '%';
                    changeEl.className = 'market-change ' + (change >= 0 ? 'positive' : 'negative');
                }
            }
        }
    } catch (error) {
        console.error('❌ Error updating market list:', error);
    }
}

// Animate order book (still simulated)
function animateOrderBook() {
    const asks = document.querySelectorAll('.asks .order-row');
    const bids = document.querySelectorAll('.bids .order-row');

    asks.forEach(row => {
        const depth = Math.random() * 80 + 20;
        row.style.setProperty('--depth', depth + '%');
    });

    bids.forEach(row => {
        const depth = Math.random() * 80 + 20;
        row.style.setProperty('--depth', depth + '%');
    });
}

// Update orderbook periodically
setInterval(() => {
    animateOrderBook();
}, 2000);

// Update market list periodically
setInterval(() => {
    updateMarketList();
}, 10000); // Update every 10 seconds

// Initial load
console.log('='.repeat(50));
console.log('🚀 Hyperliquid-style K-line Chart');
console.log('📊 Initializing with Binance API...');
console.log('='.repeat(50));

// Wait for DOM to be fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
} else {
    initialize();
}

function initialize() {
    console.log('🎬 Starting initialization...');

    // Initialize chart
    const chartInitialized = initChart();

    if (!chartInitialized) {
        console.error('❌ Chart initialization failed, cannot continue');
        showError('圖表初始化失敗，請刷新頁面重試');
        return;
    }

    // Small delay to ensure chart is ready
    setTimeout(() => {
        // Load initial market data
        loadMarket(currentSymbol, currentInterval);

        // Initial market list update
        updateMarketList();

        // Initial orderbook animation
        animateOrderBook();

        console.log('✅ Initialization complete!');
    }, 100);
}
