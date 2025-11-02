// Binance API Configuration
const BINANCE_API_BASE = 'https://api.binance.com/api/v3';
const BINANCE_WS_BASE = 'wss://stream.binance.com:9443/ws';

// Current trading state
let currentSymbol = 'BTCUSDT';
let currentInterval = '4h';
let ws = null;
let klineData = [];

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

// Initialize chart
const chartElement = document.getElementById('chart');
const chart = LightweightCharts.createChart(chartElement, {
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

// Create candlestick series
const candlestickSeries = chart.addCandlestickSeries({
    upColor: '#00ff88',
    downColor: '#ff4444',
    borderUpColor: '#00ff88',
    borderDownColor: '#ff4444',
    wickUpColor: '#00ff88',
    wickDownColor: '#ff4444',
});

// Create volume series
const volumeSeries = chart.addHistogramSeries({
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

// Fetch historical kline data from Binance
async function fetchKlineData(symbol, interval, limit = 500) {
    try {
        const url = `${BINANCE_API_BASE}/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

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

        return { candleData, volumeData };
    } catch (error) {
        console.error('Error fetching kline data:', error);
        showError('無法獲取市場數據，請稍後重試');
        return null;
    }
}

// Fetch 24hr ticker data for price changes
async function fetch24hrTicker(symbol) {
    try {
        const url = `${BINANCE_API_BASE}/ticker/24hr?symbol=${symbol}`;
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching ticker data:', error);
        return null;
    }
}

// Initialize WebSocket for real-time updates
function initWebSocket(symbol, interval) {
    // Close existing connection if any
    if (ws) {
        ws.close();
    }

    const stream = `${symbol.toLowerCase()}@kline_${interval}`;
    ws = new WebSocket(`${BINANCE_WS_BASE}/${stream}`);

    ws.onopen = () => {
        console.log('WebSocket connected:', stream);
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
        candlestickSeries.update(candle);
        volumeSeries.update(volume);

        // Update last candle in our data array
        if (klineData.length > 0) {
            klineData[klineData.length - 1] = candle;
        }

        // Update stats in real-time
        updateStats(candle, volume);
    };

    ws.onerror = (error) => {
        console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
        console.log('WebSocket disconnected');
        // Attempt to reconnect after 5 seconds
        setTimeout(() => {
            if (ws.readyState === WebSocket.CLOSED) {
                console.log('Attempting to reconnect...');
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

    console.log(`Loading market: ${symbol} - ${interval}`);

    // Show loading state
    showLoading();

    // Fetch historical data
    const data = await fetchKlineData(symbol, interval);

    if (data) {
        klineData = data.candleData;

        // Set chart data
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
    }

    hideLoading();
}

// Update ticker information
function updateTickerInfo(ticker) {
    const priceChangeEl = document.getElementById('priceChange');
    const change = parseFloat(ticker.priceChangePercent).toFixed(2);
    priceChangeEl.textContent = (change >= 0 ? '+' : '') + change + '%';
    priceChangeEl.className = 'pair-change ' + (change >= 0 ? 'positive' : 'negative');
}

// Show loading state
function showLoading() {
    // You can add a loading spinner here
    console.log('Loading...');
}

// Hide loading state
function hideLoading() {
    console.log('Loading complete');
}

// Show error message
function showError(message) {
    console.error(message);
    alert(message);
}

// Update stats on crosshair move
chart.subscribeCrosshairMove((param) => {
    if (param.time) {
        const data = param.seriesData.get(candlestickSeries);
        const volumePoint = param.seriesData.get(volumeSeries);

        if (data) {
            const symbol = currentSymbol.replace('USDT', '');

            document.getElementById('open').textContent = '$' + data.open.toLocaleString('en-US', {minimumFractionDigits: 2});
            document.getElementById('high').textContent = '$' + data.high.toLocaleString('en-US', {minimumFractionDigits: 2});
            document.getElementById('low').textContent = '$' + data.low.toLocaleString('en-US', {minimumFractionDigits: 2});
            document.getElementById('close').textContent = '$' + data.close.toLocaleString('en-US', {minimumFractionDigits: 2});

            if (volumePoint) {
                document.getElementById('volume').textContent = volumePoint.value.toFixed(2) + ' ' + symbol;
            }
        }
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    chart.applyOptions({
        width: chartElement.clientWidth,
        height: chartElement.clientHeight
    });
});

// Timeframe selector functionality
document.querySelectorAll('.timeframe-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.timeframe-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const timeframe = btn.dataset.timeframe;
        const interval = intervalMap[timeframe];

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
        console.error('Error updating market list:', error);
    }
}

// Animate order book (still simulated, you can integrate real orderbook data)
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
console.log('Initializing Hyperliquid-style K-line chart with Binance API...');

// Load initial market data
loadMarket(currentSymbol, currentInterval);

// Initial market list update
updateMarketList();

// Initial orderbook animation
animateOrderBook();

console.log('Chart loaded successfully with live Binance data!');
