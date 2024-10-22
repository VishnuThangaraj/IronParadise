import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5151,
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use "./src/styles/_global.scss";
        `,
      },
    },
  },
});
