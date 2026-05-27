import { Link, useNavigate } from "@tanstack/react-router";
import { Moon, Sun, LogOut, User as UserIcon, Settings as SettingsIcon, Shield } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/lib/theme";
import { useAuth } from "@/lib/auth";
import { ResponsibleAIDialog } from "@/components/responsible-ai";
import { MoodSwitcher } from "@/components/mood-switcher";
import { SoundDock } from "@/components/sound-dock";

export function AppHeader() {
  const { theme, toggle } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const initials = (user?.name || "U")
    .split(" ")
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="h-14 border-b border-border flex items-center px-3 gap-2 bg-background/60 backdrop-blur sticky top-0 z-30">
      <SidebarTrigger />
      <div className="flex-1" />
      <MoodSwitcher />
      <SoundDock />
      <ResponsibleAIDialog>
        <Button variant="ghost" size="sm" className="gap-2">
          <Shield className="h-4 w-4" /> <span className="hidden sm:inline">Responsible AI</span>
        </Button>
      </ResponsibleAIDialog>
      <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
        {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 rounded-full pl-1 pr-3 py-1 hover:bg-accent">
            <Avatar className="h-7 w-7">
              <AvatarFallback className="text-[11px] gradient-primary text-primary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="hidden md:inline text-sm font-medium">{user?.name}</span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="flex flex-col">
            <span>{user?.name}</span>
            <span className="text-xs text-muted-foreground font-normal">{user?.email}</span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to="/profile"><UserIcon className="h-4 w-4 mr-2" /> Profile</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/settings"><SettingsIcon className="h-4 w-4 mr-2" /> Settings</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              logout();
              navigate({ to: "/login" });
            }}
            className="text-destructive focus:text-destructive"
          >
            <LogOut className="h-4 w-4 mr-2" /> Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
