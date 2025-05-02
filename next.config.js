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
  },
  webpack: (config) => {
    // load worker files as a urls with `file-loader`
    config.module.rules.unshift({
      test: /pdf\.worker\.(min\.)?js/,
      use: [
        {
          loader: "file-loader",
          options: {
            name: "[contenthash].[ext]",
            publicPath: "_next/static/worker",
            outputPath: "static/worker"
          }
        }
      ]
    });

    return config;
  }
}
