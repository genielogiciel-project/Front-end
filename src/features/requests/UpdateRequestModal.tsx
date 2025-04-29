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

interface UpdateRequestModalProps {
  open: boolean;
  request: any;
  onClose: () => void;
  onSubmit: (updatedData: any) => void;
}

export function UpdateRequestModal({
  open,
  request,
  onClose,
  onSubmit,
}: UpdateRequestModalProps) {
  const [departmentId, setDepartmentId] = useState(request.departmentId || "");
  const [justification, setJustification] = useState(
    request.justification || ""
  );
  const [resourceType, setResourceType] = useState<"COMPUTER" | "PRINTER">(
    request.items[0]?.type || "COMPUTER"
  );
  const [quantity, setQuantity] = useState(request.items[0]?.quantity || 1);

  const handleSubmit = () => {
    const updatedData = {
      departmentId,
      justification,
      resourceType,
      quantity,
    };
    onSubmit(updatedData);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] animate-in fade-in zoom-in-95">
        <DialogHeader>
          <DialogTitle>Modifier la Demande</DialogTitle>
          <DialogDescription>
            Vous pouvez mettre à jour les informations de votre demande ici.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="department" className="text-right">
              Département
            </label>
            <Input
              id="department"
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
              className="col-span-3"
            />
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

          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="resourceType" className="text-right">
              Type de Ressource
            </label>
            <Select
              value={resourceType}
              onValueChange={(value) =>
                setResourceType(value as "COMPUTER" | "PRINTER")
              }
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
            <label htmlFor="quantity" className="text-right">
              Quantité
            </label>
            <Input
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              min={1}
              className="col-span-3"
            />
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
