import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { CallForTender, RequestedProduct } from "@/lib/types";
import { useAppSelector } from "@/lib/store";
import { Label } from "@/components/ui/label";

interface NewTenderModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<CallForTender, "id">) => void;
  availableProducts: RequestedProduct[];
}

export function NewTenderModal({
  open,
  onClose,
  onSubmit,
  availableProducts = [],
}: NewTenderModalProps) {
  const { toast } = useToast();
  const { user } = useAppSelector((state) => state.auth);
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  // const { data: validatedProducts } = useGetAllProductsByRequestStatus(
  //   RequestStatus.VALIDATED
  // );

  const handleSubmit = () => {
    if (!title || !startDate || !endDate || selectedProducts.length === 0) {
      toast({
        title: "Champs manquants",
        description: "Veuillez remplir toutes les informations.",
        variant: "destructive",
      });
      return;
    }

    const selectedProductObjects = availableProducts
      .filter((product) => selectedProducts.includes(product.id))
      .map((product) => {
        let specifications = "";

        // Parse existing specifications if they exist
        try {
          const existingSpecs = product.specifications
            ? JSON.parse(product.specifications)
            : {};

          // Create specifications based on product type
          if (product.type === "COMPUTER") {
            specifications = JSON.stringify({
              cpu: existingSpecs.cpu || "",
              ram: existingSpecs.ram || "",
              storage: existingSpecs.storage || "",
              monitor: existingSpecs.monitor || "",
            });
          } else if (product.type === "PRINTER") {
            specifications = JSON.stringify({
              printSpeed: existingSpecs.printSpeed || "",
              resolution: existingSpecs.resolution || "",
            });
          }
        } catch (e) {
          // If parsing fails, create empty specs based on type
          if (product.type === "COMPUTER") {
            specifications = JSON.stringify({
              cpu: "",
              ram: "",
              storage: "",
              monitor: "",
            });
          } else if (product.type === "PRINTER") {
            specifications = JSON.stringify({
              printSpeed: "",
              resolution: "",
            });
          }
        }

        return {
          ...product,
          specifications,
        };
      });

    const newTender: Omit<CallForTender, "id"> = {
      title,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      // @ts-expect-error
      resourceManager: {
        id: user?.id!,
      },
      requestedProducts: selectedProductObjects,
    };

    // console.log(newTender);

    onSubmit(newTender);
    setTitle("");
    setStartDate("");
    setEndDate("");
    setSelectedProducts([]);
  };

  const toggleProduct = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Créer un nouvel Appel d'Offre</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 flex flex-col">
          <Label htmlFor="title">Titre de l'appel d'offre</Label>
          <Input
            id="title"
            placeholder="Titre de l'appel d'offre"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-4">
            <Label htmlFor="start-date">Date de début</Label>
            <Label htmlFor="end-date">Date de fin</Label>

            <Input
              id="start-date"
              type="date"
              placeholder="Date de début"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <Input
              id="end-date"
              type="date"
              placeholder="Date de fin"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Produits à inclure:</h4>
            <div className="border rounded-md p-4 max-h-60 overflow-y-auto">
              {availableProducts.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Aucun produit disponible
                </p>
              ) : (
                availableProducts.map((product) => (
                  <div
                    key={product.id}
                    className={`p-3 mb-2 rounded-md cursor-pointer ${
                      selectedProducts.includes(product.id)
                        ? "bg-blue-50 border-blue-200"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => toggleProduct(product.id)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">
                          {product.quantity}x {product.type} ({product.brand})
                        </p>
                        {product.specifications && (
                          <p className="text-sm text-muted-foreground">
                            {product.specifications}
                          </p>
                        )}
                      </div>
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={() => toggleProduct(product.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="h-4 w-4"
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleSubmit}>Créer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
