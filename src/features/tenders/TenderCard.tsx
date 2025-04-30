"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Ban, Edit } from "lucide-react";
import { CallForTender } from "@/lib/types";

interface TenderCardProps {
  tender: CallForTender;
  onEdit?: (tender: CallForTender) => void;
}

export function TenderCard({ tender, onEdit }: TenderCardProps) {
  const parseSpecifications = (specs: string) => {
    try {
      return JSON.parse(specs);
    } catch {
      return {};
    }
  };

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
            {status === "OPEN" ? (
              <Clock className="h-5 w-5 text-blue-500" />
            ) : (
              <Ban className="h-5 w-5 text-red-500" />
            )}
            <div>
              <CardTitle className="text-xl">{tender.title}</CardTitle>
              <p className="text-sm text-muted-foreground">
                Référence: {tender.title}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <div
              className={`px-3 py-1 rounded-full text-sm ${
                status === "OPEN"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {status === "OPEN" ? "EN COURS" : "CLÔTURÉ"}
            </div>
            {onEdit && (
              <button
                onClick={() => onEdit(tender)}
                className="p-1 text-muted-foreground hover:text-primary"
              >
                <Edit className="h-4 w-4" />
              </button>
            )}
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
              {tender.requestedProducts.map((product, index) => {
                const specs = parseSpecifications(product.specifications);

                return (
                  <div key={index} className="text-sm border rounded p-3">
                    <div className="font-medium">
                      {product.quantity}x {product.type} ({product.brand})
                    </div>

                    {product.type === "COMPUTER" && (
                      <ul className="mt-1 pl-4 list-disc text-muted-foreground">
                        <li>CPU: {specs.cpu || "Non spécifié"}</li>
                        <li>RAM: {specs.ram || "Non spécifié"}</li>
                        <li>Stockage: {specs.storage || "Non spécifié"}</li>
                        <li>Écran: {specs.monitor || "Non spécifié"}</li>
                      </ul>
                    )}

                    {product.type === "PRINTER" && (
                      <ul className="mt-1 pl-4 list-disc text-muted-foreground">
                        <li>Vitesse: {specs.printSpeed || "Non spécifié"}</li>
                        <li>
                          Résolution: {specs.resolution || "Non spécifié"}
                        </li>
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
