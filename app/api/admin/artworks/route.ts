import { NextRequest, NextResponse } from "next/server";
import {
  getStoredArtworks,
  saveArtworkToStore,
  deleteArtworkFromStore,
  updateArtworkStockInStore,
  toggleArtworkFeaturedInStore,
  updateArtworkCoordsInStore,
} from "@/lib/admin-store";
import type { ArtworkDetail } from "@/lib/artworks-data";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const featuredOnly = searchParams.get("featured") === "true";
    const q = searchParams.get("q")?.toLowerCase();

    let list = getStoredArtworks();

    if (category && category !== "all") {
      list = list.filter((a) => a.category.toLowerCase().includes(category.toLowerCase()));
    }

    if (featuredOnly) {
      list = list.filter((a) => a.isFeatured);
    }

    if (q) {
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.material.toLowerCase().includes(q) ||
          a.collectionName.toLowerCase().includes(q)
      );
    }

    return NextResponse.json({
      artworks: list,
      total: list.length,
    });
  } catch (error) {
    console.error("GET /api/admin/artworks error:", error);
    return NextResponse.json({ error: "Eserler alınamadı." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.title) {
      return NextResponse.json({ error: "Eser başlığı zorunludur." }, { status: 400 });
    }

    const newId = body.id || `art-${Date.now()}`;
    const slug = body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const rawPrice = Number(body.rawPrice || body.price?.toString().replace(/[^0-9]/g, "") || 0);

    const newArtwork: ArtworkDetail = {
      id: newId,
      slug,
      title: body.title,
      collectionName: body.collectionName || "nonvalue — object (2025)",
      category: body.category || "Heykel & Obje",
      categoryEn: body.categoryEn || "Sculpture & Object",
      price: body.price || `₺${rawPrice.toLocaleString("tr-TR")}`,
      rawPrice: rawPrice || 0,
      stock: Number(body.stock ?? 1),
      isUniquePiece: Boolean(body.isUniquePiece ?? true),
      year: body.year || "2025",
      material: body.material || "925 Gümüş & Döküm Bronz",
      materialEn: body.materialEn || "925 Sterling Silver & Cast Bronze",
      dimensions: body.dimensions || "Değişken Ebat",
      dimensionsEn: body.dimensionsEn || "Variable Dimensions",
      weight: body.weight || "15 gr",
      technique: body.technique || "Kayıp mum dökümü & serbest ateş füzyonu",
      techniqueEn: body.techniqueEn || "Lost-wax casting & open flame fusion",
      finish: body.finish || "Ham döküm dokusu & mat patine",
      finishEn: body.finishEn || "Raw cast texture & matte patina",
      description: body.description || "",
      descriptionEn: body.descriptionEn || "",
      editorialNote: body.editorialNote || "Atölye Arşivi",
      editorialNoteEn: body.editorialNoteEn || "Studio Archive",
      images: Array.isArray(body.images) && body.images.length > 0 ? body.images : [
        "/artworks/744a7950cff34beaff3f06e308a540a0.jpg"
      ],
      specs: Array.isArray(body.specs) ? body.specs : [
        { label: "Koleksiyon", value: body.collectionName || "nonvalue / object" },
        { label: "Maden / Malzeme", value: body.material || "925 Som Gümüş" },
        { label: "Edisyon", value: body.isUniquePiece ? "1/1 — Tek ve Eşsiz Eser" : "Limitli Seri" },
      ],
      specsEn: Array.isArray(body.specsEn) ? body.specsEn : [
        { label: "Collection", value: body.collectionName || "nonvalue / object" },
        { label: "Metal / Material", value: body.materialEn || "925 Sterling Silver" },
        { label: "Edition", value: body.isUniquePiece ? "1/1 — Unique Piece" : "Limited Edition" },
      ],
      isFeatured: Boolean(body.isFeatured),
      archiveCoords: body.archiveCoords || { x: 50, y: 50 },
    };

    const saved = saveArtworkToStore(newArtwork);
    return NextResponse.json({ success: true, artwork: saved });
  } catch (error) {
    console.error("POST /api/admin/artworks error:", error);
    return NextResponse.json({ error: "Eser kaydedilirken hata oluştu." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, action, stock, coords } = body;

    if (!id) {
      return NextResponse.json({ error: "Eser ID'si belirtilmelidir." }, { status: 400 });
    }

    if (action === "toggle-featured") {
      const isFeatured = toggleArtworkFeaturedInStore(id);
      return NextResponse.json({ success: true, isFeatured });
    }

    if (action === "update-stock" && typeof stock === "number") {
      const updated = updateArtworkStockInStore(id, stock);
      return NextResponse.json({ success: true, artwork: updated });
    }

    if (action === "update-coords" && coords) {
      const ok = updateArtworkCoordsInStore(id, coords);
      return NextResponse.json({ success: ok, coords });
    }

    // Full update
    const saved = saveArtworkToStore(body);
    return NextResponse.json({ success: true, artwork: saved });
  } catch (error) {
    console.error("PUT /api/admin/artworks error:", error);
    return NextResponse.json({ error: "Eser güncellenemedi." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Silinecek eser ID'si gereklidir." }, { status: 400 });
    }

    const success = deleteArtworkFromStore(id);
    return NextResponse.json({ success });
  } catch (error) {
    console.error("DELETE /api/admin/artworks error:", error);
    return NextResponse.json({ error: "Eser silinemedi." }, { status: 500 });
  }
}
