const wpUrl = process.env.WORDPRESS_URL || "https://cms.example.com";
const parsed = new URL(wpUrl);

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: parsed.protocol.replace(":", ""),
        hostname: parsed.hostname,
        port: parsed.port || "",
        pathname: "/wp-content/uploads/**"
      }
    ]
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" }
        ]
      }
    ];
  }
};

export default nextConfig;
