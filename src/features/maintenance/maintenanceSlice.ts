import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PanicReport, PanicReportStatus } from "@/lib/types";

interface MaintenanceState {
  requests: PanicReport[]; // Full list
  filteredRequests: PanicReport[]; // After filtering
  currentRequest: PanicReport | null; // For viewing/editing
  loading: boolean;
  error: string | null;
}

const initialState: MaintenanceState = {
  requests: [],
  filteredRequests: [],
  currentRequest: null,
  loading: false,
  error: null,
};

const maintenanceSlice = createSlice({
  name: "maintenance",
  initialState,
  reducers: {
    setRequests: (state, action: PayloadAction<PanicReport[]>) => {
      state.requests = action.payload;
      state.filteredRequests = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setCurrentRequest: (state, action: PayloadAction<PanicReport | null>) => {
      state.currentRequest = action.payload;
    },
    filterRequests: (
      state,
      action: PayloadAction<{
        resourceId?: string;
        status?: PanicReportStatus;
        technicianId?: string;
      }>
    ) => {
      const { resourceId, status, technicianId } = action.payload;

      state.filteredRequests = state.requests.filter((r) => {
        return (
          (!resourceId || r.resourceId === resourceId) &&
          (!status || r.status === status) &&
          (!technicianId || r.technicianId === technicianId)
        );
      });
    },
    addRequest: (state, action: PayloadAction<PanicReport>) => {
      state.requests.push(action.payload);
      state.filteredRequests = [...state.requests];
    },
    updateRequest: (state, action: PayloadAction<PanicReport>) => {
      const index = state.requests.findIndex((r) => r.id === action.payload.id);
      if (index !== -1) {
        state.requests[index] = action.payload;

        const filteredIndex = state.filteredRequests.findIndex(
          (r) => r.id === action.payload.id
        );
        if (filteredIndex !== -1) {
          state.filteredRequests[filteredIndex] = action.payload;
        }

        if (state.currentRequest?.id === action.payload.id) {
          state.currentRequest = action.payload;
        }
      }
    },
    assignTechnician: (
      state,
      action: PayloadAction<{ requestId: string; technicianId: string }>
    ) => {
      const { requestId, technicianId } = action.payload;
      const target = state.requests.find((r) => r.id === requestId);
      if (target) {
        target.technicianId = technicianId;
        target.status = PanicReportStatus.IN_PROGRESS;
      }
    },
    resolveRequest: (
      state,
      action: PayloadAction<{ requestId: string; resolution: string }>
    ) => {
      const { requestId, resolution } = action.payload;
      const target = state.requests.find((r) => r.id === requestId);
      if (target) {
        target.status = PanicReportStatus.RESOLVED;
        target.resolution = resolution;
        target.resolvedAt = new Date().toISOString();
      }
    },
    returnToSupplier: (
      state,
      action: PayloadAction<{ requestId: string; reason: string }>
    ) => {
      const { requestId, reason } = action.payload;
      const target = state.requests.find((r) => r.id === requestId);
      if (target) {
        target.status = PanicReportStatus.RETURNED_TO_SUPPLIER;
        target.resolution = reason;
      }
    },
  },
});

export const {
  setRequests,
  setLoading,
  setError,
  setCurrentRequest,
  filterRequests,
  addRequest,
  updateRequest,
  assignTechnician,
  resolveRequest,
  returnToSupplier,
} = maintenanceSlice.actions;

export default maintenanceSlice.reducer;
