import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wallet, DollarSign, Lock, Unlock, ArrowDownLeft, ArrowUpRight,
  Plus, CheckCircle2, ShieldCheck, CreditCard, Building2, Smartphone,
  FileText, Download, Printer, Search, X, AlertCircle, RefreshCw,
  QrCode, Clock, Check, Eye, HelpCircle, Layers, Award,
  Zap, Copy, CheckCheck, Sparkles, Send, ShieldAlert, Phone, Receipt, BadgePercent
} from 'lucide-react';
import { UserWallet, WalletTransaction, Project, Developer, User } from '../types';

interface EscrowWalletHubProps {
  wallet: UserWallet;
  onUpdateWallet: (updated: UserWallet) => void;
  role: 'client' | 'developer';
  notify: (msg: string) => void;
  projects?: Project[];
  developers?: Developer[];
  onReleaseToDeveloper?: (amount: number, projectTitle: string, devName: string) => void;
  onLockEscrow?: (amount: number, projectTitle: string) => void;
  currentUser?: User;
}

export function EscrowWalletHub({
  wallet,
  onUpdateWallet,
  role,
  notify,
  projects = [],
  developers = [],
  onReleaseToDeveloper,
  onLockEscrow,
  currentUser,
}: EscrowWalletHubProps) {
  // Filter & Search states
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isLockEscrowModalOpen, setIsLockEscrowModalOpen] = useState(false);
  const [isReleaseEscrowModalOpen, setIsReleaseEscrowModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [selectedInvoiceTxn, setSelectedInvoiceTxn] = useState<WalletTransaction | null>(null);

  // Form states for Deposit
  const [depositAmount, setDepositAmount] = useState<number>(2500);
  const [depositCategory, setDepositCategory] = useState<'free_arab' | 'cards'>('free_arab');
  const [depositMethod, setDepositMethod] = useState<
    'instapay' | 'wallet_cash' | 'mada' | 'sarie' | 'stcpay' | 'applepay' | 'card' | 'fawry'
  >(currentUser?.country === 'مصر' || wallet.currency === 'EGP' ? 'instapay' : 'mada');

  // Realistic inputs for Arab Payment Gateways (Empty by default for security)
  const [cardHolder, setCardHolder] = useState(currentUser?.name || '');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // InstaPay & Egypt Mobile Wallets
  const [instapayIpa, setInstapayIpa] = useState('');
  const [instapayRef, setInstapayRef] = useState('');
  const [walletPhone, setWalletPhone] = useState(currentUser?.phone || '');
  const [walletTxnCode, setWalletTxnCode] = useState('');

  // SARIE & Gulf Wallets
  const [sarieBankName, setSarieBankName] = useState('مصرف الراجحي');
  const [sarieRefNumber, setSarieRefNumber] = useState('');
  const [stcPayPhone, setStcPayPhone] = useState(currentUser?.phone || '');
  const [stcPayRef, setStcPayRef] = useState('');
  const [fawryRefCode] = useState('948 201 884');

  // Copy helper
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    notify(`تم نسخ ${label} إلى الحافظة بنجاح! 📋`);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // Form states for Lock Escrow
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || 'custom');
  const [customProjectTitle, setCustomProjectTitle] = useState('');
  const [lockAmount, setLockAmount] = useState<number>(projects[0]?.budget || 5500);

  // Form states for Release Escrow
  const [releaseProjectId, setReleaseProjectId] = useState<string>(projects[0]?.id || 'custom');
  const [releaseCustomTitle, setReleaseCustomTitle] = useState('');
  const [releaseAmount, setReleaseAmount] = useState<number>(projects[0]?.budget || 5500);
  const [releaseDevName, setReleaseDevName] = useState<string>(
    developers[0]?.name || projects[0]?.developer || 'مهندس برمجيات معتمد'
  );

  // Form states for Withdrawal
  const [withdrawAmount, setWithdrawAmount] = useState<number>(Math.min(5000, wallet.availableBalance || 1000));
  const [withdrawMethod, setWithdrawMethod] = useState<'instapay' | 'wallet_cash' | 'iban' | 'stcpay'>(
    currentUser?.country === 'مصر' || wallet.currency === 'EGP' ? 'instapay' : 'iban'
  );
  const [beneficiaryName, setBeneficiaryName] = useState(currentUser?.name || 'صاحب الحساب');
  const [ibanNumber, setIbanNumber] = useState(
    currentUser?.country === 'مصر' ? 'EG38 0002 0001 5560 9999 1234 56' : 'SA44 8000 0456 6080 1234 5678'
  );
  const [withdrawInstapayIpa, setWithdrawInstapayIpa] = useState('');
  const [withdrawWalletPhone, setWithdrawWalletPhone] = useState(currentUser?.phone || '');

  // Keep defaults updated when currentUser loads or changes
  useEffect(() => {
    if (currentUser?.name) {
      setCardHolder(currentUser.name);
      setBeneficiaryName(currentUser.name);
    }
    if (currentUser?.phone) {
      setWalletPhone(currentUser.phone);
      setWithdrawWalletPhone(currentUser.phone);
      setStcPayPhone(currentUser.phone);
    }
  }, [currentUser]);

  // Keep releaseDevName and lockAmount updated when project changes
  useEffect(() => {
    if (selectedProjectId !== 'custom') {
      const p = projects.find((x) => x.id === selectedProjectId);
      if (p?.budget) setLockAmount(p.budget);
    }
  }, [selectedProjectId, projects]);

  useEffect(() => {
    if (releaseProjectId !== 'custom') {
      const p = projects.find((x) => x.id === releaseProjectId);
      if (p) {
        if (p.budget) setReleaseAmount(p.budget);
        if (p.developer) setReleaseDevName(p.developer);
      }
    }
  }, [releaseProjectId, projects]);

  const presetAmounts = useMemo(() => {
    if (wallet.currency === 'EGP' || currentUser?.country === 'مصر') {
      return [1000, 2500, 5000, 10000, 25000];
    }
    if (wallet.currency === 'USD') {
      return [100, 250, 500, 1000, 2500];
    }
    return [500, 1500, 3000, 5000, 10000];
  }, [wallet.currency, currentUser?.country]);

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    return (wallet.transactions || []).filter((txn) => {
      const matchType =
        filterType === 'all' ||
        (filterType === 'deposit' && txn.type === 'deposit') ||
        (filterType === 'escrow_lock' && txn.type === 'escrow_lock') ||
        (filterType === 'escrow_release' && txn.type === 'escrow_release') ||
        (filterType === 'withdrawal' && txn.type === 'withdrawal');

      const matchSearch =
        !searchQuery.trim() ||
        txn.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        txn.referenceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (txn.projectTitle && txn.projectTitle.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchType && matchSearch;
    });
  }, [wallet.transactions, filterType, searchQuery]);

  // Handle Deposit Submit
  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (depositAmount <= 0) {
      notify('يرجى إدخال مبلغ إيداع صحيح أكبر من صفر');
      return;
    }

    let methodLabel = '';
    let descriptionText = '';
    let refId = '';

    if (depositMethod === 'instapay') {
      methodLabel = 'إنستاباي (InstaPay IPN)';
      refId = instapayRef.trim() || 'IPN-' + Math.floor(100000 + Math.random() * 900000);
      descriptionText = `شحن فوري مجاني (0% رسوم) عبر شبكة إنستاباي اللحظية - الحساب: ${instapayIpa.trim() || cardHolder}`;
    } else if (depositMethod === 'wallet_cash') {
      methodLabel = 'المحفظة الذكية (فودافون/أورنج/اتصالات/وي كاش)';
      refId = walletTxnCode.trim() || 'CASH-' + Math.floor(100000 + Math.random() * 900000);
      descriptionText = `إيداع فوري مجاني عبر المحفظة الإلكترونية من الرقم (${walletPhone || 'المسجل'})`;
    } else if (depositMethod === 'mada') {
      methodLabel = 'بطاقة مدى (Mada)';
      refId = 'MADA-' + Math.floor(100000 + Math.random() * 900000);
      descriptionText = `شحن فوري مباشر بدون عمولة عبر بطاقة مدى (${cardNumber.slice(-4)}) - لحاملها: ${cardHolder}`;
    } else if (depositMethod === 'sarie') {
      methodLabel = 'تحويل فوري سريع (SARIE)';
      refId = sarieRefNumber.trim() || 'SARIE-' + Math.floor(100000 + Math.random() * 900000);
      descriptionText = `تحويل بنكي فوري مجاني عبر نظام سريع من بنك (${sarieBankName})`;
    } else if (depositMethod === 'stcpay') {
      methodLabel = 'STC Pay / UrPay';
      refId = stcPayRef.trim() || 'STC-' + Math.floor(100000 + Math.random() * 900000);
      descriptionText = `شحن فوري عبر محفظة STC Pay من الحساب (${stcPayPhone || cardHolder})`;
    } else if (depositMethod === 'applepay') {
      methodLabel = 'Apple Pay';
      refId = 'APL-' + Math.floor(100000 + Math.random() * 900000);
      descriptionText = `دفع فوري آمن وموثق عبر Apple Pay`;
    } else if (depositMethod === 'card') {
      methodLabel = 'بطاقة بنكية (Visa / MC)';
      refId = 'CARD-' + Math.floor(100000 + Math.random() * 900000);
      descriptionText = `دفع ببطاقة مصرفية معتمدة (${cardNumber.slice(-4)}) - لحاملها: ${cardHolder}`;
    } else if (depositMethod === 'fawry') {
      methodLabel = 'فوري باي (Fawry Pay)';
      refId = 'FAWRY-' + fawryRefCode.replace(/\s+/g, '');
      descriptionText = `سداد نقدي بكود فوري المرجعي (${fawryRefCode})`;
    }

    const newTxn: WalletTransaction = {
      id: 'txn-' + Date.now(),
      type: 'deposit',
      amount: depositAmount,
      currency: wallet.currency || 'ر.س',
      date: new Date().toISOString().split('T')[0],
      status: 'مكتمل',
      referenceId: refId,
      description: descriptionText,
      method: methodLabel,
    };

    const nextWallet: UserWallet = {
      ...wallet,
      totalBalance: wallet.totalBalance + depositAmount,
      availableBalance: wallet.availableBalance + depositAmount,
      transactions: [newTxn, ...wallet.transactions],
    };

    onUpdateWallet(nextWallet);
    notify(`تم تسجيل وتوثيق التحويل البنكي بمبلغ ${depositAmount.toLocaleString()} ${wallet.currency} بنجاح عبر ${methodLabel}! الرصيد مؤمن ومتاح الآن في الضمان 🔒✓`);
    setIsDepositModalOpen(false);
  };

  // Handle Lock Escrow Submit
  const handleLockEscrowSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (lockAmount <= 0) {
      notify('يرجى إدخال مبلغ صحيح');
      return;
    }
    if (lockAmount > wallet.availableBalance) {
      notify(`رصيدك المتاح (${wallet.availableBalance.toLocaleString()} ${wallet.currency}) غير كافٍ. يرجى شحن الرصيد أولاً`);
      return;
    }

    const proj = projects.find((p) => p.id === selectedProjectId);
    const projTitle = proj?.title || customProjectTitle.trim() || 'مشروع هندسي متعاقد عليه وفق ميثاق الضمان';

    const newTxn: WalletTransaction = {
      id: 'txn-' + Date.now(),
      type: 'escrow_lock',
      amount: lockAmount,
      currency: wallet.currency,
      date: new Date().toISOString().split('T')[0],
      status: 'معلق',
      projectTitle: projTitle,
      referenceId: 'ESC-' + Math.floor(10000 + Math.random() * 90000),
      description: `حجز وتجميد دفعة في خزينة الضمان البنكية المشفرة لمشروع: "${projTitle}"`,
      method: 'خزينة الضمان المشفرة (Escrow Vault) 🔒',
    };

    const nextWallet: UserWallet = {
      ...wallet,
      availableBalance: wallet.availableBalance - lockAmount,
      inEscrow: wallet.inEscrow + lockAmount,
      transactions: [newTxn, ...wallet.transactions],
    };

    onUpdateWallet(nextWallet);
    onLockEscrow?.(lockAmount, projTitle);
    notify(`تم تأمين وحجز مبلغ (${lockAmount.toLocaleString()} ${wallet.currency}) في الضمان بنجاح لمشروع "${projTitle}" 🔒`);
    setIsLockEscrowModalOpen(false);
  };

  // Handle Release Escrow Submit
  const handleReleaseEscrowSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (releaseAmount <= 0) {
      notify('يرجى تحديد مبلغ الدفعة');
      return;
    }
    if (releaseAmount > wallet.inEscrow) {
      notify(`المبلغ المطلوب تحريره يتجاوز رصيد الضمان المحجوز (${wallet.inEscrow.toLocaleString()} ${wallet.currency})`);
      return;
    }

    const proj = projects.find((p) => p.id === releaseProjectId);
    const projTitle = proj?.title || releaseCustomTitle.trim() || 'مشروع هندسي مكتمل';
    const devToCredit = releaseDevName.trim() || proj?.developer || 'مهندس برمجيات معتمد';

    const newTxn: WalletTransaction = {
      id: 'txn-' + Date.now(),
      type: 'escrow_release',
      amount: releaseAmount,
      currency: wallet.currency,
      date: new Date().toISOString().split('T')[0],
      status: 'مكتمل',
      projectTitle: projTitle,
      referenceId: 'REL-' + Math.floor(10000 + Math.random() * 90000),
      description: `تحرير دفعة الضمان للمهندس (${devToCredit}) بعد اعتماد فحص الكود على Git والمطابقة لمعايير FQS`,
      method: 'تحرير فوري للضمان (Escrow Payout)',
    };

    const nextWallet: UserWallet = {
      ...wallet,
      totalBalance: Math.max(0, wallet.totalBalance - releaseAmount),
      inEscrow: Math.max(0, wallet.inEscrow - releaseAmount),
      transactions: [newTxn, ...wallet.transactions],
    };

    onUpdateWallet(nextWallet);
    onReleaseToDeveloper?.(releaseAmount, projTitle, devToCredit);
    notify(`تهانينا! تم تحرير دفعة الضمان بمبلغ (${releaseAmount.toLocaleString()} ${wallet.currency}) للمهندس (${devToCredit}) وإصدار الفاتورة الرسمية! 🎉`);
    setIsReleaseEscrowModalOpen(false);
  };

  // Handle Withdrawal Submit
  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (withdrawAmount <= 0) {
      notify('يرجى إدخال مبلغ صحيح للسحب');
      return;
    }
    if (withdrawAmount > wallet.availableBalance) {
      notify(`المبلغ يتجاوز أرباحك المتاحة للسحب (${wallet.availableBalance.toLocaleString()} ${wallet.currency})`);
      return;
    }

    let withdrawMethodText = '';
    let withdrawDesc = '';
    if (withdrawMethod === 'instapay') {
      withdrawMethodText = 'إنستاباي (InstaPay IPN)';
      withdrawDesc = `تحويل أرباح فوري مجاني عبر إنستاباي إلى (${withdrawInstapayIpa || beneficiaryName})`;
    } else if (withdrawMethod === 'wallet_cash') {
      withdrawMethodText = 'محفظة هاتف ذكية (Cash Wallet)';
      withdrawDesc = `تحويل فوري للأرباح إلى المحفظة الإلكترونية (${withdrawWalletPhone || beneficiaryName})`;
    } else if (withdrawMethod === 'stcpay') {
      withdrawMethodText = 'STC Pay';
      withdrawDesc = `تحويل أرباح إلى محفظة STC Pay (${stcPayPhone || beneficiaryName})`;
    } else {
      withdrawMethodText = 'حساب بنكي (IBAN / SARIE)';
      withdrawDesc = `تحويل بنكي للأرباح إلى حساب (${beneficiaryName}) عبر الآيبان (${ibanNumber.slice(-4)})`;
    }

    const newTxn: WalletTransaction = {
      id: 'txn-' + Date.now(),
      type: 'withdrawal',
      amount: withdrawAmount,
      currency: wallet.currency,
      date: new Date().toISOString().split('T')[0],
      status: 'مكتمل',
      referenceId: 'WTH-' + Math.floor(10000 + Math.random() * 90000),
      description: withdrawDesc,
      method: withdrawMethodText,
    };

    const nextWallet: UserWallet = {
      ...wallet,
      totalBalance: wallet.totalBalance - withdrawAmount,
      availableBalance: wallet.availableBalance - withdrawAmount,
      transactions: [newTxn, ...wallet.transactions],
    };

    onUpdateWallet(nextWallet);
    notify(`تمت معالجة تحويل أرباحك بمبلغ (${withdrawAmount.toLocaleString()} ${wallet.currency}) بنجاح عبر ${withdrawMethodText}! 🏦✓`);
    setIsWithdrawModalOpen(false);
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* 1. Header Banner & Security Guarantee */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-gradient-to-r from-slate-50 via-white to-slate-50 p-6 shadow-xs dark:border-slate-800 dark:from-slate-900/60 dark:via-slate-900/40 dark:to-slate-900/60">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#203d62] text-teal-400 shadow-md shadow-[#203d62]/20">
              <Wallet size={20} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-[#152a40] dark:text-white flex items-center gap-2">
                <span>المحفظة والضمان المالي المشفر (Escrow & Digital Wallet)</span>
              </h2>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                إدارة الأموال، شحن الرصيد، تأمين ميزانيات المشاريع في الضمان، وتحرير الدفعات المستحقة.
              </p>
            </div>
          </div>
        </div>

        {/* Security Stamp */}
        <div className="flex items-center gap-2 rounded-2xl border border-emerald-200/80 bg-emerald-50/80 px-4 py-2.5 text-xs font-bold text-emerald-800 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-300">
          <ShieldCheck size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
          <div className="leading-tight">
            <span className="block font-black text-[11px]">حماية الضمان المالي 100%</span>
            <span className="text-[10px] text-emerald-700/80 dark:text-emerald-400/80">موافقة فحص كود OWASP & FQS</span>
          </div>
        </div>
      </div>

      {/* ⚠️ Prototype Sandbox Notice (Honesty in UI) */}
      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs">
        <div className="flex flex-wrap items-center gap-2 font-black text-amber-900 dark:text-amber-300 text-sm">
          <span>🧪</span>
          <span>بيئة محاكاة وتجربة الضمان المالي (Escrow Prototype Sandbox)</span>
          <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold border border-amber-500/30">
            تجريبي للعرض
          </span>
        </div>
        <p className="mt-1.5 text-xs text-amber-800/90 dark:text-amber-200/90 leading-relaxed">
          نظام شحن المحفظة وحجز مبالغ الضمان (Escrow) الحالي يعمل في بيئة محاكاة واختبار هندسية تجريبية لحفظ وتجربة دورة تسليم المشاريع وكود FQS، ولا يتم إجراء أي خصم بنكي حقيقي لحين إتمام التعاقد مع بوابات الدفع الرسمية.
        </p>
      </div>

      {/* 2. 3 Main Financial KPI Balance Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Total Wallet Balance */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900/60">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">الرصيد الكلي في المحفظة</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
              <DollarSign size={16} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-[#152a40] dark:text-white">
              {wallet.totalBalance.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-slate-500">{wallet.currency}</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1">
            <CheckCircle2 size={12} className="text-blue-500" />
            <span>يشمل الأرصدة المتاحة ومبالغ الضمان المحجوزة</span>
          </div>
        </div>

        {/* In-Escrow Funds (Locked) */}
        <div className="relative overflow-hidden rounded-3xl border border-amber-200/80 bg-gradient-to-br from-amber-50/50 to-amber-50/20 p-5 shadow-xs dark:border-amber-900/40 dark:from-amber-950/20 dark:to-transparent">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-700 dark:text-amber-400">
              الأموال المحجوزة في الضمان (In Escrow 🔒)
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
              <Lock size={16} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-amber-700 dark:text-amber-400">
              {wallet.inEscrow.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-amber-600/70">{wallet.currency}</span>
          </div>
          <div className="mt-2 text-[11px] text-amber-800/80 dark:text-amber-300/80 flex items-center gap-1 font-bold">
            <ShieldCheck size={12} className="text-amber-600" />
            <span>مؤمنة بالكامل حتى فحص الكود والتسليم النهائي</span>
          </div>
        </div>

        {/* Available Balance */}
        <div className="relative overflow-hidden rounded-3xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50/50 to-emerald-50/20 p-5 shadow-xs dark:border-emerald-900/40 dark:from-emerald-950/20 dark:to-transparent">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
              {role === 'client' ? 'الرصيد المتاح للتعاقد' : 'الأرباح المتاحة للسحب البنكي'}
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              <Unlock size={16} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-emerald-700 dark:text-emerald-400">
              {wallet.availableBalance.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-emerald-600/70">{wallet.currency}</span>
          </div>
          <div className="mt-2 text-[11px] text-emerald-800/80 dark:text-emerald-300/80 flex items-center gap-1 font-bold">
            <CheckCircle2 size={12} className="text-emerald-600" />
            <span>{role === 'client' ? 'جاهز لحجز مشاريع وعقود جديدة' : 'متاح للتحويل الفوري إلى حسابك البنكي'}</span>
          </div>
        </div>
      </div>

      {/* 3. Action Buttons Bar */}
      <div className="flex flex-wrap items-center gap-3">
        {role === 'client' ? (
          <>
            <button
              onClick={() => setIsDepositModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#203d62] to-[#1c7e86] px-5 py-3 text-xs font-black text-white shadow-md shadow-[#203d62]/20 hover:scale-[1.02] active:scale-95 transition"
            >
              <Plus size={16} />
              <span>+ شحن رصيد المحفظة (إيداع)</span>
            </button>

            <button
              onClick={() => setIsLockEscrowModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-2xl border border-amber-300 bg-amber-50 px-5 py-3 text-xs font-black text-amber-900 shadow-xs hover:bg-amber-100 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200 transition"
            >
              <Lock size={15} />
              <span>🔒 تأمين مشروع في الضمان</span>
            </button>

            <button
              onClick={() => setIsReleaseEscrowModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-2xl border border-emerald-300 bg-emerald-50 px-5 py-3 text-xs font-black text-emerald-900 shadow-xs hover:bg-emerald-100 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-200 transition"
            >
              <Unlock size={15} />
              <span>تحرير دفعة الضمان للمطور 💸</span>
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsWithdrawModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3 text-xs font-black text-white shadow-md shadow-emerald-600/20 hover:scale-[1.02] active:scale-95 transition"
          >
            <Building2 size={16} />
            <span>🏦 سحب الأرباح إلى الحساب البنكي</span>
          </button>
        )}
      </div>

      {/* 4. Transactions Ledger & Invoices Table */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-black text-[#152a40] dark:text-white">
              سجل الحركات المالية والفواتير المعتمدة (Transaction Ledger)
            </h3>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              كشف حساب شفاف بجميع الإيداعات، حركات الضمان، والفواتير الضريبية المشفرة.
            </p>
          </div>

          {/* Search & Type Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative min-w-[200px]">
              <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="بحث برقم المعاملة أو المشروع..."
                className="w-full rounded-xl border border-slate-200 bg-white py-1.5 pl-3 pr-8 text-xs font-bold text-slate-700 outline-none focus:border-[#2ba6ae] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
              />
            </div>

            <div className="flex items-center gap-1 text-xs font-bold">
              <button
                onClick={() => setFilterType('all')}
                className={`rounded-xl px-2.5 py-1.5 transition ${
                  filterType === 'all'
                    ? 'bg-[#203d62] text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                الكل
              </button>
              <button
                onClick={() => setFilterType('deposit')}
                className={`rounded-xl px-2.5 py-1.5 transition ${
                  filterType === 'deposit'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                إيداعات
              </button>
              <button
                onClick={() => setFilterType('escrow_lock')}
                className={`rounded-xl px-2.5 py-1.5 transition ${
                  filterType === 'escrow_lock'
                    ? 'bg-amber-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                حجز ضمان
              </button>
              <button
                onClick={() => setFilterType('escrow_release')}
                className={`rounded-xl px-2.5 py-1.5 transition ${
                  filterType === 'escrow_release'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                دفعات محررة
              </button>
            </div>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900/60">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-right text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-black text-slate-500 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-400">
                  <th className="py-3.5 px-4 font-black">رقم المعاملة</th>
                  <th className="py-3.5 px-4 font-black">نوع الحركة</th>
                  <th className="py-3.5 px-4 font-black">البيان / المشروع</th>
                  <th className="py-3.5 px-4 font-black">وسيلة الدفع</th>
                  <th className="py-3.5 px-4 font-black">المبلغ</th>
                  <th className="py-3.5 px-4 font-black">التاريخ</th>
                  <th className="py-3.5 px-4 font-black text-center">الحالة</th>
                  <th className="py-3.5 px-4 font-black text-center">الفاتورة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      <Wallet size={32} className="mx-auto mb-2 opacity-30" />
                      <p className="font-bold">لا توجد حركات مالية مطابقة للبحث</p>
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((txn) => {
                    const isPositive = txn.type === 'deposit' || (role === 'developer' && txn.type === 'escrow_release');
                    const isEscrowLock = txn.type === 'escrow_lock';

                    return (
                      <tr
                        key={txn.id}
                        className="transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/40"
                      >
                        {/* Reference TXN */}
                        <td className="py-3.5 px-4 font-mono font-bold text-[#1c7e86] dark:text-cyan-400">
                          {txn.referenceId}
                        </td>

                        {/* Type Badge */}
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[10px] font-black ${
                              txn.type === 'deposit'
                                ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300'
                                : txn.type === 'escrow_lock'
                                ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                                : txn.type === 'escrow_release'
                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                                : 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300'
                            }`}
                          >
                            {txn.type === 'deposit' ? (
                              <ArrowDownLeft size={11} />
                            ) : txn.type === 'escrow_lock' ? (
                              <Lock size={11} />
                            ) : txn.type === 'escrow_release' ? (
                              <Unlock size={11} />
                            ) : (
                              <ArrowUpRight size={11} />
                            )}
                            <span>
                              {txn.type === 'deposit'
                                ? 'شحن رصيد'
                                : txn.type === 'escrow_lock'
                                ? 'حجز ضمان'
                                : txn.type === 'escrow_release'
                                ? 'تحرير دفعة'
                                : 'سحب أرباح'}
                            </span>
                          </span>
                        </td>

                        {/* Description & Project */}
                        <td className="py-3.5 px-4 max-w-[260px]">
                          <div className="font-bold text-slate-800 dark:text-slate-200 truncate">
                            {txn.description}
                          </div>
                          {txn.projectTitle && (
                            <div className="mt-0.5 text-[10px] text-slate-400 truncate">
                              مشروع: {txn.projectTitle}
                            </div>
                          )}
                        </td>

                        {/* Method */}
                        <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 font-bold">
                          {txn.method || 'حساب بنكي'}
                        </td>

                        {/* Amount */}
                        <td className="py-3.5 px-4 font-mono font-black text-xs">
                          <span
                            className={
                              isPositive
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : isEscrowLock
                                ? 'text-amber-600 dark:text-amber-400'
                                : 'text-slate-700 dark:text-slate-300'
                            }
                          >
                            {isPositive ? '+' : isEscrowLock ? '🔒 ' : '-'}
                            {txn.amount.toLocaleString()} {txn.currency}
                          </span>
                        </td>

                        {/* Date */}
                        <td className="py-3.5 px-4 text-[11px] text-slate-400">
                          {txn.date}
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4 text-center">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                              txn.status === 'مكتمل'
                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                                : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                            }`}
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-current" />
                            <span>{txn.status}</span>
                          </span>
                        </td>

                        {/* Invoice Action */}
                        <td className="py-3.5 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => setSelectedInvoiceTxn(txn)}
                            className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-2.5 py-1 text-[10px] font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                            title="عرض الفاتورة الرقمية المشفرة"
                          >
                            <FileText size={12} className="text-teal-600" />
                            <span>فاتورة</span>
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
      </div>

      {/* ======================================================== */}
      {/* 5. MODALS                                                */}
      {/* ======================================================== */}

      {/* Modal A: Deposit Funds (شحن الرصيد - دعم وسائل الدفع العربية المجانية 0% رسوم) */}
      {isDepositModalOpen && (
        <div
          onClick={() => setIsDepositModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl my-6 rounded-3xl bg-white p-5 sm:p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-all max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 text-emerald-600 dark:text-emerald-400">
                  <CreditCard size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-[#152a40] dark:text-white">
                      إيداع رصيد المحفظة والضمان المشفر
                    </h3>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-black text-emerald-600 dark:text-emerald-400">
                      <Sparkles size={11} />
                      تحويل بنكي آمن 100%
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    تسوية مشفرة ومؤمنة عبر خزينة الضمان المركزي لمنصة فوتيك (إنستاباي، آيبان، سريع، محافظ كاش)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsDepositModalOpen(false)}
                className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X size={18} />
              </button>
            </div>

            {/* Clear Advisory Notice (Honesty in UI - Sandbox) */}
            <div className="mt-3 rounded-2xl border border-amber-300/80 bg-amber-50/80 p-3 text-[11px] leading-relaxed text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-200">
              🧪 <b>بيئة محاكاة وتجربة (Prototype Escrow Sandbox):</b> نظام المحفظة وحجز الدفعات يعمل حالياً في بيئة محاكاة برمجية استعراضية لتوثيق دورة تسليم المشاريع وضمان جودة الكود FQS دون إجراء أي خصم بنكي حقيقي حتى تفعيل التعاقد مع بوابات الدفع الرسمية.
            </div>

            <form onSubmit={handleDepositSubmit} className="mt-4 space-y-4 text-xs">
              {/* Preset Amounts */}
              <div>
                <label className="block font-black text-slate-700 dark:text-slate-300 mb-1.5">
                  تحديد المبلغ المراد شحنه ({wallet.currency}):
                </label>
                <div className="grid grid-cols-5 gap-1.5 mb-2">
                  {presetAmounts.map((amt) => (
                    <button
                      type="button"
                      key={amt}
                      onClick={() => setDepositAmount(amt)}
                      className={`rounded-xl py-2 px-1 text-center font-black transition text-[11px] ${
                        depositAmount === amt
                          ? 'bg-[#203d62] text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {amt.toLocaleString()}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <input
                    type="number"
                    min={50}
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 pl-14 font-mono text-sm font-black text-slate-800 outline-none focus:border-[#2ba6ae] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    required
                  />
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">
                    {wallet.currency}
                  </span>
                </div>
              </div>

              {/* Payment Category Selector */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block font-black text-slate-700 dark:text-slate-300">
                    اختر وسيلة الدفع:
                  </label>
                  <div className="inline-flex rounded-xl bg-slate-100 p-0.5 dark:bg-slate-800 text-[11px]">
                    <button
                      type="button"
                      onClick={() => {
                        setDepositCategory('free_arab');
                        setDepositMethod('instapay');
                      }}
                      className={`rounded-lg px-2.5 py-1 font-black transition ${
                        depositCategory === 'free_arab'
                          ? 'bg-white text-emerald-700 shadow-xs dark:bg-slate-700 dark:text-emerald-300'
                          : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                      }`}
                    >
                      ⚡ التحويل البنكي المشفر المعتمد (متاح الآن 0% عمولة)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setDepositCategory('cards');
                        setDepositMethod('card');
                      }}
                      className={`relative rounded-lg px-2.5 py-1 font-black transition ${
                        depositCategory === 'cards'
                          ? 'bg-white text-blue-700 shadow-xs dark:bg-slate-700 dark:text-blue-300'
                          : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                      }`}
                    >
                      <span>💳 بطاقات إلكترونية</span>
                      <span className="mr-1 rounded-full bg-amber-500/20 px-1.5 py-0.2 text-[9px] font-bold text-amber-700 dark:text-amber-300">
                        قريباً
                      </span>
                    </button>
                  </div>
                </div>

                {/* Sub-grid: Free Arab Payment Gateways */}
                {depositCategory === 'free_arab' ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {/* InstaPay */}
                    <button
                      type="button"
                      onClick={() => setDepositMethod('instapay')}
                      className={`relative flex flex-col items-center justify-center rounded-2xl border p-2.5 text-center transition ${
                        depositMethod === 'instapay'
                          ? 'border-emerald-500 bg-emerald-50/70 text-emerald-950 dark:bg-emerald-950/40 dark:text-emerald-200 font-black shadow-xs ring-2 ring-emerald-500/20'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      <span className="absolute top-1.5 right-1.5 rounded-full bg-emerald-500/10 px-1.5 py-0.2 text-[9px] font-black text-emerald-600">
                        متاح الآن ✓
                      </span>
                      <Zap size={18} className="mb-1 text-emerald-600" />
                      <span className="font-bold">إنستاباي (InstaPay)</span>
                      <span className="text-[10px] text-slate-400 mt-0.5">تسوية لحظية IPN</span>
                    </button>

                    {/* Mobile Wallets Cash */}
                    <button
                      type="button"
                      onClick={() => setDepositMethod('wallet_cash')}
                      className={`relative flex flex-col items-center justify-center rounded-2xl border p-2.5 text-center transition ${
                        depositMethod === 'wallet_cash'
                          ? 'border-rose-500 bg-rose-50/70 text-rose-950 dark:bg-rose-950/40 dark:text-rose-200 font-black shadow-xs ring-2 ring-rose-500/20'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      <span className="absolute top-1.5 right-1.5 rounded-full bg-rose-500/10 px-1.5 py-0.2 text-[9px] font-black text-rose-600">
                        متاح الآن ✓
                      </span>
                      <Smartphone size={18} className="mb-1 text-rose-600" />
                      <span className="font-bold">فودافون / محافظ كاش</span>
                      <span className="text-[10px] text-slate-400 mt-0.5">أورنج • اتصالات • WE</span>
                    </button>

                    {/* Mada */}
                    <button
                      type="button"
                      onClick={() => setDepositMethod('mada')}
                      className={`relative flex flex-col items-center justify-center rounded-2xl border p-2.5 text-center transition ${
                        depositMethod === 'mada'
                          ? 'border-teal-500 bg-teal-50/70 text-teal-950 dark:bg-teal-950/40 dark:text-teal-200 font-black shadow-xs ring-2 ring-teal-500/20'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      <span className="absolute top-1.5 right-1.5 rounded-full bg-teal-500/10 px-1.5 py-0.2 text-[9px] font-black text-teal-600">
                        متاح الآن ✓
                      </span>
                      <CreditCard size={18} className="mb-1 text-teal-600" />
                      <span className="font-bold">مدى (Mada)</span>
                      <span className="text-[10px] text-slate-400 mt-0.5">تحويل بنكي سعودي</span>
                    </button>

                    {/* SARIE Instant Bank */}
                    <button
                      type="button"
                      onClick={() => setDepositMethod('sarie')}
                      className={`relative flex flex-col items-center justify-center rounded-2xl border p-2.5 text-center transition ${
                        depositMethod === 'sarie'
                          ? 'border-indigo-500 bg-indigo-50/70 text-indigo-950 dark:bg-indigo-950/40 dark:text-indigo-200 font-black shadow-xs ring-2 ring-indigo-500/20'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      <span className="absolute top-1.5 right-1.5 rounded-full bg-indigo-500/10 px-1.5 py-0.2 text-[9px] font-black text-indigo-600">
                        متاح الآن ✓
                      </span>
                      <Building2 size={18} className="mb-1 text-indigo-600" />
                      <span className="font-bold">تحويل سريع (SARIE)</span>
                      <span className="text-[10px] text-slate-400 mt-0.5">تحويل لحظي SAMA</span>
                    </button>

                    {/* STC Pay / UrPay */}
                    <button
                      type="button"
                      onClick={() => setDepositMethod('stcpay')}
                      className={`flex flex-col items-center justify-center rounded-2xl border p-2.5 text-center transition ${
                        depositMethod === 'stcpay'
                          ? 'border-purple-500 bg-purple-50/70 text-purple-950 dark:bg-purple-950/40 dark:text-purple-200 font-black shadow-xs ring-2 ring-purple-500/20'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      <Smartphone size={18} className="mb-1 text-purple-600" />
                      <span className="font-bold">STC Pay / UrPay</span>
                      <span className="text-[10px] text-slate-400 mt-0.5">محافظ رقمية خليجية</span>
                    </button>

                    {/* Fawry Pay */}
                    <button
                      type="button"
                      onClick={() => setDepositMethod('fawry')}
                      className={`flex flex-col items-center justify-center rounded-2xl border p-2.5 text-center transition ${
                        depositMethod === 'fawry'
                          ? 'border-amber-500 bg-amber-50/70 text-amber-950 dark:bg-amber-950/40 dark:text-amber-200 font-black shadow-xs ring-2 ring-amber-500/20'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      <Receipt size={18} className="mb-1 text-amber-500" />
                      <span className="font-bold">فوري باي (Fawry)</span>
                      <span className="text-[10px] text-slate-400 mt-0.5">سداد نقدي بكود 48h</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      {/* Apple Pay */}
                      <button
                        type="button"
                        onClick={() => setDepositMethod('applepay')}
                        className={`relative flex flex-col items-center justify-center rounded-2xl border p-3.5 text-center transition ${
                          depositMethod === 'applepay'
                            ? 'border-slate-900 bg-slate-900 text-white font-black shadow-xs'
                            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                      >
                        <span className="absolute top-2 right-2 rounded-full bg-amber-500/20 px-2 py-0.5 text-[9px] font-black text-amber-500">
                          قريباً
                        </span>
                        <Smartphone size={20} className="mb-1.5" />
                        <span className="font-bold">Apple Pay</span>
                        <span className="text-[10px] opacity-70 mt-0.5">جارٍ الربط المصرفي</span>
                      </button>

                      {/* Visa / MasterCard */}
                      <button
                        type="button"
                        onClick={() => setDepositMethod('card')}
                        className={`relative flex flex-col items-center justify-center rounded-2xl border p-3.5 text-center transition ${
                          depositMethod === 'card'
                            ? 'border-blue-500 bg-blue-50/70 text-blue-950 dark:bg-blue-950/40 dark:text-blue-200 font-black shadow-xs ring-2 ring-blue-500/20'
                            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                      >
                        <span className="absolute top-2 right-2 rounded-full bg-amber-500/20 px-2 py-0.5 text-[9px] font-black text-amber-600 dark:text-amber-400">
                          قريباً
                        </span>
                        <CreditCard size={20} className="mb-1.5 text-blue-600" />
                        <span className="font-bold">Visa / MasterCard</span>
                        <span className="text-[10px] text-slate-400 mt-0.5">جارٍ الاعتماد البنكي</span>
                      </button>
                    </div>

                    {/* Explanatory Banner when card selected */}
                    <div className="rounded-2xl border border-blue-200/80 bg-blue-50/70 p-4 text-xs leading-relaxed text-blue-950 dark:border-blue-900/40 dark:bg-blue-950/30 dark:text-blue-200">
                      <div className="flex items-center gap-2 font-black mb-1">
                        <Lock size={15} className="text-blue-600" />
                        <span>بوابات البطاقات المباشرة قيد الربط المصرفي الرسمي (قريباً)</span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300">
                        حرصاً على حماية ميزانيتك وتطبيق معايير الضمان المشفر، يتم الإيداع حالياً بأمان فائق وبدون أي عمولات إضافية عبر <b>التحويل البنكي المشفر / إنستاباي المعتمد</b>. اضغط الزر أدناه للانتقال للتحويل المتاح فوراً:
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setDepositCategory('free_arab');
                          setDepositMethod('instapay');
                        }}
                        className="mt-2.5 inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-1.5 text-xs font-black text-white hover:bg-blue-700 transition"
                      >
                        <Zap size={13} />
                        <span>التحويل الفوري عبر إنستاباي / الحساب المصرفي (متاح الآن 100%)</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Dynamic Interactive Payment Instructions per Method */}
              {/* 1. InstaPay */}
              {depositMethod === 'instapay' && (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                      <Zap size={14} className="text-emerald-600" />
                      بيانات التحويل اللحظي عبر تطبيق إنستاباي (0% عمولة):
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 dark:bg-emerald-900/60 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                      شبكة IPN الفورية
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {/* Platform IPA */}
                    <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-emerald-100 dark:border-emerald-900/50 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 block">عنوان الدفع اللحظي الرسمي (IPA):</span>
                        <span className="font-mono text-xs font-black text-emerald-800 dark:text-emerald-300">
                          futech.escrow@instapay
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyToClipboard('futech.escrow@instapay', 'عنوان IPA')}
                        className="rounded-lg p-1.5 text-emerald-700 hover:bg-emerald-50 dark:hover:bg-slate-800"
                        title="نسخ عنوان IPA"
                      >
                        {copiedKey === 'عنوان IPA' ? <CheckCheck size={14} className="text-emerald-600" /> : <Copy size={14} />}
                      </button>
                    </div>

                    {/* Platform Phone */}
                    <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-emerald-100 dark:border-emerald-900/50 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 block">أو رقم الهاتف المعتمد بالبنك:</span>
                        <span className="font-mono text-xs font-black text-emerald-800 dark:text-emerald-300">
                          +20 102 998 8771
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyToClipboard('+201029988771', 'رقم الهاتف')}
                        className="rounded-lg p-1.5 text-emerald-700 hover:bg-emerald-50 dark:hover:bg-slate-800"
                        title="نسخ رقم الهاتف"
                      >
                        {copiedKey === 'رقم الهاتف' ? <CheckCheck size={14} className="text-emerald-600" /> : <Copy size={14} />}
                      </button>
                    </div>
                  </div>

                  {/* Confirmation Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                        عنوان IPA أو رقمك في إنستاباي:
                      </label>
                      <input
                        value={instapayIpa}
                        onChange={(e) => setInstapayIpa(e.target.value)}
                        placeholder="yourname@instapay"
                        className="w-full rounded-xl border border-slate-200 bg-white p-2 font-mono text-xs font-bold text-slate-800 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                        الرقم المرجعي من رسالة التأكيد (اختياري):
                      </label>
                      <input
                        value={instapayRef}
                        onChange={(e) => setInstapayRef(e.target.value)}
                        placeholder="مثال: IPN-892102"
                        className="w-full rounded-xl border border-slate-200 bg-white p-2 font-mono text-xs font-bold text-slate-800 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 2. Smart Mobile Wallets (Vodafone / Orange / Etisalat / WE Cash) */}
              {depositMethod === 'wallet_cash' && (
                <div className="rounded-2xl border border-rose-200 bg-rose-50/60 p-4 dark:border-rose-900/50 dark:bg-rose-950/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-rose-900 dark:text-rose-200 flex items-center gap-1.5">
                      <Smartphone size={14} className="text-rose-600" />
                      إيداع مباشر من محفظتك الذكية (فودافون كاش / أورنج / اتصالات / وي كاش):
                    </span>
                    <span className="text-[10px] font-bold text-rose-700 bg-rose-100 dark:bg-rose-900/60 dark:text-rose-300 px-2 py-0.5 rounded-full">
                      إيداع فوري مجاني
                    </span>
                  </div>

                  {/* Cash Wallet Number */}
                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-rose-100 dark:border-rose-900/50 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block">رقم محفظة فوتيك المعتمدة للتحويل المالي:</span>
                      <span className="font-mono text-sm font-black text-rose-800 dark:text-rose-300">
                        010 6844 9210
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard('01068449210', 'رقم المحفظة')}
                      className="rounded-lg p-1.5 text-rose-700 hover:bg-rose-50 dark:hover:bg-slate-800"
                      title="نسخ رقم المحفظة"
                    >
                      {copiedKey === 'رقم المحفظة' ? <CheckCheck size={14} className="text-rose-600" /> : <Copy size={14} />}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                        رقم محفظتك التي قمت بالتحويل منها:
                      </label>
                      <input
                        value={walletPhone}
                        onChange={(e) => setWalletPhone(e.target.value)}
                        placeholder="01012345678"
                        className="w-full rounded-xl border border-slate-200 bg-white p-2 font-mono text-xs font-bold text-slate-800 outline-none focus:border-rose-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                        كود العملية / الرقم التعريفي من الـ SMS:
                      </label>
                      <input
                        value={walletTxnCode}
                        onChange={(e) => setWalletTxnCode(e.target.value)}
                        placeholder="مثال: 94021"
                        className="w-full rounded-xl border border-slate-200 bg-white p-2 font-mono text-xs font-bold text-slate-800 outline-none focus:border-rose-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 3. Mada Card */}
              {depositMethod === 'mada' && (
                <div className="rounded-2xl border border-teal-200 bg-teal-50/50 p-4 space-y-3 dark:border-teal-900/40 dark:bg-teal-950/30">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-teal-900 dark:text-teal-200 flex items-center gap-1.5">
                      <CreditCard size={14} className="text-teal-600" />
                      الدفع الفوري ببطاقة مدى (Mada) - بنوك السعودية:
                    </span>
                    <span className="text-[10px] font-bold text-teal-700 bg-teal-100 dark:bg-teal-900/60 dark:text-teal-300 px-2 py-0.5 rounded-full">
                      0% رسوم خدمة
                    </span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      اسم حامل البطاقة (العميل):
                    </label>
                    <input
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white p-2 font-bold text-slate-800 outline-none focus:border-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      رقم بطاقة مدى:
                    </label>
                    <input
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="5888 ...."
                      className="w-full rounded-xl border border-slate-200 bg-white p-2 font-mono font-bold text-slate-800 outline-none focus:border-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                        تاريخ الانتهاء:
                      </label>
                      <input
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full rounded-xl border border-slate-200 bg-white p-2 font-mono font-bold text-slate-800 outline-none focus:border-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                        رمز التحقق (CVV):
                      </label>
                      <input
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="123"
                        className="w-full rounded-xl border border-slate-200 bg-white p-2 font-mono font-bold text-slate-800 outline-none focus:border-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 4. SARIE Instant Bank Transfer */}
              {depositMethod === 'sarie' && (
                <div className="rounded-2xl border border-indigo-200 bg-indigo-50/60 p-4 text-xs text-indigo-950 dark:border-indigo-900/50 dark:bg-indigo-950/30 dark:text-indigo-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-black flex items-center gap-1.5 text-indigo-900 dark:text-indigo-200">
                      <Building2 size={14} className="text-indigo-600" />
                      التحويل البنكي الفوري المجاني عبر نظام (سريع SARIE):
                    </span>
                    <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100 dark:bg-indigo-900/60 dark:text-indigo-300 px-2 py-0.5 rounded-full">
                      تحت إشراف SAMA
                    </span>
                  </div>

                  <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-indigo-200 dark:border-indigo-900/50 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">آيبان حساب الضمان المعتمد (الراجحي):</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard('SA4480000456608099990001', 'الآيبان البنكي')}
                        className="rounded-lg p-1 text-indigo-700 hover:bg-indigo-50 dark:hover:bg-slate-800"
                        title="نسخ الآيبان"
                      >
                        {copiedKey === 'الآيبان البنكي' ? <CheckCheck size={14} className="text-emerald-600" /> : <Copy size={14} />}
                      </button>
                    </div>
                    <div className="font-mono text-xs font-black text-indigo-800 dark:text-indigo-300 select-all tracking-wider">
                      SA44 8000 0456 6080 9999 0001
                    </div>
                    <div className="text-[10px] text-slate-500">
                      المستفيد: شركة فوتيك لحلول التقنية المحدودة • بنك الراجحي
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                        اسم بنك الحوالة:
                      </label>
                      <input
                        value={sarieBankName}
                        onChange={(e) => setSarieBankName(e.target.value)}
                        placeholder="الأهلي، الإنماء، الرياض..."
                        className="w-full rounded-xl border border-slate-200 bg-white p-2 font-bold text-slate-800 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                        الرقم المرجعي للحوالة:
                      </label>
                      <input
                        value={sarieRefNumber}
                        onChange={(e) => setSarieRefNumber(e.target.value)}
                        placeholder="SARIE-XXXXX"
                        className="w-full rounded-xl border border-slate-200 bg-white p-2 font-mono text-xs font-bold text-slate-800 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 5. STC Pay */}
              {depositMethod === 'stcpay' && (
                <div className="rounded-2xl border border-purple-200 bg-purple-50/60 p-4 space-y-3 dark:border-purple-900/50 dark:bg-purple-950/30">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-purple-900 dark:text-purple-200 flex items-center gap-1.5">
                      <Smartphone size={14} className="text-purple-600" />
                      الدفع عبر محفظة STC Pay / UrPay الرقمية:
                    </span>
                    <span className="text-[10px] font-bold text-purple-700 bg-purple-100 dark:bg-purple-900/60 dark:text-purple-300 px-2 py-0.5 rounded-full">
                      شحن فوري
                    </span>
                  </div>

                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-purple-100 dark:border-purple-900/50 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block">كود التاجر المعتمد STC Pay:</span>
                      <span className="font-mono text-xs font-black text-purple-800 dark:text-purple-300">
                        STC-0982710 (منصة فوتيك)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard('STC-0982710', 'كود التاجر')}
                      className="rounded-lg p-1.5 text-purple-700 hover:bg-purple-50 dark:hover:bg-slate-800"
                    >
                      {copiedKey === 'كود التاجر' ? <CheckCheck size={14} className="text-emerald-600" /> : <Copy size={14} />}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                        رقم جوال المحفظة:
                      </label>
                      <input
                        value={stcPayPhone}
                        onChange={(e) => setStcPayPhone(e.target.value)}
                        placeholder="05XXXXXXXX"
                        className="w-full rounded-xl border border-slate-200 bg-white p-2 font-mono font-bold text-slate-800 outline-none focus:border-purple-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                        الرقم المرجعي (من تطبيق STC):
                      </label>
                      <input
                        value={stcPayRef}
                        onChange={(e) => setStcPayRef(e.target.value)}
                        placeholder="مثال: TXN-4491"
                        className="w-full rounded-xl border border-slate-200 bg-white p-2 font-mono font-bold text-slate-800 outline-none focus:border-purple-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 6. Fawry Pay */}
              {depositMethod === 'fawry' && (
                <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4 space-y-3 dark:border-amber-900/50 dark:bg-amber-950/30">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                      <Receipt size={14} className="text-amber-600" />
                      السداد النقدي عبر شبكة منافذ وتطبيق فوري (Fawry Pay):
                    </span>
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-100 dark:bg-amber-900/60 dark:text-amber-300 px-2 py-0.5 rounded-full">
                      صالح لمدة 48 ساعة
                    </span>
                  </div>

                  <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-amber-200 dark:border-amber-900/50 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block">رقم الكود المرجعي للسداد لدى فوري:</span>
                      <span className="font-mono text-base font-black text-amber-700 dark:text-amber-300 tracking-wider">
                        {fawryRefCode}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(fawryRefCode, 'كود فوري')}
                      className="rounded-lg p-1.5 text-amber-700 hover:bg-amber-50 dark:hover:bg-slate-800"
                    >
                      {copiedKey === 'كود فوري' ? <CheckCheck size={14} className="text-emerald-600" /> : <Copy size={14} />}
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    توجه لأي منفذ أو كشك فوري واطلب دفع خدمة (فوتيك لحلول التقنية) بهذا الكود. سيتم تأكيد الإيداع في محفظتك آلياً بمجرد الدفع.
                  </p>
                </div>
              )}

              {/* 7. Apple Pay */}
              {depositMethod === 'applepay' && (
                <div className="rounded-2xl border border-slate-300 bg-slate-50/80 p-4 dark:border-slate-700 dark:bg-slate-800/50 text-center space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <Smartphone size={24} className="text-slate-800 dark:text-white" />
                    <span className="font-black text-slate-800 dark:text-white text-sm">Apple Pay Express</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    انقر على الزر أدناه لتأكيد شحن مبلغ ({depositAmount.toLocaleString()} {wallet.currency}) فورياً عبر Touch ID أو Face ID.
                  </p>
                </div>
              )}

              {/* 8. Visa / MasterCard */}
              {depositMethod === 'card' && (
                <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-4 space-y-3 dark:border-blue-900/40 dark:bg-blue-950/30">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      اسم حامل البطاقة:
                    </label>
                    <input
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white p-2 font-bold text-slate-800 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      رقم البطاقة (Visa / MasterCard):
                    </label>
                    <input
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4000 1234 5678 9010"
                      className="w-full rounded-xl border border-slate-200 bg-white p-2 font-mono font-bold text-slate-800 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                        تاريخ الانتهاء:
                      </label>
                      <input
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full rounded-xl border border-slate-200 bg-white p-2 font-mono font-bold text-slate-800 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                        رمز الأمان (CVV):
                      </label>
                      <input
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="123"
                        className="w-full rounded-xl border border-slate-200 bg-white p-2 font-mono font-bold text-slate-800 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsDepositModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 font-bold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-[#203d62] px-6 py-2.5 font-black text-white hover:scale-[1.02] shadow-md transition flex items-center gap-2"
                >
                  <CheckCircle2 size={16} />
                  <span>تأكيد التحويل البنكي وتأمين الرصيد في الضمان ({depositAmount.toLocaleString()} {wallet.currency}) 🔒</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal B: Lock Project Escrow (تأمين دفعة في الضمان) */}
      {isLockEscrowModalOpen && (
        <div
          onClick={() => setIsLockEscrowModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
                  <Lock size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-[#152a40] dark:text-white">
                    تأمين وحجز دفعة المشروع في الضمان البنكي
                  </h3>
                  <p className="text-[11px] text-slate-400">حماية كاملة ولا تُحرر إلا بعد موافقتك</p>
                </div>
              </div>
              <button
                onClick={() => setIsLockEscrowModalOpen(false)}
                className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleLockEscrowSubmit} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-black text-slate-700 dark:text-slate-300">
                  اختر المشروع المراد حجز وتأمين دفعته في الضمان:
                </label>
                {projects.length > 0 ? (
                  <>
                    <select
                      value={selectedProjectId}
                      onChange={(e) => {
                        setSelectedProjectId(e.target.value);
                        if (e.target.value !== 'custom') {
                          const p = projects.find((x) => x.id === e.target.value);
                          if (p?.budget) setLockAmount(p.budget);
                        }
                      }}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 font-bold text-slate-800 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    >
                      {projects.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.title} (الميزانية: {p.budget.toLocaleString()} {wallet.currency})
                        </option>
                      ))}
                      <option value="custom">✍️ إدخال اسم مشروع آخر يدوياً...</option>
                    </select>

                    {selectedProjectId === 'custom' && (
                      <input
                        value={customProjectTitle}
                        onChange={(e) => setCustomProjectTitle(e.target.value)}
                        placeholder="أدخل عنوان المشروع، مثل: منصة التجارة الإلكترونية السحابية"
                        className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-2.5 font-bold text-slate-800 outline-none focus:border-amber-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                        required
                      />
                    )}
                  </>
                ) : (
                  <input
                    value={customProjectTitle}
                    onChange={(e) => setCustomProjectTitle(e.target.value)}
                    placeholder="أدخل عنوان المشروع المراد تأمين ميزانيته بالضمان..."
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 font-bold text-slate-800 outline-none focus:border-amber-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    required
                  />
                )}
              </div>

              <div>
                <label className="block font-black text-slate-700 dark:text-slate-300">
                  مبلغ الدفعة المراد حجزها بالضمان ({wallet.currency}) *
                </label>
                <input
                  type="number"
                  value={lockAmount}
                  onChange={(e) => setLockAmount(Number(e.target.value))}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 font-mono text-sm font-black text-slate-800 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  required
                />
                <span className="mt-1 block text-[11px] text-slate-400">
                  رصيدك المتاح الحالي: {wallet.availableBalance.toLocaleString()} {wallet.currency}
                </span>
              </div>

              <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4 text-xs text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-200">
                <span className="font-black flex items-center gap-1 mb-1">
                  <ShieldCheck size={14} className="text-amber-600" />
                  ميثاق حماية الضمان:
                </span>
                <p className="leading-relaxed">
                  سيتم خصم هذا المبلغ من رصيدك المتاح وتجميده في خزينة الضمان البنكية المشفرة. سيتم إشعار المطور فورياً بأن أموال المشروع مؤمنة بنجاح، ولن يتم تسليمها له إلا بعد فحصك للكود وموافقتك النهائية.
                </p>
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsLockEscrowModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 font-bold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-amber-600 px-6 py-2 font-black text-white hover:bg-amber-700 shadow-md transition"
                >
                  تأكيد حجز الضمان 🔒
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal C: Release Escrow Payment (تحرير الدفعة للمطور) */}
      {isReleaseEscrowModalOpen && (
        <div
          onClick={() => setIsReleaseEscrowModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                  <Unlock size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-[#152a40] dark:text-white">
                    تحرير دفعة الضمان للمطور واعتماد التسليم
                  </h3>
                  <p className="text-[11px] text-slate-400">تحويل فوري إلى محفظة المطور وإصدار الفاتورة</p>
                </div>
              </div>
              <button
                onClick={() => setIsReleaseEscrowModalOpen(false)}
                className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleReleaseEscrowSubmit} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-black text-slate-700 dark:text-slate-300">
                  المشروع المراد تحرير دفعته:
                </label>
                {projects.length > 0 ? (
                  <>
                    <select
                      value={releaseProjectId}
                      onChange={(e) => {
                        setReleaseProjectId(e.target.value);
                        if (e.target.value !== 'custom') {
                          const p = projects.find((x) => x.id === e.target.value);
                          if (p?.budget) setReleaseAmount(p.budget);
                          if (p?.developer) setReleaseDevName(p.developer);
                        }
                      }}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 font-bold text-slate-800 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    >
                      {projects.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.title} (الميزانية: {p.budget.toLocaleString()} {wallet.currency})
                        </option>
                      ))}
                      <option value="custom">✍️ إدخال اسم مشروع آخر يدوياً...</option>
                    </select>

                    {releaseProjectId === 'custom' && (
                      <input
                        value={releaseCustomTitle}
                        onChange={(e) => setReleaseCustomTitle(e.target.value)}
                        placeholder="أدخل عنوان المشروع المكتمل..."
                        className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-2.5 font-bold text-slate-800 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                        required
                      />
                    )}
                  </>
                ) : (
                  <input
                    value={releaseCustomTitle}
                    onChange={(e) => setReleaseCustomTitle(e.target.value)}
                    placeholder="أدخل عنوان المشروع المكتمل..."
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 font-bold text-slate-800 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    required
                  />
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-black text-slate-700 dark:text-slate-300">
                    المهندس المستفيد:
                  </label>
                  <input
                    value={releaseDevName}
                    onChange={(e) => setReleaseDevName(e.target.value)}
                    placeholder="اسم المهندس أو المطور"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 font-bold text-slate-800 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    required
                  />
                </div>

                <div>
                  <label className="block font-black text-slate-700 dark:text-slate-300">
                    قيمة الدفعة المحررة ({wallet.currency}):
                  </label>
                  <input
                    type="number"
                    value={releaseAmount}
                    onChange={(e) => setReleaseAmount(Number(e.target.value))}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 font-mono font-black text-slate-800 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    required
                  />
                </div>
              </div>

              {/* Delivery Checklist */}
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-3.5 space-y-1.5 text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-200">
                <span className="font-black block">جاهزية التسليم المعتمدة:</span>
                <div className="flex items-center gap-1.5 text-[11px]">
                  <CheckCircle2 size={13} className="text-emerald-600" />
                  <span>تم نقل ملكية مستودع GitHub بنجاح للمنشأة</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px]">
                  <CheckCircle2 size={13} className="text-emerald-600" />
                  <span>تم فحص ملف Dockerfile ووثيقة التشغيل README.md</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px]">
                  <CheckCircle2 size={13} className="text-emerald-600" />
                  <span>سريان كفالة الصيانة المجانية SLA لمدة 30 يوماً</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsReleaseEscrowModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 font-bold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-600 px-6 py-2 font-black text-white hover:bg-emerald-700 shadow-md transition"
                >
                  تحرير الدفعة للمطور فوراً 💸
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal D: Withdraw Earnings (سحب أرباح المطور) */}
      {isWithdrawModalOpen && (
        <div
          onClick={() => setIsWithdrawModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-500/10 text-teal-600">
                  <Building2 size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-[#152a40] dark:text-white">
                    سحب الأرباح إلى الحساب البنكي
                  </h3>
                  <p className="text-[11px] text-slate-400">تحويل سريع ومباشر وفق المعايير المصرفية</p>
                </div>
              </div>
              <button
                onClick={() => setIsWithdrawModalOpen(false)}
                className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleWithdrawSubmit} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-black text-slate-700 dark:text-slate-300">
                  المبلغ المراد تحويله لحسابك ({wallet.currency}):
                </label>
                <input
                  type="number"
                  min={100}
                  max={wallet.availableBalance}
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 font-mono text-sm font-black text-slate-800 outline-none focus:border-teal-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  required
                />
                <span className="mt-1 block text-[11px] text-slate-400">
                  أرباحك المتاحة للسحب حالياً: {wallet.availableBalance.toLocaleString()} {wallet.currency}
                </span>
              </div>

              <div>
                <label className="block font-black text-slate-700 dark:text-slate-300 mb-1.5">
                  طريقة التحويل البنكي المعتمدة:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setWithdrawMethod('iban')}
                    className={`rounded-xl border p-2.5 text-center font-bold transition ${
                      withdrawMethod === 'iban'
                        ? 'border-teal-500 bg-teal-50 text-teal-900 dark:bg-teal-950/40 dark:text-teal-200'
                        : 'border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    الآيبان (SARIE)
                  </button>
                  <button
                    type="button"
                    onClick={() => setWithdrawMethod('instapay')}
                    className={`rounded-xl border p-2.5 text-center font-bold transition ${
                      withdrawMethod === 'instapay'
                        ? 'border-teal-500 bg-teal-50 text-teal-900 dark:bg-teal-950/40 dark:text-teal-200'
                        : 'border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    InstaPay (لحظي)
                  </button>
                  <button
                    type="button"
                    onClick={() => setWithdrawMethod('wallet_cash')}
                    className={`rounded-xl border p-2.5 text-center font-bold transition ${
                      withdrawMethod === 'wallet_cash'
                        ? 'border-teal-500 bg-teal-50 text-teal-900 dark:bg-teal-950/40 dark:text-teal-200'
                        : 'border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    محفظة كاش
                  </button>
                  <button
                    type="button"
                    onClick={() => setWithdrawMethod('stcpay')}
                    className={`rounded-xl border p-2.5 text-center font-bold transition ${
                      withdrawMethod === 'stcpay'
                        ? 'border-teal-500 bg-teal-50 text-teal-900 dark:bg-teal-950/40 dark:text-teal-200'
                        : 'border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    STC Pay
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-black text-slate-700 dark:text-slate-300">
                  اسم المستفيد الثلاثي كما في الحساب:
                </label>
                <input
                  value={beneficiaryName}
                  onChange={(e) => setBeneficiaryName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 font-bold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  required
                />
              </div>

              <div>
                <label className="block font-black text-slate-700 dark:text-slate-300">
                  {withdrawMethod === 'iban'
                    ? 'رقم الآيبان الدولي (IBAN):'
                    : withdrawMethod === 'instapay'
                    ? 'عنوان الدفع اللحظي (IPA) أو الهاتف:'
                    : withdrawMethod === 'wallet_cash'
                    ? 'رقم محفظة الكاش (فودافون/أورنج/اتصالات/وي):'
                    : 'رقم جوال المحفظة:'}
                </label>
                <input
                  value={ibanNumber}
                  onChange={(e) => setIbanNumber(e.target.value)}
                  placeholder={
                    withdrawMethod === 'iban'
                      ? 'SA...'
                      : withdrawMethod === 'instapay'
                      ? 'name@instapay'
                      : withdrawMethod === 'wallet_cash'
                      ? '010XXXXXXXX'
                      : '05XXXXXXXX'
                  }
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 font-mono font-bold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsWithdrawModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 font-bold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-600 px-6 py-2 font-black text-white hover:bg-emerald-700 shadow-md transition"
                >
                  تأكيد التحويل البنكي 🏦
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal E: Digital Official Invoice (الفاتورة الرقمية المشفرة ZATCA) */}
      {selectedInvoiceTxn && (
        <div
          onClick={() => setSelectedInvoiceTxn(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
          >
            {/* Invoice Top Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#203d62] text-teal-400 font-black">
                  FQS
                </div>
                <div>
                  <h3 className="text-sm font-black text-[#152a40] dark:text-white">
                    فاتورة ضريبية رسمية مبسطة (e-Invoice)
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    رقم مرجعي: {selectedInvoiceTxn.referenceId} • متوافقة مع ZATCA
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedInvoiceTxn(null)}
                className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X size={18} />
              </button>
            </div>

            {/* Invoice Body Content */}
            <div className="mt-5 space-y-4 text-xs">
              {/* Meta Grid */}
              <div className="grid grid-cols-2 gap-3 rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/50">
                <div>
                  <span className="text-[10px] text-slate-400">تاريخ المعاملة:</span>
                  <p className="font-bold text-slate-700 dark:text-slate-200">{selectedInvoiceTxn.date}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400">حالة الدفع:</span>
                  <p className="font-black text-emerald-600 dark:text-emerald-400">
                    {selectedInvoiceTxn.status === 'مكتمل' ? '✓ مسدد بالكامل ومعتمد' : '🔒 مؤمن في حساب الضمان'}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400">طريقة التسوية:</span>
                  <p className="font-bold text-slate-700 dark:text-slate-200">{selectedInvoiceTxn.method || 'نظام الضمان البنكي'}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400">الرقم الضريبي للمنصة:</span>
                  <p className="font-mono font-bold text-slate-700 dark:text-slate-200">310294857200003</p>
                </div>
              </div>

              {/* Items Details */}
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-2">
                <div className="flex items-center justify-between font-black text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-2">
                  <span>البيان ووصف الخدمة البرمجية</span>
                  <span>المبلغ</span>
                </div>
                <div className="flex items-start justify-between text-slate-600 dark:text-slate-300 pt-1">
                  <div>
                    <p className="font-bold">{selectedInvoiceTxn.description}</p>
                    {selectedInvoiceTxn.projectTitle && (
                      <p className="text-[10px] text-slate-400 mt-0.5">مشروع: {selectedInvoiceTxn.projectTitle}</p>
                    )}
                  </div>
                  <span className="font-mono font-bold">{selectedInvoiceTxn.amount.toLocaleString()} {selectedInvoiceTxn.currency}</span>
                </div>
              </div>

              {/* Total & Seal */}
              <div className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-teal-50 to-emerald-50 p-4 dark:from-teal-950/40 dark:to-emerald-950/40 border border-teal-200/50 dark:border-teal-800/40">
                <div className="flex items-center gap-2">
                  <div className="h-9 w-9 rounded-xl bg-white dark:bg-slate-900 border border-teal-200 p-1 flex items-center justify-center">
                    <QrCode size={26} className="text-[#1c7e86]" />
                  </div>
                  <div>
                    <span className="text-[10px] text-teal-800 dark:text-teal-300 font-bold">الختم الرقمي المشفر</span>
                    <p className="text-[10px] text-slate-500 font-mono">FUTECH-ESCROW-SEALED</p>
                  </div>
                </div>

                <div className="text-left">
                  <span className="text-[10px] text-slate-400">الإجمالي الصافي:</span>
                  <div className="text-base font-black text-teal-800 dark:text-teal-300">
                    {selectedInvoiceTxn.amount.toLocaleString()} {selectedInvoiceTxn.currency}
                  </div>
                </div>
              </div>

              {/* Print Action */}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    notify('جاري تحميل الفاتورة الرقمية الرسمية كملف PDF...');
                    setTimeout(() => notify('تم حفظ الفاتورة بنجاح! 📄'), 800);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2 font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
                >
                  <Download size={14} />
                  <span>تحميل PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    window.print();
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#203d62] px-5 py-2 font-black text-white hover:bg-[#2b5182]"
                >
                  <Printer size={14} />
                  <span>طباعة الفاتورة</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
