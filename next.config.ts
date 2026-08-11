import type { NextConfig } from "next";

// Sæt NEXT_PUBLIC_BASE_PATH i GitHub Actions til "/repo-navn", medmindre
// repoet hedder Aktieklubben.github.io (så skal den være tom).
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  // Uden denne redirecter Next selv "/dating-crm/" -> "/dating-crm" (ingen
  // trailing slash), som ikke matcher nogen Next-route (det er en statisk
  // undermappe, ikke en Next-side) og giver 404. Med trailingSlash:true
  // matcher lokal "next dev" samme adfærd som en almindelig statisk host
  // (GitHub Pages), hvor "/dating-crm/" naturligt serverer dens index.html.
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
