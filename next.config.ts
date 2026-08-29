import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,

  devIndicators: false,

  output:
    process.env.VERCEL
      ? undefined
      : "standalone",
};

export default nextConfig;
