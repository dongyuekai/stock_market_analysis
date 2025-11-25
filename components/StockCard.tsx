'use client';

import { StockQuote } from '@/types/stock';

interface StockCardProps {
  stock: StockQuote;
  onClick?: () => void;
}

export default function StockCard({ stock, onClick }: StockCardProps) {
  // 安全处理可能为null或undefined的数值
  const currentPrice = stock.currentPrice ?? 0;
  const changePercent = Number(stock.changePercent) || 0;
  const open = stock.open ?? 0;
  const high = stock.high ?? 0;
  const low = stock.low ?? 0;

  const isRise = changePercent >= 0;
  const textColor = isRise ? 'text-rise' : 'text-fall';
  const bgColor = isRise ? 'bg-red-50' : 'bg-green-50';

  return (
    <div
      className={`${bgColor} rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-semibold text-gray-800">{stock.name || '未知'}</h3>
          <p className="text-xs text-gray-500">{stock.code || '-'}</p>
        </div>
        <div className={`text-right ${textColor}`}>
          <div className="text-xl font-bold">{currentPrice.toFixed(2)}</div>
          <div className="text-sm">
            {isRise ? '+' : ''}{changePercent.toFixed(2)}%
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 text-xs text-gray-600">
        <div>
          <span className="text-gray-400">开:</span> {open.toFixed(2)}
        </div>
        <div>
          <span className="text-gray-400">高:</span> {high.toFixed(2)}
        </div>
        <div>
          <span className="text-gray-400">低:</span> {low.toFixed(2)}
        </div>
      </div>
    </div>
  );
}
