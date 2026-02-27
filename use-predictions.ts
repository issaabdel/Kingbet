import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type CreatePredictionRequest, type UpdatePredictionRequest } from "@shared/routes";
import { z } from "zod";

export function usePredictions(filters?: { date?: string; category?: 'free' | 'vip' }) {
  const queryKey = [api.predictions.list.path, filters?.date, filters?.category].filter(Boolean);
  
  return useQuery({
    queryKey,
    queryFn: async () => {
      const url = filters 
        ? `${api.predictions.list.path}?${new URLSearchParams(filters as Record<string, string>)}` 
        : api.predictions.list.path;
      
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch predictions");
      return api.predictions.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreatePrediction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreatePredictionRequest) => {
      const res = await fetch(api.predictions.create.path, {
        method: api.predictions.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create prediction");
      return api.predictions.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.predictions.list.path] });
    },
  });
}

export function useUpdatePrediction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: number } & UpdatePredictionRequest) => {
      const url = buildUrl(api.predictions.update.path, { id });
      const res = await fetch(url, {
        method: api.predictions.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update prediction");
      return api.predictions.update.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.predictions.list.path] });
    },
  });
}

export function useDeletePrediction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.predictions.delete.path, { id });
      const res = await fetch(url, {
        method: api.predictions.delete.method,
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete prediction");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.predictions.list.path] });
    },
  });
}
