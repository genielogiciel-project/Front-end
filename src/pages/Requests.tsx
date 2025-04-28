import { useState } from 'react';
import { useAppSelector } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RequestStatus, ResourceType } from '@/lib/types';
import { FileText, Plus, Search, Filter } from 'lucide-react';

export default function Requests() {
  const { requests } = useAppSelector((state) => state.requests);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<RequestStatus | 'ALL'>('ALL');

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.justification.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         request.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Demandes de Ressources</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle Demande
        </Button>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher une demande..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as RequestStatus | 'ALL')}>
          <SelectTrigger className="w-[200px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filtrer par statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tous les statuts</SelectItem>
            {Object.values(RequestStatus).map((status) => (
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
                <div>
                  <CardTitle className="text-xl">Demande #{request.id}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Département: {request.departmentId}
                  </p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm ${
                  request.status === RequestStatus.APPROVED ? 'bg-green-100 text-green-800' :
                  request.status === RequestStatus.REJECTED ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {request.status}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Articles demandés:</h4>
                  <div className="space-y-2">
                    {request.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <FileText className="h-4 w-4" />
                        <span>
                          {item.quantity}x {item.type === ResourceType.COMPUTER ? 'Ordinateur' : 'Imprimante'}
                          {' - '}
                          {item.type === ResourceType.COMPUTER
                            ? `${item.specifications.brand} ${item.specifications.cpu}`
                            : `${item.specifications.brand} ${item.specifications.resolution}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Justification:</h4>
                  <p className="text-sm text-muted-foreground">{request.justification}</p>
                </div>
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>Créé le: {new Date(request.createdAt).toLocaleDateString()}</span>
                  <span>Mis à jour le: {new Date(request.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}