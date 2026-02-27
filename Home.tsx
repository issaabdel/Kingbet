import { Link } from "wouter";
import { useMessages } from "@/hooks/use-messages";
import { usePredictions } from "@/hooks/use-predictions";
import { MessageCard } from "@/components/MessageCard";
import { PredictionCard } from "@/components/PredictionCard";
import { ArrowRight, Trophy, Crown, Sparkles } from "lucide-react";
import { format } from "date-fns";

export default function Home() {
  const { data: messages } = useMessages();
  const today = format(new Date(), 'yyyy-MM-dd');
  const { data: todaysFreeTips } = usePredictions({ date: today, category: 'free' });

  // Get only top 2 highlights
  const highlights = todaysFreeTips?.slice(0, 2) || [];

  return (
    <div className="pb-24 pt-20 px-4 max-w-md mx-auto min-h-screen">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl text-white mb-2 leading-tight">
          Gagnez gros <br/>
          avec <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-violet-400">KingBet</span>
        </h1>
        <p className="text-muted-foreground text-sm">
          Les meilleures pronostics sportifs quotidiens pour maximiser vos gains.
        </p>
      </div>

      {/* Announcements */}
      {messages && messages.length > 0 && (
        <div className="mb-8 space-y-6">
          <h2 className="text-sm text-muted-foreground tracking-widest uppercase font-semibold">Annonces</h2>
          {messages.map(msg => (
            <MessageCard key={msg.id} message={msg} />
          ))}
        </div>
      )}

      {/* Main Actions */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <Link href="/free">
          <div className="glass-card p-4 rounded-2xl flex flex-col items-center justify-center gap-3 text-center hover:bg-primary/5 transition-colors cursor-pointer group border border-primary/20 hover:border-primary/50">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Trophy className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Gratuit</h3>
              <p className="text-xs text-muted-foreground mt-1">Pronostics du jour</p>
            </div>
          </div>
        </Link>
        
        <Link href="/vip">
          <div className="glass-card p-4 rounded-2xl flex flex-col items-center justify-center gap-3 text-center hover:bg-accent/5 transition-colors cursor-pointer group border border-accent/20 hover:border-accent/50">
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Crown className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">VIP</h3>
              <p className="text-xs text-muted-foreground mt-1">Haute confiance</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Today's Highlights */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg text-white font-bold flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-accent" />
            À l'affiche
          </h2>
          <Link href="/free">
            <span className="text-xs text-primary font-medium cursor-pointer flex items-center gap-1">
              Tout voir <ArrowRight className="w-3 h-3" />
            </span>
          </Link>
        </div>
        
        <div className="space-y-4">
          {highlights.length > 0 ? (
            highlights.map(p => (
              <PredictionCard key={p.id} prediction={p} />
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground text-sm glass-card rounded-xl border-dashed">
              Les pronostics du jour arrivent bientôt...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
