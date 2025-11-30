import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // @ts-ignore - Turbopack resolveAlias is not in NextConfig type yet
  turbopack: {
    resolveAlias: {
      '@': path.resolve(__dirname, './'),
    },
  },
};

export default nextConfig;
