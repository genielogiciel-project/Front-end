"use client";

import { CallForTender } from "@/lib/types";
import { TenderCard } from "./TenderCard";

interface TenderListProps {
  tenders: CallForTender[];
  onEditTender?: (tender: CallForTender) => void;
  onDeleteTender?: (id: string) => void;
}

export function TenderList({
  tenders,
  onEditTender,
  onDeleteTender,
}: TenderListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {tenders.map((tender, index) => (
        <TenderCard key={tender.id ?? `tender-${index}`} tender={tender} />
      ))}
    </div>
  );
}
