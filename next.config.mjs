/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep the dev server's incremental chunks separate from production builds.
  distDir: process.env.NODE_ENV === "development" ? ".next-dev" : ".next",
  // Limit parallel build workers on constrained local and CI machines.
  experimental: { cpus: 1 },
};

export default nextConfig;
