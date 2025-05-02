import { defineConfig, UserConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import path from "node:path";
import { fileURLToPath } from "node:url";
import appConfig from "./app.config.json";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    test: {
      globals: true, // This enables global variables for `describe`, `it`, `test`, `expect`, etc.
      environment: "jsdom", // or 'node' depending on your target
      setupFiles: ["./src/test-env-setup.js", "./src/setupTests.jsx"],
      coverage: {
        include: ["src/**"],
      },
    },
    base: `/${appConfig["app_name"]}`,
    resolve: {
      alias: {
        context: path.resolve(__dirname, "src/context"),
        lib: path.resolve(__dirname, "src/lib"),
        components: path.resolve(__dirname, "src/components"),
        config: path.resolve(__dirname, "src/config"),
        hooks: path.resolve(__dirname, "src/hooks"),
        api: path.resolve(__dirname, "src/api"),
        constants: path.resolve(__dirname, "src/constants"),
        models: path.resolve(__dirname, "src/models"),
        utils: path.resolve(__dirname, "src/utils"),
        mocks: path.resolve(__dirname, "src/mocks"),
        "mapbox-gl": "maplibre-gl",
        "test-utils": path.resolve(__dirname, "./src/test-utils.jsx"),
      },
    },
    plugins: [react(), svgr()], // https://github.com/vitest-dev/vitest/issues/4048#issuecomment-1855141674
    server: {
      port: 5173,
      proxy: {
        ...(process.env.TRIPLE_STORE_URL_PROXY
          ? {
              "/api": {
                target: process.env.TRIPLE_STORE_URL_PROXY,
                changeOrigin: true,
                configure: (proxy, options) => {
                  proxy.on("proxyReq", function (proxyReq, req, res) {
                    proxyReq.setHeader(
                      "Authorization",
                      `${process.env.TC_OIDC_TOKEN}`,
                    );
                  });
                },
              },
            }
          : console.log("not proxying triple store")),
        ...(process.env.ACCESS_API_URL_PROXY
          ? {
              "/whoami": {
                target: process.env.ACCESS_API_URL_PROXY,
                changeOrigin: true,
              },
            }
          : null),
      },

      esbuild: {
        minify: false, // Ensure esbuild doesn't minify during development
      },
    },
    optimizeDeps: {
      exclude: ["mapbox-gl"],
    },
    build: {
      rollupOptions: {
        external: ["mapbox-gl"],
      },
    },
  };
});
