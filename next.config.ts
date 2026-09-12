import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Supabase Storage — where hotel photos are cached to after scripts/cache-images.mjs runs.
      { protocol: "https", hostname: "xuvvsqoqnpvuwxcxfujx.supabase.co", pathname: "/storage/v1/object/public/**" },
      // Places API (New) photo media — used only until cache-images.mjs has processed a listing.
      { protocol: "https", hostname: "places.googleapis.com", pathname: "/v1/**" },
    ],
  },
};

export default nextConfig;
