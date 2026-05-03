import { Category, Key, User } from "iconsax-reactjs";
import NavbarMenuItem from "./navbar-menu-item";

const items = [
  {
    path: '/dashboard',
    label: 'Dashboard',
    icon: <Category size={14} />
  },
  {
    path: '/users',
    label: 'User',
    icon: <User size={14} />
  },
  {
    path: '/roles',
    label: 'Role',
    icon: <Key size={14} />
  },
];

export default function NavbarMenu() {
  return (
    <div className="flex items-center gap-4">
      {items.map((item, idx) => (
        <NavbarMenuItem key={idx} item={item} />
      ))}
    </div>
  );
}
