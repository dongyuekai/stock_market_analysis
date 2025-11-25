import Link from 'next/link';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <div className="text-center mb-8 md:mb-12">
        <h1 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4 text-gray-900">股市分析系统</h1>
        <p className="text-gray-800 text-base md:text-xl font-semibold">实时追踪A股、美股市场动态</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <Link href="/a-share" className="block">
          <div className="bg-white rounded-lg shadow-md p-5 md:p-6 hover:shadow-lg transition-shadow active:scale-95">
            <h2 className="text-xl md:text-2xl font-bold mb-2 md:mb-3 text-red-600">A股市场</h2>
            <p className="text-gray-800 font-medium text-sm md:text-base">查看A股实时行情、个股信息、K线图等</p>
          </div>
        </Link>

        <Link href="/us-market" className="block">
          <div className="bg-white rounded-lg shadow-md p-5 md:p-6 hover:shadow-lg transition-shadow active:scale-95">
            <h2 className="text-xl md:text-2xl font-bold mb-2 md:mb-3 text-blue-600">美股市场</h2>
            <p className="text-gray-800 font-medium text-sm md:text-base">追踪美股三大指数及热门股票</p>
          </div>
        </Link>

        <Link href="/capital-flow" className="block">
          <div className="bg-white rounded-lg shadow-md p-5 md:p-6 hover:shadow-lg transition-shadow active:scale-95">
            <h2 className="text-xl md:text-2xl font-bold mb-2 md:mb-3 text-purple-600">主力资金流向</h2>
            <p className="text-gray-800 font-medium text-sm md:text-base">分析市场主力买入卖出情况</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
