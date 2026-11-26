import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"
import { componentRegistry } from "./quartz/components/registry"

componentRegistry.setOptionOverrides("@quartz-community/explorer", {
  filterFn: (node) => {
    if (node.slugSegment === "tags") return false
    if (node.data?.slug?.endsWith(".canvas")) return false
    return true
  },
})

const config = await loadQuartzConfig()
export default config
export const layout = await loadQuartzLayout()
