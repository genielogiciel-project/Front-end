import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MaintenanceRequest, MaintenanceStatus } from "@/lib/types";

interface MaintenanceState {
  requests: MaintenanceRequest[];
  filteredRequests: MaintenanceRequest[];
  currentRequest: MaintenanceRequest | null;
  loading: boolean;
  error: string | null;
}

// Generate mock data
const generateMockMaintenanceRequests = (): MaintenanceRequest[] => {
  const requests: MaintenanceRequest[] = [];

  const statuses = Object.values(MaintenanceStatus);

  for (let i = 1; i <= 10; i++) {
    const statusIndex = i % statuses.length;
    const reportedDate = new Date();
    reportedDate.setDate(reportedDate.getDate() - i * 2);

    const resolvedDate = new Date(reportedDate);
    resolvedDate.setDate(resolvedDate.getDate() + 3);

    requests.push({
      id: `maint-${i}`,
      resourceId: `${i % 2 === 0 ? "c" : "p"}-${i}`,
      issueDescription: `Problème ${i % 2 === 0 ? "logiciel" : "matériel"} - ${i}`,
      issueFrequency:
        i % 3 === 0 ? "PERMANENT" : i % 3 === 1 ? "FREQUENT" : "RARE",
      issueType: i % 2 === 0 ? "SOFTWARE" : "HARDWARE",
      status: statuses[statusIndex],
      reportedById: `user-${(i % 3) + 1}`,
      reportedAt: reportedDate.toISOString(),
      technicianId: statusIndex > 0 ? `tech-${(i % 2) + 1}` : undefined,
      resolution: statusIndex === 2 ? `Résolution du problème ${i}` : undefined,
      resolvedAt: statusIndex === 2 ? resolvedDate.toISOString() : undefined,
    });
  }

  return requests;
};

const initialState: MaintenanceState = {
  requests: generateMockMaintenanceRequests(),
  filteredRequests: [],
  currentRequest: null,
  loading: false,
  error: null,
};

const maintenanceSlice = createSlice({
  name: "maintenance",
  initialState,
  reducers: {
    fetchMaintenanceRequestsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchMaintenanceRequestsSuccess: (
      state,
      action: PayloadAction<MaintenanceRequest[]>
    ) => {
      state.requests = action.payload;
      state.filteredRequests = action.payload;
      state.loading = false;
    },
    fetchMaintenanceRequestsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    setCurrentMaintenanceRequest: (
      state,
      action: PayloadAction<MaintenanceRequest | null>
    ) => {
      state.currentRequest = action.payload;
    },
    filterMaintenanceRequests: (
      state,
      action: PayloadAction<{
        resourceId?: string;
        status?: MaintenanceStatus;
        technicianId?: string;
      }>
    ) => {
      const { resourceId, status, technicianId } = action.payload;

      state.filteredRequests = state.requests.filter((request) => {
        let match = true;

        if (resourceId && request.resourceId !== resourceId) {
          match = false;
        }

        if (status && request.status !== status) {
          match = false;
        }

        if (technicianId && request.technicianId !== technicianId) {
          match = false;
        }

        return match;
      });
    },
    addMaintenanceRequest: (
      state,
      action: PayloadAction<MaintenanceRequest>
    ) => {
      state.requests.push(action.payload);
      state.filteredRequests = state.requests;
    },
    updateMaintenanceRequest: (
      state,
      action: PayloadAction<MaintenanceRequest>
    ) => {
      const index = state.requests.findIndex((r) => r.id === action.payload.id);
      if (index !== -1) {
        state.requests[index] = action.payload;

        if (state.currentRequest?.id === action.payload.id) {
          state.currentRequest = action.payload;
        }

        // Update filtered requests as well
        const filteredIndex = state.filteredRequests.findIndex(
          (r) => r.id === action.payload.id
        );
        if (filteredIndex !== -1) {
          state.filteredRequests[filteredIndex] = action.payload;
        }
      }
    },
    assignTechnician: (
      state,
      action: PayloadAction<{ requestId: string; technicianId: string }>
    ) => {
      const { requestId, technicianId } = action.payload;
      const index = state.requests.findIndex((r) => r.id === requestId);

      if (index !== -1) {
        state.requests[index].technicianId = technicianId;
        state.requests[index].status = MaintenanceStatus.IN_PROGRESS;

        if (state.currentRequest?.id === requestId) {
          state.currentRequest.technicianId = technicianId;
          state.currentRequest.status = MaintenanceStatus.IN_PROGRESS;
        }
      }
    },
    resolveMaintenanceRequest: (
      state,
      action: PayloadAction<{ requestId: string; resolution: string }>
    ) => {
      const { requestId, resolution } = action.payload;
      const index = state.requests.findIndex((r) => r.id === requestId);

      if (index !== -1) {
        state.requests[index].resolution = resolution;
        state.requests[index].status = MaintenanceStatus.RESOLVED;
        state.requests[index].resolvedAt = new Date().toISOString();

        if (state.currentRequest?.id === requestId) {
          state.currentRequest.resolution = resolution;
          state.currentRequest.status = MaintenanceStatus.RESOLVED;
          state.currentRequest.resolvedAt = new Date().toISOString();
        }
      }
    },
    returnToSupplier: (
      state,
      action: PayloadAction<{ requestId: string; reason: string }>
    ) => {
      const { requestId, reason } = action.payload;
      const index = state.requests.findIndex((r) => r.id === requestId);

      if (index !== -1) {
        state.requests[index].resolution = reason;
        state.requests[index].status = MaintenanceStatus.RETURNED_TO_SUPPLIER;

        if (state.currentRequest?.id === requestId) {
          state.currentRequest.resolution = reason;
          state.currentRequest.status = MaintenanceStatus.RETURNED_TO_SUPPLIER;
        }
      }
    },
  },
});

export const {
  fetchMaintenanceRequestsStart,
  fetchMaintenanceRequestsSuccess,
  fetchMaintenanceRequestsFailure,
  setCurrentMaintenanceRequest,
  filterMaintenanceRequests,
  addMaintenanceRequest,
  updateMaintenanceRequest,
  assignTechnician,
  resolveMaintenanceRequest,
  returnToSupplier,
} = maintenanceSlice.actions;

export default maintenanceSlice.reducer;
