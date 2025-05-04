import { useAPI } from "@/api";
import { useAppSelector } from "@/lib/store";
import { ResourceRequest } from "@/lib/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetAllRequests = () => {
  const api = useAPI();
  const { user } = useAppSelector((state) => state.auth);

  return useQuery({
    queryKey: ["requests"],
    queryFn: async () => {
      try {
        const { data } = await api.post<ResourceRequest[]>(
          "/resource-request/all",
          user
        );

        // Convertir specs string -> object
        data.forEach((request) => {
          request.requestedProducts.forEach((product) => {
            try {
              if (typeof product.specifications === "string") {
                product.specifications = JSON.parse(product.specifications);
              }
            } catch (e) {
              console.warn(
                "Invalid JSON in specifications:",
                product.specifications
              );
            }
          });
        });

        return data;
      } catch (error) {
        console.error("Error fetching requests:", error);
        throw error;
      }
    },
  });
};

export const useCreateRequest = () => {
  const api = useAPI();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newRequest: ResourceRequest) => {
      try {
        const { data } = await api.post("/resource-request", newRequest);
        return data;
      } catch (error) {
        console.error("Error creating request:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
    },
  });
};

export const useUpdateRequest = () => {
  const api = useAPI();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updatedData,
    }: {
      id: string;
      updatedData: ResourceRequest;
    }) => {
      try {
        const { data } = await api.put(`/resource-request/${id}`, updatedData);
        return data;
      } catch (error) {
        console.error("Error updating request:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
    },
  });
};

export const useDeleteRequest = () => {
  const api = useAPI();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      try {
        const { data } = await api.delete(`/resource-request/${id}`);
        return data;
      } catch (error) {
        console.error("Error deleting request:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
    },
  });
};
