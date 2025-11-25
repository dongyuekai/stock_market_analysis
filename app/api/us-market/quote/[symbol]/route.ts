import { NextRequest, NextResponse } from "next/server";
import { fetchUSStockQuote } from "@/lib/usStockApi";

export async function GET(
  request: NextRequest,
  { params }: { params: { symbol: string } }
) {
  try {
    const symbol = params.symbol;
    const quote = await fetchUSStockQuote(symbol);

    return NextResponse.json({
      success: true,
      data: quote,
    });
  } catch (error) {
    console.error("Error in US stock quote API:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch US stock quote",
      },
      { status: 500 }
    );
  }
}
