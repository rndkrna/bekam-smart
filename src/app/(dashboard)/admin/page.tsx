"use client";

import * as React from "react";
import Link from "next/link";
import {
  Activity,
  Users,
  Clock,
  Tv,
  DollarSign,
  ShieldCheck,
  CheckCircle,
  Play,
  RotateCcw,
  LogOut,
  Bed,
  Sparkles,
  Search,
  Filter,
  Volume2,
  VolumeX,
  PlusCircle,
  Printer,
  CreditCard,
  QrCode,
  Receipt,
  X,
  ChevronRight,
  AlertTriangle,
  Stethoscope,
  RefreshCw,
  PhoneCall,
  UserCheck,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge, getStatusBadgeVariant, getStatusLabelIndonesian } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LiveQueueTicket, INITIAL_SERVICES } from "@/lib/data/mock-data";
import { RoomItem, BillingRecord } from "@/lib/data/runtime-store";
import { formatIDR } from "@/lib/utils";
import { announceQueueCallout } from "@/lib/utils/audio-announcer";

const HERBAL_ADDONS = [
  { id: "h1", name: "Minyak Habbatussauda Habasyi (60 Kapsul)", price: 45000 },
  { id: "h2", name: "Madu Hutan Liar Murni Bintan (250gr)", price: 55000 },
  { id: "h3", name: "Minyak Zaitun Ruqyah Extra Virgin", price: 35000 },
  { id: "h4", name: "Propolis Trigona Raw Herbal", price: 65000 },
];

export default function AdminDashboardPage() {
  const [queues, setQueues] = React.useState<LiveQueueTicket[]>([]);
  const [rooms, setRooms] = React.useState<RoomItem[]>([]);
  const [stats, setStats] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [audioEnabled, setAudioEnabled] = React.useState(true);

  // Filters & Search
  const [laneFilter, setLaneFilter] = React.useState<"ALL" | "MALE" | "FEMALE">("ALL");
  const [statusFilter, setStatusFilter] = React.useState<string>("ALL");
  const [searchQuery, setSearchQuery] = React.useState("");

  // Cashier Modal State
  const [checkoutTicket, setCheckoutTicket] = React.useState<LiveQueueTicket | null>(null);
  const [selectedAddons, setSelectedAddons] = React.useState<string[]>([]);
  const [discountAmount, setDiscountAmount] = React.useState<number>(0);
  const [paymentMethod, setPaymentMethod] = React.useState<"CASH" | "QRIS" | "TRANSFER">("CASH");
  const [cashierNotes, setCashierNotes] = React.useState("");
  const [isProcessingPayment, setIsProcessingPayment] = React.useState(false);

  // Print Receipt Modal State
  const [printedBilling, setPrintedBilling] = React.useState<BillingRecord | null>(null);

  // Manual Walk-In Registration Modal State
  const [showWalkinModal, setShowWalkinModal] = React.useState(false);
  const [walkinName, setWalkinName] = React.useState("");
  const [walkinPhone, setWalkinPhone] = React.useState("");
  const [walkinGender, setWalkinGender] = React.useState<"MALE" | "FEMALE">("MALE");
  const [walkinServiceId, setWalkinServiceId] = React.useState(INITIAL_SERVICES[0].id);
  const [isSubmittingWalkin, setIsSubmittingWalkin] = React.useState(false);

  // Notification Toast
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Play airport chime & synthesized Indonesian announcement
  const announceTicket = (ticketNumber: string, roomName: string) => {
    if (!audioEnabled || typeof window === "undefined") return;
    announceQueueCallout(ticketNumber, roomName);
  };

  // Fetch live state
  const fetchData = async () => {
    try {
      const res = await fetch("/api/queues");
      const json = await res.json();
      if (json.success && json.data) {
        setQueues(json.data.allQueues || json.data.queues || []);
        setRooms(json.data.rooms || []);
        setStats(json.data.stats || null);
      }
    } catch (e) {
      console.error("Failed to fetch queues:", e);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  React.useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 4000);
    return () => clearInterval(interval);
  }, []);

  // Update queue status via API
  const handleUpdateStatus = async (
    queueId: string,
    status: LiveQueueTicket["status"],
    options?: { roomName?: string; roomNumber?: number; therapistName?: string }
  ) => {
    try {
      const res = await fetch("/api/queues", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          queueId,
          status,
          roomName: options?.roomName,
          roomNumber: options?.roomNumber,
          therapistName: options?.therapistName,
          actor: "Ustadz Hasan (Admin)",
        }),
      });
      const json = await res.json();
      if (json.success) {
        if (status === "CALLED" && options?.roomName) {
          const target = queues.find((q) => q.id === queueId);
          announceTicket(target?.ticketNumber || queueId, options.roomName);
        }
        showToast(json.message);
        fetchData();
      } else {
        alert(json.error || "Gagal mengubah status");
      }
    } catch (e) {
      console.error(e);
      alert("Terjadi kesalahan server saat memperbarui antrean");
    }
  };

  // Toggle room status
  const handleToggleRoomStatus = async (
    roomId: string,
    newStatus: RoomItem["status"]
  ) => {
    try {
      const res = await fetch("/api/rooms", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId, status: newStatus }),
      });
      const json = await res.json();
      if (json.success) {
        showToast(json.message);
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Bersihkan Seluruh Antrean
  const handleClearAllQueues = async () => {
    if (
      !window.confirm(
        "Apakah Anda yakin ingin membersihkan seluruh antrean hari ini? Semua daftar antrean dan bilik akan direset kosong."
      )
    ) {
      return;
    }
    try {
      const res = await fetch("/api/queues", { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        showToast("Seluruh data antrean berhasil dibersihkan!");
        fetchData();
      }
    } catch (e) {
      console.error(e);
      alert("Gagal membersihkan data antrean");
    }
  };

  // Cashier Payment Submission
  const handleProcessCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutTicket) return;

    setIsProcessingPayment(true);
    try {
      const service = INITIAL_SERVICES.find((s) => s.name === checkoutTicket.serviceName) || INITIAL_SERVICES[0];
      const herbTotal = selectedAddons.reduce((sum, id) => {
        const item = HERBAL_ADDONS.find((h) => h.id === id);
        return sum + (item ? item.price : 0);
      }, 0);

      const res = await fetch("/api/billings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticketId: checkoutTicket.id,
          ticketNumber: checkoutTicket.ticketNumber,
          patientName: checkoutTicket.maskedPatientName,
          serviceName: checkoutTicket.serviceName,
          serviceFee: service.price,
          herbFee: herbTotal,
          discount: discountAmount,
          paymentMethod,
          cashierName: "Kasir Bekam Bintan (Ustadz Hasan)",
          cashierNotes,
        }),
      });

      const json = await res.json();
      if (json.success) {
        showToast(json.message);
        setPrintedBilling(json.data);
        setCheckoutTicket(null);
        setSelectedAddons([]);
        setDiscountAmount(0);
        setCashierNotes("");
        fetchData();
      } else {
        alert(json.error || "Gagal memproses pembayaran");
      }
    } catch (e) {
      console.error(e);
      alert("Terjadi kesalahan koneksi kasir");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Manual Walk-in Registration
  const handleRegisterWalkin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walkinName || !walkinPhone) return;

    setIsSubmittingWalkin(true);
    try {
      const res = await fetch("/api/queues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: walkinName,
          phone: walkinPhone,
          gender: walkinGender,
          serviceId: walkinServiceId,
          hasEatenMeal: true,
          contraindicationConfirmed: true,
          complaints: "Pendaftaran Walk-in di Meja Resepsionis",
        }),
      });

      const json = await res.json();
      if (json.success) {
        showToast(`Antrean berhasil dibuat: ${json.data.ticketNumber}`);
        setShowWalkinModal(false);
        setWalkinName("");
        setWalkinPhone("");
        fetchData();
      } else {
        alert(json.error || "Gagal mendaftarkan antrean walk-in");
      }
    } catch (e) {
      console.error(e);
      alert("Terjadi kesalahan server saat mendaftarkan");
    } finally {
      setIsSubmittingWalkin(false);
    }
  };

  // Filtered Queues List
  const filteredQueues = queues.filter((item) => {
    if (laneFilter !== "ALL" && item.lane !== laneFilter) return false;
    if (statusFilter !== "ALL" && item.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchNum = item.ticketNumber.toLowerCase().includes(q);
      const matchName = item.maskedPatientName.toLowerCase().includes(q);
      const matchService = item.serviceName.toLowerCase().includes(q);
      if (!matchNum && !matchName && !matchService) return false;
    }
    return true;
  });

  // Calculate stats
  const waitingCount = queues.filter((q) => q.status === "WAITING").length;
  const maleWaiting = queues.filter((q) => q.status === "WAITING" && q.lane === "MALE").length;
  const femaleWaiting = queues.filter((q) => q.status === "WAITING" && q.lane === "FEMALE").length;
  const inTherapyCount = queues.filter((q) => q.status === "IN_THERAPY" || q.status === "CALLED").length;
  const completedCount = queues.filter((q) => q.status === "COMPLETED").length;
  const totalRevenue = stats?.totalRevenue ?? completedCount * 85000;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-emerald-800 text-white px-5 py-3 shadow-xl text-xs font-semibold animate-in fade-in slide-in-from-bottom-3 duration-300">
          <CheckCircle className="h-4 w-4 text-emerald-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Top Navigation */}
      <header className="border-b border-slate-200 bg-white px-6 py-4 dark:border-slate-800 dark:bg-slate-900 sticky top-0 z-30 shadow-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-800 text-white font-bold shadow-xs">
              <Activity className="h-6 w-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black text-slate-900 dark:text-white">
                  BEKAM BINTAN THERAPY
                </span>
                <span className="rounded-md bg-teal-100 px-2 py-0.5 text-[10px] font-bold text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                  ADMIN & KASIR
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Pusat Kontrol Operasional • STPT Dinkes Bintan No. 001/Yankes/Batra/VII/2013
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Audio Toggle */}
            <button
              onClick={() => setAudioEnabled(!audioEnabled)}
              title={audioEnabled ? "Matikan Pengumuman Suara" : "Aktifkan Pengumuman Suara"}
              className={`p-2 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-colors ${
                audioEnabled
                  ? "border-teal-200 bg-teal-50 text-teal-800 dark:border-teal-900 dark:bg-teal-950 dark:text-teal-200"
                  : "border-slate-200 bg-white text-slate-400 dark:border-slate-800 dark:bg-slate-900"
              }`}
            >
              {audioEnabled ? (
                <>
                  <Volume2 className="h-4 w-4 text-teal-600" />
                  <span className="hidden sm:inline text-[11px]">Audio Panggilan ON</span>
                </>
              ) : (
                <>
                  <VolumeX className="h-4 w-4 text-slate-400" />
                  <span className="hidden sm:inline text-[11px]">Audio Mute</span>
                </>
              )}
            </button>

            {/* Refresh */}
            <button
              onClick={() => {
                setIsRefreshing(true);
                fetchData();
              }}
              className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
              title="Perbarui Data"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin text-teal-600" : ""}`} />
            </button>

            {/* Reset / Bersihkan Antrean */}
            <button
              onClick={handleClearAllQueues}
              className="p-2 rounded-xl border border-rose-200 bg-rose-50/50 text-rose-700 hover:bg-rose-100 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300 transition-colors"
              title="Bersihkan Seluruh Antrean Hari Ini"
            >
              <RotateCcw className="h-4 w-4" />
            </button>

            {/* Walk-in Button */}
            <Button
              onClick={() => setShowWalkinModal(true)}
              size="sm"
              className="gap-1.5 text-xs bg-emerald-700 hover:bg-emerald-800 text-white"
            >
              <PlusCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Daftar Walk-in</span>
            </Button>

            <Link href="/therapist">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                <Stethoscope className="h-4 w-4 text-teal-600" />
                Workspace Terapis
              </Button>
            </Link>

            <Link href="/tv-display" target="_blank">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                <Tv className="h-4 w-4 text-amber-500" />
                Display TV
              </Button>
            </Link>

            <Link href="/">
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
              >
                <LogOut className="h-4 w-4" />
                Keluar
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-8">
        {/* Metric Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold">Antrean Menunggu</span>
              <Clock className="h-4 w-4 text-amber-500" />
            </div>
            <div className="flex items-baseline justify-between mt-2">
              <p className="text-3xl font-black text-slate-900 dark:text-white">
                {waitingCount} <span className="text-xs font-normal text-slate-500">Pasien</span>
              </p>
              <div className="text-[11px] font-bold space-x-1.5">
                <span className="text-teal-700 dark:text-teal-400">Pria: {maleWaiting}</span>
                <span className="text-slate-300">•</span>
                <span className="text-rose-700 dark:text-rose-400">Wanita: {femaleWaiting}</span>
              </div>
            </div>
          </Card>

          <Card className="border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold">Bilik Terapi Aktif</span>
              <Activity className="h-4 w-4 text-teal-600" />
            </div>
            <p className="text-3xl font-black text-slate-900 dark:text-white mt-2">
              {inTherapyCount}{" "}
              <span className="text-xs font-normal text-slate-500">Bilik Terpakai</span>
            </p>
          </Card>

          <Card className="border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold">Selesai Hari Ini</span>
              <CheckCircle className="h-4 w-4 text-emerald-600" />
            </div>
            <p className="text-3xl font-black text-slate-900 dark:text-white mt-2">
              {completedCount}{" "}
              <span className="text-xs font-normal text-slate-500">Sesi Selesai</span>
            </p>
          </Card>

          <Card className="border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold">Omset Transaksi Kasir</span>
              <DollarSign className="h-4 w-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-black text-emerald-700 dark:text-emerald-400 mt-2">
              {formatIDR(totalRevenue)}
            </p>
          </Card>
        </div>

        {/* Room Status Modular Cards (Dual-Lane) */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Bed className="h-5 w-5 text-teal-700" />
              Monitoring Bilik Ruang Terapi (Dual-Lane Terpisah)
            </h2>
            <span className="text-xs text-slate-500">
              SOP Sterilisasi Khusus Ikhwan & Akhwat
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {rooms.map((room) => {
              const isOccupied = room.status === "OCCUPIED";
              const isCleaning = room.status === "CLEANING";
              const isAvailable = room.status === "AVAILABLE";

              return (
                <div
                  key={room.id}
                  className={`rounded-2xl border p-4.5 transition-all shadow-xs ${
                    isOccupied
                      ? "border-teal-500/50 bg-teal-50/30 dark:border-teal-800 dark:bg-teal-950/20"
                      : isCleaning
                      ? "border-purple-300 bg-purple-50/30 dark:border-purple-900 dark:bg-purple-950/20"
                      : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-sm text-slate-900 dark:text-white block">
                        {room.name}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-slate-400">
                        {room.lane === "MALE" ? "Jalur Ikhwan" : "Jalur Akhwat"}
                      </span>
                    </div>
                    <Badge
                      variant={
                        isOccupied ? "in_therapy" : isCleaning ? "cleaning" : "waiting"
                      }
                    >
                      {room.status}
                    </Badge>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                    {isOccupied ? (
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <UserCheck className="h-3.5 w-3.5 text-teal-600" />
                          Tiket: {room.currentTicketNumber || "-"}
                        </p>
                        <p className="text-[11px] text-teal-700 dark:text-teal-400 mt-0.5 truncate">
                          {room.therapistName || "Terapis Bertugas"}
                        </p>
                      </div>
                    ) : isCleaning ? (
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-purple-700 dark:text-purple-300">
                            Sterilisasi / Ganti Linen
                          </p>
                          <p className="text-[10px] text-slate-400">
                            Pukul: {room.lastSanitizedTime || "Baru saja"}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleRoomStatus(room.id, "AVAILABLE")}
                          className="text-[11px] h-7 px-2 border-purple-300 text-purple-800 hover:bg-purple-100"
                        >
                          Siap Pakai
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                          <CheckCircle className="h-3.5 w-3.5" />
                          Bilik Kosong & Higienis
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleToggleRoomStatus(room.id, "CLEANING")}
                          className="text-[10px] h-6 px-1.5 text-slate-400 hover:text-slate-700"
                        >
                          Sterilisasi
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Queue Operations Table */}
        <Card className="border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="h-5 w-5 text-teal-700" />
                Daftar Antrean & Aksi Operasional
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Kelola panggilan audio, assign ke bilik terapi, atau selesaikan ke kasir
              </p>
            </div>

            {/* Controls: Lane, Status, Search */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Lane Toggle */}
              <div className="inline-flex rounded-xl bg-slate-100 p-1 dark:bg-slate-800 text-xs font-semibold">
                <button
                  onClick={() => setLaneFilter("ALL")}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    laneFilter === "ALL"
                      ? "bg-white text-slate-900 shadow-xs dark:bg-slate-900 dark:text-white"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Semua
                </button>
                <button
                  onClick={() => setLaneFilter("MALE")}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    laneFilter === "MALE"
                      ? "bg-teal-700 text-white shadow-xs"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Ikhwan (P)
                </button>
                <button
                  onClick={() => setLaneFilter("FEMALE")}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    laneFilter === "FEMALE"
                      ? "bg-rose-700 text-white shadow-xs"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Akhwat (W)
                </button>
              </div>

              {/* Status Select */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-8 rounded-xl border border-slate-200 bg-white px-2.5 text-xs text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 font-medium"
              >
                <option value="ALL">Semua Status</option>
                <option value="WAITING">Menunggu</option>
                <option value="CALLED">Dipanggil</option>
                <option value="IN_THERAPY">Sedang Terapi</option>
                <option value="COMPLETED">Selesai</option>
              </select>

              {/* Search */}
              <div className="relative">
                <Search className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari tiket / nama..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-8 w-36 sm:w-44 rounded-xl border border-slate-200 bg-white pl-8 pr-2.5 text-xs text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[11px] border-b border-slate-200 dark:bg-slate-800/60 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-3.5 font-bold">No. Tiket</th>
                  <th className="px-6 py-3.5 font-bold">Pasien</th>
                  <th className="px-6 py-3.5 font-bold">Jalur Gender</th>
                  <th className="px-6 py-3.5 font-bold">Paket Layanan</th>
                  <th className="px-6 py-3.5 font-bold">Status & Lokasi</th>
                  <th className="px-6 py-3.5 font-bold text-right">Aksi Operasional</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredQueues.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-slate-400">
                      Tidak ada antrean yang sesuai filter.
                    </td>
                  </tr>
                ) : (
                  filteredQueues.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                      <td className="px-6 py-4">
                        <span className="font-mono font-black text-base text-slate-900 dark:text-white">
                          {item.ticketNumber}
                        </span>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          Est: ±{item.estimatedWaitMinutes}m
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {item.maskedPatientName}
                        </p>
                        <p className="text-[11px] text-slate-400">Masuk: {item.checkInTime}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`font-bold px-2 py-0.5 rounded-md text-[10px] ${
                            item.lane === "MALE"
                              ? "bg-teal-50 text-teal-800 dark:bg-teal-950 dark:text-teal-300"
                              : "bg-rose-50 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                          }`}
                        >
                          {item.lane === "MALE" ? "Ikhwan (Pria)" : "Akhwat (Wanita)"}
                        </span>
                      </td>
                      <td className="px-6 py-4 max-w-[200px]">
                        <p className="font-medium text-slate-800 dark:text-slate-200 truncate">
                          {item.serviceName}
                        </p>
                        <p className="text-[11px] text-slate-400">{item.serviceDuration} Menit</p>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={getStatusBadgeVariant(item.status)}>
                          {getStatusLabelIndonesian(item.status)}
                        </Badge>
                        {item.roomName && (
                          <p className="text-[10px] font-semibold text-teal-700 dark:text-teal-400 mt-1">
                            {item.roomName}
                          </p>
                        )}
                        {item.calledTime && item.status === "CALLED" && (
                          <p className="text-[10px] text-slate-400">Dipanggil: {item.calledTime}</p>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        {/* Status WAITING */}
                        {item.status === "WAITING" && (
                          <Button
                            size="sm"
                            onClick={() => {
                              const targetRoom =
                                item.lane === "MALE"
                                  ? "Ruang Terapi 1 (Ikhwan)"
                                  : "Ruang Terapi 3 (Akhwat)";
                              handleUpdateStatus(item.id, "CALLED", {
                                roomName: targetRoom,
                                therapistName:
                                  item.lane === "MALE" ? "Ustadz Hasan" : "Ummu Aisyah",
                              });
                            }}
                            className="text-xs bg-sky-600 hover:bg-sky-700 text-white gap-1"
                          >
                            <PhoneCall className="h-3.5 w-3.5" />
                            Panggil
                          </Button>
                        )}

                        {/* Status CALLED */}
                        {item.status === "CALLED" && (
                          <div className="inline-flex gap-1.5">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                announceTicket(
                                  item.ticketNumber,
                                  item.roomName || "Ruang Terapi"
                                );
                                showToast(`Memanggil ulang ${item.ticketNumber}`);
                              }}
                              className="text-xs text-sky-700 border-sky-300 hover:bg-sky-50"
                              title="Panggil Ulang Audio"
                            >
                              <RotateCcw className="h-3.5 w-3.5" />
                              Panggil Ulang
                            </Button>

                            <Button
                              size="sm"
                              onClick={() =>
                                handleUpdateStatus(item.id, "IN_THERAPY", {
                                  roomName: item.roomName,
                                  therapistName: item.therapistName,
                                })
                              }
                              className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white gap-1"
                            >
                              <Play className="h-3.5 w-3.5" />
                              Mulai Terapi
                            </Button>
                          </div>
                        )}

                        {/* Status IN_THERAPY */}
                        {item.status === "IN_THERAPY" && (
                          <Button
                            size="sm"
                            onClick={() => handleUpdateStatus(item.id, "COMPLETED")}
                            className="text-xs bg-slate-900 hover:bg-slate-800 text-white gap-1"
                          >
                            <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                            Selesai Terapi
                          </Button>
                        )}

                        {/* Status COMPLETED */}
                        {item.status === "COMPLETED" && (
                          <Button
                            size="sm"
                            onClick={() => {
                              setCheckoutTicket(item);
                              setSelectedAddons([]);
                              setDiscountAmount(0);
                            }}
                            className="text-xs bg-emerald-700 hover:bg-emerald-800 text-white gap-1"
                          >
                            <CreditCard className="h-3.5 w-3.5" />
                            Kasir & Bayar
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </main>

      {/* ============================================================ */}
      {/* CASHIER CHECKOUT MODAL */}
      {/* ============================================================ */}
      {checkoutTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                  <CreditCard className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Kasir & Pembayaran Terapi
                  </h3>
                  <p className="text-xs text-slate-500">
                    Nomor Tiket: <span className="font-mono font-bold text-slate-900 dark:text-white">{checkoutTicket.ticketNumber}</span> • {checkoutTicket.maskedPatientName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setCheckoutTicket(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleProcessCheckout} className="space-y-4">
              {/* Service Fee Info */}
              <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3.5 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600 dark:text-slate-400">{checkoutTicket.serviceName}</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {formatIDR(
                      (INITIAL_SERVICES.find((s) => s.name === checkoutTicket.serviceName) || INITIAL_SERVICES[0]).price
                    )}
                  </span>
                </div>
              </div>

              {/* Herbal Add-on Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                  Tambahan Herbal Thibbun Nabawi (Opsional)
                </label>
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {HERBAL_ADDONS.map((h) => {
                    const isChecked = selectedAddons.includes(h.id);
                    return (
                      <label
                        key={h.id}
                        className={`flex items-center justify-between p-2.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                          isChecked
                            ? "border-teal-600 bg-teal-50 dark:bg-teal-950/40 text-teal-900 dark:text-teal-200"
                            : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 text-slate-600 dark:text-slate-400"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedAddons([...selectedAddons, h.id]);
                              } else {
                                setSelectedAddons(selectedAddons.filter((id) => id !== h.id));
                              }
                            }}
                            className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                          />
                          <span>{h.name}</span>
                        </div>
                        <span className="font-semibold text-slate-900 dark:text-white">
                          +{formatIDR(h.price)}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Discount / Voucher */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Potongan / Diskon Promo Sunnah (Rp)
                </label>
                <Input
                  type="number"
                  min={0}
                  value={discountAmount}
                  onChange={(e) => setDiscountAmount(Number(e.target.value))}
                  placeholder="0"
                  className="text-xs"
                />
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Metode Pembayaran
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("CASH")}
                    className={`p-2.5 rounded-xl border text-center text-xs font-semibold flex flex-col items-center gap-1 transition-colors ${
                      paymentMethod === "CASH"
                        ? "border-teal-600 bg-teal-50 dark:bg-teal-950 text-teal-900 dark:text-teal-200"
                        : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 text-slate-600"
                    }`}
                  >
                    <DollarSign className="h-4 w-4 text-emerald-600" />
                    Tunai (Cash)
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("QRIS")}
                    className={`p-2.5 rounded-xl border text-center text-xs font-semibold flex flex-col items-center gap-1 transition-colors ${
                      paymentMethod === "QRIS"
                        ? "border-teal-600 bg-teal-50 dark:bg-teal-950 text-teal-900 dark:text-teal-200"
                        : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 text-slate-600"
                    }`}
                  >
                    <QrCode className="h-4 w-4 text-sky-600" />
                    QRIS Dinamis
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("TRANSFER")}
                    className={`p-2.5 rounded-xl border text-center text-xs font-semibold flex flex-col items-center gap-1 transition-colors ${
                      paymentMethod === "TRANSFER"
                        ? "border-teal-600 bg-teal-50 dark:bg-teal-950 text-teal-900 dark:text-teal-200"
                        : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 text-slate-600"
                    }`}
                  >
                    <CreditCard className="h-4 w-4 text-purple-600" />
                    Transfer Bank
                  </button>
                </div>
              </div>

              {/* Total Calculation Display */}
              {(() => {
                const service = INITIAL_SERVICES.find((s) => s.name === checkoutTicket.serviceName) || INITIAL_SERVICES[0];
                const herbTotal = selectedAddons.reduce((sum, id) => {
                  const item = HERBAL_ADDONS.find((h) => h.id === id);
                  return sum + (item ? item.price : 0);
                }, 0);
                const finalTotal = Math.max(0, service.price + herbTotal - discountAmount);

                return (
                  <div className="rounded-xl border border-teal-200 bg-teal-50/70 p-3.5 dark:border-teal-900 dark:bg-teal-950/40 space-y-1">
                    <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
                      <span>Biaya Layanan Bekam:</span>
                      <span>{formatIDR(service.price)}</span>
                    </div>
                    {herbTotal > 0 && (
                      <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
                        <span>Total Herbal Tambahan:</span>
                        <span>+{formatIDR(herbTotal)}</span>
                      </div>
                    )}
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-xs text-rose-600">
                        <span>Diskon / Potongan:</span>
                        <span>-{formatIDR(discountAmount)}</span>
                      </div>
                    )}
                    <div className="pt-2 border-t border-teal-200 dark:border-teal-900 flex justify-between items-baseline font-bold">
                      <span className="text-slate-900 dark:text-white text-xs">Total Pembayaran:</span>
                      <span className="text-lg text-emerald-800 dark:text-emerald-400">
                        {formatIDR(finalTotal)}
                      </span>
                    </div>
                  </div>
                );
              })()}

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setCheckoutTicket(null)}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isProcessingPayment}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white gap-1.5"
                >
                  <Receipt className="h-4 w-4" />
                  {isProcessingPayment ? "Memproses..." : "Selesaikan & Terbitkan Nota"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* PRINT RECEIPT / NOTA MODAL */}
      {/* ============================================================ */}
      {printedBilling && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 text-slate-900 font-mono text-xs space-y-4">
            <div className="text-center pb-3 border-b border-dashed border-slate-300">
              <h2 className="font-black text-sm tracking-wide">BEKAM BINTAN THERAPY</h2>
              <p className="text-[10px] text-slate-500 font-sans">
                Jl. Indunsuri No. 116C, Seri Kuala Lobam, Bintan
              </p>
              <p className="text-[10px] text-slate-500 font-sans">
                STPT Dinkes Bintan: 001/Yankes/Batra/VII/2013
              </p>
              <p className="text-[10px] text-slate-500 font-sans">
                WA Pria: 0812-6832-0072 / WA Wanita: 0812-7530-2567
              </p>
            </div>

            <div className="space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span>No. Nota:</span>
                <span className="font-bold">{printedBilling.invoiceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>No. Tiket:</span>
                <span className="font-bold">{printedBilling.ticketNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>Pasien:</span>
                <span>{printedBilling.patientName}</span>
              </div>
              <div className="flex justify-between">
                <span>Waktu Bayar:</span>
                <span>{printedBilling.paidAt} WIB</span>
              </div>
              <div className="flex justify-between">
                <span>Metode:</span>
                <span className="font-bold">{printedBilling.paymentMethod}</span>
              </div>
            </div>

            <div className="border-t border-b border-dashed border-slate-300 py-2 space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span>{printedBilling.serviceName}</span>
                <span>{formatIDR(printedBilling.serviceFee)}</span>
              </div>
              {printedBilling.herbFee > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>Tambahan Herbal</span>
                  <span>{formatIDR(printedBilling.herbFee)}</span>
                </div>
              )}
              {printedBilling.discount > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>Diskon Promo</span>
                  <span>-{formatIDR(printedBilling.discount)}</span>
                </div>
              )}
            </div>

            <div className="flex justify-between text-sm font-black pt-1">
              <span>TOTAL LUNAS:</span>
              <span>{formatIDR(printedBilling.totalAmount)}</span>
            </div>

            <div className="text-center pt-2 text-[10px] text-slate-500 font-sans border-t border-dashed border-slate-200">
              <p>Jazakumullah Khairan Katsiran</p>
              <p>Semoga Allah karuniakan kesembuhan yang sempurna.</p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                className="w-1/2 text-xs font-sans"
                onClick={() => setPrintedBilling(null)}
              >
                Tutup
              </Button>
              <Button
                size="sm"
                className="w-1/2 text-xs bg-slate-900 text-white font-sans gap-1"
                onClick={() => window.print()}
              >
                <Printer className="h-3.5 w-3.5" />
                Cetak Struk
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MANUAL WALK-IN REGISTRATION MODAL */}
      {/* ============================================================ */}
      {showWalkinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300">
                  <PlusCircle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Pendaftaran Pasien Walk-In
                  </h3>
                  <p className="text-xs text-slate-500">
                    Input cepat pasien datang langsung di klinik
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowWalkinModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterWalkin} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Lengkap Pasien *
                </label>
                <Input
                  type="text"
                  required
                  value={walkinName}
                  onChange={(e) => setWalkinName(e.target.value)}
                  placeholder="Contoh: Budi Santoso"
                  className="text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nomor WhatsApp / HP *
                </label>
                <Input
                  type="tel"
                  required
                  value={walkinPhone}
                  onChange={(e) => setWalkinPhone(e.target.value)}
                  placeholder="Contoh: 08123456789"
                  className="text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Jalur Gender (Dual-Lane) *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setWalkinGender("MALE")}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-colors ${
                      walkinGender === "MALE"
                        ? "border-teal-600 bg-teal-700 text-white"
                        : "border-slate-200 bg-white text-slate-600 dark:border-slate-800 dark:bg-slate-900"
                    }`}
                  >
                    Ikhwan (Pria) - Kode P
                  </button>

                  <button
                    type="button"
                    onClick={() => setWalkinGender("FEMALE")}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-colors ${
                      walkinGender === "FEMALE"
                        ? "border-rose-600 bg-rose-700 text-white"
                        : "border-slate-200 bg-white text-slate-600 dark:border-slate-800 dark:bg-slate-900"
                    }`}
                  >
                    Akhwat (Wanita) - Kode W
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Paket Layanan *
                </label>
                <select
                  value={walkinServiceId}
                  onChange={(e) => setWalkinServiceId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 font-medium"
                >
                  {INITIAL_SERVICES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.durationLabel || `${s.durationMinutes}m`}) - {formatIDR(s.price)}{s.priceUnit ? ` ${s.priceUnit}` : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowWalkinModal(false)}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isSubmittingWalkin}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white"
                >
                  {isSubmittingWalkin ? "Mendaftarkan..." : "Cetak & Ambil Antrean"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
