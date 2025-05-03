import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PanicReport, PanicReportStatus } from "@/lib/types";

interface PanicReportState {
  reports: PanicReport[];
  filteredReports: PanicReport[];
  currentReport: PanicReport | null;
  loading: boolean;
  error: string | null;
}

const initialState: PanicReportState = {
  reports: [],
  filteredReports: [],
  currentReport: null,
  loading: false,
  error: null,
};

const panicReportSlice = createSlice({
  name: "panicReport",
  initialState,
  reducers: {
    setReports: (state, action: PayloadAction<PanicReport[]>) => {
      state.reports = action.payload;
      state.filteredReports = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setCurrentReport: (state, action: PayloadAction<PanicReport | null>) => {
      state.currentReport = action.payload;
    },
    filterReportsByStatus: (
      state,
      action: PayloadAction<PanicReportStatus | "ALL">
    ) => {
      if (action.payload === "ALL") {
        state.filteredReports = [...state.reports];
      } else {
        state.filteredReports = state.reports.filter(
          (r) => r.status === action.payload
        );
      }
    },
    addReport: (state, action: PayloadAction<PanicReport>) => {
      state.reports.push(action.payload);
      state.filteredReports = [...state.reports];
    },
    updateReport: (state, action: PayloadAction<PanicReport>) => {
      const index = state.reports.findIndex((r) => r.id === action.payload.id);
      if (index !== -1) {
        state.reports[index] = action.payload;

        const filteredIndex = state.filteredReports.findIndex(
          (r) => r.id === action.payload.id
        );
        if (filteredIndex !== -1) {
          state.filteredReports[filteredIndex] = action.payload;
        }

        if (state.currentReport?.id === action.payload.id) {
          state.currentReport = action.payload;
        }
      }
    },
  },
});

export const {
  setReports,
  setLoading,
  setError,
  setCurrentReport,
  filterReportsByStatus,
  addReport,
  updateReport,
} = panicReportSlice.actions;

export default panicReportSlice.reducer;
