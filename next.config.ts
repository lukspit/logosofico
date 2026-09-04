import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/materiais/*": ["./content/materials/aula-*.pdf"],
  },
};

export default nextConfig;
