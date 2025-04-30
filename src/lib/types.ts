export type Role =
  | "SUPER_ADMIN"
  | "TEACHER"
  | "TECHNICIAN"
  | "SUPPLIER"
  | "RESOURCE_MANAGER"
  | "DEPARTMENT_HEAD";

import { z } from "zod";

// User Roles
export enum UserRole {
  DEPARTMENT_HEAD = "DEPARTMENT_HEAD",
  RESOURCE_MANAGER = "RESOURCE_MANAGER",
  TECHNICIAN = "TECHNICIAN",
  TEACHER = "TEACHER",
  SUPPLIER = "SUPPLIER",
  SUPER_ADMIN = "SUPER_ADMIN",
}

// Resource Types
export enum ResourceType {
  COMPUTER = "COMPUTER",
  PRINTER = "PRINTER",
}

// Request Status
export enum RequestStatus {
  SUBMITTED = "SUBMITTED",
  VALIDATED = "VALIDATED",
  REJECTED = "REJECTED",
  SENT = "SENT",
}

// Maintenance Status
export enum PanicReportStatus {
  OPEN = "OPEN",
  IN_PROGRESS = "IN_PROGRESS",
  RESOLVED = "RESOLVED",
  CLOSED = "CLOSED",
}

// Zod schemas for validation
export const ComputerSchema = z.object({
  brand: z.string().min(1, "La marque est requise"),
  cpu: z.string().min(1, "Le CPU est requis"),
  ram: z.string().min(1, "La RAM est requise"),
  storage: z.string().min(1, "Le disque dur est requis"),
  screen: z.string().min(1, "L'écran est requis"),
});

export const PrinterSchema = z.object({
  brand: z.string().min(1, "La marque est requise"),
  speed: z.string().min(1, "La vitesse d'impression est requise"),
  resolution: z.string().min(1, "La résolution est requise"),
});

export const ResourceRequestSchema = z.object({
  departmentId: z.string().min(1, "Le département est requis"),
  items: z
    .array(
      z.object({
        type: z.nativeEnum(ResourceType),
        quantity: z.number().min(1, "La quantité doit être supérieure à 0"),
        specifications: z.union([ComputerSchema, PrinterSchema, z.object({})]),
      })
    )
    .min(1, "Au moins un article est requis"),
  justification: z.string().optional(),
});

export const SupplierBidSchema = z.object({
  tenderId: z.string().min(1, "L'appel d'offre est requis"),
  deliveryDate: z.date(),
  warrantyPeriod: z.string().min(1, "La durée de garantie est requise"),
  items: z
    .array(
      z.object({
        itemId: z.string().min(1),
        brand: z.string().min(1),
        model: z.string().min(1),
        price: z.number().min(0),
      })
    )
    .min(1, "Au moins un article est requis"),
  totalPrice: z.number().min(0),
});

export const MaintenanceRequestSchema = z.object({
  resourceId: z.string().min(1, "La ressource est requise"),
  issueDescription: z.string().min(1, "La description est requise"),
  issueFrequency: z.enum(["RARE", "FREQUENT", "PERMANENT"]),
  issueType: z.enum(["SOFTWARE", "HARDWARE"]),
});

// Type definitions
export type User = {
  id: string;
  fullName: string;
  userNumber: string;
  password: string;
  role: UserRole[];
};

export type Department = {
  id: string;
  name: string;
  head: Department;
};

export type Resource = {
  id: string | null;
  inventoryNumber: string;
  type: ResourceType;
  brand: string;
  specifications: string;
  department: Department | null;
  user: User | null;
  supplier: Supplier | null;
  status: ResourceStatus;
  acquisitionDate: Date;
  warrantyEndDate: Date;
};

export enum ResourceStatus {
  AVAILABLE = "AVAILABLE",
  ASSIGNED = "ASSIGNED",
  MAINTENANCE = "MAINTENANCE",
  DISPOSED = "DISPOSED",
}

export type ResourceRequest = {
  id: string;
  status: RequestStatus;
  requestedProducts: RequestedProduct[];
  teacher: User;
  department: Department;
  createdAt: Date;
};

export type RequestedProduct = {
  id: string;
  type: ResourceType;
  brand: string;
  quantity: number;
  specifications: string;
};

export type CallForTender = {
  id: string;
  title: string;
  requestedProducts: RequestedProduct[];
  startDate: Date;
  endDate: Date;
  open: boolean;
  resourceManager: User;
  proposals: Proposal[];
};

export type Supplier = User & {
  id: string;
  companyName: string;
  address: string;
  website: string;
  managerName: string;
  blacklisted: boolean;
  blacklistReason?: string;
};

export type PanicReport = {
  id: string;
  description: string;
  reportedAt: Date;

  status: PanicReportStatus;
  teacher: User;
  resource: Resource;
  resolution?: string;
  resolvedAt?: Date;
};

export type MaintenanceRecord = {
  id: string;
  details: string;
  maintenanceDate: Date;
  technician: User;
  resource: Resource;
  panicReport?: PanicReport;
};

export type Proposal = {
  id: string;
  deliveryDate: Date;
  proposalProducts: ProposalProduct[];
  totalPrice: number;
  tender: CallForTender;
  supplier: Supplier;
};

export type ProposalProduct = {
  id: string;
  resourceType: ResourceType;
  brand: string;
  quantity: number;
  unitPrice: number;
  proposal: Proposal;
};
