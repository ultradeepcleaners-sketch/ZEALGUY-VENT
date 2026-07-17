import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AreaChart, Users, ShoppingCart, MessageSquare, Plus, Bell, MapPin, Sparkles, Send, CheckCircle, X } from "lucide-react";
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

  const showToast = (title: string, message: string, type: "success" | "info" | "warning" = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
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
          <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest">Client Portal Experience</span>
          <h3 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2 mt-1">
            <Sparkles className="w-6 h-6 text-purple-400" />
            Client Dashboard Preview
          </h3>
          <p className="text-xs text-gray-400 mt-1 leading-relaxed">
            Every Zealguy Venture client enjoys a custom analytics hub to oversee real-time metrics, payment billing, and direct development channels.
          </p>
        </div>

        <button
          onClick={addSimulatedSale}
          className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:opacity-95 text-white font-mono text-xs font-semibold rounded-lg shadow-md transition-all cursor-pointer"
          id="simulate-sale-btn"
        >
          <Plus className="w-4 h-4" />
          Simulate New Sale
        </button>
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
