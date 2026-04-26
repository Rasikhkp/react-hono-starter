import { Link, useLocation } from "@tanstack/react-router";
import type { ReactElement } from "react";

export default function NavbarMenuItem({ item }: { item: { path: string; label: string; icon: ReactElement } }) {
  const location = useLocation()

  console.log('location', location)
  return (
    <Link
      to={item.path}
      activeProps={{ className: "bg-black text-white hover:bg-black" }}
      inactiveProps={{ className: "text-black hover:bg-gray-200" }}
      className="text-gray-600 px-4 py-2 tracking-widest rounded-full text-sm transition cursor-pointer flex gap-2 items-center">
      {item.path === location.pathname ? item.icon : ""}
      {item.label}
    </Link>
  );
}
