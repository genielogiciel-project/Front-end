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
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { useGetResourceRequestsByStatus } from "@/hooks/useRequestApi";
import { useCreateTender } from "@/hooks/useCallForTenderApi";
import { useToast } from "@/hooks/use-toast";
import { useAppSelector } from "@/lib/store";

export function NewTenderModal({ open, onClose }: any) {
  const { toast } = useToast();
  const { user } = useAppSelector((state) => state.auth);
  const { data: resourceRequests = [] } =
    useGetResourceRequestsByStatus("VALIDATED");
  const [selectedRequests, setSelectedRequests] = useState<string[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  const { mutate: createTender, isLoading } = useCreateTender();

  const toggleRequest = (id: string) => {
    setSelectedRequests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleExpand = (id: string) => {
    setExpandedCardId((prev) => (prev === id ? null : id));
  };

  const parseSpecs = (spec: string) => {
    try {
      return JSON.parse(spec);
    } catch {
      return {};
    }
  };

  const handleSubmit = () => {
    if (!startDate || !endDate || selectedRequests.length === 0) {
      toast({
        title: "Champs manquants",
        description: "Veuillez remplir toutes les informations.",
        variant: "destructive",
      });
      return;
    }

    // ✅ Send full objects instead of just IDs
    const selectedProductObjects = resourceRequests
      .filter((req: any) => selectedRequests.includes(req.id))
      .map((req: any) => ({
        id: req.id,
        quantity: req.requestedProducts[0].quantity,
        brand: req.requestedProducts[0].brand,
        specifications: req.requestedProducts[0].specifications,
        type: req.requestedProducts[0].type,
      }));

    const data = {
      requestedProducts: selectedProductObjects,
      startDate,
      endDate,
      open: true,
      resourceManager: {
        id: user?.id,
      },
    };

    console.log("Tender Data:", data);
    createTender(data, {
      onSuccess: () => {
        toast({
          title: "Succès",
          description: "Appel d'offre créé avec succès.",
        });
        onClose();
      },
      onError: () => {
        toast({
          title: "Erreur",
          description: "La création de l'appel d'offre a échoué.",
          variant: "destructive",
        });
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl h-[80vh] max-h-[calc(100vh-4rem)] overflow-y-auto">
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

          <h4 className="font-medium">Demandes validées</h4>
          <div className="max-h-[55vh] overflow-y-auto space-y-3 pr-1">
            {resourceRequests.map((request: any) => {
              const selected = selectedRequests.includes(request.id);
              const expanded = expandedCardId === request.id;
              const product = request.requestedProducts?.[0];
              const specs = parseSpecs(product?.specifications ?? "{}");

              return (
                <Card
                  key={request.id}
                  className={`transition-shadow cursor-pointer ${
                    selected ? "border-blue-600 ring-2 ring-blue-400" : "border"
                  }`}
                  onClick={() => toggleRequest(request.id)}
                >
                  <CardHeader className="flex flex-row justify-between items-start">
                    <div>
                      <CardTitle className="text-sm">
                        {request.department?.name ?? "Département inconnu"} —{" "}
                        {product?.type}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground">
                        Créé le:{" "}
                        {new Date(request.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleExpand(request.id);
                      }}
                    >
                      {expanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </Button>
                  </CardHeader>

                  <AnimatePresence>
                    {expanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <CardContent className="text-xs space-y-1 pb-2">
                          <p>Quantité: {product?.quantity}</p>
                          <p>Marque: {product?.brand}</p>
                          {product?.type === "COMPUTER" && (
                            <ul className="pl-4 list-disc">
                              <li>CPU: {specs.cpu}</li>
                              <li>RAM: {specs.ram}</li>
                              <li>Stockage: {specs.storage}</li>
                              <li>Écran: {specs.monitor}</li>
                            </ul>
                          )}
                          {product?.type === "PRINTER" && (
                            <ul className="pl-4 list-disc">
                              <li>Vitesse impression: {specs.printSpeed}</li>
                              <li>Résolution: {specs.resolution}</li>
                            </ul>
                          )}
                        </CardContent>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              );
            })}
          </div>
        </div>

        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Création..." : "Créer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
