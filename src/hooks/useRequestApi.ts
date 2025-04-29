import { useAPI } from "@/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetAllRequests = () => {
  const api = useAPI();

  return useQuery({
    queryKey: ["requests"],
    queryFn: async () => {
      try {
        const { data } = await api("/resource-request");
        return data;
      } catch (error) {
        console.error("Error fetching requests:", error);
        throw error; // Rethrow the error to trigger the error state in the query
      }
    },                                                                                         
  });
};
