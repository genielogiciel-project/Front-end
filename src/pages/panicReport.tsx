import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Plus,
  AlertTriangle,
  CheckCircle,
  Clock,
  Archive,
  HardDrive,
  User,
  Info,
  PenTool,
} from "lucide-react";
import {
  useDeletePanicReport,
  useGetAllPanicReports,
  useUpdatePanicReport,
} from "@/hooks/usePanicReportApi";
import type { PanicReport } from "@/lib/types";
import { PanicReportStatus, UserRole } from "@/lib/types";
import { NewPanicReportForm } from "@/features/panicReport/NewPanicReportForm";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckRole } from "@/lib/CheckRole";
import { useAppSelector } from "@/lib/store";

export default function PanicReport() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<PanicReportStatus | "ALL">(
    "ALL"
  );
  const [formOpen, setFormOpen] = useState(false);
  const [expandedReportId, setExpandedReportId] = useState<string | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<PanicReport | null>(
    null
  );
  const [editDescription, setEditDescription] = useState("");
  const [editStatus, setEditStatus] = useState<PanicReportStatus>(
    PanicReportStatus.OPEN
  );

  const { toast } = useToast();
  const { user } = useAppSelector((state) => state.auth);
  const { data: reports = [], isLoading } = useGetAllPanicReports();
  const { mutate: updateReport, isPending: isUpdating } =
    useUpdatePanicReport();
  const { mutate: deleteReport, isPending: isDeleting } =
    useDeletePanicReport();

  const handleEditClick = (report: PanicReport) => {
    setSelectedReport(report);
    setEditDescription(report.description);
    setEditStatus(report.status);
    setEditModalOpen(true);
  };

  const handleDeleteClick = (report: PanicReport) => {
    setSelectedReport(report);
    setDeleteModalOpen(true);
  };

  const handleUpdateReport = () => {
    if (!selectedReport) return;

    updateReport(
      {
        id: selectedReport.id,
        updatedData: {
          description: editDescription,
          status: editStatus,
        },
      },
      {
        onSuccess: () => {
          toast({
            title: "Rapport mis à jour",
            description: "Le signalement a été modifié avec succès",
          });
          setEditModalOpen(false);
        },
        onError: () => {
          toast({
            title: "Erreur",
            description: "Une erreur est survenue lors de la modification",
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleDeleteReport = () => {
    if (!selectedReport) return;

    deleteReport(selectedReport.id, {
      onSuccess: () => {
        toast({
          title: "Rapport supprimé",
          description: "Le signalement a été supprimé avec succès",
        });
        setDeleteModalOpen(false);
      },
      onError: () => {
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de la suppression",
          variant: "destructive",
        });
      },
    });
  };

  const filteredReports = useMemo(() => {
    // let filtered = reports.filter((report) => report.teacher.id === user?.id);
    let filtered = reports;

    // Apply tab filter first
    if (statusFilter !== "ALL") {
      filtered = filtered.filter((report) => report.status === statusFilter);
    }

    // Then apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (report) =>
          report.description?.toLowerCase().includes(query) ||
          report.resource?.brand?.toLowerCase().includes(query) ||
          report.resource?.inventoryNumber?.toLowerCase().includes(query) ||
          report.teacher?.fullName?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [reports, searchQuery, statusFilter]);

  const toggleReportExpansion = (reportId: string) => {
    setExpandedReportId(expandedReportId === reportId ? null : reportId);
  };

  const getStatusDetails = (status: PanicReportStatus) => {
    switch (status) {
      case "OPEN":
        return {
          icon: <AlertTriangle className="h-4 w-4" />,
          color: "bg-yellow-100 text-yellow-800",
          text: "En attente",
        };
      case "IN_PROGRESS":
        return {
          icon: <Clock className="h-4 w-4" />,
          color: "bg-blue-100 text-blue-800",
          text: "En cours",
        };
      case "RESOLVED":
        return {
          icon: <CheckCircle className="h-4 w-4" />,
          color: "bg-green-100 text-green-800",
          text: "Résolu",
        };
      case "CLOSED":
        return {
          icon: <Archive className="h-4 w-4" />, // Changed from ArrowLeftRight to Archive
          color: "bg-gray-100 text-gray-800", // Changed color to gray
          text: "Clôturé",
        };
      default:
        return { icon: null, color: "", text: "" };
    }
  };

  const statusCounts = useMemo(() => {
    const counts = {
      ALL: filteredReports.length,
      OPEN: 0,
      IN_PROGRESS: 0,
      RESOLVED: 0,
      CLOSED: 0,
    };

    filteredReports.forEach((report) => {
      counts[report.status]++;
    });

    return counts;
  }, [reports]);

  const handleTabChange = (value: string) => {
    if (value === "all") {
      setStatusFilter("ALL");
    } else {
      setStatusFilter(value as PanicReportStatus);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Gestion des Pannes</h1>
          <p className="text-sm text-muted-foreground">
            Suivi et gestion des signalements de panne
          </p>
        </div>
        {CheckRole(user?.role!, [
          UserRole.TEACHER,
          UserRole.DEPARTMENT_HEAD,
        ]) && (
          <Button onClick={() => setFormOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Nouveau signalement
          </Button>
        )}
      </div>

      <Tabs
        defaultValue="ALL"
        value={statusFilter === "ALL" ? "ALL" : statusFilter}
        onValueChange={handleTabChange}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <TabsList className="grid grid-cols-5 w-full md:w-auto">
            <TabsTrigger value="ALL" className="flex gap-2 cursor-pointer">
              Tous <Badge variant="secondary">{statusCounts.ALL}</Badge>
            </TabsTrigger>
            <TabsTrigger
              value={PanicReportStatus.OPEN}
              className="flex gap-2 cursor-pointer"
            >
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              <Badge variant="secondary">{statusCounts.OPEN}</Badge>
            </TabsTrigger>
            <TabsTrigger
              value={PanicReportStatus.IN_PROGRESS}
              className="flex gap-2 cursor-pointer"
            >
              <Clock className="h-4 w-4 text-blue-500" />
              <Badge variant="secondary">{statusCounts.IN_PROGRESS}</Badge>
            </TabsTrigger>
            <TabsTrigger
              value={PanicReportStatus.RESOLVED}
              className="flex gap-2 cursor-pointer"
            >
              <CheckCircle className="h-4 w-4 text-green-500" />
              <Badge variant="secondary">{statusCounts.RESOLVED}</Badge>
            </TabsTrigger>
            <TabsTrigger
              value={PanicReportStatus.CLOSED}
              className="flex gap-2 cursor-pointer"
            >
              <Archive className="h-4 w-4 text-gray-500" /> {/* Updated icon */}
              <Badge variant="secondary">{statusCounts.CLOSED}</Badge>
            </TabsTrigger>
          </TabsList>

          <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par ressource, description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value as PanicReportStatus | "ALL");
                // Sync with tabs
                if (value === "ALL") {
                  handleTabChange("all");
                } else {
                  handleTabChange(value.toLowerCase());
                }
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Tous les statuts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tous les statuts</SelectItem>
                {Object.values(PanicReportStatus).map((status) => {
                  const { icon, text } = getStatusDetails(status);
                  return (
                    <SelectItem key={status} value={status}>
                      <div className="flex flex-row items-center gap-2 flex-nowrap">
                        {icon}
                        {text}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="ALL">
          <ReportList
            reports={filteredReports}
            isLoading={isLoading}
            searchQuery={searchQuery}
            expandedReportId={expandedReportId}
            toggleReportExpansion={toggleReportExpansion}
            getStatusDetails={getStatusDetails}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
          />
        </TabsContent>

        {Object.values(PanicReportStatus).map((status) => (
          <TabsContent key={status} value={status}>
            <ReportList
              reports={filteredReports}
              isLoading={isLoading}
              searchQuery={searchQuery}
              expandedReportId={expandedReportId}
              toggleReportExpansion={toggleReportExpansion}
              getStatusDetails={getStatusDetails}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          </TabsContent>
        ))}
      </Tabs>

      {/* Edit Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le signalement</DialogTitle>
            <DialogDescription>
              Modifiez les détails de ce signalement de panne
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Description</Label>
              <Textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Décrivez la panne..."
              />
            </div>
            {CheckRole(user?.role!, [UserRole.SUPER_ADMIN]) && (
              <div>
                <Label>Statut</Label>
                <Select
                  value={editStatus}
                  onValueChange={(value) =>
                    setEditStatus(value as PanicReportStatus)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un statut" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(PanicReportStatus).map((status) => {
                      const details = getStatusDetails(status);
                      return (
                        <SelectItem key={status} value={status}>
                          <div className="flex items-center gap-2">
                            {details.icon}
                            {details.text}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditModalOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleUpdateReport} disabled={isUpdating}>
              {isUpdating ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer le signalement</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce signalement? Cette action
              est irréversible.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Signalement #{selectedReport?.id} -{" "}
              {selectedReport?.resource?.brand} {selectedReport?.resource?.type}
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteReport}
              disabled={isDeleting}
            >
              {isDeleting ? "Suppression..." : "Supprimer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <NewPanicReportForm open={formOpen} onClose={() => setFormOpen(false)} />
    </div>
  );
}

function ReportList({
  reports,
  isLoading,
  searchQuery,
  expandedReportId,
  toggleReportExpansion,
  getStatusDetails,
  onEdit,
  onDelete,
}: {
  reports: PanicReport[];
  isLoading: boolean;
  searchQuery: string;
  expandedReportId: string | null;
  toggleReportExpansion: (id: string) => void;
  getStatusDetails: (status: PanicReportStatus) => any;
  onEdit: (report: PanicReport) => void;
  onDelete: (report: PanicReport) => void;
}) {
  const { user } = useAppSelector((state) => state.auth);
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <Card className="text-center p-8 h-132 flex flex-col items-center justify-center">
        <Info className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-xl font-medium">Aucun signalement trouvé</h3>
        <p className="text-lg text-muted-foreground mt-2">
          {searchQuery
            ? "Essayez de modifier vos critères de recherche"
            : "Aucun signalement n'a été enregistré pour le moment"}
        </p>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {reports.map((report) => {
        const isExpanded = expandedReportId === report.id;
        const statusDetails = getStatusDetails(report.status);

        return (
          <Card key={report.id} className="overflow-hidden">
            <CardHeader
              className={cn(
                "pb-3 cursor-pointer hover:bg-muted/50 transition-colors",
                isExpanded ? "bg-muted/50" : ""
              )}
            >
              <div className="flex justify-between items-start gap-4">
                <div
                  className="flex items-start gap-3 flex-1"
                  onClick={() => toggleReportExpansion(report.id)}
                >
                  <div className="p-2 rounded-lg bg-background border">
                    <HardDrive className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      {report.resource?.brand} {report.resource?.type}
                      <Badge variant="outline" className="text-xs">
                        #{report.resource?.inventoryNumber}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="mt-1 line-clamp-1">
                      {report.description}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-2">
                    <Badge className={statusDetails.color} variant="outline">
                      {statusDetails.icon}
                      <span className="ml-2">{statusDetails.text}</span>
                    </Badge>
                    {CheckRole(user?.role!, [
                      UserRole.TEACHER,
                      UserRole.DEPARTMENT_HEAD,
                    ]) &&
                      report.status !== PanicReportStatus.RESOLVED && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              className="cursor-pointer"
                              onClick={() => onEdit(report)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              <span>Modifier</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="cursor-pointer text-red-600 focus:text-red-600"
                              onClick={() => onDelete(report)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>Supprimer</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {report?.reportDate.toString()}
                  </div>
                </div>
              </div>
            </CardHeader>

            {isExpanded && (
              <>
                <Separator />
                <CardContent className="pt-4">
                  <div className="grid gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-3 flex items-center gap-2">
                          <Info className="h-4 w-4" />
                          Détails du signalement
                        </h4>
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Description
                            </p>
                            <p className="text-sm mt-1">{report.description}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Date
                            </p>
                            <p className="text-sm mt-1">
                              {report?.reportDate.toString()}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-3 flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Responsables
                        </h4>
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Signalé par
                            </p>
                            <p className="text-sm mt-1">
                              {report.teacher?.fullName || "Non spécifié"}
                            </p>
                          </div>
                          {report.maintenanceRecord && (
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Technicien
                              </p>
                              <p className="text-sm mt-1">
                                {report.maintenanceRecord.technician.fullName ||
                                  "Non spécifié"}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <HardDrive className="h-4 w-4" />
                        Ressource concernée
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Type</p>
                          <p className="text-sm mt-1">
                            {report.resource?.type || "—"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Marque
                          </p>
                          <p className="text-sm mt-1">
                            {report.resource?.brand || "—"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Série</p>
                          <p className="text-sm mt-1">
                            {report.resource?.inventoryNumber || "—"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {report.maintenanceRecord && (
                      <>
                        <Separator />
                        <div>
                          <h4 className="font-medium mb-3 flex items-center gap-2">
                            <PenTool className="h-4 w-4" />
                            Intervention
                          </h4>
                          <div className="space-y-3">
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Détails
                              </p>
                              <p className="text-sm mt-1">
                                {report.maintenanceRecord.details || "—"}
                              </p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm text-muted-foreground">
                                  Date d'intervention
                                </p>
                                <p className="text-sm mt-1">
                                  {format(
                                    new Date(
                                      report.maintenanceRecord.maintenanceDate
                                    ),
                                    "PPPP",
                                    { locale: fr }
                                  )}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">
                                  Statut
                                </p>
                                <p className="text-sm mt-1">
                                  {report.status || "—"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end bg-muted/50 p-3">
                  <Button variant="outline" size="sm">
                    Voir les détails complets
                  </Button>
                </CardFooter>
              </>
            )}
          </Card>
        );
      })}
    </div>
  );
}
