import { useAPI } from "@/api";
import { MaintenanceRecord } from "@/lib/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetAllMaintenanceRecords = () => {
  const api = useAPI();

  return useQuery<MaintenanceRecord[]>({
    queryKey: ["maintenance-records"],
    queryFn: async () => {
      const { data } = await api.get("/maintenance-records");
      return data;
    },
  });
};

export const useCreateMaintenanceRecord = () => {
  const api = useAPI();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newRecord: Omit<MaintenanceRecord, "id" | "maintenanceDate">) => {
      const { data } = await api.post("/maintenance-records", {
        ...newRecord,
        maintenanceDate: new Date(),
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenance-records"] });
    },
  });
};

export const useUpdateMaintenanceRecord = () => {
  const api = useAPI();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updatedData }: { id: string; updatedData: Partial<MaintenanceRecord> }) => {
      const { data } = await api.put(`/maintenance-records/${id}`, updatedData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenance-records"] });
    },
  });
};

export const useDeleteMaintenanceRecord = () => {
  const api = useAPI();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/maintenance-records/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenance-records"] });
    },
  });
};
