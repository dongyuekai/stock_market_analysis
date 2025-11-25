'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MarketIndexCard from '@/components/MarketIndexCard';
import StockCard from '@/components/StockCard';
import { MarketIndex, HotStock } from '@/types/stock';

export default function USMarketPage() {
  const router = useRouter();
  const [indices, setIndices] = useState<MarketIndex[]>([]);
  const [hotStocks, setHotStocks] = useState<HotStock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000); // 每60秒刷新
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [indicesRes, hotRes] = await Promise.all([
        fetch('/api/us-market/indices').then(r => r.json()),
        fetch('/api/us-market/hot?limit=20').then(r => r.json()),
      ]);

      if (indicesRes.success) {
        setIndices(indicesRes.data);
      }

      if (hotRes.success) {
        setHotStocks(hotRes.data);
      }
    } catch (error) {
      console.error('Error fetching US market data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStockClick = (code: string) => {
    router.push(`/us-market/stock/${code}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-gray-900">美股市场</h1>

      {/* 市场指数 */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">市场指数</h2>
        {loading && indices.length === 0 ? (
          <div className="text-center py-8 text-gray-500">加载中...</div>
        ) : indices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {indices.map((index) => (
              <MarketIndexCard key={index.code} index={index} />
            ))}
          </div>
        ) : (
          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-6 text-yellow-900">
            <p className="font-bold text-lg mb-2">⚠️ 暂时无法获取指数数据</p>
            <p className="text-yellow-800">请稍后重试或检查网络连接</p>
          </div>
        )}
      </section>

      {/* 热门股票 */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">热门美股</h2>
          <span className="text-sm text-gray-700 font-medium">按涨跌幅排序</span>
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-500">加载中...</div>
        ) : hotStocks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {hotStocks.map((stock) => (
              <StockCard
                key={stock.code}
                stock={{
                  code: stock.code,
                  name: stock.name,
                  currentPrice: stock.currentPrice,
                  change: 0,
                  changePercent: stock.changePercent,
                  open: stock.currentPrice,
                  high: stock.currentPrice,
                  low: stock.currentPrice,
                  close: stock.currentPrice,
                  volume: stock.volume,
                  amount: stock.amount,
                  timestamp: new Date().toISOString(),
                }}
                onClick={() => handleStockClick(stock.code)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-6 text-yellow-900">
            <p className="font-bold text-lg mb-2">⚠️ 暂时无法获取热门股票数据</p>
            <p className="text-yellow-800">请稍后重试或检查网络连接</p>
          </div>
        )}
      </section>

      {/* 提示信息 */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">交易时间提示</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• 美股交易时间：北京时间 21:30 - 次日 4:00（夏令时）</li>
          <li>• 美股交易时间：北京时间 22:30 - 次日 5:00（冬令时）</li>
          <li>• 盘前交易：16:00 - 21:30</li>
          <li>• 盘后交易：4:00 - 8:00</li>
          <li>• 数据更新频率：60秒</li>
        </ul>
      </div>
    </div>
  );
}
