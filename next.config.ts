import type { NextConfig } from "next";
 
const nextConfig: NextConfig = {
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
    ],
  },
};
 
export default nextConfig;
