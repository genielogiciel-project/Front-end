import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Clock,
  Ban,
  Edit,
  Plus,
  MoreVertical,
  Trash2,
  List,
} from "lucide-react";
import {
  CallForTender,
  Proposal,
  ProposalProduct,
  UserRole,
} from "@/lib/types";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckRole } from "@/lib/CheckRole";
import { useAppSelector } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import { ProposalsList } from "../proposal/ProposalList";
import { useAcceptRefuseProposals } from "@/hooks/useProposalApi";

interface TenderCardProps {
  tender: CallForTender;
  onEdit?: (tender: CallForTender) => void;
  onSubmitProposal?: (proposal: Omit<Proposal, "id">) => void;
  onDelete?: (tenderId: string) => void;
  onCloseTender?: (tenderId: string) => void;
  onShowProposals?: (tenderId: string) => void;
  userRole?: UserRole[];
}

export function TenderCard({
  tender,
  onEdit,
  onSubmitProposal,
  onDelete,
  onCloseTender,
  onShowProposals,
  userRole,
}: TenderCardProps) {
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

  const [showProposals, setShowProposals] = useState(false);
  const [selectedProposalId, setSelectedProposalId] = useState<string | null>(
    null
  );
  const status = getStatus();
  const { toast } = useToast();
  const { user } = useAppSelector((state) => state.auth);
  const isSupplier = userRole?.includes(UserRole.SUPPLIER);
  const [openProposalDialog, setOpenProposalDialog] = useState(false);
  const [warranty, setWarranty] = useState(0);
  const [deliveryDate, setDeliveryDate] = useState(new Date());
  const [proposalProducts, setProposalProducts] = useState<ProposalProduct[]>(
    // @ts-expect-error
    tender.requestedProducts.map((product) => ({
      type: product.type,
      brand: product.brand,
      quantity: product.quantity,
      unitPrice: 0,
    }))
  );

  let canAddProposal = true;
  for (const proposal of tender.proposals) {
    if (proposal.supplier.id === user?.id) {
      canAddProposal = false;
      break;
    }
  }

  const { mutate: acceptRefuseProposals } = useAcceptRefuseProposals();
  const handleSelectProposal = (selectedId: string, rejectedIds: string[]) => {
    const resManagerId = user?.id!;
    console.log("Selected:", selectedId);
    console.log("Rejected:", rejectedIds);

    setSelectedProposalId(selectedId);

    acceptRefuseProposals({ resManagerId, selectedId, rejectedIds });

    handleCloseShowProposals();
  };

  const handleCloseShowProposals = () => {
    setShowProposals(false);
  };

  const handleShowProposals = () => {
    setShowProposals(true);
  };

  const handlePriceChange = (index: number, value: number) => {
    const updatedProducts = [...proposalProducts];
    updatedProducts[index].unitPrice = value;
    setProposalProducts(updatedProducts);
  };

  const handleSubmitProposal = () => {
    if (!onSubmitProposal) return;

    const totalPrice = proposalProducts.reduce(
      (sum, product) => sum + product.unitPrice * product.quantity,
      0
    );

    let isPriceValid = true;
    proposalProducts.forEach((product) => {
      if (product.unitPrice <= 0) {
        isPriceValid = false;
      }
    });
    if (warranty <= 0) {
      isPriceValid = false;
    }

    if (!isPriceValid) {
      toast({
        title: "Error",
        description: "Please enter a valid price and warranty",
        variant: "destructive",
      });
      return;
    }

    const proposal: Omit<Proposal, "id"> = {
      deliveryDate,
      proposalProducts,
      totalPrice,
      tender,
      warranty,
      // @ts-expect-error
      supplier: {
        id: user?.id!,
      },
      callForTender: {
        id: tender.id,
      },
    };

    // console.log(proposal);

    onSubmitProposal(proposal);
    setOpenProposalDialog(false);
  };

  return (
    <>
      <Dialog open={showProposals} onOpenChange={setShowProposals}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Propositions pour {tender.title}</DialogTitle>
          </DialogHeader>
          <ProposalsList
            tender={tender}
            proposals={tender.proposals || []}
            onSelectProposal={handleSelectProposal}
            selectedProposalId={selectedProposalId}
          />
        </DialogContent>
      </Dialog>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div className="flex items-start gap-2">
              {status === "OPEN" ? (
                <Clock className="h-10 w-10 text-blue-500" />
              ) : (
                <Ban className="h-10 w-10 text-red-500" />
              )}
              <div>
                <CardTitle className="text-xl">{tender.title}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Référence: {tender.id}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <div
                className={`px-3 py-1 rounded-full text-sm text-nowrap ${
                  status === "OPEN"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {status === "OPEN" ? "EN COURS" : "CLÔTURÉ"}
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {onEdit &&
                    CheckRole(userRole!, [UserRole.RESOURCE_MANAGER]) && (
                      <DropdownMenuItem onClick={() => onEdit(tender)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Modifier
                      </DropdownMenuItem>
                    )}

                  {CheckRole(userRole!, [UserRole.RESOURCE_MANAGER]) && (
                    <>
                      <DropdownMenuItem
                        onClick={() => onCloseTender?.(tender.id)}
                      >
                        {status === "OPEN" ? (
                          <Ban className="mr-2 h-4 w-4" />
                        ) : (
                          <Clock className="mr-2 h-4 w-4" />
                        )}
                        {status === "OPEN" ? "Clôturer" : "Rouvrir"}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete?.(tender.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Supprimer
                      </DropdownMenuItem>
                    </>
                  )}

                  {isSupplier && status === "OPEN" && canAddProposal && (
                    <DropdownMenuItem
                      onClick={() => setOpenProposalDialog(true)}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Soumettre une proposition
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    // onClick={() => onShowProposals?.(tender.id)}
                    onClick={handleShowProposals}
                  >
                    <List className="mr-2 h-4 w-4" />
                    Voir les propositions
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {isSupplier && status === "OPEN" && (
                <Dialog
                  open={openProposalDialog}
                  onOpenChange={setOpenProposalDialog}
                >
                  {/* <DialogTrigger asChild>
                    <button className="p-1 text-muted-foreground hover:text-green-600">
                      <Plus className="h-4 w-4" />
                    </button>
                  </DialogTrigger> */}
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Soumettre une proposition</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-5">
                        <Label htmlFor="warranty">Garantie (mois)</Label>
                        <Input
                          min={0}
                          id="warranty"
                          type="number"
                          value={warranty}
                          onChange={(e) =>
                            setWarranty(parseInt(e.target.value))
                          }
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-5">
                        <Label htmlFor="deliveryDate">Date de livraison</Label>
                        <Input
                          id="deliveryDate"
                          type="date"
                          value={deliveryDate.toISOString().split("T")[0]}
                          onChange={(e) =>
                            setDeliveryDate(new Date(e.target.value))
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      {proposalProducts.map((product, index) => (
                        <div key={index} className="border rounded p-4">
                          <div className="font-medium mb-2">
                            {product.quantity}x {product.type} ({product.brand})
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor={`unitPrice-${index}`}>
                                Prix unitaire (MAD)
                              </Label>
                              <Input
                                min={0}
                                id={`unitPrice-${index}`}
                                type="number"
                                value={product.unitPrice}
                                onChange={(e) =>
                                  handlePriceChange(
                                    index,
                                    parseFloat(e.target.value)
                                  )
                                }
                              />
                            </div>
                            <div>
                              <Label>Prix total</Label>
                              <Input
                                type="number"
                                value={(
                                  product.unitPrice * product.quantity
                                ).toFixed(2)}
                                readOnly
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                      <div className="flex justify-between items-center pt-4">
                        <div className="font-bold">
                          Total:{" "}
                          {proposalProducts
                            .reduce(
                              (sum, product) =>
                                sum + product.unitPrice * product.quantity,
                              0
                            )
                            .toFixed(2)}{" "}
                          DH
                        </div>
                        <Button onClick={handleSubmitProposal}>
                          Soumettre
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
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
    </>
  );
}
