"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Ban } from "lucide-react";
import { CallForTender } from "@/lib/types";

interface TenderCardProps {
  tender: CallForTender;
}

export function TenderCard({ tender }: TenderCardProps) {
  const getStatusIcon = (open: true | false) => {
    switch (status) {
      case "OPEN":
        return <Clock className="h-5 w-5 text-blue-500" />;
      case "CLOSED":
        return <Ban className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  // Helper function to parse specifications
  const parseSpecs = (spec: string) => {
    try {
      return JSON.parse(spec);
    } catch {
      return {};
    }
  };

  // Determine status based on open flag and dates
  const getStatus = () => {
    if (!tender.open) return "CLOSED";
    const now = new Date();
    const endDate = new Date(tender.endDate);
    return now > endDate ? "CLOSED" : "OPEN";
  };

  const status = getStatus();

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            {getStatusIcon(status)}
            <div>
              <CardTitle className="text-xl">
                {tender.title ||
                  `Appel d'offre ${tender.requestId || tender.id}`}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Référence: {tender.requestId || tender.id}
              </p>
            </div>
          </div>
          <div
            className={`px-3 py-1 rounded-full text-sm ${
              status === "OPEN"
                ? "bg-blue-100 text-blue-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {status}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
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
            <h4 className="font-medium mb-2">Produits demandés:</h4>
            <div className="space-y-3">
              {(tender.requestedProducts ?? []).map((product, index) => {
                const specs = parseSpecs(product.specifications || "{}");

                return (
                  <div key={index} className="text-sm border rounded p-3">
                    <div className="font-medium">
                      {product.quantity}x {product.type} ({product.brand})
                    </div>

                    {product.type === "COMPUTER" && (
                      <ul className="mt-1 pl-4 list-disc text-muted-foreground">
                        {specs.cpu && <li>CPU: {specs.cpu}</li>}
                        {specs.ram && <li>RAM: {specs.ram}</li>}
                        {specs.storage && <li>Stockage: {specs.storage}</li>}
                        {specs.monitor && <li>Écran: {specs.monitor}</li>}
                      </ul>
                    )}

                    {product.type === "PRINTER" && (
                      <ul className="mt-1 pl-4 list-disc text-muted-foreground">
                        {specs.printSpeed && (
                          <li>Vitesse: {specs.printSpeed}</li>
                        )}
                        {specs.resolution && (
                          <li>Résolution: {specs.resolution}</li>
                        )}
                      </ul>
                    )}
                  </div>
                );
              })}

              {(!tender.requestedProducts ||
                tender.requestedProducts.length === 0) && (
                <p className="text-sm text-muted-foreground">
                  Aucun produit demandé.
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
