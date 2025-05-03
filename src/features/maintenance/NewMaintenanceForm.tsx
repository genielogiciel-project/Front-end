// features/maintenance/NewMaintenanceForm.tsx
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useCreateMaintenanceRecord } from "../../hooks/useMaintenanceRecordApi";

export function NewMaintenanceForm({
  open,
  onClose,
  technicians = [],
  panicReports = [],
}: any) {
  const [form, setForm] = useState({
    panicReportId: "",
    technicianId: "",
    maintenanceDate: new Date().toISOString().split("T")[0],
    details: "",
  });

  const { toast } = useToast();

  // ✅ Correct: hook is called at the top level
  const { mutate: createMaintenanceRecord, isLoading } =
    useCreateMaintenanceRecord();

  const handleSubmit = () => {
    createMaintenanceRecord(form, {
      onSuccess: () => {
        toast({ title: "Maintenance enregistrée avec succès" });
        onClose();
      },
      onError: () => {
        toast({ title: "Échec de l'enregistrement", variant: "destructive" });
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Créer une intervention</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Select
            value={form.panicReportId}
            onValueChange={(v) => setForm({ ...form, panicReportId: v })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Rapport de panne" />
            </SelectTrigger>
            <SelectContent>
              {panicReports.map((r: any) => (
                <SelectItem key={r.id} value={r.id}>
                  #{r.id} - {r.issueDescription.slice(0, 30)}...
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={form.technicianId}
            onValueChange={(v) => setForm({ ...form, technicianId: v })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Technicien" />
            </SelectTrigger>
            <SelectContent>
              {technicians.map((t: any) => (
                <SelectItem key={t.id} value={t.id}>
                  {t.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            type="date"
            value={form.maintenanceDate}
            onChange={(e) =>
              setForm({ ...form, maintenanceDate: e.target.value })
            }
          />

          <Textarea
            placeholder="Détail de l'intervention"
            value={form.details}
            onChange={(e) => setForm({ ...form, details: e.target.value })}
          />

          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
