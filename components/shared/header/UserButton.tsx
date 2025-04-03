import { Button } from "@/components/ui/button";
import { UserIcon } from "lucide-react";
import Link from "next/link";
import { signOutUser } from "@/lib/actions/user.actions";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { auth } from "@/auth";

const UserButton = async () => {
  const session = await auth();
  if (!session) {
    return (
      <Button asChild>
        <Link href="/sign-in">
          <UserIcon />
          Sign In
        </Link>
      </Button>
    );
  }
  const userInitial =
    session.user?.name?.charAt(0).toUpperCase() ??
    "" + session.user?.name?.slice(1);

  return (
    <div className="flex gap-2 items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center">
            <Button
              className="relative w-8 h-8 rounded-full ml-2 flex items-center justify-center bg-gray-200"
              variant="ghost"
            >
              {userInitial}
            </Button>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {session.user?.name}
              </p>
            </div>
            <div className="flex flex-col space-y-1">
              <p className="text-sm text-muted-foreground leading-none">
                {session.user?.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuItem>
            <Link href="/user/profile">Profile</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/user/orders">Orders</Link>
          </DropdownMenuItem>
          {session?.user?.role === "admin" && (
            <DropdownMenuItem>
              <Link href="/admin/overview">Admin</Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem className="p-0 mb-2">
            <form action={signOutUser} className="w-full">
              <Button
                className="w-full px-2 py-4 h-4 justify-start"
                variant="ghost"
              >
                Sign Out
              </Button>
            </form>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserButton;
