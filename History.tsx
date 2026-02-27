import { useState } from "react";
import { usePredictions } from "@/hooks/use-predictions";
import { PredictionCard } from "@/components/PredictionCard";
import { format, subDays } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarDays, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function History() {
  const [selectedDate, setSelectedDate] = useState(subDays(new Date(), 1));
  const formattedDate = format(selectedDate, 'yyyy-MM-dd');
  
  // In history, we fetch both free and vip, and everything is unlocked
  const { data: freeTips, isLoading: isLoadingFree } = usePredictions({ 
    date: formattedDate, 
    category: 'free' 
  });
  
  const { data: vipTips, isLoading: isLoadingVip } = usePredictions({ 
    date: formattedDate, 
    category: 'vip' 
  });

  const isLoading = isLoadingFree || isLoadingVip;
  const allTips = [...(vipTips || []), ...(freeTips || [])];

  // Last 10 days for history
  const historyDates = Array.from({ length: 10 }, (_, i) => {
    return subDays(new Date(), i + 1); // Start from yesterday
  });

  return (
    <div className="pb-24 pt-20 px-4 max-w-md mx-auto min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl text-white font-bold mb-1">Historique</h1>
        <p className="text-muted-foreground text-sm">Consultez les résultats passés</p>
      </div>

      <div className="flex gap-6">
        {/* Vertical Date List */}
        <div className="w-20 shrink-0 space-y-3 pb-24 h-[calc(100vh-200px)] overflow-y-auto no-scrollbar">
          {historyDates.map((date) => {
            const isSelected = selectedDate.getTime() === date.getTime();
            return (
              <button
                key={date.toISOString()}
                onClick={() => setSelectedDate(date)}
                className={cn(
                  "flex flex-col items-center justify-center w-full aspect-square rounded-xl border transition-all duration-200",
                  isSelected 
                    ? "bg-white/10 border-primary text-white shadow-lg shadow-primary/10 scale-105" 
                    : "bg-card/30 border-white/5 text-muted-foreground hover:bg-card/50"
                )}
              >
                <span className="text-[10px] font-medium uppercase">{format(date, 'MMM', { locale: fr })}</span>
                <span className="text-xl font-bold font-display">{format(date, 'dd')}</span>
              </button>
            );
          })}
        </div>

        {/* Results List */}
        <div className="flex-1 space-y-4 pb-24">
           {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : allTips.length > 0 ? (
            allTips.map(p => (
              <PredictionCard key={p.id} prediction={p} />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center opacity-50 glass-card rounded-2xl border-dashed">
              <CalendarDays className="w-10 h-10 mb-3 text-muted-foreground" />
              <p className="text-muted-foreground text-sm">Pas de données pour cette date.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
