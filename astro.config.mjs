// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

const BACKEND_URL = (
  process.env.BACKEND_URL ||
  (process.env.PUBLIC_API_URL && process.env.PUBLIC_API_URL.startsWith('http')
    ? new URL(process.env.PUBLIC_API_URL).origin
    : 'http://76.13.221.75:9488')
).replace(/\/$/, '');

/**
 * Custom Vite plugin to proxy arbitrary external HTTP images
 * via /proxy-image?url=<encoded_url> to prevent mixed-content blocking.
 */
function externalImageProxyPlugin() {
  const handler = async (req, res) => {
    try {
      const parsedUrl = new URL(req.url, 'http://localhost');
      const targetUrl = parsedUrl.searchParams.get('url');
      if (!targetUrl || (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://'))) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Missing or invalid "url" parameter');
        return;
      }
      const response = await fetch(targetUrl);
      if (!response.ok) {
        res.statusCode = response.status;
        res.end(`Upstream image returned ${response.status}`);
        return;
      }
      res.statusCode = 200;
      const contentType = response.headers.get('content-type');
      if (contentType) {
        res.setHeader('Content-Type', contentType);
      }
      const cacheControl = response.headers.get('cache-control') || 'public, max-age=86400';
      res.setHeader('Cache-Control', cacheControl);
      const buffer = Buffer.from(await response.arrayBuffer());
      res.end(buffer);
    } catch (err) {
      res.statusCode = 502;
      res.setHeader('Content-Type', 'text/plain');
      res.end(`Image proxy error: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  return {
    name: 'vite-external-image-proxy',
    configureServer(server) {
      server.middlewares.use('/proxy-image', handler);
    },
    configurePreviewServer(server) {
      server.middlewares.use('/proxy-image', handler);
    },
  };
}

// https://astro.build/config
export default defineConfig({
  vite: {
    server: {
      proxy: {
        '/api': {
          target: BACKEND_URL,
          changeOrigin: true,
          secure: false,
        },
        '/uploads': {
          target: BACKEND_URL,
          changeOrigin: true,
          secure: false,
        },
        '/media': {
          target: BACKEND_URL,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    preview: {
      proxy: {
        '/api': {
          target: BACKEND_URL,
          changeOrigin: true,
          secure: false,
        },
        '/uploads': {
          target: BACKEND_URL,
          changeOrigin: true,
          secure: false,
        },
        '/media': {
          target: BACKEND_URL,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    plugins: [tailwindcss(), externalImageProxyPlugin()],
  },
});