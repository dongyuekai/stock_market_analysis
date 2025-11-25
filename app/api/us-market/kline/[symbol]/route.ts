import { NextRequest, NextResponse } from "next/server";
import { fetchUSKlineData } from "@/lib/usStockApi";

export async function GET(
  request: NextRequest,
  { params }: { params: { symbol: string } }
) {
  try {
    const symbol = params.symbol;
    const searchParams = request.nextUrl.searchParams;
    const period = searchParams.get("period") || "day";
    const count = parseInt(searchParams.get("count") || "100");

    const klineData = await fetchUSKlineData(symbol, period, count);

    return NextResponse.json({
      success: true,
      data: klineData,
    });
  } catch (error) {
    console.error("Error in US kline API:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch US kline data",
      },
      { status: 500 }
    );
  }
}
