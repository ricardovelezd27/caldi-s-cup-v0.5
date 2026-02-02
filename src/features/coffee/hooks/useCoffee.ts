import { useQuery } from "@tanstack/react-query";
import { getCoffeeById } from "../services/coffeeService";

/**
 * Hook to fetch a single coffee from the master catalog by ID.
 */
export function useCoffee(coffeeId: string | undefined) {
  return useQuery({
    queryKey: ["coffee", coffeeId],
    queryFn: async () => {
      if (!coffeeId) return null;
      return getCoffeeById(coffeeId);
    },
    enabled: !!coffeeId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
