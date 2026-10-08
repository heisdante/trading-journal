/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep the dev server's incremental chunks separate from production builds.
  distDir: process.env.NODE_ENV === "development" ? ".next-dev" : ".next",
  // Keep memory use reasonable while allowing routes to compile in parallel.
  experimental: { cpus: 2 },
};

export default nextConfig;
