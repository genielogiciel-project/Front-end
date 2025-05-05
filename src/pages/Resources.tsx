import { useState } from "react";
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
import { ResourceType, ResourceStatus, UserRole } from "@/lib/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Filter,
  Plus,
  Monitor,
  Printer,
  Trash2,
  Edit,
  MoreVertical,
} from "lucide-react";
import { NewResourceModal } from "../features/resources/newResourceModal";
import { UpdateResourceModal } from "../features/resources/updateResourceModal";
import {
  useGetAllResources,
  useDeleteResource,
  useUpdateResource,
} from "@/hooks/useResourceApi";
import { useToast } from "@/hooks/use-toast";
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
import { CheckRole } from "@/lib/CheckRole";
import { TenderSkeleton } from "@/features/tenders/TenderSkeleton";
import { useAppSelector } from "@/lib/store";
import Masonry from "react-masonry-css";

export default function Resources() {
  const { toast } = useToast();
  const { user } = useAppSelector((state) => state.auth);
  const { data: resources, isLoading } = useGetAllResources();
  const { mutate: deleteResource } = useDeleteResource();
  const { mutate: updateResource } = useUpdateResource();

  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<ResourceType | "ALL">("ALL");
  const [statusFilter, setStatusFilter] = useState<ResourceStatus | "ALL">(
    "ALL"
  );
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<any>(null);

  const filteredResources = resources?.filter((resource) => {
    const matchesSearch = resource.inventoryNumber
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "ALL" || resource.type === typeFilter;
    const matchesStatus =
      statusFilter === "ALL" || resource.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleUpdate = (updatedData: any) => {
    updateResource(
      { id: selectedResource.id, updatedData },
      {
        onSuccess: () => {
          toast({
            title: "Succès",
            description: "Ressource mise à jour avec succès",
          });
          // refetch();
          setIsUpdateModalOpen(false);
        },
        onError: () => {
          toast({
            title: "Erreur",
            description: "Échec de la mise à jour de la ressource",
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleDelete = () => {
    deleteResource(selectedResource.id, {
      onSuccess: () => {
        toast({
          title: "Succès",
          description: "Ressource supprimée avec succès",
        });
        // refetch();
        setIsDeleteDialogOpen(false);
      },
      onError: () => {
        toast({
          title: "Erreur",
          description: "Échec de la suppression de la ressource",
          variant: "destructive",
        });
      },
    });
  };

  // if (isLoading) {
  //   return (
  //     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  //       {[...Array(9)].map((_, i) => (
  //         <TenderSkeleton key={i} />
  //       ))}
  //     </div>
  //   );
  // }

  return (
    <div className="space-y-6">
      {/* Create Modal */}
      {CheckRole(user?.role!, [UserRole.RESOURCE_MANAGER]) && (
        <NewResourceModal
          open={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          // onSuccess={refetch}
        />
      )}

      {/* Update Modal */}
      {selectedResource && (
        <UpdateResourceModal
          open={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          resource={selectedResource}
          onSubmit={handleUpdate}
        />
      )}

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
              définitivement la ressource.
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

      {/* Header and Filters */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Ressources</h1>
        {CheckRole(user?.role!, [UserRole.RESOURCE_MANAGER]) && (
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter une ressource
          </Button>
        )}
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par numéro d'inventaire..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select
          value={typeFilter}
          onValueChange={(value) =>
            setTypeFilter(value as ResourceType | "ALL")
          }
        >
          <SelectTrigger className="w-[200px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Type de ressource" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tous les types</SelectItem>
            {Object.values(ResourceType).map((type) => (
              <SelectItem key={type} value={type}>
                {type === ResourceType.COMPUTER ? "Ordinateur" : "Imprimante"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={statusFilter}
          onValueChange={(value) =>
            setStatusFilter(value as ResourceStatus | "ALL")
          }
        >
          <SelectTrigger className="w-[200px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tous les statuts</SelectItem>
            <SelectItem value={ResourceStatus.AVAILABLE}>Disponible</SelectItem>
            <SelectItem value={ResourceStatus.ASSIGNED}>Affecté</SelectItem>
            <SelectItem value={ResourceStatus.MAINTENANCE}>
              En maintenance
            </SelectItem>
            <SelectItem value={ResourceStatus.DISPOSED}>Réformé</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-min">
        {isLoading
          ? [...Array(9)].map((_, i) => <TenderSkeleton key={i} />)
          : filteredResources?.map((resource) => {
              const specs =
                typeof resource.specifications === "string"
                  ? JSON.parse(resource.specifications)
                  : resource.specifications;

              return (
                <Masonry
                  breakpointCols={1}
                  className="my-masonry-grid"
                  columnClassName="my-masonry-grid_column"
                  key={resource.id}
                >
                  <Card className="hover:shadow-lg transition-shadow relative ">
                    {/* Action Buttons */}
                    {CheckRole(user?.role!, [
                      UserRole.RESOURCE_MANAGER,
                      UserRole.DEPARTMENT_HEAD,
                    ]) && (
                      <div className="absolute top-2 right-2 flex gap-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">Menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedResource(resource);
                                setIsUpdateModalOpen(true);
                              }}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Modifier
                            </DropdownMenuItem>
                            {CheckRole(user?.role!, [
                              UserRole.RESOURCE_MANAGER,
                            ]) && (
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedResource(resource);
                                  setIsDeleteDialogOpen(true);
                                }}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Supprimer
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    )}

                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          {resource.type === ResourceType.COMPUTER ? (
                            <Monitor className="h-15 w-15" />
                          ) : (
                            <Printer className="h-15 w-15" />
                          )}
                          <div>
                            <CardTitle className="text-lg">
                              {resource.inventoryNumber}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                              {resource.type === ResourceType.COMPUTER
                                ? "Ordinateur"
                                : "Imprimante"}
                            </p>
                          </div>
                        </div>
                        <div
                          className={`px-3 mr-5 py-1 rounded-full text-sm ${
                            resource.status === ResourceStatus.AVAILABLE
                              ? "bg-green-100 text-green-800"
                              : resource.status === ResourceStatus.MAINTENANCE
                                ? "bg-yellow-100 text-yellow-800"
                                : resource.status === ResourceStatus.DISPOSED
                                  ? "bg-red-100 text-red-800"
                                  : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {resource.status}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div>
                          <h4 className="text-sm font-medium">
                            Spécifications:
                          </h4>
                          <div className="text-sm text-muted-foreground">
                            {resource.type === ResourceType.COMPUTER ? (
                              <>
                                <p>Marque: {resource.brand}</p>
                                <p>CPU: {specs.cpu}</p>
                                <p>RAM: {specs.ram}</p>
                                <p>Stockage: {specs.storage}</p>
                                <p>Écran: {specs.monitor}</p>
                              </>
                            ) : (
                              <>
                                <p>Marque: {resource.brand}</p>
                                <p>Vitesse: {specs.printSpeed}</p>
                                <p>Résolution: {specs.resolution}</p>
                              </>
                            )}
                          </div>
                        </div>
                        {resource.department && (
                          <div>
                            <h4 className="text-sm font-medium">
                              Département:
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {resource.department?.name || "Non affecté"}
                            </p>
                          </div>
                        )}
                        {resource.user && (
                          <div>
                            <h4 className="text-sm font-medium">
                              Utilisateur:
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {resource.user?.fullName || "Non affecté"}
                            </p>
                          </div>
                        )}
                        <div>
                          <h4 className="text-sm font-medium">Dates:</h4>
                          <p className="text-sm text-muted-foreground">
                            Acquisition:{" "}
                            {resource.acquisitionDate
                              ? new Date(
                                  resource.acquisitionDate
                                ).toLocaleDateString()
                              : "Non spécifiée"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Fin de garantie:{" "}
                            {resource.warrantyEndDate
                              ? new Date(
                                  resource.warrantyEndDate
                                ).toLocaleDateString()
                              : "Non spécifiée"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Masonry>
              );
            })}
      </div>
    </div>
  );
}
