import { useState } from "react";
import { usePredictions } from "@/hooks/use-predictions";
import { PredictionCard } from "@/components/PredictionCard";
import { format, addDays, subDays, isSameDay } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { CalendarDays, Loader2 } from "lucide-react";

export default function FreeTips() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const formattedDate = format(selectedDate, 'yyyy-MM-dd');
  
  const { data: predictions, isLoading } = usePredictions({ 
    date: formattedDate, 
    category: 'free' 
  });

  // Generate date range for picker (last 7 days + today)
  const dates = Array.from({ length: 8 }, (_, i) => {
    return subDays(new Date(), 7 - i);
  });

  return (
    <div className="pb-24 pt-20 px-4 max-w-md mx-auto min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl text-white font-bold mb-1">Pronostics Gratuits</h1>
        <p className="text-muted-foreground text-sm">Sélection quotidienne de nos experts</p>
      </div>

      {/* Date Picker */}
      <div className="mb-8 overflow-x-auto no-scrollbar -mx-4 px-4 pb-2">
        <div className="flex gap-3 w-max">
          {dates.map((date) => {
            const isSelected = isSameDay(date, selectedDate);
            return (
              <button
                key={date.toISOString()}
                onClick={() => setSelectedDate(date)}
                className={cn(
                  "flex flex-col items-center justify-center w-14 h-16 rounded-xl border transition-all duration-200 shrink-0",
                  isSelected 
                    ? "bg-primary border-primary text-white shadow-lg shadow-primary/25 translate-y-[-2px]" 
                    : "bg-card/50 border-white/10 text-muted-foreground hover:bg-card hover:text-white"
                )}
              >
                <span className="text-[10px] font-medium uppercase">{format(date, 'EEE', { locale: fr })}</span>
                <span className="text-xl font-bold font-display">{format(date, 'dd')}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : predictions && predictions.length > 0 ? (
          predictions.map(p => (
            <PredictionCard key={p.id} prediction={p} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center opacity-50">
            <CalendarDays className="w-12 h-12 mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Aucun pronostic disponible pour cette date.</p>
          </div>
        )}
      </div>
    </div>
  );
}
