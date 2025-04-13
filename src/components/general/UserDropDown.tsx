"use client";

import { LogIn, LogOut, Settings } from "lucide-react";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { LoginLink, LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { ModeToggle } from "./ModeToggle";
import { ModeToggleDropdownItem } from "./ModeToggleDropdownItem";

export function UserDropDown() {
  const { getUser, isLoading } = useKindeBrowserClient();
  const user = getUser();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="rounded-full w-9 h-9">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-muted" />
          </Avatar>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {!user && <ModeToggle />}

      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full w-9 h-9"
            >
              <Avatar className="w-8 h-8">
                <AvatarImage src={user?.picture || ""} />
                <AvatarFallback className="bg-muted">
                  {user?.given_name?.[0]}
                  {user?.family_name?.[0]}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 mr-2" align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/settings" className="flex items-center w-full">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <ModeToggleDropdownItem />
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <LogoutLink className="flex items-center w-full">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </LogoutLink>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button asChild variant="outline">
          <LoginLink className="flex items-center gap-2">
            <LogIn className="h-4 w-4" />
            <span>Sign In</span>
          </LoginLink>
        </Button>
      )}
    </div>
  );
}
