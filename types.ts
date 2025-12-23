
export enum UserRole {
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT'
}

export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  PERMISSION = 'PERMISSION'
}

export enum PermissionStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole.TEACHER;
}

export interface Class {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
}

export interface Student {
  id: string;
  name: string;
  dob: string;
  origin: string;
  phone: string;
  classId: string;
  address?: string;
  emergencyContact?: string;
  photo?: string;
  isArchived: boolean;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  classId: string;
  date: string;
  status: AttendanceStatus;
  note?: string;
  locked: boolean;
  editHistory?: AuditLog[];
}

export interface PermissionRequest {
  id: string;
  studentId: string;
  classId: string;
  date: string;
  reason: string;
  status: PermissionStatus;
  teacherComment?: string;
  createdAt: string;
}

export interface AuditLog {
  timestamp: string;
  userId: string;
  action: string;
  reason?: string;
}

export interface AppState {
  users: UserAccount[];
  classes: Class[];
  students: Student[];
  attendance: AttendanceRecord[];
  permissions: PermissionRequest[];
  currentUser: {
    id: string;
    role: UserRole;
    name: string;
    studentId?: string;
  } | null;
}
