import { Button } from "@/components/ui/button";
import { CheckRole } from "@/lib/CheckRole";
import { useAppSelector } from "@/lib/store";
import { UserRole } from "@/lib/types";
import { Plus } from "lucide-react";

interface HeaderProps {
  onNewTender: () => void;
}

export function Header({ onNewTender }: HeaderProps) {
  const { user } = useAppSelector((state) => state.auth);
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold">Appels d'offre</h1>
      {CheckRole(user?.role!, [UserRole.RESOURCE_MANAGER]) && (
        <Button onClick={onNewTender}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvel appel d'offre
        </Button>
      )}
    </div>
  );
}
