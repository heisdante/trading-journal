/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep the dev server's incremental chunks separate from production builds.
  distDir: process.env.NODE_ENV === "development" ? ".next-dev" : ".next",
};

export default nextConfig;
