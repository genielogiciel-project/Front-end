import { useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Proposal, ProposalProduct } from "@/lib/types";
import { Pencil } from "lucide-react";

interface ProposalCardProps {
  proposal: Proposal;
  onSubmit?: (updatedProposal: Proposal) => void;
}

export function ProposalCard({ proposal, onSubmit }: ProposalCardProps) {
  const [open, setOpen] = useState(false);
  const [products, setProducts] = useState<ProposalProduct[]>(
    proposal.proposalProducts
  );

  const handlePriceChange = (index: number, newPrice: number) => {
    const updated = [...products];
    updated[index].unitPrice = newPrice;
    setProducts(updated);
  };

  const computeTotal = () =>
    products.reduce((sum, p) => sum + p.unitPrice * p.quantity, 0);

  const handleSubmit = () => {
    if (onSubmit) {
      const updatedProposal = {
        ...proposal,
        proposalProducts: products,
        totalPrice: computeTotal(),
      };
      onSubmit(updatedProposal);
    }
    setOpen(false);
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <div>
          <CardTitle className="text-lg">{proposal.callForTender.title}</CardTitle>
          <p className="text-sm text-muted-foreground">
            Fournisseur : {proposal.supplier.fullName}
          </p>
        </div>
        <Pencil className="w-4 h-4 text-muted-foreground" />
      </CardHeader>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {/* Hidden trigger, we handle open manually */}
          <div />
        </DialogTrigger>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Détails de la proposition</DialogTitle>
          </DialogHeader>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Type</th>
                  <th className="text-left p-2">Marque</th>
                  <th className="text-left p-2">Quantité</th>
                  <th className="text-left p-2">Prix Unitaire</th>
                  <th className="text-left p-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p, index) => (
                  <tr key={p.id} className="border-b">
                    <td className="p-2">{p.type}</td>
                    <td className="p-2">{p.brand}</td>
                    <td className="p-2">{p.quantity}</td>
                    <td className="p-2">
                      <Input
                        type="number"
                        value={p.unitPrice}
                        min={0}
                        onChange={(e) =>
                          handlePriceChange(index, parseFloat(e.target.value))
                        }
                        className="w-24"
                      />
                    </td>
                    <td className="p-2">
                      {(p.unitPrice * p.quantity).toFixed(2)} MAD
                    </td>
                  </tr>
                ))}
                <tr className="font-bold">
                  <td colSpan={4} className="p-2 text-right">
                    Total:
                  </td>
                  <td className="p-2">{computeTotal().toFixed(2)} MAD</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-4 text-right">
            <Button onClick={handleSubmit}>Ajouter la proposition</Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
