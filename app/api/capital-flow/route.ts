import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

// 获取真实的主力资金流向数据
async function fetchRealCapitalFlow(limit: number = 50) {
  try {
    const apiClient = axios.create({
      timeout: 10000,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        Referer: "http://data.eastmoney.com/",
      },
    });

    // 使用东方财富网的资金流向接口
    const response = await apiClient.get(
      "http://push2.eastmoney.com/api/qt/clist/get",
      {
        params: {
          pn: 1,
          pz: limit,
          po: 1,
          np: 1,
          fltt: 2,
          invt: 2,
          fid: "f62", // 按主力净流入排序
          fs: "m:0+t:6,m:0+t:80,m:1+t:2,m:1+t:23",
          fields: "f12,f14,f2,f3,f62,f184,f66,f69,f72,f75,f78,f81,f84,f87",
        },
      }
    );

    if (response.data?.data?.diff) {
      return response.data.data.diff.map((item: any) => {
        const mainNet = item.f62 || 0; // 主力净流入
        const superLargeNet = item.f66 || 0; // 超大单净流入
        const largeNet = item.f72 || 0; // 大单净流入
        const mediumNet = item.f78 || 0; // 中单净流入
        const smallNet = item.f84 || 0; // 小单净流入

        return {
          code: item.f12,
          name: item.f14,
          mainInflow: mainNet > 0 ? mainNet : 0,
          mainOutflow: mainNet < 0 ? Math.abs(mainNet) : 0,
          mainNet: mainNet,
          superLargeInflow: superLargeNet > 0 ? superLargeNet : 0,
          superLargeOutflow: superLargeNet < 0 ? Math.abs(superLargeNet) : 0,
          largeInflow: largeNet > 0 ? largeNet : 0,
          largeOutflow: largeNet < 0 ? Math.abs(largeNet) : 0,
          mediumInflow: mediumNet > 0 ? mediumNet : 0,
          mediumOutflow: mediumNet < 0 ? Math.abs(mediumNet) : 0,
          smallInflow: smallNet > 0 ? smallNet : 0,
          smallOutflow: smallNet < 0 ? Math.abs(smallNet) : 0,
          changePercent: item.f3 || 0, // 涨跌幅
          timestamp: new Date().toISOString(),
        };
      });
    }

    throw new Error("Invalid response format");
  } catch (error) {
    console.error("Error fetching real capital flow:", error);
    throw error;
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "50");

    const capitalFlow = await fetchRealCapitalFlow(limit);

    return NextResponse.json({
      success: true,
      data: capitalFlow,
    });
  } catch (error) {
    console.error("Error in capital flow API:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch capital flow",
      },
      { status: 500 }
    );
  }
}
