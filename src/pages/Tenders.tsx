"use client";

import { useState } from "react";
import { Header } from "@/features/tenders/tendersHeader";
import { NewTenderModal } from "@/features/tenders/NewTenderModal";
import { CallForTender } from "@/lib/types";
import { useCreateTender, useGetAllTenders, useGetRequestedProductsForCallForTender } from "@/hooks/useCallForTenderApi";
import { useToast } from "@/hooks/use-toast";
import { TenderSkeleton } from "@/features/tenders/TenderSkeleton";
import { TenderList } from "@/features/tenders/TenderList";
import { UpdateTenderModal } from "@/features/tenders/UpdateTenderModal";

export default function Tenders() {
  const { toast } = useToast();
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const { data: tenders = [], isLoading } = useGetAllTenders();
  const [selectedTender, setSelectedTender] = useState<CallForTender | null>(
    null
  );
  const { data: validatedProducts = [] } = useGetRequestedProductsForCallForTender();
  const { mutate: createTender } = useCreateTender();

  const handleCreateTender = async (data: Omit<CallForTender, "id">) => {
    try {
      console.log(data);
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

  const handleUpdateSubmit = (updatedData: Partial<CallForTender>) => {
    // Call your API update function here
    console.log("Updating tender:", updatedData);
    setSelectedTender(null);
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 max-w-5xl">
      <Header onNewTender={() => setIsNewModalOpen(true)} />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <TenderSkeleton key={i} />
          ))}
        </div>
      ) : (
        <TenderList tenders={tenders || []} onEditTender={setSelectedTender} />
      )}

      <NewTenderModal
        availableProducts={validatedProducts}
        open={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onSubmit={handleCreateTender}
      />

      <UpdateTenderModal
        tender={selectedTender}
        onClose={() => setSelectedTender(null)}
        onSubmit={handleUpdateSubmit}
      />
    </div>
  );
}
