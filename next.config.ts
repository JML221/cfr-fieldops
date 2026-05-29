import type { NextConfig } from "next";
import { config } from "dotenv";

config({ path: ".env" });
config({ path: ".env.local", override: true });

const nextConfig: NextConfig = {
  env: {
    SITE_AUTH_TOKEN: process.env.SITE_AUTH_TOKEN ?? '',
    SITE_PASSWORD: process.env.SITE_PASSWORD ?? '',
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY ?? '',
  },
};

export default nextConfig;
