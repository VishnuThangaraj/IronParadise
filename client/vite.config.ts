import path from "path";
import { defineConfig } from "vite";
import { fileURLToPath } from "url";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5151,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use "@/shared/styles/colors" as *;
          @use "@/shared/styles/variables" as *;
        `,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("/shared/components/ui/view-mode-toggle/")) {
            return "view-mode-toggle";
          }
          if (id.includes("node_modules")) {
            if (id.includes("@mui/x-data-grid")) {
              return "vendor-mui-datagrid";
            }
            if (id.includes("@mui/x-date-pickers")) {
              return "vendor-mui-date-pickers";
            }
            if (id.includes("@mui")) {
              return "vendor-mui-core";
            }
            if (id.includes("@emotion")) {
              return "vendor-emotion";
            }
            if (id.includes("react-icons")) {
              return "vendor-react-icons";
            }
            if (id.includes("sweetalert2")) {
              return "vendor-sweetalert2";
            }
          }
        },
      },
    },
  },
})
