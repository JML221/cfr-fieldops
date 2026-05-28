import type { NextConfig } from "next";
import { readFileSync } from "fs";
import { resolve } from "path";

function parseEnvFile(filePath: string): Record<string, string> {
  try {
    const content = readFileSync(resolve(process.cwd(), filePath), "utf-8");
    const vars: Record<string, string> = {};
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx < 1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
      vars[key] = val;
    }
    return vars;
  } catch {
    return {};
  }
}

const envVars = {
  ...parseEnvFile(".env"),
  ...parseEnvFile(".env.local"),
};

const nextConfig: NextConfig = {
  env: {
    ANTHROPIC_API_KEY: envVars.ANTHROPIC_API_KEY ?? process.env.ANTHROPIC_API_KEY ?? "",
  },
};

export default nextConfig;
