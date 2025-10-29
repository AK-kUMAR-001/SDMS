export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "dean" | "hod" | "faculty" | "student";
  department: string;
  status: "active" | "inactive";
  token?: string; // Add this line
  profilePicture?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  address?: string;
}

export type CertificateType = "course" | "webinar" | "workshop" | "internship" | "project" | "other";

export interface Certificate {
  id: string;
  title: string;
  type: CertificateType;
  studentId: string;
  studentName: string;
  fileUrl: string;
  issuedBy?: string;
  issuedDate?: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
  points: number;
  reviewedBy?: string;
  rejectionReason?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  action: string; // e.g., 'CERTIFICATE_APPROVED', 'USER_DEACTIVATED'
  targetType: 'user' | 'certificate' | 'role';
  targetId: string;
  details: Record<string, unknown>;
}