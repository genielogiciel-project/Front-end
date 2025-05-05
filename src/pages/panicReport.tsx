import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Filter,
  Plus,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowLeftRight,
} from "lucide-react";
import { useGetAllPanicReports } from "@/hooks/usePanicReportApi";
import { PanicReportStatus } from "@/lib/types";
import { NewPanicReportForm } from "@/features/panicReport/NewPanicReportForm";

export default function PanicReportPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<PanicReportStatus | "ALL">(
    "ALL"
  );
  const [formOpen, setFormOpen] = useState(false);

  const { data: reports = [] } = useGetAllPanicReports();

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.resource?.brand?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "ALL" || report.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: PanicReportStatus) => {
    switch (status) {
      case "OPEN":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "IN_PROGRESS":
        return <Clock className="h-5 w-5 text-blue-500" />;
      case "RESOLVED":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "CLOSED":
        return <ArrowLeftRight className="h-5 w-5 text-purple-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Rapports de Panne</h1>
        <Button onClick={() => setFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Signaler une panne
        </Button>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un rapport de panne..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(value) =>
            setStatusFilter(value as PanicReportStatus | "ALL")
          }
        >
          <SelectTrigger className="w-[200px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filtrer par statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tous les statuts</SelectItem>
            {Object.values(PanicReportStatus).map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {filteredReports.map((report) => (
          <Card key={report.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  {getStatusIcon(report.status)}
                  <div>
                    <CardTitle className="text-lg">
                      Rapport #{report.id}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Ressource : {report.resource?.brand}
                    </p>
                  </div>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-sm ${
                    report.status === "RESOLVED"
                      ? "bg-green-100 text-green-800"
                      : report.status === "IN_PROGRESS"
                        ? "bg-blue-100 text-blue-800"
                        : report.status === "CLOSED"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {report.status}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-1">Description :</h4>
                  <p className="text-sm text-muted-foreground">
                    {report.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-1">Signalé par :</h4>
                    <p className="text-sm text-muted-foreground">
                      {report.teacher?.fullName ?? "—"}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Date de signalement :</h4>
                    <p className="text-sm text-muted-foreground">
                      {new Date(report.reportedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {report.resource && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-1">Type de ressource :</h4>
                      <p className="text-sm text-muted-foreground">
                        {report.resource.type}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Numéro de série :</h4>
                      <p className="text-sm text-muted-foreground">
                        {report.resource.inventoryNumber}
                      </p>
                    </div>
                  </div>
                )}

                {/* @ts-expect-error */}
                {report?.maintenanceRecord && (
                  <div>
                    <h4 className="font-medium mb-1">Intervention :</h4>
                    <p className="text-sm text-muted-foreground">
                      {/* @ts-expect-error */}
                      {report?.maintenanceRecord.details}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <NewPanicReportForm open={formOpen} onClose={() => setFormOpen(false)} />
    </div>
  );
}
