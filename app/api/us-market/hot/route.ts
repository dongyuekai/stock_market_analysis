import { NextRequest, NextResponse } from "next/server";
import { fetchHotUSStocks } from "@/lib/usStockApi";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "20");

    const hotStocks = await fetchHotUSStocks(limit);

    return NextResponse.json({
      success: true,
      data: hotStocks,
    });
  } catch (error) {
    console.error("Error in US hot stocks API:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch hot US stocks",
      },
      { status: 500 }
    );
  }
}
