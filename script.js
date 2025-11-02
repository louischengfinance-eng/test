// Generate sample K-line data
function generateKlineData(days = 100) {
    const data = [];
    const now = Math.floor(Date.now() / 1000);
    const interval = 4 * 60 * 60; // 4 hours in seconds
    let basePrice = 43000;

    for (let i = days; i >= 0; i--) {
        const time = now - (i * interval);

        // Generate realistic price movement
        const volatility = 500;
        const trend = Math.sin(i / 10) * 200;
        const random = (Math.random() - 0.5) * volatility;

        basePrice += trend + random;

        const open = basePrice + (Math.random() - 0.5) * 100;
        const close = basePrice + (Math.random() - 0.5) * 100;
        const high = Math.max(open, close) + Math.random() * 150;
        const low = Math.min(open, close) - Math.random() * 150;

        data.push({
            time: time,
            open: parseFloat(open.toFixed(2)),
            high: parseFloat(high.toFixed(2)),
            low: parseFloat(low.toFixed(2)),
            close: parseFloat(close.toFixed(2))
        });
    }

    return data;
}

// Generate volume data
function generateVolumeData(klineData) {
    return klineData.map(candle => ({
        time: candle.time,
        value: Math.random() * 1000 + 200,
        color: candle.close >= candle.open ? 'rgba(0, 255, 136, 0.5)' : 'rgba(255, 68, 68, 0.5)'
    }));
}

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

// Generate and set data
const klineData = generateKlineData(100);
const volumeData = generateVolumeData(klineData);

candlestickSeries.setData(klineData);
volumeSeries.setData(volumeData);

// Fit content
chart.timeScale().fitContent();

// Update stats on crosshair move
chart.subscribeCrosshairMove((param) => {
    if (param.time) {
        const data = param.seriesData.get(candlestickSeries);
        const volumePoint = param.seriesData.get(volumeSeries);

        if (data) {
            document.getElementById('open').textContent = '$' + data.open.toLocaleString('en-US', {minimumFractionDigits: 2});
            document.getElementById('high').textContent = '$' + data.high.toLocaleString('en-US', {minimumFractionDigits: 2});
            document.getElementById('low').textContent = '$' + data.low.toLocaleString('en-US', {minimumFractionDigits: 2});
            document.getElementById('close').textContent = '$' + data.close.toLocaleString('en-US', {minimumFractionDigits: 2});

            if (volumePoint) {
                document.getElementById('volume').textContent = volumePoint.value.toFixed(2) + ' BTC';
            }

            // Update header price
            const currentPrice = document.getElementById('currentPrice');
            const priceChange = document.getElementById('priceChange');

            currentPrice.textContent = '$' + data.close.toLocaleString('en-US', {minimumFractionDigits: 2});

            const change = ((data.close - data.open) / data.open * 100).toFixed(2);
            priceChange.textContent = (change >= 0 ? '+' : '') + change + '%';
            priceChange.className = 'pair-change ' + (change >= 0 ? 'positive' : 'negative');
        }
    }
});

// Set initial stats from last candle
const lastCandle = klineData[klineData.length - 1];
const lastVolume = volumeData[volumeData.length - 1];

document.getElementById('open').textContent = '$' + lastCandle.open.toLocaleString('en-US', {minimumFractionDigits: 2});
document.getElementById('high').textContent = '$' + lastCandle.high.toLocaleString('en-US', {minimumFractionDigits: 2});
document.getElementById('low').textContent = '$' + lastCandle.low.toLocaleString('en-US', {minimumFractionDigits: 2});
document.getElementById('close').textContent = '$' + lastCandle.close.toLocaleString('en-US', {minimumFractionDigits: 2});
document.getElementById('volume').textContent = lastVolume.value.toFixed(2) + ' BTC';
document.getElementById('currentPrice').textContent = '$' + lastCandle.close.toLocaleString('en-US', {minimumFractionDigits: 2});

const initialChange = ((lastCandle.close - klineData[0].close) / klineData[0].close * 100).toFixed(2);
const priceChangeElement = document.getElementById('priceChange');
priceChangeElement.textContent = (initialChange >= 0 ? '+' : '') + initialChange + '%';
priceChangeElement.className = 'pair-change ' + (initialChange >= 0 ? 'positive' : 'negative');

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

        // In a real app, you would fetch new data for the selected timeframe
        const timeframe = btn.dataset.timeframe;
        console.log('Selected timeframe:', timeframe);

        // Regenerate data with different parameters based on timeframe
        let days;
        switch(timeframe) {
            case '1m': days = 200; break;
            case '5m': days = 150; break;
            case '15m': days = 120; break;
            case '1h': days = 100; break;
            case '4h': days = 80; break;
            case '1d': days = 60; break;
            case '1w': days = 40; break;
            default: days = 100;
        }

        const newKlineData = generateKlineData(days);
        const newVolumeData = generateVolumeData(newKlineData);

        candlestickSeries.setData(newKlineData);
        volumeSeries.setData(newVolumeData);

        chart.timeScale().fitContent();
    });
});

// Market item click functionality
document.querySelectorAll('.market-item').forEach(item => {
    item.addEventListener('click', () => {
        document.querySelectorAll('.market-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');

        const marketName = item.querySelector('.market-name').textContent;
        document.querySelector('.pair-name').textContent = marketName;

        // In a real app, you would fetch new data for the selected market
        console.log('Selected market:', marketName);
    });
});

// Simulate real-time updates
setInterval(() => {
    const lastCandle = klineData[klineData.length - 1];
    const newPrice = lastCandle.close + (Math.random() - 0.5) * 50;

    // Update last candle
    const updatedCandle = {
        ...lastCandle,
        close: newPrice,
        high: Math.max(lastCandle.high, newPrice),
        low: Math.min(lastCandle.low, newPrice)
    };

    klineData[klineData.length - 1] = updatedCandle;
    candlestickSeries.update(updatedCandle);

    // Update header
    document.getElementById('currentPrice').textContent = '$' + newPrice.toLocaleString('en-US', {minimumFractionDigits: 2});

    const change = ((newPrice - klineData[0].close) / klineData[0].close * 100).toFixed(2);
    const priceChangeEl = document.getElementById('priceChange');
    priceChangeEl.textContent = (change >= 0 ? '+' : '') + change + '%';
    priceChangeEl.className = 'pair-change ' + (change >= 0 ? 'positive' : 'negative');

    // Animate orderbook (simulate updates)
    animateOrderBook();
}, 2000);

// Animate order book
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

// Initial orderbook animation
animateOrderBook();

console.log('Hyperliquid-style K-line chart loaded successfully!');
