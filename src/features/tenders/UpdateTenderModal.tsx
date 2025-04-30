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
import { useToast } from "@/hooks/use-toast";
import { CallForTender, RequestedProduct } from "@/lib/types";

interface UpdateTenderModalProps {
  tender: CallForTender | null;
  onClose: () => void;
  onSubmit: (data: Partial<CallForTender>) => void;
}

export function UpdateTenderModal({
  tender,
  onClose,
  onSubmit,
}: UpdateTenderModalProps) {
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [openStatus, setOpenStatus] = useState(true);

  useEffect(() => {
    if (tender) {
      setTitle(tender.title);
      setStartDate(tender.startDate.toISOString().split('T')[0]);
      setEndDate(tender.endDate.toISOString().split('T')[0]);
      setOpenStatus(tender.open);
    }
  }, [tender]);

  const handleSubmit = () => {
    if (!title || !startDate || !endDate) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      });
      return;
    }

    const updatedData: Partial<CallForTender> = {
      title,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      open: openStatus
    };

    onSubmit(updatedData);
  };

  return (
    <Dialog open={!!tender} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Modifier Appel d'Offre</DialogTitle>
          <DialogDescription>
            Modifiez les informations de l'appel d'offre.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <Input
            placeholder="Titre"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              type="date"
              placeholder="Date de début"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <Input
              type="date"
              placeholder="Date de fin"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="openStatus"
              checked={openStatus}
              onChange={(e) => setOpenStatus(e.target.checked)}
              className="h-4 w-4"
            />
            <label htmlFor="openStatus">Appel d'offre ouvert</label>
          </div>

          <div>
            <h4 className="font-medium mb-2">Produits inclus:</h4>
            <div className="space-y-2">
              {tender?.requestedProducts.map(product => (
                <div key={product.id} className="text-sm border rounded p-3">
                  <p className="font-medium">
                    {product.quantity}x {product.type} ({product.brand})
                  </p>
                  {product.specifications && (
                    <p className="text-muted-foreground mt-1">
                      {product.specifications}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleSubmit}>Mettre à jour</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
