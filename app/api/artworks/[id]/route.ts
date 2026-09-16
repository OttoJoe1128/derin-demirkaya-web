import { NextRequest, NextResponse } from "next/server";
import { getArtworkByIdOrSlug } from "@/lib/artworks-data";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const artwork = getArtworkByIdOrSlug(id);

  if (!artwork) {
    return NextResponse.json(
      { error: "Eser bulunamadı." },
      { status: 404 }
    );
  }

  return NextResponse.json({ artwork });
}
