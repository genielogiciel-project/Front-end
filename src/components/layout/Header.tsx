import { useState } from "react";
import { useAppSelector, useAppDispatch } from "@/lib/store";
import { Bell, User, Search, Menu, X } from "lucide-react";
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
import { Notification, notificationTypeIcons, UserRole } from "@/lib/types";
import {
  useGetAllNotificationsByUser,
  useReadNotification,
} from "@/hooks/useNotificationApi";

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);
  const [showNotificationDetail, setShowNotificationDetail] = useState(false);

  const { data: notifications } = useGetAllNotificationsByUser(user?.id!);
  const { mutate: readNotification } = useReadNotification();

  const name =
    user?.fullName?.charAt(0).toUpperCase() + user?.fullName?.slice(1) || "";
  const iconName = user?.fullName
    ?.split(" ")
    .map((n) => n.charAt(0))
    .join("");

  const [searchQuery, setSearchQuery] = useState("");

  const unreadNotifications = notifications?.filter((n) => !n.seen)?.length;

  const handleLogout = () => {
    dispatch(logout());
  };

  const getRoleName = (role: UserRole[]) => {
    if (role.includes(UserRole.DEPARTMENT_HEAD)) return "Chef de département";
    if (role.includes(UserRole.RESOURCE_MANAGER))
      return "Responsable des ressources";
    if (role.includes(UserRole.TECHNICIAN)) return "Service de maintenance";
    if (role.includes(UserRole.SUPPLIER)) return "Fournisseur";

    return role;
  };

  const handleNotificationClick = (notification: any) => {
    setSelectedNotification(notification);
    setShowNotificationDetail(true);
  };

  const closeNotificationDetail = () => {
    setShowNotificationDetail(false);
  };

  return (
    <header className="bg-white border-b border-border flex items-center justify-between px-4 py-2 h-16 relative">
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
        {/* Notification Detail Panel */}
        {showNotificationDetail && selectedNotification && (
          <div className="fixed inset-0 bg-black/70 bg-opacity-50 z-40 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
              <button
                onClick={closeNotificationDetail}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    {notificationTypeIcons[selectedNotification.type]}
                  </div>
                  <h3 className="text-lg font-semibold">
                    {selectedNotification.type}
                  </h3>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    {new Date(
                      selectedNotification.sentDate
                    ).toLocaleDateString()}
                  </p>
                  <p className="text-base">{selectedNotification.message}</p>
                </div>
                <div className="pt-4">
                  <Button onClick={closeNotificationDetail} className="w-full">
                    Fermer
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadNotifications! > 0 && (
                <span className="absolute top-1 right-1 bg-destructive text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {unreadNotifications}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications?.length! > 0 ? (
              notifications?.slice(0, 5).map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className="cursor-pointer"
                  onClick={() => {
                    handleNotificationClick(notification);
                    readNotification(notification.id);
                  }}
                >
                  <div
                    className={`${
                      notification.seen ? "opacity-50" : "font-medium"
                    }`}
                  >
                    <p className="flex items-center gap-1">
                      {notificationTypeIcons[notification.type]}
                      {notification.type}
                    </p>
                    <p className="text-sm text-muted-foreground truncate ml-10">
                      {notification.message.split("").length > 40
                        ? notification.message.split("").slice(0, 40).join("") +
                          "..."
                        : notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(notification.sentDate).toLocaleDateString()}
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
                <AvatarFallback>{iconName}</AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium">{name || ""}</p>
                <p className="text-xs text-muted-foreground">
                  {user?.role ? getRoleName(user.role) : ""}
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
