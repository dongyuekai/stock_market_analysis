// 股票基本信息
export interface Stock {
  code: string; // 股票代码
  name: string; // 股票名称
  market: "A_SHARE" | "US_MARKET"; // 市场类型
}

// 实时行情
export interface StockQuote {
  code: string;
  name: string;
  currentPrice: number; // 当前价
  change: number; // 涨跌额
  changePercent: number; // 涨跌幅
  open: number; // 开盘价
  high: number; // 最高价
  low: number; // 最低价
  close: number; // 收盘价
  volume: number; // 成交量
  amount: number; // 成交额
  timestamp: string; // 时间戳
}

// K线数据
export interface KlineData {
  date: string; // 日期
  open: number; // 开盘价
  high: number; // 最高价
  low: number; // 最低价
  close: number; // 收盘价
  volume: number; // 成交量
  amount?: number; // 成交额
}

// 买卖盘口数据
export interface OrderBook {
  buy: OrderLevel[]; // 买盘
  sell: OrderLevel[]; // 卖盘
}

export interface OrderLevel {
  price: number; // 价格
  volume: number; // 数量
  level: number; // 档位 1-5
}

// 分时数据
export interface TimelineData {
  time: string; // 时间
  price: number; // 价格
  volume: number; // 成交量
  avgPrice: number; // 均价
}

// 主力资金流向
export interface CapitalFlow {
  code: string;
  name: string;
  mainInflow: number; // 主力流入
  mainOutflow: number; // 主力流出
  mainNet: number; // 主力净流入
  superLargeInflow: number; // 超大单流入
  superLargeOutflow: number; // 超大单流出
  largeInflow: number; // 大单流入
  largeOutflow: number; // 大单流出
  mediumInflow: number; // 中单流入
  mediumOutflow: number; // 中单流出
  smallInflow: number; // 小单流入
  smallOutflow: number; // 小单流出
  changePercent: number; // 涨跌幅
  timestamp: string;
}

// 市场指数
export interface MarketIndex {
  code: string; // 指数代码
  name: string; // 指数名称
  currentValue: number; // 当前点位
  change: number; // 涨跌点
  changePercent: number; // 涨跌幅
  open: number;
  high: number;
  low: number;
  volume: number;
  amount: number;
  timestamp: string;
}

// 热门股票榜单
export interface HotStock {
  code: string;
  name: string;
  currentPrice: number;
  changePercent: number;
  volume: number;
  amount: number;
  turnoverRate?: number; // 换手率
  marketValue?: number; // 市值
}

// 股票详情
export interface StockDetail extends StockQuote {
  pe: number; // 市盈率
  pb: number; // 市净率
  marketValue: number; // 总市值
  circulationMarketValue: number; // 流通市值
  turnoverRate: number; // 换手率
  amplitude: number; // 振幅
  volumeRatio: number; // 量比
  totalShares: number; // 总股本
  circulationShares: number; // 流通股
}
