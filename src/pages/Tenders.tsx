import { useState } from "react";
import { useAppSelector } from "@/lib/store";
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
import { Search, Filter, Plus, Clock, CheckCircle, Ban } from "lucide-react";

export default function Tenders() {
  const { tenders, bids } = useAppSelector((state) => state.suppliers);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "OPEN" | "CLOSED" | "AWARDED" | "ALL"
  >("ALL");

  const filteredTenders = tenders.filter((tender) => {
    const matchesSearch =
      tender.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tender.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "ALL" || tender.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getTenderBids = (tenderId: string) => {
    return bids.filter((bid) => bid.tenderId === tenderId);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "OPEN":
        return <Clock className="h-5 w-5 text-blue-500" />;
      case "AWARDED":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "CLOSED":
        return <Ban className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Appels d'offre</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nouvel appel d'offre
        </Button>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un appel d'offre..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(value) =>
            setStatusFilter(value as "OPEN" | "CLOSED" | "AWARDED" | "ALL")
          }
        >
          <SelectTrigger className="w-[200px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filtrer par statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tous les statuts</SelectItem>
            <SelectItem value="OPEN">En cours</SelectItem>
            <SelectItem value="CLOSED">Clôturé</SelectItem>
            <SelectItem value="AWARDED">Attribué</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {filteredTenders.map((tender) => {
          const tenderBids = getTenderBids(tender.id);
          return (
            <Card key={tender.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(tender.status)}
                    <div>
                      <CardTitle className="text-xl">{tender.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Référence: {tender.id}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-sm ${
                      tender.status === "OPEN"
                        ? "bg-blue-100 text-blue-800"
                        : tender.status === "AWARDED"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {tender.status}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Description:</h4>
                    <p className="text-sm text-muted-foreground">
                      {tender.description}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-1">Date de début:</h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date(tender.startDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Date de fin:</h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date(tender.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Propositions reçues:</h4>
                    <div className="space-y-2">
                      {tenderBids.map((bid) => (
                        <div
                          key={bid.id}
                          className="flex justify-between items-center p-2 bg-muted rounded-md"
                        >
                          <div>
                            <p className="text-sm font-medium">
                              Fournisseur #{bid.supplierId}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Livraison prévue:{" "}
                              {new Date(bid.deliveryDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">
                              {bid.totalPrice} €
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Garantie: {bid.warrantyPeriod}
                            </p>
                          </div>
                        </div>
                      ))}
                      {tenderBids.length === 0 && (
                        <p className="text-sm text-muted-foreground">
                          Aucune proposition reçue
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
