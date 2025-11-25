'use client';

import { useState, useEffect } from 'react';

interface Stock {
  code: string;
  name: string;
  pinyin?: string;
}

interface StockSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (code: string, name: string) => void;
}

export default function StockSearchModal({ isOpen, onClose, onSelect }: StockSearchModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredStocks, setFilteredStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(false);

  // 重置搜索状态
  useEffect(() => {
    if (isOpen) {
      setSearchTerm('');
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const fetchStocks = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/a-share/search?q=${encodeURIComponent(searchTerm)}`);
        const data = await response.json();
        if (data.success) {
          setFilteredStocks(data.data);
        }
      } catch (error) {
        console.error('Error fetching stocks:', error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchStocks, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, isOpen]);

  const handleSelect = (stock: Stock) => {
    onSelect(stock.code, stock.name);
    setSearchTerm('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={onClose}>
      <div
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full m-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 头部 */}
        <div className="border-b px-6 py-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">搜索股票</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-3xl font-bold"
            >
              ×
            </button>
          </div>

          {/* 搜索框 */}
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="输入股票代码、名称或拼音首字母..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg text-gray-900"
            autoFocus
            autoComplete="off"
          />
        </div>

        {/* 搜索结果 */}
        <div className="max-h-96 overflow-y-auto">
          {loading ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">搜索中...</p>
            </div>
          ) : filteredStocks.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">未找到相关股票</p>
              <p className="text-sm mt-2">请尝试其他关键词</p>
            </div>
          ) : (
            <div className="divide-y">
              {filteredStocks.map((stock) => (
                <div
                  key={stock.code}
                  className="px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-gray-900 text-lg">{stock.name}</div>
                      <div className="text-sm text-gray-600">{stock.code}</div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelect(stock);
                      }}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 font-medium transition-colors"
                    >
                      添加
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
