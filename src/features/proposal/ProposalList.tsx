// "use client";

// import { Proposal } from "@/lib/types";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { format } from "date-fns";
// import { fr } from "date-fns/locale";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { Check, Download, Printer } from "lucide-react";
// import { useState } from "react";
// import { useToast } from "@/hooks/use-toast";

// interface ProposalsListProps {
//   proposals: Proposal[];
//   onSelectProposal?: (
//     selectedProposalId: string,
//     rejectedProposalIds: string[]
//   ) => void;
//   selectedProposalId?: string | null;
// }

// export function ProposalsList({
//   proposals,
//   onSelectProposal,
//   selectedProposalId,
// }: ProposalsListProps) {
//   const { toast } = useToast();
//   const [localSelectedId, setLocalSelectedId] = useState<string | null>(
//     selectedProposalId || null
//   );

//   const calculateTotal = (proposal: Proposal) => {
//     return proposal.proposalProducts.reduce(
//       (sum, product) => sum + product.unitPrice * product.quantity,
//       0
//     );
//   };

//   const handleSelectProposal = (proposalId: string) => {
//     if (localSelectedId === proposalId) {
//       // Désélection si on clique sur la même proposition
//       setLocalSelectedId(null);
//       if (onSelectProposal) {
//         onSelectProposal("", []);
//       }
//     } else {
//       // Sélection nouvelle proposition
//       setLocalSelectedId(proposalId);

//       // IDs des propositions rejetées (toutes sauf celle sélectionnée)
//       const rejectedIds = proposals
//         .filter((p) => p.id !== proposalId)
//         .map((p) => p.id);

//       if (onSelectProposal) {
//         onSelectProposal(proposalId, rejectedIds);
//       }

//       toast({
//         title: "Proposition sélectionnée",
//         description: "Les autres propositions ont été automatiquement rejetées",
//       });
//     }
//   };

//   return (
//     <Card className="mt-6">
//       <CardHeader className="flex flex-row items-center justify-between pb-2">
//         <CardTitle className="text-lg">Propositions reçues</CardTitle>
//         {/* <div className="flex gap-2">
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => onExport?.("excel")}
//           >
//             <Download className="mr-2 h-4 w-4" />
//             Excel
//           </Button>
//           <Button variant="outline" size="sm" onClick={() => onExport?.("pdf")}>
//             <Printer className="mr-2 h-4 w-4" />
//             PDF
//           </Button>
//         </div> */}
//       </CardHeader>
//       <CardContent>
//         {proposals.length === 0 ? (
//           <div className="text-center py-8 text-muted-foreground">
//             Aucune proposition reçue pour le moment
//           </div>
//         ) : (
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Sélection</TableHead>
//                 <TableHead>Fournisseur</TableHead>
//                 <TableHead>Date livraison</TableHead>
//                 <TableHead>Garantie</TableHead>
//                 <TableHead>Produits</TableHead>
//                 <TableHead className="text-right">Montant total</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {proposals.map((proposal) => (
//                 <TableRow
//                   key={proposal.id}
//                   className={
//                     localSelectedId === proposal.id
//                       ? "bg-green-50 hover:bg-green-50"
//                       : ""
//                   }
//                 >
//                   <TableCell>
//                     <Button
//                       variant="outline"
//                       size="icon"
//                       className="h-8 w-8"
//                       onClick={() => handleSelectProposal(proposal.id)}
//                     >
//                       {localSelectedId === proposal.id ? (
//                         <Check className="h-4 w-4 text-green-600" />
//                       ) : (
//                         <div className="h-4 w-4 rounded border" />
//                       )}
//                     </Button>
//                   </TableCell>
//                   <TableCell className="font-medium">
//                     {proposal.supplier.fullName}
//                   </TableCell>
//                   <TableCell>
//                     {format(new Date(proposal.deliveryDate), "PPP", {
//                       locale: fr,
//                     })}
//                   </TableCell>
//                   <TableCell>
//                     <Badge variant="outline">{proposal.warranty} mois</Badge>
//                   </TableCell>
//                   <TableCell>
//                     <div className="space-y-1">
//                       {proposal.proposalProducts.map((product, idx) => (
//                         <div key={idx} className="text-sm">
//                           {product.quantity}x {product.brand} {product.type} -{" "}
//                           {product.unitPrice.toFixed(2)} DH/unité
//                         </div>
//                       ))}
//                     </div>
//                   </TableCell>
//                   <TableCell className="text-right font-bold">
//                     {calculateTotal(proposal).toFixed(2)} DH
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         )}
//       </CardContent>
//       {localSelectedId && (
//         <div className="p-4 border-t bg-green-50">
//           <div className="flex justify-between items-center">
//             <div>
//               <p className="font-medium">Proposition sélectionnée:</p>
//               <p className="text-sm text-muted-foreground">
//                 {
//                   proposals.find((p) => p.id === localSelectedId)?.supplier
//                     .fullName
//                 }
//               </p>
//             </div>
//             <Badge variant="outline" className="px-3 py-1">
//               Acceptée
//             </Badge>
//           </div>
//         </div>
//       )}
//     </Card>
//   );
// }

import { CallForTender, Proposal, UserRole } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { CheckRole } from "@/lib/CheckRole";
import { useAppSelector } from "@/lib/store";

interface ProposalsListProps {
  tender: CallForTender;
  proposals: Proposal[];
  onSelectProposal?: (
    selectedProposalId: string,
    rejectedProposalIds: string[]
  ) => void;
  selectedProposalId?: string | null;
}

export function ProposalsList({
  tender,
  proposals,
  onSelectProposal,
  selectedProposalId,
}: ProposalsListProps) {
  const { user } = useAppSelector((state) => state.auth);
  const { toast } = useToast();
  const [localSelectedId, setLocalSelectedId] = useState<string | null>(
    selectedProposalId || null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const calculateTotal = (proposal: Proposal) => {
    return proposal.proposalProducts.reduce(
      (sum, product) => sum + product.unitPrice * product.quantity,
      0
    );
  };

  const handleSelectProposal = (proposalId: string) => {
    setLocalSelectedId(proposalId === localSelectedId ? null : proposalId);
  };

  const handleValidateChoice = async () => {
    if (!localSelectedId) {
      toast({
        title: "Aucune sélection",
        description: "Veuillez sélectionner une proposition à accepter",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const rejectedIds = proposals
        .filter((p) => p.id !== localSelectedId)
        .map((p) => p.id);

      if (onSelectProposal) {
        onSelectProposal(localSelectedId, rejectedIds);
      }

      toast({
        title: "Proposition acceptée",
        description: "Les autres propositions ont été automatiquement rejetées",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la validation",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRejectAll = async () => {
    setIsSubmitting(true);

    try {
      if (onSelectProposal) {
        onSelectProposal(
          "",
          proposals.map((p) => p.id)
        );
      }

      setLocalSelectedId(null);
      toast({
        title: "Toutes les propositions rejetées",
        description: "Aucune proposition n'a été acceptée",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du rejet",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  console.log(proposals);

  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">Propositions reçues</CardTitle>
      </CardHeader>
      <CardContent>
        {proposals.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Aucune proposition reçue pour le moment
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sélection</TableHead>
                <TableHead>Fournisseur</TableHead>
                <TableHead>Date livraison</TableHead>
                <TableHead>Garantie</TableHead>
                <TableHead>Produits</TableHead>
                <TableHead className="text-right">Montant total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {proposals.map((proposal) => (
                <TableRow
                  key={proposal.id}
                  className={
                    localSelectedId === proposal.id || proposal.accepted
                      ? "bg-green-50 hover:bg-green-50"
                      : ""
                  }
                >
                  <TableCell>
                    <Button
                      disabled={
                        tender.open === false ||
                        !CheckRole(user?.role!, [UserRole.RESOURCE_MANAGER])
                      }
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleSelectProposal(proposal.id)}
                    >
                      {localSelectedId === proposal.id || proposal.accepted ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <div className="h-4 w-4 rounded border" />
                      )}
                    </Button>
                  </TableCell>
                  <TableCell className="font-medium">
                    {proposal.supplier.fullName}
                  </TableCell>
                  <TableCell>
                    {format(new Date(proposal.deliveryDate), "PPP", {
                      locale: fr,
                    })}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{proposal.warranty} mois</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {proposal.proposalProducts.map((product, idx) => (
                        <div key={idx} className="text-sm">
                          {product.quantity}x {product.brand} {product.type} -{" "}
                          {product.unitPrice.toFixed(2)} DH/unité
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    {calculateTotal(proposal).toFixed(2)} DH
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
      {tender.open && proposals.length > 0 && (
        <div className="p-4 border-t bg-green-50 flex justify-between items-center">
          <div>
            {localSelectedId ? (
              <>
                <p className="font-medium">Proposition sélectionnée:</p>
                <p className="text-sm text-muted-foreground">
                  {
                    proposals.find((p) => p.id === localSelectedId)?.supplier
                      .fullName
                  }
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                Aucune proposition sélectionnée
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleRejectAll}
              disabled={isSubmitting}
            >
              Tout rejeter
            </Button>
            <Button
              onClick={handleValidateChoice}
              disabled={!localSelectedId || isSubmitting}
            >
              {isSubmitting ? "Validation..." : "Valider la sélection"}
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
