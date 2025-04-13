"use client";

import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, X } from "lucide-react";
import { useSearch } from "@/context/SearchContext";
import { useEffect, useState } from "react";
import { UserDropDown } from "./UserDropDown";

export function Navbar() {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const { immediateSearch, setSearch } = useSearch(); // Get immediateSearch from context

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640) setMobileSearchOpen(false);
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMobileClearSearch = () => {
    setMobileSearchOpen(false);
    setSearch(""); // This will clear both immediate and debounced values
  };

  const handleDesktopClearSearch = () => {
    setSearch(""); // This will clear both immediate and debounced values
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value); // Update both immediate and debounced values
  };

  return (
    <header className="flex items-center justify-between px-4 py-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      {mobileSearchOpen ? (
        // Mobile Search Bar
        <div className="sm:hidden w-full flex relative items-center">
          <Input
            onChange={handleSearchChange}
            value={immediateSearch}
            placeholder="Search jobs..."
            className="w-full h-9 text-sm rounded-full pl-4 pr-10 bg-muted/50 hover:bg-muted/80 transition-colors"
          />
          <Button
            onClick={handleMobileClearSearch}
            variant="ghost"
            className="absolute right-2 top-1/2 -translate-y-1/2"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        // Desktop
        <>
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src="/logo.png" />
                <AvatarFallback className="bg-primary text-primary-foreground font-medium">
                  Z
                </AvatarFallback>
              </Avatar>
              <span className="font-semibold text-sm hidden md:inline-block">
                JobBoard
              </span>
            </Link>

            {/* Mobile Search Icon */}
            <Button
              onClick={() => setMobileSearchOpen(true)}
              variant="ghost"
              className="active:bg-slate-100 bg-muted p-1 rounded-full active:scale-95 transition-all duration-200 sm:hidden"
            >
              <Search className="w-6 h-6" />
            </Button>

            {/* Desktop Search Bar*/}
            <div className="hidden sm:flex w-full relative items-center">
              <Input
                placeholder="Search jobs..."
                value={immediateSearch} // Use immediateSearch from context
                onChange={handleSearchChange}
                className="hidden sm:block w-40 md:w-60 h-9 text-sm rounded-full px-4 bg-muted/50 hover:bg-muted/80 transition-colors"
              />
              {immediateSearch && ( // Check immediateSearch instead of local state
                <Button
                  onClick={handleDesktopClearSearch}
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:bg-transparent hover:text-slate-600 active:scale-95 transition-all duration-200 h-6 w-6"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <UserDropDown />
          </div>
        </>
      )}
    </header>
  );
}
