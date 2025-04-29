"use client";

import { useState } from "react";
import { Header } from "@/features/tenders/tendersHeader";
import { FilterBar } from "@/features/tenders/FilterBar";
import { TenderList } from "@/features/tenders/TenderList";
import { TenderSkeleton } from "@/features/tenders/TenderSkeleton";
import { NewTenderModal } from "@/features/tenders/NewTenderModal";
import { UpdateTenderModal } from "@/features/tenders/UpdateTenderModal";
import {
  useGetAllTenders,
  useCreateTender,
  useUpdateTender,
  useDeleteTender,
} from "@/hooks/useCallForTenderApi";
import { useToast } from "@/hooks/use-toast";
import { CallForTender } from "@/lib/types"; // ✅ Your type here

export default function Tenders() {
  const { toast } = useToast();

  const { data: tenders = [], isLoading } = useGetAllTenders();
  const { mutate: createTender } = useCreateTender();
  const { mutate: updateTender } = useUpdateTender();
  const { mutate: deleteTender } = useDeleteTender();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"OPEN" | "CLOSED" | "ALL">(
    "ALL"
  );
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [editingTender, setEditingTender] = useState<CallForTender | null>(
    null
  );

  const handleCreateTender = (data: Omit<CallForTender, "id">) => {
    createTender(data, {
      onSuccess: () => {
        toast({
          title: "Succès",
          description: "Appel d'offre créé avec succès.",
        });
        setIsNewModalOpen(false);
      },
      onError: () => {
        toast({
          title: "Erreur",
          description: "Erreur lors de la création de l'appel d'offre.",
          variant: "destructive",
        });
      },
    });
  };

  const handleUpdateTender = (updatedData: Partial<CallForTender>) => {
    if (!editingTender) return;

    updateTender(
      { id: editingTender.id, updatedData },
      {
        onSuccess: () => {
          toast({
            title: "Succès",
            description: "Appel d'offre mis à jour avec succès.",
          });
          setEditingTender(null);
        },
        onError: () => {
          toast({
            title: "Erreur",
            description: "Erreur lors de la mise à jour.",
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleDeleteTender = (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet appel d'offre ?"))
      return;

    deleteTender(id, {
      onSuccess: () => {
        toast({
          title: "Succès",
          description: "Appel d'offre supprimé avec succès.",
        });
      },
      onError: () => {
        toast({
          title: "Erreur",
          description: "Erreur lors de la suppression.",
          variant: "destructive",
        });
      },
    });
  };

  const filteredTenders = tenders.filter((tender) => {
    const matchesSearch =
      (tender.title?.toLowerCase() ?? "").includes(searchQuery.toLowerCase()) ||
      (tender.requestId?.toLowerCase() ?? "").includes(
        searchQuery.toLowerCase()
      );

    const matchesStatus =
      statusFilter === "ALL" || tender.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 max-w-7xl">
      <Header onNewTender={() => setIsNewModalOpen(true)} />
      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={(value) =>
          setStatusFilter(value as "OPEN" | "CLOSED" | "ALL")
        }
      />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, index) => (
            <TenderSkeleton key={index} />
          ))}
        </div>
      ) : filteredTenders.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          Aucun appel d'offre trouvé.
        </div>
      ) : (
        <TenderList
          tenders={filteredTenders}
          onEditTender={(tender) => setEditingTender(tender)}
          onDeleteTender={handleDeleteTender}
        />
      )}

      <NewTenderModal
        open={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onSubmit={handleCreateTender}
      />

      {editingTender && (
        <UpdateTenderModal
          tender={editingTender}
          onClose={() => setEditingTender(null)}
          onSubmit={handleUpdateTender}
        />
      )}
    </div>
  );
}
