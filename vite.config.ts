import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react()],
  build: {
    target: "es2020",
    cssCodeSplit: false,
    // browser build: libraries in their own files (they change rarely, so visitors keep them cached
    // when only the site changes, and no single file passes the 500 kB warning). The server build
    // used for prerendering stays one file.
    rolldownOptions: isSsrBuild ? undefined : {
      output: {
        codeSplitting: {
          groups: [
            { name: "react", test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/ },
            { name: "gsap", test: /node_modules[\\/](gsap|@gsap)[\\/]/ },
          ],
        },
      },
    },
  },
}));
