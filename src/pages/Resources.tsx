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
import { ResourceType } from "@/lib/types";
import { Search, Filter, Plus, Monitor, Printer } from "lucide-react";

export default function Resources() {
  const { resources } = useAppSelector((state) => state.resources);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<ResourceType | "ALL">("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const filteredResources = resources.filter((resource) => {
    const matchesSearch = resource.inventoryNumber
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "ALL" || resource.type === typeFilter;
    const matchesStatus =
      statusFilter === "ALL" || resource.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Ressources</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter une ressource
        </Button>
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
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[200px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tous les statuts</SelectItem>
            <SelectItem value="AVAILABLE">Disponible</SelectItem>
            <SelectItem value="ASSIGNED">Affecté</SelectItem>
            <SelectItem value="MAINTENANCE">En maintenance</SelectItem>
            <SelectItem value="DISPOSED">Réformé</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredResources.map((resource) => (
          <Card key={resource.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  {resource.type === ResourceType.COMPUTER ? (
                    <Monitor className="h-5 w-5" />
                  ) : (
                    <Printer className="h-5 w-5" />
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
                  className={`px-3 py-1 rounded-full text-sm ${
                    resource.status === "AVAILABLE"
                      ? "bg-green-100 text-green-800"
                      : resource.status === "MAINTENANCE"
                        ? "bg-yellow-100 text-yellow-800"
                        : resource.status === "DISPOSED"
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
                  <h4 className="text-sm font-medium">Spécifications:</h4>
                  <div className="text-sm text-muted-foreground">
                    {resource.type === ResourceType.COMPUTER ? (
                      <>
                        <p>Marque: {resource.specifications.brand}</p>
                        <p>CPU: {resource.specifications.cpu}</p>
                        <p>RAM: {resource.specifications.ram}</p>
                        <p>Stockage: {resource.specifications.storage}</p>
                        <p>Écran: {resource.specifications.screen}</p>
                      </>
                    ) : (
                      <>
                        <p>Marque: {resource.specifications.brand}</p>
                        <p>Vitesse: {resource.specifications.speed}</p>
                        <p>Résolution: {resource.specifications.resolution}</p>
                      </>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Département:</h4>
                  <p className="text-sm text-muted-foreground">
                    {resource.departmentId}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Dates:</h4>
                  <p className="text-sm text-muted-foreground">
                    Acquisition:{" "}
                    {new Date(resource.acquisitionDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Fin de garantie:{" "}
                    {new Date(resource.warrantyEndDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
