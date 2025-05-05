import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useCreatePanicReport } from "@/hooks/usePanicReportApi";
import { useGetResourcesByUserId } from "@/hooks/useResourceApi";
import { useAuth } from "../../auth/useAuth";
import { PanicReportStatus } from "@/lib/types";

export function NewPanicReportForm({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { toast } = useToast();
  const { user } = useAuth(); // Should return user object with `id`
  const { data: resources = [] } = useGetResourcesByUserId(user?.id!);
  const { mutate: createReport, isPending } = useCreatePanicReport();

  const [form, setForm] = useState({
    resourceId: "",
    description: "",
  });

  const handleSubmit = () => {
    if (!form.resourceId || !form.description || !user?.id) {
      toast({
        title: "Tous les champs sont obligatoires",
        variant: "destructive",
      });
      return;
    }

    createReport(
      {
        description: form.description,
        reportDate: new Date().toISOString(),
        status: PanicReportStatus.OPEN,
        // @ts-expect-error
        resource: { id: form.resourceId },
        // @ts-expect-error
        teacher: { id: user.id },
      },
      {
        onSuccess: () => {
          toast({ title: "Panne signalée avec succès" });
          setForm({ resourceId: "", description: "" });
          onClose();
        },
        onError: () => {
          toast({
            title: "Erreur lors de l'enregistrement",
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Signaler une panne</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Select
            value={form.resourceId}
            onValueChange={(v) => setForm({ ...form, resourceId: v })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choisir une ressource" />
            </SelectTrigger>
            <SelectContent>
              {resources.map((res: any) => (
                <SelectItem key={res.id} value={res.id}>
                  {res.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Textarea
            placeholder="Décrivez la panne rencontrée"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? "Envoi en cours..." : "Envoyer"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
