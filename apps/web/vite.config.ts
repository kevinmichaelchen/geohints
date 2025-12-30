import { defineConfig } from "vite";
import { qwikVite } from "@builder.io/qwik/optimizer";
import { qwikCity } from "@builder.io/qwik-city/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { FontaineTransform } from "fontaine";
import { resolve } from "node:path";

export default defineConfig(() => {
  return {
    plugins: [
      qwikCity(),
      qwikVite(),
      tsconfigPaths({ ignoreConfigErrors: true }),
      FontaineTransform.vite({
        fallbacks: [
          "BlinkMacSystemFont",
          "Segoe UI",
          "Helvetica Neue",
          "Arial",
          "Noto Sans",
        ],
        resolvePath: (id) => new URL(`./public${id}`, import.meta.url),
      }),
    ],
    resolve: {
      alias: {
        "~": resolve(__dirname, "./src"),
      },
    },
    preview: {
      headers: {
        "Cache-Control": "public, max-age=600",
      },
    },
  };
});
