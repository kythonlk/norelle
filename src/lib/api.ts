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
  variants?: ProductVariant[];
}

export interface ProductVariant {
  id: string;
  sku: string;
  price: number;
  compare_at_price?: number | null;
  stock_quantity: number;
  options: Record<string, string>;
  image_url?: string;
  is_active: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
}

const BACKEND_URL = (
  import.meta.env.BACKEND_URL ||
  (import.meta.env.PUBLIC_API_URL && import.meta.env.PUBLIC_API_URL.startsWith('http')
    ? new URL(import.meta.env.PUBLIC_API_URL).origin
    : 'http://76.13.221.75:9488')
).replace(/\/$/, '');

export function getApiBase(): string {
  if (typeof window !== 'undefined') {
    return import.meta.env.PUBLIC_API_URL || '/api/v1';
  }
  if (import.meta.env.PUBLIC_API_URL && (import.meta.env.PUBLIC_API_URL.startsWith('http://') || import.meta.env.PUBLIC_API_URL.startsWith('https://'))) {
    return import.meta.env.PUBLIC_API_URL;
  }
  return `${BACKEND_URL}/api/v1`;
}

export const API_BASE = getApiBase();

/**
 * Normalizes image URLs so HTTP backend images are served via Vite proxy (/uploads/...),
 * arbitrary external HTTP images are routed via /proxy-image, and HTTPS/local paths are kept intact.
 */
export function resolveProxyUrl(url?: string): string {
  if (!url) return '/images/serum.jpg';

  // If already relative
  if (url.startsWith('/')) {
    return url;
  }

  // If it matches the backend origin, turn into a relative path for Vite proxy
  if (url.startsWith(BACKEND_URL)) {
    const rel = url.slice(BACKEND_URL.length);
    return rel.startsWith('/') ? rel : `/${rel}`;
  }

  // If it contains /uploads/, route via the /uploads proxy
  if (url.includes('/uploads/')) {
    return url.slice(url.indexOf('/uploads/'));
  }

  // If it's another HTTP URL, proxy it to avoid mixed content
  if (url.startsWith('http://')) {
    return `/proxy-image?url=${encodeURIComponent(url)}`;
  }

  return url;
}

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

const sareeImage = '/images/saree.jpg';
const generatedSareeImages = [
  '/images/saree-samples/01-banarasi-rose-jaal.png',
  '/images/saree-samples/02-kanchipuram-midnight-korvai.png',
  '/images/saree-samples/03-patola-saffron-geometric.png',
  '/images/saree-samples/04-mysore-ivory-zari.png',
  '/images/saree-samples/05-paithani-plum-lotus.png',
];
const sareeSamples = [
  ['Banarasi Rose Jaal Silk Saree', 'banarasi-rose-jaal-silk-saree', 42500, 'Rose pink', 'Banarasi', 'Saree with blouse piece'],
  ['Kanchipuram Midnight Blue Korvai Saree', 'kanchipuram-midnight-blue-korvai', 51000, 'Midnight blue', 'Kanchipuram', 'Saree with blouse piece'],
  ['Patola Saffron Geometric Silk Saree', 'patola-saffron-geometric-silk-saree', 47000, 'Saffron', 'Patola', 'Saree with blouse piece'],
  ['Mysore Silk Ivory Zari Saree', 'mysore-silk-ivory-zari-saree', 34500, 'Ivory', 'Mysore silk', 'Saree with blouse piece'],
  ['Paithani Plum Lotus Saree', 'paithani-plum-lotus-saree', 56000, 'Plum', 'Paithani', 'Saree with blouse piece'],
  ['Chanderi Sage Floral Saree', 'chanderi-sage-floral-saree', 23500, 'Sage', 'Chanderi', 'Saree with blouse piece'],
  ['Bandhani Ruby Gota Saree', 'bandhani-ruby-gota-saree', 29800, 'Ruby', 'Bandhani', 'Saree with blouse piece'],
  ['Tussar Silk Sandalwood Saree', 'tussar-silk-sandalwood-saree', 27800, 'Sandalwood', 'Tussar silk', 'Saree with blouse piece'],
  ['Gadwal Teal Temple Border Saree', 'gadwal-teal-temple-border-saree', 39500, 'Teal', 'Gadwal', 'Saree with blouse piece'],
] as const;

sareeSamples.forEach(([title, slug, price, color, weave, included], index) => {
  const productImage = generatedSareeImages[index] || sareeImage;
  FALLBACK_PRODUCTS.push({
    ...FALLBACK_PRODUCTS[2], id: `nor-saree-${index + 3}`, title, slug, sku: `NOR-SAR-${String(index + 3).padStart(2, '0')}`,
    price, compare_at_price: Math.round(price * 1.14), is_featured: index < 2,
    description: `<p>${weave} saree in ${color.toLowerCase()} with an elegant zari finish. ${included}.</p><p>Collection preview: confirm weave, measurements and availability before sale.</p>`,
    short_description: `${weave} saree in ${color.toLowerCase()} with an elegant zari finish.`, tags: ['sarees', 'indian-sarees', weave.toLowerCase(), color.toLowerCase()],
    images: [{ id: `saree-${index + 3}`, url: productImage, alt_text: `${title} model preview`, is_primary: true }],
    total_stock: 1, avg_rating: 0, review_count: 0,
    variants: [{ id: `sar-var-${index + 3}`, sku: `NOR-SAR-${String(index + 3).padStart(2, '0')}-STD`, price, stock_quantity: 1, options: { Colour: color, Weave: weave, Included: included }, image_url: productImage, is_active: true }]
  });
});

const jewellerySamples = [
  ['18K Gold-Plated Pearl Drop Earrings', '18k-gold-plated-pearl-drop-earrings', 12800, '18K gold plated', 'Buy'],
  ['14K Gold-Plated Everyday Chain', '14k-gold-plated-everyday-chain', 9900, '14K gold plated', 'Buy'],
  ['22K Gold-Plated Bridal Haram', '22k-gold-plated-bridal-haram', 38500, '22K gold plated', 'Rent or buy'],
  ['22K Gold-Plated Temple Jhumkas', '22k-gold-plated-temple-jhumkas', 15600, '22K gold plated', 'Rent or buy'],
] as const;
jewellerySamples.forEach(([title, slug, price, finish, fulfilment], index) => {
  const rental = Math.round(price * 0.16);
  FALLBACK_PRODUCTS.push({ ...FALLBACK_PRODUCTS[1], id: `nor-jewel-${index + 3}`, title, slug, sku: `NOR-JWL-${index + 3}`, price, compare_at_price: null, is_featured: false, short_description: `${finish} jewellery available to ${fulfilment.toLowerCase()}.`, tags: ['jewellery', 'gold-plated', finish.toLowerCase(), fulfilment.toLowerCase()], total_stock: 2, avg_rating: 0, review_count: 0,
    variants: [{ id: `jewel-buy-${index}`, sku: `NOR-JWL-${index + 3}-BUY`, price, stock_quantity: 1, options: { Finish: finish, Service: 'Buy' }, image_url: '/images/jewel.jpg', is_active: true }, ...(fulfilment === 'Buy' ? [] : [{ id: `jewel-rent-${index}`, sku: `NOR-JWL-${index + 3}-RENT`, price: rental, stock_quantity: 1, options: { Finish: finish, Service: 'Rental (3 days)' }, image_url: '/images/jewel.jpg', is_active: true }])]
  });
});

const officialImages = {
  ordinary: 'https://theordinary.com/dw/image/v2/BFKJ_PRD/on/demandware.static/-/Sites-deciem-master/default/dwce8a7cdf/Images/products/The%20Ordinary/rdn-niacinamide-10pct-zinc-1pct-30ml.png?sh=800&sm=fit&sw=800',
  centella: 'https://www.skin1004.com/cdn/shop/files/skin1004-ampoule-serum-centella-ampoule-1253199402_1440x.jpg?v=1786012992',
  seoul: 'https://seoul1988.org/images/10103061.jpg',
  cerave: 'https://www.cerave.com/-/media/project/loreal/brand-sites/cerave/americas/us/products/cleansers/hydrating-facial-cleanser/hydrating-facial-cleanser-16oz-front.png'
};
const skincareSamples = [
  ['CeraVe Hydrating Facial Cleanser', 'cerave-hydrating-facial-cleanser', 6250, 'CeraVe', 'cerave', '236ml'],
  ['The Ordinary Niacinamide 10% + Zinc 1%', 'ordinary-niacinamide-zinc', 5400, 'The Ordinary', 'ordinary', '30ml'],
  ['SKIN1004 Madagascar Centella Ampoule', 'skin1004-centella-ampoule', 6900, 'SKIN1004', 'centella', '30ml'],
  ['K-SECRET SEOUL 1988 Retinal Serum', 'seoul-1988-retinal-serum', 7800, 'SEOUL 1988', 'seoul', '30ml'],
] as const;
skincareSamples.forEach(([title, slug, price, brand, imageKey, size], index) => {
  FALLBACK_PRODUCTS.push({ ...FALLBACK_PRODUCTS[0], id: `nor-skin-${index + 3}`, title, slug, sku: `NOR-SKIN-${index + 3}`, price, compare_at_price: null, is_featured: false, category_name: 'Official skincare', category_slug: 'cosmetics-skincare', short_description: `${brand} official product image · ${size}.`, description: `<p>${brand} skincare product, ${size}. Please confirm stock, batch and local product registration before sale.</p>`, tags: ['skincare', 'cosmetics', brand.toLowerCase(), 'official-product-image'], images: [{ id: `skin-${index + 3}`, url: officialImages[imageKey], alt_text: `${title} official product image`, is_primary: true }], total_stock: 10, avg_rating: 0, review_count: 0, variants: [{ id: `skin-var-${index}`, sku: `NOR-SKIN-${index + 3}-${size}`, price, stock_quantity: 10, options: { Size: size }, image_url: officialImages[imageKey], is_active: true }] });
});

export async function getProducts(categorySlug?: string): Promise<Product[]> {
  const apiBase = getApiBase();
  try {
    const res = await fetch(`${apiBase}/products`, {
      headers: { "X-Store-ID": STORE_ID },
      signal: AbortSignal.timeout(3000),
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        const mapped: Product[] = json.data.map((p: any) => ({
          ...p,
          images: p.images && p.images.length > 0 ? p.images.map((img: any) => ({
            ...img,
            url: resolveProxyUrl(img.url)
          })) : [{ id: "def", url: "/images/serum.jpg", alt_text: p.title, is_primary: true }],
          og_image: p.og_image ? resolveProxyUrl(p.og_image) : undefined,
          variants: p.variants?.map((v: any) => ({
            ...v,
            image_url: v.image_url ? resolveProxyUrl(v.image_url) : undefined
          }))
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
