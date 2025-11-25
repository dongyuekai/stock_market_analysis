'use client';

import { MarketIndex } from '@/types/stock';

interface MarketIndexCardProps {
  index: MarketIndex;
}

export default function MarketIndexCard({ index }: MarketIndexCardProps) {
  // 安全处理可能为null或undefined的数值
  const currentValue = index.currentValue ?? 0;
  const change = index.change ?? 0;
  const changePercent = index.changePercent ?? 0;
  const open = index.open ?? 0;
  const high = index.high ?? 0;
  const low = index.low ?? 0;
  const volume = index.volume ?? 0;

  const isRise = changePercent >= 0;
  const textColor = isRise ? 'text-rise' : 'text-fall';

  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
      <div className="flex justify-between items-start mb-3 md:mb-4">
        <div className="flex-1 min-w-0 mr-2">
          <h3 className="text-base md:text-lg font-bold text-gray-900 truncate">{index.name || '未知'}</h3>
          <p className="text-xs md:text-sm text-gray-700 font-medium">{index.code || '-'}</p>
        </div>
        <div className={`text-right ${textColor}`}>
          <div className="text-xl md:text-2xl font-bold">{currentValue.toFixed(2)}</div>
          <div className="flex items-center gap-1 md:gap-2 mt-1 text-sm md:text-base font-semibold">
            <span>{isRise ? '+' : ''}{change.toFixed(2)}</span>
            <span>{isRise ? '+' : ''}{changePercent.toFixed(2)}%</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-3 text-sm">
        <div>
          <div className="text-gray-600 text-xs font-medium">开盘</div>
          <div className="font-semibold text-gray-900">{open.toFixed(2)}</div>
        </div>
        <div>
          <div className="text-gray-600 text-xs font-medium">最高</div>
          <div className="font-semibold text-rise">{high.toFixed(2)}</div>
        </div>
        <div>
          <div className="text-gray-600 text-xs font-medium">最低</div>
          <div className="font-semibold text-fall">{low.toFixed(2)}</div>
        </div>
        <div>
          <div className="text-gray-600 text-xs font-medium">成交量</div>
          <div className="font-semibold text-gray-900">{(volume / 100000000).toFixed(2)}亿</div>
        </div>
      </div>
    </div>
  );
}
