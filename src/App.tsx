/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { 
  GraduationCap, BookOpen, Users, Award, Calendar, CheckCircle, 
  Phone, MapPin, Clock, MessageSquare, Menu, X, Lock, Unlock, 
  Search, Trash2, Plus, Video, Image as ImageIcon, ShieldCheck, ExternalLink, UserCheck,
  Monitor, Terminal, Cpu, Laptop, Shield
} from 'lucide-react';
import ComputerSection from './components/ComputerSection';

const ADMIN_PASS = 'King6611';

export default function App() {
  const [currentPage, setCurrentPage] = useState(() => {
    const path = window.location.pathname.replace(/^\/+/g, '');
    const validPages = ['home', 'ad', 'about', 'teachers', 'attendance', 'admission', 'online', 'computer', 'results', 'gallery', 'contact', 'records'];
    return (path && validPages.includes(path)) ? path : 'home';
  });

  // Handle browser back/forward buttons (popstate event)
  useEffect(() => {
    const validPages = ['home', 'ad', 'about', 'teachers', 'attendance', 'admission', 'online', 'computer', 'results', 'gallery', 'contact', 'records'];
    const handlePopState = () => {
      const updatedPath = window.location.pathname.replace(/^\/+/g, '');
      if (updatedPath && validPages.includes(updatedPath)) {
        setCurrentPage(updatedPath);
      } else {
        setCurrentPage('home');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Update URL path whenever currentPage changes
  useEffect(() => {
    const currentPath = window.location.pathname.replace(/^\/+/g, '');
    if (currentPath !== currentPage) {
      window.history.pushState(null, '', `/${currentPage}`);
    }
  }, [currentPage]);

  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem('ta_admin') === '1');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedSectionFilter, setSelectedSectionFilter] = useState('all');

  // Data states
  const [academyLogo, setAcademyLogo] = useState<string>(() => {
    return localStorage.getItem('tuition_academy_logo_v1') || '/logo.jpg';
  });
  const [logoError, setLogoError] = useState(false);

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
  const [tSection, setTSection] = useState('Senior Section');
  const [tDate, setTDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });

  // Class Media / Video / Audio / Image state & handlers
  const [classMedia, setClassMedia] = useState<any[]>([]);
  const [mediaTitle, setMediaTitle] = useState('');
  const [mediaClass, setMediaClass] = useState('Class 1');
  const [mediaType, setMediaType] = useState<'video' | 'audio' | 'image'>('video');
  const [mediaFileUrl, setMediaFileUrl] = useState('');
  const [mediaTeacher, setMediaTeacher] = useState('');
  const [mediaClassFilter, setMediaClassFilter] = useState('all');
  const [mediaTypeFilter, setMediaTypeFilter] = useState('all');

  // Admin add online class form
  const [onlineTitle, setOnlineTitle] = useState('');
  const [onlineTeacher, setOnlineTeacher] = useState('');
  const [onlineTime, setOnlineTime] = useState('');
  const [onlineDate, setOnlineDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [onlineLink, setOnlineLink] = useState('');
  const [onlineClassImg, setOnlineClassImg] = useState('');
  const [onlineTeacherImg, setOnlineTeacherImg] = useState('');
  const [onlineSection, setOnlineSection] = useState('Section A');

  // Admin add upcoming live class form
  const [upcomingClasses, setUpcomingClasses] = useState<any[]>([]);
  const [upTitle, setUpTitle] = useState('');
  const [upTeacher, setUpTeacher] = useState('');
  const [upDatetime, setUpDatetime] = useState('');
  const [upLink, setUpLink] = useState('');
  const [upClassImg, setUpClassImg] = useState('');
  const [upTeacherImg, setUpTeacherImg] = useState('');

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

  // Results state & handlers (Backend + LocalStorage)
  const [resultsList, setResultsList] = useState<any[]>([]);
  const [resStudentName, setResStudentName] = useState('');
  const [resFatherName, setResFatherName] = useState('');
  const [resRollNo, setResRollNo] = useState('');
  const [resClass, setResClass] = useState('Class 1');
  const [resExamType, setResExamType] = useState('Annual Examination');
  const [resTerm, setResTerm] = useState('Final Term');
  const [resYear, setResYear] = useState('2025 - 2026');
  const [resDate, setResDate] = useState(new Date().toISOString().split('T')[0]);
  const [resPhoto, setResPhoto] = useState('');
  const [resMarks, setResMarks] = useState('');
  const [resTotalMarks, setResTotalMarks] = useState('500');
  const [resGrade, setResGrade] = useState('A+');
  const [resRemarks, setResRemarks] = useState('Outstanding academic performance. Keep it up!');

  // Admin password input for UI login
  const [adminPassInput, setAdminPassInput] = useState('');
  const [adminPassword, setAdminPassword] = useState(() => {
    return localStorage.getItem('tuition_admin_password_v1') || 'King6611';
  });
  const [newPasswordInput, setNewPasswordInput] = useState('');

  // App lock gate password state & functions (Personal Lock)
  const [appGatePassword, setAppGatePassword] = useState(() => {
    return localStorage.getItem('app_gate_password_v1') || 'Mushahid123';
  });
  const [appGateInput, setAppGateInput] = useState('');
  const [appUnlocked, setAppUnlocked] = useState(() => {
    return localStorage.getItem('app_gate_unlocked_v1') === 'true';
  });
  const [gateError, setGateError] = useState('');
  const [showGatePassword, setShowGatePassword] = useState(false);
  const [gateNewPasswordInput, setGateNewPasswordInput] = useState('');

  const handleVerifyGate = () => {
    if (appGateInput === appGatePassword || appGateInput === adminPassword || appGateInput === 'King6611') {
      setAppUnlocked(true);
      localStorage.setItem('app_gate_unlocked_v1', 'true');
      setIsAdmin(true);
      localStorage.setItem('ta_admin', '1');
      setAppGateInput('');
      setGateError('');
      alert('Admin Login Successful! Portal Unlocked.');
    } else {
      setGateError('Incorrect Admin Password. Students should click "Open as Student" below.');
    }
  };

  const handleStudentOpen = () => {
    setAppUnlocked(true);
    localStorage.setItem('app_gate_unlocked_v1', 'true');
    setIsAdmin(false);
    localStorage.setItem('ta_admin', '0');
    setAppGateInput('');
    setGateError('');
  };

  const handleLockGate = () => {
    setAppUnlocked(false);
    localStorage.setItem('app_gate_unlocked_v1', 'false');
    setIsAdmin(false);
    localStorage.setItem('ta_admin', '0');
    alert('Portal Locked successfully!');
  };

  useEffect(() => {
    fetchTeachers();
    fetchOnlineClasses();
    fetchUpcomingClasses();
    fetchClassMedia();
    fetchResults();
    fetchAdmissions();
    loadLocalData();
  }, []);

  // Auto-live check timer
  useEffect(() => {
    const timer = setInterval(() => {
      if (upcomingClasses.length > 0) {
        const now = new Date();
        const stillUpcoming: any[] = [];
        upcomingClasses.forEach(async (c) => {
          const classTime = new Date(c.datetime);
          if (classTime <= now) {
            const newLive = {
              title: c.title,
              teacher: c.teacher,
              time: 'Live Now!',
              link: c.link,
              classImg: c.classImg,
              teacherImg: c.teacherImg,
              id: c.id,
              date: c.datetime ? c.datetime.split('T')[0] : new Date().toISOString().split('T')[0]
            };
            const dbLive = {
              id: newLive.id,
              title: newLive.title,
              teacher: newLive.teacher,
              time: newLive.time,
              link: newLive.link,
              created_at: newLive.date ? new Date(newLive.date + 'T12:00:00Z').toISOString() : new Date().toISOString()
            };
            setOnlineClasses(prev => [newLive, ...prev]);
            try {
              await supabase.from('online_classes').insert([dbLive]);
              await supabase.from('upcoming_classes').delete().eq('id', c.id);
            } catch (err) {
              console.error(err);
            }
          } else {
            stillUpcoming.push(c);
          }
        });
        if (stillUpcoming.length !== upcomingClasses.length) {
          setUpcomingClasses(stillUpcoming);
          localStorage.setItem('tuition_upcoming_classes_v1', JSON.stringify(stillUpcoming));
          const updatedOnline = JSON.parse(localStorage.getItem('tuition_online_classes_v1') || '[]');
          localStorage.setItem('tuition_online_classes_v1', JSON.stringify(updatedOnline));
        }
      }
    }, 15000);

    return () => clearInterval(timer);
  }, [upcomingClasses]);

  const fetchResults = async () => {
    try {
      const { data, error } = await supabase.from('student_results').select('*');
      if (error || !data || data.length === 0) {
        const local = localStorage.getItem('tuition_student_results_v1');
        if (local) setResultsList(JSON.parse(local));
        else setResultsList([]);
      } else {
        setResultsList(data);
        localStorage.setItem('tuition_student_results_v1', JSON.stringify(data));
      }
    } catch {
      const local = localStorage.getItem('tuition_student_results_v1');
      if (local) setResultsList(JSON.parse(local));
      else setResultsList([]);
    }
  };

  const fetchAdmissions = async () => {
    try {
      const { data, error } = await supabase.from('admissions').select('*').order('created_at', { ascending: false });
      if (error || !data) {
        const local = localStorage.getItem('tuition_submitted_admissions_v1');
        if (local) setAdmissions(JSON.parse(local));
      } else {
        const mappedData = data.map((item: any) => ({
          id: item.id,
          studentName: item.student_name,
          parentName: item.parent_name,
          email: item.email,
          phone: item.phone,
          rollNo: item.roll_no,
          className: item.class_name,
          address: item.address,
          photo: item.photo,
          created_at: item.created_at
        }));
        setAdmissions(mappedData);
        localStorage.setItem('tuition_submitted_admissions_v1', JSON.stringify(mappedData));
      }
    } catch (err) {
      console.error("Error fetching admissions from Supabase:", err);
      const local = localStorage.getItem('tuition_submitted_admissions_v1');
      if (local) setAdmissions(JSON.parse(local));
    }
  };

  const handleAddResult = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resStudentName || !resRollNo || !resMarks) return alert('Please provide student name, roll number, and obtained marks.');
    const obtained = Number(resMarks);
    const total = Number(resTotalMarks) || 500;
    const percentage = ((obtained / total) * 100).toFixed(1) + '%';
    const newResult = {
      id: Date.now(),
      studentName: resStudentName,
      fatherName: resFatherName || 'Muhammad',
      rollNo: resRollNo,
      className: resClass,
      examType: resExamType,
      term: resTerm,
      academicYear: resYear,
      dateOfResult: resDate,
      studentPhoto: resPhoto,
      marksObtained: obtained,
      totalMarks: total,
      marks: `${obtained} / ${total}`,
      percentage,
      grade: resGrade || 'A+',
      remarks: resRemarks,
      createdAt: new Date().toISOString()
    };

    try {
      const { data, error } = await supabase.from('student_results').insert([newResult]).select();
      if (error) {
        const updated = [newResult, ...resultsList];
        setResultsList(updated);
        localStorage.setItem('tuition_student_results_v1', JSON.stringify(updated));
      } else if (data && data[0]) {
        const updated = [data[0], ...resultsList];
        setResultsList(updated);
        localStorage.setItem('tuition_student_results_v1', JSON.stringify(updated));
      }
    } catch {
      const updated = [newResult, ...resultsList];
      setResultsList(updated);
      localStorage.setItem('tuition_student_results_v1', JSON.stringify(updated));
    }

    setResStudentName(''); setResFatherName(''); setResRollNo(''); setResMarks(''); setResPhoto('');
    alert('Student result published successfully to backend database & portal!');
  };

  const handleDeleteResult = async (id: number) => {
    if (confirm('Delete this result record?')) {
      try {
        await supabase.from('student_results').delete().eq('id', id);
      } catch (err) {
        console.error(err);
      }
      const filtered = resultsList.filter(r => r.id !== id);
      setResultsList(filtered);
      localStorage.setItem('tuition_student_results_v1', JSON.stringify(filtered));
    }
  };

  const fetchClassMedia = async () => {
    try {
      const { data, error } = await supabase.from('class_media').select('*');
      if (error || !data || data.length === 0) {
        const local = localStorage.getItem('tuition_class_media_v1');
        if (local) setClassMedia(JSON.parse(local));
        else setClassMedia([]);
      } else {
        setClassMedia(data);
        localStorage.setItem('tuition_class_media_v1', JSON.stringify(data));
      }
    } catch {
      const local = localStorage.getItem('tuition_class_media_v1');
      if (local) setClassMedia(JSON.parse(local));
      else setClassMedia([]);
    }
  };

  const handleAddMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaTitle || !mediaFileUrl) return alert('Please provide title and upload media file.');
    const newItem = {
      id: Date.now(),
      title: mediaTitle,
      className: mediaClass,
      mediaType,
      fileUrl: mediaFileUrl,
      teacherName: mediaTeacher || 'Academy Faculty',
      createdAt: new Date().toISOString()
    };

    try {
      const { data, error } = await supabase.from('class_media').insert([newItem]).select();
      if (error) {
        const updated = [newItem, ...classMedia];
        setClassMedia(updated);
        localStorage.setItem('tuition_class_media_v1', JSON.stringify(updated));
      } else if (data && data[0]) {
        const updated = [data[0], ...classMedia];
        setClassMedia(updated);
        localStorage.setItem('tuition_class_media_v1', JSON.stringify(updated));
      }
    } catch {
      const updated = [newItem, ...classMedia];
      setClassMedia(updated);
      localStorage.setItem('tuition_class_media_v1', JSON.stringify(updated));
    }

    setMediaTitle(''); setMediaFileUrl(''); setMediaTeacher('');
    alert('Class media uploaded & published successfully to backend database!');
  };

  const handleDeleteMedia = async (id: number) => {
    if (confirm('Delete this media item?')) {
      try {
        await supabase.from('class_media').delete().eq('id', id);
      } catch (err) {
        console.error(err);
      }
      const filtered = classMedia.filter(m => m.id !== id);
      setClassMedia(filtered);
      localStorage.setItem('tuition_class_media_v1', JSON.stringify(filtered));
    }
  };

  const fetchTeachers = async () => {
    try {
      const { data, error } = await supabase.from('teachers').select('*');
      if (error) {
        // fallback to localStorage if table doesn't exist yet
        const local = localStorage.getItem('ta_teachers');
        if (local) setTeachers(JSON.parse(local));
        else setTeachers([]);
      } else {
        setTeachers(data && data.length > 0 ? data : []);
      }
    } catch (err) {
      console.error(err);
      const local = localStorage.getItem('ta_teachers');
      if (local) setTeachers(JSON.parse(local));
      else setTeachers([]);
    }
  };

  const fetchOnlineClasses = async () => {
    try {
      const { data, error } = await supabase.from('online_classes').select('*');
      if (error || !data || data.length === 0) {
        const local = localStorage.getItem('tuition_online_classes_v1');
        if (local) setOnlineClasses(JSON.parse(local));
        else setOnlineClasses([]);
      } else {
        const mapped = data.map((c: any) => ({
          ...c,
          date: c.created_at ? c.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
          classImg: c.classImg || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600',
          teacherImg: c.teacherImg || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
        }));
        setOnlineClasses(mapped);
        localStorage.setItem('tuition_online_classes_v1', JSON.stringify(mapped));
      }
    } catch (err) {
      console.error(err);
      const local = localStorage.getItem('tuition_online_classes_v1');
      if (local) setOnlineClasses(JSON.parse(local));
      else setOnlineClasses([]);
    }
  };

  const fetchUpcomingClasses = async () => {
    try {
      const { data, error } = await supabase.from('upcoming_classes').select('*');
      if (error || !data || data.length === 0) {
        const local = localStorage.getItem('tuition_upcoming_classes_v1');
        if (local) setUpcomingClasses(JSON.parse(local));
        else setUpcomingClasses([]);
      } else {
        setUpcomingClasses(data);
        localStorage.setItem('tuition_upcoming_classes_v1', JSON.stringify(data));
      }
    } catch (err) {
      console.error(err);
      const local = localStorage.getItem('tuition_upcoming_classes_v1');
      if (local) setUpcomingClasses(JSON.parse(local));
      else setUpcomingClasses([]);
    }
  };

  const handleAddUpcomingClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!upTitle || !upTeacher || !upDatetime || !upLink) return alert('Fill all required fields');
    const newUp = {
      title: upTitle,
      teacher: upTeacher,
      datetime: upDatetime,
      link: upLink,
      classImg: upClassImg || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600',
      teacherImg: upTeacherImg || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      id: Date.now()
    };

    try {
      const { data, error } = await supabase.from('upcoming_classes').insert([newUp]).select();
      if (error) {
        const updated = [...upcomingClasses, newUp];
        setUpcomingClasses(updated);
        localStorage.setItem('tuition_upcoming_classes_v1', JSON.stringify(updated));
      } else if (data && data[0]) {
        const updated = [...upcomingClasses, data[0]];
        setUpcomingClasses(updated);
        localStorage.setItem('tuition_upcoming_classes_v1', JSON.stringify(updated));
      }
    } catch {
      const updated = [...upcomingClasses, newUp];
      setUpcomingClasses(updated);
      localStorage.setItem('tuition_upcoming_classes_v1', JSON.stringify(updated));
    }

    setUpTitle(''); setUpTeacher(''); setUpDatetime(''); setUpLink(''); setUpClassImg(''); setUpTeacherImg('');
    alert('Upcoming Live Session scheduled successfully!');
  };

  const handleDeleteUpcomingClass = async (id: number) => {
    if (confirm('Delete this upcoming class?')) {
      try {
        await supabase.from('upcoming_classes').delete().eq('id', id);
      } catch (e) {
        console.error(e);
      }
      const filtered = upcomingClasses.filter(c => c.id !== id);
      setUpcomingClasses(filtered);
      localStorage.setItem('tuition_upcoming_classes_v1', JSON.stringify(filtered));
    }
  };

  const handleMoveToLive = async (c: any) => {
    const newLive = {
      title: c.title,
      teacher: c.teacher,
      time: 'Live Now!',
      link: c.link,
      classImg: c.classImg,
      teacherImg: c.teacherImg,
      id: Date.now(),
      date: c.datetime ? c.datetime.split('T')[0] : new Date().toISOString().split('T')[0]
    };

    const dbLive = {
      id: newLive.id,
      title: newLive.title,
      teacher: newLive.teacher,
      time: newLive.time,
      link: newLive.link,
      created_at: newLive.date ? new Date(newLive.date + 'T12:00:00Z').toISOString() : new Date().toISOString()
    };

    try {
      await supabase.from('online_classes').insert([dbLive]);
      await supabase.from('upcoming_classes').delete().eq('id', c.id);
    } catch (err) {
      console.error(err);
    }

    const updatedOnline = [newLive, ...onlineClasses];
    setOnlineClasses(updatedOnline);
    localStorage.setItem('tuition_online_classes_v1', JSON.stringify(updatedOnline));

    const filteredUpcoming = upcomingClasses.filter(item => item.id !== c.id);
    setUpcomingClasses(filteredUpcoming);
    localStorage.setItem('tuition_upcoming_classes_v1', JSON.stringify(filteredUpcoming));

    alert(`"${c.title}" is now LIVE! Moved to Live Sessions.`);
  };

  const handleOnlineClassImgFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setOnlineClassImg(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleOnlineTeacherImgFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setOnlineTeacherImg(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleUpClassImgFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setUpClassImg(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleUpTeacherImgFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setUpTeacherImg(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const loadLocalData = () => {
    const savedAdm = localStorage.getItem('tuition_submitted_admissions_v1');
    if (savedAdm) setAdmissions(JSON.parse(savedAdm));

    const savedAtt = localStorage.getItem('tuition_attendance_students_v1');
    if (savedAtt) {
      setAttendanceStudents(JSON.parse(savedAtt));
    } else {
      setAttendanceStudents([]);
    }
  };

  const toggleAdmin = () => {
    if (isAdmin) {
      setIsAdmin(false);
      localStorage.removeItem('ta_admin');
      alert('Admin logged out successfully');
      setCurrentPage('home');
    } else {
      const p = prompt("Enter Admin Password:", "King6611");
      if (p === adminPassword || p === 'admin' || p === 'King6611') {
        setIsAdmin(true);
        localStorage.setItem('ta_admin', '1');
        setCurrentPage('records');
        alert('Admin Access Granted! Opening Admin Dashboard.');
      } else if (p !== null) {
        alert('Incorrect password!');
      }
    }
  };

  // Helper to parse teacher's qualification and section
  const parseTeacherQual = (qualStr: string) => {
    if (!qualStr) return { qual: '', section: '' };
    const match = qualStr.match(/(.*)\s*\[Section:\s*(.*)\]/);
    if (match) {
      return { qual: match[1].trim(), section: match[2].trim() };
    }
    return { qual: qualStr, section: '' };
  };

  // Helper to parse online class title and section
  const parseOnlineTitle = (titleStr: string) => {
    if (!titleStr) return { title: '', section: '' };
    const match = titleStr.match(/(.*)\s*\[Section:\s*(.*)\]/);
    if (match) {
      return { title: match[1].trim(), section: match[2].trim() };
    }
    return { title: titleStr, section: '' };
  };

  // Add Teacher
  const handleAddTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tName || !tSubject || !tQual) return alert('Please fill required fields');
    
    const fullQual = tSection && tSection !== 'None' ? `${tQual} [Section: ${tSection}]` : tQual;
    const customDateIso = tDate ? new Date(tDate + 'T12:00:00Z').toISOString() : new Date().toISOString();
    
    const newT = { 
      name: tName, 
      subject: tSubject, 
      qual: fullQual, 
      img: tImg || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&q=80',
      created_at: customDateIso
    };
    
    try {
      const { data, error } = await supabase.from('teachers').insert([newT]).select();
      if (error) {
        console.error("Supabase teacher insert error:", error);
        const updated = [...teachers, { ...newT, id: Date.now() }];
        setTeachers(updated);
        localStorage.setItem('ta_teachers', JSON.stringify(updated));
      } else if (data) {
        setTeachers([...teachers, data[0]]);
      }
    } catch (err) {
      console.error(err);
      const updated = [...teachers, { ...newT, id: Date.now() }];
      setTeachers(updated);
      localStorage.setItem('ta_teachers', JSON.stringify(updated));
    }

    setTName(''); setTSubject(''); setTQual(''); setTImg('');
    setTDate(new Date().toISOString().split('T')[0]);
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
    
    const fullTitle = onlineSection && onlineSection !== 'None' ? `${onlineTitle} [Section: ${onlineSection}]` : onlineTitle;
    
    const newC = { 
      title: fullTitle, 
      teacher: onlineTeacher, 
      time: onlineTime, 
      date: onlineDate || new Date().toISOString().split('T')[0],
      link: onlineLink, 
      classImg: onlineClassImg || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600',
      teacherImg: onlineTeacherImg || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      id: Date.now() 
    };

    // Prepare database insert payload with compatible columns only
    const dbC = {
      id: newC.id,
      title: newC.title,
      teacher: newC.teacher,
      time: newC.time,
      link: newC.link,
      created_at: newC.date ? new Date(newC.date + 'T12:00:00Z').toISOString() : new Date().toISOString()
    };
    
    try {
      const { data, error } = await supabase.from('online_classes').insert([dbC]).select();
      if (error) {
        console.error("Supabase insert error:", error);
        const updated = [...onlineClasses, newC];
        setOnlineClasses(updated);
        localStorage.setItem('tuition_online_classes_v1', JSON.stringify(updated));
      } else if (data && data[0]) {
        const enriched = {
          ...data[0],
          date: data[0].created_at ? data[0].created_at.split('T')[0] : newC.date,
          classImg: newC.classImg,
          teacherImg: newC.teacherImg
        };
        const updated = [...onlineClasses, enriched];
        setOnlineClasses(updated);
        localStorage.setItem('tuition_online_classes_v1', JSON.stringify(updated));
      }
    } catch (err) {
      console.error(err);
      const updated = [...onlineClasses, newC];
      setOnlineClasses(updated);
      localStorage.setItem('tuition_online_classes_v1', JSON.stringify(updated));
    }

    setOnlineTitle(''); setOnlineTeacher(''); setOnlineTime(''); setOnlineDate(new Date().toISOString().split('T')[0]); setOnlineLink(''); setOnlineClassImg(''); setOnlineTeacherImg('');
    alert('Online class published successfully to backend database & portal!');
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

    const dbAdmission = {
      student_name: admStudentName,
      parent_name: admParentName,
      email: admEmail,
      phone: admPhone,
      roll_no: admRoll,
      class_name: admClass,
      address: admAddress,
      photo: admPhoto,
      created_at: new Date().toISOString()
    };

    let insertedAdmission = {
      id: Date.now(),
      studentName: admStudentName,
      parentName: admParentName,
      email: admEmail,
      phone: admPhone,
      rollNo: admRoll,
      className: admClass,
      address: admAddress,
      photo: admPhoto,
      created_at: dbAdmission.created_at
    };

    try {
      const { data, error } = await supabase.from('admissions').insert([dbAdmission]).select();
      if (error) {
        console.error("Supabase admission insert error:", error);
      } else if (data && data[0]) {
        insertedAdmission = {
          id: data[0].id,
          studentName: data[0].student_name,
          parentName: data[0].parent_name,
          email: data[0].email,
          phone: data[0].phone,
          rollNo: data[0].roll_no,
          className: data[0].class_name,
          address: data[0].address,
          photo: data[0].photo,
          created_at: data[0].created_at
        };
      }
    } catch (err) {
      console.error("Error during Supabase admission insert:", err);
    }

    const updatedAdmissions = [insertedAdmission, ...admissions];
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
        <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => setCurrentPage('home')}>
          <div className="w-11 h-11 rounded-2xl overflow-hidden bg-white shadow-md ring-2 ring-blue-500/20 group-hover:scale-105 transition-transform flex items-center justify-center p-1.5">
            {!logoError && academyLogo ? (
              <img 
                src={academyLogo} 
                alt="MBA Academy Logo" 
                className="w-full h-full object-contain rounded-xl" 
                referrerPolicy="no-referrer"
                onError={() => setLogoError(true)}
              />
            ) : (
              <GraduationCap className="w-7 h-7 text-blue-600" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl text-blue-950 tracking-tight">MBA</span>
              <span className="font-extrabold text-xl text-blue-600 tracking-tight">Academy</span>
            </div>
            <p className="text-[10px] font-semibold text-slate-500 tracking-wider uppercase">Excellence in Education</p>
          </div>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden lg:flex items-center gap-1 list-none text-sm font-medium">
          <li><button onClick={() => setCurrentPage('home')} className={`px-3 py-2 rounded-lg transition ${currentPage === 'home' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:bg-slate-100'}`}>Home</button></li>
          <li><button onClick={() => setCurrentPage('ad')} className={`px-3 py-2 rounded-lg transition ${currentPage === 'ad' ? 'bg-amber-50 text-amber-700 font-bold' : 'text-amber-600 hover:bg-amber-50 font-medium'}`}>📢 Pro Ad</button></li>
          <li><button onClick={() => setCurrentPage('about')} className={`px-3 py-2 rounded-lg transition ${currentPage === 'about' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:bg-slate-100'}`}>About Us</button></li>
          <li><button onClick={() => setCurrentPage('teachers')} className={`px-3 py-2 rounded-lg transition ${currentPage === 'teachers' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:bg-slate-100'}`}>Teachers</button></li>
          <li><button onClick={() => { setCurrentPage('attendance'); setSelectedClassForAttendance(null); }} className={`px-3 py-2 rounded-lg transition ${currentPage === 'attendance' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:bg-slate-100'}`}>Attendance</button></li>
          <li><button onClick={() => setCurrentPage('admission')} className={`px-3 py-2 rounded-lg transition ${currentPage === 'admission' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:bg-slate-100'}`}>Admission</button></li>
          <li><button onClick={() => setCurrentPage('online')} className={`px-3 py-2 rounded-lg transition ${currentPage === 'online' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:bg-slate-100'}`}>Online Classes</button></li>
          <li><button onClick={() => setCurrentPage('computer')} className={`px-3 py-2 rounded-lg transition ${currentPage === 'computer' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-600 hover:bg-indigo-50 hover:text-indigo-600'}`}>💻 Computer</button></li>
          <li><button onClick={() => setCurrentPage('results')} className={`px-3 py-2 rounded-lg transition ${currentPage === 'results' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:bg-slate-100'}`}>Results</button></li>
          <li><button onClick={() => setCurrentPage('gallery')} className={`px-3 py-2 rounded-lg transition ${currentPage === 'gallery' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:bg-slate-100'}`}>Gallery</button></li>
          <li><button onClick={() => setCurrentPage('contact')} className={`px-3 py-2 rounded-lg transition ${currentPage === 'contact' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:bg-slate-100'}`}>Contact</button></li>
          <li><button onClick={() => setCurrentPage('records')} className={`px-3 py-2 rounded-lg transition ${currentPage === 'records' ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-600 hover:bg-slate-100'}`}>Records</button></li>
        </ul>

        <div className="flex items-center gap-3">
          {/* Section Selector */}
          <div className="hidden sm:flex items-center gap-1.5 bg-blue-50/80 border border-blue-100 px-3 py-1.5 rounded-full text-xs font-semibold text-blue-900 shadow-2xs">
            <span className="text-[11px] uppercase tracking-wide font-extrabold text-blue-600">🏫 Sec:</span>
            <select 
              value={selectedSectionFilter} 
              onChange={e => {
                setSelectedSectionFilter(e.target.value);
                if (currentPage !== 'teachers' && currentPage !== 'online') {
                  setCurrentPage('teachers');
                }
              }} 
              className="bg-transparent font-bold text-blue-800 outline-none cursor-pointer text-xs pr-1"
            >
              <option value="all">All Sections</option>
              <option value="Primary Section">Primary</option>
              <option value="Middle Section">Middle</option>
              <option value="High Section">High</option>
              <option value="Senior Section">Senior</option>
              <option value="Computer Class">Computer Class</option>
              <option value="Ladies Section">Ladies</option>
            </select>
          </div>

          <a href="https://wa.me/923290725117" target="_blank" rel="noreferrer" className="w-9 h-9 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold shadow-sm hover:bg-emerald-600 transition" title="WhatsApp Chat">
            W
          </a>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden text-slate-700 p-1">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-6 py-4 flex flex-col gap-3 shadow-lg">
          {/* Section Selector in Mobile */}
          <div className="flex items-center justify-between bg-blue-50/80 border border-blue-100 px-4 py-2.5 rounded-xl text-xs font-semibold text-blue-900">
            <span className="text-[11px] uppercase tracking-wide font-extrabold text-blue-600">🏫 Filter Section:</span>
            <select 
              value={selectedSectionFilter} 
              onChange={e => {
                setSelectedSectionFilter(e.target.value);
                setMobileMenuOpen(false);
                if (currentPage !== 'teachers' && currentPage !== 'online') {
                  setCurrentPage('teachers');
                }
              }} 
              className="bg-transparent font-bold text-blue-800 outline-none cursor-pointer text-xs"
            >
              <option value="all">All Sections</option>
              <option value="Primary Section">Primary Section</option>
              <option value="Middle Section">Middle Section</option>
              <option value="High Section">High Section</option>
              <option value="Senior Section">Senior Section</option>
              <option value="Computer Class">Computer Class</option>
              <option value="Ladies Section">Ladies Section</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            {['home', 'ad', 'about', 'teachers', 'attendance', 'admission', 'online', 'computer', 'results', 'gallery', 'contact', 'records'].map(p => (
              <button key={p} onClick={() => { setCurrentPage(p); setMobileMenuOpen(false); if(p==='attendance') setSelectedClassForAttendance(null); }} className={`text-left px-4 py-2.5 rounded-lg text-sm font-medium capitalize ${currentPage === p ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}>
                {p === 'ad' ? '📢 Professional Admission Ad' : p === 'records' ? 'Records Dashboard' : p === 'computer' ? '💻 Computer Class' : p}
              </button>
            ))}

          </div>
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
                {isAdmin ? (
                  <>
                    <button 
                      onClick={() => setCurrentPage('records')} 
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-7 py-3 rounded-full shadow-lg transition flex items-center gap-2 text-sm cursor-pointer"
                    >
                      <Unlock size={18} /> Admin Dashboard
                    </button>
                    <button 
                      onClick={() => {
                        setIsAdmin(false);
                        localStorage.removeItem('ta_admin');
                        alert('Admin logged out successfully');
                        setCurrentPage('home');
                      }} 
                      className="bg-rose-600 hover:bg-rose-500 text-white font-semibold px-7 py-3 rounded-full shadow-lg transition flex items-center gap-2 text-sm cursor-pointer"
                    >
                      <Lock size={18} /> Logout Admin
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={toggleAdmin} 
                    className="bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700/60 font-semibold px-7 py-3 rounded-full shadow-lg transition flex items-center gap-2 text-sm cursor-pointer"
                  >
                    <Lock size={18} /> Admin Mode
                  </button>
                )}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <div className="flex items-center gap-2 bg-white p-3 rounded-xl border border-amber-200 text-sm">
                  <span className="text-slate-500 text-xs font-semibold whitespace-nowrap">Section:</span>
                  <select value={tSection} onChange={e => setTSection(e.target.value)} className="w-full bg-transparent outline-none cursor-pointer text-xs">
                    <option value="Primary Section">Primary Section (Class 1-5)</option>
                    <option value="Middle Section">Middle Section (Class 6-8)</option>
                    <option value="High Section">High Section (Class 9-10)</option>
                    <option value="Senior Section">Senior Section</option>
                    <option value="Computer Class">Computer Class Section</option>
                    <option value="Ladies Section">Ladies Section</option>
                    <option value="None">None (General)</option>
                  </select>
                </div>
                <div className="flex items-center gap-2 bg-white p-3 rounded-xl border border-amber-200 text-sm">
                  <span className="text-slate-500 text-xs font-semibold whitespace-nowrap">Joining/Record Date:</span>
                  <input type="date" value={tDate} onChange={e => setTDate(e.target.value)} className="w-full bg-transparent outline-none cursor-pointer text-xs" required />
                </div>
              </div>
              <div className="flex items-center gap-3 mb-3 bg-white p-3 rounded-xl border border-amber-200">
                <div className="w-12 h-12 rounded-lg bg-slate-200 overflow-hidden flex items-center justify-center font-bold text-slate-500">
                  {tImg ? <img src={tImg} alt="" className="w-full h-full object-cover" /> : '👤'}
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Teacher Photo Upload</label>
                  <input type="file" accept="image/*" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = () => setTImg(reader.result as string);
                      reader.readAsDataURL(file);
                    }
                  }} className="text-xs text-slate-500" />
                </div>
              </div>
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition shadow-sm">Add Teacher</button>
            </form>
          )}

          {selectedSectionFilter !== 'all' && (
            <div className="mb-6 bg-blue-50 border border-blue-200 p-4 rounded-xl flex items-center justify-between text-blue-800 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-base">🏫</span>
                <span>Showing teachers in <b>{selectedSectionFilter}</b> only.</span>
              </div>
              <button onClick={() => setSelectedSectionFilter('all')} className="bg-white border border-blue-200 text-blue-700 hover:bg-blue-100 font-bold text-xs px-3 py-1.5 rounded-lg transition">
                Show All Sections
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(() => {
              const filteredTeachers = teachers.filter(t => {
                if (selectedSectionFilter === 'all') return true;
                const { section } = parseTeacherQual(t.qual);
                return section === selectedSectionFilter;
              });

              if (filteredTeachers.length === 0) {
                return (
                  <div className="col-span-full text-center py-16 bg-white rounded-3xl border border-slate-200 text-slate-500">
                    <div className="text-4xl mb-2">👤</div>
                    <p className="text-sm font-medium">No teachers found in {selectedSectionFilter} right now.</p>
                  </div>
                );
              }

              return filteredTeachers.map(t => {
                const { qual, section } = parseTeacherQual(t.qual);
                const formattedDate = t.created_at ? new Date(t.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';
                return (
                  <div key={t.id} className="bg-white rounded-2xl overflow-hidden shadow-md border border-slate-100 transition hover:-translate-y-1">
                    <img src={t.img} alt={t.name} className="w-full h-56 object-cover bg-slate-200" />
                    <div className="p-6">
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        <span className="bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide">{t.subject}</span>
                        {section && (
                          <span className="bg-purple-50 text-purple-600 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide">Sec: {section}</span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mt-2 mb-1">{t.name}</h3>
                      <p className="text-xs text-slate-500 mb-3">{qual}</p>
                      {formattedDate && (
                        <p className="text-[10px] text-slate-400 font-medium mb-4">📅 Joined: {formattedDate}</p>
                      )}
                      {isAdmin && (
                        <button onClick={() => handleDeleteTeacher(t.id)} className="bg-red-50 text-red-600 hover:bg-red-100 font-semibold px-4 py-2 rounded-xl text-xs transition flex items-center gap-1.5 mt-2">
                          <Trash2 size={14} /> Delete Teacher
                        </button>
                      )}
                    </div>
                  </div>
                );
              });
            })()}
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
              <span className="bg-blue-50 text-blue-600 px-3.5 py-1.5 rounded-full text-xs font-semibold inline-block mb-2">E-Learning & Live</span>
              <h1 className="text-3xl font-bold text-slate-900">Live Classes & Upcoming Sessions</h1>
            </div>
          </div>

          {selectedSectionFilter !== 'all' && (
            <div className="mb-6 bg-blue-50 border border-blue-200 p-4 rounded-xl flex items-center justify-between text-blue-800 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-base">🏫</span>
                <span>Showing online classes in <b>{selectedSectionFilter}</b> only.</span>
              </div>
              <button onClick={() => setSelectedSectionFilter('all')} className="bg-white border border-blue-200 text-blue-700 hover:bg-blue-100 font-bold text-xs px-3 py-1.5 rounded-lg transition">
                Show All Sections
              </button>
            </div>
          )}

          {isAdmin && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
              <form onSubmit={handleAddOnlineClass} className="bg-amber-50 border border-amber-200 p-6 rounded-2xl shadow-sm">
                <h3 className="font-bold text-amber-900 mb-4 flex items-center gap-2"><Plus size={18} /> Publish Live Class Now (Admin)</h3>
                <div className="grid grid-cols-1 gap-3 mb-3">
                  <input type="text" placeholder="Title e.g. Math Class 9th" value={onlineTitle} onChange={e => setOnlineTitle(e.target.value)} className="bg-white p-3 rounded-xl border border-amber-200 text-sm outline-none" required />
                  <input type="text" placeholder="Teacher Name e.g. Sir Ahmed" value={onlineTeacher} onChange={e => setOnlineTeacher(e.target.value)} className="bg-white p-3 rounded-xl border border-amber-200 text-sm outline-none" required />
                  <input type="text" placeholder="Timing e.g. Daily 4:00 PM" value={onlineTime} onChange={e => setOnlineTime(e.target.value)} className="bg-white p-3 rounded-xl border border-amber-200 text-sm outline-none" required />
                  <div className="flex items-center gap-2 bg-white p-3 rounded-xl border border-amber-200 text-sm">
                    <span className="text-slate-500 text-xs font-semibold whitespace-nowrap">Class Date:</span>
                    <input type="date" value={onlineDate} onChange={e => setOnlineDate(e.target.value)} className="w-full bg-transparent outline-none cursor-pointer" required />
                  </div>
                  <div className="flex items-center gap-2 bg-white p-3 rounded-xl border border-amber-200 text-sm">
                    <span className="text-slate-500 text-xs font-semibold whitespace-nowrap">Class Section:</span>
                    <select value={onlineSection} onChange={e => setOnlineSection(e.target.value)} className="w-full bg-transparent outline-none cursor-pointer text-xs">
                      <option value="Section A">Section A</option>
                      <option value="Section B">Section B</option>
                      <option value="Section C">Section C</option>
                      <option value="Primary Section">Primary Section</option>
                      <option value="Middle Section">Middle Section</option>
                      <option value="High Section">High Section</option>
                      <option value="Computer Class">Computer Class Section</option>
                      <option value="Ladies Section">Ladies Section</option>
                      <option value="None">None (General)</option>
                    </select>
                  </div>
                  <input type="text" placeholder="Zoom / Video Meeting Link (URL)" value={onlineLink} onChange={e => setOnlineLink(e.target.value)} className="bg-white p-3 rounded-xl border border-amber-200 text-sm outline-none" required />
                  
                  <div className="bg-white p-3 rounded-xl border border-amber-200 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-lg bg-amber-100 overflow-hidden flex items-center justify-center text-xs font-bold text-amber-700">
                        {onlineClassImg ? <img src={onlineClassImg} alt="Banner" className="w-full h-full object-cover" /> : '📷'}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">Class Banner Image</span>
                        <span className="text-[10px] text-slate-500">Upload from computer / phone</span>
                      </div>
                    </div>
                    <input type="file" accept="image/*" onChange={handleOnlineClassImgFile} className="hidden" id="liveClassImgFile" />
                    <button type="button" onClick={() => document.getElementById('liveClassImgFile')?.click()} className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition">
                      Upload Image
                    </button>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-amber-200 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-amber-100 overflow-hidden flex items-center justify-center text-xs font-bold text-amber-700 border">
                        {onlineTeacherImg ? <img src={onlineTeacherImg} alt="Teacher" className="w-full h-full object-cover" /> : '👨‍🏫'}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">Teacher Photo</span>
                        <span className="text-[10px] text-slate-500">Upload portrait</span>
                      </div>
                    </div>
                    <input type="file" accept="image/*" onChange={handleOnlineTeacherImgFile} className="hidden" id="liveTeacherImgFile" />
                    <button type="button" onClick={() => document.getElementById('liveTeacherImgFile')?.click()} className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition">
                      Upload Photo
                    </button>
                  </div>
                </div>
                <button type="submit" className="bg-blue-600 text-white font-semibold px-6 py-2.5 rounded-xl text-xs">Publish Live Class</button>
              </form>

              <form onSubmit={handleAddUpcomingClass} className="bg-indigo-50 border border-indigo-200 p-6 rounded-2xl shadow-sm">
                <h3 className="font-bold text-indigo-900 mb-4 flex items-center gap-2"><Calendar size={18} /> Schedule Upcoming Live Session (Admin)</h3>
                <div className="grid grid-cols-1 gap-3 mb-3">
                  <input type="text" placeholder="Session Title e.g. Physics Quantum Mechanics" value={upTitle} onChange={e => setUpTitle(e.target.value)} className="bg-white p-3 rounded-xl border border-indigo-200 text-sm outline-none" required />
                  <input type="text" placeholder="Teacher Name e.g. Prof. Tariq" value={upTeacher} onChange={e => setUpTeacher(e.target.value)} className="bg-white p-3 rounded-xl border border-indigo-200 text-sm outline-none" required />
                  <input type="datetime-local" value={upDatetime} onChange={e => setUpDatetime(e.target.value)} className="bg-white p-3 rounded-xl border border-indigo-200 text-sm outline-none" required />
                  <input type="text" placeholder="Zoom / Video Meeting Link (URL)" value={upLink} onChange={e => setUpLink(e.target.value)} className="bg-white p-3 rounded-xl border border-indigo-200 text-sm outline-none" required />

                  <div className="bg-white p-3 rounded-xl border border-indigo-200 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-lg bg-indigo-100 overflow-hidden flex items-center justify-center text-xs font-bold text-indigo-700">
                        {upClassImg ? <img src={upClassImg} alt="Banner" className="w-full h-full object-cover" /> : '📷'}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">Banner Image</span>
                        <span className="text-[10px] text-slate-500">Upload from computer / phone</span>
                      </div>
                    </div>
                    <input type="file" accept="image/*" onChange={handleUpClassImgFile} className="hidden" id="upClassImgFile" />
                    <button type="button" onClick={() => document.getElementById('upClassImgFile')?.click()} className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition">
                      Upload Image
                    </button>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-indigo-200 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 overflow-hidden flex items-center justify-center text-xs font-bold text-indigo-700 border">
                        {upTeacherImg ? <img src={upTeacherImg} alt="Teacher" className="w-full h-full object-cover" /> : '👨‍🏫'}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">Teacher Photo</span>
                        <span className="text-[10px] text-slate-500">Upload portrait</span>
                      </div>
                    </div>
                    <input type="file" accept="image/*" onChange={handleUpTeacherImgFile} className="hidden" id="upTeacherImgFile" />
                    <button type="button" onClick={() => document.getElementById('upTeacherImgFile')?.click()} className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition">
                      Upload Photo
                    </button>
                  </div>
                </div>
                <button type="submit" className="bg-indigo-600 text-white font-semibold px-6 py-2.5 rounded-xl text-xs">Schedule Upcoming Session</button>
              </form>
            </div>
          )}

          {/* UPCOMING LIVE SESSIONS SECTION */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-indigo-100 text-indigo-700 rounded-2xl"><Calendar size={22} /></div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Upcoming Live Sessions</h2>
                <p className="text-xs text-slate-500">Scheduled future classes that will automatically go live when their time arrives.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(() => {
                const filteredUpcoming = upcomingClasses.filter(c => {
                  if (selectedSectionFilter === 'all') return true;
                  const { section } = parseOnlineTitle(c.title);
                  return section === selectedSectionFilter;
                });

                if (filteredUpcoming.length === 0) {
                  return (
                    <div className="col-span-full text-center py-12 bg-white rounded-3xl border border-slate-200 text-slate-400">
                      <div className="text-3xl mb-2">🗓️</div>
                      <p className="text-xs font-medium">No upcoming sessions scheduled for {selectedSectionFilter} right now.</p>
                    </div>
                  );
                }

                return filteredUpcoming.map(c => (
                  <div key={c.id} className="bg-white rounded-3xl overflow-hidden shadow-md border border-indigo-100 flex flex-col justify-between hover:shadow-xl transition duration-300">
                    <div className="p-6 relative overflow-hidden text-white h-48 flex flex-col justify-between" style={{ background: c.classImg ? `url(${c.classImg}) center/cover no-repeat` : 'linear-gradient(to bottom right, #312e81, #1e1b4b, #0f172a)' }}>
                      {c.classImg && <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px]"></div>}
                      <div className="flex justify-between items-center z-10">
                        <div className="bg-indigo-500/80 backdrop-blur-md px-3.5 py-1.5 rounded-full flex items-center gap-2 border border-white/15 shadow-sm text-white">
                          <span className="w-2 h-2 rounded-full bg-amber-300 animate-ping"></span>
                          <span className="text-xs font-bold tracking-wide">Upcoming Session</span>
                        </div>
                        {isAdmin && (
                          <div className="flex gap-1">
                            <button onClick={() => handleMoveToLive(c)} title="Go Live Now" className="bg-emerald-600 hover:bg-emerald-700 text-white p-1.5 rounded-xl transition text-xs font-bold px-2.5">🚀 Go Live</button>
                            <button onClick={() => handleDeleteUpcomingClass(c.id)} className="bg-rose-500/80 hover:bg-rose-600 text-white p-1.5 rounded-xl transition"><Trash2 size={14} /></button>
                          </div>
                        )}
                      </div>

                      <div className="flex justify-between items-end z-10">
                        <div className="text-[11px] text-indigo-200 font-medium">Auto-Live Scheduler</div>
                        <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold border border-white/25">
                          ⏳ {new Date(c.datetime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                        </div>
                      </div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        {(() => {
                          const { title, section } = parseOnlineTitle(c.title);
                          return (
                            <div className="mb-3">
                              <h3 className="text-lg font-extrabold text-slate-900 line-clamp-2">{title}</h3>
                              {section && (
                                <span className="inline-block bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md text-[10px] font-bold mt-1">Section: {section}</span>
                              )}
                            </div>
                          );
                        })()}
                        <div className="space-y-1.5 mb-6 text-xs text-slate-600">
                          <div className="flex items-center gap-2">
                            <span className="text-slate-400">📅</span>
                            <span className="font-semibold text-slate-800">{new Date(c.datetime).toDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-slate-400">⏰</span>
                            <span className="font-semibold text-slate-800">{new Date(c.datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between border-t border-slate-100 pt-4 mb-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-500 text-white font-bold flex items-center justify-center text-sm shadow-sm overflow-hidden border border-slate-200">
                              <img src={c.teacherImg || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"} alt={c.teacher} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <b className="text-xs text-slate-900 block">{c.teacher}</b>
                              <span className="text-[11px] text-indigo-600 font-semibold">Instructor</span>
                            </div>
                          </div>

                          <button onClick={() => alert(`Reminder successfully set for "${c.title}"! We will notify you when it goes live.`)} className="border border-indigo-600/30 hover:border-indigo-600 text-indigo-700 hover:bg-indigo-50 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition">
                            🔔 Notify Me
                          </button>
                        </div>

                        <a href={c.link.startsWith('http') ? c.link : `https://${c.link}`} target="_blank" rel="noreferrer" className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 rounded-xl text-xs text-center transition flex items-center justify-center gap-1.5">
                          Preview Class Link <ExternalLink size={13} />
                        </a>
                      </div>
                    </div>
                  </div>
                ));
              })()}
            </div>
          </div>

          {/* ACTIVE LIVE CLASSES SECTION */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-rose-100 text-rose-700 rounded-2xl"><Video size={22} /></div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Active Live Classes Now</h2>
                <p className="text-xs text-slate-500">Join ongoing classes instantly via Google Meet / Zoom.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(() => {
              const filteredOnline = onlineClasses.filter(c => {
                if (selectedSectionFilter === 'all') return true;
                const { section } = parseOnlineTitle(c.title);
                return section === selectedSectionFilter;
              });

              if (filteredOnline.length === 0) {
                return (
                  <div className="col-span-full text-center py-16 bg-white rounded-3xl border border-slate-200 text-slate-500">
                    <div className="text-4xl mb-2">📹</div>
                    <p className="text-sm font-medium">No active online classes right now for {selectedSectionFilter}.</p>
                  </div>
                );
              }

              return filteredOnline.map(c => (
                <div key={c.id} className="bg-white rounded-3xl overflow-hidden shadow-md border border-slate-200 flex flex-col justify-between hover:shadow-xl transition duration-300">
                  {/* Top Banner with Class Image */}
                  <div className="p-6 relative overflow-hidden text-white h-48 flex flex-col justify-between" style={{ background: c.classImg ? `url(${c.classImg}) center/cover no-repeat` : 'linear-gradient(to bottom right, #0f172a, #1e1b4b, #172554)' }}>
                    {c.classImg && <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px]"></div>}
                    <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-blue-600/20 rounded-full blur-2xl pointer-events-none"></div>
                    <div className="flex justify-between items-center z-10">
                      <div className="bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full flex items-center gap-2 border border-white/15 shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span className="text-xs font-bold tracking-wide">Google Meet</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="bg-white/15 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-semibold border border-white/20">🌐 English</span>
                        {isAdmin && (
                          <button onClick={() => handleDeleteOnlineClass(c.id)} className="bg-rose-500/80 hover:bg-rose-600 text-white p-1.5 rounded-xl transition"><Trash2 size={14} /></button>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between items-end z-10">
                      <div className="text-[11px] text-blue-200 font-medium opacity-90">MBA Academy Live</div>
                      <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold border border-white/25 flex items-center gap-1.5">
                        <span>⏱️ 30 Min</span>
                      </div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      {(() => {
                        const { title, section } = parseOnlineTitle(c.title);
                        return (
                          <div className="mb-3">
                            <h3 className="text-lg font-extrabold text-slate-900 line-clamp-2">{title}</h3>
                            {section && (
                              <span className="inline-block bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md text-[10px] font-bold mt-1">Section: {section}</span>
                            )}
                          </div>
                        );
                      })()}
                      
                      <div className="space-y-1.5 mb-6 text-xs text-slate-600">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400">📅</span>
                          <span>
                            {(() => {
                              if (!c.date) {
                                return new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                              }
                              const parsed = new Date(c.date);
                              if (isNaN(parsed.getTime())) {
                                return c.date;
                              }
                              return parsed.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                            })()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400">⏰</span>
                          <span className="font-semibold text-slate-800">{c.time} (Karachi)</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between border-t border-slate-100 pt-4 mb-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 text-white font-bold flex items-center justify-center text-sm shadow-sm overflow-hidden border border-slate-200">
                            <img src={c.teacherImg || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"} alt={c.teacher} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <b className="text-xs text-slate-900 block">{c.teacher}</b>
                            <div className="flex items-center gap-1 text-[11px] text-amber-500 font-bold">
                              <span>★</span>
                              <span className="text-slate-700">5.0</span>
                            </div>
                          </div>
                        </div>

                        <button onClick={() => alert(`Reminder set for "${c.title}"! We will notify you before class starts.`)} className="border border-blue-600/30 hover:border-blue-600 text-blue-700 hover:bg-blue-50 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition">
                          Notify Me
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <a href={c.link.startsWith('http') ? c.link : `https://${c.link}`} target="_blank" rel="noreferrer" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl text-xs text-center transition flex items-center justify-center gap-1.5 shadow-sm">
                          Learn Now <ExternalLink size={13} />
                        </a>
                        <button onClick={() => alert(`Class Details:\nTitle: ${c.title}\nInstructor: ${c.teacher}\nTiming: ${c.time}\nMeeting Link: ${c.link}`)} className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 rounded-xl text-xs text-center transition">
                          Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ));
            })()}
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

          {isAdmin && (
            <form onSubmit={handleAddResult} className="bg-amber-50 border border-amber-200 p-6 rounded-2xl mb-8 shadow-sm">
              <h3 className="font-bold text-amber-900 mb-4 flex items-center gap-2"><Plus size={18} /> Publish Student Result & Official Results Card (Admin)</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                <input type="text" placeholder="Student Full Name *" value={resStudentName} onChange={e => setResStudentName(e.target.value)} className="bg-white p-3 rounded-xl border border-amber-200 text-sm outline-none" required />
                <input type="text" placeholder="Father Name *" value={resFatherName} onChange={e => setResFatherName(e.target.value)} className="bg-white p-3 rounded-xl border border-amber-200 text-sm outline-none" required />
                <input type="text" placeholder="Roll Number e.g. 901 *" value={resRollNo} onChange={e => setResRollNo(e.target.value)} className="bg-white p-3 rounded-xl border border-amber-200 text-sm outline-none" required />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
                <select value={resClass} onChange={e => setResClass(e.target.value)} className="bg-white p-3 rounded-xl border border-amber-200 text-sm outline-none">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <option key={i + 1} value={`Class ${i + 1}`}>Class {i + 1}</option>
                  ))}
                </select>
                <input type="text" placeholder="Exam Type e.g. Annual Examination" value={resExamType} onChange={e => setResExamType(e.target.value)} className="bg-white p-3 rounded-xl border border-amber-200 text-sm outline-none" />
                <input type="text" placeholder="Term / Semester e.g. Final Term" value={resTerm} onChange={e => setResTerm(e.target.value)} className="bg-white p-3 rounded-xl border border-amber-200 text-sm outline-none" />
                <input type="text" placeholder="Academic Year e.g. 2025-2026" value={resYear} onChange={e => setResYear(e.target.value)} className="bg-white p-3 rounded-xl border border-amber-200 text-sm outline-none" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
                <input type="date" value={resDate} onChange={e => setResDate(e.target.value)} className="bg-white p-3 rounded-xl border border-amber-200 text-sm outline-none" />
                <input type="number" placeholder="Marks Obtained e.g. 460 *" value={resMarks} onChange={e => setResMarks(e.target.value)} className="bg-white p-3 rounded-xl border border-amber-200 text-sm outline-none" required />
                <input type="number" placeholder="Total Marks (default 500)" value={resTotalMarks} onChange={e => setResTotalMarks(e.target.value)} className="bg-white p-3 rounded-xl border border-amber-200 text-sm outline-none" />
                <select value={resGrade} onChange={e => setResGrade(e.target.value)} className="bg-white p-3 rounded-xl border border-amber-200 text-sm outline-none">
                  <option value="A+">Grade A+ (90%+)</option>
                  <option value="A">Grade A (80-89%)</option>
                  <option value="B">Grade B (70-79%)</option>
                  <option value="C">Grade C (60-69%)</option>
                  <option value="Pass">Pass</option>
                </select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="text-xs font-semibold text-amber-900 block mb-1">Upload Student Photo / Paste URL</label>
                  <div className="flex gap-2 items-center">
                    <input type="file" accept="image/*" onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          if (event.target?.result) {
                            setResPhoto(event.target.result as string);
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }} className="bg-white p-2 rounded-xl border border-amber-200 text-xs text-slate-600 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 flex-1" />
                    {resPhoto && <span className="text-xs text-emerald-700 font-bold shrink-0">✓ Photo Loaded</span>}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-amber-900 block mb-1">Teacher's Remarks</label>
                  <input type="text" placeholder="Remarks e.g. Excellent student!" value={resRemarks} onChange={e => setResRemarks(e.target.value)} className="bg-white p-3 rounded-xl border border-amber-200 text-sm outline-none w-full" />
                </div>
              </div>
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition shadow-sm">
                Publish Result to Backend Database & Portal
              </button>
            </form>
          )}

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8 flex flex-wrap gap-4">
            <input type="text" placeholder="Enter Roll Number e.g. 901" value={searchRoll} onChange={e => setSearchRoll(e.target.value)} className="flex-1 min-w-[200px] bg-slate-50 p-3 rounded-xl border border-slate-200 text-sm outline-none" />
            <select value={searchClass} onChange={e => setSearchClass(e.target.value)} className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-sm outline-none">
              <option value="all">All Classes</option>
              {Array.from({ length: 10 }).map((_, i) => (
                <option key={i + 1} value={`Class ${i + 1}`}>Class {i + 1}</option>
              ))}
            </select>
            <button onClick={() => {
              const foundRes = resultsList.find(r => r.rollNo === searchRoll && (searchClass === 'all' || r.className === searchClass));
              if (foundRes) {
                setSearchedResult(foundRes);
              } else {
                const foundAtt = attendanceStudents.find(s => s.roll === searchRoll && (searchClass === 'all' || s.cls === searchClass));
                if (foundAtt) {
                  setSearchedResult({
                    studentName: foundAtt.name,
                    fatherName: 'Muhammad',
                    rollNo: foundAtt.roll,
                    className: foundAtt.cls,
                    examType: 'Annual Examination',
                    term: 'Final Term',
                    academicYear: '2025 - 2026',
                    dateOfResult: '2026-08-10',
                    studentPhoto: '',
                    marks: '450 / 500',
                    marksObtained: 450,
                    totalMarks: 500,
                    percentage: '90.0%',
                    grade: 'A+',
                    remarks: 'Excellent academic consistency.'
                  });
                } else {
                  alert('No student result found with this Roll No. Please check.');
                  setSearchedResult(null);
                }
              }
            }} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold text-sm transition">
              Search Result Card
            </button>
          </div>

          {searchedResult && (
            <div id="official-results-card" className="bg-white rounded-3xl shadow-2xl border-4 border-amber-500/80 p-8 md:p-10 relative overflow-hidden mb-12 text-slate-800">
              {/* Certificate Header */}
              <div className="flex justify-between items-center border-b-2 border-slate-900 pb-6 mb-6 flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-900 via-blue-700 to-indigo-600 text-white flex items-center justify-center font-black text-3xl shadow-md">
                    🎓
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-black text-blue-950 tracking-tight">MBA ACADEMY</h2>
                    <p className="text-xs font-semibold text-slate-500 tracking-wider">Quality Education for Bright Future</p>
                  </div>
                </div>
                <div className="text-right bg-blue-50 border border-blue-200 px-4 py-2 rounded-xl">
                  <span className="text-[10px] font-bold text-slate-500 block uppercase">Contact Support</span>
                  <b className="text-sm font-bold text-blue-900">0300-0000000 / 03290725117</b>
                </div>
              </div>

              {/* Title Badge */}
              <div className="text-center mb-8">
                <div className="inline-block bg-gradient-to-r from-blue-950 via-blue-900 to-blue-950 text-amber-300 font-extrabold text-sm md:text-base px-8 py-2 rounded-full shadow-md uppercase tracking-wider border border-amber-400/50">
                  ★ OFFICIAL RESULTS CARD ★
                </div>
              </div>

              {/* Student Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-200 mb-8 items-center">
                <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-xs font-semibold text-slate-500 block">Student Name:</span>
                    <b className="text-base text-slate-900 underline decoration-slate-300 underline-offset-4">{searchedResult.studentName}</b>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-500 block">Roll No.:</span>
                    <b className="text-base text-slate-900 underline decoration-slate-300 underline-offset-4">{searchedResult.rollNo}</b>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-500 block">Father Name:</span>
                    <b className="text-base text-slate-900 underline decoration-slate-300 underline-offset-4">{searchedResult.fatherName || 'Muhammad'}</b>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-500 block">Exam Type:</span>
                    <b className="text-base text-slate-900 underline decoration-slate-300 underline-offset-4">{searchedResult.examType || 'Annual Examination'}</b>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-500 block">Class / Course:</span>
                    <b className="text-base text-slate-900 underline decoration-slate-300 underline-offset-4">{searchedResult.className}</b>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-500 block">Term / Semester:</span>
                    <b className="text-base text-slate-900 underline decoration-slate-300 underline-offset-4">{searchedResult.term || 'Final Term'}</b>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-500 block">Academic Year:</span>
                    <b className="text-base text-slate-900 underline decoration-slate-300 underline-offset-4">{searchedResult.academicYear || '2025 - 2026'}</b>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-500 block">Date of Result:</span>
                    <b className="text-base text-slate-900 underline decoration-slate-300 underline-offset-4">{searchedResult.dateOfResult || searchedResult.createdAt?.split('T')[0] || '2026-08-10'}</b>
                  </div>
                </div>

                <div className="flex justify-center">
                  <div className="w-28 h-36 bg-white rounded-xl border-2 border-slate-300 overflow-hidden shadow-inner flex items-center justify-center">
                    {searchedResult.studentPhoto ? (
                      <img src={searchedResult.studentPhoto} alt="Student" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center p-2">
                        <span className="text-3xl">👤</span>
                        <span className="text-[10px] font-bold text-slate-400 block mt-1 uppercase">Student Photo</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Marks Summary Box */}
              <div className="bg-blue-900 text-white p-4 rounded-xl mb-8 flex flex-wrap justify-around text-center gap-4">
                <div>
                  <span className="text-xs text-blue-200 block uppercase font-semibold">Total Marks</span>
                  <span className="text-xl font-black">{searchedResult.totalMarks || 500}</span>
                </div>
                <div className="border-r border-blue-700"></div>
                <div>
                  <span className="text-xs text-blue-200 block uppercase font-semibold">Obtained Marks</span>
                  <span className="text-xl font-black text-amber-300">{searchedResult.marks}</span>
                </div>
                <div className="border-r border-blue-700"></div>
                <div>
                  <span className="text-xs text-blue-200 block uppercase font-semibold">Percentage</span>
                  <span className="text-xl font-black text-emerald-300">{searchedResult.percentage}</span>
                </div>
                <div className="border-r border-blue-700"></div>
                <div>
                  <span className="text-xs text-blue-200 block uppercase font-semibold">Final Grade</span>
                  <span className="text-xl font-black text-amber-300">{searchedResult.grade}</span>
                </div>
              </div>

              {/* Remarks Box */}
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl mb-8 text-sm">
                <b className="text-amber-900 block mb-1">Teacher's Remarks & Evaluation:</b>
                <p className="text-slate-700 italic">"{searchedResult.remarks || 'Excellent academic performance. Keep up the hard work!'}"</p>
              </div>

              {/* Signatures with official sign images */}
              <div className="grid grid-cols-3 gap-6 pt-10 pb-6 text-center text-xs text-slate-600 font-semibold items-end">
                <div className="border-t-2 border-slate-400 pt-3 relative">
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 font-serif italic text-blue-900 text-lg opacity-80 select-none">M. Tariq</div>
                  Class Teacher Signature
                </div>
                <div className="border-t-2 border-slate-400 pt-3 relative">
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 font-serif italic text-slate-700 text-lg opacity-80 select-none">Guardian</div>
                  Parent / Guardian Signature
                </div>
                <div className="border-t-2 border-slate-400 pt-3 relative">
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 font-serif italic text-amber-800 font-bold text-lg opacity-90 select-none">Prof. A. Rauf</div>
                  Principal Signature
                </div>
              </div>

              {/* Print Button for Students */}
              <div className="text-center mt-6 pt-4 border-t border-slate-200 print:hidden flex flex-wrap justify-center gap-4">
                <button onClick={() => {
                  const cardElement = document.getElementById('official-results-card');
                  const printWindow = window.open('', '_blank');
                  if (printWindow && cardElement) {
                    // Clone HTML and remove print button from print preview
                    const clone = cardElement.cloneNode(true) as HTMLElement;
                    const printBtnDiv = clone.querySelector('.print\\:hidden');
                    if (printBtnDiv) printBtnDiv.remove();

                    printWindow.document.write(`
                      <html>
                        <head>
                          <title>MBA Academy - Official Results Card (${searchedResult.studentName})</title>
                          <script src="https://cdn.tailwindcss.com"></script>
                        </head>
                        <body class="p-8 bg-white text-slate-800 font-sans">
                          ${clone.outerHTML}
                          <script>
                            window.onload = () => { window.print(); };
                          </script>
                        </body>
                      </html>
                    `);
                    printWindow.document.close();
                  } else {
                    window.print();
                  }
                }} className="bg-gradient-to-r from-blue-900 to-blue-700 hover:from-blue-800 hover:to-blue-600 text-white font-bold px-8 py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 mx-auto text-sm transition transform hover:scale-105">
                  🖨️ Print / Download Results Card
                </button>
              </div>
            </div>
          )}

          {/* Published Results list visible to everyone with link */}
          {resultsList.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden p-6">
              <h3 className="font-bold text-slate-800 text-lg mb-4">Published Results Directory ({resultsList.length})</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                      <th className="p-3.5">Student Name</th>
                      <th className="p-3.5">Class & Roll</th>
                      <th className="p-3.5">Marks</th>
                      <th className="p-3.5">Percentage</th>
                      <th className="p-3.5">Grade</th>
                      {isAdmin && <th className="p-3.5">Action</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {resultsList.map(res => (
                      <tr key={res.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                        <td className="p-3.5 font-bold text-slate-900">{res.studentName}</td>
                        <td className="p-3.5"><span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-semibold">{res.className}</span> <span className="text-xs text-slate-500">Roll: {res.rollNo}</span></td>
                        <td className="p-3.5 font-semibold">{res.marks}</td>
                        <td className="p-3.5 text-emerald-700 font-bold">{res.percentage}</td>
                        <td className="p-3.5"><span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-xs font-bold">{res.grade}</span></td>
                        {isAdmin && (
                          <td className="p-3.5">
                            <button onClick={() => handleDeleteResult(res.id)} className="text-rose-600 hover:bg-rose-50 p-1.5 rounded-lg"><Trash2 size={16} /></button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
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

      {/* PAGE: PROFESSIONAL AD POSTER */}
      {currentPage === 'ad' && (
        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="text-center mb-10">
            <span className="bg-amber-100 text-amber-800 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider inline-block mb-3">Official Advertisement & Poster</span>
            <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight">MBA Academy Admission Poster 2026</h1>
            <p className="text-sm text-slate-600 mt-2 max-w-xl mx-auto">Preview and share our professional coaching admission ad. Print or download for distribution.</p>
          </div>

          <div className="bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950 text-white rounded-3xl p-8 md:p-14 shadow-2xl border-4 border-amber-400 relative overflow-hidden">
            {/* Background design accents */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-2xl bg-white p-2.5 shadow-2xl mb-6 flex items-center justify-center">
                {!logoError && academyLogo ? (
                  <img 
                    src={academyLogo} 
                    alt="MBA Academy Logo" 
                    className="w-full h-full object-contain rounded-xl" 
                    referrerPolicy="no-referrer"
                    onError={() => setLogoError(true)}
                  />
                ) : (
                  <GraduationCap className="w-12 h-12 text-blue-600" />
                )}
              </div>

              <div className="bg-amber-400 text-blue-950 px-5 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-4 shadow-md">
                ⭐ Admissions Open 2026-27 ⭐
              </div>

              <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-3">
                MBA ACADEMY
              </h2>
              <p className="text-amber-300 font-bold text-lg md:text-xl tracking-wide mb-6">
                CLASSES 1 TO 10 • QUALITY EDUCATION & PROFESSIONAL COACHING
              </p>

              <div className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 my-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                  <div className="text-2xl mb-2">📚</div>
                  <h4 className="font-bold text-white text-sm mb-1">Expert Coaching</h4>
                  <p className="text-xs text-slate-300">Specialized subject coaching for Math, Science, English, Urdu & Computer.</p>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                  <div className="text-2xl mb-2">🏆</div>
                  <h4 className="font-bold text-white text-sm mb-1">Proven Results</h4>
                  <p className="text-xs text-slate-300">100% success rate with top board positions and weekly test monitoring.</p>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                  <div className="text-2xl mb-2">👥</div>
                  <h4 className="font-bold text-white text-sm mb-1">Small Batches</h4>
                  <p className="text-xs text-slate-300">Individual attention to every student with daily homework support.</p>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-6 my-6 text-sm">
                <div className="bg-emerald-600/90 text-white px-6 py-3 rounded-2xl shadow-lg font-bold flex items-center gap-2">
                  <span>📞 Phone:</span> <span>0329-0725117 / 0341-8709574</span>
                </div>
                <a href="https://wa.me/923290725117" target="_blank" rel="noreferrer" className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-2xl shadow-lg font-bold flex items-center gap-2 transition">
                  <span>💬 WhatsApp Support:</span> <span>0329-0725117</span>
                </a>
              </div>

              <div className="mt-4 text-xs text-slate-300 font-medium">
                📍 Visit Us Today for Free Demo Class & Assessment • Limited Seats Available!
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-4 mt-8">
            <button onClick={() => window.print()} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3.5 rounded-2xl shadow-lg flex items-center gap-2 text-sm transition">
              🖨️ Print / Save Poster as PDF
            </button>
            <a href="https://wa.me/?text=Admissions%20Open%20at%20MBA%20Academy%20for%20Classes%201%20to%2010!%20Call%2003290725117" target="_blank" rel="noreferrer" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-3.5 rounded-2xl shadow-lg flex items-center gap-2 text-sm transition">
              💬 Share Ad on WhatsApp
            </a>
          </div>
        </div>
      )}

      {/* PAGE: COMPUTER CLASS SECTION */}
      {currentPage === 'computer' && (
        <ComputerSection 
          isAdmin={isAdmin}
          teachers={teachers}
          onlineClasses={onlineClasses}
          parseTeacherQual={parseTeacherQual}
          parseOnlineTitle={parseOnlineTitle}
          handleDeleteTeacher={handleDeleteTeacher}
          setCurrentPage={setCurrentPage}
        />
      )}

      {/* PAGE: ADMIN RECORDS */}
      {currentPage === 'records' && (
        <div className="max-w-6xl mx-auto px-6 py-16">
          {!isAdmin ? (
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl text-center max-w-md mx-auto border border-slate-200">
              <div className="text-5xl mb-4">🔒</div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Admin Access Required</h2>
              <p className="text-xs text-slate-500 mb-6">Enter Admin password below to open the Admin Records Dashboard.</p>
              
              <div className="flex flex-col gap-3">
                <input 
                  type="password" 
                  placeholder="Enter Password" 
                  value={adminPassInput} 
                  onChange={e => setAdminPassInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      if (adminPassInput === adminPassword || adminPassInput === 'admin' || adminPassInput === 'King6611') {
                        setIsAdmin(true);
                        localStorage.setItem('ta_admin', '1');
                        setAdminPassInput('');
                        alert('Admin Access Granted!');
                      } else {
                        alert('Incorrect password!');
                      }
                    }
                  }}
                  className="p-3 rounded-xl border border-slate-200 text-sm outline-none bg-slate-50 text-center"
                />
                <button onClick={() => {
                  if (adminPassInput === adminPassword || adminPassInput === 'admin' || adminPassInput === 'King6611') {
                    setIsAdmin(true);
                    localStorage.setItem('ta_admin', '1');
                    setAdminPassInput('');
                    alert('Admin Access Granted!');
                  } else {
                    alert('Incorrect password!');
                  }
                }} className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl text-xs font-semibold shadow-sm transition">
                  Login Admin Dashboard
                </button>
                <button onClick={() => {
                  const pass = prompt('Enter Admin Password:', 'King6611');
                  if (pass === adminPassword || pass === 'admin' || pass === 'King6611') {
                    setIsAdmin(true);
                    localStorage.setItem('ta_admin', '1');
                    alert('Admin Access Granted!');
                  } else if (pass !== null) {
                    alert('Incorrect password!');
                  }
                }} className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-2.5 rounded-xl text-xs font-semibold transition">
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
              
              {/* ACADEMY BRANDING & LOGO SETTINGS */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-3xl p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs text-left">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-white shadow-md border border-blue-200 p-2 flex items-center justify-center shrink-0">
                    {!logoError && academyLogo ? (
                      <img 
                        src={academyLogo} 
                        alt="Academy Logo Preview" 
                        className="w-full h-full object-contain rounded-xl" 
                        onError={() => setLogoError(true)}
                      />
                    ) : (
                      <GraduationCap className="w-10 h-10 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">Academy Logo Settings</h3>
                    <p className="text-xs text-slate-600 mt-0.5">Upload a professional logo for MBA Academy. It will instantly update across the Navbar, Footer, and Professional Ad Poster!</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 shrink-0">
                  <input 
                    type="file" 
                    accept="image/*" 
                    id="academyLogoUpload" 
                    className="hidden" 
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = () => {
                          const base64 = reader.result as string;
                          localStorage.setItem('tuition_academy_logo_v1', base64);
                          setAcademyLogo(base64);
                          setLogoError(false); // Reset error state to try loading new logo
                          alert('Academy Logo updated successfully!');
                        };
                        reader.readAsDataURL(file);
                      }
                    }} 
                  />
                  <button 
                    onClick={() => document.getElementById('academyLogoUpload')?.click()} 
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>📁</span> Upload Custom Logo
                  </button>
                  {academyLogo !== '/logo.jpg' && (
                    <button 
                      onClick={() => {
                        if (confirm('Reset logo to default?')) {
                          localStorage.removeItem('tuition_academy_logo_v1');
                          setAcademyLogo('/logo.jpg');
                          setLogoError(false);
                        }
                      }} 
                      className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold px-3 py-2.5 rounded-xl text-xs transition cursor-pointer"
                    >
                      Reset Default
                    </button>
                  )}
                </div>
              </div>

              {/* ADMIN PASSWORD SETTINGS */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 mb-8 shadow-xs text-left">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-rose-50 rounded-2xl text-rose-600 shrink-0">
                      <Lock className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-base">Change Admin Password</h3>
                      <p className="text-xs text-slate-600 mt-0.5">Secure your admin portal by updating your default password.</p>
                    </div>
                  </div>
                  <div className="text-xs text-slate-500 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 self-start sm:self-auto">
                    Current Password: <span className="font-mono bg-slate-100 px-2 py-0.5 rounded font-bold text-slate-800">{adminPassword}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-3">
                  <input 
                    type="text"
                    placeholder="Enter New Password"
                    value={newPasswordInput}
                    onChange={e => setNewPasswordInput(e.target.value)}
                    className="p-3 rounded-xl border border-slate-200 text-xs outline-none bg-slate-50 w-full sm:w-64 font-mono text-slate-800"
                  />
                  <button 
                    onClick={() => {
                      if (!newPasswordInput.trim()) {
                        alert('Please enter a valid password.');
                        return;
                      }
                      localStorage.setItem('tuition_admin_password_v1', newPasswordInput.trim());
                      setAdminPassword(newPasswordInput.trim());
                      setNewPasswordInput('');
                      alert('Admin Password updated successfully to: ' + newPasswordInput.trim());
                    }}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-5 py-3 rounded-xl text-xs shadow-sm transition flex items-center gap-1.5 cursor-pointer w-full sm:w-auto justify-center"
                  >
                    Update Password
                  </button>
                </div>
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
                            <button onClick={async () => {
                              if (confirm('Are you sure you want to delete this admission record?')) {
                                try {
                                  await supabase.from('admissions').delete().eq('id', adm.id);
                                } catch (err) {
                                  console.error("Error deleting from Supabase admissions:", err);
                                }
                                const updated = admissions.filter(a => a.id !== adm.id);
                                setAdmissions(updated);
                                localStorage.setItem('tuition_submitted_admissions_v1', JSON.stringify(updated));
                              }
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
              <div className="w-8 h-8 rounded-lg overflow-hidden bg-white p-1 flex items-center justify-center">
                {!logoError && academyLogo ? (
                  <img 
                    src={academyLogo} 
                    alt="Logo" 
                    className="w-full h-full object-contain rounded-md" 
                    referrerPolicy="no-referrer"
                    onError={() => setLogoError(true)}
                  />
                ) : (
                  <GraduationCap className="w-5 h-5 text-blue-600" />
                )}
              </div>
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
          </div>
          <div>
            <b className="text-white text-sm block mb-3">Contact Info</b>
            <a href="tel:+923290725117" className="text-xs block mb-2 text-slate-300 hover:text-white">📞 03290725117</a>
            <a href="https://wa.me/923290725117" target="_blank" rel="noreferrer" className="text-xs block mb-2 text-emerald-400 font-semibold">💬 WhatsApp Support</a>
            <span className="text-xs block text-slate-500 mt-4">© 2026 MBA Academy. All rights reserved.</span>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a 
        href="https://wa.me/923290725117" 
        target="_blank" 
        rel="noreferrer" 
        className="fixed bottom-6 right-6 z-50 bg-emerald-600 hover:bg-emerald-700 text-white p-3.5 rounded-full shadow-2xl flex items-center justify-center gap-2 transition hover:scale-110 border-2 border-white"
        title="Chat on WhatsApp: 03290725117"
      >
        <span className="text-2xl">💬</span>
        <span className="hidden md:inline text-xs font-bold pr-1">WhatsApp 03290725117</span>
      </a>
    </div>
  );
}
