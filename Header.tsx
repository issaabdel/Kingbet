import { Link, useLocation } from "wouter";
import { Lock, Sun, Moon, Crown } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { Button } from "@/components/ui/button";

export function Header() {
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="flex items-center justify-between h-16 px-4 max-w-md mx-auto">
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-violet-900 flex items-center justify-center shadow-lg shadow-primary/20">
              <Crown className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold font-display tracking-wider text-foreground">
              KING<span className="text-primary">BET</span>
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <Link href="/admin-login">
            <div className="w-1.5 h-1.5 rounded-full bg-foreground/10 hover:bg-primary/50 transition-colors cursor-pointer" />
          </Link>
        </div>
      </div>
    </header>
  );
}
