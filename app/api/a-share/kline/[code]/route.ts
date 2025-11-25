import { NextRequest, NextResponse } from "next/server";
import { fetchKlineData } from "@/lib/stockApi";

export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    const code = params.code;
    const searchParams = request.nextUrl.searchParams;
    const period = searchParams.get("period") || "day";
    const count = parseInt(searchParams.get("count") || "100");

    const klineData = await fetchKlineData(code, period, count);

    return NextResponse.json({
      success: true,
      data: klineData,
    });
  } catch (error) {
    console.error("Error in kline API:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch kline data",
      },
      { status: 500 }
    );
  }
}
