import axios from "axios";

// 配置axios实例
const apiClient = axios.create({
  timeout: 15000,
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    Accept: "*/*",
    Referer: "https://gu.qq.com/",
  },
});

/**
 * 解析腾讯财经API返回的数据
 * 格式：v_usAAPL="200~苹果~AAPL.OQ~275.92~271.49~270.90~..."
 */
function parseTencentData(data: string) {
  const matches = data.match(/v_us\w+="([^"]+)"/g);
  if (!matches) return [];

  return matches
    .map((match) => {
      const content = match.match(/"([^"]+)"/)?.[1];
      if (!content) return null;

      const fields = content.split("~");
      const currentPrice = parseFloat(fields[3]) || 0;
      const prevClose = parseFloat(fields[4]) || 0;
      const open = parseFloat(fields[5]) || 0;
      const volume = parseInt(fields[6]) || 0;
      const high = parseFloat(fields[33]) || 0;
      const low = parseFloat(fields[34]) || 0;
      const change = currentPrice - prevClose;
      const changePercent = prevClose > 0 ? (change / prevClose) * 100 : 0;

      return {
        code: fields[2]?.split(".")[0] || "",
        name: fields[1] || "",
        currentPrice,
        change,
        changePercent,
        open,
        high,
        low,
        close: prevClose,
        volume,
        amount: volume * currentPrice,
        timestamp: fields[30] || new Date().toLocaleString("zh-CN"),
      };
    })
    .filter(Boolean);
}

/**
 * 获取美股主要指数（道琼斯、纳斯达克、标普500）
 */
export async function fetchUSIndices() {
  try {
    // 使用腾讯财经API获取美股三大指数
    // usDJI = 道琼斯, usIXIC = 纳斯达克, usINX = 标普500
    const response = await apiClient.get(
      "https://qt.gtimg.cn/q=usDJI,usIXIC,usINX",
      { responseType: "arraybuffer" }
    );

    // 将GB2312编码转为UTF-8
    const decoder = new TextDecoder("gbk");
    const data = decoder.decode(response.data);

    const stocks = parseTencentData(data);

    return stocks
      .filter((stock): stock is NonNullable<typeof stock> => stock !== null)
      .map((stock) => ({
        code: stock.code,
        name: stock.name,
        currentValue: stock.currentPrice,
        change: stock.change,
        changePercent: stock.changePercent,
        open: stock.open,
        high: stock.high,
        low: stock.low,
        close: stock.close,
        volume: stock.volume,
        amount: stock.amount,
        timestamp: stock.timestamp,
      }));
  } catch (error: any) {
    console.error("Error fetching US indices:", error.message);
    return generateMockUSIndices();
  }
}

function generateMockUSIndices() {
  const baseIndices = [
    { code: ".DJI", name: "道琼斯工业平均指数", baseValue: 44000 },
    { code: ".IXIC", name: "纳斯达克综合指数", baseValue: 19000 },
    { code: ".INX", name: "标准普尔500指数", baseValue: 6000 },
  ];

  return baseIndices.map((index) => {
    const changePercent = (Math.random() - 0.5) * 2;
    const currentValue = index.baseValue * (1 + changePercent / 100);
    const prevClose = index.baseValue;
    const change = currentValue - prevClose;

    return {
      code: index.code,
      name: index.name,
      currentValue: parseFloat(currentValue.toFixed(2)),
      change: parseFloat(change.toFixed(2)),
      changePercent: parseFloat(changePercent.toFixed(2)),
      open: prevClose,
      high: currentValue * 1.01,
      low: currentValue * 0.99,
      close: prevClose,
      volume: Math.floor(Math.random() * 5000000000) + 3000000000,
      amount: 0,
      timestamp: new Date().toLocaleString("zh-CN"),
    };
  });
}

/**
 * 获取美股个股行情
 */
export async function fetchUSStockQuote(symbol: string) {
  try {
    const response = await apiClient.get(
      `https://qt.gtimg.cn/q=us${symbol.toUpperCase()}`,
      { responseType: "arraybuffer" }
    );

    // 将GB2312编码转为UTF-8
    const decoder = new TextDecoder("gbk");
    const data = decoder.decode(response.data);

    const stocks = parseTencentData(data);
    if (stocks.length === 0 || !stocks[0]) {
      throw new Error("Invalid stock symbol");
    }

    return stocks[0];
  } catch (error) {
    console.error("Error fetching US stock quote:", error);
    throw error;
  }
}

/**
 * 获取热门美股列表
 */
export async function fetchHotUSStocks(limit: number = 20) {
  try {
    // 在美上市的中概股
    const chineseStocks = [
      "BABA", // 阿里巴巴
      "JD", // 京东
      "PDD", // 拼多多
      "BIDU", // 百度
      "NIO", // 蔚来
      "XPEV", // 小鹏
      "LI", // 理想
      "BILI", // 哔哩哔哩
      "IQ", // 爱奇艺
      "NTES", // 网易
      "TME", // 腾讯音乐
      "YMM", // 满帮
      "VIPS", // 唯品会
      "DIDI", // 滴滴
      "EDU", // 新东方
      "TAL", // 好未来
      "YUMC", // 百胜中国
      "WB", // 微博
      "ATHM", // 汽车之家
      "TIGR", // 老虎证券
    ];

    const symbols = chineseStocks
      .slice(0, limit)
      .map((s) => `us${s}`)
      .join(",");

    const response = await apiClient.get(`https://qt.gtimg.cn/q=${symbols}`, {
      responseType: "arraybuffer",
    });

    // 将GB2312编码转为UTF-8
    const decoder = new TextDecoder("gbk");
    const data = decoder.decode(response.data);

    const stocks = parseTencentData(data);

    return stocks
      .filter((stock): stock is NonNullable<typeof stock> => stock !== null)
      .map((stock) => ({
        code: stock.code,
        name: stock.name,
        currentPrice: stock.currentPrice,
        changePercent: stock.changePercent,
        volume: stock.volume,
        amount: stock.amount,
        high: stock.high,
        low: stock.low,
        open: stock.open,
      }))
      .sort((a, b) => b.changePercent - a.changePercent);
  } catch (error: any) {
    console.error("Error fetching hot US stocks:", error.message);
    return generateMockHotUSStocks(limit);
  }
}

/**
 * 生成模拟热门美股数据
 */
function generateMockHotUSStocks(limit: number = 20) {
  const stockNames = [
    { code: "AAPL", name: "苹果" },
    { code: "MSFT", name: "微软" },
    { code: "GOOGL", name: "谷歌" },
    { code: "AMZN", name: "亚马逊" },
    { code: "TSLA", name: "特斯拉" },
    { code: "META", name: "Meta" },
    { code: "NVDA", name: "英伟达" },
    { code: "AMD", name: "AMD" },
    { code: "NFLX", name: "奈飞" },
    { code: "DIS", name: "迪士尼" },
    { code: "BABA", name: "阿里巴巴" },
    { code: "INTC", name: "英特尔" },
    { code: "PYPL", name: "PayPal" },
    { code: "CSCO", name: "思科" },
    { code: "ORCL", name: "甲骨文" },
    { code: "CRM", name: "Salesforce" },
    { code: "UBER", name: "Uber" },
    { code: "NIO", name: "蔡来" },
    { code: "COIN", name: "Coinbase" },
    { code: "SNOW", name: "Snowflake" },
  ];

  return stockNames
    .slice(0, limit)
    .map((stock) => {
      const basePrice = 50 + Math.random() * 200;
      const changePercent = (Math.random() - 0.4) * 8; // -3.2% 到 +4.8%
      const currentPrice = basePrice * (1 + changePercent / 100);
      const open = basePrice + (Math.random() - 0.5) * basePrice * 0.02;
      const high = currentPrice + Math.random() * basePrice * 0.03;
      const low = currentPrice - Math.random() * basePrice * 0.03;

      return {
        code: stock.code,
        name: stock.name,
        currentPrice: parseFloat(currentPrice.toFixed(2)),
        changePercent: parseFloat(changePercent.toFixed(2)),
        volume: Math.floor(Math.random() * 50000000) + 5000000,
        amount: 0,
        high: parseFloat(high.toFixed(2)),
        low: parseFloat(low.toFixed(2)),
        open: parseFloat(open.toFixed(2)),
      };
    })
    .sort((a, b) => b.changePercent - a.changePercent);
}

/**
 * 获取美股K线数据
 */
export async function fetchUSKlineData(
  symbol: string,
  period: string = "day",
  count: number = 100
) {
  try {
    // 使用Yahoo Finance API的替代方案
    // 注意：实际生产环境建议使用付费的金融数据API
    const sinaSymbol = `gb_${symbol.toLowerCase()}`;

    // 新浪财经K线数据
    const periodMap: { [key: string]: string } = {
      day: "240",
      week: "1200",
      month: "7200",
    };

    const scale = periodMap[period] || "240";

    const response = await apiClient.get(
      `https://stock.finance.sina.com.cn/usstock/api/jsonp_v2.php/var=/US_MinKlineApi.getMinKline`,
      {
        params: {
          symbol: sinaSymbol,
          scale: scale,
          datalen: count,
        },
      }
    );

    // 解析JSONP响应
    const jsonpMatch = response.data.match(/var=\((.+)\)/);
    if (jsonpMatch) {
      const data = JSON.parse(jsonpMatch[1]);
      if (Array.isArray(data)) {
        return data.map((item: any) => ({
          date: item.d,
          open: parseFloat(item.o),
          high: parseFloat(item.h),
          low: parseFloat(item.l),
          close: parseFloat(item.c),
          volume: parseInt(item.v),
          amount: parseFloat(item.v) * parseFloat(item.c),
        }));
      }
    }

    throw new Error("Invalid K-line data format");
  } catch (error) {
    console.error("Error fetching US kline data:", error);
    // 返回空数组，前端会显示暂无数据
    return [];
  }
}
