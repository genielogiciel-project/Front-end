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
import { MaintenanceStatus, PanicReportStatus } from "@/lib/types";
import { NewMaintenanceForm } from "@/features/maintenance/NewMaintenanceForm";
import { useGetAllMaintenanceRecords } from "@/hooks/useMaintenanceRecordApi"; // ✅ from your file
import { useGetAllPanicReports } from "@/hooks/usePanicReportApi"; // You need to create this

export default function Maintenance() {
  const [formOpen, setFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<PanicReportStatus | "ALL">(
    "ALL"
  );

  const { data: maintenanceRecords = [] } = useGetAllMaintenanceRecords();
  const { data: panicReports = [] } = useGetAllPanicReports();

  const filteredRequests = maintenanceRecords.filter((request) => {
    const matchesSearch =
      request.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.panicReport?.resource?.id
        ?.toLowerCase()
        ?.includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "ALL" || request.panicReport?.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: PanicReportStatus) => {
    switch (status) {
      case PanicReportStatus.OPEN:
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case PanicReportStatus.IN_PROGRESS:
        return <Clock className="h-5 w-5 text-blue-500" />;
      case PanicReportStatus.RESOLVED:
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case PanicReportStatus.CLOSED:
        return <ArrowLeftRight className="h-5 w-5 text-purple-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Maintenance</h1>
        <Button onClick={() => setFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Ouvrir un OT Maintenance
        </Button>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher une demande de maintenance..."
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
        {filteredRequests.map((request) => (
          <Card key={request.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  {getStatusIcon(request.panicReport?.status!)}
                  <div>
                    <CardTitle className="text-lg">
                      Maintenance #{request.id}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Ressource:{" "}
                      {request.panicReport?.resource?.inventoryNumber}
                    </p>
                  </div>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-sm ${
                    request?.status === MaintenanceStatus.RESOLVED
                      ? "bg-green-100 text-green-800"
                      : request?.status === MaintenanceStatus.IN_PROGRESS
                        ? "bg-blue-100 text-blue-800"
                        : request?.status === MaintenanceStatus.RETURNED &&
                          "bg-purple-100 text-purple-800"
                  }`}
                >
                  {request?.status}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-1">
                    Détail de l'intervention :
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {request.details}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-1">Technicien:</h4>
                    <p className="text-sm text-muted-foreground">
                      {request.technician?.fullName}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Date:</h4>
                    <p className="text-sm text-muted-foreground">
                      {new Date(request.maintenanceDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <NewMaintenanceForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        panicReports={panicReports?.filter(
          (r) =>
            r.status !== PanicReportStatus.CLOSED &&
            r.status !== PanicReportStatus.RESOLVED
        )} // unresolved
      />
    </div>
  );
}
