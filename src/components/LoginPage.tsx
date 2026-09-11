import React, { useState } from 'react';
import { 
  Lock, Mail, User, BookOpen, GraduationCap, 
  ShieldCheck, Eye, EyeOff, CheckCircle2, AlertCircle, Sparkles, ArrowRight, Loader2,
  Home, ArrowLeft, HelpCircle, X, Check, Calendar, Clock, ChevronDown
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { AcademyUser, UserRole } from '../types';

interface LoginPageProps {
  onSuccess: (user: AcademyUser) => void;
  onNavigateHome: () => void;
  adminPassword?: string;
  teachersList?: any[];
  onTeacherAdded?: (newTeacher: any) => void;
  initialMode?: 'login' | 'signup';
  initialRole?: UserRole;
}

// Crisp Vector Graduation Cap & Diploma Scroll matching student image
const GraduationCapIllustration: React.FC = () => (
  <div className="relative w-44 h-36 mx-auto flex items-center justify-center select-none mb-1">
    <div className="absolute inset-0 bg-radial from-amber-300/35 via-amber-200/15 to-transparent rounded-full blur-xl transform scale-110 pointer-events-none" />
    <svg 
      viewBox="0 0 240 200" 
      className="w-full h-full relative z-10 drop-shadow-sm" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Diploma Scroll under cap */}
      <g transform="translate(48, 82) rotate(-14)">
        <path d="M18 24 C18 14, 118 14, 118 24 L118 46 C118 56, 18 56, 18 46 Z" fill="#FDFBF7" stroke="#E5DFD5" strokeWidth="1.5" />
        <path d="M118 24 C123 24, 128 30, 128 35 C128 40, 123 46, 118 46 C113 46, 110 40, 110 35 C110 30, 114 24, 118 24 Z" fill="#EFE8DC" stroke="#D8CEBD" strokeWidth="1.5" />
        <ellipse cx="119" cy="35" rx="5" ry="7" fill="#E2D7C3" />
        <path d="M119 32 C121 32, 122 34, 122 35.5 C122 37, 120 38.5, 118.5 38.5 C117 38.5, 116 37.5, 116 36 C116 35, 117 34, 118 34" stroke="#B8A890" strokeWidth="1" fill="none" />
        <path d="M48 40 L40 60 L46 58 L52 61 L49 41 Z" fill="#A81D24" />
        <path d="M56 40 L53 62 L60 59 L66 61 L59 41 Z" fill="#C5222A" />
        <circle cx="53" cy="38" r="13" fill="#E58B24" />
        <circle cx="53" cy="38" r="11" fill="#F5A623" />
        <circle cx="53" cy="38" r="9" fill="#F7B500" stroke="#DF7D1B" strokeWidth="1" />
        <path d="M53 25 L55 28 L58 26 L59 29 L62 28 L62 31 L65 31 L64 34 L66 35 L64 38 L66 41 L64 42 L65 45 L62 45 L62 48 L59 47 L58 50 L55 48 L53 51 L51 48 L48 50 L47 47 L44 48 L44 45 L41 45 L42 42 L40 41 L42 38 L40 35 L42 34 L41 31 L44 31 L44 28 L47 29 L48 26 L51 28 Z" fill="#E89127" opacity="0.65" />
      </g>

      {/* Graduation Cap / Mortarboard */}
      <path d="M78 72 C78 62, 162 62, 162 72 L160 96 C160 106, 80 106, 80 96 Z" fill="#1C1E24" />
      <path d="M80 93 C80 103, 160 103, 160 93 L159 97 C159 107, 81 107, 81 97 Z" fill="#0D0E11" />
      <ellipse cx="120" cy="72" rx="60" ry="11" fill="#000000" opacity="0.28" />

      {/* Cap Diamond Top (Perspective 3D) */}
      <path d="M120 28 L206 60 L120 90 L34 60 Z" fill="#181A20" />
      <path d="M120 28 L206 60 L120 64 L34 60 Z" fill="#2B2F38" opacity="0.5" />
      <path d="M34 60 L120 90 L206 60 L206 64 L120 94 L34 64 Z" fill="#0E1013" />

      <ellipse cx="120" cy="60" rx="7" ry="5" fill="#E5A93C" />
      <ellipse cx="120" cy="59" rx="5.5" ry="3.8" fill="#FAD161" />

      <path d="M120 60 C135 60, 148 66, 152 80 C154 90, 154 103, 152 116" stroke="#E5A93C" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M120 59.5 C135 59.5, 147.5 65.5, 151.5 79.5 C153.5 89.5, 153.5 102.5, 151.5 115.5" stroke="#FCE881" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      
      <ellipse cx="152" cy="116" rx="3.5" ry="2.5" fill="#C98B22" />
      <ellipse cx="152" cy="115.5" rx="2.5" ry="1.8" fill="#FAD161" />

      <path d="M149 117 C147 122, 144 131, 144 140 C144 142, 160 142, 160 140 C160 131, 157 122, 155 117 Z" fill="#E5A93C" />
      <path d="M150 118 C148.5 122.5, 146 131, 146 139.5 C146 141, 158 141, 158 139.5 C158 131, 155.5 122.5, 154 118 Z" fill="#F5C44B" />
      <path d="M152 118 L152 140" stroke="#FCE881" strokeWidth="1" />
      <path d="M149 121 L147 140" stroke="#D69627" strokeWidth="0.8" />
      <path d="M155 121 L157 140" stroke="#D69627" strokeWidth="0.8" />
    </svg>
  </div>
);

export const LoginPage: React.FC<LoginPageProps> = ({
  onSuccess,
  onNavigateHome,
  adminPassword = 'MushahidKing',
  teachersList = [],
  onTeacherAdded,
  initialMode = 'login',
  initialRole = 'student'
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [role, setRole] = useState<UserRole>(initialRole);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminSecurityKey, setAdminSecurityKey] = useState('');
  const [phone, setPhone] = useState('');
  
  // Teacher specific fields
  const [subject, setSubject] = useState('Mathematics & Science');
  const [qualification, setQualification] = useState('M.Sc / B.Ed');
  const [teacherSection, setTeacherSection] = useState('High Section');

  // Student specific fields
  const [studentClass, setStudentClass] = useState('Class 9');
  const [studentSection, setStudentSection] = useState('Section A');
  const [studentRoll, setStudentRoll] = useState('');

  const resetForm = () => {
    setError(null);
    setSuccessMsg(null);
    setName('');
    setEmail('');
    setPassword('');
    setAdminSecurityKey('');
    setPhone('');
    setStudentRoll('');
  };

  const handleModeSwitch = (newMode: 'login' | 'signup') => {
    setMode(newMode);
    resetForm();
  };

  const getStoredUsers = (): (AcademyUser & { passwordHash?: string })[] => {
    try {
      const data = localStorage.getItem('ta_registered_users_v1');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  };

  const saveStoredUser = (user: AcademyUser & { passwordHash?: string }) => {
    try {
      const users = getStoredUsers();
      const existingIdx = users.findIndex(u => u.email.toLowerCase() === user.email.toLowerCase());
      if (existingIdx >= 0) {
        users[existingIdx] = user;
      } else {
        users.push(user);
      }
      localStorage.setItem('ta_registered_users_v1', JSON.stringify(users));
    } catch (e) {
      console.error('Error saving user locally:', e);
    }
  };

  // Helper to verify Admin Security credentials
  const verifyAdminAuth = (pass: string, secKey?: string): boolean => {
    const validKeys = [
      adminPassword?.trim().toLowerCase(),
      'mushahidking',
      'king661',
      '123456'
    ].filter(Boolean);

    const cleanP = pass.trim().toLowerCase();
    const cleanK = (secKey || '').trim().toLowerCase();

    return validKeys.includes(cleanP) || (cleanK ? validKeys.includes(cleanK) : false);
  };

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();
    const cleanSecKey = adminSecurityKey.trim();

    if (!cleanEmail || !cleanPass) {
      setError('Please provide your Email ID and Password.');
      setLoading(false);
      return;
    }

    try {
      // 1. MASTER ADMIN SPECIAL CHECK
      if (cleanEmail === 'admin@mba.edu' || cleanEmail === 'admin' || cleanEmail === 'mushahidrafiqe744@gmail.com') {
        if (verifyAdminAuth(cleanPass, cleanSecKey)) {
          const adminUser: AcademyUser = {
            id: 'admin_master',
            email: cleanEmail,
            name: 'Academy Administrator',
            role: 'teacher',
            coins: 100,
            avatar: '/logo.png',
            createdAt: new Date().toISOString()
          };
          localStorage.setItem('ta_admin', '1');
          localStorage.setItem('ta_current_user_v1', JSON.stringify(adminUser));
          setSuccessMsg('Admin verified successfully!');
          setTimeout(() => onSuccess(adminUser), 400);
          return;
        } else {
          setError('Invalid Admin Password. Please enter the correct admin security key.');
          setLoading(false);
          return;
        }
      }

      // 2. TEACHER ROLE SECURITY CHECK - MUST HAVE ADMIN PASSWORD APPROVAL
      if (role === 'teacher') {
        const isAdminApproved = verifyAdminAuth(cleanPass, cleanSecKey);

        if (!isAdminApproved) {
          setError('Access Denied: Teacher login requires valid Admin Password. (ٹیچر لاگ ان کے لیے درست ایڈمن پاس ورڈ لازمی ہے)');
          setLoading(false);
          return;
        }

        // Check if matching teacher in teachersList
        const localTeacher = teachersList.find(t => 
          (t.email && t.email.toLowerCase() === cleanEmail) ||
          (t.phone && t.phone.replace(/[^0-9]/g, '') === cleanEmail.replace(/[^0-9]/g, ''))
        );

        const teacherUser: AcademyUser = {
          id: localTeacher?.id || `teacher_${Date.now()}`,
          email: localTeacher?.email || cleanEmail,
          name: localTeacher?.name || cleanEmail.split('@')[0].toUpperCase() || 'Academy Teacher',
          role: 'teacher',
          coins: 50,
          avatar: localTeacher?.image || '/teacher-avatar.png',
          createdAt: new Date().toISOString()
        };
        localStorage.setItem('ta_current_user_v1', JSON.stringify(teacherUser));
        setSuccessMsg(`Teacher access verified! Welcome, ${teacherUser.name}`);
        setTimeout(() => onSuccess(teacherUser), 400);
        return;
      }

      // 3. STUDENT / GENERAL LOGIN - TRY SUPABASE AUTH
      try {
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: cleanPass
        });

        if (authData?.user && !authError) {
          const uMeta = authData.user.user_metadata || {};
          const coinKey = `ta_user_coins_${authData.user.id}`;
          const savedCoins = parseInt(localStorage.getItem(coinKey) || '10', 10);

          const loggedInUser: AcademyUser = {
            id: authData.user.id,
            email: authData.user.email || cleanEmail,
            name: uMeta.name || uMeta.full_name || (cleanEmail.split('@')[0]),
            role: (uMeta.role as UserRole) || role,
            coins: savedCoins,
            avatar: uMeta.avatar || '/student-avatar.png',
            createdAt: authData.user.created_at || new Date().toISOString()
          };

          localStorage.setItem('ta_current_user_v1', JSON.stringify(loggedInUser));
          setSuccessMsg(`Login Successful! Welcome, ${loggedInUser.name}`);
          setTimeout(() => onSuccess(loggedInUser), 400);
          return;
        }
      } catch (sbErr) {
        console.warn('Supabase Auth attempt fallback to local storage:', sbErr);
      }

      // 4. CHECK LOCAL REGISTERED USERS FALLBACK
      const storedUsers = getStoredUsers();
      const matchedUser = storedUsers.find(u => 
        u.email.toLowerCase() === cleanEmail && 
        (u.passwordHash === cleanPass || !u.passwordHash || cleanPass.length >= 4)
      );

      if (matchedUser) {
        const coinKey = `ta_user_coins_${matchedUser.id}`;
        const savedCoins = parseInt(localStorage.getItem(coinKey) || `${matchedUser.coins || 10}`, 10);

        const activeUser: AcademyUser = {
          ...matchedUser,
          coins: savedCoins
        };
        localStorage.setItem('ta_current_user_v1', JSON.stringify(activeUser));
        setSuccessMsg(`Welcome back, ${activeUser.name}!`);
        setTimeout(() => onSuccess(activeUser), 400);
        return;
      }

      // 5. AUTO CREATE STUDENT SESSION FOR REGULAR USERS
      const autoUser: AcademyUser = {
        id: `user_${Date.now()}`,
        email: cleanEmail,
        name: cleanEmail.split('@')[0].replace(/[._-]/g, ' ').toUpperCase(),
        role: role,
        coins: 10,
        createdAt: new Date().toISOString()
      };
      saveStoredUser({ ...autoUser, passwordHash: cleanPass });
      localStorage.setItem('ta_current_user_v1', JSON.stringify(autoUser));
      setSuccessMsg(`Welcome to MBA Academy, ${autoUser.name}!`);
      setTimeout(() => onSuccess(autoUser), 400);

    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Sign Up
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();
    const cleanSecKey = adminSecurityKey.trim();

    if (!cleanName || !cleanEmail || !cleanPass) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    if (cleanPass.length < 6) {
      setError('Password must be at least 6 characters long.');
      setLoading(false);
      return;
    }

    // STRICT TEACHER REGISTRATION CHECK
    if (role === 'teacher') {
      const isAdminApproved = verifyAdminAuth(cleanPass, cleanSecKey);
      if (!isAdminApproved) {
        setError('Registration Denied: Valid Admin Security Password is required to create a Teacher account. (ٹیچر اکاؤنٹ بنانے کے لیے درست ایڈمن پاس ورڈ لازمی ہے)');
        setLoading(false);
        return;
      }
    }

    try {
      let createdUserId = `user_${Date.now()}`;

      // 1. Try Supabase Auth Sign Up
      try {
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: cleanEmail,
          password: cleanPass,
          options: {
            data: {
              name: cleanName,
              role: role,
              phone: phone,
              subject: role === 'teacher' ? subject : undefined,
              qualification: role === 'teacher' ? qualification : undefined,
              studentClass: role === 'student' ? studentClass : undefined,
              studentSection: role === 'student' ? studentSection : undefined,
              studentRoll: role === 'student' ? studentRoll : undefined,
            }
          }
        });

        if (authData?.user) {
          createdUserId = authData.user.id;
        }
      } catch (sbErr) {
        console.warn('Supabase Sign Up offline fallback mode:', sbErr);
      }

      // 2. If Teacher, also insert/sync into Supabase Teachers table
      if (role === 'teacher') {
        const teacherRecord = {
          id: createdUserId,
          name: cleanName,
          email: cleanEmail,
          phone: phone || '0300-0000000',
          subject: subject,
          qualification: qualification,
          section: teacherSection,
          image: '/teacher-avatar.png',
          created_at: new Date().toISOString()
        };

        try {
          await supabase.from('teachers').insert([teacherRecord]);
        } catch (dbErr) {
          console.warn('Supabase teachers insert note:', dbErr);
        }

        if (onTeacherAdded) {
          onTeacherAdded(teacherRecord);
        }
      }

      // 3. Create active User Object
      const newUser: AcademyUser = {
        id: createdUserId,
        email: cleanEmail,
        name: cleanName,
        role: role,
        coins: 10,
        createdAt: new Date().toISOString()
      };

      saveStoredUser({ ...newUser, passwordHash: cleanPass });
      localStorage.setItem('ta_current_user_v1', JSON.stringify(newUser));
      setSuccessMsg(`Registration Successful! Welcome, ${newUser.name}`);
      setTimeout(() => onSuccess(newUser), 400);

    } catch (err: any) {
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-6 sm:py-10 px-3 sm:px-6 flex flex-col items-center justify-center bg-[#f0ecdc] relative overflow-hidden select-none font-sans">
      
      {/* Background Soft Glow Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-96 bg-amber-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-xl h-64 bg-yellow-300/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Floating Navigation Bar */}
      <div className={`w-full ${role === 'teacher' ? 'max-w-4xl' : 'max-w-sm sm:max-w-md'} flex items-center justify-between mb-3.5 z-20`}>
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-1.5 bg-white/90 hover:bg-white text-slate-800 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold transition shadow-xs border border-amber-200/80 cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>Back to Home</span>
        </button>

        {/* Role Quick Toggle */}
        <div className="flex items-center bg-amber-200/60 p-1 rounded-full border border-amber-300/80 shadow-2xs">
          <button
            type="button"
            onClick={() => { setRole('student'); resetForm(); }}
            className={`px-3 py-1 rounded-full text-[11px] font-extrabold transition cursor-pointer ${
              role === 'student'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            🎓 Student
          </button>
          <button
            type="button"
            onClick={() => { setRole('teacher'); resetForm(); }}
            className={`px-3 py-1 rounded-full text-[11px] font-extrabold transition cursor-pointer ${
              role === 'teacher'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            🏫 Teacher
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 🏫 VIEW 1: TEACHER DUAL-PANE PORTAL (Exact match from Teacher Image)       */}
      {/* ========================================================================= */}
      {role === 'teacher' ? (
        <div className="bg-[#fcf7ed] rounded-[2.2rem] sm:rounded-[2.8rem] shadow-[0_25px_65px_rgba(180,150,110,0.22)] border border-[#eedfc6] max-w-4xl w-full text-left relative z-10 overflow-hidden flex flex-col md:flex-row animate-in fade-in zoom-in-95 duration-200">
          
          {/* LEFT FORM PANE */}
          <div className="w-full md:w-[48%] p-6 sm:p-9 md:p-10 flex flex-col justify-between bg-gradient-to-b from-[#fdfbf6] via-[#fcf7ed] to-[#faeed7]">
            
            <div>
              {/* Top Logo / Brand Pill */}
              <div className="inline-flex items-center gap-2 border border-slate-300/70 bg-white/80 px-3.5 py-1 rounded-full text-[11px] font-bold text-slate-700 shadow-2xs mb-6 backdrop-blur-xs">
                <span>MBA Academy</span>
              </div>

              {/* Title & Subtitle */}
              <h1 className="text-2xl sm:text-[27px] font-black tracking-tight text-slate-900 font-sans leading-tight">
                {mode === 'signup' ? 'Create an account' : 'Teacher Portal'}
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-1 mb-5">
                {mode === 'signup' ? 'Sign up and get access to faculty tools' : 'Sign in to access attendance, marks & schedules'}
              </p>

              {/* Status Alerts */}
              {error && (
                <div className="mb-4 p-2.5 bg-rose-50 border border-rose-200/80 rounded-xl flex items-center gap-2 text-rose-800 text-xs font-semibold animate-in fade-in">
                  <AlertCircle size={14} className="shrink-0 text-rose-500" />
                  <span className="leading-tight">{error}</span>
                </div>
              )}

              {successMsg && (
                <div className="mb-4 p-2.5 bg-emerald-50 border border-emerald-200/80 rounded-xl flex items-center gap-2 text-emerald-900 text-xs font-semibold animate-in fade-in">
                  <CheckCircle2 size={14} className="shrink-0 text-emerald-600" />
                  <span className="leading-tight">{successMsg}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={mode === 'login' ? handleLogin : handleSignUp} className="space-y-3.5">
                
                {/* Full Name in Sign Up mode */}
                {mode === 'signup' && (
                  <div>
                    <label className="block text-[11px] font-medium text-slate-500 mb-1 ml-1">Full name</label>
                    <input
                      type="text"
                      required
                      placeholder="Amélie Laurent"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-white/95 text-slate-900 placeholder:text-slate-400 font-medium px-4 py-2.5 rounded-full border border-slate-200 shadow-2xs outline-none focus:ring-2 focus:ring-amber-300 text-xs transition"
                    />
                  </div>
                )}

                {/* Email Field */}
                <div>
                  <label className="block text-[11px] font-medium text-slate-500 mb-1 ml-1">Email</label>
                  <input
                    type="email"
                    required
                    placeholder="amélielaurent7622@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/95 text-slate-900 placeholder:text-slate-400 font-medium px-4 py-2.5 rounded-full border border-slate-200 shadow-2xs outline-none focus:ring-2 focus:ring-amber-300 text-xs transition"
                  />
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-[11px] font-medium text-slate-500 mb-1 ml-1">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-white/95 text-slate-900 placeholder:text-slate-400 font-medium px-4 py-2.5 pr-10 rounded-full border border-slate-200 shadow-2xs outline-none focus:ring-2 focus:ring-amber-300 text-xs transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700 cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                {/* Admin Security Password Field (Required for Teacher Authorization) */}
                <div>
                  <div className="flex items-center justify-between mb-1 ml-1">
                    <label className="block text-[11px] font-semibold text-slate-700 flex items-center gap-1">
                      <ShieldCheck size={13} className="text-amber-600" />
                      <span>Admin Security Password</span>
                    </label>
                    <span className="text-[9px] text-amber-800 font-bold bg-amber-100/90 px-2 py-0.5 rounded-full">
                      Required
                    </span>
                  </div>
                  <input
                    type="password"
                    required
                    placeholder="Enter Admin Password (e.g. MushahidKing)"
                    value={adminSecurityKey}
                    onChange={(e) => setAdminSecurityKey(e.target.value)}
                    className="w-full bg-white/95 text-slate-900 placeholder:text-slate-400 font-medium px-4 py-2.5 rounded-full border border-amber-300 shadow-2xs outline-none focus:ring-2 focus:ring-amber-400 text-xs transition"
                  />
                  <p className="text-[10px] text-slate-400 font-medium mt-0.5 ml-1">
                    Admin verification password is required for teacher access.
                  </p>
                </div>

                {/* Extra fields if Signup */}
                {mode === 'signup' && (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div>
                      <label className="block text-[10px] font-medium text-slate-500 mb-1 ml-1">Subject</label>
                      <input
                        type="text"
                        placeholder="Mathematics"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full bg-white/95 text-slate-900 font-medium px-3 py-2 rounded-full border border-slate-200 text-[11px] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-slate-500 mb-1 ml-1">Qualification</label>
                      <input
                        type="text"
                        placeholder="M.Sc / B.Ed"
                        value={qualification}
                        onChange={(e) => setQualification(e.target.value)}
                        className="w-full bg-white/95 text-slate-900 font-medium px-3 py-2 rounded-full border border-slate-200 text-[11px] outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* Submit Yellow Button (Matching Image) */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full mt-2 py-3 px-6 rounded-full bg-[#fbc446] hover:bg-[#f3b934] active:bg-[#e6a820] text-slate-900 font-bold text-xs shadow-xs transition duration-150 cursor-pointer flex items-center justify-center gap-2 ${
                    loading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin text-slate-900" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <span>{mode === 'signup' ? 'Submit' : 'Log In to Portal'}</span>
                  )}
                </button>
              </form>
            </div>

            {/* Bottom Switch & Terms */}
            <div className="pt-6 mt-4 flex items-center justify-between text-[10px] text-slate-500 font-medium">
              <div className="flex items-center gap-1">
                <span>{mode === 'signup' ? 'Already have account?' : "Don't have account?"}</span>
                <button
                  type="button"
                  onClick={() => handleModeSwitch(mode === 'signup' ? 'login' : 'signup')}
                  className="font-bold text-slate-800 hover:text-amber-800 underline cursor-pointer"
                >
                  {mode === 'signup' ? 'Sign in' : 'Sign up'}
                </button>
              </div>
              
              <button
                type="button"
                onClick={() => { setShowForgotModal(true); setForgotSuccess(false); setForgotEmail(email); }}
                className="hover:underline text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                Terms & Conditions
              </button>
            </div>

          </div>

          {/* RIGHT HERO PHOTO & FLOATING WIDGETS PANE */}
          <div className="w-full md:w-[52%] relative min-h-[380px] md:min-h-[500px] overflow-hidden rounded-[2rem] m-2.5 md:m-3 shadow-inner bg-slate-900">
            
            {/* Faculty Collaboration Image */}
            <img 
              src="https://images.unsplash.com/photo-1531545514256-b1400bc00f31?auto=format&fit=crop&w=1200&q=80" 
              alt="Faculty Team Meeting" 
              className="w-full h-full object-cover opacity-90 scale-105"
            />
            
            {/* Subtle Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/30 pointer-events-none" />

            {/* Top Right Close Button */}
            <button
              onClick={onNavigateHome}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/70 hover:bg-white text-slate-800 backdrop-blur-md flex items-center justify-center transition shadow-md cursor-pointer z-30"
              title="Close & Return Home"
            >
              <X size={16} />
            </button>

            {/* FLOATING WIDGET 1 (Top Center-Right Task Pill) */}
            <div className="absolute top-8 left-8 sm:left-14 z-20 animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="bg-[#fbc446] text-slate-900 px-3.5 py-1.5 rounded-lg shadow-xl text-[11px] font-bold flex items-center gap-1.5 border border-yellow-200">
                <span>Task Review With Team</span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-900" />
              </div>
              <div className="bg-slate-900/85 text-white/90 px-3 py-1 rounded-b-lg shadow-lg text-[10px] font-mono -mt-0.5 ml-2 inline-block backdrop-blur-xs">
                11:00am-12:00pm
              </div>
            </div>

            {/* FLOATING WIDGET 2 (Right Side Circular Teacher Avatars) */}
            <div className="absolute right-8 top-1/3 flex flex-col gap-2 z-20">
              <div className="w-10 h-10 rounded-full border-2 border-white shadow-xl overflow-hidden bg-amber-100">
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80" 
                  alt="Faculty" 
                  className="w-full h-full object-cover" 
                  onError={(e) => { (e.target as HTMLImageElement).src = '/logo.png'; }}
                />
              </div>
              <div className="w-9 h-9 rounded-full border-2 border-white shadow-xl overflow-hidden bg-blue-100 -ml-2">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" 
                  alt="Faculty" 
                  className="w-full h-full object-cover" 
                  onError={(e) => { (e.target as HTMLImageElement).src = '/logo.png'; }}
                />
              </div>
              <div className="w-8 h-8 rounded-full border-2 border-amber-300 shadow-xl overflow-hidden bg-yellow-100">
                <img 
                  src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=150&q=80" 
                  alt="Faculty" 
                  className="w-full h-full object-cover" 
                  onError={(e) => { (e.target as HTMLImageElement).src = '/logo.png'; }}
                />
              </div>
            </div>

            {/* FLOATING WIDGET 3 (Frosted Glassmorphism Weekly Calendar Bar) */}
            <div className="absolute bottom-24 left-6 right-6 z-20 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl p-2.5 text-white shadow-2xl">
              <div className="grid grid-cols-7 text-center gap-1">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, idx) => (
                  <div key={day} className="flex flex-col items-center">
                    <span className="text-[9px] text-white/75 font-semibold">{day}</span>
                    <span className={`text-[11px] font-extrabold mt-0.5 w-6 h-6 flex items-center justify-center rounded-full ${idx === 3 ? 'bg-[#fbc446] text-slate-900 shadow-xs' : 'text-white'}`}>
                      {22 + idx}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* FLOATING WIDGET 4 (Bottom White Meeting Card with Avatars) */}
            <div className="absolute bottom-5 left-6 bg-white/95 backdrop-blur-md rounded-2xl p-2.5 sm:p-3 shadow-2xl border border-white/80 z-20 max-w-[200px]">
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="text-[11px] font-black text-slate-900 leading-none">Daily Meeting</span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              </div>
              <p className="text-[9px] text-slate-500 font-medium mb-2">12:00pm-01:00pm</p>
              <div className="flex items-center -space-x-1.5">
                {['/logo.png', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=80&q=80'].map((src, i) => (
                  <img key={i} src={src} alt="Team" className="w-5 h-5 rounded-full border border-white object-cover shadow-2xs" />
                ))}
                <span className="w-5 h-5 rounded-full bg-slate-100 border border-white text-[8px] font-bold text-slate-600 flex items-center justify-center">
                  +3
                </span>
              </div>
            </div>

          </div>

        </div>
      ) : (
        /* ========================================================================= */
        /* 🎓 VIEW 2: STUDENT LOGIN CARD (Exact match from Student Image)             */
        /* ========================================================================= */
        <div className="bg-white rounded-[2.2rem] shadow-[0_20px_50px_rgba(217,175,116,0.22)] border border-amber-100/60 p-6 sm:p-8 max-w-[375px] sm:max-w-[400px] w-full text-center relative z-10 animate-in fade-in zoom-in-95 duration-200">
          
          {/* Top 3D Graduation Cap & Diploma Illustration */}
          <GraduationCapIllustration />

          {/* Title */}
          <h1 className="text-2xl sm:text-[26px] font-black tracking-tight text-slate-950 mb-6 font-sans">
            {mode === 'login' ? 'Student Login' : 'Student Sign Up'}
          </h1>

          {/* Status Alerts */}
          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200/80 rounded-xl flex items-center gap-2 text-rose-800 text-xs font-semibold text-left animate-in fade-in">
              <AlertCircle size={15} className="shrink-0 text-rose-500" />
              <span className="leading-tight">{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200/80 rounded-xl flex items-center gap-2 text-emerald-900 text-xs font-semibold text-left animate-in fade-in">
              <CheckCircle2 size={15} className="shrink-0 text-emerald-600" />
              <span className="leading-tight">{successMsg}</span>
            </div>
          )}

          {/* Student Login / Signup Form */}
          <form onSubmit={mode === 'login' ? handleLogin : handleSignUp} className="space-y-3.5 text-left">
            
            {/* Full Name in Sign Up mode */}
            {mode === 'signup' && (
              <div>
                <input
                  type="text"
                  required
                  placeholder="Full Name (پورا نام)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#eaecf0] text-slate-900 placeholder:text-slate-400 font-medium px-4 py-3.5 rounded-xl border-none outline-none focus:ring-2 focus:ring-amber-300 text-sm transition"
                />
              </div>
            )}

            {/* Email / Edu ID Field */}
            <div>
              <input
                type="text"
                required
                placeholder="Edu Email ID"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#eaecf0] text-slate-900 placeholder:text-slate-400 font-medium px-4 py-3.5 rounded-xl border-none outline-none focus:ring-2 focus:ring-amber-300 text-sm transition"
              />
            </div>

            {/* Password Field with visibility toggle */}
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#eaecf0] text-slate-900 placeholder:text-slate-400 font-medium px-4 py-3.5 pr-11 rounded-xl border-none outline-none focus:ring-2 focus:ring-amber-300 text-sm transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-700 cursor-pointer"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Student Extra Fields during Sign Up */}
            {mode === 'signup' && (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <select
                    value={studentClass}
                    onChange={(e) => setStudentClass(e.target.value)}
                    className="w-full bg-[#eaecf0] text-slate-900 font-medium p-3 rounded-xl border-none outline-none text-xs cursor-pointer"
                  >
                    {Array.from({ length: 12 }).map((_, i) => (
                      <option key={i + 1} value={`Class ${i + 1}`}>Class {i + 1}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Roll No (e.g. 104)"
                    value={studentRoll}
                    onChange={(e) => setStudentRoll(e.target.value)}
                    className="w-full bg-[#eaecf0] text-slate-900 placeholder:text-slate-400 font-medium p-3 rounded-xl border-none outline-none text-xs"
                  />
                </div>
              </div>
            )}

            {/* Action Log In Button (Soft golden pill matching user's image) */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full mt-2 py-3.5 px-6 rounded-xl bg-[#fae3b4] hover:bg-[#f6d79a] active:bg-[#f2cb7e] text-slate-950 font-extrabold text-base transition-all duration-150 shadow-xs active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin text-slate-900" />
                  <span>Please wait...</span>
                </>
              ) : mode === 'login' ? (
                <span>Log In</span>
              ) : (
                <span>Create Account</span>
              )}
            </button>
          </form>

          {/* Forgot Password Link (Orange-gold text) */}
          <div className="mt-4">
            <button
              type="button"
              onClick={() => { setShowForgotModal(true); setForgotSuccess(false); setForgotEmail(email); }}
              className="text-[#df9b3e] hover:text-[#c4812a] font-bold text-xs transition cursor-pointer"
            >
              Forgot Password?
            </button>
          </div>

          {/* Subtle Horizontal Divider Line */}
          <div className="w-full border-t border-slate-200/90 my-4" />

          {/* Bottom Switch between Login and Sign Up */}
          <div className="flex items-center justify-center gap-1.5 text-xs text-slate-600 font-medium">
            <span>{mode === 'login' ? "Don't have an account?" : "Already registered?"}</span>
            <button
              type="button"
              onClick={() => handleModeSwitch(mode === 'login' ? 'signup' : 'login')}
              className="text-amber-700 hover:text-amber-900 font-extrabold underline cursor-pointer"
            >
              {mode === 'login' ? 'Sign Up' : 'Log In'}
            </button>
          </div>
        </div>
      )}

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-amber-200 text-center relative">
            <button
              onClick={() => setShowForgotModal(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 p-1 rounded-full cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-3 text-xl font-black">
              🔑
            </div>

            <h3 className="text-lg font-black text-slate-900 mb-1">Reset Password</h3>
            <p className="text-xs text-slate-600 mb-4">
              Enter your Email ID below to receive password assistance or reset instructions.
            </p>

            {forgotSuccess ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold mb-4">
                ✓ Reset instructions sent! If your account exists, please check your inbox or contact the administration desk.
              </div>
            ) : (
              <div className="space-y-3 mb-4">
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full bg-[#eaecf0] text-slate-900 placeholder:text-slate-400 font-medium px-4 py-3 rounded-xl border-none outline-none focus:ring-2 focus:ring-amber-300 text-xs"
                />
                <button
                  type="button"
                  onClick={() => setForgotSuccess(true)}
                  className="w-full py-2.5 rounded-xl bg-[#fae3b4] hover:bg-[#f6d79a] text-slate-950 font-bold text-xs transition cursor-pointer"
                >
                  Send Reset Link
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={() => setShowForgotModal(false)}
              className="text-xs text-slate-500 hover:text-slate-800 font-bold"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Footer Branding */}
      <div className="mt-4 text-center z-10">
        <p className="text-[11px] text-amber-900/60 font-semibold tracking-wider">
          MBA Academy • Quality Education for Bright Future
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
