import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/lib/store";
import { login } from "./authSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { gsap } from "gsap";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Check, X } from "lucide-react";
import { useAuth } from "@/auth/useAuth";

export default function LoginForm() {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const { error } = useAuth(false);
  const navigate = useNavigate();
  const [userNumber, setUserNumber] = useState("supplier2");
  const [password, setPassword] = useState("0");

  useEffect(() => {
    gsap.set(".form", {
      y: 20,
      opacity: 0,
    });
    gsap.to(".form", {
      y: 0,
      opacity: 1,
      duration: 0.6,
      ease: "power3.out",
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { payload }: any = await dispatch(login({ userNumber, password }));

      if (typeof payload === "string" && payload) {
        toast({
          title: (
            <div className="flex flex-row items-center gap-2">
              <X className="text-red-500" />
              <span>Connexion echouee</span>
            </div>
          ) as any,
          description: (
            <span className="text-red-500">
              {/* Votre user number ou mot de passe est incorrect */}
              {payload}
            </span>
          ),
        });
        return;
      }

      toast({
        title: (
          <div className="flex flex-row items-center gap-2">
            <Check className="text-green-500" />
            <span>Connexion</span>
          </div>
        ) as any,
        description: "Connexion reussie",
      });
      navigate("/dashboard");
    } catch (_) {
      toast({
        title: (
          <div className="flex flex-row items-center gap-2">
            <X className="text-red-500" />
            <span>Connexion echouee</span>
          </div>
        ) as any,
        description: (
          <span className="text-red-500">
            {/* Votre user number ou mot de passe est incorrect */}
            {error}
          </span>
        ),
      });
    }
  };

  return (
    <div className="form max-w-md w-full mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Connexion</CardTitle>
          <CardDescription>
            Connectez-vous pour accéder à la gestion des ressources
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2 flex flex-col gap-1">
              <Label htmlFor="userNumber">User number</Label>
              <Input
                id="userNumber"
                type="text"
                value={userNumber}
                onChange={(e) => setUserNumber(e.target.value)}
                placeholder="votreemail@example.com"
                required
              />
            </div>
            <div className="space-y-2 flex flex-col gap-1">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Se connecter
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Système de gestion des ressources matérielles de la Faculté - 2025
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
