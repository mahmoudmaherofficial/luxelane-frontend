// constants/DashboardNavLinks.js
import { FolderTree, Home, ListOrdered, Package, Users } from "lucide-react";

const dashboardNavItems = [
  { name: "Dashboard", Icon: Home, href: "/dashboard", allowedRoles: [1995, 1996] },
  { name: "Users", Icon: Users, href: "/dashboard/users", allowedRoles: [1995] },
  { name: "Categories", Icon: FolderTree, href: "/dashboard/categories", allowedRoles: [1995, 1996] },
  { name: "Products", Icon: Package, href: "/dashboard/products", allowedRoles: [1995, 1996] },
  { name: "Orders", Icon: ListOrdered, href: "/dashboard/orders", allowedRoles: [1995, 1996] },
];

export default dashboardNavItems
