import React, { useState, useEffect } from 'react';
import { 
  Monitor, Terminal, Cpu, Laptop, Shield, BookOpen, Clock, 
  CheckCircle, Users, Video, MessageSquare, Award, ArrowRight, Star
} from 'lucide-react';

interface Teacher {
  id: number;
  name: string;
  subject: string;
  qual: string;
  img: string;
  created_at?: string;
}

interface OnlineClass {
  id: number;
  title: string;
  teacher: string;
  time: string;
  date: string;
  link: string;
  classImg?: string;
  isRecorded?: boolean;
}

interface ComputerSectionProps {
  isAdmin: boolean;
  teachers: Teacher[];
  onlineClasses: OnlineClass[];
  parseTeacherQual: (qualStr: string) => { qual: string; section: string };
  parseOnlineTitle: (titleStr: string) => { title: string; section: string };
  handleDeleteTeacher?: (id: number) => void;
  setCurrentPage: (page: string) => void;
}

export default function ComputerSection({
  isAdmin,
  teachers,
  onlineClasses,
  parseTeacherQual,
  parseOnlineTitle,
  handleDeleteTeacher,
  setCurrentPage
}: ComputerSectionProps) {
  // Live Class Scheduling states (saved in localStorage for persistence)
  const [liveStart, setLiveStart] = useState(() => {
    return localStorage.getItem('tuition_comp_live_start') || '09:00';
  });
  const [liveEnd, setLiveEnd] = useState(() => {
    return localStorage.getItem('tuition_comp_live_end') || '11:00';
  });
  const [isLiveActive, setIsLiveActive] = useState(false);
  const [timeLeftStr, setTimeLeftStr] = useState('');

  useEffect(() => {
    const checkLiveStatus = () => {
      const now = new Date();
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();
      const currentSeconds = now.getSeconds();
      
      const [startH, startM] = liveStart.split(':').map(Number);
      const [endH, endM] = liveEnd.split(':').map(Number);
      
      const nowVal = currentHours * 3600 + currentMinutes * 60 + currentSeconds;
      const startVal = startH * 3600 + startM * 60;
      const endVal = endH * 3600 + endM * 60;
      
      if (nowVal >= startVal && nowVal < endVal) {
        setIsLiveActive(true);
        // Calculate remaining seconds
        const diffSec = endVal - nowVal;
        const h = Math.floor(diffSec / 3600);
        const m = Math.floor((diffSec % 3600) / 60);
        const s = diffSec % 60;
        setTimeLeftStr(`${h > 0 ? h + 'h ' : ''}${m}m ${s}s left`);
      } else {
        setIsLiveActive(false);
        // Calculate time until next start (assume next day if past start time today)
        let diffSec = 0;
        if (nowVal < startVal) {
          diffSec = startVal - nowVal;
        } else {
          diffSec = (24 * 3600 - nowVal) + startVal;
        }
        const h = Math.floor(diffSec / 3600);
        const m = Math.floor((diffSec % 3600) / 60);
        const s = diffSec % 60;
        setTimeLeftStr(`Starts in ${h > 0 ? h + 'h ' : ''}${m}m ${s}s`);
      }
    };
    
    checkLiveStatus();
    const interval = setInterval(checkLiveStatus, 1000);
    return () => clearInterval(interval);
  }, [liveStart, liveEnd]);

  // Course Selector State
  const [activeCourseTab, setActiveCourseTab] = useState<'office' | 'design' | 'web' | 'freelance'>('office');
  
  // Fee / Booking Calculator State
  const [selectedCourse, setSelectedCourse] = useState('Office Automation & Business Tools');
  const [selectedBatch, setSelectedBatch] = useState('Afternoon Batch (03:00 PM - 05:00 PM)');

  // Enquiry Form State
  const [studentName, setStudentName] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  const [studentAge, setStudentAge] = useState('');
  const [enquiryCourse, setEnquiryCourse] = useState('Office Automation');
  const [preferredBatch, setPreferredBatch] = useState('Afternoon (3 PM - 5 PM)');
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Inner navbar section active state & scroll spy
  const [activeSection, setActiveSection] = useState('comp-overview');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['comp-overview', 'comp-courses', 'comp-batches', 'comp-teachers', 'comp-lectures', 'comp-enquiry'];
      const scrollPosition = window.scrollY + 180; // offset for sticky navbars

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const topOffset = el.getBoundingClientRect().top + window.scrollY - 145; // account for main nav + inner nav
      window.scrollTo({
        top: topOffset,
        behavior: 'smooth'
      });
      setActiveSection(id);
    }
  };

  // Courses static details
  const courses = {
    office: {
      title: 'Office Automation & Typing Expert',
      duration: '3 Months',
      level: 'Beginner to Intermediate',
      rating: '4.9/5 (180+ Students)',
      desc: 'Master the absolute essentials of professional documentation, spreadsheets, and business presentations. Highly recommended for students, job-seekers, and office professionals.',
      modules: [
        'Microsoft Word (Advanced Document Formatting & Layouts)',
        'Microsoft Excel (Formulas, Pivot Tables, Charts & Data Management)',
        'Microsoft PowerPoint (Creative Presentation Design & Animations)',
        'Professional Typing Training (Target: 40+ Words Per Minute)',
        'Email Etiquette, Google Workspace & Cloud Drive Management'
      ],
      fee: 'Rs. 2,000/month',
      img: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=600&auto=format&fit=crop',
      icon: <Laptop className="w-6 h-6 text-indigo-600" />
    },
    design: {
      title: 'Graphic Designing & Canva Mastery',
      duration: '2 Months',
      level: 'Beginner Friendly',
      rating: '4.8/5 (120+ Students)',
      desc: 'Unlock your creative potential and learn how to design eye-catching visual content. From social media posts to professional branding materials.',
      modules: [
        'Canva Pro & Advanced Design Techniques',
        'Principles of Typography, Color Theory & Grid Layouts',
        'Creating Professional Logos, Flyers, Book Covers & Posters',
        'Social Media Poster Designing & YouTube Thumbnail Creation',
        'Introduction to Adobe Photoshop & Photo Manipulation'
      ],
      fee: 'Rs. 2,500/month',
      img: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=600&auto=format&fit=crop',
      icon: <Monitor className="w-6 h-6 text-purple-600" />
    },
    web: {
      title: 'Web Development & Coding for Kids/Teens',
      duration: '3 Months',
      level: 'Intermediate',
      rating: '5.0/5 (90+ Students)',
      desc: 'Learn the foundational languages of the modern web and start building fully responsive custom websites from scratch. Develop computational thinking and programming logic.',
      modules: [
        'Scratch & Visual Programming (For logic building)',
        'HTML5 & Semantics (Structuring web content)',
        'CSS3 & Modern Layouts (Flexbox, Grid, Responsive Media Queries)',
        'Tailwind CSS (Accelerated beautiful styling)',
        'JavaScript Basics (Adding dynamic interactivity & logic)'
      ],
      fee: 'Rs. 3,000/month',
      img: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop',
      icon: <Terminal className="w-6 h-6 text-emerald-600" />
    },
    freelance: {
      title: 'Digital Skills & Freelancing Blueprint',
      duration: '2 Months',
      level: 'Intermediate to Advanced',
      rating: '4.9/5 (140+ Students)',
      desc: 'Convert your IT skills into a steady stream of online income. Learn how to list services, win international clients, and build a stellar freelance profile.',
      modules: [
        'Setting up Fiverr, Upwork & Freelancer Profiles',
        'Creating High-Converting Fiverr Gigs & Optimization',
        'Proposal Writing, Bidding Strategies & Client Communication',
        'Virtual Assistant Tools, Data Entry & Copywriting Projects',
        'Receiving Local Payments securely (Payoneer, Nayapay, Bank Transfer)'
      ],
      fee: 'Rs. 2,500/month',
      img: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=600&auto=format&fit=crop',
      icon: <Cpu className="w-6 h-6 text-amber-600" />
    }
  };

  // Filter teachers belonging to Computer Class Section
  const computerTeachers = teachers.filter(t => {
    const { section } = parseTeacherQual(t.qual);
    return section === 'Computer Class' || t.subject.toLowerCase().includes('computer') || t.subject.toLowerCase().includes('it');
  });

  // Filter online classes belonging to Computer Class Section
  const computerClasses = onlineClasses.filter(c => {
    const { section } = parseOnlineTitle(c.title);
    return section === 'Computer Class' || c.title.toLowerCase().includes('computer') || c.title.toLowerCase().includes('it');
  });

  // Handle Enquiry Submit
  const handleEnquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName || !studentPhone) {
      alert('Please enter your Name and WhatsApp Number.');
      return;
    }
    setFormSubmitted(true);
  };

  // Generate WhatsApp Message
  const handleWhatsAppEnquiry = () => {
    const message = `Hello MBA Academy, I want to join the Computer Course!\n\n*Details:*\n👤 Name: ${studentName || 'Student'}\n📞 WhatsApp: ${studentPhone}\n👶 Age: ${studentAge || 'N/A'}\n💻 Selected Course: ${enquiryCourse}\n⏰ Preferred Batch: ${preferredBatch}\n\nPlease reserve my seat! Thanks.`;
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/923290275117?text=${encoded}`, '_blank');
  };

  const handleWhatsAppDirectBooking = () => {
    const message = `Hello MBA Academy, I would like to book a seat in the *${selectedCourse}* for the *${selectedBatch}*. Please share the registration details.`;
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/923290275117?text=${encoded}`, '_blank');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-12">
      {/* Dynamic Inner Sticky Navbar for Computer Subsections */}
      <div className="sticky top-[73px] z-40 bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-2xl p-2.5 mb-10 shadow-md flex items-center justify-between gap-4 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none w-full md:w-auto">
          <button 
            onClick={() => scrollToSection('comp-overview')}
            className={`px-3 py-2 rounded-xl text-xs font-black tracking-tight transition flex items-center gap-1.5 shrink-0 cursor-pointer ${activeSection === 'comp-overview' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100 hover:text-indigo-600'}`}
          >
            <Laptop size={14} /> Overview
          </button>
          <button 
            onClick={() => scrollToSection('comp-courses')}
            className={`px-3 py-2 rounded-xl text-xs font-black tracking-tight transition flex items-center gap-1.5 shrink-0 cursor-pointer ${activeSection === 'comp-courses' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100 hover:text-indigo-600'}`}
          >
            <BookOpen size={14} /> Courses
          </button>
          <button 
            onClick={() => scrollToSection('comp-batches')}
            className={`px-3 py-2 rounded-xl text-xs font-black tracking-tight transition flex items-center gap-1.5 shrink-0 cursor-pointer ${activeSection === 'comp-batches' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100 hover:text-indigo-600'}`}
          >
            <Clock size={14} /> Timings
          </button>
          <button 
            onClick={() => scrollToSection('comp-teachers')}
            className={`px-3 py-2 rounded-xl text-xs font-black tracking-tight transition flex items-center gap-1.5 shrink-0 cursor-pointer ${activeSection === 'comp-teachers' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100 hover:text-indigo-600'}`}
          >
            <Users size={14} /> Teachers
          </button>
          <button 
            onClick={() => scrollToSection('comp-lectures')}
            className={`px-3 py-2 rounded-xl text-xs font-black tracking-tight transition flex items-center gap-1.5 shrink-0 cursor-pointer ${activeSection === 'comp-lectures' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100 hover:text-indigo-600'}`}
          >
            <Video size={14} /> Lectures
          </button>
          <button 
            onClick={() => scrollToSection('comp-enquiry')}
            className={`px-3 py-2 rounded-xl text-xs font-black tracking-tight transition flex items-center gap-1.5 shrink-0 cursor-pointer ${activeSection === 'comp-enquiry' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100 hover:text-indigo-600'}`}
          >
            <MessageSquare size={14} /> Enquiry
          </button>
        </div>

        {/* Quick Action Button */}
        <div className="hidden lg:flex items-center gap-2 shrink-0">
          <span className="text-[9px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-md animate-pulse">
            Active
          </span>
          <button 
            onClick={() => scrollToSection('comp-enquiry')}
            className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black tracking-tight px-3 py-1.5 rounded-xl transition shadow-xs flex items-center gap-1 cursor-pointer"
          >
            💬 Book Now
          </button>
        </div>
      </div>

      {/* 🔴 Live Google Meet Class Action Banner */}
      {isLiveActive && (
        <div className="bg-gradient-to-r from-rose-600 via-pink-600 to-indigo-600 rounded-3xl p-5 md:p-6 text-white flex flex-col md:flex-row items-center justify-between gap-5 mb-10 shadow-lg border border-rose-500/20 animate-pulse">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center animate-bounce shrink-0">
              <Video className="w-6 h-6 text-white" />
            </div>
            <div className="text-center md:text-left">
              <span className="bg-rose-800 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md inline-block mb-1.5 shadow-sm animate-ping duration-1000">
                🔴 Live Computer Class Active
              </span>
              <h3 className="font-extrabold text-base md:text-lg text-white">Join the Live Google Meet Computer Class Now!</h3>
              <p className="text-xs text-indigo-100 mt-0.5">Session ends in <b className="text-amber-300 font-bold">{timeLeftStr}</b>. Click the join button to connect directly.</p>
            </div>
          </div>
          <a 
            href="https://meet.google.com/nxu-xpbr-rkb" 
            target="_blank" 
            rel="noreferrer" 
            className="bg-white hover:bg-slate-50 text-rose-600 font-extrabold px-6 py-3.5 rounded-2xl text-xs transition shadow-md flex items-center gap-2 shrink-0 cursor-pointer w-full md:w-auto justify-center"
          >
            <Video size={14} className="animate-pulse" /> JOIN COMPUTER CLASS (LIVE)
          </a>
        </div>
      )}

      {/* 1. Header Hero Area */}
      <div id="comp-overview" className="scroll-mt-32 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden mb-12">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7">
            <span className="bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest inline-flex items-center gap-1.5 mb-5">
              <Monitor size={12} className="animate-pulse text-indigo-400" /> Dedicated IT Wing
            </span>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight mb-4">
              Computer Class Section
            </h1>
            <p className="text-base md:text-lg text-slate-300 mb-8 leading-relaxed">
              Empowering students with state-of-the-art computer courses. From fundamental keyboard typing & office suites to dynamic graphic designing, logic building, and professional freelancing. Starting from just Rs. 2,000/month.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => scrollToSection('comp-courses')}
                className="bg-white text-indigo-950 hover:bg-slate-100 font-bold px-6 py-3 rounded-xl shadow-lg text-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <BookOpen size={15} /> View Course Catalog
              </button>
              <button 
                onClick={() => scrollToSection('comp-enquiry')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg text-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <MessageSquare size={15} /> Request Free Assessment
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-slate-700/50 shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?q=80&w=800&auto=format&fit=crop" 
                alt="Computer Classroom Lab" 
                className="w-full h-64 md:h-80 object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4 bg-slate-900/80 backdrop-blur-md p-3 rounded-xl border border-slate-700">
                <p className="text-[11px] font-bold text-indigo-400 uppercase tracking-widest">Modern Computer Lab</p>
                <p className="text-xs text-slate-200 mt-0.5">Equipped with fast internet, individual PCs & skilled instructors.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Computer Lab Showcase */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm flex flex-col hover:shadow-md transition">
          <img 
            src="https://images.unsplash.com/photo-1547082299-de196ea013d6?q=80&w=400&auto=format&fit=crop" 
            alt="Individual PCs" 
            className="w-full h-36 object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="p-5 flex-1 flex flex-col justify-between">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600 mt-1 shrink-0">
                <Monitor className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Individual PCs</h4>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">Dedicated computer systems for every student during practice hours.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm flex flex-col hover:shadow-md transition">
          <img 
            src="https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=400&auto=format&fit=crop" 
            alt="Hands-on Practice" 
            className="w-full h-36 object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="p-5 flex-1 flex flex-col justify-between">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600 mt-1 shrink-0">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Hands-on Practice</h4>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">100% practical lab assignments with real-world project portfolios.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm flex flex-col hover:shadow-md transition">
          <img 
            src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=400&auto=format&fit=crop" 
            alt="Certified Syllabus" 
            className="w-full h-36 object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="p-5 flex-1 flex flex-col justify-between">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-50 rounded-lg text-purple-600 mt-1 shrink-0">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Certified Syllabus</h4>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">Modern curriculum updated with standard tools, codes, and shortcuts.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm flex flex-col hover:shadow-md transition">
          <img 
            src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=400&auto=format&fit=crop" 
            alt="Certificates Awarded" 
            className="w-full h-36 object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="p-5 flex-1 flex flex-col justify-between">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-50 rounded-lg text-amber-600 mt-1 shrink-0">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Certificates Awarded</h4>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">Official Course Completion Certificate upon clearing final test.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Interactive Courses Catalog */}
      <div id="comp-courses" className="scroll-mt-32 mb-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-black text-slate-900">Explore Our Featured Computer Courses</h2>
          <p className="text-xs text-slate-500 mt-2 max-w-lg mx-auto">Click on the tabs below to explore the detailed modules, eligibility criteria, and fee structures of each IT class.</p>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-8 bg-slate-100 p-1.5 rounded-2xl max-w-2xl mx-auto">
          <button 
            onClick={() => setActiveCourseTab('office')} 
            className={`flex-1 min-w-[120px] px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${activeCourseTab === 'office' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-950'}`}
          >
            <Laptop size={14} /> Office Suite
          </button>
          <button 
            onClick={() => setActiveCourseTab('design')} 
            className={`flex-1 min-w-[120px] px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${activeCourseTab === 'design' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-600 hover:text-slate-950'}`}
          >
            <Monitor size={14} /> Graphic Designing
          </button>
          <button 
            onClick={() => setActiveCourseTab('web')} 
            className={`flex-1 min-w-[120px] px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${activeCourseTab === 'web' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-950'}`}
          >
            <Terminal size={14} /> Web Dev/Coding
          </button>
          <button 
            onClick={() => setActiveCourseTab('freelance')} 
            className={`flex-1 min-w-[120px] px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${activeCourseTab === 'freelance' ? 'bg-white text-amber-700 shadow-xs' : 'text-slate-600 hover:text-slate-950'}`}
          >
            <Cpu size={14} /> Freelancing IT
          </button>
        </div>

        {/* Selected Course Content card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-slate-50 rounded-xl">
                {courses[activeCourseTab].icon}
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Featured Course</span>
                <h3 className="text-xl md:text-2xl font-extrabold text-slate-900 leading-tight">
                  {courses[activeCourseTab].title}
                </h3>
              </div>
            </div>

            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              {courses[activeCourseTab].desc}
            </p>

            {/* Dynamic Course Feature Image */}
            <div className="relative rounded-2xl overflow-hidden mb-6 border border-slate-150 h-48 sm:h-56 shadow-xs">
              <img 
                src={courses[activeCourseTab].img} 
                alt={courses[activeCourseTab].title} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent"></div>
            </div>

            <h4 className="font-bold text-slate-800 text-xs mb-3 flex items-center gap-1.5">
              <CheckCircle size={14} className="text-emerald-500" /> Key Topics & Learning Modules:
            </h4>
            <ul className="space-y-2 mb-6">
              {courses[activeCourseTab].modules.map((m, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs text-slate-600">
                  <span className="text-indigo-500 font-bold text-[11px] select-none mt-0.5">•</span>
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-5 bg-gradient-to-br from-slate-50 to-indigo-50/40 border border-indigo-100 rounded-2xl p-6 md:p-8 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-indigo-100">
                <span className="text-xs text-slate-500 font-medium">Course Duration</span>
                <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-xs font-bold">{courses[activeCourseTab].duration}</span>
              </div>
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-indigo-100">
                <span className="text-xs text-slate-500 font-medium">Difficulty Level</span>
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-bold">{courses[activeCourseTab].level}</span>
              </div>
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-indigo-100">
                <span className="text-xs text-slate-500 font-medium">Student Ratings</span>
                <span className="text-amber-600 font-bold text-xs flex items-center gap-1">★ {courses[activeCourseTab].rating}</span>
              </div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs text-slate-500 font-medium">Investment / Fee</span>
                <span className="text-indigo-700 text-lg font-black">{courses[activeCourseTab].fee}</span>
              </div>
            </div>

            <button 
              onClick={() => {
                setEnquiryCourse(courses[activeCourseTab].title);
                scrollToSection('comp-enquiry');
              }}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-md text-xs transition flex items-center justify-center gap-2 cursor-pointer"
            >
              Secure Your Slot Now <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Batch Timings & Direct WhatsApp Booking */}
      <div id="comp-batches" className="scroll-mt-32 bg-indigo-50/60 border border-indigo-100 rounded-3xl p-6 md:p-10 mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7">
            <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-600 bg-indigo-100/60 px-3 py-1 rounded-full inline-block mb-3">Flexible Timings</span>
            <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-4">Daily Computer Batch Schedule</h3>
            <p className="text-xs text-slate-600 mb-6 leading-relaxed">
              We understand you have school, work, or household responsibilities. Choose from our specialized morning or evening computer batches. One student per machine is guaranteed.
            </p>

            {/* Batch Schedule Image */}
            <div className="rounded-2xl overflow-hidden mb-6 border border-indigo-100 shadow-xs">
              <img 
                src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop" 
                alt="Programming & Designing Lab" 
                className="w-full h-44 object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="space-y-3.5">
              <div className="flex items-center justify-between bg-white px-4 py-3 rounded-xl border border-indigo-100/50">
                <div className="flex items-center gap-2">
                  <span className="text-sm">🌅</span>
                  <span className="text-xs font-bold text-slate-800">Batch 1: Morning (Special for Ladies)</span>
                </div>
                <span className="text-xs font-semibold text-indigo-600">09:00 AM - 11:00 AM</span>
              </div>
              <div className="flex items-center justify-between bg-white px-4 py-3 rounded-xl border border-indigo-100/50">
                <div className="flex items-center gap-2">
                  <span className="text-sm">🎒</span>
                  <span className="text-xs font-bold text-slate-800">Batch 2: Afternoon (School Students)</span>
                </div>
                <span className="text-xs font-semibold text-indigo-600">03:00 PM - 05:00 PM</span>
              </div>
              <div className="flex items-center justify-between bg-white px-4 py-3 rounded-xl border border-indigo-100/50">
                <div className="flex items-center gap-2">
                  <span className="text-sm">🌇</span>
                  <span className="text-xs font-bold text-slate-800">Batch 3: Evening (Advanced IT & Coding)</span>
                </div>
                <span className="text-xs font-semibold text-indigo-600">05:00 PM - 07:00 PM</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-indigo-100 shadow-xs">
            <h4 className="font-extrabold text-slate-900 text-sm mb-4">Quick WhatsApp Seat Booking</h4>
            
            <label className="block text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1.5">Select Course</label>
            <select 
              value={selectedCourse} 
              onChange={e => setSelectedCourse(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs font-medium text-slate-800 mb-4 outline-none cursor-pointer"
            >
              <option>Office Automation & Business Tools</option>
              <option>Graphic Designing & Canva Mastery</option>
              <option>Web Development & Logic Coding</option>
              <option>Digital Skills & Freelancing Course</option>
            </select>

            <label className="block text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1.5">Select Timing Batch</label>
            <select 
              value={selectedBatch} 
              onChange={e => setSelectedBatch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs font-medium text-slate-800 mb-6 outline-none cursor-pointer"
            >
              <option>Morning Batch (09:00 AM - 11:00 AM)</option>
              <option>Afternoon Batch (03:00 PM - 05:00 PM)</option>
              <option>Evening Batch (05:00 PM - 07:00 PM)</option>
            </select>

            <button 
              onClick={handleWhatsAppDirectBooking}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 rounded-xl shadow-md text-xs transition flex items-center justify-center gap-2"
            >
              💬 WhatsApp Instant Reservation
            </button>
          </div>
        </div>
      </div>

      {/* 5. Teachers Filter (Computer Department) */}
      <div id="comp-teachers" className="scroll-mt-32 mb-16">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900">Meet Our IT & Computer Teachers</h2>
            <p className="text-xs text-slate-500 mt-1">Our certified IT professionals provide complete step-by-step guidance.</p>
          </div>
          {isAdmin && (
            <button 
              onClick={() => setCurrentPage('teachers')}
              className="bg-amber-50 border border-amber-200 hover:bg-amber-100 text-amber-800 font-bold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1.5"
            >
              + Add Computer Teacher (Admin)
            </button>
          )}
        </div>

        {computerTeachers.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 text-slate-500 max-w-2xl mx-auto">
            <div className="text-4xl mb-3">💻</div>
            <h4 className="font-bold text-slate-800 text-sm mb-1">Computer Department Teachers</h4>
            <p className="text-xs text-slate-400 mb-5 max-w-sm mx-auto">Teachers listed under "Computer Class Section" or teaching Computer Science will appear here.</p>
            <button 
              onClick={() => setCurrentPage('teachers')}
              className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs px-5 py-2.5 rounded-xl transition"
            >
              View Academy's Full Faculty
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {computerTeachers.map(t => {
              const { qual, section } = parseTeacherQual(t.qual);
              const formattedDate = t.created_at ? new Date(t.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';
              return (
                <div key={t.id} className="bg-white rounded-2xl overflow-hidden shadow-md border border-slate-100 transition hover:-translate-y-1">
                  <img src={t.img} alt={t.name} className="w-full h-56 object-cover bg-slate-200" />
                  <div className="p-6">
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      <span className="bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide">{t.subject}</span>
                      {section && (
                        <span className="bg-purple-50 text-purple-600 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide">Sec: {section}</span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mt-2 mb-1">{t.name}</h3>
                    <p className="text-xs text-slate-500 mb-3">{qual}</p>
                    {formattedDate && (
                      <p className="text-[10px] text-slate-400 font-medium mb-4">📅 Joined: {formattedDate}</p>
                    )}
                    {isAdmin && handleDeleteTeacher && (
                      <button 
                        onClick={() => handleDeleteTeacher(t.id)} 
                        className="bg-red-50 text-red-600 hover:bg-red-100 font-semibold px-4 py-2 rounded-xl text-xs transition flex items-center gap-1.5 mt-2"
                      >
                        Delete Teacher
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 6. Active Online Lectures (Computer Section) */}
      <div id="comp-lectures" className="scroll-mt-32 mb-16">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 font-extrabold">Computer Online Lectures & Classes</h2>
            <p className="text-xs text-slate-500 mt-1">Access Zoom live streams, virtual video links, and recorded class materials.</p>
          </div>
          {isAdmin && (
            <button 
              onClick={() => setCurrentPage('online')}
              className="bg-amber-50 border border-amber-200 hover:bg-amber-100 text-amber-800 font-bold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1.5"
            >
              + Create Online Lesson (Admin)
            </button>
          )}
        </div>

        {/* ⚙️ ADMIN TIMING CONTROLS FOR LIVE CLASS */}
        {isAdmin && (
          <div className="bg-gradient-to-r from-amber-500/10 via-amber-600/5 to-transparent border border-amber-500/25 p-5 rounded-2xl mb-8 text-xs text-slate-800 max-w-2xl">
            <h4 className="font-extrabold text-amber-950 text-sm mb-2 flex items-center gap-1.5">
              ⚙️ Live Computer Class Timer (Admin Control)
            </h4>
            <p className="text-slate-600 mb-4 leading-relaxed">
              Set the exact timing when the Live Google Meet banner and card should turn **ON** and **OFF** automatically.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-700">Start Time:</span>
                <input 
                  type="time" 
                  value={liveStart} 
                  onChange={(e) => {
                    localStorage.setItem('tuition_comp_live_start', e.target.value);
                    setLiveStart(e.target.value);
                  }} 
                  className="bg-white p-2 rounded-lg border border-slate-300 font-extrabold text-slate-800 focus:ring-2 focus:ring-amber-500 outline-none transition" 
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-700">End Time:</span>
                <input 
                  type="time" 
                  value={liveEnd} 
                  onChange={(e) => {
                    localStorage.setItem('tuition_comp_live_end', e.target.value);
                    setLiveEnd(e.target.value);
                  }} 
                  className="bg-white p-2 rounded-lg border border-slate-300 font-extrabold text-slate-800 focus:ring-2 focus:ring-amber-500 outline-none transition" 
                />
              </div>
              <div className="text-[11px] text-amber-800 font-medium">
                Current status: {isLiveActive ? '🟢 Live Active Now' : '⚪ Currently Closed / Offline'}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Pinned Official Live Google Meet Class */}
          <div className={`rounded-3xl overflow-hidden shadow-lg border flex flex-col justify-between hover:shadow-2xl transition duration-300 relative group min-h-[380px] ${isLiveActive ? 'bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 border-rose-500/40' : 'bg-slate-900 border-slate-800 opacity-90'}`}>
            <div className="absolute top-4 right-4 z-20">
              {isLiveActive ? (
                <span className="bg-rose-600 animate-pulse text-white px-2.5 py-1 rounded-full text-[9px] font-black tracking-widest flex items-center gap-1 shadow-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                  LIVE NOW
                </span>
              ) : (
                <span className="bg-slate-700 text-slate-300 px-2.5 py-1 rounded-full text-[9px] font-black tracking-widest flex items-center gap-1 shadow-md">
                  ⚪ CLASS CLOSED
                </span>
              )}
            </div>
            
            {/* Top Banner with Computer Graphic Overlay */}
            <div className="p-6 relative overflow-hidden text-white h-48 flex flex-col justify-between" style={{ background: 'linear-gradient(to bottom right, #090d16, #1e1b4b, #111827)' }}>
              <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-all duration-500"></div>
              <div className="relative z-10">
                <span className="bg-white/10 backdrop-blur-md text-slate-300 border border-slate-700 px-2.5 py-1 rounded-full text-[10px] font-bold">
                  💻 Computer Class Wing
                </span>
              </div>
              <div className="relative z-10">
                <p className="text-slate-300 text-xs font-semibold">Instructor: MBA Academy IT Experts</p>
              </div>
            </div>

            {/* Body Content */}
            <div className="p-6 flex-1 flex flex-col justify-between bg-white text-slate-800">
              <div>
                <div className="mb-3">
                  <h3 className="text-lg font-extrabold text-slate-900 leading-snug">Daily Live Computer Class Lecture</h3>
                  {isLiveActive ? (
                    <span className="inline-block bg-rose-50 text-rose-700 border border-rose-100 px-2.5 py-0.5 rounded-md text-[10px] font-bold mt-1">
                      🟢 Status: Session is Active ({timeLeftStr})
                    </span>
                  ) : (
                    <span className="inline-block bg-slate-100 text-slate-600 border border-slate-200 px-2.5 py-0.5 rounded-md text-[10px] font-bold mt-1">
                      ⚪ Status: Class Offline ({timeLeftStr})
                    </span>
                  )}
                </div>
                
                <div className="space-y-1.5 mb-6 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <span>📅</span>
                    <span>Monday to Saturday</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>⏰</span>
                    <span>Timing: <b className="text-indigo-950 font-bold">{liveStart} to {liveEnd}</b> Daily</span>
                  </div>
                </div>
              </div>

              {isLiveActive ? (
                <a 
                  href="https://meet.google.com/nxu-xpbr-rkb" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="w-full bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-extrabold py-3.5 px-4 rounded-xl text-center text-xs transition flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Video size={14} className="animate-pulse" /> Join Live Computer Class (Google Meet)
                </a>
              ) : (
                <button 
                  disabled
                  className="w-full bg-slate-100 border border-slate-200 text-slate-400 font-bold py-3.5 px-4 rounded-xl text-center text-xs cursor-not-allowed flex items-center justify-center gap-1.5"
                >
                  <span>🔕</span> Class Inactive (Offline)
                </button>
              )}
            </div>
          </div>

          {/* Other computer classes from Database */}
          {computerClasses.map(c => {
            const { title, section } = parseOnlineTitle(c.title);
            return (
              <div key={c.id} className="bg-white rounded-3xl overflow-hidden shadow-md border border-slate-200 flex flex-col justify-between hover:shadow-xl transition duration-300">
                {/* Top Banner with Class Image */}
                <div className="p-6 relative overflow-hidden text-white h-48 flex flex-col justify-between" style={{ background: c.classImg ? `url(${c.classImg}) center/cover no-repeat` : 'linear-gradient(to bottom right, #0f172a, #1e1b4b, #172554)' }}>
                  {c.classImg && <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px]"></div>}
                  <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-blue-600/20 rounded-full blur-2xl pointer-events-none"></div>
                  
                  <div className="relative z-10 flex items-center justify-between w-full">
                    <span className="bg-red-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 shadow-md">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                      {c.isRecorded ? 'RECORDED' : 'LIVE'}
                    </span>
                    {section && (
                      <span className="bg-white/20 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[10px] font-bold">
                        {section}
                      </span>
                    )}
                  </div>
                  
                  <div className="relative z-10">
                    <p className="text-slate-300 text-xs font-semibold">{c.teacher}</p>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="mb-3">
                      <h3 className="text-lg font-extrabold text-slate-900 line-clamp-2">{title}</h3>
                      {section && (
                        <span className="inline-block bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md text-[10px] font-bold mt-1">Section: {section}</span>
                      )}
                    </div>
                    
                    <div className="space-y-1.5 mb-6 text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">📅</span>
                        <span>{c.date ? new Date(c.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : 'Today'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">⏰</span>
                        <span>{c.time}</span>
                      </div>
                    </div>
                  </div>

                  <a 
                    href={c.link} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl text-center text-xs transition flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Video size={14} /> Join Computer Lecture Link
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 7. Quick Admission Enquiry Form */}
      <div id="comp-enquiry" className="scroll-mt-32 bg-gradient-to-br from-indigo-900 to-indigo-950 text-white rounded-3xl p-6 md:p-12 shadow-xl border border-indigo-800">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6">
            <span className="text-indigo-300 font-bold text-xs uppercase tracking-widest bg-indigo-800/60 border border-indigo-700 px-3 py-1 rounded-full inline-block mb-3">Admission Inquiry</span>
            <h3 className="text-2xl md:text-3xl font-black text-white leading-tight mb-4">Start Your Digital Learning Journey Today!</h3>
            <p className="text-xs text-indigo-200 mb-6 leading-relaxed">
              Submit your basic detail below. Our team will verify your entry, coordinate with the instructors, and prepare your login portal and course manual. Submit now and receive a free demo pass!
            </p>

            {/* Guidance Support Image */}
            <div className="rounded-2xl overflow-hidden mb-6 border border-indigo-700 shadow-sm">
              <img 
                src="https://images.unsplash.com/photo-1531545514256-b1400bc00f31?q=80&w=600&auto=format&fit=crop" 
                alt="Guidance & Group Study" 
                className="w-full h-40 object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-indigo-800/50 rounded-lg text-indigo-300">
                  <Award size={18} />
                </div>
                <div>
                  <h5 className="font-bold text-sm text-white">Career Oriented Training</h5>
                  <p className="text-[11px] text-indigo-200">Prepare for computer tests, school practicals, or freelancing online.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-indigo-800/50 rounded-lg text-indigo-300">
                  <Clock size={18} />
                </div>
                <div>
                  <h5 className="font-bold text-sm text-white">Dedicated Support Hour</h5>
                  <p className="text-[11px] text-indigo-200">Extra lab timing provided for practical practice assignments.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            {!formSubmitted ? (
              <form onSubmit={handleEnquirySubmit} className="bg-white text-slate-950 p-6 md:p-8 rounded-2xl shadow-lg border border-indigo-100">
                <h4 className="font-extrabold text-slate-900 text-base mb-4">Computer Admission Inquiry</h4>
                
                <div className="space-y-3">
                  <input 
                    type="text" 
                    placeholder="Student Full Name *" 
                    value={studentName}
                    onChange={e => setStudentName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs outline-none focus:border-indigo-500 font-medium"
                    required
                  />
                  
                  <input 
                    type="tel" 
                    placeholder="WhatsApp Number (e.g. 03290275117) *" 
                    value={studentPhone}
                    onChange={e => setStudentPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs outline-none focus:border-indigo-500 font-medium"
                    required
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <input 
                      type="number" 
                      placeholder="Age (Optional)" 
                      value={studentAge}
                      onChange={e => setStudentAge(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs outline-none focus:border-indigo-500 font-medium"
                    />
                    <select
                      value={preferredBatch}
                      onChange={e => setPreferredBatch(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs outline-none cursor-pointer text-slate-700 font-medium"
                    >
                      <option>Morning (9 AM - 11 AM)</option>
                      <option>Afternoon (3 PM - 5 PM)</option>
                      <option>Evening (5 PM - 7 PM)</option>
                    </select>
                  </div>

                  <select
                    value={enquiryCourse}
                    onChange={e => setEnquiryCourse(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs outline-none cursor-pointer text-slate-700 font-medium"
                  >
                    <option>Office Automation</option>
                    <option>Graphic Designing (Canva Mastery)</option>
                    <option>Web Development & Coding</option>
                    <option>Freelancing & IT Skills</option>
                  </select>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-md text-xs mt-5 transition flex items-center justify-center gap-1.5"
                >
                  Submit Inquiry Form <ArrowRight size={14} />
                </button>
              </form>
            ) : (
              <div className="bg-white text-slate-900 p-8 rounded-2xl shadow-xl text-center border border-indigo-100 flex flex-col items-center">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-3xl mb-4">
                  ✓
                </div>
                <h4 className="font-extrabold text-slate-900 text-lg mb-1">Inquiry Submitted!</h4>
                <p className="text-xs text-slate-500 mb-6 max-w-xs mx-auto">We have logged your course interest. Click the button below to share directly on WhatsApp for immediate confirmation.</p>
                
                <div className="w-full space-y-3.5">
                  <button 
                    onClick={handleWhatsAppEnquiry}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 rounded-xl shadow-md text-xs transition flex items-center justify-center gap-1.5"
                  >
                    💬 Send Details to WhatsApp
                  </button>
                  <button 
                    onClick={() => {
                      setFormSubmitted(false);
                      setStudentName('');
                      setStudentPhone('');
                      setStudentAge('');
                    }}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3.5 rounded-xl text-xs transition"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
