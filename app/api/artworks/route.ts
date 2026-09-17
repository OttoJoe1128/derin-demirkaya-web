import { NextRequest, NextResponse } from "next/server";
import { getStoredArtworks } from "@/lib/admin-store";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const query = searchParams.get("q");

  let list = [...getStoredArtworks()];

  if (category && category !== "all") {
    list = list.filter((a) =>
      a.category.toLowerCase().includes(category.toLowerCase()) ||
      a.collectionName.toLowerCase().includes(category.toLowerCase())
    );
  }

  if (query) {
    const q = query.toLowerCase();
    list = list.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.material.toLowerCase().includes(q)
    );
  }

  return NextResponse.json({
    artworks: list,
    total: list.length,
  });
}
