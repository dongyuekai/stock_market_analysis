'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { name: '首页', path: '/' },
    { name: 'A股市场', path: '/a-share' },
    { name: '美股市场', path: '/us-market' },
    { name: '主力资金', path: '/capital-flow' },
  ];

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold text-gray-800">
              📈 股市分析
            </Link>
            <div className="flex space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${pathname === item.path
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                    }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="text-sm text-gray-500">
            实时更新中...
          </div>
        </div>
      </div>
    </nav>
  );
}
