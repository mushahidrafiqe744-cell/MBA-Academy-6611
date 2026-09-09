import React, { useState, useEffect, useMemo } from 'react';
import { 
  CreditCard, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  Plus, 
  Search, 
  Filter, 
  Printer, 
  Trash2, 
  Edit3, 
  TrendingUp, 
  Users, 
  AlertCircle,
  Download,
  Calendar,
  Sparkles,
  X,
  FileText,
  ShieldCheck,
  Check,
  Building2,
  Phone,
  ArrowUpDown
} from 'lucide-react';
import { FeeRecord } from '../types';

interface FeesManagementProps {
  isAdmin: boolean;
  onAdminLoginRequest?: () => void;
  enrolledStudents?: Array<{ id: number; cls: string; name: string; roll: string }>;
  admissionsList?: any[];
  academyLogo?: string;
  onNavigateHome?: () => void;
}

// Initial sample fee records so admin sees populated, realistic tuition data immediately
const INITIAL_FEE_RECORDS: FeeRecord[] = [
  {
    id: 'fee-1',
    receiptNo: 'MBA-FEE-2026-001',
    studentName: 'Muhammad Hamza',
    rollNo: '101',
    className: 'Class 10th',
    section: 'A',
    parentName: 'Tariq Mehmood',
    phone: '03001234567',
    month: 'March 2026',
    year: 2026,
    feeAmount: 3000,
    discount: 500,
    netAmount: 2500,
    status: 'paid',
    paidDate: '2026-03-02',
    paymentMethod: 'Cash',
    collectedBy: 'Admin',
    notes: 'Received on time with sibling concession',
    createdAt: '2026-03-01T10:00:00Z'
  },
  {
    id: 'fee-2',
    receiptNo: 'MBA-FEE-2026-002',
    studentName: 'Ayesha Bibi',
    rollNo: '102',
    className: 'Class 10th',
    section: 'A',
    parentName: 'Muhammad Rafique',
    phone: '03217654321',
    month: 'March 2026',
    year: 2026,
    feeAmount: 3000,
    discount: 0,
    netAmount: 3000,
    status: 'paid',
    paidDate: '2026-03-04',
    paymentMethod: 'JazzCash',
    collectedBy: 'Admin',
    notes: 'JazzCash Ref: #984210',
    createdAt: '2026-03-01T10:30:00Z'
  },
  {
    id: 'fee-3',
    receiptNo: 'MBA-FEE-2026-003',
    studentName: 'Ali Raza',
    rollNo: '205',
    className: 'Class 9th',
    section: 'B',
    parentName: 'Ghulam Rasool',
    phone: '03338901234',
    month: 'March 2026',
    year: 2026,
    feeAmount: 2500,
    discount: 0,
    netAmount: 2500,
    status: 'pending',
    notes: 'Promised by 10th March',
    createdAt: '2026-03-01T11:00:00Z'
  },
  {
    id: 'fee-4',
    receiptNo: 'MBA-FEE-2026-004',
    studentName: 'Zainab Fatima',
    rollNo: '301',
    className: '1st Year (FSc)',
    section: 'Pre-Medical',
    parentName: 'Dr. Sajid Khan',
    phone: '03124567890',
    month: 'March 2026',
    year: 2026,
    feeAmount: 3500,
    discount: 0,
    netAmount: 3500,
    status: 'paid',
    paidDate: '2026-03-03',
    paymentMethod: 'EasyPaisa',
    collectedBy: 'Admin',
    notes: 'Paid via EasyPaisa',
    createdAt: '2026-03-01T11:30:00Z'
  },
  {
    id: 'fee-5',
    receiptNo: 'MBA-FEE-2026-005',
    studentName: 'Usman Ali',
    rollNo: '304',
    className: '2nd Year (ICS)',
    section: 'Computer Science',
    parentName: 'Muhammad Akram',
    phone: '03456789012',
    month: 'March 2026',
    year: 2026,
    feeAmount: 3500,
    discount: 500,
    netAmount: 3000,
    status: 'pending',
    notes: 'Reminder sent to parent on WhatsApp',
    createdAt: '2026-03-01T12:00:00Z'
  },
  {
    id: 'fee-6',
    receiptNo: 'MBA-FEE-2026-006',
    studentName: 'Bilal Ahmad',
    rollNo: '401',
    className: 'Computer Class',
    section: 'Batch-1',
    parentName: 'Ahmad Din',
    phone: '03029876543',
    month: 'March 2026',
    year: 2026,
    feeAmount: 2000,
    discount: 0,
    netAmount: 2000,
    status: 'paid',
    paidDate: '2026-03-01',
    paymentMethod: 'Cash',
    collectedBy: 'Admin',
    notes: 'Course fee advance payment',
    createdAt: '2026-03-01T12:30:00Z'
  },
  {
    id: 'fee-7',
    receiptNo: 'MBA-FEE-2026-007',
    studentName: 'Fatima Noor',
    rollNo: '208',
    className: 'Class 9th',
    section: 'A',
    parentName: 'Naveed Akhtar',
    phone: '03221122334',
    month: 'February 2026',
    year: 2026,
    feeAmount: 2500,
    discount: 0,
    netAmount: 2500,
    status: 'paid',
    paidDate: '2026-02-05',
    paymentMethod: 'Cash',
    collectedBy: 'Admin',
    notes: 'February fee cleared',
    createdAt: '2026-02-01T09:00:00Z'
  }
];

const MONTH_OPTIONS = [
  'All Months',
  'March 2026',
  'February 2026',
  'January 2026',
  'April 2026',
  'May 2026',
  'June 2026'
];

const CLASS_OPTIONS = [
  'All Classes',
  'Class 9th',
  'Class 10th',
  '1st Year (FSc)',
  '2nd Year (FSc)',
  '1st Year (ICS)',
  '2nd Year (ICS)',
  'Computer Class',
  'English Language'
];

export const FeesManagement: React.FC<FeesManagementProps> = ({
  isAdmin,
  onAdminLoginRequest,
  enrolledStudents = [],
  admissionsList = [],
  academyLogo = '/logo.jpg',
  onNavigateHome
}) => {
  // Fee records state
  const [feeRecords, setFeeRecords] = useState<FeeRecord[]>(() => {
    try {
      const saved = localStorage.getItem('tuition_fees_records_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load fee records from storage:', e);
    }
    return INITIAL_FEE_RECORDS;
  });

  // Filters & Search
  const [selectedMonth, setSelectedMonth] = useState<string>('March 2026');
  const [selectedClass, setSelectedClass] = useState<string>('All Classes');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'paid' | 'pending'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<FeeRecord | null>(null);
  const [editingRecord, setEditingRecord] = useState<FeeRecord | null>(null);

  // Form state for adding/editing fee
  const [formData, setFormData] = useState<{
    studentName: string;
    rollNo: string;
    className: string;
    section: string;
    parentName: string;
    phone: string;
    month: string;
    feeAmount: number;
    discount: number;
    status: 'paid' | 'pending';
    paymentMethod: 'Cash' | 'JazzCash' | 'EasyPaisa' | 'Bank Transfer' | 'Online';
    paidDate: string;
    notes: string;
  }>({
    studentName: '',
    rollNo: '',
    className: 'Class 10th',
    section: 'A',
    parentName: '',
    phone: '',
    month: 'March 2026',
    feeAmount: 3000,
    discount: 0,
    status: 'paid',
    paymentMethod: 'Cash',
    paidDate: new Date().toISOString().split('T')[0],
    notes: ''
  });

  // Bulk generator state
  const [bulkMonth, setBulkMonth] = useState('March 2026');
  const [bulkAmount, setBulkAmount] = useState<number>(2500);
  const [bulkClass, setBulkClass] = useState('All');

  // Save to localStorage
  const saveRecords = (records: FeeRecord[]) => {
    setFeeRecords(records);
    localStorage.setItem('tuition_fees_records_v1', JSON.stringify(records));
  };

  // Filtered fee records
  const filteredRecords = useMemo(() => {
    return feeRecords.filter((record) => {
      // Month match
      if (selectedMonth !== 'All Months' && record.month !== selectedMonth) {
        return false;
      }
      // Class match
      if (selectedClass !== 'All Classes' && record.className !== selectedClass) {
        return false;
      }
      // Status match
      if (selectedStatus !== 'all' && record.status !== selectedStatus) {
        return false;
      }
      // Search query match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = record.studentName.toLowerCase().includes(q);
        const matchesRoll = record.rollNo.toLowerCase().includes(q);
        const matchesReceipt = record.receiptNo.toLowerCase().includes(q);
        const matchesPhone = record.phone ? record.phone.includes(q) : false;
        if (!matchesName && !matchesRoll && !matchesReceipt && !matchesPhone) {
          return false;
        }
      }
      return true;
    });
  }, [feeRecords, selectedMonth, selectedClass, selectedStatus, searchQuery]);

  // Financial Analytics calculation (based on selected month filter)
  const revenueSummary = useMemo(() => {
    const recordsForMonth = selectedMonth === 'All Months' 
      ? feeRecords 
      : feeRecords.filter(r => r.month === selectedMonth);

    const totalBilled = recordsForMonth.reduce((sum, r) => sum + r.netAmount, 0);
    const paidRecords = recordsForMonth.filter(r => r.status === 'paid');
    const pendingRecords = recordsForMonth.filter(r => r.status === 'pending');
    const totalCollected = paidRecords.reduce((sum, r) => sum + r.netAmount, 0);
    const totalPending = pendingRecords.reduce((sum, r) => sum + r.netAmount, 0);
    const totalDiscounts = recordsForMonth.reduce((sum, r) => sum + (r.discount || 0), 0);

    const collectionRate = totalBilled > 0 ? Math.round((totalCollected / totalBilled) * 100) : 0;

    return {
      totalBilled,
      totalCollected,
      totalPending,
      totalDiscounts,
      collectionRate,
      paidCount: paidRecords.length,
      pendingCount: pendingRecords.length,
      totalCount: recordsForMonth.length
    };
  }, [feeRecords, selectedMonth]);

  // Fast 1-Click Status Toggle (Paid <-> Pending)
  const handleToggleStatus = (recordId: string) => {
    const updated = feeRecords.map(r => {
      if (r.id === recordId) {
        const newStatus: 'paid' | 'pending' = r.status === 'paid' ? 'pending' : 'paid';
        return {
          ...r,
          status: newStatus,
          paidDate: newStatus === 'paid' ? (r.paidDate || new Date().toISOString().split('T')[0]) : undefined,
          paymentMethod: newStatus === 'paid' ? (r.paymentMethod || 'Cash') : undefined
        };
      }
      return r;
    });
    saveRecords(updated);
  };

  // Delete Record
  const handleDeleteRecord = (recordId: string, studentName: string) => {
    if (confirm(`Are you sure you want to delete the fee voucher for "${studentName}"?`)) {
      const updated = feeRecords.filter(r => r.id !== recordId);
      saveRecords(updated);
    }
  };

  // Open Edit Modal
  const handleStartEdit = (record: FeeRecord) => {
    setEditingRecord(record);
    setFormData({
      studentName: record.studentName,
      rollNo: record.rollNo,
      className: record.className,
      section: record.section || '',
      parentName: record.parentName || '',
      phone: record.phone || '',
      month: record.month,
      feeAmount: record.feeAmount,
      discount: record.discount || 0,
      status: record.status,
      paymentMethod: record.paymentMethod || 'Cash',
      paidDate: record.paidDate || new Date().toISOString().split('T')[0],
      notes: record.notes || ''
    });
    setIsAddModalOpen(true);
  };

  // Submit Add or Edit Form
  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentName.trim() || !formData.rollNo.trim()) {
      alert('Please fill in Student Name and Roll Number.');
      return;
    }

    const net = Math.max(0, Number(formData.feeAmount) - Number(formData.discount || 0));

    if (editingRecord) {
      // Update existing
      const updated = feeRecords.map(r => {
        if (r.id === editingRecord.id) {
          return {
            ...r,
            studentName: formData.studentName.trim(),
            rollNo: formData.rollNo.trim(),
            className: formData.className,
            section: formData.section.trim(),
            parentName: formData.parentName.trim(),
            phone: formData.phone.trim(),
            month: formData.month,
            feeAmount: Number(formData.feeAmount),
            discount: Number(formData.discount || 0),
            netAmount: net,
            status: formData.status,
            paymentMethod: formData.status === 'paid' ? formData.paymentMethod : undefined,
            paidDate: formData.status === 'paid' ? formData.paidDate : undefined,
            notes: formData.notes.trim()
          };
        }
        return r;
      });
      saveRecords(updated);
      setEditingRecord(null);
    } else {
      // Create new record
      const newRec: FeeRecord = {
        id: `fee-${Date.now()}`,
        receiptNo: `MBA-FEE-${new Date().getFullYear()}-${String(feeRecords.length + 1).padStart(3, '0')}`,
        studentName: formData.studentName.trim(),
        rollNo: formData.rollNo.trim(),
        className: formData.className,
        section: formData.section.trim(),
        parentName: formData.parentName.trim(),
        phone: formData.phone.trim(),
        month: formData.month,
        year: parseInt(formData.month.split(' ')[1]) || new Date().getFullYear(),
        feeAmount: Number(formData.feeAmount),
        discount: Number(formData.discount || 0),
        netAmount: net,
        status: formData.status,
        paymentMethod: formData.status === 'paid' ? formData.paymentMethod : undefined,
        paidDate: formData.status === 'paid' ? formData.paidDate : undefined,
        collectedBy: 'Admin',
        notes: formData.notes.trim(),
        createdAt: new Date().toISOString()
      };
      saveRecords([newRec, ...feeRecords]);
    }

    setIsAddModalOpen(false);
  };

  // Bulk Generator: Create Invoices for Enrolled Students
  const handleBulkGenerate = () => {
    // Combine students from attendance + admissions
    const studentMap = new Map<string, { name: string; roll: string; cls: string }>();

    enrolledStudents.forEach(st => {
      const key = `${st.cls}-${st.roll}`;
      if (!studentMap.has(key)) {
        studentMap.set(key, { name: st.name, roll: st.roll, cls: st.cls });
      }
    });

    admissionsList.forEach(adm => {
      const key = `${adm.className}-${adm.rollNo}`;
      if (!studentMap.has(key)) {
        studentMap.set(key, { name: adm.studentName, roll: adm.rollNo, cls: adm.className });
      }
    });

    let targetStudents = Array.from(studentMap.values());
    if (bulkClass !== 'All') {
      targetStudents = targetStudents.filter(s => s.cls === bulkClass);
    }

    if (targetStudents.length === 0) {
      alert(`No enrolled students found${bulkClass !== 'All' ? ` for ${bulkClass}` : ''}. You can add students via Admission or Attendance.`);
      return;
    }

    // Check existing records for target month to prevent duplicates
    const existingKeys = new Set(
      feeRecords
        .filter(r => r.month === bulkMonth)
        .map(r => `${r.className}-${r.rollNo}`)
    );

    const newInvoices: FeeRecord[] = [];
    let count = feeRecords.length;

    targetStudents.forEach(st => {
      const key = `${st.cls}-${st.roll}`;
      if (!existingKeys.has(key)) {
        count++;
        newInvoices.push({
          id: `fee-${Date.now()}-${st.roll}`,
          receiptNo: `MBA-FEE-${new Date().getFullYear()}-${String(count).padStart(3, '0')}`,
          studentName: st.name,
          rollNo: st.roll,
          className: st.cls,
          month: bulkMonth,
          year: parseInt(bulkMonth.split(' ')[1]) || new Date().getFullYear(),
          feeAmount: bulkAmount,
          discount: 0,
          netAmount: bulkAmount,
          status: 'pending',
          createdAt: new Date().toISOString()
        });
      }
    });

    if (newInvoices.length === 0) {
      alert(`All eligible students already have a fee voucher generated for ${bulkMonth}!`);
      return;
    }

    const updated = [...newInvoices, ...feeRecords];
    saveRecords(updated);
    setIsBulkModalOpen(false);
    setSelectedMonth(bulkMonth);
    alert(`Successfully generated ${newInvoices.length} monthly fee vouchers for ${bulkMonth}!`);
  };

  // Quick Auto-fill when selecting a student from enrolled list in Add Form
  const handleSelectEnrolledStudent = (studentStr: string) => {
    if (!studentStr) return;
    try {
      const parsed = JSON.parse(studentStr);
      setFormData(prev => ({
        ...prev,
        studentName: parsed.name || '',
        rollNo: parsed.roll || '',
        className: parsed.cls || prev.className
      }));
    } catch (e) {
      console.error(e);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Receipt No', 'Student Name', 'Roll No', 'Class', 'Month', 'Fee (PKR)', 'Discount (PKR)', 'Net Amount (PKR)', 'Status', 'Paid Date', 'Payment Method', 'Notes'];
    const rows = filteredRecords.map(r => [
      r.receiptNo,
      `"${r.studentName}"`,
      r.rollNo,
      `"${r.className}"`,
      r.month,
      r.feeAmount,
      r.discount,
      r.netAmount,
      r.status.toUpperCase(),
      r.paidDate || 'N/A',
      r.paymentMethod || 'N/A',
      `"${r.notes || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `MBA_Tuition_Fees_${selectedMonth.replace(' ', '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200 text-left">
      
      {/* HEADER BAR */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -left-10 -top-10 w-48 h-48 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
              <CreditCard size={14} />
              <span>Admin Finance & Tuition Fees</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              Student Monthly Tuition Fees
              <span className="text-emerald-400 text-sm font-semibold bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                PKR (Rs.)
              </span>
            </h1>
            <p className="text-emerald-100/80 text-xs md:text-sm mt-1 max-w-xl">
              Track student monthly fee collections, mark vouchers as Paid or Pending, print official receipts, and monitor total monthly revenue.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            {isAdmin && (
              <>
                <button
                  type="button"
                  onClick={() => setIsBulkModalOpen(true)}
                  className="bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 border border-emerald-600/50 px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                  title="Generate monthly fee vouchers for all enrolled students in 1 click"
                >
                  <Sparkles size={15} className="text-yellow-300" />
                  <span>⚡ Bulk Invoices</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setEditingRecord(null);
                    setFormData({
                      studentName: '',
                      rollNo: '',
                      className: 'Class 10th',
                      section: 'A',
                      parentName: '',
                      phone: '',
                      month: selectedMonth === 'All Months' ? 'March 2026' : selectedMonth,
                      feeAmount: 3000,
                      discount: 0,
                      status: 'paid',
                      paymentMethod: 'Cash',
                      paidDate: new Date().toISOString().split('T')[0],
                      notes: ''
                    });
                    setIsAddModalOpen(true);
                  }}
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-extrabold px-5 py-2.5 rounded-xl text-xs shadow-lg transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus size={16} className="stroke-[3]" />
                  <span>➕ Add Fee Voucher</span>
                </button>
              </>
            )}

            <button
              type="button"
              onClick={handleExportCSV}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-3.5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              title="Download CSV report"
            >
              <Download size={14} />
              <span>Export CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* REVENUE SUMMARY METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Collected / Monthly Revenue */}
        <div className="bg-gradient-to-br from-emerald-50 via-teal-50/50 to-white border border-emerald-200/80 rounded-2xl p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800">
              Total Monthly Revenue
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-base font-black shadow-xs">
              💰
            </div>
          </div>
          <div className="text-2xl md:text-3xl font-black text-emerald-950 font-mono tracking-tight">
            Rs. {revenueSummary.totalCollected.toLocaleString()}
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-emerald-700 font-medium pt-2 border-t border-emerald-100">
            <span className="flex items-center gap-1 font-bold">
              <CheckCircle2 size={13} className="text-emerald-600" />
              {revenueSummary.paidCount} Students Paid
            </span>
            <span className="bg-emerald-600 text-white px-2 py-0.5 rounded-full text-[10px] font-extrabold">
              {revenueSummary.collectionRate}% Collected
            </span>
          </div>
        </div>

        {/* Pending Unpaid Fees */}
        <div className="bg-gradient-to-br from-amber-50 via-orange-50/40 to-white border border-amber-200/80 rounded-2xl p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-800">
              Pending Tuition Fees
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center text-base font-black shadow-xs">
              ⏳
            </div>
          </div>
          <div className="text-2xl md:text-3xl font-black text-amber-950 font-mono tracking-tight">
            Rs. {revenueSummary.totalPending.toLocaleString()}
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-amber-700 font-medium pt-2 border-t border-amber-100">
            <span className="flex items-center gap-1 font-bold">
              <Clock size={13} className="text-amber-600" />
              {revenueSummary.pendingCount} Students Pending
            </span>
            <span className="text-[10px] text-amber-800 font-bold bg-amber-100 px-2 py-0.5 rounded-full">
              Requires Follow-up
            </span>
          </div>
        </div>

        {/* Total Billed / Expected Revenue */}
        <div className="bg-gradient-to-br from-blue-50 via-indigo-50/40 to-white border border-blue-200/80 rounded-2xl p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-800">
              Total Billed ({selectedMonth})
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center text-base font-black shadow-xs">
              📊
            </div>
          </div>
          <div className="text-2xl md:text-3xl font-black text-blue-950 font-mono tracking-tight">
            Rs. {revenueSummary.totalBilled.toLocaleString()}
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-blue-700 font-medium pt-2 border-t border-blue-100">
            <span>Total Vouchers: <b>{revenueSummary.totalCount}</b></span>
            {revenueSummary.totalDiscounts > 0 && (
              <span className="text-[10px] text-indigo-700 font-bold">
                Rs. {revenueSummary.totalDiscounts.toLocaleString()} Discounts
              </span>
            )}
          </div>
        </div>

        {/* Collection Efficiency */}
        <div className="bg-gradient-to-br from-purple-50 via-slate-50 to-white border border-purple-200/80 rounded-2xl p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-purple-800">
              Recovery Performance
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center text-base font-black shadow-xs">
              📈
            </div>
          </div>
          <div className="text-2xl md:text-3xl font-black text-purple-950 font-mono tracking-tight">
            {revenueSummary.collectionRate}%
          </div>
          {/* Progress bar */}
          <div className="w-full bg-purple-100 h-2 rounded-full overflow-hidden mt-3 mb-1">
            <div 
              className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-500" 
              style={{ width: `${Math.min(100, revenueSummary.collectionRate)}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold mt-1">
            <span>{revenueSummary.paidCount} Paid</span>
            <span>{revenueSummary.pendingCount} Pending</span>
          </div>
        </div>
      </div>

      {/* FILTER CONTROLS & SEARCH BAR */}
      <div className="bg-white rounded-2xl p-4 md:p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search student name, roll number, or receipt ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs md:text-sm bg-slate-50/50 focus:bg-white focus:border-emerald-500 outline-none transition"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
            >
              ✕
            </button>
          )}
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          
          {/* Month Selector */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs">
            <Calendar size={13} className="text-emerald-700" />
            <span className="font-bold text-slate-600">Month:</span>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent font-bold text-slate-900 outline-none cursor-pointer"
            >
              {MONTH_OPTIONS.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          {/* Class Selector */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs">
            <Users size={13} className="text-blue-700" />
            <span className="font-bold text-slate-600">Class:</span>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="bg-transparent font-bold text-slate-900 outline-none cursor-pointer"
            >
              {CLASS_OPTIONS.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Status Segmented Buttons */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <button
              type="button"
              onClick={() => setSelectedStatus('all')}
              className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${selectedStatus === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              All ({feeRecords.length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedStatus('paid')}
              className={`px-3 py-1 rounded-lg font-bold transition flex items-center gap-1 cursor-pointer ${selectedStatus === 'paid' ? 'bg-emerald-600 text-white shadow-xs' : 'text-emerald-700 hover:bg-emerald-50'}`}
            >
              <span>Paid</span>
              <span className="text-[10px] opacity-90">({feeRecords.filter(r => r.status === 'paid').length})</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedStatus('pending')}
              className={`px-3 py-1 rounded-lg font-bold transition flex items-center gap-1 cursor-pointer ${selectedStatus === 'pending' ? 'bg-amber-600 text-white shadow-xs' : 'text-amber-700 hover:bg-amber-50'}`}
            >
              <span>Pending</span>
              <span className="text-[10px] opacity-90">({feeRecords.filter(r => r.status === 'pending').length})</span>
            </button>
          </div>

        </div>
      </div>

      {/* FEES DATA TABLE */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        
        {/* Table Header Controls */}
        <div className="p-4 md:p-5 border-b border-slate-100 flex items-center justify-between flex-wrap gap-3 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-slate-900 text-base">
              Tuition Fee Vouchers ({filteredRecords.length})
            </h3>
            {selectedMonth !== 'All Months' && (
              <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full text-xs font-bold">
                {selectedMonth}
              </span>
            )}
          </div>

          <div className="text-xs text-slate-500 font-medium">
            💡 Click on status badge to quickly toggle <b className="text-emerald-700">Paid</b> or <b className="text-amber-700">Pending</b>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs md:text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                <th className="p-4">Receipt #</th>
                <th className="p-4">Student Info</th>
                <th className="p-4">Class & Sec</th>
                <th className="p-4">Month</th>
                <th className="p-4">Amount (PKR)</th>
                <th className="p-4 text-center">Status (Click to Toggle)</th>
                <th className="p-4">Payment Details</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-16 text-slate-500">
                    <div className="max-w-xs mx-auto">
                      <div className="text-4xl mb-2">📋</div>
                      <h4 className="font-bold text-slate-800 text-base">No Fee Records Found</h4>
                      <p className="text-xs text-slate-500 mt-1 mb-4">
                        No tuition vouchers match the current filters or search query.
                      </p>
                      {isAdmin && (
                        <button
                          type="button"
                          onClick={() => setIsAddModalOpen(true)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition"
                        >
                          ➕ Create First Voucher
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredRecords.map((record) => {
                  const isPaid = record.status === 'paid';
                  return (
                    <tr 
                      key={record.id} 
                      className={`hover:bg-slate-50/80 transition ${isPaid ? 'bg-white' : 'bg-amber-50/20'}`}
                    >
                      {/* Receipt No */}
                      <td className="p-4 font-mono font-bold text-slate-700 text-xs">
                        <span className="bg-slate-100 text-slate-800 px-2 py-1 rounded-md border border-slate-200">
                          {record.receiptNo}
                        </span>
                      </td>

                      {/* Student Info */}
                      <td className="p-4">
                        <div className="font-extrabold text-slate-950 text-sm">
                          {record.studentName}
                        </div>
                        <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                          <span>Roll: <b className="text-slate-800">{record.rollNo}</b></span>
                          {record.parentName && <span>• Parent: {record.parentName}</span>}
                        </div>
                      </td>

                      {/* Class */}
                      <td className="p-4">
                        <span className="bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded text-xs inline-block">
                          {record.className}
                        </span>
                        {record.section && (
                          <span className="block text-[11px] text-slate-500 mt-0.5 font-medium">
                            Sec: {record.section}
                          </span>
                        )}
                      </td>

                      {/* Month */}
                      <td className="p-4 font-semibold text-slate-800 whitespace-nowrap">
                        {record.month}
                      </td>

                      {/* Net Amount */}
                      <td className="p-4 font-mono">
                        <div className="font-extrabold text-slate-900 text-sm">
                          Rs. {record.netAmount.toLocaleString()}
                        </div>
                        {record.discount > 0 && (
                          <div className="text-[10px] text-emerald-600 font-medium">
                            Orig: Rs. {record.feeAmount} (-{record.discount})
                          </div>
                        )}
                      </td>

                      {/* 1-Click Status Toggle */}
                      <td className="p-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(record.id)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black shadow-2xs transition-all cursor-pointer select-none hover:scale-105 active:scale-95 ${
                            isPaid
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300'
                              : 'bg-amber-100 text-amber-900 hover:bg-amber-200 border border-amber-300 animate-pulse'
                          }`}
                          title={`Click to mark as ${isPaid ? 'Pending' : 'Paid'}`}
                        >
                          {isPaid ? (
                            <>
                              <CheckCircle2 size={14} className="text-emerald-600" />
                              <span>PAID ✅</span>
                            </>
                          ) : (
                            <>
                              <Clock size={14} className="text-amber-700" />
                              <span>PENDING ⏳</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Payment Details */}
                      <td className="p-4 text-xs text-slate-600">
                        {isPaid ? (
                          <div>
                            <div className="font-semibold text-slate-800 flex items-center gap-1">
                              <span>💳 {record.paymentMethod || 'Cash'}</span>
                            </div>
                            {record.paidDate && (
                              <div className="text-[11px] text-slate-500 mt-0.5">
                                Date: {record.paidDate}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-amber-700 text-xs italic">Awaiting Payment</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1">
                          {/* Print Receipt Slip */}
                          <button
                            type="button"
                            onClick={() => setSelectedReceipt(record)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                            title="Print Fee Receipt Slip"
                          >
                            <Printer size={16} />
                          </button>

                          {/* Edit */}
                          {isAdmin && (
                            <button
                              type="button"
                              onClick={() => handleStartEdit(record)}
                              className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                              title="Edit Voucher Details"
                            >
                              <Edit3 size={16} />
                            </button>
                          )}

                          {/* Delete */}
                          {isAdmin && (
                            <button
                              type="button"
                              onClick={() => handleDeleteRecord(record.id, record.studentName)}
                              className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                              title="Delete Voucher"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer Total */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs font-bold text-slate-700 gap-3">
          <div>
            Showing <b>{filteredRecords.length}</b> of <b>{feeRecords.length}</b> total vouchers
          </div>
          <div className="flex items-center gap-4 text-right">
            <span>
              Filtered Revenue: <b className="text-emerald-700 font-mono text-sm">
                Rs. {filteredRecords.filter(r => r.status === 'paid').reduce((s, r) => s + r.netAmount, 0).toLocaleString()}
              </b>
            </span>
            <span>
              Filtered Pending: <b className="text-amber-700 font-mono text-sm">
                Rs. {filteredRecords.filter(r => r.status === 'pending').reduce((s, r) => s + r.netAmount, 0).toLocaleString()}
              </b>
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL: ADD / EDIT FEE VOUCHER */}
      {/* ========================================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-lg">
                  {editingRecord ? '✏️' : '➕'}
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    {editingRecord ? 'Edit Fee Voucher' : 'Add New Tuition Fee Voucher'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {editingRecord ? `Voucher #${editingRecord.receiptNo}` : 'Generate monthly tuition fee receipt'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-sm transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-4">
              
              {/* Quick Select from Enrolled Students */}
              {!editingRecord && enrolledStudents.length > 0 && (
                <div className="bg-blue-50/70 border border-blue-200/80 p-3 rounded-2xl text-xs">
                  <label className="block font-bold text-blue-950 mb-1">
                    ⚡ Quick Select Enrolled Student:
                  </label>
                  <select
                    onChange={(e) => handleSelectEnrolledStudent(e.target.value)}
                    defaultValue=""
                    className="w-full p-2 bg-white rounded-xl border border-blue-200 text-xs font-semibold text-slate-800 outline-none"
                  >
                    <option value="">-- Choose from existing students --</option>
                    {enrolledStudents.map(st => (
                      <option key={st.id} value={JSON.stringify(st)}>
                        {st.name} (Roll: {st.roll} - {st.cls})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Student Name & Roll No */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Muhammad Hamza"
                    value={formData.studentName}
                    onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 outline-none bg-slate-50/50 focus:bg-white focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Roll No *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 101"
                    value={formData.rollNo}
                    onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 outline-none bg-slate-50/50 focus:bg-white focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Class & Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Class
                  </label>
                  <select
                    value={formData.className}
                    onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 outline-none bg-slate-50/50 focus:bg-white focus:border-emerald-500"
                  >
                    {CLASS_OPTIONS.filter(c => c !== 'All Classes').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Section / Group
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. A / Pre-Medical"
                    value={formData.section}
                    onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 outline-none bg-slate-50/50 focus:bg-white focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Parent & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Parent / Guardian Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Tariq Mehmood"
                    value={formData.parentName}
                    onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 outline-none bg-slate-50/50 focus:bg-white focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Phone / WhatsApp
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 03001234567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 outline-none bg-slate-50/50 focus:bg-white focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Month */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Tuition Fee Month *
                </label>
                <select
                  value={formData.month}
                  onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 outline-none bg-slate-50/50 focus:bg-white focus:border-emerald-500"
                >
                  {MONTH_OPTIONS.filter(m => m !== 'All Months').map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              {/* Fee Amount & Discount */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Fee Amount (PKR) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    required
                    value={formData.feeAmount}
                    onChange={(e) => setFormData({ ...formData, feeAmount: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 outline-none bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Discount / Scholarship (PKR)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 outline-none bg-white font-mono"
                  />
                </div>
                <div className="sm:col-span-2 pt-2 border-t border-slate-200 flex items-center justify-between text-xs font-bold text-slate-900">
                  <span>Net Payable Amount:</span>
                  <span className="text-emerald-700 font-mono text-base font-black">
                    Rs. {Math.max(0, formData.feeAmount - (formData.discount || 0)).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Payment Status & Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Payment Status *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className={`w-full p-2.5 rounded-xl border text-xs font-bold outline-none ${
                      formData.status === 'paid' 
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                        : 'bg-amber-50 text-amber-800 border-amber-300'
                    }`}
                  >
                    <option value="paid">✅ Paid</option>
                    <option value="pending">⏳ Pending</option>
                  </select>
                </div>

                {formData.status === 'paid' && (
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Payment Method
                    </label>
                    <select
                      value={formData.paymentMethod}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as any })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 outline-none bg-white"
                    >
                      <option value="Cash">💵 Cash</option>
                      <option value="JazzCash">📱 JazzCash</option>
                      <option value="EasyPaisa">📲 EasyPaisa</option>
                      <option value="Bank Transfer">🏦 Bank Transfer</option>
                      <option value="Online">🌐 Online</option>
                    </select>
                  </div>
                )}
              </div>

              {formData.status === 'paid' && (
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Payment Received Date
                  </label>
                  <input
                    type="date"
                    value={formData.paidDate}
                    onChange={(e) => setFormData({ ...formData, paidDate: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 outline-none bg-white"
                  />
                </div>
              )}

              {/* Notes */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Notes / Remarks
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sibling discount applied / JazzCash Tx ID"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 outline-none bg-white"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-6 py-2.5 rounded-xl text-xs shadow-md transition cursor-pointer flex items-center gap-1.5"
                >
                  <Check size={16} />
                  <span>{editingRecord ? 'Update Voucher' : 'Save Fee Voucher'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: BULK INVOICE GENERATOR */}
      {/* ========================================================================= */}
      {isBulkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative">
            
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center text-lg">
                  ⚡
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    Bulk Generate Fee Invoices
                  </h3>
                  <p className="text-xs text-slate-500">
                    Auto-generate monthly vouchers for all enrolled students
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsBulkModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-sm transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <p className="text-slate-600 leading-relaxed">
                This will automatically create a <b>Pending</b> fee voucher for all students enrolled in our academy for the selected month.
              </p>

              <div>
                <label className="block font-bold text-slate-700 uppercase text-[11px] mb-1">
                  Select Month
                </label>
                <select
                  value={bulkMonth}
                  onChange={(e) => setBulkMonth(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-bold text-slate-900 bg-slate-50"
                >
                  {MONTH_OPTIONS.filter(m => m !== 'All Months').map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase text-[11px] mb-1">
                  Target Class
                </label>
                <select
                  value={bulkClass}
                  onChange={(e) => setBulkClass(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-bold text-slate-900 bg-slate-50"
                >
                  <option value="All">All Classes ({enrolledStudents.length} Students)</option>
                  {CLASS_OPTIONS.filter(c => c !== 'All Classes').map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase text-[11px] mb-1">
                  Standard Tuition Fee (PKR)
                </label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={bulkAmount}
                  onChange={(e) => setBulkAmount(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-bold text-slate-900 font-mono bg-slate-50"
                />
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-[11px] flex items-start gap-2">
                <AlertCircle size={15} className="shrink-0 mt-0.5" />
                <span>
                  Students who already have a voucher for <b>{bulkMonth}</b> will not be duplicated.
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsBulkModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleBulkGenerate}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-5 py-2.5 rounded-xl shadow-md transition cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles size={14} />
                  <span>Generate Invoices Now</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: PRINTABLE OFFICIAL FEE RECEIPT VOUCHER SLIP */}
      {/* ========================================================================= */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl border border-slate-200 relative max-h-[95vh] overflow-y-auto">
            
            {/* Top Close & Print Controls */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200 print:hidden">
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-emerald-600" />
                <span className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">
                  Official Tuition Fee Voucher
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-1.5 rounded-xl text-xs transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Printer size={14} />
                  <span>Print Slip</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedReceipt(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-sm transition cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* PRINTABLE RECEIPT CARD CONTENT */}
            <div id="printable-receipt" className="border-2 border-slate-900/80 rounded-2xl p-6 bg-gradient-to-b from-white to-slate-50/50 relative">
              
              {/* PAID / PENDING STAMP WATERMARK */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none rotate-[-20deg] opacity-15">
                <div className={`text-6xl font-black border-8 px-6 py-2 uppercase tracking-widest ${selectedReceipt.status === 'paid' ? 'text-emerald-700 border-emerald-700' : 'text-amber-700 border-amber-700'}`}>
                  {selectedReceipt.status === 'paid' ? 'PAID' : 'PENDING'}
                </div>
              </div>

              {/* ACADEMY HEADER */}
              <div className="text-center pb-4 border-b-2 border-dashed border-slate-300">
                <div className="flex items-center justify-center gap-3 mb-1">
                  <img 
                    src={academyLogo} 
                    alt="MBA Academy Logo" 
                    className="w-12 h-12 rounded-xl object-contain border border-slate-200 shadow-xs"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div>
                    <h2 className="text-xl font-black tracking-tight text-slate-950 uppercase">
                      MBA Tuition Academy
                    </h2>
                    <p className="text-[11px] font-bold text-emerald-800 tracking-wider uppercase">
                      Excellence In Quality Education
                    </p>
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 font-medium">
                  Main Campus • Contact: 0329-0275117 • WhatsApp Enabled
                </p>
                <div className="mt-2 inline-block bg-slate-900 text-white text-[10px] font-mono font-bold px-3 py-0.5 rounded-full">
                  MONTHLY TUITION FEE RECEIPT
                </div>
              </div>

              {/* VOUCHER DETAILS GRID */}
              <div className="py-4 grid grid-cols-2 gap-3 text-xs border-b-2 border-dashed border-slate-300">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Receipt No:</span>
                  <span className="font-mono font-black text-slate-900">{selectedReceipt.receiptNo}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Billing Month:</span>
                  <span className="font-bold text-emerald-800">{selectedReceipt.month}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Student Name:</span>
                  <span className="font-extrabold text-slate-900 text-sm">{selectedReceipt.studentName}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Roll Number:</span>
                  <span className="font-bold text-slate-900 font-mono">{selectedReceipt.rollNo}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Class & Section:</span>
                  <span className="font-semibold text-slate-800">{selectedReceipt.className} {selectedReceipt.section ? `(${selectedReceipt.section})` : ''}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Parent Name:</span>
                  <span className="font-semibold text-slate-800">{selectedReceipt.parentName || 'N/A'}</span>
                </div>
              </div>

              {/* FEE BREAKDOWN TABLE */}
              <div className="py-4 border-b-2 border-dashed border-slate-300">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-[10px] uppercase font-bold text-slate-500 border-b border-slate-200">
                      <th className="py-1 text-left">Description</th>
                      <th className="py-1 text-right">Amount (PKR)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="py-1.5 font-medium text-slate-800">Monthly Tuition Coaching Fee</td>
                      <td className="py-1.5 text-right font-mono font-bold text-slate-900">Rs. {selectedReceipt.feeAmount.toLocaleString()}</td>
                    </tr>
                    {selectedReceipt.discount > 0 && (
                      <tr className="text-emerald-700">
                        <td className="py-1.5 font-medium">Scholarship / Concession</td>
                        <td className="py-1.5 text-right font-mono font-bold">- Rs. {selectedReceipt.discount.toLocaleString()}</td>
                      </tr>
                    )}
                    <tr className="font-black text-sm border-t-2 border-slate-900 pt-2 text-slate-950">
                      <td className="py-2">Net Payable / Received</td>
                      <td className="py-2 text-right font-mono text-base text-emerald-800">
                        Rs. {selectedReceipt.netAmount.toLocaleString()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* STATUS & PAYMENT FOOTER */}
              <div className="pt-4 flex items-center justify-between text-xs">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Payment Status:</div>
                  <div className={`font-black text-xs inline-flex items-center gap-1 mt-0.5 px-2 py-0.5 rounded ${selectedReceipt.status === 'paid' ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'}`}>
                    {selectedReceipt.status === 'paid' ? 'PAID IN FULL ✅' : 'PAYMENT PENDING ⏳'}
                  </div>
                  {selectedReceipt.paymentMethod && (
                    <div className="text-[10px] text-slate-500 mt-1">
                      Method: {selectedReceipt.paymentMethod} {selectedReceipt.paidDate ? `• Date: ${selectedReceipt.paidDate}` : ''}
                    </div>
                  )}
                </div>

                <div className="text-center">
                  <div className="h-8 border-b border-slate-400 w-28 mx-auto mb-1"></div>
                  <div className="text-[10px] font-bold text-slate-600 uppercase">
                    Authorized Sign / Stamp
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-2 border-t border-slate-200 text-center text-[9px] text-slate-400 font-medium">
                Thank you for choosing MBA Tuition Academy • Computer generated verified receipt
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default FeesManagement;
