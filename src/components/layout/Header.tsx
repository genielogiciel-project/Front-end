import { useState } from "react";
import { useAppSelector, useAppDispatch } from "@/lib/store";
import { Bell, User, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/features/auth/authSlice";
import { UserRole } from "@/lib/types";

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  // @ts-ignore
  const name =
    // @ts-ignore
    user?.fullName?.charAt(0).toUpperCase() + user?.fullName?.slice(1);
  const { notifications } = useAppSelector((state) => state.notifications);
  const [searchQuery, setSearchQuery] = useState("");

  const unreadNotifications = notifications.filter((n) => !n.read).length;

  const handleLogout = () => {
    dispatch(logout());
  };

  const getRoleName = (role: UserRole[]) => {
    if (role.includes(UserRole.DEPARTMENT_HEAD)) return "Chef de département";
    if (role.includes(UserRole.RESOURCE_MANAGER))
      return "Responsable des ressources";
    if (role.includes(UserRole.MAINTENANCE)) return "Service de maintenance";
    if (role.includes(UserRole.SUPPLIER)) return "Fournisseur";

    return role;
  };

  return (
    <header className="bg-white border-b border-border flex items-center justify-between px-4 py-2 h-16">
      <div className="flex items-center w-full md:w-auto gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="md:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="relative md:w-96">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadNotifications > 0 && (
                <span className="absolute top-1 right-1 bg-destructive text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {unreadNotifications}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.length > 0 ? (
              notifications.slice(0, 5).map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className="cursor-pointer"
                >
                  <div
                    className={`${notification.read ? "opacity-50" : "font-medium"}`}
                  >
                    <p>{notification.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(notification.timestamp).toLocaleString()}
                    </p>
                  </div>
                </DropdownMenuItem>
              ))
            ) : (
              <DropdownMenuItem disabled>Aucune notification</DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center font-medium">
              Voir toutes les notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative flex items-center gap-2"
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback>
<<<<<<< HEAD
                  {user?.fullName
=======
                   { "a" /*user?.name
>>>>>>> d733e3290f0194f7e50c8915c08cb14008194476
                    .split(" ")
                    .map((n) => n[0])
                    .join("")*/} 
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-left">
<<<<<<< HEAD
                <p className="text-sm font-medium">{name || ""}</p>
=======
                <p className="text-sm font-medium">{"ayoub"}</p>
>>>>>>> d733e3290f0194f7e50c8915c08cb14008194476
                <p className="text-xs text-muted-foreground">
                  {user?.role ? getRoleName(user.role /** he is him  */) : ""}
                </p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profil</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>
              Déconnexion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
