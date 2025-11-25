'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import KlineChart from '@/components/KlineChart';
import { StockQuote, KlineData } from '@/types/stock';

export default function USStockDetailPage() {
  const params = useParams();
  const symbol = params.symbol as string;

  const [quote, setQuote] = useState<StockQuote | null>(null);
  const [klineData, setKlineData] = useState<KlineData[]>([]);
  const [period, setPeriod] = useState<string>('day');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (symbol) {
      fetchStockData();
      const interval = setInterval(fetchStockData, 30000); // 每30秒刷新
      return () => clearInterval(interval);
    }
  }, [symbol, period]);

  const fetchStockData = async () => {
    try {
      setLoading(true);
      const [quoteRes, klineRes] = await Promise.all([
        fetch(`/api/us-market/quote/${symbol}`).then(r => r.json()),
        fetch(`/api/us-market/kline/${symbol}?period=${period}&count=100`).then(r => r.json()),
      ]);

      if (quoteRes.success) {
        setQuote(quoteRes.data);
      }

      if (klineRes.success) {
        setKlineData(klineRes.data);
      }
    } catch (error) {
      console.error('Error fetching US stock data:', error);
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

  const isRise = changePercent >= 0;
  const textColor = isRise ? 'text-rise' : 'text-fall';

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 股票标题 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{quote?.name || '加载中...'}</h1>
            <p className="text-gray-500 mt-1">{symbol}</p>
          </div>
          <div className={`text-right ${textColor}`}>
            <div className="text-4xl font-bold">${currentPrice.toFixed(2)}</div>
            <div className="text-lg mt-2">
              {isRise ? '+' : ''}{change.toFixed(2)} ({isRise ? '+' : ''}{changePercent.toFixed(2)}%)
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 text-sm">
          <div>
            <span className="text-gray-500">开盘:</span>
            <span className="ml-2 font-medium">${open.toFixed(2)}</span>
          </div>
          <div>
            <span className="text-gray-500">最高:</span>
            <span className="ml-2 font-medium text-rise">${high.toFixed(2)}</span>
          </div>
          <div>
            <span className="text-gray-500">最低:</span>
            <span className="ml-2 font-medium text-fall">${low.toFixed(2)}</span>
          </div>
          <div>
            <span className="text-gray-500">昨收:</span>
            <span className="ml-2 font-medium">${close.toFixed(2)}</span>
          </div>
          <div>
            <span className="text-gray-500">成交量:</span>
            <span className="ml-2 font-medium">{(volume / 1000000).toFixed(2)}M</span>
          </div>
        </div>
      </div>

      {/* K线图 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">K线图</h2>
          <div className="flex gap-2">
            {['day', 'week', 'month'].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1 rounded text-sm transition-colors ${period === p
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
              >
                {p === 'day' ? '日K' : p === 'week' ? '周K' : '月K'}
              </button>
            ))}
          </div>
        </div>
        {klineData.length > 0 ? (
          <KlineChart data={klineData} height="500px" />
        ) : (
          <div className="text-center py-12 text-gray-500">
            暂无K线数据，美股K线数据获取可能受限
          </div>
        )}
      </div>

      {/* 交易提示 */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">交易信息</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• 数据来源：新浪财经（实时数据可能有延迟）</li>
          <li>• 价格单位：美元（USD）</li>
          <li>• 更新频率：30秒</li>
          <li>• 盘前盘后交易数据暂不支持</li>
        </ul>
      </div>
    </div>
  );
}
