'use client';

import { useEffect, useState } from 'react';
import KlineChart from './KlineChart';
import { StockQuote, KlineData } from '@/types/stock';

interface StockDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  stockCode: string;
  stockName: string;
}

export default function StockDetailModal({ isOpen, onClose, stockCode, stockName }: StockDetailModalProps) {
  const [quote, setQuote] = useState<StockQuote | null>(null);
  const [klineData, setKlineData] = useState<KlineData[]>([]);
  const [period, setPeriod] = useState<'day' | 'week' | 'month'>('day');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && stockCode) {
      fetchStockData();
    }
  }, [isOpen, stockCode, period]);

  const fetchStockData = async () => {
    try {
      setLoading(true);
      const [quoteRes, klineRes] = await Promise.all([
        fetch(`/api/a-share/quote/${stockCode}`).then(r => r.json()),
        fetch(`/api/a-share/kline/${stockCode}?period=${period}`).then(r => r.json()),
      ]);

      if (quoteRes.success) setQuote(quoteRes.data);
      if (klineRes.success) setKlineData(klineRes.data);
    } catch (error) {
      console.error('Error fetching stock detail:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const currentPrice = quote?.currentPrice ?? 0;
  const change = quote?.change ?? 0;
  const changePercent = quote?.changePercent ?? 0;
  const isRise = changePercent >= 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-2 md:p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[95vh] md:max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 头部 */}
        <div className="sticky top-0 bg-white border-b px-4 md:px-6 py-3 md:py-4 flex justify-between items-center">
          <div className="flex-1 min-w-0 mr-4">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 truncate">{stockName}</h2>
            <p className="text-sm text-gray-600">{stockCode}</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className={`text-3xl font-bold ${isRise ? 'text-rise' : 'text-fall'}`}>
                ¥{currentPrice.toFixed(2)}
              </div>
              <div className={`text-lg ${isRise ? 'text-rise' : 'text-fall'}`}>
                {isRise ? '+' : ''}{change.toFixed(2)} ({isRise ? '+' : ''}{changePercent.toFixed(2)}%)
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-3xl font-bold w-10 h-10 flex items-center justify-center"
            >
              ×
            </button>
          </div>
        </div>

        {/* 内容区 */}
        <div className="p-4 md:p-6">
          {loading ? (
            <div className="text-center py-12 text-gray-500">加载中...</div>
          ) : (
            <>
              {/* 实时行情信息 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
                <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
                  <div className="text-xs md:text-sm text-gray-600 mb-1">今开</div>
                  <div className="text-base md:text-lg font-semibold text-gray-900">￥{quote?.open.toFixed(2)}</div>
                </div>
                <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
                  <div className="text-xs md:text-sm text-gray-600 mb-1">最高</div>
                  <div className="text-base md:text-lg font-semibold text-rise">￥{quote?.high.toFixed(2)}</div>
                </div>
                <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
                  <div className="text-xs md:text-sm text-gray-600 mb-1">最低</div>
                  <div className="text-base md:text-lg font-semibold text-fall">￥{quote?.low.toFixed(2)}</div>
                </div>
                <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
                  <div className="text-xs md:text-sm text-gray-600 mb-1">成交量</div>
                  <div className="text-base md:text-lg font-semibold text-gray-900">
                    {((quote?.volume ?? 0) / 100000000).toFixed(2)}亿
                  </div>
                </div>
              </div>

              {/* K线图 */}
              <div className="mb-4 md:mb-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 md:mb-4 gap-3">
                  <h3 className="text-lg md:text-xl font-bold text-gray-900">K线走势</h3>
                  <div className="flex gap-2 w-full sm:w-auto">
                    {(['day', 'week', 'month'] as const).map((p) => (
                      <button
                        key={p}
                        onClick={() => setPeriod(p)}
                        className={`flex-1 sm:flex-none px-3 md:px-4 py-2 rounded-md text-xs md:text-sm font-medium transition-colors active:scale-95 ${period === p
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                      >
                        {p === 'day' ? '日K' : p === 'week' ? '周K' : '月K'}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="bg-white border rounded-lg p-2 md:p-4">
                  <KlineChart data={klineData} />
                </div>
              </div>

              {/* 公告信息 */}
              <div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4">最新公告</h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 md:p-4">
                  <p className="text-blue-800">
                    💡 实时公告功能开发中，敬请期待...
                  </p>
                  <p className="text-sm text-blue-600 mt-2">
                    未来将展示公司最新公告、财报、分红等重要信息
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
