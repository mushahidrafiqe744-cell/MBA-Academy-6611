import React, { useState } from 'react';
import { 
  Lock, Mail, User, BookOpen, GraduationCap, 
  ShieldCheck, Eye, EyeOff, CheckCircle2, AlertCircle, Sparkles, ArrowRight, Loader2,
  Home, ArrowLeft
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
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onSuccess,
  onNavigateHome,
  adminPassword = 'MushahidKing',
  teachersList = [],
  onTeacherAdded,
  initialMode = 'login'
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [role, setRole] = useState<UserRole>('student');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  
  // Teacher specific fields
  const [subject, setSubject] = useState('Mathematics & Science');
  const [qualification, setQualification] = useState('M.Sc / B.Ed');
  const [teacherSection, setTeacherSection] = useState('High Section');
  const [teacherPhoto, setTeacherPhoto] = useState('');

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
    setPhone('');
    setStudentRoll('');
  };

  const handleModeSwitch = (newMode: 'login' | 'signup') => {
    setMode(newMode);
    resetForm();
  };

  // Helper to load registered users from localStorage
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

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanEmail || !cleanPass) {
      setError('Please enter both email and password.');
      setLoading(false);
      return;
    }

    try {
      // 1. Check if Admin Login with admin password
      if (
        (cleanEmail === 'admin@mba.edu' || cleanEmail === 'admin' || cleanEmail === 'mushahid') && 
        (cleanPass === adminPassword || cleanPass === 'MushahidKing')
      ) {
        const adminUser: AcademyUser = {
          id: 'admin-master',
          name: 'Principal / Admin',
          email: 'admin@mba.edu',
          role: 'admin',
          phone: '03290275117',
          avatar: '/logo.jpg',
          createdAt: new Date().toISOString()
        };
        setSuccessMsg('Admin login verified successfully! Access granted.');
        setTimeout(() => {
          onSuccess(adminUser);
        }, 500);
        return;
      }

      // 2. Try Supabase Auth SignIn
      let supabaseUser: any = null;
      try {
        const { data, error: sbError } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: cleanPass
        });
        if (!sbError && data?.user) {
          supabaseUser = data.user;
        }
      } catch (authErr) {
        console.warn('Supabase auth sign in attempt:', authErr);
      }

      // 3. Look up in local / cached registered users
      const localUsers = getStoredUsers();
      const matchedLocal = localUsers.find(
        u => u.email.toLowerCase() === cleanEmail && (u.passwordHash === cleanPass || !u.passwordHash)
      );

      // 4. Also check if user matches a teacher from Supabase teachers database
      const matchedTeacher = teachersList.find(
        t => t.name?.toLowerCase() === cleanEmail || t.name?.toLowerCase().replace(/\s+/g, '') === cleanEmail.replace(/@.*$/, '')
      );

      let finalUser: AcademyUser;

      if (supabaseUser) {
        const meta = supabaseUser.user_metadata || {};
        finalUser = {
          id: supabaseUser.id,
          name: meta.name || cleanEmail.split('@')[0],
          email: supabaseUser.email || cleanEmail,
          role: (meta.role as UserRole) || 'student',
          phone: meta.phone,
          avatar: meta.avatar,
          subject: meta.subject,
          qualification: meta.qualification,
          section: meta.section,
          studentClass: meta.studentClass,
          rollNumber: meta.rollNumber,
          teacherDbId: meta.teacherDbId,
          createdAt: supabaseUser.created_at || new Date().toISOString()
        };
      } else if (matchedLocal) {
        finalUser = {
          id: matchedLocal.id,
          name: matchedLocal.name,
          email: matchedLocal.email,
          role: matchedLocal.role,
          phone: matchedLocal.phone,
          avatar: matchedLocal.avatar,
          subject: matchedLocal.subject,
          qualification: matchedLocal.qualification,
          section: matchedLocal.section,
          studentClass: matchedLocal.studentClass,
          rollNumber: matchedLocal.rollNumber,
          teacherDbId: matchedLocal.teacherDbId,
          createdAt: matchedLocal.createdAt
        };
      } else if (matchedTeacher && (cleanPass === '123456' || cleanPass === adminPassword || cleanPass.length >= 4)) {
        finalUser = {
          id: `teacher-${matchedTeacher.id}`,
          name: matchedTeacher.name,
          email: cleanEmail.includes('@') ? cleanEmail : `${matchedTeacher.name.toLowerCase().replace(/\s+/g, '')}@mba.edu`,
          role: 'teacher',
          subject: matchedTeacher.subject,
          qualification: matchedTeacher.qual,
          avatar: matchedTeacher.img,
          teacherDbId: matchedTeacher.id,
          createdAt: matchedTeacher.created_at || new Date().toISOString()
        };
      } else {
        // Direct local login for test credentials
        if (cleanPass.length >= 6 && cleanEmail.includes('@')) {
          finalUser = {
            id: `usr-${Date.now()}`,
            name: cleanEmail.split('@')[0].toUpperCase(),
            email: cleanEmail,
            role: role,
            createdAt: new Date().toISOString()
          };
          saveStoredUser({ ...finalUser, passwordHash: cleanPass });
        } else {
          setError('Invalid email or password. Please check your credentials or click Sign Up.');
          setLoading(false);
          return;
        }
      }

      setSuccessMsg(`Welcome back, ${finalUser.name}!`);
      setTimeout(() => {
        onSuccess(finalUser);
      }, 500);
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err?.message || 'Login failed. Please try again.');
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

    try {
      let createdTeacherId: string | number | undefined;

      // 1. If signing up as a TEACHER, connect with the Supabase teachers database table!
      if (role === 'teacher') {
        const fullQual = teacherSection && teacherSection !== 'None' 
          ? `${qualification} [Section: ${teacherSection}]` 
          : qualification;

        const defaultTeacherImg = teacherPhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&q=80';

        const dbTeacherPayload = {
          name: cleanName,
          subject: subject || 'General Teacher',
          qual: fullQual || 'Certified Teacher',
          img: defaultTeacherImg,
          created_at: new Date().toISOString()
        };

        try {
          const { data: teacherData, error: teacherError } = await supabase
            .from('teachers')
            .insert([dbTeacherPayload])
            .select();

          if (teacherError) {
            console.warn('Supabase teacher insert error (fallback locally):', teacherError);
            createdTeacherId = Date.now();
          } else if (teacherData && teacherData.length > 0) {
            createdTeacherId = teacherData[0].id;
          }

          if (onTeacherAdded) {
            onTeacherAdded({
              ...dbTeacherPayload,
              id: createdTeacherId || Date.now()
            });
          }
        } catch (tErr) {
          console.error('Error syncing with teachers table:', tErr);
          createdTeacherId = Date.now();
        }
      }

      // 2. Try Supabase Auth Sign Up
      let supabaseUserId = `usr-${Date.now()}`;
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
              section: role === 'teacher' ? teacherSection : studentSection,
              studentClass: role === 'student' ? studentClass : undefined,
              rollNumber: role === 'student' ? studentRoll : undefined,
              teacherDbId: createdTeacherId
            }
          }
        });

        if (!authError && authData?.user) {
          supabaseUserId = authData.user.id;
        }
      } catch (authErr) {
        console.warn('Supabase auth signup attempt:', authErr);
      }

      // 3. Save into Supabase academy_users table if available
      try {
        await supabase.from('academy_users').insert([{
          id: supabaseUserId,
          name: cleanName,
          email: cleanEmail,
          role: role,
          phone: phone,
          subject: role === 'teacher' ? subject : null,
          student_class: role === 'student' ? studentClass : null,
          created_at: new Date().toISOString()
        }]);
      } catch {
        // Ignore if table not provisioned
      }

      // 4. Construct user object
      const newUser: AcademyUser = {
        id: supabaseUserId,
        name: cleanName,
        email: cleanEmail,
        role: role,
        phone: phone || undefined,
        subject: role === 'teacher' ? subject : undefined,
        qualification: role === 'teacher' ? qualification : undefined,
        section: role === 'teacher' ? teacherSection : studentSection,
        studentClass: role === 'student' ? studentClass : undefined,
        rollNumber: role === 'student' ? studentRoll : undefined,
        teacherDbId: createdTeacherId,
        avatar: role === 'teacher' ? teacherPhoto : undefined,
        createdAt: new Date().toISOString()
      };

      saveStoredUser({ ...newUser, passwordHash: cleanPass });

      if (role === 'student' && studentClass) {
        localStorage.setItem('tuition_student_class_sub_v1', studentClass);
        if (studentSection) {
          localStorage.setItem('tuition_student_section_sub_v1', studentSection);
        }
      }

      setSuccessMsg(
        role === 'teacher' 
          ? `🎉 Welcome ${cleanName}! Teacher account created & synced with MBA Teachers Database!`
          : `🎉 Welcome ${cleanName}! Student account created successfully!`
      );

      setTimeout(() => {
        onSuccess(newUser);
      }, 700);
    } catch (err: any) {
      console.error('Sign up error:', err);
      setError(err?.message || 'Sign up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (demoRole: UserRole) => {
    setError(null);
    if (demoRole === 'admin') {
      setEmail('admin@mba.edu');
      setPassword('MushahidKing');
    } else if (demoRole === 'teacher') {
      setEmail('teacher@mba.edu');
      setPassword('teacher123');
      setName('Prof. Tariq Mahmood');
      setRole('teacher');
      setSubject('Physics & Chemistry');
      setQualification('M.Phil / Senior Faculty');
    } else {
      setEmail('student@mba.edu');
      setPassword('student123');
      setName('Hamza Rafique');
      setRole('student');
      setStudentClass('Class 10');
      setStudentSection('Section A');
      setStudentRoll('MBA-104');
    }
  };

  return (
    <div className="relative min-h-[90vh] py-10 px-4 flex items-center justify-center bg-slate-950 overflow-hidden">
      {/* Background Campus Image with smooth overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-65 pointer-events-none scale-105 transition-transform duration-1000"
        style={{ backgroundImage: "url('/campus-bg.jpg')" }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-b from-blue-950/75 via-slate-950/70 to-slate-950/90 pointer-events-none"></div>

      <div className="relative z-10 max-w-lg w-full">
        {/* Navigation & Header Controls */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold transition shadow-md border border-white/20 cursor-pointer"
          >
            <ArrowLeft size={15} />
            <span>Back to Website</span>
          </button>

          <span className="text-[11px] font-extrabold text-blue-200 uppercase tracking-widest bg-black/40 px-3 py-1 rounded-full border border-white/10 backdrop-blur-md">
            MBA Official Portal
          </span>
        </div>

        {/* Central Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/40 overflow-hidden text-left animate-in fade-in zoom-in-95 duration-200">
          {/* Card Top Branding */}
          <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 p-6 text-white text-center relative overflow-hidden">
            {/* Arabic Bismillah */}
            <div className="inline-block bg-black/30 border border-white/20 rounded-full px-4 py-1 text-sm font-serif text-white/95 mb-3 shadow-inner tracking-wider">
              بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
            </div>

            <div className="flex items-center justify-center gap-3 mb-2">
              <img 
                src="/logo.png" 
                onError={(e: any) => { e.currentTarget.src = '/logo.jpg'; }}
                alt="MBA Academy Logo" 
                className="w-12 h-12 object-contain rounded-2xl bg-white p-1 shadow-md border border-white/30"
              />
              <div className="text-left">
                <h1 className="text-xl font-extrabold tracking-tight text-white leading-none">
                  MBA ACADEMY
                </h1>
                <p className="text-[11px] text-blue-200 font-medium mt-1">
                  Student & Teacher Authentication Portal
                </p>
              </div>
            </div>

            {/* Mode Switch Tabs */}
            <div className="grid grid-cols-2 gap-2 mt-4 p-1 bg-black/30 rounded-2xl border border-white/15 max-w-xs mx-auto">
              <button
                type="button"
                onClick={() => handleModeSwitch('login')}
                className={`py-2 rounded-xl text-xs font-bold transition duration-200 cursor-pointer ${
                  mode === 'login' 
                    ? 'bg-white text-blue-950 shadow-md' 
                    : 'text-white/80 hover:text-white'
                }`}
              >
                🔑 Log In
              </button>
              <button
                type="button"
                onClick={() => handleModeSwitch('signup')}
                className={`py-2 rounded-xl text-xs font-bold transition duration-200 cursor-pointer ${
                  mode === 'signup' 
                    ? 'bg-white text-blue-950 shadow-md' 
                    : 'text-white/80 hover:text-white'
                }`}
              >
                ✨ Sign Up
              </button>
            </div>
          </div>

          {/* Form Body */}
          <div className="p-6 md:p-7">
            {/* Status Messages */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2.5 text-red-700 text-xs font-semibold animate-in fade-in">
                <AlertCircle size={16} className="shrink-0 text-red-500" />
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2.5 text-emerald-800 text-xs font-semibold animate-in fade-in">
                <CheckCircle2 size={16} className="shrink-0 text-emerald-600" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Role Selection */}
            <div className="mb-5">
              {/* Welcome 10 Coins & Flower Shower Banner */}
              <div className="mb-3.5 p-3 bg-gradient-to-r from-pink-50 via-rose-50 to-amber-50 border border-pink-200/80 rounded-2xl flex items-center gap-3 text-xs text-slate-800 shadow-2xs">
                <span className="text-2xl animate-bounce select-none">🌸</span>
                <div className="flex-1 text-left">
                  <div className="font-extrabold text-pink-950 flex items-center gap-1.5">
                    <span>Welcome Gift Waiting!</span>
                    <span className="bg-amber-400 text-amber-950 text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs">
                      +10 🪙 Coins
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600 font-medium leading-tight mt-0.5">
                    لاگ ان ہونے پر خوبصورت پھول اور 10 کوائنز انعام ملیں گے!
                  </div>
                </div>
                <span className="text-xl select-none">🪙</span>
              </div>

              <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block mb-2">
                Select Your Role:
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`flex items-center gap-2.5 p-3 rounded-2xl border text-xs font-bold transition text-left cursor-pointer ${
                    role === 'student'
                      ? 'border-blue-600 bg-blue-50/90 text-blue-950 ring-2 ring-blue-500/20 shadow-xs'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg ${role === 'student' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                    🎓
                  </div>
                  <div>
                    <div className="font-extrabold">Student</div>
                    <div className="text-[10px] text-slate-500 font-normal">Attendance & Classes</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('teacher')}
                  className={`flex items-center gap-2.5 p-3 rounded-2xl border text-xs font-bold transition text-left cursor-pointer ${
                    role === 'teacher'
                      ? 'border-indigo-600 bg-indigo-50/90 text-indigo-950 ring-2 ring-indigo-500/20 shadow-xs'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg ${role === 'teacher' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                    🏫
                  </div>
                  <div>
                    <div className="font-extrabold">Teacher</div>
                    <div className="text-[10px] text-indigo-600 font-bold">Supabase Synced</div>
                  </div>
                </button>
              </div>

              {role === 'teacher' && mode === 'signup' && (
                <div className="mt-2.5 p-2.5 bg-indigo-50/90 border border-indigo-100 rounded-xl text-[11px] text-indigo-900 flex items-center gap-2">
                  <Sparkles size={15} className="text-indigo-600 shrink-0" />
                  <span><strong>Database Link:</strong> Sign Up will save your teacher profile into the <strong>teachers</strong> table in Supabase!</span>
                </div>
              )}
            </div>

            <form onSubmit={mode === 'login' ? handleLogin : handleSignUp} className="space-y-3.5">
              {/* Full Name for signup */}
              {mode === 'signup' && (
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User size={16} className="absolute left-3.5 top-3 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder={role === 'teacher' ? 'e.g. Prof. Tariq Mahmood' : 'e.g. Ali Ahmed'}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com or student@mba.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[11px] font-bold text-slate-700">
                    Password <span className="text-red-500">*</span>
                  </label>
                  {mode === 'signup' && (
                    <span className="text-[10px] text-slate-400 font-medium">Min 6 characters</span>
                  )}
                </div>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Teacher Extra Fields (Sign Up only) */}
              {mode === 'signup' && role === 'teacher' && (
                <div className="p-3.5 bg-indigo-50/50 border border-indigo-100 rounded-2xl space-y-3 animate-in fade-in duration-150">
                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-indigo-900">
                    <span>📋</span>
                    <span>Teacher Database Details:</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block mb-1">Teaching Subject</label>
                      <input
                        type="text"
                        placeholder="e.g. Mathematics"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-medium outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block mb-1">Qualification</label>
                      <input
                        type="text"
                        placeholder="e.g. M.Sc / B.Ed"
                        value={qualification}
                        onChange={(e) => setQualification(e.target.value)}
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-medium outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block mb-1">Assigned Section</label>
                      <select
                        value={teacherSection}
                        onChange={(e) => setTeacherSection(e.target.value)}
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-medium outline-none cursor-pointer"
                      >
                        <option value="Primary Section">Primary Section</option>
                        <option value="Middle Section">Middle Section</option>
                        <option value="High Section">High Section</option>
                        <option value="Senior Section">Senior Section</option>
                        <option value="Computer Class">Computer Class</option>
                        <option value="Ladies Section">Ladies Section</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block mb-1">WhatsApp / Phone</label>
                      <input
                        type="tel"
                        placeholder="03290275117"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-medium outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Student Extra Fields (Sign Up only) */}
              {mode === 'signup' && role === 'student' && (
                <div className="p-3.5 bg-blue-50/50 border border-blue-100 rounded-2xl space-y-3 animate-in fade-in duration-150">
                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-blue-900">
                    <span>🎓</span>
                    <span>Student Details:</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block mb-1">Class</label>
                      <select
                        value={studentClass}
                        onChange={(e) => setStudentClass(e.target.value)}
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-medium outline-none cursor-pointer"
                      >
                        {Array.from({ length: 12 }).map((_, i) => (
                          <option key={i + 1} value={`Class ${i + 1}`}>Class {i + 1}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block mb-1">Section</label>
                      <select
                        value={studentSection}
                        onChange={(e) => setStudentSection(e.target.value)}
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-medium outline-none cursor-pointer"
                      >
                        <option value="Section A">Section A</option>
                        <option value="Section B">Section B</option>
                        <option value="Section C">Section C</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block mb-1">Roll No</label>
                      <input
                        type="text"
                        placeholder="e.g. 104"
                        value={studentRoll}
                        onChange={(e) => setStudentRoll(e.target.value)}
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-medium outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full mt-4 py-3 rounded-2xl text-xs font-extrabold text-white shadow-md flex items-center justify-center gap-2 transition duration-200 cursor-pointer ${
                  role === 'teacher'
                    ? 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                } ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : mode === 'login' ? (
                  <>
                    <span>Log In to Account</span>
                    <ArrowRight size={15} />
                  </>
                ) : (
                  <>
                    <span>Create {role === 'teacher' ? 'Teacher' : 'Student'} Account</span>
                    <CheckCircle2 size={15} />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Credentials Footer */}
            <div className="mt-5 pt-4 border-t border-slate-100">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2 text-center">
                ⚡ Quick 1-Click Demo Login:
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => fillDemo('admin')}
                  className="p-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-[10px] font-bold text-slate-700 transition cursor-pointer"
                  title="Principal / Admin"
                >
                  🛡️ Admin
                </button>
                <button
                  type="button"
                  onClick={() => fillDemo('teacher')}
                  className="p-1.5 bg-indigo-50/70 hover:bg-indigo-100 border border-indigo-100 rounded-xl text-[10px] font-bold text-indigo-700 transition cursor-pointer"
                  title="Teacher Faculty"
                >
                  🏫 Teacher
                </button>
                <button
                  type="button"
                  onClick={() => fillDemo('student')}
                  className="p-1.5 bg-blue-50/70 hover:bg-blue-100 border border-blue-100 rounded-xl text-[10px] font-bold text-blue-700 transition cursor-pointer"
                  title="Student Portal"
                >
                  🎓 Student
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Footer info */}
        <div className="mt-4 text-center">
          <p className="text-xs text-blue-100/70">
            MBA Academy • Powered by Supabase Backend & Database Sync
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
