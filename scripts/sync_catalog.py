#!/usr/bin/env python3
"""Upload the Norelle storefront catalog and its local imagery to the Sam API.

Usage:
  NORELLA_ADMIN_EMAIL=... NORELLA_ADMIN_PASSWORD=... python3 scripts/sync_catalog.py

The script is safe to rerun: existing products are updated by slug and new
products are created. It intentionally keeps credentials out of source code.
"""

import json
import mimetypes
import os
import pathlib
import urllib.error
import urllib.request
import uuid

API_BASE = os.getenv("NORELLA_API_URL", "http://76.13.221.75:9488/api/v1").rstrip("/")
STORE_ID = os.getenv("NORELLA_STORE_ID", "store_norella")
EMAIL = os.getenv("NORELLA_ADMIN_EMAIL", "admin@samecom.com")
PASSWORD = os.getenv("NORELLA_ADMIN_PASSWORD", "Admin12345!")
ROOT = pathlib.Path(__file__).resolve().parents[1]


def request(method, path, payload=None, token=None, headers=None):
    request_headers = {"X-Store-ID": STORE_ID, **(headers or {})}
    if token:
        request_headers["Authorization"] = f"Bearer {token}"
    body = None
    if payload is not None:
        body = json.dumps(payload).encode()
        request_headers["Content-Type"] = "application/json"
    req = urllib.request.Request(API_BASE + path, data=body, headers=request_headers, method=method)
    with urllib.request.urlopen(req, timeout=30) as response:
        return json.loads(response.read())


def upload_image(path, alt_text, token):
    boundary = "----NorellaCatalog" + uuid.uuid4().hex
    mime_type = mimetypes.guess_type(path.name)[0] or "application/octet-stream"
    fields = [
        f"--{boundary}\r\nContent-Disposition: form-data; name=\"alt_text\"\r\n\r\n{alt_text}\r\n".encode(),
        (f"--{boundary}\r\nContent-Disposition: form-data; name=\"file\"; filename=\"{path.name}\"\r\n"
         f"Content-Type: {mime_type}\r\n\r\n").encode(),
        path.read_bytes(), b"\r\n", f"--{boundary}--\r\n".encode(),
    ]
    req = urllib.request.Request(
        API_BASE + "/media/upload", data=b"".join(fields), method="POST",
        headers={"X-Store-ID": STORE_ID, "Authorization": f"Bearer {token}",
                 "Content-Type": f"multipart/form-data; boundary={boundary}"},
    )
    with urllib.request.urlopen(req, timeout=60) as response:
        return json.loads(response.read())["data"]["url"]


def product(title, slug, sku, price, category, image, *, description, short, tags,
            compare=None, featured=False, variants=None):
    return {
        "title": title, "slug": slug, "sku": sku, "price": price,
        "compare_at_price": compare, "status": "active", "is_featured": featured,
        "category_id": category, "description": description, "short_description": short,
        "tags": tags, "seo_title": title, "seo_description": short,
        "seo_keywords": ", ".join(tags), "og_image": image,
        "images": [{"id": f"{sku.lower()}-image", "url": image, "alt_text": title,
                    "is_primary": True, "sort_order": 1}],
        "variants": variants or [{"sku": sku + "-STD", "price": price, "stock_quantity": 10,
                                  "options": {}, "image_url": image, "is_active": True}],
    }


def main():
    login = request("POST", "/auth/staff/login", {"email": EMAIL, "password": PASSWORD})
    token = login["data"]["token"]
    categories = {x["slug"]: x["id"] for x in request("GET", "/categories?limit=100")["data"]}
    required = {"cosmetics-skincare", "gold-plated-jewellery", "indian-sarees"}
    missing = required - categories.keys()
    if missing:
        raise RuntimeError("Missing API categories: " + ", ".join(sorted(missing)))

    image_files = {
        "serum": ("public/images/serum.jpg", "Luxury gold facial serum"),
        "jewel": ("public/images/jewel.jpg", "Gold plated Kundan jewellery"),
        "saree": ("public/images/saree.jpg", "Handwoven silk saree"),
        **{f"sample-{n}": (f"public/images/saree-samples/{n:02d}-{name}.png", f"Norelle {name.replace('-', ' ')} saree")
           for n, name in [(1, "banarasi-rose-jaal"), (2, "kanchipuram-midnight-korvai"),
                           (3, "patola-saffron-geometric"), (4, "mysore-ivory-zari"),
                           (5, "paithani-plum-lotus")]},
    }
    images = {}
    for key, (relative_path, alt) in image_files.items():
        print(f"Uploading {relative_path}…")
        images[key] = upload_image(ROOT / relative_path, alt, token)

    cosmetics, jewellery, sarees = (categories[x] for x in
        ("cosmetics-skincare", "gold-plated-jewellery", "indian-sarees"))
    records = [
        product("24K Gold Aurum Radiance Facial Glow Serum", "24k-gold-aurum-radiance-glow-serum", "NOR-GLW-01", 12500, cosmetics, images["serum"], compare=15000, featured=True, tags=["cosmetics", "skincare", "gold serum", "glow", "ayurvedic"], short="Pure 24K gold flakes and Kashmiri saffron glow serum for luminous radiant skin.", description="<p>Enriched with pure 24-karat gold micro-flakes, rare Kashmiri saffron extract, and cold-pressed botanical marula oil. Deeply nourishes skin and imparts a luminous golden radiance.</p>"),
        product("Royal Kundan & 22K Gold Plated Temple Choker Set", "royal-kundan-22k-gold-plated-choker-set", "NOR-JWL-01", 28500, jewellery, images["jewel"], compare=34000, featured=True, tags=["jewellery", "gold plated", "kundan", "bridal", "temple jewellery"], short="Handcrafted 22K gold-plated heirloom Kundan choker necklace with matching earrings.", description="<p>Handcrafted with 22K micro-gold plating, uncut Polki stones, emerald meenakari inlay and freshwater pearl drops. Includes matching statement jhumka earrings.</p>"),
        product("Pure Kanchipuram Peacock Emerald Silk Saree with Gold Zari", "pure-kanchipuram-peacock-emerald-silk-saree", "NOR-SAR-01", 48000, sarees, images["saree"], compare=58000, featured=True, tags=["sarees", "kanchipuram", "silk saree", "indian saree", "bridal saree"], short="Authentic Kanchipuram handloom silk saree with pure gold zari peacock borders.", description="<p>Woven with 100% pure mulberry silk in Kanchipuram, with a golden zari peacock pallu, korvai temple borders and matching silk blouse piece.</p>"),
        product("Ayurvedic Kumkumadi Miracle Youth Night Oil 30ml", "ayurvedic-kumkumadi-miracle-youth-night-oil", "NOR-GLW-02", 8900, cosmetics, images["serum"], compare=11000, tags=["cosmetics", "skincare", "ayurvedic", "kumkumadi", "night oil"], short="Ancient 26-herb Ayurvedic formulation for overnight complexion renewal.", description="<p>An authentic 26-herb formula with red sandalwood, vetiver and saffron infused in organic cold-pressed sesame oil.</p>"),
        product("South Indian Matte Temple Lakshmi Bangle Pair", "south-indian-matte-temple-lakshmi-bangle-pair", "NOR-JWL-02", 14200, jewellery, images["jewel"], compare=18000, tags=["jewellery", "bangles", "temple jewellery", "lakshmi", "gold plated"], short="Antique 22K gold-plated Goddess Lakshmi bangles with ruby kemp stones.", description="<p>Antique matte temple kada bangles with Goddess Lakshmi motifs, ruby kemp stones and an adjustable screw lock.</p>"),
        product("Banarasi Crimson Bridal Katan Silk Saree with Kadwa Booti", "banarasi-crimson-bridal-katan-silk-saree", "NOR-SAR-02", 52000, sarees, images["saree"], compare=65000, tags=["sarees", "banarasi", "silk saree", "bridal", "crimson"], short="Handcrafted Varanasi bridal Katan silk saree with intricate kadwa gold zari bootis.", description="<p>Handwoven Banarasi Katan silk from Varanasi, finished with sona-rupa zari kadwa bootis and a floral jaal bridal pallu.</p>"),
    ]
    saree_data = [
        ("Banarasi Rose Jaal Silk Saree", "banarasi-rose-jaal-silk-saree", 42500, "Rose pink", "Banarasi", "sample-1"),
        ("Kanchipuram Midnight Blue Korvai Saree", "kanchipuram-midnight-blue-korvai", 51000, "Midnight blue", "Kanchipuram", "sample-2"),
        ("Patola Saffron Geometric Silk Saree", "patola-saffron-geometric-silk-saree", 47000, "Saffron", "Patola", "sample-3"),
        ("Mysore Silk Ivory Zari Saree", "mysore-silk-ivory-zari-saree", 34500, "Ivory", "Mysore silk", "sample-4"),
        ("Paithani Plum Lotus Saree", "paithani-plum-lotus-saree", 56000, "Plum", "Paithani", "sample-5"),
        ("Chanderi Sage Floral Saree", "chanderi-sage-floral-saree", 23500, "Sage", "Chanderi", "saree"),
        ("Bandhani Ruby Gota Saree", "bandhani-ruby-gota-saree", 29800, "Ruby", "Bandhani", "saree"),
        ("Tussar Silk Sandalwood Saree", "tussar-silk-sandalwood-saree", 27800, "Sandalwood", "Tussar silk", "saree"),
        ("Gadwal Teal Temple Border Saree", "gadwal-teal-temple-border-saree", 39500, "Teal", "Gadwal", "saree"),
    ]
    for i, (title, slug, price, color, weave, image_key) in enumerate(saree_data, 3):
        records.append(product(title, slug, f"NOR-SAR-{i:02d}", price, sarees, images[image_key], compare=round(price * 1.14), featured=i < 5, tags=["sarees", "indian-sarees", weave.lower(), color.lower()], short=f"{weave} saree in {color.lower()} with an elegant zari finish.", description=f"<p>{weave} saree in {color.lower()} with an elegant zari finish. Includes a blouse piece.</p>", variants=[{"sku": f"NOR-SAR-{i:02d}-STD", "price": price, "stock_quantity": 1, "options": {"Colour": color, "Weave": weave, "Included": "Saree with blouse piece"}, "image_url": images[image_key], "is_active": True}]))
    jewellery_data = [("18K Gold-Plated Pearl Drop Earrings", "18k-gold-plated-pearl-drop-earrings", 12800, "18K gold plated", "Buy"), ("14K Gold-Plated Everyday Chain", "14k-gold-plated-everyday-chain", 9900, "14K gold plated", "Buy"), ("22K Gold-Plated Bridal Haram", "22k-gold-plated-bridal-haram", 38500, "22K gold plated", "Rent or buy"), ("22K Gold-Plated Temple Jhumkas", "22k-gold-plated-temple-jhumkas", 15600, "22K gold plated", "Rent or buy")]
    for i, (title, slug, price, finish, service) in enumerate(jewellery_data, 3):
        variants = [{"sku": f"NOR-JWL-{i}-BUY", "price": price, "stock_quantity": 1, "options": {"Finish": finish, "Service": "Buy"}, "image_url": images["jewel"], "is_active": True}]
        if service != "Buy": variants.append({"sku": f"NOR-JWL-{i}-RENT", "price": round(price * .16), "stock_quantity": 1, "options": {"Finish": finish, "Service": "Rental (3 days)"}, "image_url": images["jewel"], "is_active": True})
        records.append(product(title, slug, f"NOR-JWL-{i}", price, jewellery, images["jewel"], tags=["jewellery", "gold-plated", finish.lower(), service.lower()], short=f"{finish} jewellery available to {service.lower()}.", description=f"<p>{finish} jewellery piece available to {service.lower()}.</p>", variants=variants))
    skincare_data = [("CeraVe Hydrating Facial Cleanser", "cerave-hydrating-facial-cleanser", 6250, "CeraVe", "236ml", "https://www.cerave.com/-/media/project/loreal/brand-sites/cerave/americas/us/products/cleansers/hydrating-facial-cleanser/hydrating-facial-cleanser-16oz-front.png"), ("The Ordinary Niacinamide 10% + Zinc 1%", "ordinary-niacinamide-zinc", 5400, "The Ordinary", "30ml", "https://theordinary.com/dw/image/v2/BFKJ_PRD/on/demandware.static/-/Sites-deciem-master/default/dwce8a7cdf/Images/products/The%20Ordinary/rdn-niacinamide-10pct-zinc-1pct-30ml.png?sh=800&sm=fit&sw=800"), ("SKIN1004 Madagascar Centella Ampoule", "skin1004-centella-ampoule", 6900, "SKIN1004", "30ml", "https://www.skin1004.com/cdn/shop/files/skin1004-ampoule-serum-centella-ampoule-1253199402_1440x.jpg?v=1786012992"), ("K-SECRET SEOUL 1988 Retinal Serum", "seoul-1988-retinal-serum", 7800, "SEOUL 1988", "30ml", "https://seoul1988.org/images/10103061.jpg")]
    for i, (title, slug, price, brand, size, image) in enumerate(skincare_data, 3):
        records.append(product(title, slug, f"NOR-SKIN-{i}", price, cosmetics, image, tags=["skincare", "cosmetics", brand.lower(), "official-product-image"], short=f"{brand} skincare product · {size}.", description=f"<p>{brand} skincare product, {size}. Confirm stock, batch and local product registration before sale.</p>", variants=[{"sku": f"NOR-SKIN-{i}-{size}", "price": price, "stock_quantity": 10, "options": {"Size": size}, "image_url": image, "is_active": True}]))

    existing = {p["slug"]: p["id"] for p in request("GET", "/products?limit=100")["data"]}
    created = updated = 0
    for item in records:
        if item["slug"] in existing:
            request("PUT", "/products/" + existing[item["slug"]], item, token)
            updated += 1
        else:
            request("POST", "/products", item, token)
            created += 1
    print(f"Catalog sync complete: {created} created, {updated} updated; {len(images)} images uploaded.")


if __name__ == "__main__":
    try:
        main()
    except (urllib.error.HTTPError, urllib.error.URLError, KeyError, RuntimeError) as exc:
        print(f"Catalog sync failed: {exc}")
        raise SystemExit(1)
