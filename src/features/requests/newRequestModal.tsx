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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { RequestStatus, ResourceType } from "@/lib/types";
import { useCreateRequest } from "@/hooks/useRequestApi";
import { useGetAllDepartments } from "@/hooks/useDepartmentApi";
import { useToast } from "@/hooks/use-toast";
import { useAppSelector } from "@/lib/store";

interface NewRequestModalProps {
  open: boolean;
  onClose: () => void;
}

interface Product {
  resourceType: ResourceType;
  brand: string;
  quantity: number;
  // Computer specific fields
  cpu?: string;
  ram?: string;
  monitor?: string;
  storage?: string;
  // Printer specific fields
  printSpeed?: string;
  resolution?: string;
}

export function NewRequestModal({ open, onClose }: NewRequestModalProps) {
  const { user } = useAppSelector((state) => state.auth);
  const { toast } = useToast();
  const { data: departments = [] } = useGetAllDepartments();
  const { mutate: createRequest, isPending } = useCreateRequest();

  const [departmentId, setDepartmentId] = useState("");
  const [justification, setJustification] = useState("");
  const [requestedProducts, setRequestedProducts] = useState<Product[]>([
    {
      resourceType: ResourceType.COMPUTER,
      brand: "",
      quantity: 1,
      cpu: "",
      ram: "",
      monitor: "",
      storage: "",
    },
  ]);

  const handleAddProduct = () => {
    setRequestedProducts([
      ...requestedProducts,
      {
        resourceType: ResourceType.COMPUTER,
        brand: "",
        quantity: 1,
        cpu: "",
        ram: "",
        monitor: "",
        storage: "",
      },
    ]);
  };

  const handleRemoveProduct = (index: number) => {
    const newProducts = [...requestedProducts];
    newProducts.splice(index, 1);
    setRequestedProducts(newProducts);
  };

  const handleProductChange = (
    index: number,
    field: keyof Product,
    value: any
  ) => {
    const newProducts = [...requestedProducts];
    newProducts[index] = { ...newProducts[index], [field]: value };

    // When resource type changes, reset the specific fields
    if (field === "resourceType") {
      if (value === "COMPUTER") {
        newProducts[index] = {
          ...newProducts[index],
          printSpeed: undefined,
          resolution: undefined,
          cpu: "",
          ram: "",
          monitor: "",
          storage: "",
        };
      } else {
        newProducts[index] = {
          ...newProducts[index],
          cpu: undefined,
          ram: undefined,
          monitor: undefined,
          storage: undefined,
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

    // Validate computer fields if computer is selected
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

    // Validate printer fields if printer is selected
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

    // Prepare the request data with stringified specifications
    const requestData = {
      department: {
        id: departmentId,
      },
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
      status: RequestStatus.SUBMITTED,
      createdAt: new Date(),
      teacher: {
        id: user?.id,
      },
    };

    console.log(requestData);

    createRequest(requestData, {
      onSuccess: () => {
        toast({
          title: "Succès",
          description: "La demande a été créée avec succès",
        });
        onClose();
        // Reset form fields
        setDepartmentId("");
        setJustification("");
        setRequestedProducts([
          {
            resourceType: ResourceType.COMPUTER,
            brand: "",
            quantity: 1,
            cpu: "",
            ram: "",
            monitor: "",
            storage: "",
          },
        ]);
      },
      onError: () => {
        toast({
          title: "Erreur",
          description:
            "Une erreur est survenue lors de la création de la demande",
          variant: "destructive",
        });
      },
    });
  };
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] animate-in fade-in zoom-in-95 grid grid-rows-[auto_1fr_auto] max-h-[80vh]">
        <DialogHeader className="row-start-1">
          <DialogTitle>Créer une Nouvelle Demande</DialogTitle>
          <DialogDescription>
            Remplissez les informations ci-dessous pour soumettre une nouvelle
            demande de ressources.
          </DialogDescription>
        </DialogHeader>

        <div className="row-start-2 overflow-y-auto py-4 px-6">
          <div className="grid gap-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="department" className="text-right">
                Département
              </label>
              <Select
                value={departmentId}
                onValueChange={setDepartmentId}
                disabled={isPending}
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

            {/* <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="justification" className="text-right">
                Justification (Optionnel)
              </label>
              <Textarea
                id="justification"
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
                placeholder="Expliquez la raison de la demande"
                className="col-span-3"
                disabled={isPending}
              />
            </div> */}

            <div className="space-y-4">
              <h4 className="text-sm font-medium">Produits Demandés</h4>
              {requestedProducts.map((product, index) => (
                <div key={index} className="grid gap-4 border p-4 rounded-lg">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label
                      htmlFor={`resourceType-${index}`}
                      className="text-right"
                    >
                      Type de Ressource
                    </label>
                    <Select
                      value={product.resourceType}
                      onValueChange={(value) =>
                        handleProductChange(
                          index,
                          "resourceType",
                          value as ResourceType
                        )
                      }
                      disabled={isPending}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Choisir type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="COMPUTER">Ordinateur</SelectItem>
                        <SelectItem value="PRINTER">Imprimante</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor={`brand-${index}`} className="text-right">
                      Marque
                    </label>
                    <Input
                      id={`brand-${index}`}
                      value={product.brand}
                      onChange={(e) =>
                        handleProductChange(index, "brand", e.target.value)
                      }
                      placeholder="Marque du produit"
                      className="col-span-3"
                      disabled={isPending}
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor={`quantity-${index}`} className="text-right">
                      Quantité
                    </label>
                    <Input
                      id={`quantity-${index}`}
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
                      disabled={isPending}
                    />
                  </div>

                  {product.resourceType === "COMPUTER" && (
                    <>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor={`cpu-${index}`} className="text-right">
                          CPU
                        </label>
                        <Input
                          id={`cpu-${index}`}
                          value={product.cpu || ""}
                          onChange={(e) =>
                            handleProductChange(index, "cpu", e.target.value)
                          }
                          placeholder="Ex: Intel Core i7"
                          className="col-span-3"
                          disabled={isPending}
                        />
                      </div>

                      <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor={`ram-${index}`} className="text-right">
                          RAM
                        </label>
                        <Input
                          id={`ram-${index}`}
                          value={product.ram || ""}
                          onChange={(e) =>
                            handleProductChange(index, "ram", e.target.value)
                          }
                          placeholder="Ex: 16GB DDR4"
                          className="col-span-3"
                          disabled={isPending}
                        />
                      </div>

                      <div className="grid grid-cols-4 items-center gap-4">
                        <label
                          htmlFor={`monitor-${index}`}
                          className="text-right"
                        >
                          Moniteur
                        </label>
                        <Input
                          id={`monitor-${index}`}
                          value={product.monitor || ""}
                          onChange={(e) =>
                            handleProductChange(
                              index,
                              "monitor",
                              e.target.value
                            )
                          }
                          placeholder="Ex: 24\' FHD"
                          className="col-span-3"
                          disabled={isPending}
                        />
                      </div>

                      <div className="grid grid-cols-4 items-center gap-4">
                        <label
                          htmlFor={`storage-${index}`}
                          className="text-right"
                        >
                          Stockage
                        </label>
                        <Input
                          id={`storage-${index}`}
                          value={product.storage || ""}
                          onChange={(e) =>
                            handleProductChange(
                              index,
                              "storage",
                              e.target.value
                            )
                          }
                          placeholder="Ex: 512GB SSD"
                          className="col-span-3"
                          disabled={isPending}
                        />
                      </div>
                    </>
                  )}

                  {product.resourceType === "PRINTER" && (
                    <>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label
                          htmlFor={`printSpeed-${index}`}
                          className="text-right"
                        >
                          Vitesse d'impression
                        </label>
                        <Input
                          id={`printSpeed-${index}`}
                          value={product.printSpeed || ""}
                          onChange={(e) =>
                            handleProductChange(
                              index,
                              "printSpeed",
                              e.target.value
                            )
                          }
                          placeholder="Ex: 30 ppm"
                          className="col-span-3"
                          disabled={isPending}
                        />
                      </div>

                      <div className="grid grid-cols-4 items-center gap-4">
                        <label
                          htmlFor={`resolution-${index}`}
                          className="text-right"
                        >
                          Résolution
                        </label>
                        <Input
                          id={`resolution-${index}`}
                          value={product.resolution || ""}
                          onChange={(e) =>
                            handleProductChange(
                              index,
                              "resolution",
                              e.target.value
                            )
                          }
                          placeholder="Ex: 1200x1200 dpi"
                          className="col-span-3"
                          disabled={isPending}
                        />
                      </div>
                    </>
                  )}

                  {requestedProducts.length > 1 && (
                    <div className="flex justify-end">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveProduct(index)}
                        disabled={isPending}
                      >
                        Supprimer
                      </Button>
                    </div>
                  )}
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={handleAddProduct}
                className="w-full"
                disabled={isPending}
              >
                Ajouter un autre produit
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter className="row-start-3">
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? "Création..." : "Créer la Demande"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
