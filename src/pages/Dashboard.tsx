import { useEffect } from "react";
import { useAppSelector } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserRole, RequestStatus, PanicReportStatus } from "@/lib/types";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { gsap } from "gsap";

export default function Dashboard() {
  const { user } = useAppSelector((state) => state.auth);
  const { resources } = useAppSelector((state) => state.resources);
  const { requests } = useAppSelector((state) => state.requests);
  const { requests: maintenanceRequests } = useAppSelector(
    (state) => state.maintenance
  );
  const { tenders } = useAppSelector((state) => state.suppliers);

  useEffect(() => {
    // Animate cards with GSAP
    const cards = document.querySelectorAll(".dashboard-card");
    gsap.set(cards, {
      y: 50,
      opacity: 0,
    });
    gsap.to(cards, {
      y: 0,
      opacity: 1,
      duration: 0.5,
      stagger: 0.1,
      ease: "power3.out",
    });
  }, []);

  // Calculate statistics
  const totalResources = resources.length;
  const availableResources = resources.filter(
    (r) => r.status === "AVAILABLE"
  ).length;
  const assignedResources = resources.filter(
    (r) => r.status === "ASSIGNED"
  ).length;
  const maintenanceResources = resources.filter(
    (r) => r.status === "MAINTENANCE"
  ).length;

  const totalRequests = requests.length;
  const pendingRequests = requests.filter(
    (r) => r.status === RequestStatus.SUBMITTED
  ).length;
  const approvedRequests = requests.filter(
    (r) => r.status === RequestStatus.VALIDATED
  ).length;

  const totalMaintenanceRequests = maintenanceRequests.length;

  const inProgressMaintenanceRequests = maintenanceRequests.filter(
    (r) => r.status === PanicReportStatus.IN_PROGRESS
  ).length;

  const totalTenders = tenders.length;
  const openTenders = tenders.filter((t) => t.status === "OPEN").length;

  // Chart data
  const resourceStatusData = [
    { name: "Disponible", value: availableResources, color: "#22c55e" },
    { name: "Affecté", value: assignedResources, color: "#3b82f6" },
    { name: "Maintenance", value: maintenanceResources, color: "#f97316" },
    {
      name: "Réformé",
      value:
        totalResources -
        availableResources -
        assignedResources -
        maintenanceResources,
      color: "#ef4444",
    },
  ];

  const requestStatusData = [
    {
      name: "Brouillon",
      value: requests.filter((r) => r.status === RequestStatus.SUBMITTED)
        .length,
      color: "#94a3b8",
    },
    { name: "Soumis", value: pendingRequests, color: "#f59e0b" },
    { name: "Approuvé", value: approvedRequests, color: "#22c55e" },
    {
      name: "Livré",
      value: requests.filter((r) => r.status === RequestStatus.SENT).length,
      color: "#10b981",
    },
    {
      name: "Rejeté",
      value: requests.filter((r) => r.status === RequestStatus.REJECTED).length,
      color: "#ef4444",
    },
  ];

  const resourceTypeData = [
    {
      name: "Ordinateurs",
      value: resources.filter((r) => r.type === "COMPUTER").length,
    },
    {
      name: "Imprimantes",
      value: resources.filter((r) => r.type === "PRINTER").length,
    },
  ];

  // Conditional rendering based on user role
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Tableau de bord</h1>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          {(user?.role.includes(UserRole.RESOURCE_MANAGER) ||
            user?.role.includes(UserRole.DEPARTMENT_HEAD)) && (
            <TabsTrigger value="requests">Demandes</TabsTrigger>
          )}
          {(user?.role.includes(UserRole.RESOURCE_MANAGER) ||
            user?.role.includes(UserRole.MAINTENANCE)) && (
            <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          )}
          {user?.role.includes(UserRole.SUPPLIER) && (
            <TabsTrigger value="tenders">Appels d'offre</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="dashboard-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Ressources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalResources}</div>
              </CardContent>
            </Card>

            <Card className="dashboard-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Ressources Disponibles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {availableResources}
                </div>
              </CardContent>
            </Card>

            <Card className="dashboard-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  En Maintenance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-500">
                  {maintenanceResources}
                </div>
              </CardContent>
            </Card>

            <Card className="dashboard-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Demandes en cours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {pendingRequests}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="dashboard-card">
              <CardHeader>
                <CardTitle>Statut des ressources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={resourceStatusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {resourceStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="dashboard-card">
              <CardHeader>
                <CardTitle>Ressources par type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={resourceTypeData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="value"
                        name="Quantité"
                        fill="hsl(var(--chart-1))"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {(user?.role.includes(UserRole.RESOURCE_MANAGER) ||
          user?.role.includes(UserRole.DEPARTMENT_HEAD)) && (
          <TabsContent value="requests" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="dashboard-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Demandes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalRequests}</div>
                </CardContent>
              </Card>

              <Card className="dashboard-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    En attente
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-500">
                    {pendingRequests}
                  </div>
                </CardContent>
              </Card>

              <Card className="dashboard-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Approuvées
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {approvedRequests}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="dashboard-card">
              <CardHeader>
                <CardTitle>Statut des demandes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={requestStatusData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="value"
                        name="Demandes"
                        fill="hsl(var(--chart-2))"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {(user?.role.includes(UserRole.RESOURCE_MANAGER) ||
          user?.role.includes(UserRole.MAINTENANCE)) && (
          <TabsContent value="maintenance" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="dashboard-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Incidents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {totalMaintenanceRequests}
                  </div>
                </CardContent>
              </Card>

              <Card className="dashboard-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Signalés
                  </CardTitle>
                </CardHeader>
              </Card>

              <Card className="dashboard-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    En cours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-500">
                    {inProgressMaintenanceRequests}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        )}

        {user?.role.includes(UserRole.SUPPLIER) && (
          <TabsContent value="tenders" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="dashboard-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Appels d'offre
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalTenders}</div>
                </CardContent>
              </Card>

              <Card className="dashboard-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Appels d'offre ouverts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {openTenders}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
