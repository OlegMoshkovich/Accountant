/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      // Document uploads go through a Server Action; raise the default 1 MB
      // body limit so larger PDFs/scans can be uploaded.
      bodySizeLimit: "25mb",
    },
  },
};

export default nextConfig;
