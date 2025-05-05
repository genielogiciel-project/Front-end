"use client";

import { CallForTender, Proposal, UserRole } from "@/lib/types";
import { TenderCard } from "./TenderCard";

interface TenderListProps {
  tenders: CallForTender[];
  onEditTender?: (tender: CallForTender) => void;
  onSubmitProposal?: (proposal: Omit<Proposal, "id">) => void;
  onDeleteTender?: (tenderId: string) => void;
  onCloseTender?: (tenderId: string) => void;
  onShowProposals?: (tenderId: string) => void;
  userRole?: UserRole[];
}

export function TenderList({
  tenders,
  onEditTender,
  onSubmitProposal,
  onDeleteTender,
  onCloseTender,
  onShowProposals,
  userRole,
}: TenderListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {tenders.map((tender) => (
        <TenderCard
          key={tender.id}
          tender={tender}
          onEdit={onEditTender}
          onSubmitProposal={onSubmitProposal}
          onDelete={onDeleteTender}
          onCloseTender={onCloseTender}
          onShowProposals={onShowProposals}
          userRole={userRole}
        />
      ))}
    </div>
  );
}
