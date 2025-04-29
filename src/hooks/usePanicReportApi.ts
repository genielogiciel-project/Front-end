import { useAPI } from "@/api";
import { PanicReport, PanicReportStatus } from "@/lib/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetAllPanicReports = () => {
  const api = useAPI();

  return useQuery<PanicReport[]>({
    queryKey: ["panic-reports"],
    queryFn: async () => {
      const { data } = await api.get("/panic-reports");
      return data;
    },
  });
};

export const useCreatePanicReport = () => {
  const api = useAPI();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newReport: Omit<PanicReport, "id" | "reportedAt" | "status"> & { status?: PanicReportStatus }) => {
      const { data } = await api.post("/panic-reports", {
        ...newReport,
        reportedAt: new Date(),
        status: newReport.status || "OPEN",
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["panic-reports"] });
    },
  });
};

export const useUpdatePanicReport = () => {
  const api = useAPI();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updatedData }: { id: string; updatedData: Partial<PanicReport> }) => {
      const { data } = await api.put(`/panic-reports/${id}`, updatedData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["panic-reports"] });
    },
  });
};

export const useDeletePanicReport = () => {
  const api = useAPI();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/panic-reports/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["panic-reports"] });
    },
  });
};
