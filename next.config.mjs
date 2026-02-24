import { withSentryConfig } from "@sentry/nextjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // In Next.js 15+, sometimes you need to explicitly opt out of Turbo in config if it's defaulting
  // but usually it's a CLI flag. 
};

export default withSentryConfig(nextConfig, {
  silent: true,
  org: "frutmax",
  project: "frutmax-frontend",
}, {
  widenClientFileUpload: true,
  transpileClientSDK: false,
  tunnelRoute: "/monitoring",
  hideSourceMaps: true,
  disableLogger: true,
  automaticVercelMonitors: true,
});
