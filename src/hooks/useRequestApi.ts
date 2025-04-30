import { useAPI } from "@/api";
import { RequestedProduct, ResourceRequest } from "@/lib/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetAllRequests = () => {
  const api = useAPI();

  return useQuery({
    queryKey: ["requests"],
    queryFn: async () => {
      try {
        let { data } = (await api.get("/resource-request")) as {
          data: ResourceRequest[];
        };
        data.forEach((request) => {
          request.requestedProducts.forEach((product) => {
            product.specifications = JSON.parse(product.specifications);
          });
        });
        return data;
      } catch (error) {
        console.error("Error fetching requests:", error);
        throw error; // Rethrow the error to trigger the error state in the query
      }
    },
  });
};

export function useGetAllProductsByRequestStatus(status: string) {
  const api = useAPI();

  return useQuery({
    queryKey: ["resourceRequests", status],
    queryFn: async () => {
      const { data } = (await api.get(
        `/resource-request/by-status/${status}`
      )) as { data: RequestedProduct[] };

      // data.forEach((product) => {
      //   product.specifications = JSON.parse(product.specifications);
      // });
      // console.log(data);
      return data;
    },
    // enabled: !!status,
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
