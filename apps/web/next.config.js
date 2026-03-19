/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@chatkasi/ui", "@chatkasi/types"],
  images: { domains: ["avatars.githubusercontent.com", "lh3.googleusercontent.com"] }
}
module.exports = nextConfig
