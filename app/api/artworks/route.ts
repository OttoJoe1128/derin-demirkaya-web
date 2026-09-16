import { NextRequest, NextResponse } from "next/server";
import { ARTWORKS_DATA } from "@/lib/artworks-data";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const query = searchParams.get("q");

  let list = [...ARTWORKS_DATA];

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
