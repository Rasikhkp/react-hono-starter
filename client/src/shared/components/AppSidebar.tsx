import { useLocation, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, GalleryVerticalEnd, X } from "lucide-react";
import { useRef } from "react";
import { HomeIcon, type HomeIconHandle } from "@/shared/components/ui/home";
import { usePermission } from "@/shared/hooks/usePermission";
import {
  AnimatedSidebar,
  AnimatedSidebarClose,
  AnimatedSidebarContent,
  AnimatedSidebarGroup,
  AnimatedSidebarGroupContent,
  AnimatedSidebarGroupLabel,
  AnimatedSidebarHeader,
  AnimatedSidebarMenu,
  AnimatedSidebarMenuButton,
  AnimatedSidebarMenuItem,
  AnimatedSidebarRail,
  useAnimatedSidebar,
} from "./motion/animated-sidebar";
import { KeyCircleIcon } from "./ui/key-circle";
import { UserIcon } from "./ui/user";
import { UsersRoundIcon } from "./ui/users-round";

const allMenuItems = [
  {
    name: "Home",
    url: "/admin",
    icon: HomeIcon,
    permission: null,
  },
  {
    name: "User",
    url: "/admin/users",
    icon: UserIcon,
    permission: "users:read",
  },
  {
    name: "Roles",
    url: "/admin/roles",
    icon: UsersRoundIcon,
    permission: "roles:read",
  },
  {
    name: "Permissions",
    url: "/admin/permissions",
    icon: KeyCircleIcon,
    permission: "permissions:read",
  },
] as const;

function SidebarNavButton({
  name,
  url,
  icon: Icon,
}: {
  name: string;
  url: (typeof allMenuItems)[number]["url"];
  icon: (typeof allMenuItems)[number]["icon"];
}) {
  const iconRef = useRef<HomeIconHandle>(null);
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <AnimatedSidebarMenuButton
      className="cursor-pointer"
      icon={<Icon ref={iconRef} size={16} />}
      isActive={location.pathname === url}
      onSelect={() => navigate({ to: url })}
      onMouseEnter={() => iconRef.current?.startAnimation()}
      onMouseLeave={() => iconRef.current?.stopAnimation()}
    >
      {name}
    </AnimatedSidebarMenuButton>
  );
}

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isMobile, setOpenMobile } = useAnimatedSidebar();
  const isProfilePage = location.pathname.startsWith("/admin/profile");
  const { hasPermission } = usePermission();

  const menuItems = allMenuItems.filter((item) => {
    if (!item.permission) return true;
    return hasPermission(item.permission);
  });

  return (
    <AnimatedSidebar ariaLabel="Admin sidebar" collapsible="icon">
      <AnimatedSidebarHeader className="p-3 pb-2">
        <div className="flex min-h-11 items-center gap-3 overflow-hidden px-2">
          <button
            type="button"
            onClick={() => {
              navigate({ to: "/admin" });
              if (isMobile) setOpenMobile(false);
            }}
            className="flex min-w-0 flex-1 items-center gap-2 rounded-lg text-left outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div>
            <span className="truncate font-medium text-sm group-data-[state=collapsed]/sidebar:hidden">
              Acme Inc.
            </span>
          </button>
          <AnimatedSidebarClose className="ml-auto text-muted-foreground hover:bg-muted md:hidden">
            <X aria-hidden="true" className="size-4" />
          </AnimatedSidebarClose>
        </div>
      </AnimatedSidebarHeader>
      <AnimatedSidebarContent>
        <AnimatedSidebarGroup>
          <AnimatedSidebarGroupLabel>Menu</AnimatedSidebarGroupLabel>
          <AnimatedSidebarGroupContent>
            <AnimatedSidebarMenu>
              {isProfilePage ? (
                <AnimatedSidebarMenuItem>
                  <AnimatedSidebarMenuButton
                    className="cursor-pointer"
                    icon={<ArrowLeft className="size-4" />}
                    onSelect={() => navigate({ to: "/admin" })}
                  >
                    Back to admin
                  </AnimatedSidebarMenuButton>
                </AnimatedSidebarMenuItem>
              ) : (
                menuItems.map((d) => (
                  <AnimatedSidebarMenuItem key={d.name}>
                    <SidebarNavButton name={d.name} url={d.url} icon={d.icon} />
                  </AnimatedSidebarMenuItem>
                ))
              )}
            </AnimatedSidebarMenu>
          </AnimatedSidebarGroupContent>
        </AnimatedSidebarGroup>
      </AnimatedSidebarContent>
      <AnimatedSidebarRail />
    </AnimatedSidebar>
  );
}
