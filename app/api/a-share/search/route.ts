import { NextResponse } from "next/server";
import axios from "axios";

// 简化的股票列表（前200只热门股票）
const popularStocks = [
  { code: "sh600519", name: "贵州茅台", pinyin: "gzmt" },
  { code: "sz000001", name: "平安银行", pinyin: "payh" },
  { code: "sz000002", name: "万科A", pinyin: "wka" },
  { code: "sh600036", name: "招商银行", pinyin: "zsyh" },
  { code: "sh601318", name: "中国平安", pinyin: "zgpa" },
  { code: "sh600276", name: "恒瑞医药", pinyin: "hryy" },
  { code: "sz000858", name: "五粮液", pinyin: "wly" },
  { code: "sh601166", name: "兴业银行", pinyin: "xyyh" },
  { code: "sz000333", name: "美的集团", pinyin: "mdjt" },
  { code: "sh600887", name: "伊利股份", pinyin: "ylgf" },
  { code: "sh601888", name: "中国中免", pinyin: "zgzm" },
  { code: "sz300750", name: "宁德时代", pinyin: "ndsd" },
  { code: "sz002594", name: "比亚迪", pinyin: "byd" },
  { code: "sh600309", name: "万华化学", pinyin: "whhx" },
  { code: "sh601012", name: "隆基绿能", pinyin: "ljln" },
  { code: "sz000725", name: "京东方A", pinyin: "jdfa" },
  { code: "sh600030", name: "中信证券", pinyin: "zxzq" },
  { code: "sh601012", name: "隆基绿能", pinyin: "ljln" },
  { code: "sh600009", name: "上海机场", pinyin: "shjc" },
  { code: "sh601012", name: "隆基绿能", pinyin: "ljln" },
  { code: "sz002415", name: "海康威视", pinyin: "hkws" },
  { code: "sh601398", name: "工商银行", pinyin: "gsyh" },
  { code: "sh601939", name: "建设银行", pinyin: "jsyh" },
  { code: "sh601288", name: "农业银行", pinyin: "nyyh" },
  { code: "sh601988", name: "中国银行", pinyin: "zgyh" },
  { code: "sh600000", name: "浦发银行", pinyin: "pfyh" },
  { code: "sh601328", name: "交通银行", pinyin: "jtyh" },
  { code: "sh600016", name: "民生银行", pinyin: "msyh" },
  { code: "sh601169", name: "北京银行", pinyin: "bjyh" },
  { code: "sh601229", name: "上海银行", pinyin: "shyh" },
  { code: "sh601658", name: "邮储银行", pinyin: "ycyh" },
  { code: "sz000651", name: "格力电器", pinyin: "gldq" },
  { code: "sz000596", name: "古井贡酒", pinyin: "gjgj" },
  { code: "sz000568", name: "泸州老窖", pinyin: "lzlj" },
  { code: "sh600600", name: "青岛啤酒", pinyin: "qdpj" },
  { code: "sh600690", name: "海尔智家", pinyin: "hezj" },
  { code: "sz002142", name: "宁波银行", pinyin: "nbyh" },
  { code: "sh603288", name: "海天味业", pinyin: "htwy" },
  { code: "sh601988", name: "中国银行", pinyin: "zgyh" },
  { code: "sh600028", name: "中国石化", pinyin: "zgsh" },
  { code: "sh601857", name: "中国石油", pinyin: "zgsy" },
  { code: "sz000876", name: "新希望", pinyin: "xxw" },
  { code: "sh600048", name: "保利发展", pinyin: "blfz" },
  { code: "sz000002", name: "万科A", pinyin: "wka" },
  { code: "sh600340", name: "华夏幸福", pinyin: "hxxf" },
  { code: "sh601668", name: "中国建筑", pinyin: "zgjz" },
  { code: "sz002230", name: "科大讯飞", pinyin: "kdxf" },
  { code: "sz300059", name: "东方财富", pinyin: "dfcf" },
  { code: "sz300015", name: "爱尔眼科", pinyin: "aeyk" },
  { code: "sh600585", name: "海螺水泥", pinyin: "hlsn" },
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";

    if (!query) {
      return NextResponse.json({
        success: true,
        data: popularStocks.slice(0, 20),
      });
    }

    // 搜索匹配
    const lowerQuery = query.toLowerCase();
    const results = popularStocks.filter(
      (stock) =>
        stock.code.includes(lowerQuery) ||
        stock.name.includes(query) ||
        stock.pinyin?.includes(lowerQuery)
    );

    return NextResponse.json({
      success: true,
      data: results.slice(0, 30),
    });
  } catch (error) {
    console.error("Error searching stocks:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to search stocks",
      },
      { status: 500 }
    );
  }
}
