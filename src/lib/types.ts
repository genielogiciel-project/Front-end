export interface User {
    id: string;
    userNumber: string;
    password?: string;
    role?: Role;
  }
  
  export type Role = "SUPER_ADMIN" | "TEACHER" | "TECHNICIAN" | "SUPPLIER" | "RESOURCE_MANAGER" | "DEPARTMENT_HEAD";