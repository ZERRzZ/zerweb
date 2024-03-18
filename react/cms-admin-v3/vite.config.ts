import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import Pages, { ReactRoute } from 'vite-plugin-pages';
import { existsSync } from 'node:fs';
import path from 'node:path';

const RootPath = process.cwd();

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  base: '/admin/',
  plugins: [
    react(),
    Pages({
      dirs: 'src/pages',
      exclude: [
        '**/components/**',
        '**/**/layout.tsx',
      ],
      extendRoute(route) {
        
        if (route.element) {
          const paths = route.element.split('/');
          paths.pop();
          paths.push('layout.tsx');
          const layoutPath = paths.join('/');

          const layoutFullPath = path.join(RootPath, layoutPath);
          if (existsSync(layoutFullPath)) {
            return {
              ...route,
              meta: {
                layout: layoutPath
              }
            }
          }
        }

        return route;
      },
      onRoutesGenerated(routes) {
        const routeMap: ReactRoute = {
          path: '/',
          children: [],
        };
        routes.forEach(route => processRoute(route, routeMap));
        return [routeMap];

        function processRoute(route, currentCursor) {
          
          const r: ReactRoute = {};
          // element
          if (route.element) {
            r.element = route.element;
          }
          // path
          if (route.path === 'main') {
            r.path = '';
          } else if (route.path === '' || route.path === currentCursor.path) {
            r.index = true;
          } else if (route.path.startsWith('-')) {
            r.path = ":" + route.path.substring(1);
          } else {
            r.path = route.path;
          }
          // layout
          if (route.meta?.layout) {
            currentCursor.element = route.meta.layout;
          }
          // chilren
          if (route.children && route.children.length > 0) {
            r.children = [];
            route.children.forEach(item => processRoute(item, r));
          }
          currentCursor.children.push(r);
        }
      },
    }),
  ],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  build: {
    minify: 'esbuild',
  },
  esbuild: {
    drop: command === 'build' ? ['console', 'debugger'] : [],
  },
}));
