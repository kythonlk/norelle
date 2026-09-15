import { getApiBase, resolveProxyUrl } from './api';

export interface Product {
  id: string;
  title: string;
  slug: string;
  sku: string;
  description: string;
  short_description: string;
  price: number;
  compare_at_price?: number;
  category: string;
  category_slug: string;
  tags: string[];
  images: { id: string; url: string; alt_text?: string; is_primary?: boolean }[];
  rating: number;
  review_count: number;
  is_featured?: boolean;
}

export const NORELLA_PRODUCTS: Product[] = [
  {
    id: "nor-prod-1",
    title: "24K Gold Aurum Radiance Facial Glow Serum",
    slug: "24k-gold-aurum-radiance-glow-serum",
    sku: "NOR-GLW-01",
    description: "Enriched with pure 24-karat gold flakes, Kashmiri botanical saffron extract, and cold-pressed marula oil. Deeply nourishes skin, reduces fine lines, stimulates cellular regeneration, and imparts an ethereal luminous golden glow suitable for South Asian skin tones.",
    short_description: "Pure 24K gold flakes and Kashmiri saffron glow serum for luminous, youthful skin.",
    price: 12500,
    compare_at_price: 15000,
    category: "Cosmetics & Skincare",
    category_slug: "cosmetics-skincare",
    tags: ["cosmetics", "skincare", "gold serum", "glow", "ayurvedic"],
    images: [
      { id: "img1", url: "/images/serum.jpg", alt_text: "24K Gold Aurum Radiance Facial Glow Serum", is_primary: true }
    ],
    rating: 4.9,
    review_count: 38,
    is_featured: true
  },
  {
    id: "nor-prod-2",
    title: "Royal Kundan & 22K Gold Plated Temple Choker Set",
    slug: "royal-kundan-22k-gold-plated-choker-set",
    sku: "NOR-JWL-01",
    description: "Handcrafted by master heirloom artisans with authentic 22K micro-gold electroplating, uncut Polki stones, fine emerald meenakari enamel inlay, and natural freshwater pearl drops. Includes matching chandelier jhumkas and adjustable golden zari cord (dori).",
    short_description: "Handcrafted 22K gold-plated heirloom Kundan choker necklace with matching jhumkas.",
    price: 28500,
    compare_at_price: 34000,
    category: "Gold-Plated Jewellery",
    category_slug: "gold-plated-jewellery",
    tags: ["jewellery", "gold plated", "kundan", "bridal", "temple jewellery"],
    images: [
      { id: "img2", url: "/images/jewel.jpg", alt_text: "Royal Kundan 22K Gold Plated Choker Set", is_primary: true }
    ],
    rating: 5.0,
    review_count: 29,
    is_featured: true
  },
  {
    id: "nor-prod-3",
    title: "Pure Kanchipuram Peacock Emerald Silk Saree with Gold Zari",
    slug: "pure-kanchipuram-peacock-emerald-silk-saree",
    sku: "NOR-SAR-01",
    description: "Woven with 100% pure mulberry silk in the historic temple town of Kanchipuram. Features rich golden zari brocade peacock pallu, traditional korvai interlocked temple borders, and comes with an unstitched contrast silk blouse piece. Certified with the official Silk Mark of authenticity.",
    short_description: "Authentic Kanchipuram handloom silk saree with pure gold zari peacock borders.",
    price: 48000,
    compare_at_price: 58000,
    category: "Indian Sarees",
    category_slug: "indian-sarees",
    tags: ["sarees", "kanchipuram", "silk saree", "indian saree", "bridal saree"],
    images: [
      { id: "img3", url: "/images/saree.jpg", alt_text: "Pure Kanchipuram Peacock Emerald Silk Saree", is_primary: true }
    ],
    rating: 4.95,
    review_count: 42,
    is_featured: true
  }
];

export async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${getApiBase()}/products`, {
      headers: { "X-Store-ID": "store_norella" },
      signal: AbortSignal.timeout(3000)
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.data && data.data.length > 0) {
        // Map backend product to storefront product with image fallbacks
        return data.data.map((p: any) => {
          const fallback = NORELLA_PRODUCTS.find(np => np.slug === p.slug || np.title === p.title);
          const images = p.images && p.images.length > 0
            ? p.images.map((img: any) => ({ ...img, url: resolveProxyUrl(img.url) }))
            : (fallback?.images || [{ id: "img", url: "/images/serum.jpg", alt_text: p.title, is_primary: true }]);
          return {
            id: p.id,
            title: p.title,
            slug: p.slug,
            sku: p.sku || "NOR-01",
            description: p.description || fallback?.description || "",
            short_description: p.short_description || fallback?.short_description || "",
            price: Number(p.price) || fallback?.price || 12500,
            compare_at_price: p.compare_at_price ? Number(p.compare_at_price) : fallback?.compare_at_price,
            category: fallback?.category || "Luxury Collection",
            category_slug: fallback?.category_slug || "luxury",
            tags: p.tags || fallback?.tags || [],
            images,
            rating: p.avg_rating || fallback?.rating || 5.0,
            review_count: p.review_count || fallback?.review_count || 12,
            is_featured: p.is_featured ?? true
          };
        });
      }
    }
  } catch (err) {
    // Fallback to static catalog during build or offline
  }
  return NORELLA_PRODUCTS;
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const products = await getProducts();
  return products.find(p => p.slug === slug);
}
