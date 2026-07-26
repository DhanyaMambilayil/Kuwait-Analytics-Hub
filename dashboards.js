// Edit this single list whenever you want to add, remove or rename a dashboard.
// permissionKey must match the Boolean field in the user's Firestore document.
// Admin users (admin: true) see all active dashboards.
//
// "status" controls the badge shown on a dashboard's card. Just change the
// value on the entry you want to flag:
//   status: "live"    -> no badge, works as normal (default)
//   status: "wip"     -> green "Coming Soon" badge
//   status: "pending" -> yellow "Update Pending" badge
export const DASHBOARDS = [
  {
    id: "retail",
    permissionKey: "retail",
    title: "Retail Performance",
    description: "Branch Performance Dashboard, Area-wise Performance.",
    category: "Retail",
    icon: "R",
    url: "https://dhanyamambilayil.github.io/Kuwait-Branch-Performance-Dashboard/",
    status: "live",
    active: true
  },
  {
    id: "bec-wholesale",
    permissionKey: "becWholesale",
    title: "BEC Wholesale",
    description: "FX performance dashboard - Wholesale & Retail.",
    category: "Wholesale",
    icon: "W",
    url: "https://dhanyamambilayil.github.io/Wholesale-Dashboard/",
    status: "live",
    active: true
  },
  {
    id: "aae-wholesale",
    permissionKey: "aaeWholesale",
    title: "AAE Wholesale",
    description: "FX performance dashboard - Wholesale & Retail.",
    category: "Wholesale",
    icon: "W",
    url: "https://dhanyamambilayil.github.io/AAE-Wholesale-Dashboard/",
    status: "live",
    active: true
  },
  {
    id: "corporate",
    permissionKey: "corporate",
    title: "Corporate Desk",
    description: "Corporate RM Performance & Segmentation insights.",
    category: "Corporate",
    icon: "C",
    url: "https://dhanyamambilayil.github.io/Al-Ansari-Corporate-Desk-Dashboard/",
    status: "pending",
    active: true
  },
  {
    id: "customer-base",
    permissionKey: "customerBase",
    title: "Customer Base",
    description: "Unique customer, New customer trends.",
    category: "Customer Analytics",
    icon: "CB",
    url: "https://dhanyamambilayil.github.io/Customer-base-Dashboard/",
    status: "wip",
    active: true
  },
  {
    id: "competitive-presence",
    permissionKey: "competitivePresence",
    title: "Competitive Presence",
    description: "Market presence and competitive heatmap analysis.",
    category: "Market Intelligence",
    icon: "CP",
    url: "https://dhanyamambilayil.github.io/Competitive-Presence-Heatmap/",
    status: "wip",
    active: true
  },
  {
    id: "bec-win-back",
    permissionKey: "becWinBack",
    title: "BEC Win-Back",
    description: "BEC May Contest.",
    category: "Contests",
    icon: "BW",
    url: "https://dhanyamambilayil.github.io/BEC-Win-Back-Dashboard/",
    status: "live",
    active: true
  },
  {
    id: "aae-win-back",
    permissionKey: "aaeWinBack",
    title: "AAE Win-Back",
    description: "AAE May Contest.",
    category: "Contests",
    icon: "AW",
    url: "https://dhanyamambilayil.github.io/AAE-Win-Back-Dashboard/",
    status: "live",
    active: true
  },
  // Add future dashboards by copying this example:
  // {
  //   id: "audit",
  //   permissionKey: "audit",
  //   title: "Audit",
  //   description: "Audit observations and closure tracking.",
  //   category: "Governance",
  //   icon: "AU",
  //   url: "PASTE_THE_FULL_GITHUB_PAGES_URL_HERE",
  //   status: "live",
  //   active: true
  // }
];
