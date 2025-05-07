import { useState, useEffect } from "react";
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
import { ResourceType, ResourceStatus, Resource, UserRole } from "@/lib/types";
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
import { CheckRole } from "@/lib/CheckRole";
import { useAppSelector } from "@/lib/store";

interface UpdateResourceModalProps {
  open: boolean;
  onClose: () => void;
  resource: Resource;
  onSubmit: (updatedData: any) => void;
}

export function UpdateResourceModal({
  open,
  onClose,
  resource,
  onSubmit,
}: UpdateResourceModalProps) {
  const { toast } = useToast();
  const { user } = useAppSelector((state) => state.auth);
  const { data: departments = [] } = useGetAllDepartments();
  const { data: suppliers = [] } = useGetAllSuppliers();
  const { data: teachers = [] } = useGetAllTeachers();

  // Parse specifications from the resource
  const initialSpecs =
    typeof resource.specifications === "string"
      ? JSON.parse(resource.specifications)
      : resource.specifications;

  // Form state
  const [inventoryNumber, setInventoryNumber] = useState(
    resource.inventoryNumber
  );
  const [type, setType] = useState<ResourceType>(resource.type);
  const [brand, setBrand] = useState(resource.brand || "");
  const [status, setStatus] = useState<ResourceStatus>(resource.status);
  const [acquisitionDate, setAcquisitionDate] = useState<Date | undefined>(
    resource.acquisitionDate ? new Date(resource.acquisitionDate) : undefined
  );
  const [warrantyEndDate, setWarrantyEndDate] = useState<Date | undefined>(
    resource.warrantyEndDate ? new Date(resource.warrantyEndDate) : undefined
  );
  const [departmentId, setDepartmentId] = useState(
    resource.department?.id || ""
  );
  const [userId, setUserId] = useState(resource.user?.id || "");
  const [supplierId, setSupplierId] = useState(resource.supplier?.id || "");

  // Computer specific fields
  const [cpu, setCpu] = useState(initialSpecs.cpu || "");
  const [ram, setRam] = useState(initialSpecs.ram || "");
  const [storage, setStorage] = useState(initialSpecs.storage || "");
  const [monitor, setMonitor] = useState(initialSpecs.monitor || "");

  // Printer specific fields
  const [printSpeed, setPrintSpeed] = useState(initialSpecs.printSpeed || "");
  const [resolution, setResolution] = useState(initialSpecs.resolution || "");

  const [isFirst, setIsFirst] = useState(true);

  // Reset form when resource changes
  useEffect(() => {
    if (resource) {
      setInventoryNumber(resource.inventoryNumber);
      setType(resource.type);
      setStatus(resource.status);
      setAcquisitionDate(
        resource.acquisitionDate
          ? new Date(resource.acquisitionDate)
          : undefined
      );
      setWarrantyEndDate(
        resource.warrantyEndDate
          ? new Date(resource.warrantyEndDate)
          : undefined
      );
      setDepartmentId(resource.department?.id || "");
      setUserId(resource.user?.id || "");
      setSupplierId(resource.supplier?.id || "");

      const specs =
        typeof resource.specifications === "string"
          ? JSON.parse(resource.specifications)
          : resource.specifications;

      setBrand(resource.brand || "");
      if (resource.type === ResourceType.COMPUTER) {
        setCpu(specs.cpu || "");
        setRam(specs.ram || "");
        setStorage(specs.storage || "");
        setMonitor(specs.monitor || "");
      } else {
        setPrintSpeed(specs.printSpeed || "");
        setResolution(specs.resolution || "");
      }
    }
  }, [resource]);

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
            speed: printSpeed,
            resolution,
          });

    const updatedData = {
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

    onSubmit(updatedData);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] animate-in fade-in zoom-in-95 grid grid-rows-[auto_1fr_auto] max-h-[80vh]">
        <DialogHeader className="row-start-1">
          <DialogTitle>Modifier la ressource</DialogTitle>
          <DialogDescription>
            Mettez à jour les informations de cette ressource.
          </DialogDescription>
        </DialogHeader>

        <div className="row-start-2 overflow-y-auto py-4 px-6">
          <div className="grid gap-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="inventoryNumber" className="text-right">
                Numéro d'inventaire*
              </label>
              <Input
                disabled={!CheckRole(user?.role!, [UserRole.RESOURCE_MANAGER])}
                id="inventoryNumber"
                value={inventoryNumber}
                onChange={(e) => setInventoryNumber(e.target.value)}
                placeholder="Entrez le numéro d'inventaire"
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="type" className="text-right">
                Type*
              </label>
              <Select
                disabled={!CheckRole(user?.role!, [UserRole.RESOURCE_MANAGER])}
                value={type}
                onValueChange={(value) => setType(value as ResourceType)}
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
                disabled={!CheckRole(user?.role!, [UserRole.RESOURCE_MANAGER])}
                id="brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Entrez la marque"
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="status" className="text-right">
                Statut*
              </label>
              <Select
                value={status}
                onValueChange={(value) => setStatus(value as ResourceStatus)}
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

            {CheckRole(user?.role!, [UserRole.RESOURCE_MANAGER]) && (
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="acquisitionDate" className="text-right">
                  Date d'acquisition
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
            )}

            {CheckRole(user?.role!, [UserRole.RESOURCE_MANAGER]) && (
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
            )}

            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="department" className="text-right">
                Département
              </label>
              <Select
                value={departmentId}
                onValueChange={(v) => {
                  setDepartmentId(v);
                  setUserId("");
                  setIsFirst(false);
                }}
                disabled={userId != "" && !isFirst}
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
                onValueChange={(v) => {
                  setUserId(v);
                  setDepartmentId("");
                  setIsFirst(false);
                }}
                disabled={departmentId != "" && !isFirst}
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

            {CheckRole(user?.role!, [UserRole.RESOURCE_MANAGER]) && (
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="supplier" className="text-right">
                  Fournisseur
                </label>
                <Select value={supplierId} onValueChange={setSupplierId}>
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
            )}

            {/* Computer specific fields */}
            {CheckRole(user?.role!, [UserRole.RESOURCE_MANAGER]) &&
              type === ResourceType.COMPUTER && (
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
                    />
                  </div>
                </>
              )}

            {/* Printer specific fields */}
            {CheckRole(user?.role!, [UserRole.RESOURCE_MANAGER]) &&
              type === ResourceType.PRINTER && (
                <>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="speed" className="text-right">
                      Vitesse d'impression*
                    </label>
                    <Input
                      id="speed"
                      value={printSpeed}
                      onChange={(e) => setPrintSpeed(e.target.value)}
                      placeholder="Ex: 30 ppm"
                      className="col-span-3"
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
                    />
                  </div>
                </>
              )}
          </div>
        </div>

        <DialogFooter className="row-start-3">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleSubmit}>Mettre à jour</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
