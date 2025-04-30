import { useState } from "react";
import { useAppSelector } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Filter,
  Plus,
  Building2,
  Mail,
  Phone,
  Globe,
  AlertTriangle,
  Trash2,
  Edit,
  MoreVertical,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  useCreateSupplier,
  useUpdateSupplier,
  useDeleteSupplier,
  useGetAllSuppliers,
} from "@/hooks/useSupplierApi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Supplier, UserRole } from "@/lib/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Suppliers() {
  const { toast } = useToast();
  // const { suppliers } = useAppSelector((state) => state.suppliers);
  const { data: suppliers } = useGetAllSuppliers();
  const { mutate: createSupplier } = useCreateSupplier();
  const { mutate: updateSupplier } = useUpdateSupplier();
  const { mutate: deleteSupplier } = useDeleteSupplier();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | "ACTIVE" | "BLACKLISTED"
  >("ALL");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    null
  );

  // Form states
  const [fullName, setFullName] = useState("");
  const [userNumber, setUserNumber] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [managerName, setManagerName] = useState("");
  const [address, setAddress] = useState("");
  const [website, setWebsite] = useState("");
  const [blacklisted, setBlacklisted] = useState(false);
  const [blacklistReason, setBlacklistReason] = useState("");

  const filteredSuppliers = suppliers?.filter((supplier) => {
    const matchesSearch =
      supplier.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.managerName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "ACTIVE" && !supplier.blacklisted) ||
      (statusFilter === "BLACKLISTED" && supplier.blacklisted);
    return matchesSearch && matchesStatus;
  });

  const resetForm = () => {
    setFullName("");
    setUserNumber("");
    setPassword("");
    setCompanyName("");
    setManagerName("");
    setAddress("");
    setWebsite("");
    setBlacklisted(false);
    setBlacklistReason("");
  };

  const handleCreate = () => {
    const supplierData: Omit<Supplier, "id"> = {
      fullName,
      userNumber,
      password,
      role: [UserRole.SUPPLIER],
      companyName,
      managerName,
      address,
      website,
      blacklisted,
      blacklistReason: blacklisted ? blacklistReason : undefined,
    };

    createSupplier(supplierData, {
      onSuccess: () => {
        toast({
          title: "Succès",
          description: "Fournisseur créé avec succès",
        });
        setIsCreateModalOpen(false);
        resetForm();
      },
      onError: () => {
        toast({
          title: "Erreur",
          description: "Échec de la création du fournisseur",
          variant: "destructive",
        });
      },
    });

    resetForm();
  };

  const handleUpdate = () => {
    if (!selectedSupplier) return;

    const updatedData: Partial<Supplier> = {
      fullName,
      // userNumber,
      password,
      role: [UserRole.SUPPLIER],
      companyName,
      managerName,
      address,
      website,
      blacklisted,
      blacklistReason: blacklisted ? blacklistReason : undefined,
    };

    updateSupplier(
      { id: selectedSupplier.id, updatedData },
      {
        onSuccess: () => {
          toast({
            title: "Succès",
            description: "Fournisseur mis à jour avec succès",
          });
          setIsUpdateModalOpen(false);
        },
        onError: () => {
          toast({
            title: "Erreur",
            description: "Échec de la mise à jour du fournisseur",
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleDelete = () => {
    if (!selectedSupplier) return;

    deleteSupplier(selectedSupplier.id, {
      onSuccess: () => {
        toast({
          title: "Succès",
          description: "Fournisseur supprimé avec succès",
        });
        setIsDeleteDialogOpen(false);
      },
      onError: () => {
        toast({
          title: "Erreur",
          description: "Échec de la suppression du fournisseur",
          variant: "destructive",
        });
      },
    });
  };

  const openUpdateModal = (supplier: Supplier) => {
    setFullName(supplier.fullName);
    setUserNumber(supplier.userNumber);
    setSelectedSupplier(supplier);
    setCompanyName(supplier.companyName);
    setManagerName(supplier.managerName);
    setAddress(supplier.address);
    setWebsite(supplier.website || "");
    setBlacklisted(supplier.blacklisted);
    setBlacklistReason(supplier.blacklistReason || "");
    setIsUpdateModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Create Modal */}
      <Dialog
        open={isCreateModalOpen}
        onOpenChange={(open) => {
          setIsCreateModalOpen(open);
          resetForm();
        }}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Ajouter un fournisseur</DialogTitle>
            <DialogDescription>
              Remplissez les informations du nouveau fournisseur
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="fullName" className="text-right">
                Nom complet*
              </label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nom complet"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="userNumber" className="text-right">
                Numéro utilisateur*
              </label>
              <Input
                id="userNumber"
                value={userNumber}
                onChange={(e) => setUserNumber(e.target.value)}
                placeholder="Numéro utilisateur"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="password" className="text-right">
                Mot de passe*
              </label>
              <Input
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mot de passe"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="companyName" className="text-right">
                Nom de l'entreprise*
              </label>
              <Input
                id="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Nom de l'entreprise"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="managerName" className="text-right">
                Responsable*
              </label>
              <Input
                id="managerName"
                value={managerName}
                onChange={(e) => setManagerName(e.target.value)}
                placeholder="Nom du responsable"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="address" className="text-right">
                Adresse*
              </label>
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Adresse complète"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="website" className="text-right">
                Site web
              </label>
              <Input
                id="website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://example.com"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="blacklisted" className="text-right">
                Liste noire
              </label>
              <Select
                value={blacklisted ? "true" : "false"}
                onValueChange={(value) => setBlacklisted(value === "true")}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="false">Actif</SelectItem>
                  <SelectItem value="true">Liste noire</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {blacklisted && (
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="blacklistReason" className="text-right">
                  Raison*
                </label>
                <Textarea
                  id="blacklistReason"
                  value={blacklistReason}
                  onChange={(e) => setBlacklistReason(e.target.value)}
                  placeholder="Raison de la mise en liste noire"
                  className="col-span-3"
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Annuler
            </Button>
            <Button onClick={handleCreate}>Créer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Modal */}
      <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Modifier le fournisseur</DialogTitle>
            <DialogDescription>
              Mettez à jour les informations du fournisseur
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="fullName" className="text-right">
                Nom complet*
              </label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nom complet"
                className="col-span-3"
              />
            </div>
            {/* <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="userNumber" className="text-right">
                Numéro utilisateur*
              </label>
              <Input
                id="userNumber"
                value={userNumber}
                onChange={(e) => setUserNumber(e.target.value)}
                placeholder="Numéro utilisateur"
                className="col-span-3"
              />
            </div> */}
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="companyName" className="text-right">
                Nom de l'entreprise*
              </label>
              <Input
                id="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="managerName" className="text-right">
                Responsable*
              </label>
              <Input
                id="managerName"
                value={managerName}
                onChange={(e) => setManagerName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="address" className="text-right">
                Adresse*
              </label>
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="website" className="text-right">
                Site web
              </label>
              <Input
                id="website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="blacklisted" className="text-right">
                Liste noire
              </label>
              <Select
                value={blacklisted ? "true" : "false"}
                onValueChange={(value) => setBlacklisted(value === "true")}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="false">Actif</SelectItem>
                  <SelectItem value="true">Liste noire</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {blacklisted && (
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="blacklistReason" className="text-right">
                  Raison*
                </label>
                <Textarea
                  id="blacklistReason"
                  value={blacklistReason}
                  onChange={(e) => setBlacklistReason(e.target.value)}
                  className="col-span-3"
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsUpdateModalOpen(false)}
            >
              Annuler
            </Button>
            <Button onClick={handleUpdate}>Mettre à jour</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. Cela supprimera
              définitivement le fournisseur.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Main Content */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Fournisseurs</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un fournisseur
        </Button>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un fournisseur..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(value) =>
            setStatusFilter(value as "ALL" | "ACTIVE" | "BLACKLISTED")
          }
        >
          <SelectTrigger className="w-[200px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filtrer par statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tous les fournisseurs</SelectItem>
            <SelectItem value="ACTIVE">Actifs</SelectItem>
            <SelectItem value="BLACKLISTED">Liste noire</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSuppliers?.map((supplier) => (
          <Card
            key={supplier.id}
            className={supplier.blacklisted ? "border-red-200" : ""}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  <div>
                    <CardTitle className="text-lg">
                      {supplier.companyName}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Responsable: {supplier.managerName}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {supplier.blacklisted && (
                    <div className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                      <AlertTriangle className="h-4 w-4" />
                      Liste noire
                    </div>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => openUpdateModal(supplier)}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedSupplier(supplier);
                          setIsDeleteDialogOpen(true);
                        }}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  {/* <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openUpdateModal(supplier)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSelectedSupplier(supplier);
                      setIsDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button> */}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {supplier.address}
                  </span>
                </div>
                {supplier.website && (
                  <div className="flex items-center gap-2 text-sm">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={supplier.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {supplier.website}
                    </a>
                  </div>
                )}
                {supplier.blacklisted && supplier.blacklistReason && (
                  <div className="mt-4 p-3 bg-red-50 rounded-md">
                    <h4 className="text-sm font-medium text-red-800 mb-1">
                      Motif de blacklist:
                    </h4>
                    <p className="text-sm text-red-600">
                      {supplier.blacklistReason}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
