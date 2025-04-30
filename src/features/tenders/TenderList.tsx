"use client";

import { CallForTender } from "@/lib/types";
import { TenderCard } from "./TenderCard";

interface TenderListProps {
  tenders: CallForTender[];
  onEditTender?: (tender: CallForTender) => void;
}

export function TenderList({ tenders, onEditTender }: TenderListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {tenders.map((tender) => (
        <TenderCard key={tender.id} tender={tender} onEdit={onEditTender} />
      ))}
    </div>
  );
}
