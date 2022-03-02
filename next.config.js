/** @type {import('next').NextConfig} */

module.exports = {
  reactStrictMode: true,
  images: {
    domains: ["localhost", "192.168.178.21", "api.spritearc.com"]
  },
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
}


