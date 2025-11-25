import { NextResponse } from "next/server";
import axios from "axios";

// 东方财富股票搜索API
async function searchFromEastMoney(keyword: string) {
  try {
    // 使用东方财富的搜索接口
    const response = await axios.get(
      `https://searcha.eastmoney.com/bussearch`,
      {
        params: {
          name: keyword,
          type: 8, // 8表示股票
          count: 30,
        },
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
        timeout: 5000,
      }
    );

    if (response.data && response.data.Data) {
      const stocks = response.data.Data || [];
      return stocks.map((item: any) => {
        // 解析代码
        const code = item.Code || "";
        const market = item.MktNum;
        let prefix = "sh";
        
        // 1:上海 0:深圳
        if (market === "0" || market === 0) {
          prefix = "sz";
        }
        
        return {
          code: `${prefix}${code}`,
          name: item.Name || item.SecurityName,
          pinyin: item.PinYin?.toLowerCase() || "",
        };
      }).filter((item: any) => item.code && item.name);
    }
    return [];
  } catch (error) {
    console.error("Error searching from EastMoney:", error);
    return [];
  }
}

// 新浪财经搜索API（备用）
async function searchFromSina(keyword: string) {
  try {
    const response = await axios.get(
      `http://suggest3.sinajs.cn/suggest/type=11,12&key=${encodeURIComponent(keyword)}`,
      {
        responseType: 'arraybuffer',
        timeout: 5000,
      }
    );

    const decoder = new TextDecoder('gbk');
    const text = decoder.decode(response.data);
    
    // 解析新浪返回格式: "var suggestvalue="600519,贵州茅台,..."
    const match = text.match(/="(.+?)"/);
    if (!match) return [];

    const items = match[1].split(";");
    return items.slice(0, 30).map((item) => {
      const parts = item.split(",");
      if (parts.length < 4) return null;
      
      const code = parts[3]; // 完整代码如 sh600519
      const name = parts[4];
      
      return {
        code: code,
        name: name,
        pinyin: "",
      };
    }).filter(Boolean);
  } catch (error) {
    console.error("Error searching from Sina:", error);
    return [];
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";

    // 如果没有搜索关键词，返回空数组
    if (!query || query.trim().length === 0) {
      return NextResponse.json({
        success: true,
        data: [],
        message: "请输入股票代码或名称",
      });
    }

    // 优先使用东方财富API搜索
    let results = await searchFromEastMoney(query);

    // 如果东方财富没有结果，尝试新浪财经
    if (results.length === 0) {
      results = await searchFromSina(query);
    }

    return NextResponse.json({
      success: true,
      data: results,
      count: results.length,
    });
  } catch (error) {
    console.error("Error searching stocks:", error);
    return NextResponse.json(
      {
        success: false,
        error: "搜索失败，请稍后重试",
      },
      { status: 500 }
    );
  }
}
