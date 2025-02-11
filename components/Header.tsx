"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import TitleText from "./TitleText";
import { ThemeToggleButton, ThemeToggleSwitch } from "./ThemeToggle";
import UserAvatar from "./UserAvatar";

const navigationItems = [{ title: "Connections", href: "/connections" }];

const Header = () => {
  const { data: session } = useSession();
  const pathname = usePathname();

  const isLoginPage = pathname === "/login";
  const isRegisterPage = pathname === "/register";

  const handleSignout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Failed to sign out", error);
    }
  };

  const UserMenu = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="default" className="h-10">
          {session?.user?.username || "Account"}
          <UserAvatar />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48" align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile">My Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings">Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <ThemeToggleSwitch />
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignout}>Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const MobileMenu = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="default" className="h-10 md:hidden">
          {session?.user?.username || "Account"}
          <UserAvatar />
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-4 mt-4">
          <Link href="/profile" className="text-sm font-medium transition-colors hover:text-primary">
            My Profile
          </Link>
          {navigationItems.map((item) => (
            <Link key={item.title} href={item.href} className="text-sm font-medium transition-colors hover:text-primary">
              {item.title}
            </Link>
          ))}
          <ThemeToggleSwitch />
          <Button onClick={handleSignout} variant="ghost" className="justify-start p-0">
            Sign out
          </Button>
        </nav>
      </SheetContent>
    </Sheet>
  );

  if (isLoginPage || isRegisterPage) {
    return (
      <header className="flex justify-between items-center p-4">
        <TitleText />
        <ThemeToggleButton />
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between px-4">
        <TitleText />

        <div className="flex items-center gap-2 sm:gap-4">
          <nav className="hidden md:flex items-center space-x-4">
            {navigationItems.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === item.href ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {item.title}
              </Link>
            ))}
          </nav>
          {session && (
            <>
              <div className="hidden md:block">
                <UserMenu />
              </div>
              <MobileMenu />
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
