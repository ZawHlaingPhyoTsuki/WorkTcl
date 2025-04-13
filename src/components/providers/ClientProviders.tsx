"use client";

import { ThemeProvider } from "./theme-provider";
import { AuthProvider } from "./AuthProvider";
import { QueryProvider } from "./QueryProvider";
import { Toaster } from "sonner";
import { Navbar } from "../general/Navbar";
import { SearchProvider } from "@/context/SearchContext";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <QueryProvider>
          <SearchProvider>
            <Navbar />
            {children}

            <Toaster />
          </SearchProvider>
        </QueryProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
