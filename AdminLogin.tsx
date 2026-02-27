import { useState } from "react";
import { useLocation } from "wouter";
import { Lock, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { api } from "@shared/routes";
import { apiRequest } from "@/lib/queryClient";

export default function AdminLogin() {
  const [pin, setPin] = useState("");
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest("POST", api.admin.login.path, { pin });
      localStorage.setItem("admin_session", "true");
      setLocation("/admin-dashboard");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Accès refusé",
        description: "Code PIN incorrect ou erreur serveur.",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 max-w-md mx-auto relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-[-1]">
         <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-primary/20 rounded-full blur-[80px]" />
         <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-accent/10 rounded-full blur-[80px]" />
      </div>

      <div className="glass-card w-full p-8 rounded-3xl border border-white/10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-4 border border-white/10">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-white text-center">Accès Administrateur</h1>
          <p className="text-muted-foreground text-center mt-2 text-sm">Veuillez entrer le code de sécurité</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Code PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="bg-black/30 border-white/10 text-center text-2xl tracking-[0.5em] h-14 rounded-xl focus:border-primary/50 focus:ring-primary/20"
              maxLength={8}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white font-bold h-12 rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2 group"
          >
            Accéder
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
      </div>
    </div>
  );
}
