import { NextRequest, NextResponse } from "next/server";
import { fetchAShareIndices } from "@/lib/stockApi";

export async function GET(request: NextRequest) {
  try {
    const indices = await fetchAShareIndices();

    return NextResponse.json({
      success: true,
      data: indices,
    });
  } catch (error) {
    console.error("Error in indices API:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch market indices",
      },
      { status: 500 }
    );
  }
}
