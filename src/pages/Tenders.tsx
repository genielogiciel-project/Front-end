"use client";

import { useState } from "react";
import { Header } from "@/features/tenders/tendersHeader";
import { NewTenderModal } from "@/features/tenders/NewTenderModal";
import { CallForTender, Proposal } from "@/lib/types";
import {
  useCreateTender,
  useGetAllTenders,
  useGetRequestedProductsForCallForTender,
  useUpdateTender,
  useDeleteTender,
  useChangeTenderStatus,
} from "@/hooks/useCallForTenderApi";
import { useToast } from "@/hooks/use-toast";
import { TenderSkeleton } from "@/features/tenders/TenderSkeleton";
import { TenderList } from "@/features/tenders/TenderList";
import { UpdateTenderModal } from "@/features/tenders/UpdateTenderModal";
import { useAppSelector } from "@/lib/store";
import { useCreateProposal } from "@/hooks/useProposalApi";

export default function Tenders() {
  const { toast } = useToast();
  const { user } = useAppSelector((state) => state.auth);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const { data: tenders = [], isLoading, refetch } = useGetAllTenders();
  const [selectedTender, setSelectedTender] = useState<CallForTender | null>(
    null
  );
  const { data: validatedProducts = [] } =
    useGetRequestedProductsForCallForTender();
  const { mutate: createTender } = useCreateTender();
  const { mutate: submitProposal } = useCreateProposal();
  const { mutate: updateTender } = useUpdateTender();
  const { mutate: deleteTender } = useDeleteTender();
  const { mutate: changeStatus } = useChangeTenderStatus();

  const handleCreateTender = async (data: Omit<CallForTender, "id">) => {
    try {
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
    if (!selectedTender) return;

    updateTender(
      { id: selectedTender.id, ...updatedData },
      {
        onSuccess: () => {
          toast({
            title: "Succès",
            description: "Appel d'offre mis à jour avec succès.",
          });
          setSelectedTender(null);
          refetch();
        },
        onError: () => {
          toast({
            title: "Erreur",
            description: "La mise à jour de l'appel d'offre a échoué.",
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleDeleteTender = (tenderId: string) => {
    deleteTender(tenderId, {
      onSuccess: () => {
        toast({
          title: "Succès",
          description: "Appel d'offre supprimé avec succès.",
        });
        refetch();
      },
      onError: () => {
        toast({
          title: "Erreur",
          description: "La suppression de l'appel d'offre a échoué.",
          variant: "destructive",
        });
      },
    });
  };

  const handleCloseTender = (tenderId: string) => {
    const tender = tenders.find((t) => t.id === tenderId);
    if (!tender) return;

    changeStatus(tenderId, {
      onSuccess: () => {
        toast({
          title: "Succès",
          description: `Appel d'offre ${!tender.open ? "rouvert" : "clôturé"} avec succès.`,
        });
        refetch();
      },
      onError: () => {
        toast({
          title: "Erreur",
          description: "La modification du statut a échoué.",
          variant: "destructive",
        });
      },
    });
  };

  const handleShowProposals = (tenderId: string) => {
    // Implement your navigation or modal display logic here
    console.log("Show proposals for tender:", tenderId);
    toast({
      title: "Info",
      description: `Affichage des propositions pour l'appel d'offre ${tenderId}`,
    });
  };

  const handleSubmitProposal = (proposal: Omit<Proposal, "id">) => {
    submitProposal(proposal, {
      onSuccess: () => {
        toast({
          title: "Proposition soumise",
          description: "Votre proposition a été enregistrée avec succès",
        });
      },
      onError: () => {
        toast({
          title: "Erreur",
          description: "La soumission de votre proposition a échoué",
          variant: "destructive",
        });
      },
    });
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
        <TenderList
          tenders={tenders || []}
          onEditTender={setSelectedTender}
          onSubmitProposal={handleSubmitProposal}
          onDeleteTender={handleDeleteTender}
          onCloseTender={handleCloseTender}
          onShowProposals={handleShowProposals}
          userRole={user?.role}
        />
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
