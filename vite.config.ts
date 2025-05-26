import { defineConfig } from "vite";
import { qwikVite } from "@builder.io/qwik/optimizer";
import { qwikCity } from "@builder.io/qwik-city/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { imagetools } from 'vite-imagetools';

export default defineConfig(() => {
  return {
    plugins: [
      qwikCity(), 
      qwikVite({
        devTools: {
          clickToSource: ['Alt', 'Meta'],
        },
      }), 
      tsconfigPaths(),
      imagetools({
        // Default directives for images
        defaultDirectives: (url) => {
          const urlObj = new URL(url, 'file:');
          if (urlObj.searchParams.has('webp')) {
            return new URLSearchParams({
              format: 'webp',
              quality: '80',
            });
          }
          return new URLSearchParams();
        },
      }),
    ],
    preview: {
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    },
    optimizeDeps: {
      include: ['@builder.io/qwik'],
    },
  };
});
