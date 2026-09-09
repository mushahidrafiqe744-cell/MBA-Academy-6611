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
