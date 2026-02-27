import { type Message } from "@shared/schema";
import { Megaphone, Share2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MessageCard({ message }: { message: Message }) {
  const handleShare = () => {
    if (!message.link) return;
    const text = `${message.content}\n\nConsultez ici: ${message.link}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="glass-card rounded-xl p-4 border-l-4 border-l-accent relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5">
        <Megaphone className="w-24 h-24 rotate-12" />
      </div>
      <div className="flex flex-col gap-3 relative z-10">
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
            <Megaphone className="w-4 h-4 text-accent" />
          </div>
          <div>
            <p className="text-sm text-foreground leading-relaxed font-medium">
              {message.content}
            </p>
          </div>
        </div>

        {message.link && (
          <div className="flex items-center gap-2 mt-1 pt-3 border-t border-border/50">
            <a 
              href={message.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 flex items-center gap-2 py-2 px-3 bg-accent/10 hover:bg-accent/20 text-accent rounded-lg text-xs font-bold transition-colors uppercase tracking-wide"
            >
              <ExternalLink className="w-3 h-3" />
              Ouvrir le lien
            </a>
            <Button
              size="icon"
              variant="outline"
              onClick={handleShare}
              className="h-8 w-8 border-accent/30 text-accent hover:bg-accent hover:text-white"
              title="Partager sur WhatsApp"
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
