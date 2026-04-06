import { useMutation, useQuery } from "@tanstack/react-query";
import type { MealPlan, Recipe } from "../backend";
import { useActor } from "./useActor";

export function useAllMealPlans() {
  const { actor, isFetching } = useActor();
  return useQuery<MealPlan[]>({
    queryKey: ["mealPlans"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllMealPlans();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllRecipes() {
  const { actor, isFetching } = useActor();
  return useQuery<Recipe[]>({
    queryKey: ["recipes"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllRecipes();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useChatbot() {
  const { actor } = useActor();
  return useMutation<string, Error, string>({
    mutationFn: async (message: string) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.chatbot(message);
    },
  });
}
