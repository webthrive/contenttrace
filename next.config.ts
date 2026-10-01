import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // One host only. Sign-in cookies are set per host, so contenttrace.ai and www.contenttrace.ai
  // must not both serve pages.
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "contenttrace.ai" }],
        destination: "https://www.contenttrace.ai/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
