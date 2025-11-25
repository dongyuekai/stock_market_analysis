'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import KlineChart from '@/components/KlineChart';
import { StockQuote, KlineData, OrderBook } from '@/types/stock';

export default function StockDetailPage() {
  const params = useParams();
  const code = params.code as string;

  const [quote, setQuote] = useState<StockQuote | null>(null);
  const [klineData, setKlineData] = useState<KlineData[]>([]);
  const [orderBook, setOrderBook] = useState<OrderBook | null>(null);
  const [period, setPeriod] = useState<string>('day');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (code) {
      fetchStockData();
      const interval = setInterval(fetchStockData, 10000); // 每10秒刷新
      return () => clearInterval(interval);
    }
  }, [code, period]);

  const fetchStockData = async () => {
    try {
      setLoading(true);
      const [quoteRes, klineRes] = await Promise.all([
        fetch(`/api/a-share/quote/${code}`).then(r => r.json()),
        fetch(`/api/a-share/kline/${code}?period=${period}&count=100`).then(r => r.json()),
      ]);

      if (quoteRes.success) {
        setQuote(quoteRes.data);
        setOrderBook(quoteRes.data.orderBook);
      }

      if (klineRes.success) {
        setKlineData(klineRes.data);
      }
    } catch (error) {
      console.error('Error fetching stock data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !quote) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12 text-gray-500">加载中...</div>
      </div>
    );
  }

  // 安全处理可能为null的数值
  const currentPrice = quote?.currentPrice ?? 0;
  const change = quote?.change ?? 0;
  const changePercent = quote?.changePercent ?? 0;
  const open = quote?.open ?? 0;
  const high = quote?.high ?? 0;
  const low = quote?.low ?? 0;
  const close = quote?.close ?? 0;
  const volume = quote?.volume ?? 0;
  const amount = quote?.amount ?? 0;

  const isRise = changePercent >= 0;
  const textColor = isRise ? 'text-rise' : 'text-fall';

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 股票标题 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{quote?.name || '加载中...'}</h1>
            <p className="text-gray-500 mt-1">{code}</p>
          </div>
          <div className={`text-right ${textColor}`}>
            <div className="text-4xl font-bold">{currentPrice.toFixed(2)}</div>
            <div className="text-lg mt-2">
              {isRise ? '+' : ''}{change.toFixed(2)} ({isRise ? '+' : ''}{changePercent.toFixed(2)}%)
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 text-sm">
          <div>
            <span className="text-gray-500">开盘:</span>
            <span className="ml-2 font-medium">{open.toFixed(2)}</span>
          </div>
          <div>
            <span className="text-gray-500">最高:</span>
            <span className="ml-2 font-medium text-rise">{high.toFixed(2)}</span>
          </div>
          <div>
            <span className="text-gray-500">最低:</span>
            <span className="ml-2 font-medium text-fall">{low.toFixed(2)}</span>
          </div>
          <div>
            <span className="text-gray-500">昨收:</span>
            <span className="ml-2 font-medium">{close.toFixed(2)}</span>
          </div>
          <div>
            <span className="text-gray-500">成交量:</span>
            <span className="ml-2 font-medium">{(volume / 10000).toFixed(2)}万</span>
          </div>
          <div>
            <span className="text-gray-500">成交额:</span>
            <span className="ml-2 font-medium">{(amount / 100000000).toFixed(2)}亿</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* K线图 */}
        <div className="lg:col-span-3 bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">K线图</h2>
            <div className="flex gap-2">
              {['day', 'week', 'month', '60m', '30m', '15m'].map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-3 py-1 rounded text-sm transition-colors ${period === p
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                  {p === 'day' ? '日K' : p === 'week' ? '周K' : p === 'month' ? '月K' : p}
                </button>
              ))}
            </div>
          </div>
          {klineData.length > 0 ? (
            <KlineChart data={klineData} height="500px" />
          ) : (
            <div className="text-center py-12 text-gray-500">暂无数据</div>
          )}
        </div>

        {/* 买卖盘口 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">买卖盘口</h2>
          {orderBook ? (
            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-semibold text-gray-600 mb-2">卖盘</h3>
                {orderBook.sell.slice().reverse().map((order) => (
                  <div key={order.level} className="flex justify-between text-sm py-1">
                    <span className="text-fall">卖{order.level}</span>
                    <span className="font-medium">{order.price.toFixed(2)}</span>
                    <span className="text-gray-500">{order.volume}</span>
                  </div>
                ))}
              </div>
              <div className="border-t-2 border-gray-300 my-2"></div>
              <div className={`text-center text-lg font-bold py-2 ${textColor}`}>
                {quote?.currentPrice.toFixed(2)}
              </div>
              <div className="border-t-2 border-gray-300 my-2"></div>
              <div>
                <h3 className="text-sm font-semibold text-gray-600 mb-2">买盘</h3>
                {orderBook.buy.map((order) => (
                  <div key={order.level} className="flex justify-between text-sm py-1">
                    <span className="text-rise">买{order.level}</span>
                    <span className="font-medium">{order.price.toFixed(2)}</span>
                    <span className="text-gray-500">{order.volume}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">暂无盘口数据</div>
          )}
        </div>
      </div>
    </div>
  );
}
