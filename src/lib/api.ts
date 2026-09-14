export interface Product {
  id: string;
  store_id: string;
  title: string;
  slug: string;
  sku: string;
  description: string;
  short_description: string;
  price: number;
  compare_at_price: number | null;
  status: string;
  is_featured: boolean;
  category_name?: string;
  category_slug?: string;
  tags: string[];
  images: Array<{
    id: string;
    url: string;
    alt_text: string;
    is_primary: boolean;
  }>;
  total_stock: number;
  avg_rating: number;
  review_count: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
}

const API_BASE = import.meta.env.CATALOG_API_URL;
const STORE_ID = "store_norella";

export const FALLBACK_PRODUCTS: Product[] = [
  {
    id: "nor-prod-1",
    store_id: STORE_ID,
    title: "24K Gold Aurum Radiance Facial Glow Serum",
    slug: "24k-gold-aurum-radiance-glow-serum",
    sku: "NOR-GLW-01",
    description: "<p>Enriched with pure 24-karat gold micro-flakes, rare Kashmiri saffron extract, and cold-pressed botanical marula oil. Deeply nourishes skin, reduces fine lines, and imparts an ethereal luminous golden radiance.</p><p>Formulated especially for tropical climates, this fast-absorbing elixir leaves zero greasy residue while locking in moisture for 24 hours.</p>",
    short_description: "Pure 24K gold flakes and Kashmiri saffron glow serum for luminous radiant skin.",
    price: 12500,
    compare_at_price: 15000,
    status: "active",
    is_featured: true,
    category_name: "Cosmetics & Skincare",
    category_slug: "cosmetics-skincare",
    tags: ["cosmetics", "skincare", "gold serum", "glow", "ayurvedic"],
    images: [
      { id: "img-1", url: "/images/serum.jpg", alt_text: "24K Gold Aurum Radiance Facial Glow Serum", is_primary: true }
    ],
    total_stock: 45,
    avg_rating: 4.9,
    review_count: 38
  },
  {
    id: "nor-prod-2",
    store_id: STORE_ID,
    title: "Royal Kundan & 22K Gold Plated Temple Choker Set",
    slug: "royal-kundan-22k-gold-plated-choker-set",
    sku: "NOR-JWL-01",
    description: "<p>Handcrafted by master goldsmiths with heirloom-quality 22K micro-gold plating, uncut Polki stones, fine emerald enamel meenakari inlay, and natural freshwater pearl drops. Set includes a grand choker necklace and matching statement jhumka earrings.</p><p>Protected with anti-tarnish microscopic coating to preserve pristine luster for years of wedding celebrations and grand events.</p>",
    short_description: "Handcrafted 22K gold-plated heirloom Kundan choker necklace with matching earrings.",
    price: 28500,
    compare_at_price: 34000,
    status: "active",
    is_featured: true,
    category_name: "Gold-Plated Jewellery",
    category_slug: "gold-plated-jewellery",
    tags: ["jewellery", "gold plated", "kundan", "bridal", "temple jewellery"],
    images: [
      { id: "img-2", url: "/images/jewel.jpg", alt_text: "Royal Kundan 22K Gold Plated Choker Set", is_primary: true }
    ],
    total_stock: 30,
    avg_rating: 5.0,
    review_count: 29
  },
  {
    id: "nor-prod-3",
    store_id: STORE_ID,
    title: "Pure Kanchipuram Peacock Emerald Silk Saree with Gold Zari",
    slug: "pure-kanchipuram-peacock-emerald-silk-saree",
    sku: "NOR-SAR-01",
    description: "<p>Woven with 100% pure mulberry silk in the historic temple town of Kanchipuram. Features rich golden zari brocade peacock pallu and traditional korvai temple borders. Silk Mark Certified with unstitched matching pure silk blouse piece.</p><p>An opulent bridal treasure that drapes like royalty with rich lustrous emerald jewel tones.</p>",
    short_description: "Authentic Kanchipuram handloom silk saree with pure gold zari peacock borders.",
    price: 48000,
    compare_at_price: 58000,
    status: "active",
    is_featured: true,
    category_name: "Indian Sarees",
    category_slug: "indian-sarees",
    tags: ["sarees", "kanchipuram", "silk saree", "indian saree", "bridal saree"],
    images: [
      { id: "img-3", url: "/images/saree.jpg", alt_text: "Pure Kanchipuram Peacock Emerald Silk Saree", is_primary: true }
    ],
    total_stock: 20,
    avg_rating: 4.95,
    review_count: 42
  },
  {
    id: "nor-prod-4",
    store_id: STORE_ID,
    title: "Ayurvedic Kumkumadi Miracle Youth Night Oil 30ml",
    slug: "ayurvedic-kumkumadi-miracle-youth-night-oil",
    sku: "NOR-GLW-02",
    description: "<p>Authentic ancient recipe containing 26 precious herbs, red sandalwood, vetiver, and pure saffron stigmas infused in organic cold-pressed sesame oil. Brightens hyperpigmentation and evens skin tone overnight.</p>",
    short_description: "Ancient 26-herb Ayurvedic formulation for overnight complexion renewal.",
    price: 8900,
    compare_at_price: 11000,
    status: "active",
    is_featured: false,
    category_name: "Cosmetics & Skincare",
    category_slug: "cosmetics-skincare",
    tags: ["cosmetics", "skincare", "ayurvedic", "kumkumadi", "night oil"],
    images: [
      { id: "img-4", url: "/images/serum.jpg", alt_text: "Ayurvedic Kumkumadi Miracle Youth Night Oil", is_primary: true }
    ],
    total_stock: 50,
    avg_rating: 4.85,
    review_count: 24
  },
  {
    id: "nor-prod-5",
    store_id: STORE_ID,
    title: "South Indian Matte Temple Lakshmi Bangle Pair",
    slug: "south-indian-matte-temple-lakshmi-bangle-pair",
    sku: "NOR-JWL-02",
    description: "<p>Stunning 22K antique matte finish temple kada bangles sculpted with Goddess Lakshmi motifs and studded with ruby red kemp stones. Adjustable screw lock mechanism fitting sizes 2.4 to 2.8.</p>",
    short_description: "Antique 22K gold-plated Goddess Lakshmi bangles with ruby kemp stones.",
    price: 14200,
    compare_at_price: 18000,
    status: "active",
    is_featured: false,
    category_name: "Gold-Plated Jewellery",
    category_slug: "gold-plated-jewellery",
    tags: ["jewellery", "bangles", "temple jewellery", "lakshmi", "gold plated"],
    images: [
      { id: "img-5", url: "/images/jewel.jpg", alt_text: "South Indian Matte Temple Lakshmi Bangle Pair", is_primary: true }
    ],
    total_stock: 35,
    avg_rating: 4.9,
    review_count: 18
  },
  {
    id: "nor-prod-6",
    store_id: STORE_ID,
    title: "Banarasi Crimson Bridal Katan Silk Saree with Kadwa Booti",
    slug: "banarasi-crimson-bridal-katan-silk-saree",
    sku: "NOR-SAR-02",
    description: "<p>Exquisite handwoven Banarasi Katan silk saree woven in Varanasi. Adorned with delicate kadwa floral bootis in real sona-rupa zari and an opulent floral jaal bridal pallu.</p>",
    short_description: "Handcrafted Varanasi bridal Katan silk saree with intricate kadwa gold zari bootis.",
    price: 52000,
    compare_at_price: 65000,
    status: "active",
    is_featured: false,
    category_name: "Indian Sarees",
    category_slug: "indian-sarees",
    tags: ["sarees", "banarasi", "silk saree", "bridal", "crimson"],
    images: [
      { id: "img-6", url: "/images/saree.jpg", alt_text: "Banarasi Crimson Bridal Katan Silk Saree", is_primary: true }
    ],
    total_stock: 15,
    avg_rating: 5.0,
    review_count: 31
  }
];

// Additional sample pieces share collection photography until final assets are supplied.
const samplePieces = [
  ['Saffron & Rose Daily Face Oil', 'saffron-rose-daily-face-oil', 6900, 0, 'A lightweight botanical oil for a quiet moment of daily care.'],
  ['Pearl Drop Kundan Earrings', 'pearl-drop-kundan-earrings', 9800, 1, 'Delicate gold-tone details with pearl-inspired drops for every celebration.'],
  ['Antique Gold Festive Pendant Set', 'antique-gold-festive-pendant-set', 16700, 1, 'An ornate pendant and matching earrings, inspired by traditional temple designs.'],
  ['Emerald Silk Occasion Saree', 'emerald-silk-occasion-saree', 36500, 2, 'Rich emerald tones and an intricate border for memorable occasions.'],
  ['Golden Hour Botanical Care Set', 'golden-hour-botanical-care-set', 18900, 0, 'A thoughtful introduction to a slower, more considered beauty ritual.'],
  ['Heritage Zari Celebration Saree', 'heritage-zari-celebration-saree', 42500, 2, 'A statement drape with traditional motifs and warm gold accents.'],
] as const;
samplePieces.forEach(([title, slug, price, source, description], index) => {
  const base = FALLBACK_PRODUCTS[source];
  FALLBACK_PRODUCTS.push({ ...base, id: `nor-sample-${index + 7}`, title, slug, sku: `NOR-SAMPLE-${index + 7}`, price, compare_at_price: null, description: `<p>${description}</p><p>Sample product. Images are illustrative; materials, sizing and availability require confirmation.</p>`, short_description: description, is_featured: false, avg_rating: 0, review_count: 0, images: base.images.map(image => ({ ...image, alt_text: `${base.category_name} collection reference photograph` })) });
});

export async function getProducts(categorySlug?: string): Promise<Product[]> {
  if (!API_BASE) return categorySlug ? FALLBACK_PRODUCTS.filter(p => p.category_slug === categorySlug) : FALLBACK_PRODUCTS;
  try {
    const res = await fetch(`${API_BASE}/products`, {
      headers: { "X-Store-ID": STORE_ID },
      signal: AbortSignal.timeout(2000),
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        const mapped: Product[] = json.data.map((p: any) => ({
          ...p,
          images: p.images && p.images.length > 0 ? p.images.map((img: any) => ({
            ...img,
            url: img.url.startsWith("/uploads/") ? img.url.replace("/uploads/", "/images/") : img.url
          })) : [{ id: "def", url: "/images/serum.jpg", alt_text: p.title, is_primary: true }]
        }));
        if (categorySlug) {
          return mapped.filter(p => p.category_slug === categorySlug || p.tags?.includes(categorySlug));
        }
        return mapped;
      }
    }
  } catch (err) {
    console.warn("Backend API offline or slow, using resilient catalog fallback", err);
  }

  if (categorySlug) {
    return FALLBACK_PRODUCTS.filter(p => p.category_slug === categorySlug || p.tags.includes(categorySlug));
  }
  return FALLBACK_PRODUCTS;
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const all = await getProducts();
  return all.find(p => p.slug === slug) || FALLBACK_PRODUCTS.find(p => p.slug === slug);
}
