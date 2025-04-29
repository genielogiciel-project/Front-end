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
  MAINTENANCE = "MAINTENANCE",
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
export enum MaintenanceStatus {
  REPORTED = "REPORTED",
  IN_PROGRESS = "IN_PROGRESS",
  RESOLVED = "RESOLVED",
  RETURNED_TO_SUPPLIER = "RETURNED_TO_SUPPLIER",
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
  head: Department
};

export type Resource = {
  id: string;
  inventoryNumber: string;
  type: ResourceType;
  specifications: string;
  departmentId: string;
  assignedUserId?: string;
  status: "AVAILABLE" | "ASSIGNED" | "MAINTENANCE" | "DISPOSED";
  acquisitionDate: Date;
  warrantyEndDate: Date;
  supplierId: string;
};

export type ResourceRequest = z.infer<typeof ResourceRequestSchema> & {
  id: string;
  status: RequestStatus;
  requestedProducts: RequestedProduct[];
  teacher: User;
  department: Department;
};

export type RequestedProduct = {
  id: string;
  resourceType: ResourceType;
  brand: string;
  quantity: number;
}

export type Tender = {
  id: string;
  requestId: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: "OPEN" | "CLOSED" | "AWARDED";
};

export type Supplier = {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  website?: string;
  isBlacklisted: boolean;
  blacklistReason?: string;
};

export type SupplierBid = z.infer<typeof SupplierBidSchema> & {
  id: string;
  supplierId: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  submittedAt: Date;
};

export type MaintenanceRequest = z.infer<typeof MaintenanceRequestSchema> & {
  id: string;
  status: MaintenanceStatus;
  reportedById: string;
  reportedAt: Date;
  technicianId?: string;
  resolution?: string;
  resolvedAt?: Date;
};
