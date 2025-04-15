"use client";

import { ThemeProvider } from "./theme-provider";
import { AuthProvider } from "./AuthProvider";
import { QueryProvider } from "./QueryProvider";
import { Toaster } from "sonner";
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
            {children}

            <Toaster />
          </SearchProvider>
        </QueryProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
