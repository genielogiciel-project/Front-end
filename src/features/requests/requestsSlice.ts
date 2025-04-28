import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ResourceRequest, RequestStatus, ResourceType } from '@/lib/types';

interface RequestsState {
  requests: ResourceRequest[];
  filteredRequests: ResourceRequest[];
  currentRequest: ResourceRequest | null;
  loading: boolean;
  error: string | null;
}

// Generate mock data
const generateMockRequests = (): ResourceRequest[] => {
  const requests: ResourceRequest[] = [];
  
  const statuses = Object.values(RequestStatus);
  
  for (let i = 1; i <= 15; i++) {
    const statusIndex = i % statuses.length;
    const createdDate = new Date();
    createdDate.setDate(createdDate.getDate() - i * 3);
    
    requests.push({
      id: `req-${i}`,
      departmentId: `dept${(i % 3) + 1}`,
      items: [
        {
          type: i % 3 === 0 ? ResourceType.PRINTER : ResourceType.COMPUTER,
          quantity: i % 3 + 1,
          specifications: i % 3 === 0 
            ? { brand: 'HP', speed: '30 ppm', resolution: '1200x1200 dpi' }
            : { brand: 'Dell', cpu: 'Intel i7', ram: '16GB', storage: '512GB SSD', screen: '15.6" FHD' },
        },
        ...(i % 4 === 0 ? [{
          type: ResourceType.COMPUTER,
          quantity: 1,
          specifications: { brand: 'Lenovo', cpu: 'AMD Ryzen 7', ram: '32GB', storage: '1TB SSD', screen: '17" 4K' },
        }] : []),
      ],
      justification: `Besoin pour le département ${i % 3 + 1} - Projet ${i}`,
      status: statuses[statusIndex],
      createdAt: createdDate.toISOString(),
      updatedAt: new Date(createdDate.getTime() + 1000 * 60 * 60 * 24 * (i % 3)).toISOString(),
      createdById: `user-${(i % 3) + 1}`,
    });
  }
  
  return requests;
};

const initialState: RequestsState = {
  requests: generateMockRequests(),
  filteredRequests: [],
  currentRequest: null,
  loading: false,
  error: null,
};

const requestsSlice = createSlice({
  name: 'requests',
  initialState,
  reducers: {
    fetchRequestsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchRequestsSuccess: (state, action: PayloadAction<ResourceRequest[]>) => {
      state.requests = action.payload;
      state.filteredRequests = action.payload;
      state.loading = false;
    },
    fetchRequestsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    setCurrentRequest: (state, action: PayloadAction<ResourceRequest | null>) => {
      state.currentRequest = action.payload;
    },
    filterRequests: (state, action: PayloadAction<{ departmentId?: string; status?: RequestStatus }>) => {
      const { departmentId, status } = action.payload;
      
      state.filteredRequests = state.requests.filter((request) => {
        let match = true;
        
        if (departmentId && request.departmentId !== departmentId) {
          match = false;
        }
        
        if (status && request.status !== status) {
          match = false;
        }
        
        return match;
      });
    },
    addRequest: (state, action: PayloadAction<ResourceRequest>) => {
      state.requests.push(action.payload);
      state.filteredRequests = state.requests;
    },
    updateRequest: (state, action: PayloadAction<ResourceRequest>) => {
      const index = state.requests.findIndex(r => r.id === action.payload.id);
      if (index !== -1) {
        state.requests[index] = action.payload;
        
        if (state.currentRequest?.id === action.payload.id) {
          state.currentRequest = action.payload;
        }
        
        // Update filtered requests as well
        const filteredIndex = state.filteredRequests.findIndex(r => r.id === action.payload.id);
        if (filteredIndex !== -1) {
          state.filteredRequests[filteredIndex] = action.payload;
        }
      }
    },
    removeRequest: (state, action: PayloadAction<string>) => {
      state.requests = state.requests.filter(r => r.id !== action.payload);
      state.filteredRequests = state.filteredRequests.filter(r => r.id !== action.payload);
      
      if (state.currentRequest?.id === action.payload) {
        state.currentRequest = null;
      }
    },
  },
});

export const {
  fetchRequestsStart,
  fetchRequestsSuccess,
  fetchRequestsFailure,
  setCurrentRequest,
  filterRequests,
  addRequest,
  updateRequest,
  removeRequest,
} = requestsSlice.actions;

export default requestsSlice.reducer;