import NotificationMenu from "./notification-menu";
import SearchBar from "./search-bar";
import UserMenu from "./user-menu";

export default function NavbarActions() {
  return (
    <div className="flex items-center gap-3">
      <SearchBar />
      <NotificationMenu />
      <UserMenu />
    </div>
  );
}
