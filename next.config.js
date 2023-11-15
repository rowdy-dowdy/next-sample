const million = require('million/compiler')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false
}

module.exports = million.next(nextConfig, {
  mute: true,
  auto: true,
})

// module.exports = nextConfig
