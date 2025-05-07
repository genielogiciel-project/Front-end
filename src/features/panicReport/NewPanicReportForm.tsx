import { useState, useMemo, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useCreatePanicReport } from "@/hooks/usePanicReportApi";
import { useGetAllResources } from "@/hooks/useResourceApi";
import { useAuth } from "../../auth/useAuth";
import { Resource } from "@/lib/types";
import { Search, X, Check, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export function NewPanicReportForm({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { toast } = useToast();
  const { user } = useAuth();
  const { data: resources = [], isLoading: isLoadingResources } =
    useGetAllResources();
  const { mutate: createReport, isPending } = useCreatePanicReport();

  const [form, setForm] = useState({
    resourceId: "",
    description: "",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedResource, setSelectedResource] = useState<Resource | null>(
    null
  );
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  // Reset form when opening/closing dialog
  useEffect(() => {
    if (open) {
      setForm({ resourceId: "", description: "" });
      setSearchTerm("");
      setSelectedResource(null);
    }
  }, [open]);

  const filteredResources = useMemo(() => {
    if (!searchTerm) return resources;

    const term = searchTerm.toLowerCase();
    return resources.filter((res: Resource) => {
      return (
        res.inventoryNumber?.toLowerCase().includes(term) ||
        res.brand?.toLowerCase().includes(term) ||
        res.type?.toLowerCase().includes(term)
      );
    });
  }, [resources, searchTerm]);

  const handleSubmit = () => {
    if (!form.resourceId || !form.description || !user?.id) {
      toast({
        title: "Champs manquants",
        description: "Veuillez sélectionner une ressource et décrire la panne",
        variant: "destructive",
      });
      return;
    }

    createReport(
      {
        description: form.description,
        // reportDate: new Date().toISOString(),
        // status: PanicReportStatus.OPEN,
        // @ts-expect-error
        resource: { id: form.resourceId },
        // @ts-expect-error
        teacher: { id: user.id },
      },
      {
        onSuccess: () => {
          toast({
            title: "Rapport envoyé",
            description: "La panne a été signalée avec succès",
            action: <Check className="text-green-500" />,
          });
          onClose();
        },
        onError: () => {
          toast({
            title: "Erreur",
            description: "Une erreur est survenue lors de l'envoi du rapport",
            variant: "destructive",
            action: <AlertCircle className="text-red-500" />,
          });
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-orange-500" />
            Signaler une panne
          </DialogTitle>
          <DialogDescription>
            Remplissez ce formulaire pour signaler une panne technique
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Resource Selection */}
          <div className="space-y-3">
            <Label htmlFor="resource-select">Ressource concernée</Label>

            {selectedResource ? (
              <div className="border rounded-lg p-4 bg-muted/50">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">
                      {selectedResource.brand}{" "}
                      {selectedResource.inventoryNumber}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedResource.type} •{" "}
                      {selectedResource.inventoryNumber || "N/A"}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => {
                      setSelectedResource(null);
                      setForm((prev) => ({ ...prev, resourceId: "" }));
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <Select
                open={isSelectOpen}
                onOpenChange={setIsSelectOpen}
                onValueChange={(v) =>
                  setForm((prev) => ({ ...prev, resourceId: v }))
                }
                value={form.resourceId}
              >
                <SelectTrigger
                  onClick={() => setIsSelectOpen(true)}
                  className="w-full"
                >
                  <SelectValue placeholder="Rechercher une ressource..." />
                </SelectTrigger>
                <SelectContent className="p-0" align="start">
                  <div className="relative p-2 border-b">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher par numéro, marque ou type..."
                      className="pl-10 border-0 shadow-none focus-visible:ring-0"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      autoFocus
                    />
                  </div>

                  <ScrollArea className="h-64">
                    {isLoadingResources ? (
                      <div className="py-6 text-center text-sm text-muted-foreground">
                        Chargement des ressources...
                      </div>
                    ) : filteredResources.length > 0 ? (
                      filteredResources.map((resource: Resource) => (
                        <SelectItem
                          key={resource.id}
                          value={resource.id!}
                          className="cursor-pointer"
                          // onClick={() => handleSelectResource(resource)}
                        >
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">
                                {resource.brand} • {resource.type}
                              </span>
                              {resource.inventoryNumber && (
                                <Badge variant="outline" className="text-xs">
                                  {resource.inventoryNumber}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </SelectItem>
                      ))
                    ) : (
                      <div className="py-6 text-center text-sm text-muted-foreground">
                        Aucune ressource trouvée
                      </div>
                    )}
                  </ScrollArea>
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Description Field */}
          <div className="space-y-3">
            <Label htmlFor="description">Description de la panne</Label>
            <Textarea
              id="description"
              placeholder="Décrivez précisément la panne rencontrée..."
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              rows={5}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Soyez aussi précis que possible pour faciliter la résolution du
              problème
            </p>
          </div>

          {/* Report Date */}
          <div className="space-y-3">
            <Label>Date du signalement</Label>
            <div className="flex items-center gap-2 text-sm">
              <Badge variant="secondary" className="px-3 py-1">
                {new Date().toLocaleDateString("fr-FR", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </Badge>
              <span className="text-muted-foreground">
                {new Date().toLocaleTimeString("fr-FR")}
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={isPending || !form.resourceId || !form.description}
            className={cn(
              "w-full",
              isPending ? "opacity-75" : "",
              !form.resourceId || !form.description ? "opacity-50" : ""
            )}
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Envoi en cours...
              </span>
            ) : (
              "Envoyer le rapport"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
