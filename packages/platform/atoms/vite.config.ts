import react from "@vitejs/plugin-react-swc";
import path from "path";
import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import Inspect from "vite-plugin-inspect";


export default defineConfig({
  optimizeDeps: {
    include: [
      "@sln/lib",
      "@sln/features",
      "@sln/prisma",
      "@sln/dayjs",
      "@sln/platform-constants",
      "@sln/platform-types",
      "@sln/platform-utils",
    ],
  },
  plugins: [Inspect(), react(), dts({ insertTypesEntry: true })],
  build: {
    commonjsOptions: {
      include: [/@sln\/lib/, /@sln\/features/, /node_modules/],
    },
    lib: {
      entry: [resolve(__dirname, "index.ts")],
      name: "CalAtoms",
      fileName: "cal-atoms",
    },
    rollupOptions: {
      external: ["react", "fs", "path", "os", "react-dom"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
  resolve: {
    alias: {
      fs: resolve("../../../node_modules/rollup-plugin-node-builtins"),
      path: resolve("../../../node_modules/rollup-plugin-node-builtins"),
      os: resolve("../../../node_modules/rollup-plugin-node-builtins"),
      "@": path.resolve(__dirname, "./src"),
      ".prisma/client": path.resolve(__dirname, "../../prisma-client"),
      "@prisma/client": path.resolve(__dirname, "../../prisma-client"),
      "@sln/prisma": path.resolve(__dirname, "../../prisma"),
      "@sln/dayjs": path.resolve(__dirname, "../../dayjs"),
      "@sln/platform-constants": path.resolve(
        __dirname,
        "../constants/index.ts"
      ),
      "@sln/platform-types": path.resolve(__dirname, "../types/index.ts"),
      "@sln/platform-utils": path.resolve(__dirname, "../constants/index.ts"),
      "@sln/web/public/static/locales/en/common.json": path.resolve(
        __dirname,
        "../../../apps/web/public/static/locales/en/common.json"
      ),
    },
  },
});
