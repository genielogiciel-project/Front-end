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
import {
  RequestStatus,
  ResourceRequest,
  ResourceType,
  UserRole,
} from "@/lib/types";
import { useUpdateRequest } from "@/hooks/useRequestApi";
import { useGetAllDepartments } from "@/hooks/useDepartmentApi";
import { useToast } from "@/hooks/use-toast";
import { useAppSelector } from "@/lib/store";
import { CheckRole } from "@/lib/CheckRole";

interface UpdateRequestModalProps {
  open: boolean;
  request: ResourceRequest;
  onClose: () => void;
}

interface Product {
  id?: string;
  type: ResourceType;
  brand: string;
  quantity: number;
  specifications: string;
  status: string;
  // Computer specific fields
  cpu?: string;
  ram?: string;
  monitor?: string;
  storage?: string;
  // Printer specific fields
  printSpeed?: string;
  resolution?: string;
}

export function UpdateRequestModal({
  open,
  request,
  onClose,
}: UpdateRequestModalProps) {
  const { user } = useAppSelector((state) => state.auth);
  const { toast } = useToast();
  const { data: departments = [] } = useGetAllDepartments();
  const { mutate: updateRequest, isPending } = useUpdateRequest();

  // Parse the existing request into our form state
  const [departmentId, setDepartmentId] = useState(request.department.id);
  const [status, setStatus] = useState<RequestStatus>(request.status);
  // const [justification, setJustification] = useState(
  //   request.justification || ""
  // );
  const [requestedProducts, setRequestedProducts] = useState<Product[]>(
    // @ts-expect-error
    request.requestedProducts.map((product) => {
      const specs = product.specifications;

      return {
        id: product.id,
        type: product.type,
        brand: product.brand,
        quantity: product.quantity,
        specifications: product.specifications,
        ...(product.type === ResourceType.COMPUTER
          ? {
              //@ts-expect-error
              cpu: specs.cpu,
              //@ts-expect-error
              ram: specs.ram,
              //@ts-expect-error
              monitor: specs.monitor,
              //@ts-expect-error
              storage: specs.storage,
            }
          : {
              //@ts-expect-error
              printSpeed: specs.printSpeed,
              //@ts-expect-error
              resolution: specs.resolution,
            }),
      };
    })
  );

  const handleAddProduct = () => {
    setRequestedProducts([
      // @ts-expect-error
      ...requestedProducts,
      // @ts-expect-error
      {
        type: ResourceType.COMPUTER,
        brand: "",
        quantity: 1,
        specifications: "",
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

    if (field === "type") {
      if (value === ResourceType.COMPUTER) {
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
          p.type === ResourceType.COMPUTER &&
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
        (p) =>
          p.type === ResourceType.PRINTER && (!p.printSpeed || !p.resolution)
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
      id: request.id,
      department: {
        id: departmentId,
      },
      requestedProducts: requestedProducts.map((product) => {
        if (product.type === ResourceType.COMPUTER) {
          return {
            id: product.id,
            type: product.type,
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
            id: product.id,
            type: product.type,
            brand: product.brand,
            quantity: product.quantity,
            specifications: JSON.stringify({
              printSpeed: product.printSpeed,
              resolution: product.resolution,
            }),
          };
        }
      }),
      // justification: justification || undefined,
      status,
      createdAt: request.createdAt,
      teacher: {
        id: request.teacher.id,
      },
    };

    updateRequest(
      // @ts-expect-error
      { id: request.id, updatedData: requestData },
      {
        onSuccess: () => {
          toast({
            title: "Succès",
            description: "La demande a été mise à jour avec succès",
          });
          onClose();
        },
        onError: () => {
          toast({
            title: "Erreur",
            description:
              "Une erreur est survenue lors de la mise à jour de la demande",
            variant: "destructive",
          });
        },
      }
    );
    // console.log("Updating request:", requestData);
    // console.log("Request:", request);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] animate-in fade-in zoom-in-95 grid grid-rows-[auto_1fr_auto] max-h-[80vh]">
        <DialogHeader className="row-start-1">
          <DialogTitle>Modifier la Demande</DialogTitle>
          <DialogDescription>
            Mettez à jour les informations de votre demande de ressources.
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
                disabled={
                  CheckRole(
                    user?.role!,
                    [UserRole.TEACHER, UserRole.DEPARTMENT_HEAD],
                    true
                  ) || isPending
                }
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

            {CheckRole(user?.role!, [UserRole.DEPARTMENT_HEAD]) && (
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="status" className="text-right">
                  Statut
                </label>
                <Select
                  value={status}
                  onValueChange={(value) => setStatus(value as RequestStatus)}
                  disabled={isPending}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Sélectionnez un statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={RequestStatus.SUBMITTED}>
                      Soumis
                    </SelectItem>
                    <SelectItem value={RequestStatus.VALIDATED}>
                      Validé
                    </SelectItem>
                    <SelectItem value={RequestStatus.REJECTED}>
                      Rejeté
                    </SelectItem>
                    {/* <SelectItem value={RequestStatus.SENT}>Envoyé</SelectItem> */}
                  </SelectContent>
                </Select>
              </div>
            )}

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
                      value={product.type}
                      onValueChange={(value) =>
                        handleProductChange(
                          index,
                          "type",
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

                  {product.type === "COMPUTER" && (
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

                  {product.type === "PRINTER" && (
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
            {isPending ? "Mise à jour..." : "Mettre à jour"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
