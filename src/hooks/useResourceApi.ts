import { useAPI } from "@/api";
import { Resource, ResourceType } from "@/lib/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetAllResources = () => {
  const api = useAPI();

  return useQuery<Resource[]>({
    queryKey: ["resources"],
    queryFn: async () => {
      const { data } = await api.get("/resources");
      return data;
    },
  });
};

export const useGetResourcesByUserId = (userId: string) => {
  const api = useAPI();

  return useQuery<Resource[]>({
    queryKey: ["resources", userId],
    queryFn: async () => {
      const { data } = await api.get(`/resources/${userId}`);
      return data;
    },
    enabled: !!userId, // wait until userId is available
  });
};

export const useCreateResource = () => {
  const api = useAPI();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newResource: Omit<Resource, "id">) => {
      const { data } = await api.post("/resources", newResource);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resources"] });
    },
  });
};

export const useUpdateResource = () => {
  const api = useAPI();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updatedData,
    }: {
      id: string;
      updatedData: Partial<Resource>;
    }) => {
      const { data } = await api.put(`/resources/${id}`, updatedData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resources"] });
    },
  });
};

export const useDeleteResource = () => {
  const api = useAPI();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/resources/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resources"] });
    },
  });
};
