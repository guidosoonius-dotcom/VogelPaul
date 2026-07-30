import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Supabase Storage (signed URLs voor vogel- en wedstrijdfoto's).
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
};

export default nextConfig;
