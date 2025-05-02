/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      'tailwindui.com',
      'images.unsplash.com',
      'avatars.githubusercontent.com',
    ],
  }
}
