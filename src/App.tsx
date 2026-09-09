/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { supabase } from './lib/supabase';
import { 
  GraduationCap, BookOpen, Users, Award, Calendar, CheckCircle, 
  Phone, MapPin, Clock, MessageSquare, Menu, X, Lock, Unlock, 
  Search, Trash2, Plus, Video, Image as ImageIcon, ShieldCheck, ExternalLink, UserCheck,
  Monitor, Terminal, Cpu, Laptop, Shield, Bell, Share2, Globe, Send, Edit2, Check,
  Maximize, Minimize, LogIn, LogOut, UserCheck2, UserCircle
} from 'lucide-react';
import ComputerSection from './components/ComputerSection';
import { AuthModal } from './components/AuthModal';
import { LoginPage } from './components/LoginPage';
import { AcademyUser } from './types';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export interface SocialLink {
  id: string;
  platform: 'whatsapp' | 'facebook' | 'youtube' | 'instagram' | 'tiktok' | 'twitter' | 'telegram' | 'linkedin' | 'website' | 'other' | string;
  title: string;
  url: string;
  isActive: boolean;
}

export const DEFAULT_SOCIAL_LINKS: SocialLink[] = [
  { id: '1', platform: 'whatsapp', title: 'Official WhatsApp Support', url: 'https://wa.me/923290275117', isActive: true },
  { id: '2', platform: 'facebook', title: 'MBA Academy Facebook Page', url: 'https://www.facebook.com/profile.php?id=61592718998531', isActive: true },
  { id: '3', platform: 'youtube', title: 'MBA Academy YouTube Channel', url: 'https://www.youtube.com/@MBAAcademy-s8z', isActive: true },
  { id: '4', platform: 'instagram', title: 'MBA Academy Instagram', url: 'https://www.instagram.com/mbaacadmey/', isActive: true },
  { id: '5', platform: 'tiktok', title: 'TikTok Learning Clips', url: 'https://tiktok.com', isActive: true }
];

export const getSocialPlatformInfo = (platform: string) => {
  switch ((platform || '').toLowerCase()) {
    case 'whatsapp':
      return { label: 'WhatsApp', color: 'bg-emerald-500 hover:bg-emerald-600', textColor: 'text-emerald-700', border: 'border-emerald-200', bgLight: 'bg-emerald-50', emoji: '💬', badgeBg: 'bg-emerald-500 text-white' };
    case 'facebook':
      return { label: 'Facebook', color: 'bg-blue-600 hover:bg-blue-700', textColor: 'text-blue-700', border: 'border-blue-200', bgLight: 'bg-blue-50', emoji: '📘', badgeBg: 'bg-blue-600 text-white' };
    case 'youtube':
      return { label: 'YouTube', color: 'bg-red-600 hover:bg-red-700', textColor: 'text-red-700', border: 'border-red-200', bgLight: 'bg-red-50', emoji: '▶️', badgeBg: 'bg-red-600 text-white' };
    case 'instagram':
      return { label: 'Instagram', color: 'bg-pink-600 hover:bg-pink-700', textColor: 'text-pink-700', border: 'border-pink-200', bgLight: 'bg-pink-50', emoji: '📸', badgeBg: 'bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white' };
    case 'tiktok':
      return { label: 'TikTok', color: 'bg-slate-900 hover:bg-black', textColor: 'text-slate-900', border: 'border-slate-300', bgLight: 'bg-slate-100', emoji: '🎵', badgeBg: 'bg-slate-950 text-white' };
    case 'twitter':
      return { label: 'Twitter / X', color: 'bg-slate-900 hover:bg-black', textColor: 'text-slate-900', border: 'border-slate-300', bgLight: 'bg-slate-100', emoji: '✖️', badgeBg: 'bg-black text-white' };
    case 'telegram':
      return { label: 'Telegram', color: 'bg-sky-500 hover:bg-sky-600', textColor: 'text-sky-700', border: 'border-sky-200', bgLight: 'bg-sky-50', emoji: '✈️', badgeBg: 'bg-sky-500 text-white' };
    case 'linkedin':
      return { label: 'LinkedIn', color: 'bg-blue-700 hover:bg-blue-800', textColor: 'text-blue-700', border: 'border-blue-200', bgLight: 'bg-blue-50', emoji: '💼', badgeBg: 'bg-blue-700 text-white' };
    case 'website':
    default:
      return { label: 'Website / Portal', color: 'bg-indigo-600 hover:bg-indigo-700', textColor: 'text-indigo-700', border: 'border-indigo-200', bgLight: 'bg-indigo-50', emoji: '🌐', badgeBg: 'bg-indigo-600 text-white' };
  }
};

const ADMIN_PASS = 'MushahidKing';

// Compress uploaded image files using canvas to avoid local storage quota limits and payload too large (404/413) server errors
const compressImage = (file: File, maxWidth = 600, maxHeight = 600, quality = 0.7): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions keeping aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        // Extract compressed JPEG
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedBase64);
      };
      img.onerror = (err) => {
        reject(err);
      };
    };
    reader.onerror = (err) => {
      reject(err);
    };
  });
};

export default function App() {
  const [currentPage, setCurrentPage] = useState(() => {
    const hash = window.location.hash.replace(/^#\/?/g, '');
    const validPages = ['login', 'home', 'ad', 'about', 'teachers', 'attendance', 'admission', 'online', 'computer', 'results', 'gallery', 'contact', 'records'];
    if (hash && validPages.includes(hash)) return hash;
    const storedUser = localStorage.getItem('ta_current_user_v1');
    return storedUser ? 'home' : 'login';
  });

  // Handle browser back/forward buttons (hashchange event)
  useEffect(() => {
    const validPages = ['login', 'home', 'ad', 'about', 'teachers', 'attendance', 'admission', 'online', 'computer', 'results', 'gallery', 'contact', 'records'];
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#\/?/g, '');
      if (hash && validPages.includes(hash)) {
        setCurrentPage(hash);
      } else if (!window.location.hash) {
        const storedUser = localStorage.getItem('ta_current_user_v1');
        setCurrentPage(storedUser ? 'home' : 'login');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update URL hash whenever currentPage changes
  useEffect(() => {
    const hash = window.location.hash.replace(/^#\/?/g, '');
    if (hash !== currentPage) {
      window.location.hash = currentPage;
    }
  }, [currentPage]);

  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem('ta_admin') === '1');
  
  // User Authentication state (Students & Teachers with Supabase backend)
  const [currentUser, setCurrentUser] = useState<AcademyUser | null>(() => {
    try {
      const saved = localStorage.getItem('ta_current_user_v1');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalInitialMode, setAuthModalInitialMode] = useState<'login' | 'signup'>('login');
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const handleUserLoginSuccess = (user: AcademyUser) => {
    setCurrentUser(user);
    localStorage.setItem('ta_current_user_v1', JSON.stringify(user));
    if (user.role === 'admin') {
      setIsAdmin(true);
      localStorage.setItem('ta_admin', '1');
    }
    triggerNotification(
      'result',
      '👋 Logged In Successfully',
      `Welcome, ${user.name}!`,
      `Account: ${user.role.toUpperCase()}`
    );
  };

  const handleUserLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('ta_current_user_v1');
    if (isAdmin) {
      setIsAdmin(false);
      localStorage.removeItem('ta_admin');
    }
    setShowUserDropdown(false);
    triggerNotification(
      'result',
      '👋 Logged Out',
      'You have been logged out safely.',
      'See you soon!'
    );
  };
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedSectionFilter, setSelectedSectionFilter] = useState('all');

  // Data states
  const [academyLogo, setAcademyLogo] = useState<string>(() => {
    return localStorage.getItem('tuition_academy_logo_v1') || '/logo.jpg';
  });
  const [logoError, setLogoError] = useState(false);
  
  const [heroBg, setHeroBg] = useState<string>(() => {
    return localStorage.getItem('tuition_hero_bg_v2') || "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1600&q=80";
  });

  const [admissionBg, setAdmissionBg] = useState<string>(() => {
    return localStorage.getItem('tuition_admission_bg_v2') || "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=80";
  });

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

  // Professional Ad Customization states
  const [adTitle, setAdTitle] = useState(() => {
    return localStorage.getItem('tuition_ad_title_v1') || 'MBA ACADEMY';
  });
  const [adSub, setAdSub] = useState(() => {
    return localStorage.getItem('tuition_ad_sub_v1') || 'CLASSES 1 TO 10 • QUALITY EDUCATION & PROFESSIONAL COACHING';
  });
  const [adBadge, setAdBadge] = useState(() => {
    return localStorage.getItem('tuition_ad_badge_v1') || '⭐ Admissions Open 2026-27 ⭐';
  });
  const [adFooter, setAdFooter] = useState(() => {
    return localStorage.getItem('tuition_ad_footer_v1') || '📍 Visit Us Today for Free Demo Class & Assessment • Limited Seats Available!';
  });
  const [adPhone, setAdPhone] = useState(() => {
    return localStorage.getItem('tuition_ad_phone_v2') || localStorage.getItem('tuition_ad_phone_v1') || '0329-0275117 / 0341-8709574';
  });
  const [adWhatsApp, setAdWhatsApp] = useState(() => {
    return localStorage.getItem('tuition_ad_wa_v2') || localStorage.getItem('tuition_ad_wa_v1') || '0329-0275117';
  });
  const [adCards, setAdCards] = useState<any[]>(() => {
    const saved = localStorage.getItem('tuition_ad_cards_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [
      { id: 1, icon: '📚', title: 'Expert Coaching', desc: 'Specialized subject coaching for Math, Science, English, Urdu & Computer.' },
      { id: 2, icon: '🏆', title: 'Proven Results', desc: '100% success rate with top board positions and weekly test monitoring.' },
      { id: 3, icon: '👥', title: 'Small Batches', desc: 'Individual attention to every student with daily homework support.' }
    ];
  });

  // States for adding a new ad highlight card
  const [newAdCardIcon, setNewAdCardIcon] = useState('⭐');
  const [newAdCardTitle, setNewAdCardTitle] = useState('');
  const [newAdCardDesc, setNewAdCardDesc] = useState('');

  // Social Media Links (Admin Configurable + Persistent)
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(() => {
    const saved = localStorage.getItem('tuition_social_links_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    // Check v1 and migrate old placeholders to the new official URLs
    const oldSaved = localStorage.getItem('tuition_social_links_v1');
    if (oldSaved) {
      try {
        const parsed: SocialLink[] = JSON.parse(oldSaved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const migrated = parsed.map(link => {
            if (link.platform === 'facebook' && (link.url === 'https://facebook.com' || link.url === 'https://facebook.com/' || !link.url.includes('id='))) {
              return { ...link, url: 'https://www.facebook.com/profile.php?id=61592718998531', title: 'MBA Academy Facebook Page' };
            }
            if (link.platform === 'instagram' && (link.url === 'https://instagram.com' || link.url === 'https://instagram.com/' || !link.url.includes('mbaacadmey'))) {
              return { ...link, url: 'https://www.instagram.com/mbaacadmey/', title: 'MBA Academy Instagram' };
            }
            if (link.platform === 'youtube' && (link.url === 'https://youtube.com' || link.url === 'https://youtube.com/' || !link.url.includes('MBAAcademy-s8z'))) {
              return { ...link, url: 'https://www.youtube.com/@MBAAcademy-s8z', title: 'MBA Academy YouTube Channel' };
            }
            if (link.platform === 'whatsapp' && (link.url.includes('03290725117') || link.url === 'https://wa.me/923290725117')) {
              return { ...link, url: 'https://wa.me/923290275117', title: 'Official WhatsApp Support' };
            }
            return link;
          });
          localStorage.setItem('tuition_social_links_v2', JSON.stringify(migrated));
          return migrated;
        }
      } catch (e) {}
    }
    return DEFAULT_SOCIAL_LINKS;
  });

  const [newSocialPlatform, setNewSocialPlatform] = useState<string>('whatsapp');
  const [newSocialTitle, setNewSocialTitle] = useState<string>('');
  const [newSocialUrl, setNewSocialUrl] = useState<string>('');
  const [editingSocialId, setEditingSocialId] = useState<string | null>(null);

  const saveSocialLinksToStorage = (links: SocialLink[]) => {
    setSocialLinks(links);
    localStorage.setItem('tuition_social_links_v2', JSON.stringify(links));
    localStorage.setItem('tuition_social_links_v1', JSON.stringify(links));
  };

  const handleAddOrUpdateSocialLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSocialTitle.trim() || !newSocialUrl.trim()) {
      alert('Please provide both link title and URL!');
      return;
    }

    let cleanUrl = newSocialUrl.trim();
    if (!/^https?:\/\//i.test(cleanUrl) && !cleanUrl.startsWith('mailto:') && !cleanUrl.startsWith('tel:')) {
      cleanUrl = `https://${cleanUrl}`;
    }

    if (editingSocialId) {
      const updated = socialLinks.map(link => 
        link.id === editingSocialId 
          ? { ...link, platform: newSocialPlatform, title: newSocialTitle.trim(), url: cleanUrl }
          : link
      );
      saveSocialLinksToStorage(updated);
      setEditingSocialId(null);
      alert('Social media link updated successfully!');
    } else {
      const newLink: SocialLink = {
        id: 'soc_' + Date.now(),
        platform: newSocialPlatform,
        title: newSocialTitle.trim(),
        url: cleanUrl,
        isActive: true
      };
      const updated = [...socialLinks, newLink];
      saveSocialLinksToStorage(updated);
      alert('New social media link added successfully!');
    }

    setNewSocialTitle('');
    setNewSocialUrl('');
    setNewSocialPlatform('whatsapp');
  };

  const handleEditSocialLink = (link: SocialLink) => {
    setEditingSocialId(link.id);
    setNewSocialPlatform(link.platform);
    setNewSocialTitle(link.title);
    setNewSocialUrl(link.url);
    // Scroll to the social links form if in admin mode
    const formElem = document.getElementById('admin-social-media-form');
    if (formElem) {
      formElem.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleDeleteSocialLink = (id: string) => {
    if (confirm('Are you sure you want to delete this social media link?')) {
      const updated = socialLinks.filter(link => link.id !== id);
      saveSocialLinksToStorage(updated);
      if (editingSocialId === id) {
        setEditingSocialId(null);
        setNewSocialTitle('');
        setNewSocialUrl('');
      }
    }
  };

  const handleToggleSocialLink = (id: string) => {
    const updated = socialLinks.map(link => 
      link.id === id ? { ...link, isActive: !link.isActive } : link
    );
    saveSocialLinksToStorage(updated);
  };

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
    return localStorage.getItem('ta_admin_password_v1') || 'MushahidKing';
  });
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [showAdminPasswordInSettings, setShowAdminPasswordInSettings] = useState(false);
  
  // Custom Admin Login Modal states
  const [showAdminLoginModal, setShowAdminLoginModal] = useState(false);
  const [adminLoginPasswordInput, setAdminLoginPasswordInput] = useState('');

  // Notification and subscription states
  const [studentClassSub, setStudentClassSub] = useState<string>(() => {
    return localStorage.getItem('tuition_student_class_sub_v1') || 'Class 9';
  });
  const [studentSectionSub, setStudentSectionSub] = useState<string>(() => {
    return localStorage.getItem('tuition_student_section_sub_v1') || 'Section A';
  });
  const [showNotifPrefsDropdown, setShowNotifPrefsDropdown] = useState(false);
  const [notifSoundEnabled, setNotifSoundEnabled] = useState<boolean>(() => {
    return localStorage.getItem('tuition_notif_sound_v1') !== 'false';
  });
  const [toasts, setToasts] = useState<any[]>([]);

  // Fullscreen state and handler
  const [isFullscreen, setIsFullscreen] = useState(false);
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!(document.fullscreenElement || (document as any).webkitFullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    document.addEventListener('webkitfullscreenchange', handleFsChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
      document.removeEventListener('webkitfullscreenchange', handleFsChange);
    };
  }, []);

  const toggleFullscreen = () => {
    const doc = document.documentElement as any;
    if (!document.fullscreenElement && !(document as any).webkitFullscreenElement) {
      if (doc.requestFullscreen) {
        doc.requestFullscreen().catch(() => {});
      } else if (doc.webkitRequestFullscreen) {
        doc.webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      }
    }
  };

  // App lock gate password state & functions (Personal Lock)
  const [appGatePassword, setAppGatePassword] = useState(() => {
    return localStorage.getItem('app_gate_password_v1') || 'MushahidKing';
  });
  const [appGateInput, setAppGateInput] = useState('');
  const [appUnlocked, setAppUnlocked] = useState(() => {
    return localStorage.getItem('app_gate_unlocked_v1') === 'true';
  });
  const [gateError, setGateError] = useState('');
  const [showGatePassword, setShowGatePassword] = useState(false);
  const [gateNewPasswordInput, setGateNewPasswordInput] = useState('');

  const handleVerifyGate = () => {
    if (appGateInput === appGatePassword || appGateInput === adminPassword || appGateInput === 'MushahidKing') {
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

  // Refs to track already loaded items
  const existingIdsRef = React.useRef<Set<number>>(new Set());
  const isInitialLoadRef = React.useRef(true);

  // Play synthetic pleasant audio chime using native Web Audio API
  const playChime = () => {
    if (!notifSoundEnabled) return;
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
      osc.frequency.setValueAtTime(1046.50, now + 0.3); // C6
      
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(now);
      osc.stop(now + 0.8);
    } catch (e) {
      console.warn('Audio play blocked:', e);
    }
  };

  // Trigger a beautiful Toast notification
  const triggerNotification = (type: 'result' | 'class', title: string, message: string, detail: string) => {
    playChime();
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    const newToast = {
      id,
      type,
      title,
      message,
      detail,
      timestamp: new Date()
    };
    setToasts(prev => [newToast, ...prev]);
    
    // Auto remove after 10 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter((t: any) => t.id !== id));
    }, 10000);
  };

  // Background poller to check for newly added results or online classes
  const pollForNewAdditions = async () => {
    try {
      // 1. Fetch latest student results (last 10)
      const { data: latestResults, error: resError } = await supabase
        .from('student_results')
        .select('id, studentName, className, examType, marks, grade, createdAt')
        .order('id', { ascending: false })
        .limit(10);
        
      // 2. Fetch latest online classes (last 10)
      const { data: latestOnline, error: onlineError } = await supabase
        .from('online_classes')
        .select('id, title, teacher, time, created_at')
        .order('id', { ascending: false })
        .limit(10);

      if (resError) console.error("Poll results error:", resError);
      if (onlineError) console.error("Poll classes error:", onlineError);

      if (existingIdsRef.current.size > 0) {
        if (latestResults) {
          latestResults.forEach(r => {
            if (!existingIdsRef.current.has(r.id)) {
              existingIdsRef.current.add(r.id);
              // Check if result class matches subscribed student class
              if (r.className === studentClassSub) {
                triggerNotification(
                  'result',
                  '🏆 New Result Published!',
                  `Official result published for ${r.studentName} in ${r.className}.`,
                  `Marks: ${r.marks} | Grade: ${r.grade}`
                );
              }
            }
          });
        }
        
        if (latestOnline) {
          latestOnline.forEach(c => {
            if (!existingIdsRef.current.has(c.id)) {
              existingIdsRef.current.add(c.id);
              const { title, section } = parseOnlineTitle(c.title);
              const matchesSection = !section || section === 'None' || section === studentSectionSub;
              const matchesClass = title.toLowerCase().includes(studentClassSub.toLowerCase()) || 
                                   title.toLowerCase().includes(studentClassSub.replace('Class ', '').toLowerCase());
              
              if (matchesSection || matchesClass) {
                triggerNotification(
                  'class',
                  '📺 New Live Class Added!',
                  `"${title}" by ${c.teacher} is now available.`,
                  `Timing: ${c.time} | Section: ${section || 'General'}`
                );
              }
            }
          });
        }
      } else {
        // Initialize the tracking ref
        if (latestResults) latestResults.forEach(r => existingIdsRef.current.add(r.id));
        if (latestOnline) latestOnline.forEach(c => existingIdsRef.current.add(c.id));
      }
    } catch (err) {
      console.error("Error in background notification poll:", err);
    }
  };

  // Sync initial ids once lists are loaded from main state
  useEffect(() => {
    if (onlineClasses.length > 0 || resultsList.length > 0) {
      if (isInitialLoadRef.current) {
        onlineClasses.forEach(c => existingIdsRef.current.add(c.id));
        resultsList.forEach(r => existingIdsRef.current.add(r.id));
        isInitialLoadRef.current = false;
      }
    }
  }, [onlineClasses, resultsList]);

  // Set up periodic automated polling (every 12 seconds)
  useEffect(() => {
    // Initial fetch
    pollForNewAdditions();
    
    const interval = setInterval(() => {
      pollForNewAdditions();
    }, 12000);
    
    return () => clearInterval(interval);
  }, [studentClassSub, studentSectionSub, notifSoundEnabled]);

  useEffect(() => {
    fetchTeachers();
    fetchOnlineClasses();
    fetchUpcomingClasses();

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

    existingIdsRef.current.add(newResult.id);
    if (newResult.className === studentClassSub) {
      triggerNotification(
        'result',
        '🏆 New Result Published!',
        `Official result published for ${newResult.studentName} in ${newResult.className}.`,
        `Marks: ${newResult.marks} | Grade: ${newResult.grade}`
      );
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

  const handleOnlineClassImgFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImage(file, 600, 400, 0.7);
        setOnlineClassImg(compressed);
      } catch (err) {
        const reader = new FileReader();
        reader.onloadend = () => setOnlineClassImg(reader.result as string);
        reader.readAsDataURL(file);
      }
    }
  };

  const handleOnlineTeacherImgFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImage(file, 400, 400, 0.7);
        setOnlineTeacherImg(compressed);
      } catch (err) {
        const reader = new FileReader();
        reader.onloadend = () => setOnlineTeacherImg(reader.result as string);
        reader.readAsDataURL(file);
      }
    }
  };

  const handleUpClassImgFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImage(file, 600, 400, 0.7);
        setUpClassImg(compressed);
      } catch (err) {
        const reader = new FileReader();
        reader.onloadend = () => setUpClassImg(reader.result as string);
        reader.readAsDataURL(file);
      }
    }
  };

  const handleUpTeacherImgFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImage(file, 400, 400, 0.7);
        setUpTeacherImg(compressed);
      } catch (err) {
        const reader = new FileReader();
        reader.onloadend = () => setUpTeacherImg(reader.result as string);
        reader.readAsDataURL(file);
      }
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
      setAdminLoginPasswordInput('');
      setShowAdminLoginModal(true);
    }
  };

  const handleAdminLoginSubmit = (passwordToTry: string) => {
    if (passwordToTry === adminPassword || passwordToTry === 'MushahidKing') {
      setIsAdmin(true);
      localStorage.setItem('ta_admin', '1');
      setCurrentPage('records');
      setShowAdminLoginModal(false);
      alert('Admin Access Granted! Opening Admin Dashboard.');
    } else {
      alert('Incorrect password!');
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

    existingIdsRef.current.add(newC.id);
    const { title: pTitle, section: pSection } = parseOnlineTitle(newC.title);
    const matchesSection = !pSection || pSection === 'None' || pSection === studentSectionSub;
    const matchesClass = pTitle.toLowerCase().includes(studentClassSub.toLowerCase()) || 
                         pTitle.toLowerCase().includes(studentClassSub.replace('Class ', '').toLowerCase());
    if (matchesSection || matchesClass) {
      triggerNotification(
        'class',
        '📺 New Live Class Added!',
        `"${pTitle}" by ${newC.teacher} is now available.`,
        `Timing: ${newC.time} | Section: ${pSection || 'General'}`
      );
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

    // WhatsApp notification wrapped in try/catch to avoid iframe / sandbox popup block crash
    const waText = `New Admission Request:\nStudent: ${admStudentName}\nClass: ${admClass}\nRoll No: ${admRoll}\nPhone: ${admPhone}`;
    try {
      window.open(`https://wa.me/923290275117?text=${encodeURIComponent(waText)}`, '_blank');
    } catch (e) {
      console.warn("WhatsApp popup was blocked or failed to open:", e);
    }

    setAdmStudentName(''); setAdmParentName(''); setAdmEmail(''); setAdmPhone(''); setAdmRoll(''); setAdmAddress(''); setAdmPhoto('');
    setCurrentPage('attendance');
    setSelectedClassForAttendance(admClass);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImage(file, 500, 500, 0.7);
        setAdmPhoto(compressed);
      } catch (err) {
        console.error("Error compressing admission photo, falling back:", err);
        const reader = new FileReader();
        reader.onload = () => setAdmPhoto(reader.result as string);
        reader.readAsDataURL(file);
      }
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
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-blue-600 selection:text-white overflow-x-hidden">
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
        <ul className="hidden xl:flex flex-row flex-nowrap items-center gap-1 list-none text-[13px] font-medium whitespace-nowrap">
          <li><button onClick={() => setCurrentPage('login')} className={`px-2.5 py-1.5 rounded-lg transition whitespace-nowrap font-bold flex items-center gap-1.5 ${currentPage === 'login' ? 'bg-blue-600 text-white shadow-xs' : 'text-blue-700 bg-blue-50/80 hover:bg-blue-100'}`}><span>🔑</span> Login</button></li>
          <li><button onClick={() => setCurrentPage('home')} className={`px-2 py-1.5 rounded-lg transition whitespace-nowrap ${currentPage === 'home' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:bg-slate-100'}`}>Home</button></li>
          <li><button onClick={() => setCurrentPage('ad')} className={`px-2 py-1.5 rounded-lg transition whitespace-nowrap ${currentPage === 'ad' ? 'bg-amber-50 text-amber-700 font-bold' : 'text-amber-600 hover:bg-amber-50 font-medium'}`}>📢 Pro Ad</button></li>
          <li><button onClick={() => setCurrentPage('about')} className={`px-2 py-1.5 rounded-lg transition whitespace-nowrap ${currentPage === 'about' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:bg-slate-100'}`}>About Us</button></li>
          <li><button onClick={() => setCurrentPage('teachers')} className={`px-2 py-1.5 rounded-lg transition whitespace-nowrap ${currentPage === 'teachers' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:bg-slate-100'}`}>Teachers</button></li>
          <li><button onClick={() => { setCurrentPage('attendance'); setSelectedClassForAttendance(null); }} className={`px-2 py-1.5 rounded-lg transition whitespace-nowrap ${currentPage === 'attendance' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:bg-slate-100'}`}>Attendance</button></li>
          <li><button onClick={() => setCurrentPage('admission')} className={`px-2 py-1.5 rounded-lg transition whitespace-nowrap ${currentPage === 'admission' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:bg-slate-100'}`}>Admission</button></li>
          <li><button onClick={() => setCurrentPage('online')} className={`px-2 py-1.5 rounded-lg transition whitespace-nowrap ${currentPage === 'online' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:bg-slate-100'}`}>Online Classes</button></li>
          <li><button onClick={() => setCurrentPage('computer')} className={`px-2 py-1.5 rounded-lg transition whitespace-nowrap ${currentPage === 'computer' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-600 hover:bg-indigo-50 hover:text-indigo-600'}`}>💻 Computer</button></li>
          <li><button onClick={() => setCurrentPage('results')} className={`px-2 py-1.5 rounded-lg transition whitespace-nowrap ${currentPage === 'results' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:bg-slate-100'}`}>Results</button></li>

          <li><button onClick={() => setCurrentPage('gallery')} className={`px-2 py-1.5 rounded-lg transition whitespace-nowrap ${currentPage === 'gallery' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:bg-slate-100'}`}>Gallery</button></li>
          <li><button onClick={() => setCurrentPage('contact')} className={`px-2 py-1.5 rounded-lg transition whitespace-nowrap ${currentPage === 'contact' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:bg-slate-100'}`}>Contact</button></li>
          <li><button onClick={() => setCurrentPage('records')} className={`px-2 py-1.5 rounded-lg transition whitespace-nowrap ${currentPage === 'records' ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-600 hover:bg-slate-100'}`}>Records</button></li>
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

          {/* Notification settings bell button */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifPrefsDropdown(!showNotifPrefsDropdown)}
              className="relative w-9 h-9 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold shadow-2xs hover:bg-blue-100 transition duration-200 cursor-pointer"
              title="Notification Settings"
            >
              <Bell size={18} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-[9px] font-extrabold animate-pulse">
                ✓
              </span>
            </button>

            {showNotifPrefsDropdown && (
              <div className="absolute right-0 mt-3 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-5 text-left animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between mb-3.5">
                  <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                    <span>🔔</span> Subscription Settings
                  </h4>
                  <button 
                    onClick={() => setShowNotifPrefsDropdown(false)}
                    className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
                  >
                    <X size={14} />
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed mb-4">
                  Choose your class & section below. You will receive live alerts immediately when results or classes are published for your choice.
                </p>

                <div className="space-y-3 mb-4">
                  <div>
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block mb-1">My Class</label>
                    <select 
                      value={studentClassSub}
                      onChange={e => {
                        setStudentClassSub(e.target.value);
                        localStorage.setItem('tuition_student_class_sub_v1', e.target.value);
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-semibold text-slate-800 outline-none cursor-pointer"
                    >
                      {Array.from({ length: 10 }).map((_, i) => (
                        <option key={i + 1} value={`Class ${i + 1}`}>Class {i + 1}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block mb-1">My Section</label>
                    <select 
                      value={studentSectionSub}
                      onChange={e => {
                        setStudentSectionSub(e.target.value);
                        localStorage.setItem('tuition_student_section_sub_v1', e.target.value);
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-semibold text-slate-800 outline-none cursor-pointer"
                    >
                      <option value="Section A">Section A</option>
                      <option value="Section B">Section B</option>
                      <option value="Section C">Section C</option>
                      <option value="Primary Section">Primary Section</option>
                      <option value="Middle Section">Middle Section</option>
                      <option value="High Section">High Section</option>
                      <option value="Ladies Section">Ladies Section</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs font-semibold text-slate-700">Notification Sound</span>
                    <button 
                      onClick={() => {
                        const nextVal = !notifSoundEnabled;
                        setNotifSoundEnabled(nextVal);
                        localStorage.setItem('tuition_notif_sound_v1', String(nextVal));
                        if (nextVal) playChime();
                      }}
                      className={`text-xs px-3 py-1 rounded-full font-bold transition duration-200 cursor-pointer ${notifSoundEnabled ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'}`}
                    >
                      {notifSoundEnabled ? '🔊 ON' : '🔇 OFF'}
                    </button>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    triggerNotification(
                      'result',
                      '🔔 Test Notification',
                      `Setup complete for ${studentClassSub} (${studentSectionSub}).`,
                      `You're now ready to receive automated updates!`
                    );
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-xl text-xs transition duration-200 flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  Send Test Toast
                </button>
              </div>
            )}
          </div>

          {/* Quick Active Social Media Icons in Header */}
          <div className="hidden lg:flex items-center gap-1.5 border-l border-slate-200 pl-3">
            {socialLinks.filter(l => l.isActive).slice(0, 4).map(link => {
              const info = getSocialPlatformInfo(link.platform);
              return (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs shadow-xs transition hover:scale-110 ${info.color} text-white font-bold`}
                  title={`${link.title} (${info.label})`}
                >
                  <span>{info.emoji}</span>
                </a>
              );
            })}
          </div>

          {/* Full Screen Toggle Button */}
          <button 
            onClick={toggleFullscreen}
            className="w-9 h-9 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-full flex items-center justify-center font-bold shadow-2xs transition hover:scale-105 shrink-0 cursor-pointer"
            title={isFullscreen ? "Exit Full Screen" : "Full Screen Mode"}
          >
            {isFullscreen ? <Minimize size={17} /> : <Maximize size={17} />}
          </button>

          {/* User Auth Login / Sign Up or Profile Button */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-2 bg-blue-50/90 hover:bg-blue-100 border border-blue-200/80 px-2.5 py-1.5 rounded-full transition cursor-pointer shadow-2xs group"
                title="My Account"
              >
                <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-extrabold shadow-inner">
                  {currentUser.role === 'teacher' ? '🏫' : currentUser.role === 'admin' ? '🛡️' : '🎓'}
                </div>
                <div className="text-left hidden md:block">
                  <div className="text-[11px] font-extrabold text-blue-950 leading-none flex items-center gap-1">
                    <span>{currentUser.name.split(' ')[0]}</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase tracking-wider bg-blue-600 text-white">
                      {currentUser.role}
                    </span>
                  </div>
                  <div className="text-[9px] text-blue-600 font-medium leading-none mt-0.5">
                    {currentUser.role === 'teacher' ? (currentUser.subject || 'Faculty') : (currentUser.studentClass || 'Student')}
                  </div>
                </div>
              </button>

              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-4 text-left animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center gap-2.5 pb-3 mb-3 border-b border-slate-100">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-lg">
                      {currentUser.role === 'teacher' ? '🏫' : currentUser.role === 'admin' ? '🛡️' : '🎓'}
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="font-extrabold text-slate-900 text-xs truncate">{currentUser.name}</h4>
                      <p className="text-[10px] text-slate-500 truncate">{currentUser.email}</p>
                      <span className="inline-block mt-0.5 text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 uppercase">
                        {currentUser.role} {currentUser.teacherDbId ? '• DB Synced' : ''}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1 mb-3 text-xs">
                    {currentUser.role === 'teacher' && (
                      <button 
                        onClick={() => { setCurrentPage('teachers'); setShowUserDropdown(false); }}
                        className="w-full text-left p-2 rounded-xl text-slate-700 hover:bg-slate-50 font-medium flex items-center gap-2"
                      >
                        <span>📚</span> View Teachers Directory
                      </button>
                    )}
                    <button 
                      onClick={() => { setCurrentPage('attendance'); setShowUserDropdown(false); }}
                      className="w-full text-left p-2 rounded-xl text-slate-700 hover:bg-slate-50 font-medium flex items-center gap-2"
                    >
                      <span>📋</span> My Attendance
                    </button>
                    <button 
                      onClick={() => { setCurrentPage('online'); setShowUserDropdown(false); }}
                      className="w-full text-left p-2 rounded-xl text-slate-700 hover:bg-slate-50 font-medium flex items-center gap-2"
                    >
                      <span>📺</span> Online Classes
                    </button>
                  </div>

                  <button
                    onClick={handleUserLogout}
                    className="w-full flex items-center justify-center gap-1.5 p-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl text-xs transition cursor-pointer"
                  >
                    <LogOut size={14} />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  setAuthModalInitialMode('login');
                  setShowAuthModal(true);
                }}
                className="flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200/80 px-3 py-1.5 rounded-full text-xs font-extrabold shadow-2xs transition hover:scale-105 cursor-pointer"
                title="Login to Account"
              >
                <LogIn size={14} />
                <span>Log In</span>
              </button>
              <button
                onClick={() => {
                  setAuthModalInitialMode('signup');
                  setShowAuthModal(true);
                }}
                className="hidden sm:flex items-center gap-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-3 py-1.5 rounded-full text-xs font-extrabold shadow-xs transition hover:scale-105 cursor-pointer"
                title="Create Account"
              >
                <span>Sign Up</span>
              </button>
            </div>
          )}

          <a href="https://wa.me/923290275117" target="_blank" rel="noreferrer" className="w-9 h-9 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold shadow-sm hover:bg-emerald-600 transition shrink-0" title="WhatsApp Chat">
            💬
          </a>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="xl:hidden text-slate-700 p-1">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-slate-200 px-6 py-4 flex flex-col gap-3 shadow-lg">
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
            {/* Mobile Auth Profile / Buttons */}
            {currentUser ? (
              <div className="p-3 bg-blue-50/90 rounded-2xl border border-blue-200/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                    {currentUser.role === 'teacher' ? '🏫' : currentUser.role === 'admin' ? '🛡️' : '🎓'}
                  </div>
                  <div>
                    <div className="font-extrabold text-xs text-blue-950">{currentUser.name}</div>
                    <div className="text-[10px] text-blue-700 font-semibold uppercase">{currentUser.role}</div>
                  </div>
                </div>
                <button
                  onClick={handleUserLogout}
                  className="px-2.5 py-1 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg text-xs font-bold transition cursor-pointer"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setAuthModalInitialMode('login');
                    setShowAuthModal(true);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-200 font-bold px-3 py-2.5 rounded-xl text-xs hover:bg-blue-100 transition"
                >
                  <LogIn size={15} />
                  <span>Log In</span>
                </button>
                <button
                  onClick={() => {
                    setAuthModalInitialMode('signup');
                    setShowAuthModal(true);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-1.5 bg-blue-600 text-white font-bold px-3 py-2.5 rounded-xl text-xs hover:bg-blue-700 transition shadow-xs"
                >
                  <span>Sign Up</span>
                </button>
              </div>
            )}

            <button 
              onClick={() => { toggleFullscreen(); setMobileMenuOpen(false); }}
              className="w-full flex items-center justify-center gap-2 bg-blue-50 text-blue-700 font-bold px-4 py-2.5 rounded-xl text-xs hover:bg-blue-100 transition"
            >
              {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
              <span>{isFullscreen ? 'Exit Full Screen' : 'Open Full Screen Mode'}</span>
            </button>

            {['login', 'home', 'ad', 'about', 'teachers', 'attendance', 'admission', 'online', 'computer', 'results', 'gallery', 'contact', 'records'].map(p => (
              <button key={p} onClick={() => { setCurrentPage(p); setMobileMenuOpen(false); if(p==='attendance') setSelectedClassForAttendance(null); }} className={`text-left px-4 py-2.5 rounded-lg text-sm font-medium capitalize ${currentPage === p ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}>
                {p === 'login' ? '🔑 Log In / Sign Up Portal' : p === 'ad' ? '📢 Professional Admission Ad' : p === 'records' ? 'Records Dashboard' : p === 'computer' ? '💻 Computer Class' : p}
              </button>
            ))}
          </div>

          {/* Social Links in Mobile Drawer */}
          {socialLinks.filter(l => l.isActive).length > 0 && (
            <div className="border-t border-slate-100 pt-3 mt-2">
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 block mb-2">Connect with Us:</span>
              <div className="flex flex-wrap gap-2">
                {socialLinks.filter(l => l.isActive).map(link => {
                  const info = getSocialPlatformInfo(link.platform);
                  return (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs px-3 py-1.5 rounded-full font-medium transition"
                    >
                      <span>{info.emoji}</span>
                      <span>{link.title}</span>
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* PAGE: LOGIN & SIGN UP */}
      {currentPage === 'login' && (
        <LoginPage
          onSuccess={(user) => {
            handleUserLoginSuccess(user);
            setCurrentPage('home');
          }}
          onNavigateHome={() => setCurrentPage('home')}
          adminPassword={adminPassword}
          teachersList={teachers}
          onTeacherAdded={(newT) => {
            setTeachers(prev => {
              const exists = prev.some(t => t.id === newT.id);
              if (exists) return prev;
              const updated = [...prev, newT];
              localStorage.setItem('ta_teachers', JSON.stringify(updated));
              return updated;
            });
          }}
          initialMode={authModalInitialMode}
        />
      )}

      {/* PAGE: HOME */}
      {currentPage === 'home' && (
        <div>
          <div className="min-h-[85vh] text-white px-6 md:px-12 py-16 flex items-center relative overflow-hidden bg-slate-950">
            <div className="absolute inset-0 bg-cover bg-center opacity-85" style={{ backgroundImage: `url(${heroBg})` }}></div>
            <div className="absolute inset-0 bg-black/45 pointer-events-none"></div>
            <div className="max-w-4xl relative z-10">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full text-xs font-medium mb-6">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Admissions Open 2026-27 | Limited Seats
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight mb-6 flex flex-col gap-2">
                <span>
                  {"Building Bright Futures".split(" ").map((word, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: i * 0.12 }}
                      className="inline-block mr-3"
                    >
                      {word}
                    </motion.span>
                  ))}
                </span>
                <span className="flex items-center gap-3 flex-wrap">
                  {"Class 1 to 10".split(" ").map((word, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 + (i * 0.12) }}
                      className={`inline-block ${word === 'to' ? 'bg-blue-600 text-white px-3 py-0.5 rounded-xl shadow-md' : 'mr-3'}`}
                    >
                      {word}
                    </motion.span>
                  ))}
                </span>
              </h1>
              <p className="text-base md:text-lg text-slate-200 mb-8 max-w-2xl leading-relaxed">
                Premium tuition academy with expert faculty and a proven success rate. Nurturing young minds for academic excellence and absolute confidence.
              </p>
              <div className="flex flex-wrap gap-4 mb-8">
                <button onClick={() => setCurrentPage('login')} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold px-7 py-3 rounded-full shadow-lg transition flex items-center gap-2 text-sm border border-white/20">
                  <Lock size={18} /> Student & Teacher Login
                </button>
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

              {/* Active Social Media Channels Row in Hero */}
              {socialLinks.filter(l => l.isActive).length > 0 && (
                <div className="mb-12 flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-1 mr-1">
                    <Share2 size={13} className="text-sky-400" /> Connect with Us:
                  </span>
                  {socialLinks.filter(l => l.isActive).map(link => {
                    const info = getSocialPlatformInfo(link.platform);
                    return (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white text-xs font-semibold px-3.5 py-1.5 rounded-full transition hover:scale-105"
                      >
                        <span>{info.emoji}</span>
                        <span>{link.title}</span>
                      </a>
                    );
                  })}
                </div>
              )}

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
                  <input type="file" accept="image/*" onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      try {
                        const compressed = await compressImage(file, 400, 400, 0.7);
                        setTImg(compressed);
                      } catch (err) {
                        const reader = new FileReader();
                        reader.onload = () => setTImg(reader.result as string);
                        reader.readAsDataURL(file);
                      }
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
            <div className="text-white p-8 flex flex-col justify-between relative overflow-hidden bg-slate-900 min-h-[400px]">
              {/* Clean Background Image with No Color Tint */}
              <div className="absolute inset-0 bg-cover bg-center opacity-100 pointer-events-none" style={{ backgroundImage: `url(${admissionBg})` }}></div>
              {/* Subtle dark bottom vignette to guarantee text legibility without colorizing the image */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20 pointer-events-none"></div>
              
              <div className="relative z-10 flex flex-col justify-between h-full">
                <div>
                  <h2 className="text-2xl font-black mb-3 drop-shadow-md text-white">Admission Form</h2>
                  <p className="text-xs text-white/90 font-medium leading-relaxed mb-6 drop-shadow-sm">Fill in student details. The student will be automatically added to the class attendance list.</p>
                  <div className="space-y-4 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center border border-white/20">📞</div>
                      <div><b>Call Us</b><br /><span className="text-white/90">+92 329 0725117</span></div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center border border-white/20">📍</div>
                      <div><b>Visit Campus</b><br /><span className="text-white/90">Main Campus, Education City</span></div>
                    </div>
                  </div>
                </div>
                <div className="mt-8 text-xs text-white/70 font-bold drop-shadow-sm">MBA Academy System v2.6</div>
              </div>
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
                    <label htmlFor="photoFile" className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer inline-block">
                      Upload Photo
                    </label>
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

          {/* Subscribed Section Status Card */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 p-5 rounded-3xl mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs">
            <div className="flex items-start gap-3.5">
              <div className="p-3 bg-white text-blue-600 rounded-2xl shadow-3xs text-xl shrink-0">
                📺
              </div>
              <div className="text-left">
                <h3 className="font-extrabold text-slate-900 text-sm">Automated Live Class Alerts</h3>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  You are registered to receive live audio & toast notifications for classes matching <b className="text-blue-700 bg-blue-100/50 px-2 py-0.5 rounded-lg">{studentClassSub}</b> or <b className="text-blue-700 bg-blue-100/50 px-2 py-0.5 rounded-lg">{studentSectionSub}</b>.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0 flex-wrap md:flex-nowrap">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-500">Class:</span>
                <select 
                  value={studentClassSub}
                  onChange={e => {
                    setStudentClassSub(e.target.value);
                    localStorage.setItem('tuition_student_class_sub_v1', e.target.value);
                  }}
                  className="bg-white border border-slate-200 p-2 rounded-xl text-xs font-bold text-slate-800 outline-none cursor-pointer focus:ring-2 focus:ring-blue-500/10 transition"
                >
                  {Array.from({ length: 10 }).map((_, i) => (
                    <option key={i + 1} value={`Class ${i + 1}`}>Class {i + 1}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-500">Section:</span>
                <select 
                  value={studentSectionSub}
                  onChange={e => {
                    setStudentSectionSub(e.target.value);
                    localStorage.setItem('tuition_student_section_sub_v1', e.target.value);
                  }}
                  className="bg-white border border-slate-200 p-2 rounded-xl text-xs font-bold text-slate-800 outline-none cursor-pointer focus:ring-2 focus:ring-blue-500/10 transition"
                >
                  <option value="Section A">Section A</option>
                  <option value="Section B">Section B</option>
                  <option value="Section C">Section C</option>
                  <option value="Primary Section">Primary Section</option>
                  <option value="Middle Section">Middle Section</option>
                  <option value="High Section">High Section</option>
                  <option value="Ladies Section">Ladies Section</option>
                </select>
              </div>
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
                    <label htmlFor="liveClassImgFile" className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer inline-block">
                      Upload Image
                    </label>
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
                    <label htmlFor="liveTeacherImgFile" className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer inline-block">
                      Upload Photo
                    </label>
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
                    <label htmlFor="upClassImgFile" className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer inline-block">
                      Upload Image
                    </label>
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
                    <label htmlFor="upTeacherImgFile" className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer inline-block">
                      Upload Photo
                    </label>
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

          {/* Subscribed Class Status Card */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 p-5 rounded-3xl mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs">
            <div className="flex items-start gap-3.5">
              <div className="p-3 bg-white text-blue-600 rounded-2xl shadow-3xs text-xl shrink-0">
                🏆
              </div>
              <div className="text-left">
                <h3 className="font-extrabold text-slate-900 text-sm">Automated Result Alerts</h3>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  You are registered to receive live audio & toast notifications for results in <b className="text-blue-700 bg-blue-100/50 px-2 py-0.5 rounded-lg">{studentClassSub}</b>.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-bold text-slate-500">Change Sub:</span>
              <select 
                value={studentClassSub}
                onChange={e => {
                  setStudentClassSub(e.target.value);
                  localStorage.setItem('tuition_student_class_sub_v1', e.target.value);
                }}
                className="bg-white border border-slate-200 p-2 rounded-xl text-xs font-bold text-slate-800 outline-none cursor-pointer focus:ring-2 focus:ring-blue-500/10 transition"
              >
                {Array.from({ length: 10 }).map((_, i) => (
                  <option key={i + 1} value={`Class ${i + 1}`}>Class {i + 1}</option>
                ))}
              </select>
            </div>
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
                    <input type="file" accept="image/*" onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        try {
                          const compressed = await compressImage(file, 400, 400, 0.7);
                          setResPhoto(compressed);
                        } catch (err) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            if (event.target?.result) {
                              setResPhoto(event.target.result as string);
                            }
                          };
                          reader.readAsDataURL(file);
                        }
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
            <motion.div 
              id="official-results-card" 
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white rounded-3xl shadow-2xl border-4 border-amber-500/80 p-8 md:p-10 relative overflow-hidden mb-12 text-slate-800"
            >
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
                  <b className="text-sm font-bold text-blue-900">0300-0000000 / 03290275117</b>
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

              {/* Performance Comparison Bar Chart */}
              <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl mb-8">
                <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                  <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    📊 Performance Comparison (Student vs Class Average)
                  </h3>
                  <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-3 py-1 rounded-full">Academic Benchmarking</span>
                </div>
                <div className="h-52 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        {
                          name: 'Student Score',
                          marks: Number(searchedResult.marksObtained ?? parseInt(String(searchedResult.marks).split('/')[0]) ?? 450),
                          fill: '#2563eb'
                        },
                        {
                          name: 'Class Average',
                          marks: Math.round(Number(searchedResult.totalMarks || 500) * 0.72),
                          fill: '#10b981'
                        },
                        {
                          name: 'Maximum Total',
                          marks: Number(searchedResult.totalMarks || 500),
                          fill: '#f59e0b'
                        },
                      ]}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="name" tick={{ fill: '#475569', fontSize: 12, fontWeight: 600 }} />
                      <YAxis tick={{ fill: '#475569', fontSize: 12 }} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #cbd5e1', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', fontWeight: 'bold' }}
                      />
                      <Bar dataKey="marks" fill="#2563eb" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Remarks Box */}
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl mb-8 text-sm">
                <b className="text-amber-900 block mb-1">Teacher's Remarks & Evaluation:</b>
                <p className="text-slate-700 italic">"{searchedResult.remarks || 'Excellent academic performance. Keep up the hard work!'}"</p>
              </div>

              {/* Signatures with official sign images */}
              <div className="flex justify-between gap-12 pt-12 pb-6 text-center text-xs text-slate-600 font-semibold px-4">
                <div className="w-56 border-t-2 border-slate-800 pt-3 relative">
                  {/* Blank space for manual signature */}
                  <div className="h-12"></div>
                  <span className="text-slate-800 font-extrabold tracking-wider text-[11px] uppercase">Head Signature</span>
                </div>
                <div className="w-56 border-t-2 border-slate-800 pt-3 relative">
                  {/* Blank space for manual signature */}
                  <div className="h-12"></div>
                  <span className="text-slate-800 font-extrabold tracking-wider text-[11px] uppercase">Principal Signature</span>
                </div>
              </div>

              {/* Print & PDF Download Buttons for Students */}
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
                }} className="bg-gradient-to-r from-blue-900 to-blue-700 hover:from-blue-800 hover:to-blue-600 text-white font-bold px-6 py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 text-sm transition transform hover:scale-105 cursor-pointer">
                  🖨️ Print Results Card
                </button>

                <button onClick={async () => {
                  const cardElement = document.getElementById('official-results-card');
                  if (!cardElement) return;
                  try {
                    const canvas = await html2canvas(cardElement, { scale: 2, useCORS: true, logging: false });
                    const imgData = canvas.toDataURL('image/png');
                    const pdf = new jsPDF('p', 'mm', 'a4');
                    const imgWidth = 210;
                    const pageHeight = 295;
                    const imgHeight = (canvas.height * imgWidth) / canvas.width;
                    let heightLeft = imgHeight;
                    let position = 0;

                    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                    heightLeft -= pageHeight;

                    while (heightLeft >= 0) {
                      position = heightLeft - imgHeight;
                      pdf.addPage();
                      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                      heightLeft -= pageHeight;
                    }

                    pdf.save(`MBA_Result_${searchedResult?.studentName || 'Card'}.pdf`);
                  } catch (err) {
                    console.error("Error generating PDF:", err);
                    alert("Failed to generate PDF. Please try printing instead.");
                  }
                }} className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 text-sm transition transform hover:scale-105 cursor-pointer">
                  📥 Download as PDF
                </button>
              </div>
            </motion.div>
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
                  <b className="text-xs text-slate-900 block my-1">03290275117</b>
                  <a href="tel:+923290275117" className="text-[11px] text-blue-600 font-bold">Call Now</a>
                </div>
                <div className="bg-emerald-50/70 p-4 rounded-2xl text-center border border-emerald-200 shadow-xs">
                  <div className="text-xl mb-1">💬</div>
                  <span className="text-[10px] text-emerald-600 block font-semibold uppercase">WhatsApp</span>
                  <b className="text-xs text-slate-900 block my-1">03290275117</b>
                  <a href="https://wa.me/923290275117" target="_blank" rel="noreferrer" className="text-[11px] text-emerald-700 font-bold">Chat Now</a>
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

          {/* Social Media & Community Channels Section in Contact Us Page */}
          {socialLinks.filter(l => l.isActive).length > 0 && (
            <div className="mt-14 bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-sky-50/70 border border-blue-100 rounded-3xl p-8">
              <div className="text-center max-w-xl mx-auto mb-8">
                <span className="bg-blue-100 text-blue-800 text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-2">
                  Official Channels
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900">Connect with Us on Social Media</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Stay updated with our daily test results, admissions announcements, video lectures, and campus activities.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {socialLinks.filter(l => l.isActive).map(link => {
                  const info = getSocialPlatformInfo(link.platform);
                  return (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-white hover:bg-slate-50 border border-slate-200 hover:border-blue-300 p-5 rounded-2xl transition duration-200 shadow-2xs hover:shadow-md flex flex-col justify-between group"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl ${info.bgLight} ${info.textColor} border ${info.border}`}>
                            {info.emoji}
                          </div>
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${info.badgeBg}`}>
                            {info.label}
                          </span>
                        </div>
                        <h4 className="font-extrabold text-slate-900 text-sm mb-1 group-hover:text-blue-600 transition line-clamp-1">
                          {link.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 truncate mb-4">
                          {link.url}
                        </p>
                      </div>

                      <div className={`w-full text-center py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${info.color} text-white shadow-2xs`}>
                        <span>Visit {info.label}</span>
                        <ExternalLink size={12} />
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          )}
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

          <div id="official-ad-poster" className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 text-white rounded-3xl p-8 md:p-14 shadow-2xl border-4 border-amber-400 relative overflow-hidden">
            {/* Background design accents */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none"></div>
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
                {adBadge}
              </div>

              <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-3 uppercase">
                {adTitle}
              </h2>
              <p className="text-amber-300 font-bold text-lg md:text-xl tracking-wide mb-6">
                {adSub}
              </p>

              <div className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 my-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
                {adCards.map((card, idx) => (
                  <div key={card.id || idx} className="bg-white/5 p-4 rounded-xl border border-white/10 relative group">
                    <div className="text-2xl mb-2">{card.icon}</div>
                    <h4 className="font-bold text-white text-sm mb-1">{card.title}</h4>
                    <p className="text-xs text-slate-300">{card.desc}</p>
                    {isAdmin && (
                      <button
                        onClick={() => {
                          if (confirm(`Remove "${card.title}" card?`)) {
                            const updated = adCards.filter((_, i) => i !== idx);
                            setAdCards(updated);
                            localStorage.setItem('tuition_ad_cards_v1', JSON.stringify(updated));
                          }
                        }}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-red-600 hover:bg-red-700 text-white rounded p-1 text-[10px] transition cursor-pointer print:hidden"
                        title="Delete Card"
                      >
                        ❌
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap justify-center gap-6 my-6 text-sm">
                <div className="bg-emerald-600/90 text-white px-6 py-3 rounded-2xl shadow-lg font-bold flex items-center gap-2">
                  <span>📞 Phone:</span> <span>{adPhone}</span>
                </div>
                <a href={`https://wa.me/92${adWhatsApp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-2xl shadow-lg font-bold flex items-center gap-2 transition">
                  <span>💬 WhatsApp Support:</span> <span>{adWhatsApp}</span>
                </a>
              </div>

              <div className="mt-4 text-xs text-slate-300 font-medium">
                {adFooter}
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-4 mt-8 print:hidden">
            <button onClick={() => {
              const posterEl = document.getElementById('official-ad-poster');
              const printWindow = window.open('', '_blank');
              if (printWindow && posterEl) {
                const clone = posterEl.cloneNode(true) as HTMLElement;
                const deleteBtns = clone.querySelectorAll('button');
                deleteBtns.forEach(btn => btn.remove());

                printWindow.document.write(`
                  <html>
                    <head>
                      <title>MBA Academy - Official Admission Poster 2026</title>
                      <script src="https://cdn.tailwindcss.com"></script>
                      <style>
                        @media print {
                          body {
                            -webkit-print-color-adjust: exact !important;
                            print-color-adjust: exact !important;
                            color-adjust: exact !important;
                            background-color: #022c22 !important;
                            margin: 0;
                            padding: 20px;
                          }
                          *, ::before, ::after {
                            -webkit-print-color-adjust: exact !important;
                            print-color-adjust: exact !important;
                            color-adjust: exact !important;
                          }
                        }
                      </style>
                    </head>
                    <body class="bg-emerald-950 p-6 flex items-center justify-center min-h-screen">
                      <div class="w-full max-w-4xl mx-auto">
                        ${clone.outerHTML}
                      </div>
                      <script>
                        window.onload = () => {
                          setTimeout(() => { window.print(); }, 500);
                        };
                      </script>
                    </body>
                  </html>
                `);
                printWindow.document.close();
              } else {
                window.print();
              }
            }} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3.5 rounded-2xl shadow-lg flex items-center gap-2 text-sm transition cursor-pointer">
              🖨️ Print / Save Poster as PDF
            </button>
            <a href="https://wa.me/?text=Admissions%20Open%20at%20MBA%20College%20for%20Classes%201%20to%2010!%20Call%2003290275117" target="_blank" rel="noreferrer" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-3.5 rounded-2xl shadow-lg flex items-center gap-2 text-sm transition">
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
                      if (adminPassInput === adminPassword || adminPassInput === 'MushahidKing') {
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
                  if (adminPassInput === adminPassword || adminPassInput === 'MushahidKing') {
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
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        try {
                          const base64 = await compressImage(file, 400, 400, 0.85);
                          localStorage.setItem('tuition_academy_logo_v1', base64);
                          setAcademyLogo(base64);
                          setLogoError(false);
                          alert('Academy Logo updated successfully!');
                        } catch (err) {
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
                      }
                    }} 
                  />
                  <label 
                    htmlFor="academyLogoUpload" 
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>📁</span> Upload Custom Logo
                  </label>
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

              {/* HOME HERO BACKGROUND IMAGE SETTINGS */}
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-3xl p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs text-left">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-white shadow-md border border-emerald-200 p-2 overflow-hidden flex items-center justify-center shrink-0">
                    <img 
                      src={heroBg} 
                      alt="Hero BG Preview" 
                      className="w-full h-full object-cover rounded-xl" 
                    />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">Homepage Hero Background Image</h3>
                    <p className="text-xs text-slate-600 mt-0.5">Upload a naya picture / custom image or paste a photo URL for the Homepage background. It supports direct uploads!</p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full md:w-auto">
                  <input 
                    type="text" 
                    placeholder="Paste Image URL..." 
                    value={heroBg.startsWith('data:') ? '' : heroBg} 
                    onChange={(e) => {
                      if (e.target.value) {
                        localStorage.setItem('tuition_hero_bg_v2', e.target.value);
                        setHeroBg(e.target.value);
                      }
                    }} 
                    className="bg-white px-3 py-2 border border-emerald-200 rounded-xl text-xs outline-none w-full sm:w-48"
                  />
                  
                  <input 
                    type="file" 
                    accept="image/*" 
                    id="heroBgUpload" 
                    className="hidden" 
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        try {
                          const base64 = await compressImage(file, 1200, 800, 0.7);
                          localStorage.setItem('tuition_hero_bg_v2', base64);
                          setHeroBg(base64);
                          alert('Homepage background updated successfully!');
                        } catch (err) {
                          const reader = new FileReader();
                          reader.onload = () => {
                            const base64 = reader.result as string;
                            localStorage.setItem('tuition_hero_bg_v2', base64);
                            setHeroBg(base64);
                            alert('Homepage background updated successfully!');
                          };
                          reader.readAsDataURL(file);
                        }
                      }
                    }} 
                  />
                  <div className="flex gap-2 w-full sm:w-auto">
                    <label 
                      htmlFor="heroBgUpload" 
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-sm transition flex items-center gap-1.5 cursor-pointer flex-1 sm:flex-initial justify-center"
                    >
                      <span>📁</span> Upload Image
                    </label>
                    {heroBg !== "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1600&q=80" && (
                      <button 
                        onClick={() => {
                          if (confirm('Reset hero background to default?')) {
                            localStorage.removeItem('tuition_hero_bg_v2');
                            setHeroBg("https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1600&q=80");
                          }
                        }} 
                        className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold px-3 py-2.5 rounded-xl text-xs transition cursor-pointer"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* ADMISSION FORM BACKGROUND IMAGE SETTINGS */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-3xl p-6 mb-8 flex flex-col gap-6 shadow-xs text-left">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-white shadow-md border border-blue-200 p-2 overflow-hidden flex items-center justify-center shrink-0">
                      <img 
                        src={admissionBg} 
                        alt="Admission BG Preview" 
                        className="w-full h-full object-cover rounded-xl" 
                      />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-base">Admission Form Sidebar Image</h3>
                      <p className="text-xs text-slate-600 mt-0.5">Upload a custom image, paste a picture URL, or choose one of our beautiful educational presets below!</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full md:w-auto">
                    <input 
                      type="text" 
                      placeholder="Paste Image URL..." 
                      value={admissionBg.startsWith('data:') ? '' : admissionBg} 
                      onChange={(e) => {
                        if (e.target.value) {
                          localStorage.setItem('tuition_admission_bg_v2', e.target.value);
                          setAdmissionBg(e.target.value);
                        }
                      }} 
                      className="bg-white px-3 py-2 border border-blue-200 rounded-xl text-xs outline-none w-full sm:w-48"
                    />
                    
                    <input 
                      type="file" 
                      accept="image/*" 
                      id="admissionBgUpload" 
                      className="hidden" 
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            const base64 = await compressImage(file, 800, 800, 0.7);
                            localStorage.setItem('tuition_admission_bg_v2', base64);
                            setAdmissionBg(base64);
                            alert('Admission Form background updated successfully!');
                          } catch (err) {
                            const reader = new FileReader();
                            reader.onload = () => {
                              const base64 = reader.result as string;
                              localStorage.setItem('tuition_admission_bg_v2', base64);
                              setAdmissionBg(base64);
                              alert('Admission Form background updated successfully!');
                            };
                            reader.readAsDataURL(file);
                          }
                        }
                      }} 
                    />
                    <div className="flex gap-2 w-full sm:w-auto">
                      <label 
                        htmlFor="admissionBgUpload" 
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-sm transition flex items-center gap-1.5 cursor-pointer flex-1 sm:flex-initial justify-center"
                      >
                        <span>📁</span> Upload Custom Image
                      </label>
                      {admissionBg !== "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=80" && (
                        <button 
                          onClick={() => {
                            if (confirm('Reset admission background to default?')) {
                              localStorage.removeItem('tuition_admission_bg_v2');
                              setAdmissionBg("https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=80");
                            }
                          }} 
                          className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold px-3 py-2.5 rounded-xl text-xs transition cursor-pointer"
                        >
                          Reset
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Educational Presets */}
                <div className="border-t border-blue-100/50 pt-4">
                  <h4 className="text-xs font-bold text-slate-700 mb-3 flex items-center gap-1">
                    ✨ Quick Presets (Click to set instantly)
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {[
                      { name: 'Classmates Study', url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=80' },
                      { name: 'Library Books', url: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=1200&q=80' },
                      { name: 'Board / Classroom', url: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=1200&q=80' },
                      { name: 'Bright Library', url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=1200&q=80' },
                      { name: 'Modern Campus', url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&q=80' }
                    ].map((preset, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setAdmissionBg(preset.url);
                          localStorage.setItem('tuition_admission_bg_v2', preset.url);
                        }}
                        className={`group relative h-16 rounded-xl overflow-hidden border-2 text-left transition cursor-pointer ${admissionBg === preset.url ? 'border-blue-600 shadow-md scale-102' : 'border-slate-200 hover:border-slate-300'}`}
                      >
                        <img 
                          src={preset.url} 
                          alt={preset.name} 
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                        <div className="absolute inset-0 bg-black/60 flex items-end p-1.5">
                          <span className="text-[9px] text-white font-bold leading-tight line-clamp-2">{preset.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* PROFESSIONAL AD POSTER DYNAMIC SETTINGS */}
              <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-500/20 rounded-3xl p-6 mb-8 text-left">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-emerald-100 rounded-2xl text-emerald-800 text-lg">
                    📢
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-950 text-base">Professional Ad Poster Customizer</h3>
                    <p className="text-xs text-slate-600 mt-0.5">Customize the text, phone numbers, and features displayed on your Pro Ad Poster page in real-time.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Poster Main Title</label>
                    <input 
                      type="text" 
                      value={adTitle} 
                      onChange={(e) => {
                        setAdTitle(e.target.value);
                        localStorage.setItem('tuition_ad_title_v1', e.target.value);
                      }} 
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs outline-none bg-white font-semibold text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Admissions Open Badge Tag</label>
                    <input 
                      type="text" 
                      value={adBadge} 
                      onChange={(e) => {
                        setAdBadge(e.target.value);
                        localStorage.setItem('tuition_ad_badge_v1', e.target.value);
                      }} 
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs outline-none bg-white font-semibold text-slate-800"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Poster Subtitle / Class Range Details</label>
                    <input 
                      type="text" 
                      value={adSub} 
                      onChange={(e) => {
                        setAdSub(e.target.value);
                        localStorage.setItem('tuition_ad_sub_v1', e.target.value);
                      }} 
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs outline-none bg-white font-semibold text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number(s)</label>
                    <input 
                      type="text" 
                      value={adPhone} 
                      onChange={(e) => {
                        setAdPhone(e.target.value);
                        localStorage.setItem('tuition_ad_phone_v1', e.target.value);
                      }} 
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs outline-none bg-white font-semibold text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp Number</label>
                    <input 
                      type="text" 
                      value={adWhatsApp} 
                      onChange={(e) => {
                        setAdWhatsApp(e.target.value);
                        localStorage.setItem('tuition_ad_wa_v1', e.target.value);
                      }} 
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs outline-none bg-white font-semibold text-slate-800"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Footer Address & Important Info</label>
                    <input 
                      type="text" 
                      value={adFooter} 
                      onChange={(e) => {
                        setAdFooter(e.target.value);
                        localStorage.setItem('tuition_ad_footer_v1', e.target.value);
                      }} 
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs outline-none bg-white font-semibold text-slate-800"
                    />
                  </div>
                </div>

                {/* List of active cards with custom delete option */}
                <div className="mb-6">
                  <label className="block text-xs font-bold text-slate-700 mb-2">Active Cards ({adCards.length})</label>
                  <div className="flex flex-wrap gap-2">
                    {adCards.map((card, idx) => (
                      <div key={card.id || idx} className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 flex items-center gap-2 text-xs font-semibold text-slate-700">
                        <span>{card.icon}</span>
                        <span>{card.title}</span>
                        <button 
                          onClick={() => {
                            const updated = adCards.filter((_, i) => i !== idx);
                            setAdCards(updated);
                            localStorage.setItem('tuition_ad_cards_v1', JSON.stringify(updated));
                          }}
                          className="text-red-500 hover:text-red-700 font-bold ml-1 cursor-pointer"
                          title="Remove Card"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Adding New Highlight Cards Form */}
                <div className="border-t border-emerald-100 pt-6 mt-6">
                  <h4 className="font-extrabold text-slate-900 text-sm mb-1">➕ Add More Feature Highlight Cards to Poster</h4>
                  <p className="text-xs text-slate-500 mb-4">Admins can add unlimited custom cards describing subjects, features, timings, or results.</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Emoji Icon</label>
                      <select 
                        value={newAdCardIcon} 
                        onChange={(e) => setNewAdCardIcon(e.target.value)}
                        className="w-full p-2 rounded-xl border border-slate-200 text-xs outline-none bg-white font-semibold text-slate-800"
                      >
                        <option value="📚">📚 Books</option>
                        <option value="🏆">🏆 Trophy</option>
                        <option value="👥">👥 Group</option>
                        <option value="⭐">⭐ Star</option>
                        <option value="💻">💻 Computer</option>
                        <option value="📝">📝 Exam / Notes</option>
                        <option value="🎓">🎓 Graduate</option>
                        <option value="⚡">⚡ Fast / Active</option>
                        <option value="🎯">🎯 Target</option>
                        <option value="💰">💰 Fees / Cheap</option>
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Card Title</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Matric & Inter Coaching" 
                        value={newAdCardTitle} 
                        onChange={(e) => setNewAdCardTitle(e.target.value)} 
                        className="w-full p-2 rounded-xl border border-slate-200 text-xs outline-none bg-white font-medium text-slate-800"
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Short Description</label>
                    <textarea 
                      rows={2}
                      placeholder="e.g. Best subject experts for Biology, Chemistry, Physics, and Urdu coaching." 
                      value={newAdCardDesc} 
                      onChange={(e) => setNewAdCardDesc(e.target.value)} 
                      className="w-full p-2 rounded-xl border border-slate-200 text-xs outline-none bg-white text-slate-800"
                    />
                  </div>

                  <button 
                    onClick={() => {
                      if (!newAdCardTitle.trim() || !newAdCardDesc.trim()) {
                        alert('Please fill in both Card Title and Description!');
                        return;
                      }
                      const newCard = {
                        id: Date.now(),
                        icon: newAdCardIcon,
                        title: newAdCardTitle.trim(),
                        desc: newAdCardDesc.trim()
                      };
                      const updated = [...adCards, newCard];
                      setAdCards(updated);
                      localStorage.setItem('tuition_ad_cards_v1', JSON.stringify(updated));
                      setNewAdCardTitle('');
                      setNewAdCardDesc('');
                      alert('New highlight card added successfully to Ad Poster!');
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-sm transition inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>➕</span> Add Card to Poster
                  </button>
                </div>
              </div>

              {/* SOCIAL MEDIA & CHANNELS MANAGER (ADMIN) */}
              <div id="admin-social-media-form" className="bg-gradient-to-r from-blue-500/10 via-indigo-500/5 to-transparent border border-blue-500/20 rounded-3xl p-6 mb-8 text-left">
                <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-100 text-blue-700 rounded-2xl text-lg font-bold">
                      🌐
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-950 text-base flex items-center gap-2">
                        Social Media & Channel Links Manager
                        <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {socialLinks.length} Links
                        </span>
                      </h3>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Add, edit, activate, and manage your WhatsApp groups, YouTube channel, Facebook, Instagram, TikTok, and other social links.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Form to Add / Edit Social Link */}
                <form onSubmit={handleAddOrUpdateSocialLink} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs mb-6">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                    <h4 className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                      {editingSocialId ? (
                        <>
                          <span className="text-amber-600">✏️ Editing Social Link</span>
                          <button 
                            type="button" 
                            onClick={() => {
                              setEditingSocialId(null);
                              setNewSocialTitle('');
                              setNewSocialUrl('');
                            }}
                            className="text-[11px] font-semibold text-slate-500 hover:text-slate-700 underline ml-2 cursor-pointer"
                          >
                            Cancel Edit
                          </button>
                        </>
                      ) : (
                        <>
                          <span>➕ Add New Social Media Link</span>
                        </>
                      )}
                    </h4>

                    {/* Quick Preset Buttons */}
                    <div className="flex items-center gap-1 flex-wrap">
                      <span className="text-[10px] font-bold text-slate-400 mr-1">Quick Select:</span>
                      {[
                        { plat: 'whatsapp', name: 'WhatsApp', icon: '💬', title: 'Official WhatsApp Support', defaultUrl: 'https://wa.me/923290275117' },
                        { plat: 'facebook', name: 'Facebook', icon: '📘', title: 'MBA Academy Facebook Page', defaultUrl: 'https://www.facebook.com/profile.php?id=61592718998531' },
                        { plat: 'youtube', name: 'YouTube', icon: '▶️', title: 'MBA Academy YouTube Channel', defaultUrl: 'https://www.youtube.com/@MBAAcademy-s8z' },
                        { plat: 'instagram', name: 'Instagram', icon: '📸', title: 'MBA Academy Instagram', defaultUrl: 'https://www.instagram.com/mbaacadmey/' },
                        { plat: 'tiktok', name: 'TikTok', icon: '🎵', title: 'TikTok Official', defaultUrl: 'https://tiktok.com/' },
                        { plat: 'telegram', name: 'Telegram', icon: '✈️', title: 'Telegram Study Group', defaultUrl: 'https://t.me/' }
                      ].map(p => (
                        <button
                          key={p.plat}
                          type="button"
                          onClick={() => {
                            setNewSocialPlatform(p.plat);
                            if (!newSocialTitle) setNewSocialTitle(p.title);
                            if (!newSocialUrl) setNewSocialUrl(p.defaultUrl);
                          }}
                          className="px-2 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 text-[10px] font-bold rounded-lg transition cursor-pointer"
                        >
                          {p.icon} {p.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Select Platform <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={newSocialPlatform}
                        onChange={(e) => {
                          const val = e.target.value;
                          setNewSocialPlatform(val);
                          if (!editingSocialId && !newSocialTitle) {
                            const info = getSocialPlatformInfo(val);
                            setNewSocialTitle(`MBA Academy ${info.label}`);
                          }
                        }}
                        className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50 outline-none cursor-pointer"
                      >
                        <option value="whatsapp">💬 WhatsApp (Group / Chat / Channel)</option>
                        <option value="facebook">📘 Facebook (Page / Profile / Group)</option>
                        <option value="youtube">▶️ YouTube (Lectures & Channel)</option>
                        <option value="instagram">📸 Instagram (Profile & Reels)</option>
                        <option value="tiktok">🎵 TikTok (Official Account)</option>
                        <option value="twitter">✖️ Twitter / X (Account)</option>
                        <option value="telegram">✈️ Telegram (Channel / Group)</option>
                        <option value="linkedin">💼 LinkedIn (Company Profile)</option>
                        <option value="website">🌐 Website / Portal (Custom URL)</option>
                        <option value="other">🔗 Other Social Link</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Link Title / Display Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Official WhatsApp Support, YouTube Video Lectures"
                        value={newSocialTitle}
                        onChange={(e) => setNewSocialTitle(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 bg-slate-50 outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Full Link / URL <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. https://wa.me/923290275117 or https://facebook.com/..."
                        value={newSocialUrl}
                        onChange={(e) => setNewSocialUrl(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 bg-slate-50 outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-2">
                    <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                      <span>💡</span>
                      <span>Links are automatically formatted and will appear in Header, Home Page, Contact Page, and Footer.</span>
                    </div>

                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer shrink-0"
                    >
                      {editingSocialId ? (
                        <>
                          <Check size={15} /> Save Changes
                        </>
                      ) : (
                        <>
                          <Plus size={15} /> Add Social Link
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* Configured Social Links List */}
                <div>
                  <h4 className="text-xs font-extrabold text-slate-800 mb-3 flex items-center justify-between">
                    <span>Configured Social Media Links ({socialLinks.length})</span>
                    <span className="text-[10px] text-slate-500 font-normal">Click toggle switch to show/hide on website</span>
                  </h4>

                  {socialLinks.length === 0 ? (
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center text-slate-500 text-xs">
                      No social media links added yet. Use the form above to add your first link!
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {socialLinks.map((link) => {
                        const info = getSocialPlatformInfo(link.platform);
                        return (
                          <div 
                            key={link.id} 
                            className={`bg-white rounded-2xl p-4 border transition duration-200 shadow-2xs flex items-center justify-between gap-3 ${link.isActive ? 'border-slate-200' : 'border-slate-200 bg-slate-50/60 opacity-60'}`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 ${info.bgLight} ${info.textColor} border ${info.border}`}>
                                {info.emoji}
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                  <b className="text-xs text-slate-900 truncate block font-bold">{link.title}</b>
                                  <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase shrink-0 ${info.badgeBg}`}>
                                    {info.label}
                                  </span>
                                </div>
                                <a 
                                  href={link.url} 
                                  target="_blank" 
                                  rel="noreferrer" 
                                  className="text-[11px] text-blue-600 hover:underline truncate block flex items-center gap-1"
                                >
                                  <span className="truncate">{link.url}</span>
                                  <ExternalLink size={10} className="shrink-0" />
                                </a>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              {/* Toggle Active status */}
                              <button
                                type="button"
                                onClick={() => handleToggleSocialLink(link.id)}
                                className={`text-[10px] font-bold px-2.5 py-1 rounded-lg transition cursor-pointer ${link.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}
                                title={link.isActive ? 'Visible to students. Click to disable' : 'Hidden. Click to enable'}
                              >
                                {link.isActive ? 'Active' : 'Hidden'}
                              </button>

                              {/* Edit */}
                              <button
                                type="button"
                                onClick={() => handleEditSocialLink(link)}
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                                title="Edit Link"
                              >
                                <Edit2 size={15} />
                              </button>

                              {/* Delete */}
                              <button
                                type="button"
                                onClick={() => handleDeleteSocialLink(link.id)}
                                className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                                title="Delete Link"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
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
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
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
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Class 1 to 10 - Quality Education & Professional Coaching. Admissions Open.
            </p>
            <div className="flex items-center gap-1.5 flex-wrap">
              {socialLinks.filter(l => l.isActive).map(link => {
                const info = getSocialPlatformInfo(link.platform);
                return (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs shadow-xs transition hover:scale-110 ${info.color} text-white font-bold`}
                    title={`${link.title} (${info.label})`}
                  >
                    <span>{info.emoji}</span>
                  </a>
                );
              })}
            </div>
          </div>
          <div>
            <b className="text-white text-sm block mb-3">Quick Links</b>
            <button onClick={() => setCurrentPage('home')} className="text-xs block mb-2 hover:text-white transition">Home</button>
            <button onClick={() => setCurrentPage('about')} className="text-xs block mb-2 hover:text-white transition">About Us</button>
            <button onClick={() => setCurrentPage('teachers')} className="text-xs block mb-2 hover:text-white transition">Teachers</button>
            <button onClick={() => setCurrentPage('contact')} className="text-xs block mb-2 hover:text-white transition">Contact Us</button>
            <button onClick={() => setCurrentPage('ad')} className="text-xs block mb-2 text-amber-400 font-semibold hover:underline">📢 Official Admission Poster</button>
          </div>
          <div>
            <b className="text-white text-sm block mb-3">Support & Tools</b>
            <button onClick={() => setCurrentPage('admission')} className="text-xs block mb-2 hover:text-white transition">Admissions</button>
            <button onClick={() => { setCurrentPage('attendance'); setSelectedClassForAttendance(null); }} className="text-xs block mb-2 hover:text-white transition">Attendance</button>
            <button onClick={() => setCurrentPage('online')} className="text-xs block mb-2 hover:text-white transition">Online Classes</button>
            <button onClick={() => setCurrentPage('computer')} className="text-xs block mb-2 hover:text-white transition">Computer Section</button>
            <button onClick={() => setCurrentPage('results')} className="text-xs block mb-2 hover:text-white transition">Check Results</button>
          </div>
          <div>
            <b className="text-white text-sm block mb-3">Contact & Social Channels</b>
            <a href="tel:+923290275117" className="text-xs block mb-2 text-slate-300 hover:text-white">📞 03290275117</a>
            <a href="https://wa.me/923290275117" target="_blank" rel="noreferrer" className="text-xs block mb-3 text-emerald-400 font-semibold">💬 WhatsApp Support</a>
            
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-bold text-slate-400 block">Follow Us:</span>
              {socialLinks.filter(l => l.isActive).slice(0, 3).map(link => {
                const info = getSocialPlatformInfo(link.platform);
                return (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs flex items-center gap-1.5 text-slate-300 hover:text-white transition"
                  >
                    <span>{info.emoji}</span>
                    <span className="truncate">{link.title}</span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto border-t border-slate-800/80 pt-6 flex items-center justify-between flex-wrap gap-4 text-xs text-slate-500">
          <span>© 2026 MBA Academy. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <button onClick={() => setCurrentPage('records')} className="hover:text-slate-300 transition">Admin Login</button>
            <span>•</span>
            <button onClick={() => { setAuthModalInitialMode('login'); setShowAuthModal(true); }} className="hover:text-slate-300 transition">Portal Login / Sign Up</button>
            <span>•</span>
            <button onClick={() => setCurrentPage('contact')} className="hover:text-slate-300 transition">Help & Support</button>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a 
        href="https://wa.me/923290275117" 
        target="_blank" 
        rel="noreferrer" 
        className="fixed bottom-6 right-6 z-50 bg-emerald-600 hover:bg-emerald-700 text-white p-3.5 rounded-full shadow-2xl flex items-center justify-center gap-2 transition hover:scale-110 border-2 border-white"
        title="Chat on WhatsApp: 03290275117"
      >
        <span className="text-2xl">💬</span>
        <span className="hidden md:inline text-xs font-bold pr-1">WhatsApp 03290275117</span>
      </a>

      {/* User Login & Sign Up Modal with Supabase Teachers Database Integration */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleUserLoginSuccess}
        initialMode={authModalInitialMode}
        adminPassword={adminPassword}
        teachersList={teachers}
        onTeacherAdded={(newT) => {
          setTeachers(prev => {
            const exists = prev.some(t => t.id === newT.id);
            if (exists) return prev;
            const updated = [...prev, newT];
            localStorage.setItem('ta_teachers', JSON.stringify(updated));
            return updated;
          });
        }}
      />

      {/* Custom Admin Login Password Modal */}
      {showAdminLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-sm w-full p-6 text-center animate-in fade-in zoom-in-95 duration-150">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4 border border-blue-100">
              🔒
            </div>
            <h3 className="font-extrabold text-slate-900 text-lg mb-1">Admin Password Required</h3>
            <p className="text-xs text-slate-500 mb-6">Enter password to gain access to admin controls.</p>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              handleAdminLoginSubmit(adminLoginPasswordInput);
            }}>
              <input 
                type="password"
                placeholder="••••••••"
                value={adminLoginPasswordInput}
                onChange={(e) => setAdminLoginPasswordInput(e.target.value)}
                autoFocus
                className="w-full p-3 border border-slate-200 rounded-xl text-center text-sm font-mono tracking-widest outline-none focus:ring-2 focus:ring-blue-500/20 bg-slate-50 mb-4 text-slate-800"
              />
              
              <div className="grid grid-cols-2 gap-3">
                <button 
                  type="button"
                  onClick={() => {
                    setShowAdminLoginModal(false);
                    setAdminLoginPasswordInput('');
                  }}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 rounded-xl text-xs transition cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-sm transition cursor-pointer"
                >
                  Confirm OK
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notifications Container */}
      <div className="fixed top-24 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        {toasts.map((t: any) => (
          <div 
            key={t.id} 
            className="pointer-events-auto w-full bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden flex flex-col animate-in slide-in-from-right duration-300 select-none hover:shadow-2xl transition duration-200"
          >
            <div className="p-4 flex gap-3 items-start">
              <div className={`p-2.5 rounded-xl shrink-0 ${t.type === 'result' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-indigo-50 text-indigo-600 border border-indigo-100'}`}>
                {t.type === 'result' ? '🏆' : '📺'}
              </div>
              <div className="flex-1 text-left">
                <div className="flex justify-between items-start gap-1">
                  <h4 className="font-extrabold text-slate-900 text-sm">{t.title}</h4>
                  <button 
                    onClick={() => setToasts(prev => prev.filter((item: any) => item.id !== t.id))}
                    className="text-slate-400 hover:text-slate-600 p-0.5 rounded-lg shrink-0 transition cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                </div>
                <p className="text-xs font-semibold text-slate-700 mt-0.5">{t.message}</p>
                <p className="text-[10px] text-slate-500 mt-1 bg-slate-50 border border-slate-100 rounded-lg px-2 py-1 inline-block font-mono">
                  {t.detail}
                </p>
              </div>
            </div>
            {/* Visual Progress Bar (ticking down) */}
            <div className="h-1 bg-slate-100 w-full overflow-hidden">
              <div 
                className={`h-full ${t.type === 'result' ? 'bg-amber-500' : 'bg-indigo-500'} animate-toast-progress`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
