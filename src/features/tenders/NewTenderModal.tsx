"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetResourceRequestsByStatus } from "@/hooks/useResourceApi";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

export function NewTenderModal({ open, onClose, onSubmit }: any) {
  const { data: resourceRequests = [] } =
    useGetResourceRequestsByStatus("SENT");

  const [selectedRequests, setSelectedRequests] = useState<string[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const toggleRequest = (id: string) => {
    if (selectedRequests.includes(id)) {
      setSelectedRequests(selectedRequests.filter((reqId) => reqId !== id));
    } else {
      setSelectedRequests([...selectedRequests, id]);
    }
  };

  const handleSubmit = () => {
    onSubmit({
      requestedProducts: selectedRequests,
      startDate,
      endDate,
      status: "OPEN",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Créer un nouvel Appel d'Offre</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
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

          <h4 className="font-medium mb-2">Sélectionnez les demandes:</h4>
          <div className="max-h-48 overflow-y-auto space-y-2">
            {resourceRequests.map((request: any) => (
              <div key={request.id} className="flex items-center gap-2">
                <Checkbox
                  checked={selectedRequests.includes(request.id)}
                  onCheckedChange={() => toggleRequest(request.id)}
                />
                <span className="text-sm">
                  {request.id} — {request.justification}
                </span>
              </div>
            ))}
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
