import { useState, useMemo } from "react";
import { useAppSelector, useAppDispatch } from "@/lib/store";
import {
  Bell,
  User,
  Search,
  Menu,
  X,
  MessageSquare,
  Send,
  ChevronDown,
  AlertTriangle,
  Info,
  AlertCircle,
  CheckCircle,
  XCircle,
  AlertOctagon,
  ShieldAlert,
  Truck,
  Wrench,
} from "lucide-react";
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
import {
  Notification,
  NotificationType,
  notificationTypeIcons,
  UserRole,
} from "@/lib/types";
import {
  useGetAllNotificationsByUser,
  useReadNotification,
  useSendMessage,
} from "@/hooks/useNotificationApi";
import { useGetAllUsers } from "@/hooks/useUserApi";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useToast } from "@/hooks/use-toast";

interface HeaderProps {
  onMenuClick: () => void;
}

const notificationTypeOptions = [
  {
    value: NotificationType.INFO,
    label: "Information",
    icon: <Info className="h-4 w-4" />,
    color: "bg-blue-100 text-blue-800",
  },
  {
    value: NotificationType.ACTION_REQUIRED,
    label: "Action Requise",
    icon: <AlertTriangle className="h-4 w-4" />,
    color: "bg-red-100 text-red-800",
  },
  {
    value: NotificationType.ALERT,
    label: "Alerte",
    icon: <AlertCircle className="h-4 w-4" />,
    color: "bg-orange-100 text-orange-800",
  },
  {
    value: NotificationType.SUCCESS,
    label: "Succès",
    icon: <CheckCircle className="h-4 w-4" />,
    color: "bg-green-100 text-green-800",
  },
  {
    value: NotificationType.ERROR,
    label: "Erreur",
    icon: <XCircle className="h-4 w-4" />,
    color: "bg-red-100 text-red-800",
  },
  {
    value: NotificationType.REJECTION,
    label: "Rejet",
    icon: <AlertOctagon className="h-4 w-4" />,
    color: "bg-purple-100 text-purple-800",
  },
  {
    value: NotificationType.WARNING,
    label: "Avertissement",
    icon: <ShieldAlert className="h-4 w-4" />,
    color: "bg-yellow-100 text-yellow-800",
  },
  {
    value: NotificationType.SYSTEM,
    label: "Système",
    icon: <Info className="h-4 w-4" />,
    color: "bg-gray-100 text-gray-800",
  },
  {
    value: NotificationType.DELIVERY,
    label: "Livraison",
    icon: <Truck className="h-4 w-4" />,
    color: "bg-indigo-100 text-indigo-800",
  },
  {
    value: NotificationType.MAINTENANCE,
    label: "Maintenance",
    icon: <Wrench className="h-4 w-4" />,
    color: "bg-cyan-100 text-cyan-800",
  },
];

export default function Header({ onMenuClick }: HeaderProps) {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const { user } = useAppSelector((state) => state.auth);
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);
  const [showNotificationDetail, setShowNotificationDetail] = useState(false);
  const [showMessagePanel, setShowMessagePanel] = useState(false);
  const [messageRecipients, setMessageRecipients] = useState<string[]>([]);
  const [messageContent, setMessageContent] = useState("");
  const [messageType, setMessageType] = useState<NotificationType>(
    NotificationType.INFO
  );
  const [notificationFilter, setNotificationFilter] =
    useState<NotificationType>(NotificationType.INFO);

  const { data: notifications } = useGetAllNotificationsByUser();
  const { data: users = [] } = useGetAllUsers();
  const { mutate: readNotification } = useReadNotification();
  const { mutate: sendMessage } = useSendMessage();

  const name =
    user?.fullName?.charAt(0).toUpperCase() + user?.fullName?.slice(1)! || "";
  const iconName = user?.fullName
    ?.split(" ")
    .map((n) => n.charAt(0))
    .join("");

  const [searchQuery, setSearchQuery] = useState("");

  const filteredNotifications = useMemo(() => {
    if (notificationFilter === NotificationType.INFO) {
      return notifications || [];
    }
    return notifications?.filter((n) => n.type === notificationFilter) || [];
  }, [notifications, notificationFilter]);

  const unreadNotifications = filteredNotifications.filter(
    (n) => !n.seen
  ).length;

  const handleLogout = () => {
    dispatch(logout());
  };

  const getRoleName = (role: UserRole[]) => {
    if (role.includes(UserRole.DEPARTMENT_HEAD)) return "Chef de département";
    if (role.includes(UserRole.RESOURCE_MANAGER))
      return "Responsable des ressources";
    if (role.includes(UserRole.TECHNICIAN)) return "Service de maintenance";
    if (role.includes(UserRole.SUPPLIER)) return "Fournisseur";
    return role.join(", ");
  };

  const handleNotificationClick = (notification: Notification) => {
    setSelectedNotification(notification);
    setShowNotificationDetail(true);
    if (!notification.seen) {
      readNotification(notification.id);
    }
  };

  const closeNotificationDetail = () => {
    setShowNotificationDetail(false);
  };

  const toggleRecipient = (userId: string) => {
    setMessageRecipients((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSendMessage = () => {
    try {
      sendMessage(
        {
          sender: user?.id!,
          receivers: messageRecipients,
          message: messageContent,
          type: messageType,
        },
        {
          onSuccess: () => {
            setShowMessagePanel(false);
            setMessageRecipients([]);
            setMessageContent("");
            setMessageType(NotificationType.INFO);
          },
        }
      );
      toast({
        title: (
          <div className="flex flex-row items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            <div>Message envoyé</div>
          </div>
        ) as any,
        description: "Le message a bien était envoyé",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: (
          <div className="flex flex-row items-center gap-2">
            <XCircle className="h-4 w-4" />
            <div>Message non envoyé</div>
          </div>
        ) as any,
        description: "Le message n'a pas été envoyé",
        variant: "destructive",
      });
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u) => u.id !== user?.id);
  }, [users, user?.id]);

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
        {/* Message Panel */}
        {showMessagePanel && (
          <div className="fixed inset-0 bg-black/70 bg-opacity-50 z-40 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
              <button
                onClick={() => setShowMessagePanel(false)}
                className="absolute top-4 right-4"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Nouveau message</h3>

                {/* Message Type Selector */}
                <div className="space-y-2">
                  <Label>Type de message</Label>
                  <Select
                    value={messageType}
                    onValueChange={(value) =>
                      setMessageType(value as NotificationType)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un type" />
                    </SelectTrigger>
                    <SelectContent>
                      {notificationTypeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            <span
                              className={`${option.color} rounded-full overflow-hidden`}
                            >
                              {option.icon}
                            </span>
                            {option.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Destinataires</Label>
                  <Command className="rounded-lg border">
                    <CommandInput placeholder="Rechercher des personnes..." />
                    <CommandList>
                      <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>
                      <CommandGroup>
                        {filteredUsers.map((user) => (
                          <CommandItem
                            key={user.id}
                            className="flex items-center gap-2"
                          >
                            <Checkbox
                              checked={messageRecipients.includes(user.id)}
                              onCheckedChange={() => toggleRecipient(user.id)}
                            />
                            <Avatar className="h-6 w-6">
                              <AvatarFallback>
                                {user.fullName?.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p>{user.fullName}</p>
                              <p className="text-xs text-muted-foreground">
                                {getRoleName(user.role)}
                              </p>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </div>

                <div className="space-y-2">
                  <Label>Message</Label>
                  <Textarea
                    placeholder="Écrivez votre message..."
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    rows={4}
                  />
                </div>

                <Button
                  onClick={handleSendMessage}
                  disabled={
                    messageRecipients.length === 0 || !messageContent.trim()
                  }
                  className="w-full gap-2"
                >
                  <Send className="h-4 w-4" />
                  Envoyer
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Notification Detail Panel */}
        {showNotificationDetail && selectedNotification && (
          <div className="fixed inset-0 bg-black/70 bg-opacity-50 z-40 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
              <button
                onClick={closeNotificationDetail}
                className="absolute top-4 right-4"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "p-2 rounded-full",
                      selectedNotification.type ===
                        NotificationType.ACTION_REQUIRED
                        ? "bg-red-100 text-red-600"
                        : "bg-primary/10 text-primary"
                    )}
                  >
                    {notificationTypeIcons[selectedNotification.type]}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">
                      {selectedNotification.type}
                    </h3>
                    {selectedNotification.type ===
                      NotificationType.ACTION_REQUIRED && (
                      <Badge variant="destructive" className="mt-1">
                        Urgent
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedNotification.sentDate).toLocaleString()}
                  </p>
                  <p className="text-base">{selectedNotification.message}</p>
                </div>
                <div className="pt-4 flex gap-2">
                  <Button
                    variant="outline"
                    onClick={closeNotificationDetail}
                    className="flex-1"
                  >
                    Fermer
                  </Button>
                  <Button
                    onClick={() => {
                      setShowMessagePanel(true);
                      closeNotificationDetail();
                    }}
                    className="flex-1 gap-2"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Répondre
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* New Message Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowMessagePanel(true)}
          className="hidden md:flex"
        >
          <MessageSquare className="h-5 w-5" />
        </Button>

        {/* Notifications Dropdown with integrated filter */}
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
          <DropdownMenuContent
            align="end"
            className="w-96 max-h-[80vh] overflow-y-auto"
          >
            <DropdownMenuLabel className="flex justify-between items-center">
              <span>Notifications</span>
              <Badge variant="outline">{unreadNotifications} non lues</Badge>
            </DropdownMenuLabel>

            {/* Notification Type Filter inside dropdown */}
            <div className="px-2 py-1 border-b">
              <Select
                value={notificationFilter}
                onValueChange={(value) =>
                  setNotificationFilter(value as NotificationType)
                }
              >
                <SelectTrigger className="h-8">
                  <SelectValue placeholder="Filtrer par type" />
                </SelectTrigger>
                <SelectContent>
                  {notificationTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <span
                          className={`${option.color} rounded-full overflow-hidden`}
                        >
                          {option.icon}
                        </span>
                        {option.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {filteredNotifications.length > 0 ? (
              filteredNotifications.slice(0, 8).map((notification) => {
                const typeConfig = notificationTypeOptions.find(
                  (opt) => opt.value === notification.type
                ) || {
                  color: "bg-gray-100 text-gray-800",
                  icon: <Info className="h-4 w-4" />,
                };

                return (
                  <DropdownMenuItem
                    key={notification.id}
                    className={cn(
                      "cursor-pointer flex-col items-start",
                      notification.seen && "opacity-70"
                    )}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-center gap-2 w-full">
                      <div className={`p-1 rounded-full ${typeConfig.color}`}>
                        {typeConfig.icon}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{notification.type}</p>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {notification.message}
                        </p>
                      </div>
                      {!notification.seen && (
                        <span className="h-2 w-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 ml-8">
                      {new Date(notification.sentDate).toLocaleString()}
                    </p>
                  </DropdownMenuItem>
                );
              })
            ) : (
              <DropdownMenuItem disabled className="justify-center">
                Aucune notification de ce type
              </DropdownMenuItem>
            )}

            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center font-medium">
              Voir toutes les notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Profile Dropdown */}
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
                <p className="text-sm font-medium">{name}</p>
                <p className="text-xs text-muted-foreground">
                  {user?.role ? getRoleName(user.role) : ""}
                </p>
              </div>
              <ChevronDown className="h-4 w-4 opacity-50 hidden md:block" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profil</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setShowMessagePanel(true)}>
              <MessageSquare className="mr-2 h-4 w-4" />
              <span>Nouveau message</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600">
              Déconnexion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

// import { useState } from "react";
// import { useAppSelector, useAppDispatch } from "@/lib/store";
// import { Bell, User, Search, Menu, X } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { logout } from "@/features/auth/authSlice";
// import { Notification, notificationTypeIcons, UserRole } from "@/lib/types";
// import {
//   useGetAllNotificationsByUser,
//   useReadNotification,
// } from "@/hooks/useNotificationApi";

// interface HeaderProps {
//   onMenuClick: () => void;
// }

// export default function Header({ onMenuClick }: HeaderProps) {
//   const dispatch = useAppDispatch();
//   const { user } = useAppSelector((state) => state.auth);
//   const [selectedNotification, setSelectedNotification] =
//     useState<Notification | null>(null);
//   const [showNotificationDetail, setShowNotificationDetail] = useState(false);

//   const { data: notifications } = useGetAllNotificationsByUser(user?.id!);
//   const { mutate: readNotification } = useReadNotification();

//   const name =
//     // @ts-expect-error
//     user?.fullName?.charAt(0).toUpperCase() + user?.fullName?.slice(1) || "";
//   const iconName = user?.fullName
//     ?.split(" ")
//     .map((n) => n.charAt(0))
//     .join("");

//   const [searchQuery, setSearchQuery] = useState("");

//   const unreadNotifications = notifications?.filter((n) => !n.seen)?.length;

//   const handleLogout = () => {
//     dispatch(logout());
//   };

//   const getRoleName = (role: UserRole[]) => {
//     if (role.includes(UserRole.DEPARTMENT_HEAD)) return "Chef de département";
//     if (role.includes(UserRole.RESOURCE_MANAGER))
//       return "Responsable des ressources";
//     if (role.includes(UserRole.TECHNICIAN)) return "Service de maintenance";
//     if (role.includes(UserRole.SUPPLIER)) return "Fournisseur";

//     return role;
//   };

//   const handleNotificationClick = (notification: any) => {
//     setSelectedNotification(notification);
//     setShowNotificationDetail(true);
//   };

//   const closeNotificationDetail = () => {
//     setShowNotificationDetail(false);
//   };

//   return (
//     <header className="bg-white border-b border-border flex items-center justify-between px-4 py-2 h-16 relative">
//       <div className="flex items-center w-full md:w-auto gap-4">
//         <Button
//           variant="ghost"
//           size="icon"
//           onClick={onMenuClick}
//           className="md:hidden"
//         >
//           <Menu className="h-5 w-5" />
//         </Button>
//         <div className="relative md:w-96">
//           <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//           <Input
//             placeholder="Rechercher..."
//             className="pl-8"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//         </div>
//       </div>

//       <div className="flex items-center gap-4">
//         {/* Notification Detail Panel */}
//         {showNotificationDetail && selectedNotification && (
//           <div className="fixed inset-0 bg-black/70 bg-opacity-50 z-40 flex items-center justify-center">
//             <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
//               <button
//                 onClick={closeNotificationDetail}
//                 className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
//               >
//                 <X className="h-5 w-5" />
//               </button>
//               <div className="space-y-4">
//                 <div className="flex items-center gap-3">
//                   <div className="p-2 rounded-full bg-primary/10">
//                     {notificationTypeIcons[selectedNotification.type]}
//                   </div>
//                   <h3 className="text-lg font-semibold">
//                     {selectedNotification.type}
//                   </h3>
//                 </div>
//                 <div className="space-y-2">
//                   <p className="text-sm text-muted-foreground">
//                     {new Date(
//                       selectedNotification.sentDate
//                     ).toLocaleDateString()}
//                   </p>
//                   <p className="text-base">{selectedNotification.message}</p>
//                 </div>
//                 <div className="pt-4">
//                   <Button onClick={closeNotificationDetail} className="w-full">
//                     Fermer
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant="ghost" size="icon" className="relative">
//               <Bell className="h-5 w-5" />
//               {unreadNotifications! > 0 && (
//                 <span className="absolute top-1 right-1 bg-destructive text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
//                   {unreadNotifications}
//                 </span>
//               )}
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end" className="w-80">
//             <DropdownMenuLabel>Notifications</DropdownMenuLabel>
//             <DropdownMenuSeparator />
//             {notifications?.length! > 0 ? (
//               notifications?.slice(0, 5).map((notification) => (
//                 <DropdownMenuItem
//                   key={notification.id}
//                   className="cursor-pointer"
//                   onClick={() => {
//                     handleNotificationClick(notification);
//                     readNotification(notification.id);
//                   }}
//                 >
//                   <div
//                     className={`${
//                       notification.seen ? "opacity-50" : "font-medium"
//                     }`}
//                   >
//                     <p className="flex items-center gap-1">
//                       {notificationTypeIcons[notification.type]}
//                       {notification.type}
//                     </p>
//                     <p className="text-sm text-muted-foreground truncate ml-10">
//                       {notification.message.split("").length > 40
//                         ? notification.message.split("").slice(0, 40).join("") +
//                           "..."
//                         : notification.message}
//                     </p>
//                     <p className="text-xs text-muted-foreground">
//                       {new Date(notification.sentDate).toLocaleDateString()}
//                     </p>
//                   </div>
//                 </DropdownMenuItem>
//               ))
//             ) : (
//               <DropdownMenuItem disabled>Aucune notification</DropdownMenuItem>
//             )}
//             <DropdownMenuSeparator />
//             <DropdownMenuItem className="justify-center font-medium">
//               Voir toutes les notifications
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>

//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button
//               variant="ghost"
//               className="relative flex items-center gap-2"
//             >
//               <Avatar className="h-8 w-8">
//                 <AvatarFallback>{iconName}</AvatarFallback>
//               </Avatar>
//               <div className="hidden md:block text-left">
//                 <p className="text-sm font-medium">{name || ""}</p>
//                 <p className="text-xs text-muted-foreground">
//                   {user?.role ? getRoleName(user.role) : ""}
//                 </p>
//               </div>
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end">
//             <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
//             <DropdownMenuSeparator />
//             <DropdownMenuItem>
//               <User className="mr-2 h-4 w-4" />
//               <span>Profil</span>
//             </DropdownMenuItem>
//             <DropdownMenuItem onClick={handleLogout}>
//               Déconnexion
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       </div>
//     </header>
//   );
// }
