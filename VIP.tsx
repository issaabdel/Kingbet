import { useState } from "react";
import { usePredictions } from "@/hooks/use-predictions";
import { PredictionCard } from "@/components/PredictionCard";
import { format, isSameDay, subDays } from "date-fns";
import { fr } from "date-fns/locale";
import { Crown, CheckCircle2, Loader2, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

export default function VIP() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const formattedDate = format(selectedDate, 'yyyy-MM-dd');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  
  const { data: predictions, isLoading } = usePredictions({ 
    date: formattedDate, 
    category: 'vip' 
  });

  // Generate date range (Last 7 days + today)
  const dates = Array.from({ length: 8 }, (_, i) => {
    return subDays(new Date(), 7 - i);
  });

  const handleUnlock = () => {
    // Simulate unlock process
    setIsUnlocked(true);
    setShowPaymentModal(false);
  };

  const isHistory = !isSameDay(selectedDate, new Date());
  const effectiveUnlocked = isUnlocked || isHistory;

  return (
    <div className="pb-24 pt-20 px-4 max-w-md mx-auto min-h-screen">
      {/* VIP Header / Banner */}
      {!isHistory && (
        <div className="mb-8 relative overflow-hidden rounded-2xl glass-card border-accent/20">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Crown className="w-32 h-32 rotate-12 text-accent" />
          </div>
          <div className="p-6 relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-accent/20 p-1.5 rounded-lg">
                <Crown className="w-5 h-5 text-accent" />
              </div>
              <span className="text-accent font-bold tracking-wider text-sm uppercase">Espace VIP</span>
            </div>
            <h1 className="text-2xl text-white font-bold mb-4 leading-tight">
              Accédez aux pronostics <br/>haute confiance
            </h1>
            
            <ul className="space-y-2 mb-6">
              {[
                "Cotes élevées (2.00+)",
                "Taux de réussite > 85%",
                "Analyses détaillées"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-white/80">
                  <CheckCircle2 className="w-4 h-4 text-accent" />
                  {item}
                </li>
              ))}
            </ul>

            {!isUnlocked && (
              <button 
                onClick={() => setShowPaymentModal(true)}
                className="w-full py-3.5 bg-accent text-black font-bold rounded-xl shadow-lg shadow-accent/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                Débloquer pour 1000 FCFA
              </button>
            )}
            
            {isUnlocked && (
              <div className="w-full py-3 bg-green-500/20 border border-green-500/50 text-green-400 font-bold rounded-xl text-center flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Accès VIP Actif
              </div>
            )}
          </div>
        </div>
      )}

      {/* Date Picker for VIP History */}
      <div className="mb-6 overflow-x-auto no-scrollbar -mx-4 px-4 pb-2">
        <div className="flex gap-3 w-max">
          {dates.map((date) => {
            const isSelected = isSameDay(date, selectedDate);
            const isToday = isSameDay(date, new Date());
            return (
              <button
                key={date.toISOString()}
                onClick={() => setSelectedDate(date)}
                className={cn(
                  "flex flex-col items-center justify-center w-14 h-16 rounded-xl border transition-all duration-200 shrink-0",
                  isSelected 
                    ? "bg-accent border-accent text-black shadow-lg shadow-accent/25 translate-y-[-2px]" 
                    : "bg-card/50 border-white/10 text-muted-foreground hover:bg-card hover:text-white"
                )}
              >
                <span className="text-[10px] font-medium uppercase">{format(date, 'EEE', { locale: fr })}</span>
                <span className="text-xl font-bold font-display">{format(date, 'dd')}</span>
                {isToday && <span className="text-[8px] font-bold">AUJ</span>}
              </button>
            );
          })}
        </div>
      </div>

      <h2 className="text-lg text-white font-bold mb-4">
        {isHistory ? `Historique VIP - ${format(selectedDate, 'dd MMMM', { locale: fr })}` : "Pronostics VIP du Jour"}
      </h2>

      {/* Content */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-accent animate-spin" />
          </div>
        ) : predictions && predictions.length > 0 ? (
          predictions.map(p => (
            <PredictionCard 
              key={p.id} 
              prediction={p} 
              isVipLocked={!effectiveUnlocked}
              onUnlock={() => setShowPaymentModal(true)}
            />
          ))
        ) : (
          <div className="glass-card p-8 rounded-2xl text-center border-dashed border-white/10">
            <p className="text-muted-foreground">Aucun pronostic VIP pour cette date.</p>
          </div>
        )}
      </div>

      {/* Payment Simulation Modal */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="bg-card border-white/10 text-white w-[90%] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-center">Paiement VIP</DialogTitle>
            <DialogDescription className="text-center text-muted-foreground">
              Débloquez l'accès aux pronostics VIP du jour.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col gap-4 py-4">
            <div className="bg-secondary/50 p-4 rounded-xl text-center">
              <div className="text-sm text-muted-foreground mb-1">Montant à payer</div>
              <div className="text-2xl font-bold text-accent">1000 FCFA</div>
            </div>
            
            <div className="text-xs text-center text-muted-foreground">
              Méthodes acceptées: Orange Money, MTN Mobile Money
            </div>
          </div>

          <DialogFooter>
            <button 
              onClick={handleUnlock}
              className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors"
            >
              Simuler le Paiement (Demo)
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
