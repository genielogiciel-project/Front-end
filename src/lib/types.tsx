import { JSX } from "react";
import {
  AlertCircle,
  Ban,
  BellRing,
  CheckCircle2,
  Info,
  ServerCog,
  TriangleAlert,
  Truck,
  Wrench,
  XCircle,
} from "lucide-react";

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

// Type definitions
export type User = {
  id: string;
  fullName: string;
  userNumber: string;
  password: string;
  role: UserRole[];
  department: Department;
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
  reportDate: Date;

  status: PanicReportStatus;
  teacher: User;
  resource: Resource;
  maintenanceRecord: MaintenanceRecord;
};

export enum Severity {
  NORMAL = "NORMAL",
  SEVERE = "SEVERE",
}

export enum Frequency {
  RARE = "RARE",
  FREQUENT = "FREQUENT",
  PERMANENT = "PERMANENT",
}

export enum Origin {
  HARDWARE = "HARDWARE",
  SOFTWARE = "SOFTWARE",
  UTILITY = "UTILITY",
}

export enum MaintenanceStatus {
  IN_PROGRESS = "IN_PROGRESS",
  RESOLVED = "RESOLVED",
  RETURNED = "RETURNED",
}

export type MaintenanceRecord = {
  id: string;
  details: string;
  maintenanceDate: Date;
  severity: Severity;
  frequency: Frequency;
  origin: Origin;
  status: MaintenanceStatus;
  technician: User;
  panicReport?: PanicReport;
};

export type Proposal = {
  id: string;
  deliveryDate: Date;
  warranty: number;
  proposalProducts: ProposalProduct[];
  totalPrice: number;
  callForTender: CallForTender;
  supplier: Supplier;
  accepted: boolean;
};

export type ProposalProduct = {
  id: string;
  type: ResourceType;
  brand: string;
  quantity: number;
  unitPrice: number;
  proposal: Proposal;
};

export enum NotificationType {
  INFO = "INFO",
  ACTION_REQUIRED = "ACTION_REQUIRED",
  ALERT = "ALERT",
  SUCCESS = "SUCCESS",
  ERROR = "ERROR",
  REJECTION = "REJECTION",
  WARNING = "WARNING",
  SYSTEM = "SYSTEM",
  DELIVERY = "DELIVERY",
  MAINTENANCE = "MAINTENANCE",
}

export const notificationTypeIcons: {
  [key in NotificationType]: JSX.Element;
} = {
  INFO: <Info className="text-blue-500" />,
  ACTION_REQUIRED: <AlertCircle className="text-yellow-500" />,
  ALERT: <BellRing className="text-orange-500" />,
  SUCCESS: <CheckCircle2 className="text-green-600" />,
  ERROR: <XCircle className="text-red-600" />,
  REJECTION: <Ban className="text-red-500" />,
  WARNING: <TriangleAlert className="text-yellow-600" />,
  SYSTEM: <ServerCog className="text-gray-700" />,
  DELIVERY: <Truck className="text-indigo-600" />,
  MAINTENANCE: <Wrench className="text-amber-700" />,
};

export type Notification = {
  id: string;
  message: string;
  sentDate: string;
  seen: boolean;
  type: NotificationType;
  sender: User;
  receiver: User;
};
