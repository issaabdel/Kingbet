import { Link, useLocation } from "wouter";
import { Home, Trophy, Crown, History } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Accueil", icon: Home },
    { href: "/free", label: "Gratuit", icon: Trophy },
    { href: "/vip", label: "VIP", icon: Crown },
    { href: "/history", label: "Historique", icon: History },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-t border-white/10 safe-area-bottom">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto px-2">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = location === href;
          return (
            <Link key={href} href={href} className="w-full">
              <div
                className={cn(
                  "flex flex-col items-center justify-center gap-1 py-1 w-full transition-colors duration-200 cursor-pointer",
                  isActive
                    ? "text-primary neon-text"
                    : "text-muted-foreground hover:text-primary/70"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive && "stroke-[2.5px]")} />
                <span className="text-[10px] font-medium tracking-wide uppercase">{label}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
