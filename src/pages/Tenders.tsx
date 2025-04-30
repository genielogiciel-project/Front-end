"use client";

import { useState } from "react";
import { Header } from "@/features/tenders/tendersHeader";
import { TenderCard } from "@/features/tenders/TenderCard";
import { NewTenderModal } from "@/features/tenders/NewTenderModal";
import { CallForTender, RequestStatus } from "@/lib/types";
import { useCreateTender, useGetAllTenders } from "@/hooks/useCallForTenderApi";
import { useToast } from "@/hooks/use-toast";
import { useGetAllProductsByRequestStatus as useGetAllProductsByRequestsStatus } from "@/hooks/useRequestApi";

export default function Tenders() {
  const { toast } = useToast();
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const { data: tenders = [], isLoading } = useGetAllTenders();
  const { data: validatedProducts = [] } = useGetAllProductsByRequestsStatus(
    RequestStatus.VALIDATED
  );
  const { mutate: createTender } = useCreateTender();

  const handleCreateTender = async (data: Omit<CallForTender, "id">) => {
    try {
      console.log(data)
      createTender(data);
      setIsNewModalOpen(false);
      toast({
        title: "Succès",
        description: "Appel d'offre créé avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "La création de l'appel d'offre a échoué.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 max-w-5xl">
      <Header onNewTender={() => setIsNewModalOpen(true)} />

      {isLoading ? (
        <div className="text-center py-10 text-muted-foreground">
          Chargement des appels d'offre...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tenders.map((tender) => (
            <TenderCard key={tender.id} tender={tender} />
          ))}
        </div>
      )}

      <NewTenderModal
        availableProducts={validatedProducts}
        open={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onSubmit={handleCreateTender}
      />
    </div>
  );
}
