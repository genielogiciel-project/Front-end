"use client";

import { CallForTender } from "@/lib/types";
import { TenderCard } from "./TenderCard";

interface TenderListProps {
  tenders: CallForTender[];
}

export function TenderList({ tenders }: TenderListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {tenders.map((tender) => (
        <TenderCard key={tender.id} tender={tender} />
      ))}
    </div>
  );
}
