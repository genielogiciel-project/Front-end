import { Link, useLocation } from "react-router-dom";
import { useAppSelector } from "@/lib/store";
import { cn } from "@/lib/utils";
import {
  Home,
  FileText,
  Package,
  ShoppingCart,
  Users,
  Settings,
  AlertTriangle,
  ClipboardList,
  LogOut,
  ChevronLeft,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserRole } from "@/lib/types";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const navigation = [
  {
    name: "Tableau de bord",
    href: "/dashboard",
    icon: Home,
    roles: [
      UserRole.DEPARTMENT_HEAD,
      UserRole.RESOURCE_MANAGER,
      UserRole.MAINTENANCE,
      UserRole.SUPPLIER,
    ],
  },
  {
    name: "Demandes",
    href: "/requests",
    icon: FileText,
    roles: [UserRole.DEPARTMENT_HEAD, UserRole.RESOURCE_MANAGER],
  },
  {
    name: "Appels d'offre",
    href: "/tenders",
    icon: ShoppingCart,
    roles: [UserRole.RESOURCE_MANAGER, UserRole.SUPPLIER],
  },
  {
    name: "Ressources",
    href: "/resources",
    icon: Package,
    roles: [UserRole.RESOURCE_MANAGER, UserRole.DEPARTMENT_HEAD],
  },
  {
    name: "Maintenance",
    href: "/maintenance",
    icon: AlertTriangle,
    roles: [
      UserRole.MAINTENANCE,
      UserRole.DEPARTMENT_HEAD,
      UserRole.RESOURCE_MANAGER,
    ],
  },
  {
    name: "Fournisseurs",
    href: "/suppliers",
    icon: Users,
    roles: [UserRole.RESOURCE_MANAGER],
  },
  {
    name: "Rapports",
    href: "/reports",
    icon: ClipboardList,
    roles: [UserRole.RESOURCE_MANAGER],
  },
  {
    name: "Paramètres",
    href: "/settings",
    icon: Settings,
    roles: [UserRole.RESOURCE_MANAGER],
  },
];

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const location = useLocation();
  const { user } = useAppSelector((state) => state.auth);

  let filteredNavigation = navigation;
  if (user?.role != UserRole.SUPER_ADMIN) {
    filteredNavigation = navigation.filter(
      (item) => user?.role && item.roles.includes(user.role)
    );
  }

  return (
    <div
      className={cn(
        "fixed md:relative flex flex-col h-full bg-white border-r border-border transition-all duration-300",
        isOpen ? "w-64" : "w-[60px]"
      )}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-border">
        <h1
          className={cn(
            "text-xl font-bold transition-opacity duration-300 text-nowrap",
            !isOpen && "opacity-0 hidden"
          )}
        >
          Gestion Ressources
        </h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="hidden md:flex"
        >
          {isOpen ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <Menu className="h-4 w-4" />
          )}
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-2">
          {filteredNavigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center px-2 py-2 text-sm font-medium rounded-md group transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-gray-700 hover:bg-muted"
                )}
                title={!isOpen ? item.name : undefined}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5 flex-shrink-0",
                    isActive ? "text-primary-foreground" : "text-gray-500"
                  )}
                  aria-hidden="true"
                />
                <span
                  className={cn(
                    "ml-3 transition-opacity duration-300",
                    !isOpen && "opacity-0 hidden"
                  )}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-border">
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start",
            !isOpen && "px-0 justify-center"
          )}
          asChild
        >
          <Link to="/login">
            <LogOut className="h-4 w-4" />
            <span
              className={cn(
                "ml-2 transition-opacity duration-300",
                !isOpen && "opacity-0 hidden"
              )}
            >
              Déconnexion
            </span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
