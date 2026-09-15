# Norelle catalogue assets

`saree-image-prompts.jsonl` contains the 10 approved Indian-saree model-photo jobs. It is intentionally one job per product, so each result has a dedicated, stable filename.

Run after setting `OPENAI_API_KEY`:

```bash
export IMAGE_GEN="$HOME/.codex/skills/.system/imagegen/scripts/image_gen.py"
python "$IMAGE_GEN" generate-batch \
  --input norelle/catalog/saree-image-prompts.jsonl \
  --out-dir norelle/public/images/saree-samples \
  --concurrency 3
```

The generator image needs a supplied pattern image to produce an actual try-on render. The storefront accepts the pattern upload and notes now; connect its submit action to the protected backend generation worker only after the API key is available server-side. Never expose that key in `PUBLIC_*` browser variables.

Official cosmetic product images are remote, direct image URLs from the corresponding brand-owned sites. Review brand resale rights and local product registration before publishing those products.
