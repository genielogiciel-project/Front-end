import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Supplier, SupplierBid, Tender } from "@/lib/types";

interface SuppliersState {
  suppliers: Supplier[];
  tenders: Tender[];
  bids: SupplierBid[];
  loading: boolean;
  error: string | null;
}

// Mock data
const mockSuppliers: Supplier[] = [
  {
    id: "supplier-1",
    name: "InfoTech SARL",
    contactPerson: "Jean Dupont",
    email: "contact@infotech.com",
    phone: "01 23 45 67 89",
    address: "123 Avenue de la Tech, 75001 Paris",
    website: "https://infotech.com",
    isBlacklisted: false,
  },
  {
    id: "supplier-2",
    name: "MatérielPro",
    contactPerson: "Marie Martin",
    email: "contact@materielpro.com",
    phone: "01 98 76 54 32",
    address: "45 Rue de l'Informatique, 69002 Lyon",
    website: "https://materielpro.com",
    isBlacklisted: false,
  },
  {
    id: "supplier-3",
    name: "OrdiExpert",
    contactPerson: "Paul Leroy",
    email: "contact@ordiexpert.com",
    phone: "01 45 67 89 10",
    address: "78 Boulevard Digital, 33000 Bordeaux",
    isBlacklisted: true,
    blacklistReason: "Retards répétés de livraison",
  },
];

const mockTenders: Tender[] = [
  {
    id: "tender-1",
    requestId: "req-1",
    title: "Fourniture d'ordinateurs portables",
    description:
      "Achat de 5 ordinateurs portables pour le département d'informatique",
    startDate: new Date(2023, 4, 15).toISOString(),
    endDate: new Date(2023, 5, 15).toISOString(),
    status: "OPEN",
  },
  {
    id: "tender-2",
    requestId: "req-3",
    title: "Acquisition d'imprimantes laser",
    description:
      "Achat de 3 imprimantes laser pour le département d'administration",
    startDate: new Date(2023, 3, 1).toISOString(),
    endDate: new Date(2023, 4, 1).toISOString(),
    status: "CLOSED",
  },
  {
    id: "tender-3",
    requestId: "req-6",
    title: "Équipement informatique pour laboratoire",
    description:
      "Acquisition de matériel informatique pour le laboratoire de recherche",
    startDate: new Date(2023, 2, 10).toISOString(),
    endDate: new Date(2023, 3, 10).toISOString(),
    status: "AWARDED",
  },
];

const mockBids: SupplierBid[] = [
  {
    id: "bid-1",
    tenderId: "tender-1",
    supplierId: "supplier-1",
    deliveryDate: new Date(2023, 6, 10).toISOString(),
    warrantyPeriod: "3 ans",
    items: [
      { itemId: "item-1", brand: "Dell", model: "XPS 13", price: 1200 },
      { itemId: "item-2", brand: "Dell", model: "XPS 15", price: 1500 },
    ],
    totalPrice: 2700,
    status: "PENDING",
    submittedAt: new Date(2023, 4, 20).toISOString(),
  },
  {
    id: "bid-2",
    tenderId: "tender-1",
    supplierId: "supplier-2",
    deliveryDate: new Date(2023, 6, 15).toISOString(),
    warrantyPeriod: "2 ans",
    items: [
      { itemId: "item-1", brand: "HP", model: "Spectre", price: 1150 },
      { itemId: "item-2", brand: "HP", model: "Envy", price: 1400 },
    ],
    totalPrice: 2550,
    status: "PENDING",
    submittedAt: new Date(2023, 4, 25).toISOString(),
  },
  {
    id: "bid-3",
    tenderId: "tender-3",
    supplierId: "supplier-1",
    deliveryDate: new Date(2023, 4, 1).toISOString(),
    warrantyPeriod: "2 ans",
    items: [
      { itemId: "item-1", brand: "Dell", model: "Precision", price: 2000 },
      { itemId: "item-2", brand: "Dell", model: "OptiPlex", price: 1000 },
    ],
    totalPrice: 3000,
    status: "ACCEPTED",
    submittedAt: new Date(2023, 3, 5).toISOString(),
  },
];

const initialState: SuppliersState = {
  suppliers: mockSuppliers,
  tenders: mockTenders,
  bids: mockBids,
  loading: false,
  error: null,
};

const suppliersSlice = createSlice({
  name: "suppliers",
  initialState,
  reducers: {
    fetchSuppliersStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchSuppliersSuccess: (state, action: PayloadAction<Supplier[]>) => {
      state.suppliers = action.payload;
      state.loading = false;
    },
    fetchSuppliersFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    addSupplier: (state, action: PayloadAction<Supplier>) => {
      state.suppliers.push(action.payload);
    },
    updateSupplier: (state, action: PayloadAction<Supplier>) => {
      const index = state.suppliers.findIndex(
        (s) => s.id === action.payload.id
      );
      if (index !== -1) {
        state.suppliers[index] = action.payload;
      }
    },
    removeSupplier: (state, action: PayloadAction<string>) => {
      state.suppliers = state.suppliers.filter((s) => s.id !== action.payload);
    },
    blacklistSupplier: (
      state,
      action: PayloadAction<{ id: string; reason: string }>
    ) => {
      const index = state.suppliers.findIndex(
        (s) => s.id === action.payload.id
      );
      if (index !== -1) {
        state.suppliers[index].isBlacklisted = true;
        state.suppliers[index].blacklistReason = action.payload.reason;
      }
    },
    fetchTendersStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchTendersSuccess: (state, action: PayloadAction<Tender[]>) => {
      state.tenders = action.payload;
      state.loading = false;
    },
    fetchTendersFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    addTender: (state, action: PayloadAction<Tender>) => {
      state.tenders.push(action.payload);
    },
    updateTender: (state, action: PayloadAction<Tender>) => {
      const index = state.tenders.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) {
        state.tenders[index] = action.payload;
      }
    },
    removeTender: (state, action: PayloadAction<string>) => {
      state.tenders = state.tenders.filter((t) => t.id !== action.payload);
    },
    fetchBidsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchBidsSuccess: (state, action: PayloadAction<SupplierBid[]>) => {
      state.bids = action.payload;
      state.loading = false;
    },
    fetchBidsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    addBid: (state, action: PayloadAction<SupplierBid>) => {
      state.bids.push(action.payload);
    },
    updateBid: (state, action: PayloadAction<SupplierBid>) => {
      const index = state.bids.findIndex((b) => b.id === action.payload.id);
      if (index !== -1) {
        state.bids[index] = action.payload;
      }
    },
    removeBid: (state, action: PayloadAction<string>) => {
      state.bids = state.bids.filter((b) => b.id !== action.payload);
    },
    acceptBid: (state, action: PayloadAction<string>) => {
      // Accept the specified bid
      const bidIndex = state.bids.findIndex((b) => b.id === action.payload);
      if (bidIndex !== -1) {
        state.bids[bidIndex].status = "ACCEPTED";

        // Reject all other bids for this tender
        const tenderId = state.bids[bidIndex].tenderId;
        state.bids.forEach((bid, index) => {
          if (bid.tenderId === tenderId && bid.id !== action.payload) {
            state.bids[index].status = "REJECTED";
          }
        });

        // Update tender status
        const tenderIndex = state.tenders.findIndex((t) => t.id === tenderId);
        if (tenderIndex !== -1) {
          state.tenders[tenderIndex].status = "AWARDED";
        }
      }
    },
    rejectBid: (state, action: PayloadAction<string>) => {
      const index = state.bids.findIndex((b) => b.id === action.payload);
      if (index !== -1) {
        state.bids[index].status = "REJECTED";
      }
    },
  },
});

export const {
  fetchSuppliersStart,
  fetchSuppliersSuccess,
  fetchSuppliersFailure,
  addSupplier,
  updateSupplier,
  removeSupplier,
  blacklistSupplier,
  fetchTendersStart,
  fetchTendersSuccess,
  fetchTendersFailure,
  addTender,
  updateTender,
  removeTender,
  fetchBidsStart,
  fetchBidsSuccess,
  fetchBidsFailure,
  addBid,
  updateBid,
  removeBid,
  acceptBid,
  rejectBid,
} = suppliersSlice.actions;

export default suppliersSlice.reducer;
