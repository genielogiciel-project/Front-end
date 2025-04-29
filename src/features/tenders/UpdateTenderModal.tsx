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

interface UpdateTenderModalProps {
  tender: any;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export function UpdateTenderModal({
  tender,
  onClose,
  onSubmit,
}: UpdateTenderModalProps) {
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [openStatus, setOpenStatus] = useState(true);

  useEffect(() => {
    if (tender) {
      setTitle(tender.title || "");
      setDescription(tender.description || "");
      setStartDate(tender.startDate ? tender.startDate.slice(0, 10) : "");
      setEndDate(tender.endDate ? tender.endDate.slice(0, 10) : "");
      setOpenStatus(tender.open ?? true);
    }
  }, [tender]);

  const handleSubmit = () => {
    if (!title || !description || !startDate || !endDate) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs.",
        variant: "destructive",
      });
      return;
    }

    const updatedData = {
      title,
      description,
      startDate,
      endDate,
      open: openStatus,
    };

    onSubmit(updatedData);
    toast({
      title: "Succès",
      description: "Appel d'offre mis à jour avec succès !",
    });
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
          <Input
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={openStatus}
              onChange={() => setOpenStatus(!openStatus)}
            />
            <label>Ouvert</label>
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
