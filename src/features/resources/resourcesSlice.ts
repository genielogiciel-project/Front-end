import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Resource, ResourceType } from "@/lib/types";

interface ResourcesState {
  resources: Resource[];
  filteredResources: Resource[];
  currentResource: Resource | null;
  loading: boolean;
  error: string | null;
}

// Generate mock data
const generateMockResources = (): Resource[] => {
  const resources: Resource[] = [];

  // Add computers
  for (let i = 1; i <= 15; i++) {
    resources.push({
      id: `c-${i}`,
      inventoryNumber: `INV-C-${1000 + i}`,
      type: ResourceType.COMPUTER,
      specifications: {
        brand: i % 3 === 0 ? "Dell" : i % 3 === 1 ? "HP" : "Lenovo",
        cpu: i % 2 === 0 ? "Intel i7" : "AMD Ryzen 7",
        ram: `${8 * ((i % 3) + 1)}GB`,
        storage: `${256 * ((i % 2) + 1)}GB SSD`,
        screen: '15.6" FHD',
      },
      departmentId: `dept${(i % 3) + 1}`,
      assignedUserId: i < 10 ? `user-${i}` : undefined,
      status:
        i % 10 === 0
          ? "MAINTENANCE"
          : i % 7 === 0
            ? "DISPOSED"
            : i < 10
              ? "ASSIGNED"
              : "AVAILABLE",
      acquisitionDate: new Date(2023, i % 12, (i % 28) + 1).toISOString(),
      warrantyEndDate: new Date(2026, i % 12, (i % 28) + 1).toISOString(),
      supplierId: `supplier-${(i % 3) + 1}`,
    });
  }

  // Add printers
  for (let i = 1; i <= 8; i++) {
    resources.push({
      id: `p-${i}`,
      inventoryNumber: `INV-P-${2000 + i}`,
      type: ResourceType.PRINTER,
      specifications: {
        brand: i % 2 === 0 ? "HP" : "Epson",
        speed: `${20 + i * 5} ppm`,
        resolution: i % 2 === 0 ? "1200x1200 dpi" : "4800x1200 dpi",
      },
      departmentId: `dept${(i % 3) + 1}`,
      status: i % 5 === 0 ? "MAINTENANCE" : "ASSIGNED",
      acquisitionDate: new Date(2022, i % 12, (i % 28) + 1).toISOString(),
      warrantyEndDate: new Date(2025, i % 12, (i % 28) + 1).toISOString(),
      supplierId: `supplier-${(i % 2) + 1}`,
    });
  }

  return resources;
};

const initialState: ResourcesState = {
  resources: generateMockResources(),
  filteredResources: [],
  currentResource: null,
  loading: false,
  error: null,
};

const resourcesSlice = createSlice({
  name: "resources",
  initialState,
  reducers: {
    fetchResourcesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchResourcesSuccess: (state, action: PayloadAction<Resource[]>) => {
      state.resources = action.payload;
      state.filteredResources = action.payload;
      state.loading = false;
    },
    fetchResourcesFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    setCurrentResource: (state, action: PayloadAction<Resource | null>) => {
      state.currentResource = action.payload;
    },
    filterResources: (
      state,
      action: PayloadAction<{
        departmentId?: string;
        type?: ResourceType;
        status?: string;
      }>
    ) => {
      const { departmentId, type, status } = action.payload;

      state.filteredResources = state.resources.filter((resource) => {
        let match = true;

        if (departmentId && resource.departmentId !== departmentId) {
          match = false;
        }

        if (type && resource.type !== type) {
          match = false;
        }

        if (status && resource.status !== status) {
          match = false;
        }

        return match;
      });
    },
    addResource: (state, action: PayloadAction<Resource>) => {
      state.resources.push(action.payload);
      state.filteredResources = state.resources;
    },
    updateResource: (state, action: PayloadAction<Resource>) => {
      const index = state.resources.findIndex(
        (r) => r.id === action.payload.id
      );
      if (index !== -1) {
        state.resources[index] = action.payload;

        if (state.currentResource?.id === action.payload.id) {
          state.currentResource = action.payload;
        }

        // Update filtered resources as well
        const filteredIndex = state.filteredResources.findIndex(
          (r) => r.id === action.payload.id
        );
        if (filteredIndex !== -1) {
          state.filteredResources[filteredIndex] = action.payload;
        }
      }
    },
    removeResource: (state, action: PayloadAction<string>) => {
      state.resources = state.resources.filter((r) => r.id !== action.payload);
      state.filteredResources = state.filteredResources.filter(
        (r) => r.id !== action.payload
      );

      if (state.currentResource?.id === action.payload) {
        state.currentResource = null;
      }
    },
  },
});

export const {
  fetchResourcesStart,
  fetchResourcesSuccess,
  fetchResourcesFailure,
  setCurrentResource,
  filterResources,
  addResource,
  updateResource,
  removeResource,
} = resourcesSlice.actions;

export default resourcesSlice.reducer;
