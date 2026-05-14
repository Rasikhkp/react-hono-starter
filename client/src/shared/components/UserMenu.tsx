import { useNavigate } from "@tanstack/react-router";
import { useSetAtom } from "jotai";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { authAtom } from "../atoms/authAtom";
import { api } from "../lib/api";
import { safeFetch } from "../lib/safeFetch";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { toastManager } from "./ui/toast";

export function UserMenu() {
  const navigate = useNavigate();
  const setAuth = useSetAtom(authAtom);

  const handleLogout = async () => {
    const { error } = await safeFetch(
      api.post("auth/logout", { credentials: "include" }).json(),
    );

    if (error) {
      toastManager.add({
        type: "error",
        description: error.message,
        title: "Error occured",
      });
    } else {
      setAuth(null);
      navigate({ to: "/sign-in" });
    }
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="cursor-pointer"
        render={
          <button type="button">
            <Avatar>
              <AvatarImage
                src="https://github.com/shadcn.png"
                alt="@shadcn"
                className="grayscale"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </button>
        }
      />
      <DropdownMenuContent className="w-52">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-md text-foreground">
            <div>John Doe</div>
            <div className="text-xs text-muted-foreground">
              johndoe@gmail.com
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
