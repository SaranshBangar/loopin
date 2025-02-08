"use client";

import React from "react";
import { signOut, useSession } from "next-auth/react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import TitleText from "./TitleText";

const Header = () => {
  const { setTheme } = useTheme();
  const { data: session } = useSession();

  const handleSignout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Failed to sign out", error);
    }
  };

  const isClient = typeof window !== "undefined";
  const isLoginPage = isClient && window.location.pathname === "/login";
  const isRegisterPage = isClient && window.location.pathname === "/register";
  const isHomePage = isClient && window.location.pathname === "/";

  return (
    <>
      {isLoginPage || isRegisterPage ? (
        <header className="flex justify-between items-center p-4">
          <TitleText />
          <div>
            <Button variant="outline" size="icon" onClick={() => setTheme((theme) => (theme === "light" ? "dark" : "light"))}>
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
        </header>
      ) : null}
      {isHomePage && (
        <header className="flex justify-between items-center p-4">
          <TitleText />
          <div>
            <Button variant="outline" size="icon" onClick={() => setTheme((theme) => (theme === "light" ? "dark" : "light"))}>
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
        </header>
      )}
    </>
  );
};

export default Header;
