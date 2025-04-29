import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface HeaderProps {
  onNewRequestClick: () => void;
}

export function Header({ onNewRequestClick }: HeaderProps) {
  return (
    <div className="flex flex-wrap justify-between items-center gap-4">
      <h1 className="text-2xl sm:text-3xl font-bold">Demandes de Ressources</h1>
      <Button onClick={onNewRequestClick} className="whitespace-nowrap">
        <Plus className="mr-2 h-4 w-4" />
        Nouvelle Demande
      </Button>
    </div>
  );
}