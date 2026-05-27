import { Link, useLocation } from "@tanstack/react-router";
import {
  ArrowLeft,
  GalleryVerticalEnd,
  Home,
  Key,
  Shield,
  User,
} from "lucide-react";
import { usePermission } from "@/shared/hooks/usePermission";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "./ui/sidebar";

const allMenuItems = [
  {
    name: "Home",
    url: "/admin",
    icon: Home,
    permission: null,
  },
  {
    name: "User",
    url: "/admin/users",
    icon: User,
    permission: "users:read",
  },
  {
    name: "Roles",
    url: "/admin/roles",
    icon: Shield,
    permission: "roles:read",
  },
  {
    name: "Permissions",
    url: "/admin/permissions",
    icon: Key,
    permission: "permissions:read",
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const isProfilePage = location.pathname.startsWith("/admin/profile");
  const { hasPermission } = usePermission();

  const menuItems = allMenuItems.filter((item) => {
    if (!item.permission) return true;
    return hasPermission(item.permission);
  });

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link to="/admin">
              <SidebarMenuButton size="lg">
                <div className="flex items-center gap-2 self-center font-medium">
                  <div className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                    <GalleryVerticalEnd className="size-4" />
                  </div>
                  {state === "expanded" ? "Acme Inc." : ""}
                </div>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarMenu className="gap-1">
            {isProfilePage ? (
              <SidebarMenuItem>
                <Link to="/admin">
                  <SidebarMenuButton tooltip="Back to admin" isActive={false}>
                    <ArrowLeft />
                    Back to admin
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ) : (
              menuItems.map((d) => (
                <SidebarMenuItem key={d.name}>
                  <Link to={d.url}>
                    <SidebarMenuButton
                      tooltip={d.name}
                      isActive={location.pathname === d.url}
                    >
                      <d.icon />
                      {d.name}
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))
            )}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
