import NavbarActions from "./navbar-actions";
import NavbarBrand from "./navbar-brand";
import NavbarMenu from "./navbar-menu";

export default function Navbar() {
  return (
    <nav className="w-full flex items-center justify-between p-6">
      <NavbarBrand />
      <NavbarMenu />
      <NavbarActions />
    </nav>
  );
}
