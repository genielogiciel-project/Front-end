import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
import {
  Frequency,
  MaintenanceStatus,
  Origin,
  PanicReport,
  Severity,
} from "@/lib/types";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/lib/store";

export function NewMaintenanceForm({
  open,
  onClose,
  panicReports = [],
}: {
  open: boolean;
  onClose: () => void;
  panicReports?: PanicReport[];
}) {
  const [form, setForm] = useState({
    panicReportId: "",
    maintenanceDate: new Date().toISOString().split("T")[0],
    details: "",
    severity: Severity.NORMAL,
    frequency: Frequency.RARE,
    origin: Origin.HARDWARE,
    status: MaintenanceStatus.RESOLVED,
  });
  const [searchTerm, setSearchTerm] = useState("");

  const { toast } = useToast();
  const { user } = useAppSelector((state) => state.auth);
  const { mutate: createMaintenanceRecord, isPending } =
    useCreateMaintenanceRecord();

  const filteredPanicReports = panicReports.filter(
    (report) =>
      report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedReport = panicReports.find((r) => r.id === form.panicReportId);

  const handleSubmit = () => {
    if (!form.panicReportId) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un rapport de panne",
        variant: "destructive",
      });
      return;
    }

    if (form.severity === Severity.SEVERE && !form.details) {
      toast({
        title: "Erreur",
        description: "Veuillez rédiger un constat pour les pannes sévères",
        variant: "destructive",
      });
      return;
    }

    createMaintenanceRecord(
      {
        // @ts-expect-error
        panicReport: { id: form.panicReportId },
        maintenanceDate: form.maintenanceDate,
        details: form.details,
        severity: form.severity,
        frequency: form.frequency,
        origin: form.origin,
        status: form.status,
        // @ts-expect-error
        technician: {
          id: user?.id!,
        },
      },
      {
        onSuccess: () => {
          toast({ title: "Intervention enregistrée avec succès" });
          onClose();
          setForm({
            panicReportId: "",
            maintenanceDate: new Date().toISOString().split("T")[0],
            details: "",
            severity: Severity.NORMAL,
            frequency: Frequency.RARE,
            origin: Origin.HARDWARE,
            status: MaintenanceStatus.RESOLVED,
          });
        },
        onError: () => {
          toast({
            title: "Échec de l'enregistrement",
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[95vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Nouvelle intervention de maintenance</DialogTitle>
          <DialogDescription>
            Remplissez les détails de l'intervention technique
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Panic Report Search and Select */}
          <div className="space-y-2">
            <Label htmlFor="panic-report-search">Rapport de panne</Label>
            <Select
              value={form.panicReportId}
              onValueChange={(v) => setForm({ ...form, panicReportId: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Rechercher un rapport de panne" />
              </SelectTrigger>
              <SelectContent>
                <div className="relative px-2 py-1 border-b">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="panic-report-search"
                    placeholder="Rechercher par ID ou description..."
                    className="pl-8 border-0 shadow-none focus-visible:ring-0"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  {filteredPanicReports.length > 0 ? (
                    filteredPanicReports.map((report) => (
                      <SelectItem key={report.id} value={report.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">#{report.id}</span>
                          <span className="text-sm text-muted-foreground truncate">
                            {!form.panicReportId && report.description}
                          </span>
                        </div>
                      </SelectItem>
                    ))
                  ) : (
                    <div className="py-2 text-center text-sm text-muted-foreground">
                      Aucun rapport trouvé
                    </div>
                  )}
                </div>
              </SelectContent>
            </Select>
          </div>

          {/* Selected Report Info */}
          {selectedReport && (
            <div className="p-3 border rounded-lg bg-muted/50">
              <div className="flex justify-between">
                <div>
                  <h4 className="font-medium">
                    #{selectedReport.id} - {selectedReport.resource?.brand}{" "}
                    {selectedReport.resource?.type}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedReport.description}
                  </p>
                </div>
                <Badge variant="outline">
                  {selectedReport.resource?.inventoryNumber}
                </Badge>
              </div>
            </div>
          )}

          {/* Maintenance Date */}
          <div className="space-y-2">
            <Label htmlFor="maintenance-date">Date d'intervention</Label>
            <Input
              id="maintenance-date"
              type="date"
              value={form.maintenanceDate}
              onChange={(e) =>
                setForm({ ...form, maintenanceDate: e.target.value })
              }
            />
          </div>

          {/* Severity */}
          <div className="space-y-2">
            <Label>Sévérité de la panne</Label>
            <Select
              value={form.severity}
              // @ts-expect-error
              onValueChange={(v) => setForm({ ...form, severity: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner la sévérité" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={Severity.NORMAL}>Normale</SelectItem>
                <SelectItem value={Severity.SEVERE}>
                  Sévère (nécessite un constat)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Frequency */}
          <div className="space-y-2">
            <Label>Fréquence de la panne</Label>
            <Select
              value={form.frequency}
              // @ts-expect-error
              onValueChange={(v) => setForm({ ...form, frequency: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner la fréquence" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={Frequency.RARE}>
                  Rare (première occurrence)
                </SelectItem>
                <SelectItem value={Frequency.FREQUENT}>
                  Fréquente (plusieurs occurrences)
                </SelectItem>
                <SelectItem value={Frequency.PERMANENT}>
                  Permanente (constante)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Origin */}
          <div className="space-y-2">
            <Label>Origine de la panne</Label>
            <Select
              value={form.origin}
              // @ts-expect-error
              onValueChange={(v) => setForm({ ...form, origin: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner l'origine" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={Origin.HARDWARE}>Matérielle</SelectItem>
                <SelectItem value={Origin.SOFTWARE}>
                  Logicielle (système)
                </SelectItem>
                <SelectItem value={Origin.UTILITY}>
                  Logicielle (utilitaire)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label>Résolution</Label>
            <Select
              value={form.status}
              // @ts-expect-error
              onValueChange={(v) => setForm({ ...form, status: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner le statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={MaintenanceStatus.RESOLVED}>
                  Résolue
                </SelectItem>
                <SelectItem value={MaintenanceStatus.RETURNED}>
                  À retourner au fournisseur
                </SelectItem>
                <SelectItem value={MaintenanceStatus.IN_PROGRESS}>
                  En cours d'intervention
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Details - Required for severe cases */}
          <div className="space-y-2">
            <Label htmlFor="details">
              Détails de l'intervention{" "}
              {form.severity === Severity.SEVERE && (
                <span className="text-red-500">*</span>
              )}
            </Label>
            <Textarea
              id="details"
              placeholder={
                form.severity === Severity.SEVERE
                  ? "Rédigez un constat détaillé de la panne sévère..."
                  : "Décrivez l'intervention effectuée..."
              }
              value={form.details}
              onChange={(e) => setForm({ ...form, details: e.target.value })}
              className={cn(
                form.severity === Severity.SEVERE && !form.details
                  ? "border-red-500 focus:border-red-500"
                  : ""
              )}
            />
            {form.severity === Severity.SEVERE && !form.details && (
              <p className="text-sm text-red-500">
                Un constat est obligatoire pour les pannes sévères
              </p>
            )}
          </div>

          <Button
            onClick={handleSubmit}
            disabled={
              isPending || (form.severity === Severity.SEVERE && !form.details)
            }
            className="w-full"
          >
            {isPending
              ? "Enregistrement en cours..."
              : "Enregistrer l'intervention"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
