export type UserRole = 'student' | 'teacher' | 'admin';

export interface AcademyUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  subject?: string;        // For teachers
  qualification?: string;  // For teachers
  section?: string;        // For teachers or students
  studentClass?: string;   // For students
  rollNumber?: string;     // For students
  teacherDbId?: string | number; // ID synced with Supabase 'teachers' table
  coins?: number;                // Reward coins for login & activity
  createdAt: string;
}

export interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: AcademyUser) => void;
  initialMode?: 'login' | 'signup';
  adminPassword?: string;
  teachersList?: any[];
  onTeacherAdded?: (newTeacher: any) => void;
}

export interface FeeRecord {
  id: string;
  receiptNo: string;
  studentName: string;
  rollNo: string;
  className: string;
  section?: string;
  parentName?: string;
  phone?: string;
  month: string;       // e.g. "March 2026"
  year: number;        // e.g. 2026
  feeAmount: number;   // e.g. 2500
  discount: number;    // e.g. 0
  netAmount: number;   // e.g. 2500
  status: 'paid' | 'pending';
  paidDate?: string;   // e.g. "2026-03-05"
  paymentMethod?: 'Cash' | 'JazzCash' | 'EasyPaisa' | 'Bank Transfer' | 'Online';
  collectedBy?: string;
  notes?: string;
  createdAt: string;
}
