import { Link, useRouterState } from "@tanstack/react-router";
import { Leaf, LayoutDashboard, Info, Settings as SettingsIcon, Home, Newspaper, Target } from "lucide-react";
import { AccountMenu } from "./AccountMenu";
import { NavMascot } from "./Mascot";

const items = [
  { to: "/", label: "Home", icon: Home },
  { to: "/news", label: "News", icon: Newspaper },
  { to: "/quests", label: "Quests", icon: Target },
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/about", label: "About", icon: Info },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
] as const;

export function Nav() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <header className="sticky top-0 z-40 glass border-b">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-2xl leaf-gradient shadow-glow">
            <Leaf className="h-5 w-5 text-leaf-foreground" strokeWidth={2.2} />
          </div>
          <div>
            <div className="font-display text-base leading-tight">EcoMind</div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Sustainable choices
            </div>
          </div>
        </Link>
        <nav className="flex items-center gap-1">
          {items.map((item) => {
            const active = path === item.to;
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm transition-colors ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            );
          })}
          <NavMascot />
          <AccountMenu />
        </nav>
      </div>
    </header>
  );
}
