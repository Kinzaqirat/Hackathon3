/** @type {import('next').NextConfig} */
const nextConfig = {
  // Address the workspace root warning
  turbopack: {
    root: __dirname, // Set the correct root directory
  },
};

module.exports = nextConfig;