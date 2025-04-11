"use client";

import Link from "next/link";
import { Input } from "../ui/input";
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
import { Search } from "lucide-react";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { LoginLink, LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";

export function Navbar() {
  return (
    <header className="flex items-center justify-between px-4 py-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      {/* Left Side Logo */}
      <div className="flex items-center gap-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Avatar className="w-8 h-8">
            <AvatarImage src="/logo.png" />
            <AvatarFallback className="bg-primary text-primary-foreground font-medium">
              Z
            </AvatarFallback>
          </Avatar>
          {/* Mobile Search */}
          <Button
            variant="ghost"
            className="active:bg-slate-100 bg-muted p-1 rounded-full active:scale-95 transition-all duration-200 md:hidden"
          >
            <Search className="w-6 h-6" />
          </Button>
          <span className="font-semibold text-sm hidden md:inline-block">
            JobBoard
          </span>
        </Link>

        {/* Search */}
        <Input
          placeholder="Search jobs..."
          className="hidden md:block w-40 md:w-60 h-9 text-sm rounded-full px-4 bg-muted/50 hover:bg-muted/80 transition-colors"
        />
      </div>

      {/* Right Side User Profile */}
      <UserDropDown />
    </header>
  );
}

const UserDropDown = () => {
  const { getUser, isLoading } = useKindeBrowserClient();
  const user = getUser();

  if (isLoading) {
    return (
      <Button variant="ghost" size="icon" className="rounded-full w-9 h-9">
        <Avatar className="w-8 h-8">
          <AvatarFallback className="bg-muted">...</AvatarFallback>
        </Avatar>
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full w-9 h-9">
            <Avatar className="w-8 h-8">
              <AvatarImage src={user?.picture || "/user-avatar.png"} />
              <AvatarFallback className="bg-muted">
                {user?.given_name?.[0] || "Z"}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 mr-2" align="end">
          {user ? (
            <>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile" className="w-full">
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/billing" className="w-full">
                  Billing
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/company" className="w-full">
                  Company
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/subscription" className="w-full">
                  Subscription
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogoutLink className="w-full">Logout</LogoutLink>
              </DropdownMenuItem>
            </>
          ) : (
            <>
              <DropdownMenuLabel>Guest</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LoginLink className="w-full">Login</LoginLink>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
