'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MarketIndexCard from '@/components/MarketIndexCard';
import StockCard from '@/components/StockCard';
import WatchlistSection from '@/components/WatchlistSection';
import StockDetailModal from '@/components/StockDetailModal';
import { MarketIndex, HotStock } from '@/types/stock';

export default function ASharePage() {
  const router = useRouter();
  const [indices, setIndices] = useState<MarketIndex[]>([]);
  const [hotStocks, setHotStocks] = useState<HotStock[]>([]);
  const [activeTab, setActiveTab] = useState<'rise' | 'fall' | 'volume'>('rise');
  const [loading, setLoading] = useState(true);
  const [selectedStock, setSelectedStock] = useState<{ code: string; name: string } | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    fetchData();
    // 每30秒刷新一次数据
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [indicesRes, hotRes] = await Promise.all([
        fetch('/api/a-share/indices').then(r => r.json()),
        fetch(`/api/a-share/hot?type=${activeTab}&limit=20`).then(r => r.json()),
      ]);

      if (indicesRes.success) {
        setIndices(indicesRes.data);
      }

      if (hotRes.success) {
        setHotStocks(hotRes.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStockClick = (code: string, name: string) => {
    setSelectedStock({ code, name });
    setIsDetailOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-gray-900">A股市场</h1>

      {/* 市场指数 */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">市场指数</h2>
        {loading && indices.length === 0 ? (
          <div className="text-center py-8 text-gray-500">加载中...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {indices.map((index) => (
              <MarketIndexCard key={index.code} index={index} />
            ))}
          </div>
        )}
      </section>

      {/* 自选股票 */}
      <WatchlistSection />

      {/* 热门股票 */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">热门股票</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('rise')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'rise'
                ? 'bg-red-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
              涨幅榜
            </button>
            <button
              onClick={() => setActiveTab('fall')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'fall'
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
              跌幅榜
            </button>
            <button
              onClick={() => setActiveTab('volume')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'volume'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
              成交量榜
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-500">加载中...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {hotStocks.map((stock) => (
              <div key={stock.code} className="cursor-pointer" onClick={() => handleStockClick(stock.code, stock.name)}>
                <StockCard
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
                />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 股票详情弹窗 */}
      {selectedStock && (
        <StockDetailModal
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          stockCode={selectedStock.code}
          stockName={selectedStock.name}
        />
      )}
    </div>
  );
}
