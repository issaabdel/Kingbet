import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreatePrediction, usePredictions, useDeletePrediction, useUpdatePrediction } from "@/hooks/use-predictions";
import { useCreateMessage, useMessages, useDeleteMessage } from "@/hooks/use-messages";
import { insertPredictionSchema, insertMessageSchema, type Prediction } from "@shared/schema";
import { LogOut, Plus, Trash2, Check, X, Clock, Megaphone } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("predictions");
  
  useEffect(() => {
    const session = localStorage.getItem("admin_session");
    if (!session) {
      setLocation("/admin-login");
    }
  }, [setLocation]);

  const handleLogout = async () => {
    await apiRequest("POST", "/api/admin/logout");
    localStorage.removeItem("admin_session");
    setLocation("/admin-login");
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Admin Header */}
      <header className="bg-card border-b border-white/10 p-4 sticky top-0 z-20">
        <div className="flex justify-between items-center max-w-4xl mx-auto">
          <h1 className="text-xl font-bold text-white">Dashboard Admin</h1>
          <button 
            onClick={handleLogout}
            className="p-2 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-card/50">
            <TabsTrigger value="predictions">Pronostics</TabsTrigger>
            <TabsTrigger value="messages">Annonces</TabsTrigger>
          </TabsList>
          
          <TabsContent value="predictions">
            <PredictionsManager />
          </TabsContent>
          
          <TabsContent value="messages">
            <MessagesManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function PredictionsManager() {
  const [open, setOpen] = useState(false);
  const createMutation = useCreatePrediction();
  const deleteMutation = useDeletePrediction();
  const updateMutation = useUpdatePrediction();
  const { data: predictions } = usePredictions();

  const form = useForm({
    resolver: zodResolver(insertPredictionSchema),
    defaultValues: {
      matchName: "",
      matchTime: "20:00",
      betType: "V1",
      odds: "1.50",
      confidence: "90%",
      category: "free",
      status: "pending",
      date: format(new Date(), 'yyyy-MM-dd'),
      isLocked: false
    }
  });

  const onSubmit = (data: any) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        setOpen(false);
        form.reset();
        queryClient.invalidateQueries({ queryKey: ["/api/predictions"] });
      }
    });
  };

  const setStatus = (id: number, status: string, score?: string) => {
    updateMutation.mutate({ id, status, score }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/predictions"] });
      }
    });
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/predictions"] });
      }
    });
  };

  return (
    <div className="space-y-6">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="w-full bg-primary hover:bg-primary/90 text-white gap-2">
            <Plus className="w-4 h-4" /> Ajouter un Pronostic
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-card border-white/10 text-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nouveau Pronostic</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
              <FormField
                control={form.control}
                name="matchName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Match</FormLabel>
                    <FormControl>
                      <Input placeholder="Real Madrid vs Barcelona" {...field} className="bg-black/20" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="matchTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Heure</FormLabel>
                      <FormControl>
                        <Input placeholder="20:00" {...field} className="bg-black/20" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date (YYYY-MM-DD)</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} className="bg-black/20" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="betType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pari</FormLabel>
                      <FormControl>
                        <Input placeholder="V1" {...field} className="bg-black/20" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="odds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cote</FormLabel>
                      <FormControl>
                        <Input placeholder="1.50" {...field} className="bg-black/20" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="confidence"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confiance</FormLabel>
                      <FormControl>
                        <Input placeholder="90%" {...field} className="bg-black/20" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Catégorie</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-black/20">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="free">Gratuit</SelectItem>
                          <SelectItem value="vip">VIP</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" className="w-full bg-primary" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Création..." : "Créer"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <div className="space-y-4">
        {predictions?.slice().reverse().map((p: Prediction) => (
          <div key={p.id} className="glass-card p-4 rounded-xl flex flex-col gap-3">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-sm font-bold text-white">{p.matchName}</div>
                <div className="text-xs text-muted-foreground">{p.date} • {p.matchTime} • {p.category.toUpperCase()}</div>
              </div>
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={() => handleDelete(p.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex flex-col gap-3 border-t border-white/5 pt-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground font-medium">Score final:</span>
                <Input 
                  placeholder="Ex: 2-1" 
                  defaultValue={p.score || ""} 
                  className="h-8 w-20 text-xs bg-black/20"
                  onBlur={(e) => setStatus(p.id, p.status, e.target.value)}
                />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-muted-foreground mr-auto font-medium">Résultat:</span>
                <Button 
                  size="sm"
                  variant={p.status === 'pending' ? 'default' : 'outline'}
                  onClick={() => {
                    if (confirm("Marquer comme 'En attente' ?")) {
                      setStatus(p.id, "pending", p.score || undefined);
                    }
                  }}
                  className="h-8 text-[10px] px-2"
                >
                  En attente
                </Button>
                <Button 
                  size="sm"
                  variant={p.status === 'won' ? 'default' : 'outline'}
                  className={cn(
                    "h-8 text-[10px] px-2",
                    p.status === 'won' ? "bg-green-600 hover:bg-green-700 border-green-600" : "text-green-500 border-green-500/30 hover:bg-green-500/10"
                  )}
                  onClick={() => {
                    if (confirm("Marquer comme 'Gagné' ?")) {
                      setStatus(p.id, "won", p.score || undefined);
                    }
                  }}
                >
                  Gagné
                </Button>
                <Button 
                  size="sm"
                  variant={p.status === 'lost' ? 'default' : 'outline'}
                  className={cn(
                    "h-8 text-[10px] px-2",
                    p.status === 'lost' ? "bg-red-600 hover:bg-red-700 border-red-600" : "text-red-500 border-red-500/30 hover:bg-red-500/10"
                  )}
                  onClick={() => {
                    if (confirm("Marquer comme 'Perdu' ?")) {
                      setStatus(p.id, "lost", p.score || undefined);
                    }
                  }}
                >
                  Perdu
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MessagesManager() {
  const createMutation = useCreateMessage();
  const deleteMutation = useDeleteMessage();
  const { data: messages } = useMessages();

  const form = useForm({
    resolver: zodResolver(insertMessageSchema),
    defaultValues: {
      content: "",
      link: ""
    }
  });

  const onSubmit = (data: any) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        form.reset();
        queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
      }
    });
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="glass-card p-6 rounded-xl">
        <h3 className="font-bold text-white mb-4">Nouvelle Annonce</h3>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Message..." {...field} className="bg-black/20" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Lien optionnel (https://...)" {...field} className="bg-black/20" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-accent text-black font-bold" disabled={createMutation.isPending}>
              {createMutation.isPending ? "Publication..." : "Publier"}
            </Button>
          </form>
        </Form>
      </div>

      <div className="space-y-3">
        {messages?.map(msg => (
          <div key={msg.id} className="glass-card p-4 rounded-xl flex justify-between items-center gap-4">
            <div className="flex gap-3 items-center overflow-hidden">
              <Megaphone className="w-4 h-4 text-accent shrink-0" />
              <div className="truncate text-sm text-white/90">{msg.content}</div>
            </div>
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive shrink-0"
              onClick={() => handleDelete(msg.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
