"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Ban } from "lucide-react";
import { CallForTender } from "@/lib/types"; // ✅ Import your correct type!

interface TenderCardProps {
  tender: CallForTender;
}

export function TenderCard({ tender }: TenderCardProps) {
  const getStatusIcon = (status: "OPEN" | "CLOSED") => {
    switch (status) {
      case "OPEN":
        return <Clock className="h-5 w-5 text-blue-500" />;
      case "CLOSED":
        return <Ban className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            {getStatusIcon(tender.status)}
            <div>
              <CardTitle className="text-xl">{tender.title}</CardTitle>
              <p className="text-sm text-muted-foreground">
                Référence: {tender.requestId}
              </p>
            </div>
          </div>
          <div
            className={`px-3 py-1 rounded-full text-sm ${
              tender.status === "OPEN"
                ? "bg-blue-100 text-blue-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {tender.status}
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
            <div className="space-y-2">
              {(tender.requestedProducts ?? []).map((product, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <span>
                    {/* • {product.quantity}x {product.productName} */}
                  </span>
                </div>
              ))}
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
