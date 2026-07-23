// Edit this single list whenever you want to add, remove or rename a dashboard.
// permissionKey must match the Boolean field in the user's Firestore document.
// Admin users (admin: true) see all active dashboards.

export const DASHBOARDS = [
  {
    id: "retail",
    permissionKey: "retail",
    title: "Retail Performance",
    description: "Kuwait branch performance, trends and operational KPIs.",
    category: "Retail",
    icon: "R",
    url: "https://dhanyamambilayil.github.io/Kuwait-Branch-Performance-Dashboard/",
    active: true
  },
  {
    id: "wholesale",
    permissionKey: "wholesale",
    title: "Wholesale",
    description: "Wholesale revenue, volume, margin and dealer performance.",
    category: "Wholesale",
    icon: "W",
    url: "https://dhanyamambilayil.github.io/Wholesale-Dashboard/",
    active: true
  },
  {
    id: "corporate",
    permissionKey: "corporate",
    title: "Corporate Desk",
    description: "Corporate desk business and relationship performance.",
    category: "Corporate",
    icon: "C",
    url: "https://dhanyamambilayil.github.io/Al-Ansari-Corporate-Desk-Dashboard/",
    active: true
  },
  {
    id: "customer-base",
    permissionKey: "customerBase",
    title: "Customer Base",
    description: "Customer portfolio, activity and segmentation insights.",
    category: "Customers",
    icon: "CB",
    url: "https://dhanyamambilayil.github.io/Customer-base-Dashboard/",
    active: true
  },
  {
    id: "competitive-presence",
    permissionKey: "competitivePresence",
    title: "Competitive Presence",
    description: "Market presence and competitive heatmap analysis.",
    category: "Strategy",
    icon: "CP",
    url: "https://dhanyamambilayil.github.io/Competitive-Presence-Heatmap/",
    active: true
  },
  {
    id: "bec-win-back",
    permissionKey: "becWinBack",
    title: "BEC Win-Back",
    description: "Inactive-customer reactivation and win-back performance.",
    category: "Customers",
    icon: "BW",
    url: "https://dhanyamambilayil.github.io/BEC-Win-Back-Dashboard/",
    active: true
  },
  {
    id: "aae-win-back",
    permissionKey: "aaeWinBack",
    title: "AAE Win-Back",
    description: "AAE customer reactivation and win-back performance.",
    category: "Customers",
    icon: "AW",
    url: "https://dhanyamambilayil.github.io/AAE-Win-Back-Dashboard/",
    active: true
  }

  // Add future dashboards by copying this example:
  // {
  //   id: "audit",
  //   permissionKey: "audit",
  //   title: "Audit",
  //   description: "Audit observations and closure tracking.",
  //   category: "Governance",
  //   icon: "AU",
  //   url: "PASTE_THE_FULL_GITHUB_PAGES_URL_HERE",
  //   active: true
  // }
];
