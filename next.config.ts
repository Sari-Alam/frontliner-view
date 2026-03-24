import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/auth/login",
        permanent: true,
      },
      {
        source: "/auth",
        destination: "/auth/login",
        permanent: true,
      },
      {
        source: "/app",
        destination: "/app/dashboard",
        permanent: true,
      },
      {
        source: "/app/enrollment/new",
        destination: "/app/enrollment",
        permanent: true,
      },
    ]
  },
}

export default nextConfig
