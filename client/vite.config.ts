import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
// import dotenv from "dotenv";
// dotenv.config();
// https://vitejs.dev/config/
// console.log(process.env.VITE_SERVER_URL, "process.env.VITE_SERVER_URL");
export default defineConfig({
  plugins: [react()],
  server: {
    // open: true,
    port: 3000,
    host: true,
    proxy: {
      "/api": {
        target: "http://api:5000",
        secure: false,
      },
    },
  },
});
