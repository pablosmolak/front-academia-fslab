/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
      authInterrupts: true
    },
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "**",
          port: "",
        }
      ]
    },
    reactStrictMode: true,
    output: "standalone"
  };
  
  export default nextConfig;
  