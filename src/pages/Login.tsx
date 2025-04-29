import { useEffect } from "react";
import LoginForm from "@/features/auth/LoginForm";
import { gsap } from "gsap";

export default function Login() {
  useEffect(() => {
    gsap.set([".intro-title", ".intro-text"], {
      y: -50,
      opacity: 0,
    });
    gsap
      .timeline()
      .to(".intro-title", {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power3.out",
      })
      .from(
        ".intro-text",
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
        },
        "-=0.4"
      );
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-4 intro-title">
          Gestion des Ressources Matérielles
        </h1>
        <p className="text-lg text-muted-foreground max-w-md mx-auto intro-text">
          Plateforme de gestion des ressources pour la faculté
        </p>
      </div>

      <LoginForm />
    </div>
  );
}
