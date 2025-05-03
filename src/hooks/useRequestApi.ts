// hooks/useRequestApi.ts
import { useAPI } from "@/api";
import { RequestedProduct, ResourceRequest } from "@/lib/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export const useGetAllRequests = () => {
  const api = useAPI();

  return useQuery({
    queryKey: ["requests"],
    queryFn: async () => {
      try {
        const { data } = await api.get<ResourceRequest[]>("/resource-request");

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

export function useGetAllProductsByRequestStatus(status: string) {
  const api = useAPI();
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: ["resourceRequests", status],
    });
  }, [queryClient, status]);

  return useQuery({
    queryKey: ["resourceRequests", status],
    queryFn: async () => {
      try {
        const { data } = await api.get<RequestedProduct[]>(
          `/resource-request/by-status/${status}`
        );
        return data;
      } catch (error) {
        console.error("Error fetching products by status:", error);
        throw error;
      }
    },
    staleTime: Infinity,
  });
}

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
