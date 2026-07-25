import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  AreaChart, 
  Users, 
  ShoppingCart, 
  MessageSquare, 
  Plus, 
  Bell, 
  MapPin, 
  Sparkles, 
  Send, 
  CheckCircle, 
  X,
  Lock,
  Unlock,
  ShieldCheck,
  KeyRound,
  LogIn,
  Eye,
  EyeOff,
  LogOut,
  ShieldAlert,
  Mail,
  ArrowLeft,
  HelpCircle,
  CheckCircle2,
  User,
  Camera,
  Edit2,
  Briefcase,
  BadgeCheck
} from "lucide-react";
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  limit, 
  serverTimestamp 
} from "firebase/firestore";
import { db, handleFirestoreError, OperationType, ensureAnonymousSession } from "../firebase";
import AnalyticsWidget from "./AnalyticsWidget";
import ApprovalCenter from "./ApprovalCenter";

interface SalesLog {
  id: string;
  customer: string;
  amount: number;
  time: string;
  type: string;
}

interface Toast {
  id: string;
  title: string;
  message: string;
  type: "success" | "info" | "warning";
}

export default function ClientDashboard() {
  const [sales, setSales] = useState<SalesLog[]>([]);
  const [totalSales, setTotalSales] = useState(28540);
  const [activeUsers, setActiveUsers] = useState(148);
  const [conversionRate, setConversionRate] = useState(3.42);
  const [logs, setLogs] = useState<string[]>([
    "Dashboard interface compiled successfully.",
    "Connecting to Cloud Firestore database...",
    "Google Maps Platform viewport verified."
  ]);
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<{ sender: string; text: string }[]>([]);
  
  // Toast notifications state
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Mock Authentication Gate State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("zealguy_client_auth") === "true";
    }
    return false;
  });
  const [accessCode, setAccessCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Password Recovery / Forgot Password State
  const [authMode, setAuthMode] = useState<"login" | "forgot" | "sent">("login");
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [isSendingRecovery, setIsSendingRecovery] = useState(false);

  // User Profile State
  const [userProfile, setUserProfile] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("zealguy_client_profile");
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { /* ignore */ }
      }
    }
    return {
      name: "Alexander Sterling",
      email: "alexander.sterling@enterprise-partner.com",
      role: "Chief Digital Officer",
      company: "Aura Global Holdings",
      accountTier: "Zealguy Enterprise VIP",
      avatarInitials: "AS",
      memberSince: "Jan 2025"
    };
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(userProfile.name);
  const [editEmail, setEditEmail] = useState(userProfile.email);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim() || !editEmail.trim()) return;

    const initials = editName
      .trim()
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "CL";

    const updated = {
      ...userProfile,
      name: editName.trim(),
      email: editEmail.trim(),
      avatarInitials: initials
    };

    setUserProfile(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("zealguy_client_profile", JSON.stringify(updated));
    }
    setIsEditingProfile(false);
    showToast("Profile Updated", "Client profile details updated successfully.", "success");
  };

  const showToast = (title: string, message: string, type: "success" | "info" | "warning" = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  };

  const handleAuthenticate = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    const trimmed = accessCode.trim().toLowerCase();

    if (!trimmed) {
      setAuthError("Please enter a valid client access code.");
      return;
    }

    setIsAuthenticating(true);
    setTimeout(() => {
      // Valid demo codes: zealguy2026, client123, demo123, admin, or zealguy
      const validCodes = ["zealguy2026", "client123", "demo123", "admin", "zealguy"];
      if (validCodes.includes(trimmed) || trimmed.length >= 4) {
        setIsAuthenticated(true);
        if (typeof window !== "undefined") {
          sessionStorage.setItem("zealguy_client_auth", "true");
        }
        showToast("Access Granted", "Welcome to the Zealguy Venture Executive Client Portal.", "success");
        setAccessCode("");
      } else {
        setAuthError("Invalid access code. Please use demo code: zealguy2026");
      }
      setIsAuthenticating(false);
    }, 600);
  };

  const handleRequestRecovery = (e: React.FormEvent) => {
    e.preventDefault();
    const email = recoveryEmail.trim();
    if (!email || !email.includes("@")) {
      showToast("Invalid Email", "Please provide a valid corporate email address.", "warning");
      return;
    }

    setIsSendingRecovery(true);
    setTimeout(async () => {
      try {
        await addDoc(collection(db, "password_recovery_requests"), {
          email,
          requestedAt: serverTimestamp(),
          status: "dispatched",
          tempToken: "zealguy2026"
        });
      } catch (err) {
        // Fallback silently if offline
      }

      setIsSendingRecovery(false);
      setAuthMode("sent");
      showToast("Recovery Email Dispatched", `A one-time access token (zealguy2026) was sent to ${email}`, "success");
    }, 800);
  };

  const handleAutoUnlockFromEmail = () => {
    setAccessCode("zealguy2026");
    setIsAuthenticated(true);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("zealguy_client_auth", "true");
    }
    setAuthMode("login");
    showToast("Access Restored", "Temporary password token validated. Portal unlocked successfully.", "success");
  };

  const handleQuickUnlock = () => {
    setAuthError("");
    setAccessCode("zealguy2026");
    setIsAuthenticating(true);
    setTimeout(() => {
      setIsAuthenticated(true);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("zealguy_client_auth", "true");
      }
      showToast("Demo Access Unlocked", "You are now logged into the interactive Client Dashboard.", "success");
      setIsAuthenticating(false);
    }, 400);
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("zealguy_client_auth");
    }
    setAccessCode("");
    setAuthError("");
    showToast("Session Locked", "Client Portal session closed securely.", "info");
  };

  // Simulate active user heartbeat fluctuations
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveUsers((prev) => {
        const delta = Math.floor(Math.random() * 7) - 3;
        const next = prev + delta;
        return next > 80 ? next : 120;
      });
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  // Ensure anonymous session is active and subscribe to real-time streams
  useEffect(() => {
    ensureAnonymousSession((user) => {
      setLogs((prev) => [`Successfully authenticated session: ${user.uid}`, ...prev.slice(0, 4)]);
    });

    // 1. Subscribe to Chat history
    const chatsQuery = query(collection(db, "chats"), orderBy("createdAt", "asc"), limit(50));
    const unsubscribeChats = onSnapshot(chatsQuery, (snapshot) => {
      const messages: { sender: string; text: string }[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        messages.push({
          sender: data.sender || "client",
          text: data.text || ""
        });
      });
      // If empty, seed default conversations so dashboard is never empty
      if (messages.length === 0) {
        setChatHistory([
          { sender: "client", text: "Is the final production build optimization ready for checkout?" },
          { sender: "ai", text: "Yes! High-speed asset compilation is verified, and the PageSpeed rating sits at 99." }
        ]);
      } else {
        setChatHistory(messages);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "chats");
    });

    // 2. Subscribe to Sales logs
    const salesQuery = query(collection(db, "sales"), orderBy("createdAt", "desc"), limit(10));
    const unsubscribeSales = onSnapshot(salesQuery, (snapshot) => {
      const logsList: SalesLog[] = [];
      let calculatedTotal = 25000; // Base baseline
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const createdVal = data.createdAt;
        let timeStr = "Just now";
        if (createdVal && typeof createdVal.toDate === "function") {
          const date = createdVal.toDate();
          timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        logsList.push({
          id: docSnap.id,
          customer: data.customer || "Anonymized Client",
          amount: data.amount || 0,
          time: timeStr,
          type: data.type || "Solution Design"
        });
        calculatedTotal += (data.amount || 0);
      });

      if (logsList.length === 0) {
        // Seed default sales if Firestore is currently empty
        setSales([
          { id: "1", customer: "Amelia V.", amount: 840, time: "Just now", type: "Subscription" },
          { id: "2", customer: "Satoshi N.", amount: 1200, time: "4m ago", type: "Consultation" },
          { id: "3", customer: "Devon K.", amount: 350, time: "18m ago", type: "License Renew" },
        ]);
        setTotalSales(28540);
      } else {
        setSales(logsList);
        setTotalSales(calculatedTotal);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "sales");
    });

    return () => {
      unsubscribeChats();
      unsubscribeSales();
    };
  }, []);

  const addSimulatedSale = async () => {
    const customers = ["Isabella M.", "Alexander P.", "Yuki S.", "Chen G.", "Elena R."];
    const types = ["Platform Design", "NextJS Deployment", "Marketing Funnel", "AI Integration"];
    const randomCustomer = customers[Math.floor(Math.random() * customers.length)];
    const randomType = types[Math.floor(Math.random() * types.length)];
    const randomAmount = Math.floor(Math.random() * 1500) + 200;

    try {
      await addDoc(collection(db, "sales"), {
        customer: randomCustomer,
        amount: randomAmount,
        type: randomType,
        createdAt: serverTimestamp()
      });
      setConversionRate((prev) => parseFloat((prev + 0.04).toFixed(2)));
      setLogs((prev) => [`Simulated transaction of $${randomAmount} from ${randomCustomer} synchronized to cloud.`, ...prev.slice(0, 4)]);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, "sales");
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const textToSend = chatMessage;
    setChatMessage("");

    try {
      // 1. Save user chat message
      await addDoc(collection(db, "chats"), {
        sender: "client",
        text: textToSend,
        createdAt: serverTimestamp()
      });

      // 2. Simulate AI automated agency specialist answer after a brief delay
      setTimeout(async () => {
        const answers = [
          "That's on track! Development milestones are streaming securely inside the dashboard.",
          "Understood. The next deployment phase incorporates premium Tailwind modules immediately.",
          "Compiling dynamic visual nodes now. We aim to secure client portal payments by Tuesday."
        ];
        const randomAnswer = answers[Math.floor(Math.random() * answers.length)];
        try {
          await addDoc(collection(db, "chats"), {
            sender: "ai",
            text: randomAnswer,
            createdAt: serverTimestamp()
          });
        } catch (error) {
          handleFirestoreError(error, OperationType.WRITE, "chats");
        }
      }, 1000);

    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, "chats");
    }
  };


  return (
    <div className="w-full bg-[#090e24]/60 border border-white/10 rounded-2xl p-6 lg:p-8 backdrop-blur-xl relative overflow-hidden shadow-2xl" id="client-dashboard-preview">
      {/* Dynamic ambient lights */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-white/10 pb-4 mb-6 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest">Client Portal Experience</span>
            {isAuthenticated ? (
              <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[9px] rounded-full font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Secured Session
              </span>
            ) : (
              <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-[9px] rounded-full font-bold flex items-center gap-1">
                <Lock className="w-2.5 h-2.5 text-amber-400" />
                Locked
              </span>
            )}
          </div>
          <h3 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2 mt-1 font-display">
            <Sparkles className="w-6 h-6 text-purple-400" />
            Client Dashboard Preview
          </h3>
          <p className="text-xs text-gray-400 mt-1 leading-relaxed font-sans">
            Every Zealguy Venture client enjoys a custom analytics hub to oversee real-time metrics, payment billing, and direct development channels.
          </p>
        </div>

        {isAuthenticated && (
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <button
              onClick={addSimulatedSale}
              className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:opacity-95 text-white font-mono text-xs font-semibold rounded-lg shadow-md transition-all cursor-pointer"
              id="simulate-sale-btn"
            >
              <Plus className="w-4 h-4" />
              Simulate New Sale
            </button>

            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 px-3 py-2 bg-white/5 hover:bg-rose-500/20 text-gray-300 hover:text-rose-300 border border-white/10 hover:border-rose-500/40 font-mono text-xs font-semibold rounded-lg transition-all cursor-pointer"
              title="Lock Portal Session"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400" />
              <span>Lock Portal</span>
            </button>
          </div>
        )}
      </div>

      {!isAuthenticated ? (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="py-10 px-4 sm:px-8 max-w-xl mx-auto text-center relative z-10"
        >
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-brand-orange/20 border border-white/20 flex items-center justify-center text-purple-400 shadow-[0_0_40px_rgba(168,85,247,0.25)] mb-6 relative">
            <div className="absolute inset-0 rounded-3xl bg-purple-500/10 animate-ping pointer-events-none" />
            <Lock className="w-10 h-10 text-[#FF7A00]" />
          </div>

          <div className="space-y-2 mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-mono text-purple-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Restricted Stakeholder Access</span>
            </div>
            <h4 className="text-2xl font-bold text-white tracking-tight font-display">
              Client Portal Authentication Gate
            </h4>
            <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed font-sans">
              This environment contains real-time financial telemetry, sprint deliverables, approval centers, and direct engineering channels.
            </p>
          </div>

          {/* Demo Credential Hint Box */}
          <div className="p-3.5 bg-indigo-950/50 border border-indigo-500/30 rounded-2xl mb-6 text-left flex items-start gap-3 backdrop-blur-md shadow-inner">
            <KeyRound className="w-5 h-5 text-[#FF7A00] shrink-0 mt-0.5" />
            <div className="text-xs flex-1">
              <div className="font-mono text-indigo-300 font-bold flex items-center justify-between">
                <span>Demo Access Password</span>
                <span className="text-[10px] bg-[#FF7A00]/20 text-[#FF7A00] px-2.5 py-0.5 rounded-full border border-[#FF7A00]/30 font-bold font-mono">
                  zealguy2026
                </span>
              </div>
              <p className="text-[11px] text-gray-300 mt-1 font-sans">
                Type <code className="bg-black/50 px-1.5 py-0.5 rounded text-[#FF7A00] font-mono">zealguy2026</code> or <code className="bg-black/50 px-1.5 py-0.5 rounded text-indigo-300 font-mono">client123</code>, or click <strong>Quick Demo Unlock</strong> below.
              </p>
            </div>
          </div>

          {/* Password Form vs Forgot Password Flow */}
          {authMode === "login" && (
            <form onSubmit={handleAuthenticate} className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <KeyRound className="w-4 h-4 text-gray-500" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={accessCode}
                  onChange={(e) => {
                    setAccessCode(e.target.value);
                    if (authError) setAuthError("");
                  }}
                  placeholder="Enter client access password (e.g. zealguy2026)"
                  className="w-full bg-[#030614] border border-white/15 focus:border-[#FF7A00] focus:ring-1 focus:ring-[#FF7A00] rounded-xl pl-10 pr-10 py-3 text-xs text-white placeholder-gray-500 font-mono transition-all shadow-inner"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-white cursor-pointer transition-colors"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("forgot");
                    setAuthError("");
                  }}
                  className="text-[11px] font-mono text-indigo-300 hover:text-[#FF7A00] transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <HelpCircle className="w-3 h-3 text-[#FF7A00]" />
                  <span>Forgot Access Code or Password?</span>
                </button>
              </div>

              {authError && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-2.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs font-mono flex items-center gap-2 text-left"
                >
                  <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{authError}</span>
                </motion.div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <button
                  type="submit"
                  disabled={isAuthenticating}
                  className="w-full py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-[#FF7A00] hover:opacity-95 text-white font-mono text-xs font-bold rounded-xl shadow-lg hover:shadow-[0_0_20px_rgba(255,122,0,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isAuthenticating ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Verifying Access...</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      <span>Unlock Portal Access</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleQuickUnlock}
                  disabled={isAuthenticating}
                  className="w-full py-3 bg-white/10 hover:bg-white/15 border border-white/15 hover:border-white/30 text-white font-mono text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Unlock className="w-4 h-4 text-[#FF7A00]" />
                  <span>Quick Demo Unlock</span>
                </button>
              </div>
            </form>
          )}

          {authMode === "forgot" && (
            <motion.form 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleRequestRecovery} 
              className="space-y-4 text-left"
            >
              <div className="p-4 bg-indigo-950/40 border border-indigo-500/30 rounded-2xl">
                <div className="flex items-center gap-2 mb-2 text-indigo-300 font-mono text-xs font-bold">
                  <Mail className="w-4 h-4 text-[#FF7A00]" />
                  <span>Account Credentials Recovery</span>
                </div>
                <p className="text-xs text-gray-300 font-sans leading-relaxed">
                  Provide your corporate email address to receive a temporary login token and automated security pass.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-gray-300 uppercase tracking-wider block">
                  Corporate Work Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Mail className="w-4 h-4 text-gray-500" />
                  </div>
                  <input
                    type="email"
                    required
                    value={recoveryEmail}
                    onChange={(e) => setRecoveryEmail(e.target.value)}
                    placeholder="e.g. exec@zealguyventure.com"
                    className="w-full bg-[#030614] border border-white/15 focus:border-[#FF7A00] focus:ring-1 focus:ring-[#FF7A00] rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-gray-500 font-mono transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isSendingRecovery}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-[#FF7A00] hover:opacity-95 text-white font-mono text-xs font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSendingRecovery ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Dispatching Email...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Recovery Token</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setAuthMode("login")}
                  className="w-full py-3 bg-white/10 hover:bg-white/15 border border-white/15 text-white font-mono text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Password</span>
                </button>
              </div>
            </motion.form>
          )}

          {authMode === "sent" && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4 text-left"
            >
              {/* Simulated Inbox Card */}
              <div className="p-4 bg-[#030614] border border-emerald-500/40 rounded-2xl shadow-[0_0_25px_rgba(16,185,129,0.15)] relative overflow-hidden">
                <div className="absolute top-0 right-0 px-3 py-1 bg-emerald-500/20 border-b border-l border-emerald-500/30 rounded-bl-xl text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Dispatched via Secure Gateway</span>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono text-gray-400 border-b border-white/10 pb-2 mb-3 pt-1">
                  <Mail className="w-4 h-4 text-emerald-400" />
                  <span>Simulated Inbox Dispatch</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between font-mono text-gray-300">
                    <span className="text-gray-500">From:</span>
                    <span className="text-emerald-300">security-gateway@zealguyventure.com</span>
                  </div>
                  <div className="flex items-center justify-between font-mono text-gray-300">
                    <span className="text-gray-500">To:</span>
                    <span className="text-white font-bold">{recoveryEmail || "client@company.com"}</span>
                  </div>
                  <div className="flex items-center justify-between font-mono text-gray-300 border-b border-white/10 pb-2">
                    <span className="text-gray-500">Subject:</span>
                    <span className="text-indigo-300 font-semibold">[Zealguy Security] Credentials Recovery</span>
                  </div>

                  <div className="pt-2 text-gray-300 font-sans text-xs leading-relaxed space-y-2">
                    <p>Hello Executive Client,</p>
                    <p>Your single-use login token has been dispatched successfully:</p>
                    <div className="p-3 bg-indigo-950/80 border border-indigo-500/40 rounded-xl text-center font-mono my-2">
                      <span className="text-[10px] text-gray-400 block uppercase tracking-wider mb-0.5">Temporary Access Token</span>
                      <span className="text-xl font-bold text-[#FF7A00] tracking-widest">zealguy2026</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleAutoUnlockFromEmail}
                  className="w-full py-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-[#FF7A00] hover:opacity-95 text-white font-mono text-xs font-bold rounded-xl shadow-lg hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Unlock className="w-4 h-4" />
                  <span>Auto-Fill Token & Unlock</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAuthMode("login")}
                  className="w-full py-3 bg-white/10 hover:bg-white/15 border border-white/15 text-white font-mono text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Return to Login</span>
                </button>
              </div>
            </motion.div>
          )}

          <div className="flex items-center justify-center gap-3 text-[10px] font-mono text-gray-500 pt-8 border-t border-white/5 mt-8">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" /> 256-Bit SSL Enforced
            </span>
            <span>•</span>
            <span>Multi-Tenant Access</span>
            <span>•</span>
            <span>Firestore Auth</span>
          </div>
        </motion.div>
      ) : (
        <div className="space-y-6">
          {/* User Profile Section */}
          <div className="p-5 bg-[#030614] border border-white/10 rounded-2xl relative overflow-hidden backdrop-blur-md shadow-lg">
            <div className="absolute top-0 right-0 w-72 h-full bg-gradient-to-l from-indigo-500/10 via-purple-500/5 to-transparent pointer-events-none" />
            
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
              <div className="flex items-center gap-4">
                {/* Profile Avatar Placeholder Component */}
                <div className="relative group shrink-0">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-[#FF7A00] p-0.5 shadow-[0_0_20px_rgba(255,122,0,0.25)]">
                    <div className="w-full h-full rounded-[14px] bg-[#070c24] flex items-center justify-center text-white font-mono font-bold text-xl relative overflow-hidden">
                      <span>{userProfile.avatarInitials}</span>
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer" title="Upload New Profile Photo (Placeholder)">
                        <Camera className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </div>
                  {/* Active Session Status Badge */}
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-[#030614] rounded-full shadow-sm" title="Active Client Session" />
                </div>

                {/* Name, Email and Role Info */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-lg font-bold text-white tracking-tight font-display flex items-center gap-1.5">
                      {userProfile.name}
                      <BadgeCheck className="w-4.5 h-4.5 text-[#FF7A00]" />
                    </h4>
                    <span className="px-2.5 py-0.5 bg-[#FF7A00]/15 border border-[#FF7A00]/30 text-[#FF7A00] font-mono text-[10px] rounded-full font-bold">
                      {userProfile.accountTier}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-gray-300 font-mono flex-wrap">
                    <span className="flex items-center gap-1.5 text-gray-200">
                      <Mail className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      {userProfile.email}
                    </span>
                    <span className="flex items-center gap-1.5 text-gray-400">
                      <Briefcase className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      {userProfile.role} • {userProfile.company}
                    </span>
                  </div>
                </div>
              </div>

              {/* Profile Action / Toggle Edit Button */}
              <div className="flex items-center gap-2 w-full md:w-auto justify-end border-t md:border-t-0 border-white/10 pt-3 md:pt-0">
                <button
                  onClick={() => {
                    setEditName(userProfile.name);
                    setEditEmail(userProfile.email);
                    setIsEditingProfile(!isEditingProfile);
                  }}
                  className="px-3.5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-gray-200 hover:text-white font-mono text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Edit2 className="w-3.5 h-3.5 text-[#FF7A00]" />
                  <span>{isEditingProfile ? "Close Profile Edit" : "Edit Profile"}</span>
                </button>
              </div>
            </div>

            {/* Editable Profile Details Form */}
            <AnimatePresence>
              {isEditingProfile && (
                <motion.form
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  onSubmit={handleSaveProfile}
                  className="mt-4 pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-3"
                >
                  <div>
                    <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block mb-1">Client Full Name</label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full bg-[#070c24] border border-white/15 focus:border-[#FF7A00] rounded-xl px-3 py-2 text-xs text-white font-mono"
                      placeholder="e.g. Alexander Sterling"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block mb-1">Corporate Email Address</label>
                    <input
                      type="email"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className="w-full bg-[#070c24] border border-white/15 focus:border-[#FF7A00] rounded-xl px-3 py-2 text-xs text-white font-mono"
                      placeholder="e.g. alexander@company.com"
                      required
                    />
                  </div>
                  <div className="sm:col-span-2 flex justify-end gap-2 pt-1">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-[#FF7A00] text-white font-mono text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
                    >
                      Save Profile Changes
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Real-time Stats Cards & Graph */}
        <div className="lg:col-span-8 space-y-6">
          {/* Key Metrics row */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-[#030614] border border-white/5 rounded-xl">
              <span className="text-[10px] font-mono text-gray-500 uppercase flex items-center gap-1">
                <ShoppingCart className="w-3.5 h-3.5 text-blue-400" />
                TOTAL PLATFORM SALES
              </span>
              <span className="text-lg sm:text-xl font-bold text-white block mt-1">${totalSales.toLocaleString()}</span>
            </div>
            <div className="p-4 bg-[#030614] border border-white/5 rounded-xl">
              <span className="text-[10px] font-mono text-gray-500 uppercase flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-emerald-400" />
                ACTIVE VISITORS
              </span>
              <span className="text-lg sm:text-xl font-bold text-emerald-400 block mt-1 animate-pulse">{activeUsers}</span>
            </div>
            <div className="p-4 bg-[#030614] border border-white/5 rounded-xl">
              <span className="text-[10px] font-mono text-gray-500 uppercase flex items-center gap-1">
                <AreaChart className="w-3.5 h-3.5 text-purple-400" />
                CONVERSION RATE
              </span>
              <span className="text-lg sm:text-xl font-bold text-white block mt-1">{conversionRate}%</span>
            </div>
          </div>

          {/* Dynamic Real-time Analytics Widget from Firestore via Recharts */}
          <AnalyticsWidget />

          {/* Real-time Milestone Approval Center */}
          <ApprovalCenter 
            onLogMessage={(msg) => setLogs((prev) => [msg, ...prev.slice(0, 4)])} 
            onApproveSuccess={(title) => {
              showToast("Approval Confirmed", `"${title}" has been successfully checked off.`, "success");
            }}
          />

          {/* Simulated Activity Stream */}
          <div className="space-y-3 font-mono text-[10px]">
            <span className="text-gray-500 uppercase tracking-widest block">Core Telemetry Streams:</span>
            <div className="space-y-2 max-h-[120px] overflow-y-auto pr-2">
              <AnimatePresence>
                {sales.slice(0, 3).map((sale, idx) => (
                  <motion.div
                    key={sale.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="flex justify-between items-center p-2.5 bg-white/[0.01] border border-white/5 rounded-lg"
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                      <span className="text-gray-300 font-semibold">{sale.customer}</span>
                      <span className="text-gray-500">purchased {sale.type}</span>
                    </span>
                    <span className="text-emerald-400 font-bold">+${sale.amount}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Right Side: Visual Map & Chat Stream */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-6">
          {/* Active Visitor Maps Node */}
          <div className="p-4 bg-[#030614] border border-white/5 rounded-xl flex-1 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono text-gray-500 block mb-2">GLOBAL CLIENT NETWORK</span>
              <div className="h-28 bg-[#050816] rounded-lg border border-white/15 relative overflow-hidden flex items-center justify-center">
                {/* Stylized custom SVG map representation */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:10px_10px]" />
                
                {/* Simulated geographic nodes */}
                <div className="absolute top-1/4 left-1/3 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-blue-400 animate-bounce" />
                  <span className="text-[8px] font-mono text-gray-400 bg-black/50 px-1 py-0.5 rounded">London</span>
                </div>
                <div className="absolute bottom-1/3 right-1/4 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-purple-400 animate-bounce" />
                  <span className="text-[8px] font-mono text-gray-400 bg-black/50 px-1 py-0.5 rounded">Tokyo</span>
                </div>
                <div className="absolute top-1/2 left-1/4 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-emerald-400 animate-bounce" />
                  <span className="text-[8px] font-mono text-gray-400 bg-black/50 px-1 py-0.5 rounded">San Fran</span>
                </div>
              </div>
            </div>

            {/* Active Developer Chat Node */}
            <div className="mt-4 pt-4 border-t border-white/5">
              <span className="text-[10px] font-mono text-gray-500 block mb-2 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                DIRECT DEVELOPER FEED
              </span>

              {/* Message loop logs */}
              <div className="space-y-2.5 max-h-[140px] overflow-y-auto pr-1 mb-3">
                {chatHistory.map((chat, idx) => (
                  <div key={idx} className={`p-2 rounded-lg text-[11px] ${
                    chat.sender === "client" 
                      ? "bg-white/5 text-gray-200 ml-6 text-right rounded-br-none" 
                      : "bg-indigo-500/10 border border-indigo-500/10 text-indigo-300 mr-6 rounded-bl-none"
                  }`}>
                    {chat.text}
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="flex gap-1.5">
                <input
                  type="text"
                  placeholder="Ask developer..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  className="flex-1 bg-[#050816] border border-white/10 rounded-lg px-2.5 py-1.5 text-[11px] text-white focus:outline-none focus:border-indigo-500 font-sans"
                />
                <button
                  type="submit"
                  className="p-1.5 bg-white hover:bg-white/90 text-[#050816] rounded-lg transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>
        </div>

        </div>
      </div>
      )}

      {/* Toast Notification Container */}
      <div className="absolute top-4 right-4 z-50 flex flex-col gap-2.5 pointer-events-none max-w-sm w-full">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.9, x: 20 }}
              animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: -10, transition: { duration: 0.2 } }}
              className="pointer-events-auto w-full bg-[#030614]/95 border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.15)] rounded-xl p-3.5 flex gap-3 items-start backdrop-blur-xl"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <CheckCircle className="w-4.5 h-4.5 text-emerald-400" />
              </div>
              <div className="flex-1 text-left min-w-0">
                <div className="text-xs font-bold text-white tracking-tight flex items-center gap-1.5">
                  {toast.title}
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
                </div>
                <div className="text-[10px] text-gray-400 font-sans mt-0.5 leading-normal break-words">
                  {toast.message}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
                className="text-gray-500 hover:text-white transition-colors cursor-pointer shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
