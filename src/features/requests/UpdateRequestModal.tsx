"use client";

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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ResourceType, RequestStatus } from "@/lib/types";
import { useGetAllDepartments } from "@/hooks/useDepartmentApi";
import { useToast } from "@/hooks/use-toast";

interface UpdateRequestModalProps {
  open: boolean;
  request: any;
  onClose: () => void;
  onSubmit: (updatedData: any) => void;
}

interface Product {
  resourceType: ResourceType;
  brand: string;
  quantity: number;
  cpu?: string;
  ram?: string;
  monitor?: string;
  storage?: string;
  printSpeed?: string;
  resolution?: string;
}

export function UpdateRequestModal({
  open,
  request,
  onClose,
  onSubmit,
}: UpdateRequestModalProps) {
  const { toast } = useToast();
  const { data: departments = [] } = useGetAllDepartments();

  const [departmentId, setDepartmentId] = useState(request.departmentId || "");
  const [justification, setJustification] = useState(
    request.justification || ""
  );
  const [requestedProducts, setRequestedProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (request) {
      const parsedProducts = request.items.map((item: any) => {
        const specs =
          typeof item.specifications === "string"
            ? JSON.parse(item.specifications)
            : item.specifications;
        if (item.type === "COMPUTER") {
          return {
            resourceType: item.type,
            brand: item.specifications.brand || "",
            quantity: item.quantity,
            cpu: specs.cpu,
            ram: specs.ram,
            monitor: specs.monitor,
            storage: specs.storage,
          };
        } else {
          return {
            resourceType: item.type,
            brand: item.specifications.brand || "",
            quantity: item.quantity,
            printSpeed: specs.printSpeed,
            resolution: specs.resolution,
          };
        }
      });
      setRequestedProducts(parsedProducts);
    }
  }, [request]);

  const handleProductChange = (
    index: number,
    field: keyof Product,
    value: any
  ) => {
    const newProducts = [...requestedProducts];
    newProducts[index] = { ...newProducts[index], [field]: value };

    if (field === "resourceType") {
      if (value === "COMPUTER") {
        newProducts[index] = {
          resourceType: value,
          brand: "",
          quantity: 1,
          cpu: "",
          ram: "",
          monitor: "",
          storage: "",
        };
      } else {
        newProducts[index] = {
          resourceType: value,
          brand: "",
          quantity: 1,
          printSpeed: "",
          resolution: "",
        };
      }
    }

    setRequestedProducts(newProducts);
  };

  const handleSubmit = () => {
    if (!departmentId) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un département",
        variant: "destructive",
      });
      return;
    }

    if (requestedProducts.some((p) => !p.brand || p.quantity < 1)) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs des produits",
        variant: "destructive",
      });
      return;
    }

    if (
      requestedProducts.some(
        (p) =>
          p.resourceType === "COMPUTER" &&
          (!p.cpu || !p.ram || !p.monitor || !p.storage)
      )
    ) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs pour les ordinateurs",
        variant: "destructive",
      });
      return;
    }

    if (
      requestedProducts.some(
        (p) => p.resourceType === "PRINTER" && (!p.printSpeed || !p.resolution)
      )
    ) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs pour les imprimantes",
        variant: "destructive",
      });
      return;
    }

    const updatedData = {
      department: { id: departmentId },
      requestedProducts: requestedProducts.map((product) => {
        if (product.resourceType === "COMPUTER") {
          return {
            type: product.resourceType,
            brand: product.brand,
            quantity: product.quantity,
            specifications: JSON.stringify({
              cpu: product.cpu,
              ram: product.ram,
              monitor: product.monitor,
              storage: product.storage,
            }),
          };
        } else {
          return {
            type: product.resourceType,
            brand: product.brand,
            quantity: product.quantity,
            specifications: JSON.stringify({
              printSpeed: product.printSpeed,
              resolution: product.resolution,
            }),
          };
        }
      }),
      justification,
    };

    onSubmit(updatedData);
    toast({
      title: "Succès",
      description: "Demande mise à jour avec succès",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] animate-in fade-in zoom-in-95 grid grid-rows-[auto_1fr_auto] max-h-[80vh]">
        <DialogHeader className="row-start-1">
          <DialogTitle>Modifier la Demande</DialogTitle>
          <DialogDescription>
            Modifiez les informations de votre demande.
          </DialogDescription>
        </DialogHeader>

        <div className="row-start-2 overflow-y-auto py-4 px-6">
          <div className="grid gap-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="department" className="text-right">
                Département
              </label>
              <Select value={departmentId} onValueChange={setDepartmentId}>
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
              <label htmlFor="justification" className="text-right">
                Justification
              </label>
              <Textarea
                id="justification"
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
                className="col-span-3"
              />
            </div>

            {/* Products Section */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Produits Demandés</h4>
              {requestedProducts.map((product, index) => (
                <div key={index} className="grid gap-4 border p-4 rounded-lg">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label className="text-right">Type</label>
                    <Select
                      value={product.resourceType}
                      onValueChange={(value) =>
                        handleProductChange(index, "resourceType", value)
                      }
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="COMPUTER">Ordinateur</SelectItem>
                        <SelectItem value="PRINTER">Imprimante</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <label className="text-right">Marque</label>
                    <Input
                      value={product.brand}
                      onChange={(e) =>
                        handleProductChange(index, "brand", e.target.value)
                      }
                      className="col-span-3"
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <label className="text-right">Quantité</label>
                    <Input
                      type="number"
                      value={product.quantity}
                      onChange={(e) =>
                        handleProductChange(
                          index,
                          "quantity",
                          Number(e.target.value)
                        )
                      }
                      min={1}
                      className="col-span-3"
                    />
                  </div>

                  {product.resourceType === "COMPUTER" && (
                    <>
                      {["cpu", "ram", "monitor", "storage"].map((field) => (
                        <div
                          key={field}
                          className="grid grid-cols-4 items-center gap-4"
                        >
                          <label className="text-right capitalize">
                            {field}
                          </label>
                          <Input
                            value={(product as any)[field] || ""}
                            onChange={(e) =>
                              handleProductChange(
                                index,
                                field as keyof Product,
                                e.target.value
                              )
                            }
                            className="col-span-3"
                          />
                        </div>
                      ))}
                    </>
                  )}

                  {product.resourceType === "PRINTER" && (
                    <>
                      {["printSpeed", "resolution"].map((field) => (
                        <div
                          key={field}
                          className="grid grid-cols-4 items-center gap-4"
                        >
                          <label className="text-right capitalize">
                            {field}
                          </label>
                          <Input
                            value={(product as any)[field] || ""}
                            onChange={(e) =>
                              handleProductChange(
                                index,
                                field as keyof Product,
                                e.target.value
                              )
                            }
                            className="col-span-3"
                          />
                        </div>
                      ))}
                    </>
                  )}
                </div>
              ))}
            </div>
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
