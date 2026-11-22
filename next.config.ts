import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [{ source: "/:locale(vi|en)/projects/crossweave", destination: "/:locale", permanent: true }];
  },
};

export default nextConfig;
