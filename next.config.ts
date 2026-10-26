import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Figma assets are exported at their final size; serve them byte-for-byte
    // instead of re-encoding, so the render matches the design.
    unoptimized: true,
  },
};

export default nextConfig;
