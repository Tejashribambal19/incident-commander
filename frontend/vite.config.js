import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
    ],

    server: {
        host: "0.0.0.0",
        allowedHosts: [
            "incident-commander-frontend.onrender.com",
        ],
    },

    preview: {
        host: "0.0.0.0",
        allowedHosts: [
            "incident-commander-frontend.onrender.com",
        ],
    },
});