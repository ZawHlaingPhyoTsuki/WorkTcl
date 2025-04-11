"use client";

import { ThemeProvider } from "./theme-provider";
import { AuthProvider } from "./AuthProvider";
import { QueryProvider } from "./QueryProvider";
import { Toaster } from "sonner";
import { ModeToggle } from "../general/ModeToggle";
import { Navbar } from "../general/Navbar";

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
          <Navbar />
          {children}
          <div className="hidden sm:block fixed bottom-3 right-3 z-50">
            <ModeToggle />
          </div>
          <Toaster />
        </QueryProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
