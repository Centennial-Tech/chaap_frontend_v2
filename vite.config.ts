import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(() => {
  return {
    plugins: [react()],
    build: {
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            // React core libraries
            if (id.includes('react/') || id.includes('react-dom/')) {
              return 'vendor-react-core';
            }
            
            // React Router
            if (id.includes('react-router')) {
              return 'vendor-router';
            }

            // PDF related
            if (id.includes('jspdf') || id.includes('html2pdf') || id.includes('react-to-pdf') || id.includes('react-pdftotext')) {
              return 'vendor-pdf';
            }

            // UI Components and styling
            if (id.includes('@mui/') || id.includes('@emotion/') || id.includes('@radix-ui/') || id.includes('framer-motion')) {
              return 'vendor-ui-components';
            }

            // Markdown and text processing
            if (id.includes('marked') || id.includes('remark') || id.includes('react-markdown') || id.includes('react-syntax-highlighter')) {
              return 'vendor-markdown';
            }

            // Utility libraries
            if (id.includes('date-fns') || id.includes('clsx') || id.includes('class-variance-authority') || id.includes('tailwind-merge')) {
              return 'vendor-utils';
            }

            // Other node_modules
            if (id.includes('node_modules')) {
              return 'vendor-other';
            }

            // App code splitting
            if (id.includes('/components/')) {
              return 'components';
            }
            if (id.includes('/pages/')) {
              return 'pages';
            }
          }
        }
      },
      chunkSizeWarningLimit: 1000,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      },
      // Enable source maps for debugging
      sourcemap: true,
      // Reduce chunk size
      target: 'esnext',
      // Split CSS
      cssCodeSplit: true
    }
  };
});
