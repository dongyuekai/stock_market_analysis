import axios from "axios";

// 配置axios实例
const apiClient = axios.create({
  timeout: 10000,
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
  },
});

/**
 * 获取A股市场指数（上证、深证、北交所）
 * 使用东方财富API获取实时准确数据
 */
export async function fetchAShareIndices() {
  try {
    // 东方财富API：1.000001=上证指数, 0.399001=深证成指, 0.899050=北证50
    const indices = [
      { secid: "1.000001", name: "上证指数", code: "000001" },
      { secid: "0.399001", name: "深证成指", code: "399001" },
      { secid: "0.899050", name: "北证50", code: "899050" },
    ];

    const results = await Promise.all(
      indices.map(async (index) => {
        try {
          const response = await apiClient.get(
            `https://push2.eastmoney.com/api/qt/stock/get?secid=${index.secid}&fields=f43,f44,f45,f46,f47,f48,f60,f169,f170,f168`
          );

          const data = response.data?.data;
          if (!data) return null;

          // f43=现价(单位:分) f60=昨收 f169=涨跌额 f170=涨跌幅(单位:0.01%)
          // f44=最高 f45=最低 f46=开盘 f47=成交量(手) f48=成交额(元)
          const currentValue = (data.f43 || 0) / 100;
          const prevClose = (data.f60 || 0) / 100;
          const change = (data.f169 || 0) / 100;
          const changePercent = (data.f170 || 0) / 100;
          const high = (data.f44 || 0) / 100;
          const low = (data.f45 || 0) / 100;
          const open = (data.f46 || 0) / 100;
          const volume = (data.f47 || 0) * 100; // 转换为股
          const amount = data.f48 || 0;

          return {
            code: index.code,
            name: index.name,
            currentValue,
            change,
            changePercent,
            open,
            high,
            low,
            close: prevClose,
            volume,
            amount,
            timestamp: new Date().toLocaleString("zh-CN"),
          };
        } catch (err) {
          console.error(`Error fetching ${index.name}:`, err);
          return null;
        }
      })
    );

    return results.filter(Boolean);
  } catch (error) {
    console.error("Error fetching A-share indices:", error);
    throw error;
  }
}

/**
 * 获取A股股票实时行情
 * 使用东方财富API获取准确的实时数据
 */
export async function fetchAShareQuote(stockCode: string) {
  try {
    // 处理代码格式
    let pureCode = stockCode;
    if (stockCode.startsWith("sh") || stockCode.startsWith("sz")) {
      pureCode = stockCode.substring(2);
    }

    // 判断市场：1=上海(6开头), 0=深圳(0/3开头), 0=北交所(4/8开头)
    let marketId = "0";
    if (pureCode.startsWith("6")) {
      marketId = "1";
    } else if (pureCode.startsWith("4") || pureCode.startsWith("8")) {
      marketId = "0"; // 北交所也用0
    }

    const secid = `${marketId}.${pureCode}`;

    // 使用东方财富API获取实时行情
    // f57=代码 f58=名称 f43=现价 f169=涨跌额 f170=涨跌幅
    // f46=开盘 f44=最高 f45=最低 f60=昨收 f47=成交量 f48=成交额
    const response = await apiClient.get(
      `https://push2.eastmoney.com/api/qt/stock/get?secid=${secid}&fields=f57,f58,f43,f169,f170,f46,f44,f45,f60,f47,f48,f168`
    );

    const data = response.data?.data;
    if (!data) throw new Error("Invalid stock code or no data");

    // 东方财富返回的价格单位是分，需要除以100
    return {
      code: pureCode,
      name: data.f58 || "",
      currentPrice: (data.f43 || 0) / 100,
      change: (data.f169 || 0) / 100,
      changePercent: (data.f170 || 0) / 100,
      open: (data.f46 || 0) / 100,
      high: (data.f44 || 0) / 100,
      low: (data.f45 || 0) / 100,
      close: (data.f60 || 0) / 100,
      volume: (data.f47 || 0) * 100, // 手转为股
      amount: data.f48 || 0,
      timestamp: new Date().toLocaleString("zh-CN"),
    };
  } catch (error) {
    console.error("Error fetching stock quote:", error);
    throw error;
  }
}

/**
 * 获取股票K线数据
 */
export async function fetchKlineData(
  stockCode: string,
  period: string = "day",
  count: number = 100
) {
  try {
    // 使用新浪财经API获取K线数据
    const market = stockCode.startsWith("6") ? "sh" : "sz";
    const fullCode = `${market}${stockCode}`;

    // 不同周期对应的新浪API参数
    const periodMap: { [key: string]: string } = {
      day: "240", // 日K
      week: "1200", // 周K
      month: "7200", // 月K
      "60m": "60",
      "30m": "30",
      "15m": "15",
      "5m": "5",
    };

    const scale = periodMap[period] || "240";

    // 使用新浪财经的K线接口
    const response = await apiClient.get(
      `https://money.finance.sina.com.cn/quotes_service/api/json_v2.php/CN_MarketData.getKLineData`,
      {
        params: {
          symbol: fullCode,
          scale: scale,
          ma: "no",
          datalen: count,
        },
      }
    );

    if (response.data && Array.isArray(response.data)) {
      return response.data.map((item: any) => ({
        date: item.day,
        open: parseFloat(item.open),
        high: parseFloat(item.high),
        low: parseFloat(item.low),
        close: parseFloat(item.close),
        volume: parseInt(item.volume),
        amount: parseFloat(item.volume) * parseFloat(item.close),
      }));
    }

    throw new Error("Invalid K-line data format");
  } catch (error) {
    console.error("Error fetching kline data:", error);
    // 返回模拟数据用于演示
    return generateMockKlineData(count);
  }
}

/**
 * 获取热门股票列表
 */
export async function fetchHotStocks(
  type: "rise" | "fall" | "volume" = "rise",
  limit: number = 20
) {
  try {
    // 使用东方财富网API
    const sortField = type === "rise" ? "f3" : type === "fall" ? "f3" : "f5";
    const sortOrder = "1"; // 统一降序：涨幅榜显示最大正值，跌幅榜显示最大负值（绝对值最大）

    const response = await apiClient.get(
      "http://push2.eastmoney.com/api/qt/clist/get",
      {
        params: {
          pn: 1,
          pz: limit,
          po: sortOrder,
          np: 1,
          fltt: 2,
          invt: 2,
          fid: sortField,
          fs: "m:0+t:6,m:0+t:80,m:1+t:2,m:1+t:23",
          fields: "f12,f14,f2,f3,f5,f6,f15,f16,f17,f18",
        },
      }
    );

    // 解析东方财富数据格式
    if (response.data?.data?.diff) {
      return response.data.data.diff.map((item: any) => {
        // 注意：东方财富这个API的价格已经是正确单位，不需要除以100
        const price = item.f2 || 0;
        const high = item.f15 || 0;
        const low = item.f16 || 0;
        const open = item.f17 || 0;
        const close = item.f18 || 0;

        return {
          code: item.f12 || "", // 股票代码
          name: item.f14 || "未知", // 股票名称
          currentPrice: price, // 最新价
          changePercent: Number(item.f3) || 0, // 涨跌幅（确保是数字）
          volume: item.f5 || 0, // 成交量
          amount: item.f6 || 0, // 成交额
          turnoverRate: item.f8 || 0, // 换手率
          high: high, // 最高价
          low: low, // 最低价
          open: open, // 开盘价
          close: close, // 昨收价
        };
      });
    }

    throw new Error("Invalid response format");
  } catch (error) {
    console.error("Error fetching hot stocks:", error);
    return generateMockHotStocks(limit);
  }
}

/**
 * 生成模拟K线数据
 */
function generateMockKlineData(count: number) {
  const data = [];
  let basePrice = 10 + Math.random() * 90; // 10-100之间的基准价格

  for (let i = count - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    const open = basePrice;
    const change = (Math.random() - 0.5) * basePrice * 0.1;
    const close = open + change;
    const high = Math.max(open, close) * (1 + Math.random() * 0.05);
    const low = Math.min(open, close) * (1 - Math.random() * 0.05);
    const volume = Math.floor(Math.random() * 10000000) + 1000000;

    data.push({
      date: date.toISOString().split("T")[0],
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume: volume,
      amount: volume * ((open + close) / 2),
    });

    basePrice = close;
  }

  return data;
}

/**
 * 生成模拟热门股票数据
 */
function generateMockHotStocks(limit: number) {
  const stocks = [];
  const names = [
    "贵州茅台",
    "中国平安",
    "招商银行",
    "五粮液",
    "工商银行",
    "建设银行",
    "美的集团",
    "格力电器",
    "比亚迪",
    "宁德时代",
  ];

  for (let i = 0; i < limit; i++) {
    const baseCode = 600000 + Math.floor(Math.random() * 1000);
    const price = 10 + Math.random() * 90;
    const change = (Math.random() - 0.3) * 10; // 偏向上涨

    stocks.push({
      code: baseCode.toString(),
      name: names[i % names.length] + (i > 9 ? i : ""),
      currentPrice: parseFloat(price.toFixed(2)),
      changePercent: parseFloat(change.toFixed(2)),
      volume: Math.floor(Math.random() * 100000000),
      amount: Math.floor(Math.random() * 1000000000),
      turnoverRate: parseFloat((Math.random() * 20).toFixed(2)),
      marketValue: Math.floor(Math.random() * 500000000000),
    });
  }

  return stocks;
}

/**
 * 获取买卖盘口数据
 */
export async function fetchOrderBook(stockCode: string) {
  try {
    const prefix = stockCode.startsWith("6") ? "sh" : "sz";
    const fullCode = `${prefix}${stockCode}`;

    const response = await apiClient.get(
      `https://hq.sinajs.cn/list=${fullCode}`
    );

    const match = response.data.match(/var hq_str_.+?="(.+?)";/);
    if (!match) throw new Error("Invalid stock code");

    const fields = match[1].split(",");

    return {
      buy: [
        {
          price: parseFloat(fields[11]),
          volume: parseInt(fields[10]),
          level: 1,
        },
        {
          price: parseFloat(fields[13]),
          volume: parseInt(fields[12]),
          level: 2,
        },
        {
          price: parseFloat(fields[15]),
          volume: parseInt(fields[14]),
          level: 3,
        },
        {
          price: parseFloat(fields[17]),
          volume: parseInt(fields[16]),
          level: 4,
        },
        {
          price: parseFloat(fields[19]),
          volume: parseInt(fields[18]),
          level: 5,
        },
      ],
      sell: [
        {
          price: parseFloat(fields[21]),
          volume: parseInt(fields[20]),
          level: 1,
        },
        {
          price: parseFloat(fields[23]),
          volume: parseInt(fields[22]),
          level: 2,
        },
        {
          price: parseFloat(fields[25]),
          volume: parseInt(fields[24]),
          level: 3,
        },
        {
          price: parseFloat(fields[27]),
          volume: parseInt(fields[26]),
          level: 4,
        },
        {
          price: parseFloat(fields[29]),
          volume: parseInt(fields[28]),
          level: 5,
        },
      ],
    };
  } catch (error) {
    console.error("Error fetching order book:", error);
    throw error;
  }
}
