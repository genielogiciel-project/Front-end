import { Button } from "@/components/ui/button";
import { CheckRole } from "@/lib/CheckRole";
import { useAppSelector } from "@/lib/store";
import { UserRole } from "@/lib/types";
import { Plus } from "lucide-react";

interface HeaderProps {
  onNewRequestClick: () => void;
}

export function Header({ onNewRequestClick }: HeaderProps) {
  const { user } = useAppSelector((state) => state.auth);
  return (
    <div className="flex flex-wrap justify-between items-center gap-4">
      <h1 className="text-2xl sm:text-3xl font-bold">Demandes de Ressources</h1>
      {CheckRole(user?.role!, [UserRole.TEACHER, UserRole.DEPARTMENT_HEAD]) && (
        <Button onClick={onNewRequestClick} className="whitespace-nowrap">
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle Demande
        </Button>
      )}
    </div>
  );
}
