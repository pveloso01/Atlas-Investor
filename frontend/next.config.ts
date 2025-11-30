import type { NextConfig } from "next";
import path from "path";

const nextConfig = {
  /* config options here */
  reactCompiler: true,
  turbopack: {
    resolveAlias: {
      '@': path.join(process.cwd(), './'),
    },
  },
} as NextConfig & {
  turbopack?: {
    resolveAlias?: Record<string, string>;
  };
};

export default nextConfig;
