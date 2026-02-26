import { useQuery } from "@tanstack/react-query";
import { getAdminTracks } from "../services/adminLearningService";

export function useAdminTracks() {
  return useQuery({
    queryKey: ["admin", "tracks"],
    queryFn: getAdminTracks,
  });
}
