import { useAPI } from "@/api";
import { Proposal } from "@/lib/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetAllProposals = () => {
  const api = useAPI();

  return useQuery<Proposal[]>({
    queryKey: ["proposal"],
    queryFn: async () => {
      const { data } = await api.get("/proposal");
      return data;
    },
  });
};

export const useCreateProposal = () => {
  const api = useAPI();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newProposal: Omit<Proposal, "id">) => {
      const { data } = await api.post("/proposal", newProposal);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposal"] });
      queryClient.invalidateQueries({ queryKey: ["tenders"] });
    },
  });
};

export const useUpdateProposal = () => {
  const api = useAPI();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updatedData,
    }: {
      id: string;
      updatedData: Partial<Proposal>;
    }) => {
      const { data } = await api.put(`/proposal/${id}`, updatedData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposal"] });
    },
  });
};

export const useDeleteProposal = () => {
  const api = useAPI();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/proposal/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposal"] });
    },
  });
};

export const useAcceptRefuseProposals = () => {
  const api = useAPI();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      resManagerId,
      selectedId,
      rejectedIds,
    }: {
      resManagerId: string;
      selectedId: string;
      rejectedIds: string[];
    }) => {
      const { data } = await api.put(
        `/proposal/${selectedId}/accepted-refused/${resManagerId}`,
        rejectedIds
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposal"] });
      queryClient.invalidateQueries({ queryKey: ["tenders"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};
