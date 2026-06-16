import type { NextConfig } from "next";
 
const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "www.jozewski.tech",
          },
        ],
        destination: "https://jozewski.tech/:path*",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "source.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.thegluttonlife.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.internationalcuisine.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.chefspencil.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ourgabledhome.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "mydinner.co.uk",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.daringgourmet.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "platedcravings.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "mexicanappetizersandmore.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.isabeleats.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.royalresorts.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.laylita.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.holajalapeno.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.italiankitchenconfessions.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.themediterraneandish.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.thespruceeats.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lechicpatissier.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "muybuenoblog.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "tastesbetterfromscratch.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.seriouseats.com",
        pathname: "/**",
      },
    ],
  },
};
 
export default nextConfig;
