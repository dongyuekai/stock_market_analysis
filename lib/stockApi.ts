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
 */
export async function fetchAShareIndices() {
  try {
    // 使用腾讯财经API获取指数数据
    const response = await apiClient.get(
      "https://qt.gtimg.cn/q=sh000001,sz399001,bj899050",
      { responseType: "arraybuffer" }
    );

    // 将GB2312编码转为UTF-8
    const decoder = new TextDecoder("gbk");
    const data = decoder.decode(response.data);

    // 解析腾讯财经格式：v_sh000001="1~上证指数~000001~3870.02~..."
    const matches = data.match(/v_\w+="([^"]+)"/g);
    if (!matches) return [];

    return matches
      .map((match) => {
        const content = match.match(/"([^"]+)"/)?.[1];
        if (!content) return null;

        const fields = content.split("~");
        const currentValue = parseFloat(fields[3]) || 0;
        const prevClose = parseFloat(fields[4]) || 0;
        const open = parseFloat(fields[5]) || 0;
        const volume = parseInt(fields[6]) || 0;
        const high = parseFloat(fields[33]) || 0;
        const low = parseFloat(fields[34]) || 0;
        const change = currentValue - prevClose;
        const changePercent = prevClose > 0 ? (change / prevClose) * 100 : 0;

        return {
          code: fields[2] || "",
          name: fields[1] || "",
          currentValue,
          change,
          changePercent,
          open,
          high,
          low,
          close: prevClose,
          volume,
          amount: volume * currentValue,
          timestamp: fields[30] || new Date().toLocaleString("zh-CN"),
        };
      })
      .filter(Boolean);
  } catch (error) {
    console.error("Error fetching A-share indices:", error);
    throw error;
  }
}

/**
 * 获取A股股票实时行情
 */
export async function fetchAShareQuote(stockCode: string) {
  try {
    // 处理带市场前缀的代码（如 sz300750）或纯数字代码（如 300750）
    let fullCode = stockCode;
    let pureCode = stockCode;
    
    if (stockCode.startsWith('sh') || stockCode.startsWith('sz')) {
      // 已经带前缀
      fullCode = stockCode;
      pureCode = stockCode.substring(2);
    } else {
      // 纯数字代码，需要添加前缀
      const prefix = stockCode.startsWith("6") ? "sh" : "sz";
      fullCode = `${prefix}${stockCode}`;
      pureCode = stockCode;
    }

    // 使用腾讯财经API（更稳定）
    const response = await apiClient.get(
      `https://qt.gtimg.cn/q=${fullCode}`,
      { responseType: 'arraybuffer' }
    );

    const decoder = new TextDecoder('gbk');
    const text = decoder.decode(response.data);

    // 解析腾讯财经返回格式: v_sz300750="51~宁德时代~300750~596.00~..."
    const match = text.match(/v_.+?="(.+?)";/);
    if (!match) throw new Error("Invalid stock code");

    const fields = match[1].split("~");

    return {
      code: pureCode,
      name: fields[1],
      currentPrice: parseFloat(fields[3]),
      change: parseFloat(fields[31]),
      changePercent: parseFloat(fields[32]),
      open: parseFloat(fields[5]),
      high: parseFloat(fields[33]),
      low: parseFloat(fields[34]),
      close: parseFloat(fields[4]),
      volume: parseInt(fields[6]),
      amount: parseFloat(fields[37]),
      timestamp: fields[30],
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
        // 东方财富的价格字段需要除以100（不是1000）
        const price = (item.f2 || 0) / 100;
        const high = (item.f15 || 0) / 100;
        const low = (item.f16 || 0) / 100;
        const open = (item.f17 || 0) / 100;
        const close = (item.f18 || 0) / 100;

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
