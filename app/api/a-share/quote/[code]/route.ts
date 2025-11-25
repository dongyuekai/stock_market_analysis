import { NextRequest, NextResponse } from "next/server";
import { fetchAShareQuote, fetchOrderBook } from "@/lib/stockApi";

export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    const code = params.code;

    const [quote, orderBook] = await Promise.all([
      fetchAShareQuote(code),
      fetchOrderBook(code).catch(() => null),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        ...quote,
        orderBook,
      },
    });
  } catch (error) {
    console.error("Error in stock quote API:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch stock quote",
      },
      { status: 500 }
    );
  }
}
