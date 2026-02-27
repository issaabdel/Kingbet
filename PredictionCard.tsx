import { type Prediction } from "@shared/schema";
import { cn } from "@/lib/utils";
import { Check, X, Clock, Lock, Trophy } from "lucide-react";
import { motion } from "framer-motion";

interface PredictionCardProps {
  prediction: Prediction;
  isVipLocked?: boolean;
  onUnlock?: () => void;
}

export function PredictionCard({ prediction, isVipLocked = false, onUnlock }: PredictionCardProps) {
  const isWon = prediction.status === "won";
  const isLost = prediction.status === "lost";
  const isPending = prediction.status === "pending";

  if (isVipLocked) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-6 relative overflow-hidden group cursor-pointer"
        onClick={onUnlock}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center text-center p-6 gap-4">
          <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mb-2">
            <Lock className="w-6 h-6 text-accent gold-text" />
          </div>
          <div>
            <h3 className="text-lg text-white mb-1">VIP PRONOSTIC</h3>
            <p className="text-sm text-muted-foreground">Débloquez pour voir ce match</p>
          </div>
          <button className="px-6 py-2 bg-accent text-black font-bold rounded-full text-sm hover:scale-105 transition-transform">
            Débloquer
          </button>
        </div>
        {/* Blurred Content Background */}
        <div className="opacity-30 blur-sm pointer-events-none">
          <div className="flex justify-between items-start mb-4">
            <div className="text-sm text-primary font-mono">{prediction.matchTime}</div>
          </div>
          <h3 className="text-lg font-bold text-white mb-4">{prediction.matchName}</h3>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="glass-card rounded-2xl p-5 relative overflow-hidden border-l-4 border-l-primary bg-card/95"
    >
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2 text-xs font-mono text-primary-foreground/70 bg-primary/10 px-2 py-1 rounded-md">
          <Clock className="w-3 h-3" />
          {prediction.matchTime}
        </div>
        
        {prediction.category === 'vip' && (
          <div className="flex items-center gap-1 text-xs font-bold text-accent bg-accent/10 px-2 py-1 rounded-md border border-accent/20">
            <Trophy className="w-3 h-3" />
            VIP
          </div>
        )}
      </div>

      <h3 className="text-lg font-bold text-foreground mb-4 leading-tight">
        {prediction.matchName}
      </h3>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-secondary/50 rounded-lg p-2 border border-border/50">
          <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Pronostic</div>
          <div className="font-bold text-primary text-sm">{prediction.betType}</div>
        </div>
        <div className="bg-secondary/50 rounded-lg p-2 border border-border/50">
          <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Cote</div>
          <div className="font-bold text-accent text-sm">{prediction.odds}</div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-border/50 pt-3 mt-1">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="text-xs text-muted-foreground">Confiance</div>
            <div className="text-xs font-bold text-foreground">{prediction.confidence}</div>
          </div>
          {prediction.score && (
            <div className="text-xs font-bold text-primary">Score: {prediction.score}</div>
          )}
        </div>

        {isWon && (
          <div className="flex items-center gap-1.5 text-green-400 text-xs font-bold bg-green-400/10 px-2 py-1 rounded-full">
            <Check className="w-3 h-3" /> GAGNÉ
          </div>
        )}
        {isLost && (
          <div className="flex items-center gap-1.5 text-red-400 text-xs font-bold bg-red-400/10 px-2 py-1 rounded-full">
            <X className="w-3 h-3" /> PERDU
          </div>
        )}
        {isPending && (
          <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-bold bg-white/5 px-2 py-1 rounded-full">
            <Clock className="w-3 h-3" /> EN ATTENTE
          </div>
        )}
      </div>
    </motion.div>
  );
}
