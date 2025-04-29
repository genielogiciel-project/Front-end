import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface HeaderProps {
  onNewTender: () => void;
}

export function Header({ onNewTender }: HeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold">Appels d'offre</h1>
      <Button onClick={onNewTender}>
        <Plus className="mr-2 h-4 w-4" />
        Nouvel appel d'offre
      </Button>
    </div>
  );
}
