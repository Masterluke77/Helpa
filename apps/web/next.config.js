/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ["@helpa/db", "@helpa/shared"],
    images: {
        domains: ["localhost", "lh3.googleusercontent.com"],
    },
};

module.exports = nextConfig;
