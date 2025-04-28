import { useState } from 'react';
import { useAppSelector } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MaintenanceStatus } from '@/lib/types';
import { Search, Filter, Plus, AlertTriangle, CheckCircle, Clock, ArrowLeftRight } from 'lucide-react';

export default function Maintenance() {
  const { requests } = useAppSelector((state) => state.maintenance);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<MaintenanceStatus | 'ALL'>('ALL');

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.issueDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         request.resourceId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: MaintenanceStatus) => {
    switch (status) {
      case MaintenanceStatus.REPORTED:
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case MaintenanceStatus.IN_PROGRESS:
        return <Clock className="h-5 w-5 text-blue-500" />;
      case MaintenanceStatus.RESOLVED:
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case MaintenanceStatus.RETURNED_TO_SUPPLIER:
        return <ArrowLeftRight className="h-5 w-5 text-purple-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Maintenance</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Signaler un problème
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
        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as MaintenanceStatus | 'ALL')}>
          <SelectTrigger className="w-[200px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filtrer par statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tous les statuts</SelectItem>
            {Object.values(MaintenanceStatus).map((status) => (
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
                  {getStatusIcon(request.status)}
                  <div>
                    <CardTitle className="text-lg">Maintenance #{request.id}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Ressource: {request.resourceId}
                    </p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm ${
                  request.status === MaintenanceStatus.RESOLVED ? 'bg-green-100 text-green-800' :
                  request.status === MaintenanceStatus.IN_PROGRESS ? 'bg-blue-100 text-blue-800' :
                  request.status === MaintenanceStatus.RETURNED_TO_SUPPLIER ? 'bg-purple-100 text-purple-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {request.status}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-1">Description du problème:</h4>
                  <p className="text-sm text-muted-foreground">{request.issueDescription}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-1">Type de problème:</h4>
                    <p className="text-sm text-muted-foreground">
                      {request.issueType === 'SOFTWARE' ? 'Logiciel' : 'Matériel'}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Fréquence:</h4>
                    <p className="text-sm text-muted-foreground">{request.issueFrequency}</p>
                  </div>
                </div>
                {request.resolution && (
                  <div>
                    <h4 className="font-medium mb-1">Résolution:</h4>
                    <p className="text-sm text-muted-foreground">{request.resolution}</p>
                  </div>
                )}
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>Signalé le: {new Date(request.reportedAt).toLocaleDateString()}</span>
                  {request.resolvedAt && (
                    <span>Résolu le: {new Date(request.resolvedAt).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}