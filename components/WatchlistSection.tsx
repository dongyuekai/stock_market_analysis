'use client';

import { useState, useEffect } from 'react';
import StockCard from '@/components/StockCard';
import StockSearchModal from '@/components/StockSearchModal';
import StockDetailModal from '@/components/StockDetailModal';
import { StockQuote } from '@/types/stock';

export default function WatchlistSection() {
  const [watchlist, setWatchlist] = useState<StockQuote[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState<{ code: string; name: string } | null>(null);
  const [loading, setLoading] = useState(false);

  // 从localStorage加载自选股票
  useEffect(() => {
    const saved = localStorage.getItem('watchlist');
    if (saved) {
      try {
        const codes = JSON.parse(saved) as Array<{ code: string; name: string }>;
        if (codes.length > 0) {
          fetchWatchlistData(codes);
        }
      } catch (error) {
        console.error('Error loading watchlist:', error);
      }
    }
  }, []);

  // 获取自选股票的实时数据
  const fetchWatchlistData = async (codes: Array<{ code: string; name: string }>) => {
    try {
      setLoading(true);
      const promises = codes.map(({ code }) =>
        fetch(`/api/a-share/quote/${code}`).then(r => r.json())
      );
      const results = await Promise.all(promises);

      const stocks: StockQuote[] = results
        .map((res, index) => {
          if (res.success && res.data) {
            return {
              ...res.data,
              code: codes[index].code,
              name: codes[index].name,
            };
          }
          return null;
        })
        .filter((s): s is StockQuote => s !== null);

      setWatchlist(stocks);
    } catch (error) {
      console.error('Error fetching watchlist data:', error);
    } finally {
      setLoading(false);
    }
  };

  // 添加股票到自选
  const handleAddStock = (code: string, name: string) => {
    const saved = localStorage.getItem('watchlist');
    const existing = saved ? JSON.parse(saved) : [];

    // 检查是否已存在
    if (existing.some((item: any) => item.code === code)) {
      alert('该股票已在自选列表中');
      return;
    }

    const updated = [...existing, { code, name }];
    localStorage.setItem('watchlist', JSON.stringify(updated));
    fetchWatchlistData(updated);
  };

  // 从自选中移除股票
  const handleRemoveStock = (code: string) => {
    const saved = localStorage.getItem('watchlist');
    if (!saved) return;

    const existing = JSON.parse(saved);
    const updated = existing.filter((item: any) => item.code !== code);
    localStorage.setItem('watchlist', JSON.stringify(updated));
    setWatchlist(watchlist.filter(s => s.code !== code));
  };

  // 打开股票详情
  const handleStockClick = (stock: StockQuote) => {
    setSelectedStock({ code: stock.code, name: stock.name });
    setIsDetailOpen(true);
  };

  // 刷新自选数据
  const handleRefresh = () => {
    const saved = localStorage.getItem('watchlist');
    if (saved) {
      const codes = JSON.parse(saved);
      fetchWatchlistData(codes);
    }
  };

  return (
    <div className="mb-6 md:mb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 md:mb-6 gap-3">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">我的自选</h2>
        <div className="flex gap-2 md:gap-3 w-full sm:w-auto">
          <button
            onClick={handleRefresh}
            className="flex-1 sm:flex-none px-3 md:px-5 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium text-sm md:text-base active:scale-95"
            disabled={loading}
          >
            {loading ? '刷新中...' : '刷新'}
          </button>
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex-1 sm:flex-none px-3 md:px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-sm md:text-base active:scale-95"
          >
            + 添加股票
          </button>
        </div>
      </div>

      {watchlist.length === 0 ? (
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 md:p-12 text-center">
          <p className="text-lg md:text-xl text-gray-500 mb-4">还没有添加自选股票</p>
          <button
            onClick={() => setIsSearchOpen(true)}
            className="px-5 md:px-6 py-2 md:py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-base md:text-lg active:scale-95"
          >
            立即添加
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {watchlist.map((stock) => (
            <div key={stock.code} className="relative group">
              <div onClick={() => handleStockClick(stock)} className="cursor-pointer">
                <StockCard stock={stock} />
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm(`确定要从自选中移除 ${stock.name} 吗？`)) {
                    handleRemoveStock(stock.code);
                  }
                }}
                className="absolute top-2 right-2 w-7 h-7 md:w-8 md:h-8 bg-red-500 text-white rounded-full opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 font-bold active:scale-95"
                title="移除自选"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 搜索弹窗 */}
      <StockSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelect={handleAddStock}
      />

      {/* 详情弹窗 */}
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
