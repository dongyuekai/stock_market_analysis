import { NextRequest, NextResponse } from "next/server";
import { fetchHotStocks } from "@/lib/stockApi";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = (searchParams.get("type") || "rise") as
      | "rise"
      | "fall"
      | "volume";
    const limit = parseInt(searchParams.get("limit") || "20");

    const hotStocks = await fetchHotStocks(type, limit);

    return NextResponse.json({
      success: true,
      data: hotStocks,
    });
  } catch (error) {
    console.error("Error in hot stocks API:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch hot stocks",
      },
      { status: 500 }
    );
  }
}
