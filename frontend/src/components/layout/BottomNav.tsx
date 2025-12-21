import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Search, PlusCircle, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Search, label: "Search", path: "/search" },
];

export function BottomNav() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const allItems = [
    ...navItems,
    ...(isAuthenticated
      ? [
          { icon: PlusCircle, label: "Upload", path: "/dashboard" },
          { icon: User, label: "Profile", path: "/dashboard" },
        ]
      : [{ icon: User, label: "Login", path: "/creator/login" }]),
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-border/50 md:hidden">
      <div className="flex items-center justify-around py-2">
        {allItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path + item.label}
              to={item.path}
              className="relative flex flex-col items-center gap-1 p-2"
            >
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute inset-0 gradient-primary rounded-xl opacity-20"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <item.icon
                className={cn(
                  "h-6 w-6 transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              />
              <span
                className={cn(
                  "text-xs transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
