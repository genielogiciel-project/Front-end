import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useCreateSupplier } from "@/hooks/useSupplierApi";
import { Supplier, UserRole } from "@/lib/types";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function Register() {
  const { toast } = useToast();
  const { mutate: createSupplier } = useCreateSupplier();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [fullName, setFullName] = useState("");
  const [userNumber, setUserNumber] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [managerName, setManagerName] = useState("");
  const [address, setAddress] = useState("");
  const [website, setWebsite] = useState("");
  const [blacklisted, setBlacklisted] = useState(false);
  const [blacklistReason, setBlacklistReason] = useState("");

  const resetForm = () => {
    setFullName("");
    setUserNumber("");
    setPassword("");
    setCompanyName("");
    setManagerName("");
    setAddress("");
    setWebsite("");
    setBlacklisted(false);
    setBlacklistReason("");
  };

  const handleCreate = () => {
    //@ts-expect-error
    const supplierData: Omit<Supplier, "id"> = {
      fullName,
      userNumber,
      password,
      role: [UserRole.SUPPLIER],
      companyName,
      managerName,
      address,
      website,
      blacklisted,
      blacklistReason: blacklisted ? blacklistReason : undefined,
    };

    createSupplier(supplierData, {
      onSuccess: () => {
        toast({
          title: "Succès",
          description: "Fournisseur créé avec succès",
        });
        // setIsCreateModalOpen(false);
        resetForm();
      },
      onError: () => {
        toast({
          title: "Erreur",
          description: "Échec de la création du fournisseur",
          variant: "destructive",
        });
      },
    });

    resetForm();
    navigate("/login");
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="sm:max-w-[600px] shadow-2xl p-10">
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Inscription</h1>

          <h4 className="mb-4 text-lg font-semibold">Ajouter un fournisseur</h4>
          <p className="text-sm text-muted-foreground">
            Remplissez les informations du nouveau fournisseur
          </p>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="fullName" className="text-right">
                Nom complet*
              </label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nom complet"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="userNumber" className="text-right">
                Numéro utilisateur*
              </label>
              <Input
                id="userNumber"
                value={userNumber}
                onChange={(e) => setUserNumber(e.target.value)}
                placeholder="Numéro utilisateur"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4 relative">
              <label htmlFor="password" className="text-right">
                Mot de passe*
              </label>
              <Input
                id="password"
                value={password}
                type={showPassword ? "text" : "password"}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mot de passe"
                className="col-span-3"
              />
              {showPassword ? (
                <EyeOff
                  onClick={() => setShowPassword(false)}
                  className="cursor-pointer size-4 absolute right-3 text-muted-foreground"
                />
              ) : (
                <Eye
                  onClick={() => setShowPassword(true)}
                  className="cursor-pointer size-4 absolute right-3 text-muted-foreground"
                />
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="companyName" className="text-right">
                Nom de l'entreprise*
              </label>
              <Input
                id="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Nom de l'entreprise"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="managerName" className="text-right">
                Responsable*
              </label>
              <Input
                id="managerName"
                value={managerName}
                onChange={(e) => setManagerName(e.target.value)}
                placeholder="Nom du responsable"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="address" className="text-right">
                Adresse*
              </label>
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Adresse complète"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="website" className="text-right">
                Site web
              </label>
              <Input
                id="website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://example.com"
                className="col-span-3"
              />
            </div>
          </div>
          <Button onClick={handleCreate}>Créer</Button>
        </div>
      </div>
    </div>
  );
}
