import { Link, useLocation } from "@tanstack/react-router";
import { ArrowLeft, GalleryVerticalEnd, Home, Key, User } from "lucide-react";
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

const menuItems = [
  {
    name: "Home",
    url: "/admin",
    icon: Home,
  },
  {
    name: "User",
    url: "/admin/users",
    icon: User,
  },
  {
    name: "Permission",
    url: "/admin/permissions",
    icon: Key,
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const isProfilePage = location.pathname.startsWith("/admin/profile");

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
