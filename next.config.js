/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["sequelize"],
  },
  modularizeImports: {},
  images: {
    domains: ["34.122.44.159"],
  },
  redirects: async () => {
    return [
      {
        source: "/",
        destination: "/dashboard",
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
