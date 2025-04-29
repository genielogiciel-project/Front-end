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
import { useGetAllRequests } from "@/hooks/useRequestApi";

interface NewRequestModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: NewRequestData) => void;
}

interface NewRequestData {
  departmentId: string;
  justification: string;
  resourceType: "COMPUTER" | "PRINTER";
  quantity: number;
}

export function NewRequestModal({
  open,
  onClose,
  onSubmit,
}: NewRequestModalProps) {
  const [departmentId, setDepartmentId] = useState("");
  const [justification, setJustification] = useState("");
  const [resourceType, setResourceType] = useState<"COMPUTER" | "PRINTER">(
    "COMPUTER"
  );
  const [quantity, setQuantity] = useState(1);
  const { data } = useGetAllRequests();

  console.log("All Requests Data:", data); // Log the fetched data

  const handleSubmit = () => {
    const data: NewRequestData = {
      departmentId,
      justification,
      resourceType,
      quantity,
    };
    onSubmit(data);
    onClose();
    // Optionally, reset the form fields
    setDepartmentId("");
    setJustification("");
    setResourceType("COMPUTER");
    setQuantity(1);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] animate-in fade-in zoom-in-95">
        <DialogHeader>
          <DialogTitle>Créer une Nouvelle Demande</DialogTitle>
          <DialogDescription>
            Remplissez les informations ci-dessous pour soumettre une nouvelle
            demande de ressources.
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
              placeholder="Entrez ID département"
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
              placeholder="Expliquez la raison de la demande"
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
          <Button onClick={handleSubmit}>Créer la Demande</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
