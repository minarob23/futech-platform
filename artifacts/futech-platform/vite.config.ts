import path from 'path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

const port = Number(process.env.PORT || '3000');
const basePath = process.env.BASE_PATH || '/';

export default defineConfig({
  base: basePath,
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
      '@assets': path.resolve(
        import.meta.dirname,
        '..',
        '..',
        'attached_assets',
      ),
    },
    dedupe: ['react', 'react-dom'],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, 'dist/public'),
    emptyOutDir: true,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          const norm = id.replace(/\\/g, '/');
          if (norm.includes('node_modules')) {
            if (
              norm.includes('/react@') ||
              norm.includes('/react-dom@') ||
              norm.includes('/scheduler@') ||
              norm.includes('/react/') ||
              norm.includes('/react-dom/')
            ) {
              return 'vendor-react';
            }
            if (norm.includes('@radix-ui')) {
              return 'vendor-radix';
            }
            if (norm.includes('date-fns')) {
              return 'vendor-date';
            }
            if (norm.includes('react-hook-form') || norm.includes('@hookform') || norm.includes('/zod')) {
              return 'vendor-forms';
            }
            if (norm.includes('lucide-react')) {
              return 'vendor-icons';
            }
            if (norm.includes('framer-motion')) {
              return 'vendor-motion';
            }
            if (norm.includes('recharts') || norm.includes('d3-') || norm.includes('victory-vendor')) {
              return 'vendor-charts';
            }
            if (norm.includes('@supabase')) {
              return 'vendor-supabase';
            }
            if (norm.includes('wouter')) {
              return 'vendor-wouter';
            }
            if (
              norm.includes('cmdk') ||
              norm.includes('vaul') ||
              norm.includes('embla-carousel') ||
              norm.includes('sonner')
            ) {
              return 'vendor-ui-extra';
            }
          }
        },
      },
    },
  },
  server: {
    port,
    strictPort: true,
    host: '0.0.0.0',
    allowedHosts: true,
    fs: {
      strict: true,
    },
  },
  preview: {
    port,
    host: '0.0.0.0',
    allowedHosts: true,
  },
});
