import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs';

// Helper function to automatically discover all HTML files in the project
function getHtmlFiles(dir, fileList =[]) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = resolve(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== 'dist') {
        getHtmlFiles(filePath, fileList);
      }
    } else if (filePath.endsWith('.html')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const htmlFiles = getHtmlFiles(resolve(__dirname));
const input = {};

// Create an entry point dictionary for Vite's bundler
htmlFiles.forEach((file) => {
  const name = file
    .replace(__dirname, '')
    .replace(/\\/g, '/')
    .replace(/^\//, '')
    .replace('.html', '')
    .replace(/\//g, '_');
  input[name || 'main'] = file; 
});

export default defineConfig({
  // Base URL for GitHub Pages (Since this is a User Page: username.github.io)
  base: '/', 
  resolve: {
    alias: {
      '@': resolve(__dirname, './'),
    },
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input
    }
  }
});