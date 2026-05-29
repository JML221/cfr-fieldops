import type { NextConfig } from "next";
import { config } from "dotenv";

config({ path: ".env" });
config({ path: ".env.local", override: true });

const nextConfig: NextConfig = {};

export default nextConfig;
