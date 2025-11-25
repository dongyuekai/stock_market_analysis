'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CapitalFlow } from '@/types/stock';

export default function CapitalFlowPage() {
  const router = useRouter();
  const [capitalFlow, setCapitalFlow] = useState<CapitalFlow[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'mainNet' | 'changePercent'>('mainNet');

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/capital-flow?limit=50');
      const result = await response.json();

      if (result.success) {
        setCapitalFlow(result.data);
      }
    } catch (error) {
      console.error('Error fetching capital flow:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field: 'mainNet' | 'changePercent') => {
    setSortBy(field);
    const sorted = [...capitalFlow].sort((a, b) => {
      if (field === 'mainNet') {
        return b.mainNet - a.mainNet;
      } else {
        return b.changePercent - a.changePercent;
      }
    });
    setCapitalFlow(sorted);
  };

  const handleStockClick = (code: string) => {
    router.push(`/a-share/stock/${code}`);
  };

  const formatMoney = (value: number) => {
    const absValue = Math.abs(value);
    if (absValue >= 100000000) {
      return `${(value / 100000000).toFixed(2)}亿`;
    } else if (absValue >= 10000) {
      return `${(value / 10000).toFixed(2)}万`;
    }
    return value.toFixed(2);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">主力资金流向</h1>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex items-center gap-4 p-4 bg-gray-50 border-b">
          <span className="text-sm text-gray-600">排序:</span>
          <button
            onClick={() => handleSort('mainNet')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${sortBy === 'mainNet'
              ? 'bg-blue-500 text-white'
              : 'bg-white text-gray-700 border hover:bg-gray-100'
              }`}
          >
            主力净流入
          </button>
          <button
            onClick={() => handleSort('changePercent')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${sortBy === 'changePercent'
              ? 'bg-blue-500 text-white'
              : 'bg-white text-gray-700 border hover:bg-gray-100'
              }`}
          >
            涨跌幅
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">加载中...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    排名
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    股票代码
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    股票名称
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    涨跌幅
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    主力净流入
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    超大单
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    大单
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    中单
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    小单
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {capitalFlow.map((item, index) => {
                  const isRise = item.changePercent >= 0;
                  const textColor = isRise ? 'text-rise' : 'text-fall';
                  const mainNetColor = item.mainNet >= 0 ? 'text-rise' : 'text-fall';

                  return (
                    <tr
                      key={item.code}
                      onClick={() => handleStockClick(item.code)}
                      className="hover:bg-gray-50 cursor-pointer"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.code}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.name}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${textColor}`}>
                        {isRise ? '+' : ''}{item.changePercent.toFixed(2)}%
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-bold ${mainNetColor}`}>
                        {formatMoney(item.mainNet)}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm text-right ${item.superLargeInflow - item.superLargeOutflow >= 0 ? 'text-rise' : 'text-fall'
                        }`}>
                        {formatMoney(item.superLargeInflow - item.superLargeOutflow)}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm text-right ${item.largeInflow - item.largeOutflow >= 0 ? 'text-rise' : 'text-fall'
                        }`}>
                        {formatMoney(item.largeInflow - item.largeOutflow)}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm text-right ${item.mediumInflow - item.mediumOutflow >= 0 ? 'text-rise' : 'text-fall'
                        }`}>
                        {formatMoney(item.mediumInflow - item.mediumOutflow)}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm text-right ${item.smallInflow - item.smallOutflow >= 0 ? 'text-rise' : 'text-fall'
                        }`}>
                        {formatMoney(item.smallInflow - item.smallOutflow)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">说明</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• 主力资金 = 超大单 + 大单</li>
          <li>• 超大单：成交金额 ≥ 100万元</li>
          <li>• 大单：50万元 ≤ 成交金额 {'<'} 100万元</li>
          <li>• 中单：10万元 ≤ 成交金额 {'<'} 50万元</li>
          <li>• 小单：成交金额 {'<'} 10万元</li>
          <li>• 数据更新频率：30秒</li>
        </ul>
      </div>
    </div>
  );
}
