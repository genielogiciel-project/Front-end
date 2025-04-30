import { useAPI } from "@/api";
import { CallForTender } from "@/lib/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetAllTenders = () => {
  const api = useAPI();

  return useQuery<CallForTender[]>({
    queryKey: ["tenders"],
    queryFn: async () => {
      const { data } = await api.get("/call-for-tender");
      return data;
    },
  });
};


export const useCreateTender = () => {
  const api = useAPI();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newTender: Omit<CallForTender, "id">) => {
      const { data } = await api.post("/call-for-tender", newTender);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenders"] });
    },
  });
};

export const useUpdateTender = () => {
  const api = useAPI();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updatedData }: { id: string; updatedData: Partial<CallForTender> }) => {
      const { data } = await api.put(`/call-for-tender/${id}`, updatedData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenders"] });
    },
  });
};

export const useDeleteTender = () => {
  const api = useAPI();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/call-for-tender/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenders"] });
    },
  });
};
