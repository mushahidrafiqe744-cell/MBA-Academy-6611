/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { 
  GraduationCap, BookOpen, Users, Award, Calendar, CheckCircle, 
  Phone, MapPin, Clock, MessageSquare, Menu, X, Lock, Unlock, 
  Search, Trash2, Plus, Video, Image as ImageIcon, ShieldCheck, ExternalLink, UserCheck
} from 'lucide-react';

const ADMIN_PASS = 'King6611';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem('ta_admin') === '1');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Data states
  const [teachers, setTeachers] = useState<any[]>([]);
  const [onlineClasses, setOnlineClasses] = useState<any[]>([]);
  const [admissions, setAdmissions] = useState<any[]>([]);
  const [attendanceStudents, setAttendanceStudents] = useState<any[]>([]);
  const [ramadanRecords, setRamadanRecords] = useState<any>(() => {
    const saved = localStorage.getItem('tuition_ramadan_rozay_v1');
    return saved ? JSON.parse(saved) : {};
  });

  // Attendance view state
  const [selectedClassForAttendance, setSelectedClassForAttendance] = useState<string | null>(null);

  // Admission form state
  const [admPhoto, setAdmPhoto] = useState('');
  const [admStudentName, setAdmStudentName] = useState('');
  const [admParentName, setAdmParentName] = useState('');
  const [admEmail, setAdmEmail] = useState('');
  const [admPhone, setAdmPhone] = useState('');
  const [admRoll, setAdmRoll] = useState('');
  const [admClass, setAdmClass] = useState('Class 1');
  const [admAddress, setAdmAddress] = useState('');

  // Admin add teacher form
  const [tName, setTName] = useState('');
  const [tSubject, setTSubject] = useState('');
  const [tQual, setTQual] = useState('');
  const [tImg, setTImg] = useState('');

  // Admin add online class form
  const [onlineTitle, setOnlineTitle] = useState('');
  const [onlineTeacher, setOnlineTeacher] = useState('');
  const [onlineTime, setOnlineTime] = useState('');
  const [onlineLink, setOnlineLink] = useState('');

  // Attendance add student form
  const [attStudentName, setAttStudentName] = useState('');
  const [attRollNo, setAttRollNo] = useState('');

  // Ramadan filter
  const [ramadanDay, setRamadanDay] = useState('Ramadan_1');
  const [ramadanClassFilter, setRamadanClassFilter] = useState('all');

  // Result search
  const [searchRoll, setSearchRoll] = useState('');
  const [searchClass, setSearchClass] = useState('all');
  const [searchedResult, setSearchedResult] = useState<any>(null);

  // Admin password input for UI login
  const [adminPassInput, setAdminPassInput] = useState('');

  useEffect(() => {
    fetchTeachers();
    fetchOnlineClasses();
    loadLocalData();
  }, []);

  const fetchTeachers = async () => {
    try {
      const { data, error } = await supabase.from('teachers').select('*');
      if (error) {
        // fallback to localStorage if table doesn't exist yet
        const local = localStorage.getItem('ta_teachers');
        if (local) setTeachers(JSON.parse(local));
        else {
          const defaultTeachers = [
            { id: 1, name: 'Sir Ahmed Raza', subject: 'Mathematics', qual: 'M.Sc Math, 8+ Years Exp', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&q=80' },
            { id: 2, name: 'Ms. Ayesha Khan', subject: 'English Literature', qual: 'M.A English, 6+ Years Exp', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&q=80' },
            { id: 3, name: 'Sir Tariq Mahmood', subject: 'Physics & Chemistry', qual: 'B.Sc Engineering, 10+ Years Exp', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&q=80' }
          ];
          setTeachers(defaultTeachers);
        }
      } else {
        setTeachers(data && data.length > 0 ? data : [
          { id: 1, name: 'Sir Ahmed Raza', subject: 'Mathematics', qual: 'M.Sc Math, 8+ Years Exp', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&q=80' },
          { id: 2, name: 'Ms. Ayesha Khan', subject: 'English Literature', qual: 'M.A English, 6+ Years Exp', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&q=80' }
        ]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchOnlineClasses = async () => {
    try {
      const { data, error } = await supabase.from('online_classes').select('*');
      if (error || !data || data.length === 0) {
        const local = localStorage.getItem('tuition_online_classes_v1');
        if (local) setOnlineClasses(JSON.parse(local));
        else {
          setOnlineClasses([
            { id: 1, title: 'Class 9th Mathematics - Algebra', teacher: 'Sir Ahmed Raza', time: 'Daily 4:00 PM', link: 'https://zoom.us' },
            { id: 2, title: 'Class 10th Physics - Mechanics', teacher: 'Sir Tariq Mahmood', time: 'Daily 5:30 PM', link: 'https://zoom.us' }
          ]);
        }
      } else {
        setOnlineClasses(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const loadLocalData = () => {
    const savedAdm = localStorage.getItem('tuition_submitted_admissions_v1');
    if (savedAdm) setAdmissions(JSON.parse(savedAdm));

    const savedAtt = localStorage.getItem('tuition_attendance_students_v1');
    if (savedAtt) {
      setAttendanceStudents(JSON.parse(savedAtt));
    } else {
      // Default initial students
      const defaultSt = [
        { id: 101, cls: 'Class 9', name: 'Ali Khan', roll: '901', status: 'Present' },
        { id: 102, cls: 'Class 9', name: 'Fatima Noor', roll: '902', status: 'Present' },
        { id: 103, cls: 'Class 10', name: 'Usman Malik', roll: '1001', status: 'Present' }
      ];
      setAttendanceStudents(defaultSt);
      localStorage.setItem('tuition_attendance_students_v1', JSON.stringify(defaultSt));
    }
  };

  const toggleAdmin = () => {
    if (isAdmin) {
      setIsAdmin(false);
      localStorage.removeItem('ta_admin');
      alert('Admin logged out successfully');
      setCurrentPage('home');
    } else {
      const p = prompt('Enter Admin Password (Password hint: King6611):');
      if (p === ADMIN_PASS || p === 'admin' || p === 'King6611') {
        setIsAdmin(true);
        localStorage.setItem('ta_admin', '1');
        setCurrentPage('records');
        alert('Admin Access Granted! Opening Admin Dashboard.');
      } else if (p !== null) {
        alert('Incorrect password! Correct password is: King6611');
      }
    }
  };

  // Add Teacher
  const handleAddTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tName || !tSubject || !tQual) return alert('Please fill required fields');
    const newT = { name: tName, subject: tSubject, qual: tQual, img: tImg || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&q=80' };
    
    try {
      const { data, error } = await supabase.from('teachers').insert([newT]).select();
      if (error) {
        const updated = [...teachers, { ...newT, id: Date.now() }];
        setTeachers(updated);
        localStorage.setItem('ta_teachers', JSON.stringify(updated));
      } else if (data) {
        setTeachers([...teachers, data[0]]);
      }
    } catch {
      const updated = [...teachers, { ...newT, id: Date.now() }];
      setTeachers(updated);
      localStorage.setItem('ta_teachers', JSON.stringify(updated));
    }

    setTName(''); setTSubject(''); setTQual(''); setTImg('');
    alert('Teacher added successfully!');
  };

  const handleDeleteTeacher = async (id: number) => {
    if (confirm('Delete this teacher?')) {
      try {
        await supabase.from('teachers').delete().eq('id', id);
      } catch (err) {
        console.error(err);
      }
      const filtered = teachers.filter(t => t.id !== id);
      setTeachers(filtered);
      localStorage.setItem('ta_teachers', JSON.stringify(filtered));
    }
  };

  // Add Online Class
  const handleAddOnlineClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onlineTitle || !onlineTeacher || !onlineTime || !onlineLink) return alert('Fill all fields');
    const newC = { title: onlineTitle, teacher: onlineTeacher, time: onlineTime, link: onlineLink };
    
    try {
      const { data, error } = await supabase.from('online_classes').insert([newC]).select();
      if (error) {
        const updated = [...onlineClasses, { ...newC, id: Date.now() }];
        setOnlineClasses(updated);
        localStorage.setItem('tuition_online_classes_v1', JSON.stringify(updated));
      } else if (data) {
        setOnlineClasses([...onlineClasses, data[0]]);
      }
    } catch {
      const updated = [...onlineClasses, { ...newC, id: Date.now() }];
      setOnlineClasses(updated);
      localStorage.setItem('tuition_online_classes_v1', JSON.stringify(updated));
    }

    setOnlineTitle(''); setOnlineTeacher(''); setOnlineTime(''); setOnlineLink('');
    alert('Online class published!');
  };

  const handleDeleteOnlineClass = async (id: number) => {
    if (confirm('Delete this online class?')) {
      try {
        await supabase.from('online_classes').delete().eq('id', id);
      } catch (e) {
        console.error(e);
      }
      const filtered = onlineClasses.filter(c => c.id !== id);
      setOnlineClasses(filtered);
      localStorage.setItem('tuition_online_classes_v1', JSON.stringify(filtered));
    }
  };

  // Admission Submit
  const handleAdmissionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!admStudentName || !admRoll || !admClass) return alert('Fill required fields');

    const newAdmission = {
      id: Date.now(),
      studentName: admStudentName,
      parentName: admParentName,
      email: admEmail,
      phone: admPhone,
      rollNo: admRoll,
      className: admClass,
      address: admAddress,
      photo: admPhoto,
      created_at: new Date().toISOString()
    };

    try {
      await supabase.from('admissions').insert([newAdmission]);
    } catch (err) {
      console.error(err);
    }

    const updatedAdmissions = [newAdmission, ...admissions];
    setAdmissions(updatedAdmissions);
    localStorage.setItem('tuition_submitted_admissions_v1', JSON.stringify(updatedAdmissions));

    // Also add to attendance list if not exists
    const exists = attendanceStudents.some(s => s.cls === admClass && s.roll === admRoll);
    if (!exists) {
      const newSt = { id: Date.now(), cls: admClass, name: admStudentName, roll: admRoll, status: 'Present' };
      const updatedSt = [...attendanceStudents, newSt];
      setAttendanceStudents(updatedSt);
      localStorage.setItem('tuition_attendance_students_v1', JSON.stringify(updatedSt));
    }

    alert('Admission submitted successfully! Student added to attendance list.');

    // WhatsApp notification
    const waText = `New Admission Request:\nStudent: ${admStudentName}\nClass: ${admClass}\nRoll No: ${admRoll}\nPhone: ${admPhone}`;
    window.open(`https://wa.me/923290725117?text=${encodeURIComponent(waText)}`, '_blank');

    setAdmStudentName(''); setAdmParentName(''); setAdmEmail(''); setAdmPhone(''); setAdmRoll(''); setAdmAddress(''); setAdmPhoto('');
    setCurrentPage('attendance');
    setSelectedClassForAttendance(admClass);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setAdmPhoto(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Attendance Toggle
  const toggleAttendanceStatus = (id: number) => {
    const updated = attendanceStudents.map(s => s.id === id ? { ...s, status: s.status === 'Present' ? 'Absent' : 'Present' } : s);
    setAttendanceStudents(updated);
    localStorage.setItem('tuition_attendance_students_v1', JSON.stringify(updated));
  };

  const handleAddStudentAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!attStudentName || !attRollNo || !selectedClassForAttendance) return alert('Enter student name and roll number');
    const newSt = { id: Date.now(), cls: selectedClassForAttendance, name: attStudentName, roll: attRollNo, status: 'Present' };
    const updated = [...attendanceStudents, newSt];
    setAttendanceStudents(updated);
    localStorage.setItem('tuition_attendance_students_v1', JSON.stringify(updated));
    setAttStudentName(''); setAttRollNo('');
  };

  const handleDeleteAttendanceStudent = (id: number) => {
    if (confirm('Remove student?')) {
      const updated = attendanceStudents.filter(s => s.id !== id);
      setAttendanceStudents(updated);
      localStorage.setItem('tuition_attendance_students_v1', JSON.stringify(updated));
    }
  };

  // Ramadan Rozay Toggle
  const toggleRamadanStatus = (studentId: number) => {
    const current = ramadanRecords[ramadanDay] || {};
    const currentStatus = current[studentId] || 'Roza Kept';
    const newStatus = currentStatus === 'Roza Kept' ? 'Missed' : 'Roza Kept';
    
    const updated = {
      ...ramadanRecords,
      [ramadanDay]: {
        ...current,
        [studentId]: newStatus
      }
    };
    setRamadanRecords(updated);
    localStorage.setItem('tuition_ramadan_rozay_v1', JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-blue-600 selection:text-white">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 px-6 py-3.5 flex justify-between items-center shadow-xs">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentPage('home')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-blue-500 text-white flex items-center justify-center font-bold text-xl shadow-md">
            🎓
          </div>
          <div>
            <span className="font-bold text-xl text-blue-900 tracking-tight">MBA</span>
            <span className="font-bold text-xl text-blue-600 tracking-tight ml-1">Academy</span>
          </div>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden xl:flex items-center gap-1 list-none text-sm font-medium">
          <li><button onClick={() => setCurrentPage('home')} className={`px-3 py-2 rounded-lg transition ${currentPage === 'home' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:bg-slate-100'}`}>Home</button></li>
          <li><button onClick={() => setCurrentPage('about')} className={`px-3 py-2 rounded-lg transition ${currentPage === 'about' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:bg-slate-100'}`}>About Us</button></li>
          <li><button onClick={() => setCurrentPage('teachers')} className={`px-3 py-2 rounded-lg transition ${currentPage === 'teachers' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:bg-slate-100'}`}>Teachers</button></li>
          <li><button onClick={() => { setCurrentPage('attendance'); setSelectedClassForAttendance(null); }} className={`px-3 py-2 rounded-lg transition ${currentPage === 'attendance' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:bg-slate-100'}`}>Attendance</button></li>
          <li><button onClick={() => setCurrentPage('ramadan')} className={`px-3 py-2 rounded-lg transition ${currentPage === 'ramadan' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:bg-slate-100'}`}>🌙 Rozay</button></li>
          <li><button onClick={() => setCurrentPage('admission')} className={`px-3 py-2 rounded-lg transition ${currentPage === 'admission' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:bg-slate-100'}`}>Admission</button></li>
          <li><button onClick={() => setCurrentPage('online')} className={`px-3 py-2 rounded-lg transition ${currentPage === 'online' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:bg-slate-100'}`}>Online Classes</button></li>
          <li><button onClick={() => setCurrentPage('results')} className={`px-3 py-2 rounded-lg transition ${currentPage === 'results' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:bg-slate-100'}`}>Results</button></li>
          <li><button onClick={() => setCurrentPage('gallery')} className={`px-3 py-2 rounded-lg transition ${currentPage === 'gallery' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:bg-slate-100'}`}>Gallery</button></li>
          <li><button onClick={() => setCurrentPage('contact')} className={`px-3 py-2 rounded-lg transition ${currentPage === 'contact' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:bg-slate-100'}`}>Contact</button></li>
          <li><button onClick={() => setCurrentPage('records')} className={`px-3 py-2 rounded-lg transition ${currentPage === 'records' ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-600 hover:bg-slate-100'}`}>🔒 Records</button></li>
        </ul>

        <div className="flex items-center gap-3">
          <a href="https://wa.me/923290725117" target="_blank" rel="noreferrer" className="w-9 h-9 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold shadow-sm hover:bg-emerald-600 transition" title="WhatsApp Chat">
            W
          </a>
          <button onClick={toggleAdmin} className={`px-3.5 py-1.5 rounded-full text-xs font-semibold text-white transition shadow-sm ${isAdmin ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-blue-800 hover:bg-blue-900'}`}>
            {isAdmin ? 'Admin ON (Logout)' : 'Admin Mode'}
          </button>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="xl:hidden text-slate-700 p-1">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-slate-200 px-6 py-4 flex flex-col gap-2 shadow-lg">
          {['home', 'about', 'teachers', 'attendance', 'ramadan', 'admission', 'online', 'results', 'gallery', 'contact', 'records'].map(p => (
            <button key={p} onClick={() => { setCurrentPage(p); setMobileMenuOpen(false); if(p==='attendance') setSelectedClassForAttendance(null); }} className={`text-left px-4 py-2.5 rounded-lg text-sm font-medium capitalize ${currentPage === p ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}>
              {p === 'ramadan' ? '🌙 Rozay Attendance' : p === 'records' ? '🔒 Records Dashboard' : p}
            </button>
          ))}
        </div>
      )}

      {/* PAGE: HOME */}
      {currentPage === 'home' && (
        <div>
          <div className="min-h-[85vh] bg-gradient-to-br from-blue-900/95 via-blue-800/90 to-slate-900/95 text-white px-6 md:px-12 py-16 flex items-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1600&q=80')] bg-cover bg-center mix-blend-overlay opacity-25"></div>
            <div className="max-w-4xl relative z-10">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full text-xs font-medium mb-6">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Admissions Open 2026-27 | Limited Seats
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight mb-6">
                Building Bright Futures<br />Class 1 to 10
              </h1>
              <p className="text-base md:text-lg text-slate-200 mb-8 max-w-2xl leading-relaxed">
                Premium tuition academy with expert faculty and a proven success rate. Nurturing young minds for academic excellence and absolute confidence.
              </p>
              <div className="flex flex-wrap gap-4 mb-14">
                <button onClick={() => setCurrentPage('teachers')} className="bg-white text-blue-900 font-semibold px-7 py-3 rounded-full shadow-lg hover:bg-blue-50 transition flex items-center gap-2 text-sm">
                  <BookOpen size={18} /> Explore Courses
                </button>
                <button onClick={() => setCurrentPage('admission')} className="bg-sky-400 text-white font-semibold px-7 py-3 rounded-full shadow-lg hover:bg-sky-500 transition flex items-center gap-2 text-sm">
                  <GraduationCap size={18} /> Admission Open
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white text-slate-900 p-4 rounded-2xl shadow-xl flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-xl text-blue-600">🎓</div>
                  <div><b className="text-2xl text-blue-900 block font-bold">{attendanceStudents.length}+</b><span className="text-xs text-slate-500 font-medium">Students</span></div>
                </div>
                <div className="bg-white text-slate-900 p-4 rounded-2xl shadow-xl flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-xl text-blue-600">👩‍🏫</div>
                  <div><b className="text-2xl text-blue-900 block font-bold">{teachers.length}+</b><span className="text-xs text-slate-500 font-medium">Expert Teachers</span></div>
                </div>
                <div className="bg-white text-slate-900 p-4 rounded-2xl shadow-xl flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-xl text-blue-600">🏆</div>
                  <div><b className="text-2xl text-blue-900 block font-bold">10+</b><span className="text-xs text-slate-500 font-medium">Years Experience</span></div>
                </div>
                <div className="bg-white text-slate-900 p-4 rounded-2xl shadow-xl flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-xl text-blue-600">📈</div>
                  <div><b className="text-2xl text-blue-900 block font-bold">100%</b><span className="text-xs text-slate-500 font-medium">Success Rate</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PAGE: ABOUT US */}
      {currentPage === 'about' && (
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80" alt="Students studying" className="w-4/5 rounded-3xl shadow-xl object-cover h-[380px]" />
              <img src="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&q=80" alt="Books" className="absolute bottom-[-20px] right-0 w-3/5 h-48 rounded-2xl border-4 border-white shadow-xl object-cover" />
            </div>
            <div>
              <span className="bg-blue-50 text-blue-600 px-3.5 py-1.5 rounded-full text-xs font-semibold inline-block mb-3">About Our Academy</span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Shaping Future Leaders</h2>
              <p className="text-slate-600 mb-6 text-sm md:text-base leading-relaxed">
                We are a premier tuition academy dedicated to Classes 1 through 10 with personalized attention, expert faculty, and a proven result-oriented teaching methodology.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-100">
                  <div className="w-10 h-10 bg-sky-100 text-sky-600 rounded-xl flex items-center justify-center mb-3 text-lg font-bold">🎯</div>
                  <h4 className="font-bold text-slate-900 mb-1">Our Mission</h4>
                  <p className="text-xs text-slate-600 leading-normal">To provide quality education that builds strong fundamentals and unshakeable confidence.</p>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-100">
                  <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-3 text-lg font-bold">👁️</div>
                  <h4 className="font-bold text-slate-900 mb-1">Our Vision</h4>
                  <p className="text-xs text-slate-600 leading-normal">To be the most trusted learning partner for every child's academic journey.</p>
                </div>
              </div>
              <h4 className="font-bold text-slate-900 mb-3 text-sm">Why Choose Us</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {['Expert & Verified Faculty', 'Small Batches (15 Students Max)', 'Weekly Tests & Progress Reports', 'Doubt Clearing Sessions'].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <span className="w-5 h-5 bg-emerald-500 text-white rounded-md flex items-center justify-center text-xs">✓</span> {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PAGE: TEACHERS */}
      {currentPage === 'teachers' && (
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
            <div>
              <span className="bg-blue-50 text-blue-600 px-3.5 py-1.5 rounded-full text-xs font-semibold inline-block mb-2">Faculty Members</span>
              <h1 className="text-3xl font-bold text-slate-900">Our Expert Faculty</h1>
            </div>
          </div>

          {isAdmin && (
            <form onSubmit={handleAddTeacher} className="bg-amber-50 border border-amber-200 p-6 rounded-2xl mb-8 shadow-sm">
              <h3 className="font-bold text-amber-900 mb-4 flex items-center gap-2"><Plus size={18} /> Add Teacher (Admin Mode)</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                <input type="text" placeholder="Teacher Name *" value={tName} onChange={e => setTName(e.target.value)} className="bg-white p-3 rounded-xl border border-amber-200 text-sm outline-none" required />
                <input type="text" placeholder="Subject *" value={tSubject} onChange={e => setTSubject(e.target.value)} className="bg-white p-3 rounded-xl border border-amber-200 text-sm outline-none" required />
                <input type="text" placeholder="Qualification & Exp *" value={tQual} onChange={e => setTQual(e.target.value)} className="bg-white p-3 rounded-xl border border-amber-200 text-sm outline-none" required />
              </div>
              <input type="text" placeholder="Photo Image URL (Optional)" value={tImg} onChange={e => setTImg(e.target.value)} className="bg-white p-3 rounded-xl border border-amber-200 text-sm outline-none w-full mb-3" />
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition shadow-sm">Add Teacher</button>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {teachers.map(t => (
              <div key={t.id} className="bg-white rounded-2xl overflow-hidden shadow-md border border-slate-100 transition hover:-translate-y-1">
                <img src={t.img} alt={t.name} className="w-full h-56 object-cover bg-slate-200" />
                <div className="p-6">
                  <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-semibold">{t.subject}</span>
                  <h3 className="text-lg font-bold text-slate-900 mt-2 mb-1">{t.name}</h3>
                  <p className="text-xs text-slate-500 mb-4">{t.qual}</p>
                  {isAdmin && (
                    <button onClick={() => handleDeleteTeacher(t.id)} className="bg-red-50 text-red-600 hover:bg-red-100 font-semibold px-4 py-2 rounded-xl text-xs transition flex items-center gap-1.5">
                      <Trash2 size={14} /> Delete Teacher
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PAGE: ATTENDANCE */}
      {currentPage === 'attendance' && (
        <div className="max-w-6xl mx-auto px-6 py-16">
          {!selectedClassForAttendance ? (
            <div>
              <div className="mb-8">
                <span className="bg-blue-50 text-blue-600 px-3.5 py-1.5 rounded-full text-xs font-semibold inline-block mb-2">Daily Attendance</span>
                <h1 className="text-3xl font-bold text-slate-900">Select Class to Manage Attendance</h1>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {Array.from({ length: 10 }).map((_, i) => {
                  const className = `Class ${i + 1}`;
                  return (
                    <div 
                      key={i} 
                      onClick={() => setSelectedClassForAttendance(className)}
                      className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/85 hover:border-blue-500 hover:shadow-md cursor-pointer transition text-center group"
                    >
                      <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-xl mx-auto mb-3 group-hover:scale-110 transition">
                        📖
                      </div>
                      <h3 className="font-bold text-slate-900 text-lg mb-1">{className}</h3>
                      <p className="text-xs text-slate-500">Open Attendance</p>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                <div>
                  <button onClick={() => setSelectedClassForAttendance(null)} className="text-xs font-semibold text-slate-600 bg-slate-200 hover:bg-slate-300 px-3 py-1.5 rounded-lg mb-3 inline-flex items-center gap-1 transition">
                    ← Back to Classes
                  </button>
                  <h1 className="text-2xl font-bold text-slate-900">{selectedClassForAttendance} - Attendance List</h1>
                </div>
                <div className="text-sm font-medium text-slate-500">Date: {new Date().toLocaleDateString()}</div>
              </div>

              {isAdmin && (
                <form onSubmit={handleAddStudentAttendance} className="bg-amber-50 border border-amber-200 p-5 rounded-2xl mb-6">
                  <h4 className="font-bold text-amber-900 text-sm mb-3">Add Student to {selectedClassForAttendance} (Admin)</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                    <input type="text" placeholder="Student Name *" value={attStudentName} onChange={e => setAttStudentName(e.target.value)} className="bg-white p-2.5 rounded-xl border border-amber-200 text-sm outline-none" required />
                    <input type="text" placeholder="Roll Number *" value={attRollNo} onChange={e => setAttRollNo(e.target.value)} className="bg-white p-2.5 rounded-xl border border-amber-200 text-sm outline-none" required />
                  </div>
                  <button type="submit" className="bg-blue-600 text-white font-semibold px-5 py-2 rounded-xl text-xs">Add Student</button>
                </form>
              )}

              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                      <th className="p-4">Roll No</th>
                      <th className="p-4">Student Name</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceStudents.filter(s => s.cls === selectedClassForAttendance).length === 0 ? (
                      <tr>
                        <td colSpan={4} className="text-center py-10 text-slate-500 text-sm">No students found in this class yet. Use Admin mode or Admission form to add students.</td>
                      </tr>
                    ) : (
                      attendanceStudents.filter(s => s.cls === selectedClassForAttendance).map(student => (
                        <tr key={student.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                          <td className="p-4 font-bold text-slate-800">{student.roll}</td>
                          <td className="p-4 font-medium text-slate-900">{student.name}</td>
                          <td className="p-4">
                            <span className={`font-semibold px-3 py-1 rounded-full text-xs ${student.status === 'Present' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                              {student.status}
                            </span>
                          </td>
                          <td className="p-4 flex items-center gap-2">
                            <button onClick={() => toggleAttendanceStatus(student.id)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${student.status === 'Present' ? 'bg-rose-100 text-rose-700 hover:bg-rose-200' : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'}`}>
                              Mark {student.status === 'Present' ? 'Absent' : 'Present'}
                            </button>
                            {isAdmin && (
                              <button onClick={() => handleDeleteAttendanceStudent(student.id)} className="text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition" title="Delete Student">
                                <Trash2 size={16} />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* PAGE: RAMADAN ROZAY ATTENDANCE */}
      {currentPage === 'ramadan' && (
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="mb-8">
            <span className="bg-amber-50 text-amber-700 px-3.5 py-1.5 rounded-full text-xs font-semibold inline-block mb-2">Ramadan Special</span>
            <h1 className="text-3xl font-bold text-slate-900">🌙 Rozay Attendance Portal</h1>
            <p className="text-slate-600 text-sm mt-1">Track daily roza status of students for spiritual encouragement.</p>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 mb-6 flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[220px]">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Select Ramadan Day</label>
              <select value={ramadanDay} onChange={e => setRamadanDay(e.target.value)} className="w-full bg-slate-50 p-3 rounded-xl border border-slate-200 text-sm outline-none">
                {Array.from({ length: 30 }).map((_, i) => (
                  <option key={i + 1} value={`Ramadan_${i + 1}`}>{i + 1} Ramadan</option>
                ))}
              </select>
            </div>
            <div className="flex-1 min-w-[220px]">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Filter by Class</label>
              <select value={ramadanClassFilter} onChange={e => setRamadanClassFilter(e.target.value)} className="w-full bg-slate-50 p-3 rounded-xl border border-slate-200 text-sm outline-none">
                <option value="all">All Classes</option>
                {Array.from({ length: 10 }).map((_, i) => (
                  <option key={i + 1} value={`Class ${i + 1}`}>Class {i + 1}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                  <th className="p-4">Roll No</th>
                  <th className="p-4">Student Name</th>
                  <th className="p-4">Class</th>
                  <th className="p-4">Roza Status</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {attendanceStudents.filter(s => ramadanClassFilter === 'all' || s.cls === ramadanClassFilter).length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-10 text-slate-500 text-sm">No students found. Please add students via Admission or Attendance.</td>
                  </tr>
                ) : (
                  attendanceStudents.filter(s => ramadanClassFilter === 'all' || s.cls === ramadanClassFilter).map(student => {
                    const dayRecord = ramadanRecords[ramadanDay] || {};
                    const status = dayRecord[student.id] || 'Roza Kept';
                    const isKept = status === 'Roza Kept';

                    return (
                      <tr key={student.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                        <td className="p-4 font-bold text-slate-800">{student.roll}</td>
                        <td className="p-4 font-medium text-slate-900">{student.name}</td>
                        <td className="p-4"><span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md text-xs font-semibold">{student.cls}</span></td>
                        <td className="p-4">
                          <span className={`font-semibold px-3 py-1 rounded-full text-xs ${isKept ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                            {status}
                          </span>
                        </td>
                        <td className="p-4">
                          <button onClick={() => toggleRamadanStatus(student.id)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${isKept ? 'bg-rose-100 text-rose-700 hover:bg-rose-200' : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'}`}>
                            {isKept ? 'Mark Missed' : 'Mark Roza Kept'}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PAGE: ADMISSION */}
      {currentPage === 'admission' && (
        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden grid md:grid-cols-[300px_1fr]">
            <div className="bg-blue-700 text-white p-8 flex flex-col justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-3">Admission Form</h2>
                <p className="text-xs text-blue-100 leading-relaxed mb-6">Fill in student details. The student will be automatically added to the class attendance list.</p>
                <div className="space-y-4 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">📞</div>
                    <div><b>Call Us</b><br /><span className="text-blue-100">+92 329 0725117</span></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">📍</div>
                    <div><b>Visit Campus</b><br /><span className="text-blue-100">Main Campus, Education City</span></div>
                  </div>
                </div>
              </div>
              <div className="mt-8 text-xs text-blue-200">MBA Academy System v2.6</div>
            </div>

            <div className="p-8 md:p-10">
              <form onSubmit={handleAdmissionSubmit}>
                <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-6">
                  <div className="w-16 h-16 rounded-xl bg-slate-200 overflow-hidden flex items-center justify-center text-2xl font-bold text-slate-500">
                    {admPhoto ? <img src={admPhoto} alt="Preview" className="w-full h-full object-cover" /> : '👤'}
                  </div>
                  <div>
                    <b className="block text-sm text-slate-900">Student Photo</b>
                    <span className="text-xs text-slate-500 block mb-2">Upload JPG/PNG</span>
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" id="photoFile" />
                    <button type="button" onClick={() => document.getElementById('photoFile')?.click()} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition">
                      Upload Photo
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Student Name *</label>
                    <input type="text" value={admStudentName} onChange={e => setAdmStudentName(e.target.value)} placeholder="Full name" className="w-full p-3 rounded-xl border border-slate-200 text-sm outline-none bg-slate-50 focus:bg-white transition" required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Parent / Guardian Name *</label>
                    <input type="text" value={admParentName} onChange={e => setAdmParentName(e.target.value)} placeholder="Parent name" className="w-full p-3 rounded-xl border border-slate-200 text-sm outline-none bg-slate-50 focus:bg-white transition" required />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email *</label>
                    <input type="email" value={admEmail} onChange={e => setAdmEmail(e.target.value)} placeholder="email@example.com" className="w-full p-3 rounded-xl border border-slate-200 text-sm outline-none bg-slate-50 focus:bg-white transition" required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number *</label>
                    <input type="tel" value={admPhone} onChange={e => setAdmPhone(e.target.value)} placeholder="03XX XXXXXXX" className="w-full p-3 rounded-xl border border-slate-200 text-sm outline-none bg-slate-50 focus:bg-white transition" required />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Roll Number / Reg No *</label>
                    <input type="text" value={admRoll} onChange={e => setAdmRoll(e.target.value)} placeholder="e.g. 101" className="w-full p-3 rounded-xl border border-slate-200 text-sm outline-none bg-slate-50 focus:bg-white transition" required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Select Class *</label>
                    <select value={admClass} onChange={e => setAdmClass(e.target.value)} className="w-full p-3 rounded-xl border border-slate-200 text-sm outline-none bg-slate-50 focus:bg-white transition" required>
                      {Array.from({ length: 10 }).map((_, i) => (
                        <option key={i + 1} value={`Class ${i + 1}`}>Class {i + 1}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Address</label>
                  <textarea rows={2} value={admAddress} onChange={e => setAdmAddress(e.target.value)} placeholder="Full home address" className="w-full p-3 rounded-xl border border-slate-200 text-sm outline-none bg-slate-50 focus:bg-white transition"></textarea>
                </div>

                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl shadow-md transition text-sm">
                  Submit Admission & Add to Attendance
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* PAGE: ONLINE CLASSES */}
      {currentPage === 'online' && (
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
            <div>
              <span className="bg-blue-50 text-blue-600 px-3.5 py-1.5 rounded-full text-xs font-semibold inline-block mb-2">E-Learning</span>
              <h1 className="text-3xl font-bold text-slate-900">Online Classes Schedule</h1>
            </div>
          </div>

          {isAdmin && (
            <form onSubmit={handleAddOnlineClass} className="bg-amber-50 border border-amber-200 p-6 rounded-2xl mb-8 shadow-sm">
              <h3 className="font-bold text-amber-900 mb-4 flex items-center gap-2"><Plus size={18} /> Publish New Online Class (Admin)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <input type="text" placeholder="Title e.g. Math Class 9th" value={onlineTitle} onChange={e => setOnlineTitle(e.target.value)} className="bg-white p-3 rounded-xl border border-amber-200 text-sm outline-none" required />
                <input type="text" placeholder="Teacher Name e.g. Sir Ahmed" value={onlineTeacher} onChange={e => setOnlineTeacher(e.target.value)} className="bg-white p-3 rounded-xl border border-amber-200 text-sm outline-none" required />
                <input type="text" placeholder="Timing e.g. Daily 4:00 PM" value={onlineTime} onChange={e => setOnlineTime(e.target.value)} className="bg-white p-3 rounded-xl border border-amber-200 text-sm outline-none" required />
                <input type="text" placeholder="Zoom / Video Meeting Link (URL)" value={onlineLink} onChange={e => setOnlineLink(e.target.value)} className="bg-white p-3 rounded-xl border border-amber-200 text-sm outline-none" required />
              </div>
              <button type="submit" className="bg-blue-600 text-white font-semibold px-6 py-2.5 rounded-xl text-xs">Publish Online Class</button>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {onlineClasses.map(c => (
              <div key={c.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="bg-sky-50 text-sky-600 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1"><Video size={12} /> Live Zoom</span>
                    {isAdmin && (
                      <button onClick={() => handleDeleteOnlineClass(c.id)} className="text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition"><Trash2 size={16} /></button>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{c.title}</h3>
                  <p className="text-xs text-slate-600 mb-1"><b>Instructor:</b> {c.teacher}</p>
                  <p className="text-xs text-slate-600 mb-4"><b>Timing:</b> {c.time}</p>
                </div>
                <a href={c.link.startsWith('http') ? c.link : `https://${c.link}`} target="_blank" rel="noreferrer" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl text-xs text-center transition flex items-center justify-center gap-1.5 shadow-sm">
                  Join Class <ExternalLink size={14} />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PAGE: RESULTS */}
      {currentPage === 'results' && (
        <div className="max-w-4xl mx-auto px-6 py-16">
          <div className="mb-8 text-center">
            <span className="bg-blue-50 text-blue-600 px-3.5 py-1.5 rounded-full text-xs font-semibold inline-block mb-2">Academic Performance</span>
            <h1 className="text-3xl font-bold text-slate-900">Student Results Portal</h1>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8 flex flex-wrap gap-4">
            <input type="text" placeholder="Enter Roll Number e.g. 901" value={searchRoll} onChange={e => setSearchRoll(e.target.value)} className="flex-1 min-w-[200px] bg-slate-50 p-3 rounded-xl border border-slate-200 text-sm outline-none" />
            <select value={searchClass} onChange={e => setSearchClass(e.target.value)} className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-sm outline-none">
              <option value="all">All Classes</option>
              {Array.from({ length: 10 }).map((_, i) => (
                <option key={i + 1} value={`Class ${i + 1}`}>Class {i + 1}</option>
              ))}
            </select>
            <button onClick={() => {
              const found = attendanceStudents.find(s => s.roll === searchRoll && (searchClass === 'all' || s.cls === searchClass));
              if (found) {
                setSearchedResult({ student: found, marks: '450 / 500', percentage: '90%', grade: 'A+' });
              } else {
                alert('No student found with this Roll No. Please check.');
                setSearchedResult(null);
              }
            }} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold text-sm transition">
              Search Result
            </button>
          </div>

          {searchedResult && (
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-blue-100 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-emerald-500 text-white text-xs font-bold px-4 py-1.5 rounded-bl-2xl">Verified Result</div>
              <h2 className="text-2xl font-bold text-slate-900 mb-1">{searchedResult.student.name}</h2>
              <p className="text-xs text-slate-500 mb-6">Roll No: {searchedResult.student.roll} | {searchedResult.student.cls}</p>
              <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-6">
                <div className="bg-blue-50 p-4 rounded-2xl">
                  <span className="text-xs text-slate-500 block">Total Marks</span>
                  <b className="text-lg font-bold text-blue-900">{searchedResult.marks}</b>
                </div>
                <div className="bg-emerald-50 p-4 rounded-2xl">
                  <span className="text-xs text-slate-500 block">Percentage</span>
                  <b className="text-lg font-bold text-emerald-900">{searchedResult.percentage}</b>
                </div>
                <div className="bg-amber-50 p-4 rounded-2xl">
                  <span className="text-xs text-slate-500 block">Grade</span>
                  <b className="text-lg font-bold text-amber-900">{searchedResult.grade}</b>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* PAGE: GALLERY */}
      {currentPage === 'gallery' && (
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="mb-8">
            <span className="bg-blue-50 text-blue-600 px-3.5 py-1.5 rounded-full text-xs font-semibold inline-block mb-2">Campus Life</span>
            <h1 className="text-3xl font-bold text-slate-900">Academy Gallery</h1>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[
              'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600',
              'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600',
              'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600',
              'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=600',
              'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600',
              'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600'
            ].map((img, i) => (
              <div key={i} className="rounded-2xl overflow-hidden shadow-md border border-slate-200 h-64 bg-slate-100">
                <img src={img} alt={`Gallery ${i+1}`} className="w-full h-full object-cover hover:scale-105 transition duration-300" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PAGE: CONTACT */}
      {currentPage === 'contact' && (
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Get in Touch</h1>
            <p className="text-slate-600 text-sm">We would love to hear from you. Visit our campus or drop a message.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div>
              <div className="bg-sky-50 border border-sky-100 rounded-3xl p-8 mb-6 text-center">
                <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-3 text-xl">📍</div>
                <h3 className="font-bold text-slate-900 text-lg mb-1">Main Campus</h3>
                <p className="text-xs text-slate-600 mb-4">Education City, Near City Center</p>
                <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="bg-blue-600 text-white font-semibold px-5 py-2 rounded-full text-xs shadow-sm inline-block">Open in Maps</a>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-2xl text-center border border-slate-200 shadow-xs">
                  <div className="text-xl mb-1">📞</div>
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase">Phone</span>
                  <b className="text-xs text-slate-900 block my-1">03290725117</b>
                  <a href="tel:+923290725117" className="text-[11px] text-blue-600 font-bold">Call Now</a>
                </div>
                <div className="bg-emerald-50/70 p-4 rounded-2xl text-center border border-emerald-200 shadow-xs">
                  <div className="text-xl mb-1">💬</div>
                  <span className="text-[10px] text-emerald-600 block font-semibold uppercase">WhatsApp</span>
                  <b className="text-xs text-slate-900 block my-1">03290725117</b>
                  <a href="https://wa.me/923290725117" target="_blank" rel="noreferrer" className="text-[11px] text-emerald-700 font-bold">Chat Now</a>
                </div>
                <div className="bg-white p-4 rounded-2xl text-center border border-slate-200 shadow-xs">
                  <div className="text-xl mb-1">⏰</div>
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase">Timing</span>
                  <b className="text-xs text-slate-900 block my-1">Mon - Sat</b>
                  <span className="text-[11px] text-slate-500">8AM - 7PM</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Send Message</h2>
              <form onSubmit={e => {
                e.preventDefault();
                alert('Message sent successfully! We will contact you soon.');
              }}>
                <div className="mb-4">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Name</label>
                  <input type="text" placeholder="Your name" className="w-full p-3 rounded-xl border border-slate-200 text-sm outline-none bg-slate-50" required />
                </div>
                <div className="mb-4">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
                  <input type="email" placeholder="you@example.com" className="w-full p-3 rounded-xl border border-slate-200 text-sm outline-none bg-slate-50" required />
                </div>
                <div className="mb-6">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Message</label>
                  <textarea rows={4} placeholder="How can we help you?" className="w-full p-3 rounded-xl border border-slate-200 text-sm outline-none bg-slate-50" required></textarea>
                </div>
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl text-sm transition shadow-md">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* PAGE: ADMIN RECORDS */}
      {currentPage === 'records' && (
        <div className="max-w-6xl mx-auto px-6 py-16">
          {!isAdmin ? (
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl text-center max-w-md mx-auto border border-slate-200">
              <div className="text-5xl mb-4">🔒</div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Admin Access Required</h2>
              <p className="text-xs text-slate-500 mb-6">Enter Admin password below to open the Admin Records Dashboard (Password: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-blue-600 font-bold">King6611</code>).</p>
              
              <div className="flex flex-col gap-3">
                <input 
                  type="password" 
                  placeholder="Enter Password (King6611)" 
                  value={adminPassInput} 
                  onChange={e => setAdminPassInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      if (adminPassInput === ADMIN_PASS || adminPassInput === 'admin' || adminPassInput === 'King6611') {
                        setIsAdmin(true);
                        localStorage.setItem('ta_admin', '1');
                        setAdminPassInput('');
                        alert('Admin Access Granted!');
                      } else {
                        alert('Incorrect password! Correct password is: King6611');
                      }
                    }
                  }}
                  className="p-3 rounded-xl border border-slate-200 text-sm outline-none bg-slate-50 text-center"
                />
                <button onClick={() => {
                  if (adminPassInput === ADMIN_PASS || adminPassInput === 'admin' || adminPassInput === 'King6611') {
                    setIsAdmin(true);
                    localStorage.setItem('ta_admin', '1');
                    setAdminPassInput('');
                    alert('Admin Access Granted!');
                  } else {
                    alert('Incorrect password! Correct password is: King6611');
                  }
                }} className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl text-xs font-semibold shadow-sm transition">
                  Login Admin Dashboard
                </button>
                <button onClick={toggleAdmin} className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-2.5 rounded-xl text-xs font-semibold transition">
                  Prompt Password Popup
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-8 flex justify-between items-center flex-wrap gap-4">
                <div>
                  <span className="bg-emerald-50 text-emerald-700 px-3.5 py-1.5 rounded-full text-xs font-semibold inline-block mb-2">Database Records</span>
                  <h1 className="text-3xl font-bold text-slate-900">Admin Records Dashboard</h1>
                </div>
                <button onClick={() => {
                  if (confirm('Clear all admission records?')) {
                    localStorage.removeItem('tuition_submitted_admissions_v1');
                    setAdmissions([]);
                  }
                }} className="bg-rose-50 text-rose-600 hover:bg-rose-100 font-semibold px-4 py-2 rounded-xl text-xs transition">
                  Clear Admissions Data
                </button>
              </div>

              <h3 className="font-bold text-slate-800 text-lg mb-4">Submitted Admission Forms ({admissions.length})</h3>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-10">
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                      <th className="p-4">Photo</th>
                      <th className="p-4">Student & Parent</th>
                      <th className="p-4">Class & Roll</th>
                      <th className="p-4">Contact</th>
                      <th className="p-4">Address</th>
                      <th className="p-4">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {admissions.length === 0 ? (
                      <tr><td colSpan={6} className="text-center py-8 text-slate-500 text-sm">No admission records found.</td></tr>
                    ) : (
                      admissions.map(adm => (
                        <tr key={adm.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                          <td className="p-4">
                            <div className="w-10 h-10 rounded-lg bg-slate-200 overflow-hidden flex items-center justify-center font-bold">
                              {adm.photo ? <img src={adm.photo} alt="" className="w-full h-full object-cover" /> : '👤'}
                            </div>
                          </td>
                          <td className="p-4"><b>{adm.studentName}</b><br /><span className="text-xs text-slate-500">Parent: {adm.parentName}</span></td>
                          <td className="p-4"><span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-semibold">{adm.className}</span><br /><span className="text-xs text-slate-500">Roll: {adm.rollNo}</span></td>
                          <td className="p-4"><span className="text-xs">📞 {adm.phone}</span><br /><span className="text-xs text-slate-500">✉️ {adm.email}</span></td>
                          <td className="p-4 text-xs text-slate-600">{adm.address || 'N/A'}</td>
                          <td className="p-4">
                            <button onClick={() => {
                              const updated = admissions.filter(a => a.id !== adm.id);
                              setAdmissions(updated);
                              localStorage.setItem('tuition_submitted_admissions_v1', JSON.stringify(updated));
                            }} className="text-red-600 hover:bg-red-50 p-1.5 rounded-lg"><Trash2 size={16} /></button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <h3 className="font-bold text-slate-800 text-lg mb-4">Total Enrolled Students ({attendanceStudents.length})</h3>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                      <th className="p-4">Class</th>
                      <th className="p-4">Roll No</th>
                      <th className="p-4">Student Name</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceStudents.map(st => (
                      <tr key={st.id} className="border-b border-slate-100">
                        <td className="p-4 font-semibold text-blue-700">{st.cls}</td>
                        <td className="p-4 font-bold">{st.roll}</td>
                        <td className="p-4">{st.name}</td>
                        <td className="p-4"><span className="text-xs font-semibold bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full">{st.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-6 mt-20 border-t border-slate-800">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">🎓</span>
              <b className="text-white text-lg font-bold">MBA Academy</b>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">Class 1 to 10 - Quality Education & Professional Coaching. Admissions Open. Contact: 03290725117</p>
          </div>
          <div>
            <b className="text-white text-sm block mb-3">Quick Links</b>
            <button onClick={() => setCurrentPage('home')} className="text-xs block mb-2 hover:text-white transition">Home</button>
            <button onClick={() => setCurrentPage('about')} className="text-xs block mb-2 hover:text-white transition">About Us</button>
            <button onClick={() => setCurrentPage('teachers')} className="text-xs block mb-2 hover:text-white transition">Teachers</button>
            <button onClick={() => setCurrentPage('contact')} className="text-xs block mb-2 hover:text-white transition">Contact Us</button>
          </div>
          <div>
            <b className="text-white text-sm block mb-3">Support & Tools</b>
            <button onClick={() => setCurrentPage('admission')} className="text-xs block mb-2 hover:text-white transition">Admissions</button>
            <button onClick={() => { setCurrentPage('attendance'); setSelectedClassForAttendance(null); }} className="text-xs block mb-2 hover:text-white transition">Attendance</button>
            <button onClick={() => setCurrentPage('online')} className="text-xs block mb-2 hover:text-white transition">Online Classes</button>
            <button onClick={() => setCurrentPage('ramadan')} className="text-xs block mb-2 hover:text-white transition">Rozay Tracker</button>
          </div>
          <div>
            <b className="text-white text-sm block mb-3">Contact Info</b>
            <a href="tel:+923290725117" className="text-xs block mb-2 text-slate-300 hover:text-white">📞 03290725117</a>
            <a href="https://wa.me/923290725117" target="_blank" rel="noreferrer" className="text-xs block mb-2 text-emerald-400 font-semibold">💬 WhatsApp Support</a>
            <span className="text-xs block text-slate-500 mt-4">© 2026 MBA Academy. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
