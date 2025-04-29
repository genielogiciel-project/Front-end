import { useAPI } from "@/api";
import { Proposal } from "@/lib/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetAllProposals = () => {
  const api = useAPI();

  return useQuery<Proposal[]>({
    queryKey: ["proposals"],
    queryFn: async () => {
      const { data } = await api.get("/proposals");
      return data;
    },
  });
};

export const useCreateProposal = () => {
  const api = useAPI();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newProposal: Omit<Proposal, "id">) => {
      const { data } = await api.post("/proposals", newProposal);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposals"] });
    },
  });
};

export const useUpdateProposal = () => {
  const api = useAPI();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updatedData }: { id: string; updatedData: Partial<Proposal> }) => {
      const { data } = await api.put(`/proposals/${id}`, updatedData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposals"] });
    },
  });
};

export const useDeleteProposal = () => {
  const api = useAPI();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/proposals/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposals"] });
    },
  });
};
