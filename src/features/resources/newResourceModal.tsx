"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ResourceType, ResourceStatus } from "@/lib/types";
import { useCreateResource } from "@/hooks/useResourceApi";
import { useGetAllDepartments } from "@/hooks/useDepartmentApi";
import { useGetAllSuppliers } from "@/hooks/useSupplierApi";
import { useGetAllTeachers } from "@/hooks/useUserApi";
import { useToast } from "@/hooks/use-toast";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface NewResourceModalProps {
  open: boolean;
  onClose: () => void;
}

export function NewResourceModal({ open, onClose }: NewResourceModalProps) {
  const { toast } = useToast();
  const { data: departments = [] } = useGetAllDepartments();
  const { data: suppliers = [] } = useGetAllSuppliers();
  const { data: teachers = [] } = useGetAllTeachers();
  const { mutate: createResource, isPending } = useCreateResource();

  const [inventoryNumber, setInventoryNumber] = useState("");
  const [type, setType] = useState<ResourceType>(ResourceType.COMPUTER);
  const [brand, setBrand] = useState("");
  const [status, setStatus] = useState<ResourceStatus>(
    ResourceStatus.AVAILABLE
  );
  const [acquisitionDate, setAcquisitionDate] = useState<Date | undefined>(
    new Date()
  );
  const [warrantyEndDate, setWarrantyEndDate] = useState<Date | undefined>();
  const [departmentId, setDepartmentId] = useState("");
  const [userId, setUserId] = useState("");
  const [supplierId, setSupplierId] = useState("");

  // Computer specific fields
  const [cpu, setCpu] = useState("");
  const [ram, setRam] = useState("");
  const [storage, setStorage] = useState("");
  const [monitor, setMonitor] = useState("");

  // Printer specific fields
  const [speed, setSpeed] = useState("");
  const [resolution, setResolution] = useState("");

  const handleSubmit = () => {
    if (!inventoryNumber) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer un numéro d'inventaire",
        variant: "destructive",
      });
      return;
    }

    const specifications =
      type === ResourceType.COMPUTER
        ? JSON.stringify({
            cpu,
            ram,
            storage,
            monitor,
          })
        : JSON.stringify({
            speed,
            resolution,
          });

    const resourceData = {
      inventoryNumber,
      type,
      specifications,
      status,
      brand,
      acquisitionDate: acquisitionDate?.toISOString(),
      warrantyEndDate: warrantyEndDate?.toISOString(),
      ...(departmentId && { department: { id: departmentId } }),
      ...(userId && { user: { id: userId } }),
      ...(supplierId && { supplier: { id: supplierId } }),
    };

    console.log(resourceData);

    createResource(resourceData, {
      onSuccess: () => {
        toast({
          title: "Succès",
          description: "La ressource a été créée avec succès",
        });
        onClose();
        resetForm();
      },
      onError: () => {
        toast({
          title: "Erreur",
          description:
            "Une erreur est survenue lors de la création de la ressource",
          variant: "destructive",
        });
      },
    });
  };

  const resetForm = () => {
    setInventoryNumber("");
    setType(ResourceType.COMPUTER);
    setBrand("");
    setStatus(ResourceStatus.AVAILABLE);
    setAcquisitionDate(new Date());
    setWarrantyEndDate(undefined);
    setDepartmentId("");
    setUserId("");
    setSupplierId("");
    setCpu("");
    setRam("");
    setStorage("");
    setMonitor("");
    setSpeed("");
    setResolution("");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] animate-in fade-in zoom-in-95 grid grid-rows-[auto_1fr_auto] max-h-[80vh]">
        <DialogHeader className="row-start-1">
          <DialogTitle>Ajouter une nouvelle ressource</DialogTitle>
          <DialogDescription>
            Remplissez les informations ci-dessous pour ajouter une nouvelle
            ressource.
          </DialogDescription>
        </DialogHeader>

        <div className="row-start-2 overflow-y-auto py-4 px-6">
          <div className="grid gap-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="inventoryNumber" className="text-right">
                Numéro d'inventaire*
              </label>
              <Input
                id="inventoryNumber"
                value={inventoryNumber}
                onChange={(e) => setInventoryNumber(e.target.value)}
                placeholder="Entrez le numéro d'inventaire"
                className="col-span-3"
                disabled={isPending}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="type" className="text-right">
                Type*
              </label>
              <Select
                value={type}
                onValueChange={(value) => setType(value as ResourceType)}
                disabled={isPending}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Sélectionnez un type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ResourceType.COMPUTER}>
                    Ordinateur
                  </SelectItem>
                  <SelectItem value={ResourceType.PRINTER}>
                    Imprimante
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="brand" className="text-right">
                Marque*
              </label>
              <Input
                id="brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Entrez la marque"
                className="col-span-3"
                disabled={isPending}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="status" className="text-right">
                Statut*
              </label>
              <Select
                value={status}
                onValueChange={(value) => setStatus(value as ResourceStatus)}
                disabled={isPending}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Sélectionnez un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ResourceStatus.AVAILABLE}>
                    Disponible
                  </SelectItem>
                  <SelectItem value={ResourceStatus.ASSIGNED}>
                    Affecté
                  </SelectItem>
                  <SelectItem value={ResourceStatus.MAINTENANCE}>
                    En maintenance
                  </SelectItem>
                  <SelectItem value={ResourceStatus.DISPOSED}>
                    Réformé
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="acquisitionDate" className="text-right">
                Date d'acquisition*
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "col-span-3 justify-start text-left font-normal",
                      !acquisitionDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {acquisitionDate ? (
                      format(acquisitionDate, "PPP")
                    ) : (
                      <span>Choisir une date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={acquisitionDate}
                    onSelect={setAcquisitionDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="warrantyEndDate" className="text-right">
                Fin de garantie
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "col-span-3 justify-start text-left font-normal",
                      !warrantyEndDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {warrantyEndDate ? (
                      format(warrantyEndDate, "PPP")
                    ) : (
                      <span>Choisir une date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={warrantyEndDate}
                    onSelect={setWarrantyEndDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="department" className="text-right">
                Département
              </label>
              <Select
                value={departmentId}
                onValueChange={setDepartmentId}
                disabled={isPending || userId != ""}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Sélectionnez un département" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="user" className="text-right">
                Utilisateur
              </label>
              <Select
                value={userId}
                onValueChange={setUserId}
                disabled={isPending || departmentId != ""}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Sélectionnez un utilisateur" />
                </SelectTrigger>
                <SelectContent>
                  {teachers.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.fullName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="supplier" className="text-right">
                Fournisseur
              </label>
              <Select
                value={supplierId}
                onValueChange={setSupplierId}
                disabled={isPending}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Sélectionnez un fournisseur" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((supplier) => (
                    <SelectItem key={supplier.id} value={supplier.id}>
                      {supplier.companyName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Computer specific fields */}
            {type === ResourceType.COMPUTER && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="cpu" className="text-right">
                    CPU*
                  </label>
                  <Input
                    id="cpu"
                    value={cpu}
                    onChange={(e) => setCpu(e.target.value)}
                    placeholder="Ex: Intel Core i7"
                    className="col-span-3"
                    disabled={isPending}
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="ram" className="text-right">
                    RAM*
                  </label>
                  <Input
                    id="ram"
                    value={ram}
                    onChange={(e) => setRam(e.target.value)}
                    placeholder="Ex: 16GB DDR4"
                    className="col-span-3"
                    disabled={isPending}
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="storage" className="text-right">
                    Stockage*
                  </label>
                  <Input
                    id="storage"
                    value={storage}
                    onChange={(e) => setStorage(e.target.value)}
                    placeholder="Ex: 512GB SSD"
                    className="col-span-3"
                    disabled={isPending}
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="screen" className="text-right">
                    Écran*
                  </label>
                  <Input
                    id="screen"
                    value={monitor}
                    onChange={(e) => setMonitor(e.target.value)}
                    placeholder="Ex: 24\' FHD"
                    className="col-span-3"
                    disabled={isPending}
                  />
                </div>
              </>
            )}

            {/* Printer specific fields */}
            {type === ResourceType.PRINTER && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="speed" className="text-right">
                    Vitesse d'impression*
                  </label>
                  <Input
                    id="speed"
                    value={speed}
                    onChange={(e) => setSpeed(e.target.value)}
                    placeholder="Ex: 30 ppm"
                    className="col-span-3"
                    disabled={isPending}
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="resolution" className="text-right">
                    Résolution*
                  </label>
                  <Input
                    id="resolution"
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value)}
                    placeholder="Ex: 1200x1200 dpi"
                    className="col-span-3"
                    disabled={isPending}
                  />
                </div>
              </>
            )}
          </div>
        </div>

        <DialogFooter className="row-start-3">
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? "Création..." : "Créer la ressource"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
