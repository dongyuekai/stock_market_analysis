import { NextRequest, NextResponse } from "next/server";
import { fetchUSIndices } from "@/lib/usStockApi";

export async function GET(request: NextRequest) {
  try {
    const indices = await fetchUSIndices();

    return NextResponse.json({
      success: true,
      data: indices,
    });
  } catch (error) {
    console.error("Error in US indices API:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch US market indices",
      },
      { status: 500 }
    );
  }
}
