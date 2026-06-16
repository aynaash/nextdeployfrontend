import { defineCloudflareConfig } from "@opennextjs/cloudflare"

// For persistent ISR/revalidate across instances, add an R2 incremental cache:
//   import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache"
//   export default defineCloudflareConfig({ incrementalCache: r2IncrementalCache })
// (requires an R2 bucket binding in wrangler.jsonc). The default below is fine for a first deploy.
export default defineCloudflareConfig({})
