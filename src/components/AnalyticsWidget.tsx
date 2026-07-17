import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  TrendingUp, 
  Users, 
  Target, 
  DollarSign, 
  Activity, 
  Sparkles, 
  Plus, 
  Zap, 
  ArrowUpRight 
} from "lucide-react";
import { 
  collection, 
  addDoc, 
  setDoc,
  doc,
  onSnapshot, 
  query, 
  orderBy, 
  limit, 
  serverTimestamp 
} from "firebase/firestore";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from "recharts";
import { db, handleFirestoreError, OperationType, ensureAnonymousSession } from "../firebase";

export interface MonthlyMetric {
  id?: string;
  month: string;
  leads: number;
  conversions: number;
  visitors: number;
  growth: number;
  revenue: number;
}

const DEFAULT_METRICS: MonthlyMetric[] = [
  { month: "Jan", leads: 80, conversions: 18, visitors: 2100, growth: 12.5, revenue: 18500 },
  { month: "Feb", leads: 95, conversions: 24, visitors: 2450, growth: 14.2, revenue: 22000 },
  { month: "Mar", leads: 110, conversions: 31, visitors: 2800, growth: 16.8, revenue: 26400 },
  { month: "Apr", leads: 125, conversions: 42, visitors: 3100, growth: 18.5, revenue: 31000 },
  { month: "May", leads: 140, conversions: 55, visitors: 3600, growth: 21.4, revenue: 38200 },
  { month: "Jun", leads: 165, conversions: 72, visitors: 4200, growth: 24.8, revenue: 46800 }
];

export default function AnalyticsWidget() {
  const [metrics, setMetrics] = useState<MonthlyMetric[]>([]);
  const [activeTab, setActiveTab] = useState<"traffic" | "conversions" | "growth">("traffic");
  const [loading, setLoading] = useState(true);
  const [simulating, setSimulating] = useState(false);

  // Load metrics from Firestore in real-time
  useEffect(() => {
    ensureAnonymousSession(() => {
      // Fetch telemetry data from analytics_metrics collection
      const metricsQuery = query(
        collection(db, "analytics_metrics"), 
        orderBy("createdAt", "asc")
      );

      const unsubscribe = onSnapshot(
        metricsQuery, 
        async (snapshot) => {
          const list: MonthlyMetric[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            list.push({
              id: docSnap.id,
              month: data.month,
              leads: data.leads,
              conversions: data.conversions,
              visitors: data.visitors,
              growth: data.growth,
              revenue: data.revenue
            });
          });

          if (list.length === 0) {
            // Seed the default analytics data if the database is currently empty
            console.log("Seeding analytics_metrics collection in Firestore...");
            try {
              for (let i = 0; i < DEFAULT_METRICS.length; i++) {
                const metric = DEFAULT_METRICS[i];
                // Using setDoc with explicit alphanumeric IDs matching isValidId pattern
                await setDoc(doc(db, "analytics_metrics", `month_${metric.month.toLowerCase()}`), {
                  ...metric,
                  createdAt: serverTimestamp()
                });
              }
            } catch (err) {
              handleFirestoreError(err, OperationType.WRITE, "analytics_metrics");
            }
          } else {
            setMetrics(list);
            setLoading(false);
          }
        }, 
        (error) => {
          handleFirestoreError(error, OperationType.LIST, "analytics_metrics");
        }
      );

      return () => unsubscribe();
    });
  }, []);

  // Simulate pushing a new month of high-growth performance metrics to Firestore
  const handleSimulateNextMonth = async () => {
    if (metrics.length === 0 || simulating) return;
    setSimulating(true);

    const months = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentMonthCount = metrics.length;
    const nextMonthName = months[(currentMonthCount - DEFAULT_METRICS.length) % months.length] || `Month-${currentMonthCount + 1}`;

    const lastMetric = metrics[metrics.length - 1];
    
    // Simulate natural growth step
    const simulatedLeads = Math.floor(lastMetric.leads * (1.1 + Math.random() * 0.15));
    const simulatedConversions = Math.floor(simulatedLeads * (0.4 + Math.random() * 0.08));
    const simulatedVisitors = Math.floor(lastMetric.visitors * (1.08 + Math.random() * 0.12));
    const simulatedGrowth = parseFloat((lastMetric.growth + (Math.random() * 3 - 1)).toFixed(1));
    const simulatedRevenue = Math.floor(lastMetric.revenue * (1.12 + Math.random() * 0.1));

    const nextMetric: MonthlyMetric = {
      month: nextMonthName,
      leads: simulatedLeads,
      conversions: simulatedConversions,
      visitors: simulatedVisitors,
      growth: simulatedGrowth,
      revenue: simulatedRevenue
    };

    try {
      // Use clean IDs that fulfill firestore rules regex '^[a-zA-Z0-9_\-]+$'
      const uniqueId = `metric_${nextMonthName.toLowerCase()}_${Date.now()}`;
      await setDoc(doc(db, "analytics_metrics", uniqueId), {
        ...nextMetric,
        createdAt: serverTimestamp()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, "analytics_metrics");
    } finally {
      setSimulating(false);
    }
  };

  // Reset metrics to initial 6-month baseline
  const handleResetMetrics = async () => {
    if (simulating) return;
    setSimulating(true);
    try {
      // Clean collection dynamically would require delete queries,
      // let's update existing to initial values, or write the defaults again
      for (let i = 0; i < DEFAULT_METRICS.length; i++) {
        const metric = DEFAULT_METRICS[i];
        await setDoc(doc(db, "analytics_metrics", `month_${metric.month.toLowerCase()}`), {
          ...metric,
          createdAt: serverTimestamp()
        });
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, "analytics_metrics");
    } finally {
      setSimulating(false);
    }
  };

  // Compute stats metrics
  const totalVisitors = metrics.reduce((acc, m) => acc + m.visitors, 0);
  const totalLeads = metrics.reduce((acc, m) => acc + m.leads, 0);
  const totalConversions = metrics.reduce((acc, m) => acc + m.conversions, 0);
  const averageGrowth = parseFloat((metrics.reduce((acc, m) => acc + m.growth, 0) / (metrics.length || 1)).toFixed(1));
  const conversionRate = totalLeads > 0 ? parseFloat(((totalConversions / totalLeads) * 100).toFixed(2)) : 0;

  // Custom styling elements matching design system
  const chartColors = {
    primary: "#071E4A",
    orange: "#FF7A00",
    blue: "#3B82F6",
    emerald: "#10B981",
    purple: "#a855f7"
  };

  if (loading) {
    return (
      <div className="w-full bg-[#030614] border border-white/5 rounded-[24px] p-6 flex flex-col items-center justify-center min-h-[350px]">
        <div className="relative flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border-2 border-indigo-500/20 border-t-brand-orange animate-spin" />
          <Sparkles className="w-5 h-5 text-brand-orange absolute animate-pulse" />
        </div>
        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mt-4">Connecting Real-time Database...</span>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="w-full bg-[#030614] border border-white/10 rounded-[24px] p-5 lg:p-6 relative overflow-hidden" 
      id="secure-analytics-widget"
    >
      {/* Glow layer */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF7A00]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Widget Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-4 mb-5">
        <div>
          <span className="text-[10px] font-mono text-brand-orange uppercase tracking-widest font-bold flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            Cloud Database Live Telemetry
          </span>
          <h4 className="text-lg font-bold text-white tracking-tight mt-1 font-display">
            Project ZEUS - Systems Analytics
          </h4>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={handleSimulateNextMonth}
            disabled={simulating}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-mono text-[10px] font-bold rounded-[18px] shadow-lg transition-all duration-200 active:scale-[0.97] cursor-pointer disabled:opacity-40"
          >
            <Plus className="w-3.5 h-3.5" />
            Simulate Next Month
          </button>
          <button
            onClick={handleResetMetrics}
            disabled={simulating}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 font-mono text-[10px] rounded-[18px] transition-all cursor-pointer disabled:opacity-40"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Analytics KPI Dashboard Rows - Staggered Slide In */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="p-3 bg-white/[0.02] border border-white/5 rounded-[18px] relative group hover:border-blue-500/20 transition-all duration-200"
        >
          <div className="flex justify-between items-center mb-1">
            <span className="text-[9px] font-mono text-gray-500 uppercase tracking-wider block">Traffic (Total)</span>
            <Users className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <span className="text-base sm:text-lg font-bold text-white block">{totalVisitors.toLocaleString()}</span>
          <span className="text-[9px] font-mono text-emerald-400 flex items-center gap-0.5 mt-0.5 font-semibold">
            <ArrowUpRight className="w-3 h-3" /> +14.2% MoM
          </span>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          className="p-3 bg-white/[0.02] border border-white/5 rounded-[18px] relative group hover:border-brand-orange/20 transition-all duration-200"
        >
          <div className="flex justify-between items-center mb-1">
            <span className="text-[9px] font-mono text-gray-500 uppercase tracking-wider block">Leads (Pipeline)</span>
            <Target className="w-3.5 h-3.5 text-brand-orange" />
          </div>
          <span className="text-base sm:text-lg font-bold text-white block">{totalLeads.toLocaleString()}</span>
          <span className="text-[9px] font-mono text-emerald-400 flex items-center gap-0.5 mt-0.5 font-semibold">
            <ArrowUpRight className="w-3 h-3" /> +18.5% MoM
          </span>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
          className="p-3 bg-white/[0.02] border border-white/5 rounded-[18px] relative group hover:border-emerald-500/20 transition-all duration-200"
        >
          <div className="flex justify-between items-center mb-1">
            <span className="text-[9px] font-mono text-gray-500 uppercase tracking-wider block">Conversions</span>
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <span className="text-base sm:text-lg font-bold text-white block">{totalConversions.toLocaleString()}</span>
          <span className="text-[9px] font-mono text-emerald-400 flex items-center gap-0.5 mt-0.5 font-semibold">
            <ArrowUpRight className="w-3 h-3" /> {conversionRate}% Rate
          </span>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
          className="p-3 bg-white/[0.02] border border-white/5 rounded-[18px] relative group hover:border-purple-500/20 transition-all duration-200"
        >
          <div className="flex justify-between items-center mb-1">
            <span className="text-[9px] font-mono text-gray-500 uppercase tracking-wider block">Avg MoM Growth</span>
            <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <span className="text-base sm:text-lg font-bold text-white block">+{averageGrowth}%</span>
          <span className="text-[9px] font-mono text-purple-400 flex items-center gap-0.5 mt-0.5 font-semibold">
            <Sparkles className="w-3 h-3 text-brand-orange animate-pulse" /> High Confidence
          </span>
        </motion.div>
      </div>

      {/* Tabs Selection Bar */}
      <div className="flex gap-2 border-b border-white/5 pb-3 mb-4 overflow-x-auto">
        <button
          onClick={() => setActiveTab("traffic")}
          className={`px-4 py-1.5 font-mono text-[10px] uppercase font-bold rounded-[14px] transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "traffic"
              ? "bg-blue-500/10 border border-blue-500/20 text-blue-400"
              : "bg-[#050816] border border-white/5 text-gray-500 hover:text-white"
          }`}
        >
          Visitor Traffic
        </button>
        <button
          onClick={() => setActiveTab("conversions")}
          className={`px-4 py-1.5 font-mono text-[10px] uppercase font-bold rounded-[14px] transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "conversions"
              ? "bg-brand-orange/10 border border-brand-orange/20 text-brand-orange"
              : "bg-[#050816] border border-white/5 text-gray-500 hover:text-white"
          }`}
        >
          Lead Conversions
        </button>
        <button
          onClick={() => setActiveTab("growth")}
          className={`px-4 py-1.5 font-mono text-[10px] uppercase font-bold rounded-[14px] transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "growth"
              ? "bg-purple-500/10 border border-purple-500/20 text-purple-400"
              : "bg-[#050816] border border-white/5 text-gray-500 hover:text-white"
          }`}
        >
          Monthly Revenue & Growth
        </button>
      </div>

      {/* Recharts Canvas Container with Entrance Animation & Cross-fade */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98, y: 15 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="w-full h-64 sm:h-72 mt-2 bg-white/[0.01] rounded-[20px] border border-white/5 p-4 flex flex-col justify-between overflow-hidden"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.99 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="w-full h-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              {activeTab === "traffic" ? (
                <AreaChart data={metrics} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="visitorArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={chartColors.blue} stopOpacity={0.2}/>
                      <stop offset="95%" stopColor={chartColors.blue} stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                  <XAxis dataKey="month" stroke="#6b7280" style={{ fontSize: 9, fontFamily: "monospace" }} />
                  <YAxis stroke="#6b7280" style={{ fontSize: 9, fontFamily: "monospace" }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#030614", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px" }}
                    labelStyle={{ color: "#fff", fontSize: 10, fontFamily: "monospace" }}
                    itemStyle={{ color: "#60a5fa", fontSize: 11 }}
                  />
                  <Area type="monotone" dataKey="visitors" stroke={chartColors.blue} fillOpacity={1} fill="url(#visitorArea)" strokeWidth={2.5} name="Monthly Visitors" />
                </AreaChart>
              ) : activeTab === "conversions" ? (
                <BarChart data={metrics} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                  <XAxis dataKey="month" stroke="#6b7280" style={{ fontSize: 9, fontFamily: "monospace" }} />
                  <YAxis stroke="#6b7280" style={{ fontSize: 9, fontFamily: "monospace" }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#030614", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px" }}
                    labelStyle={{ color: "#fff", fontSize: 10, fontFamily: "monospace" }}
                    itemStyle={{ fontSize: 11 }}
                  />
                  <Legend wrapperStyle={{ fontSize: 9, fontFamily: "monospace", paddingTop: 10 }} />
                  <Bar dataKey="leads" fill={chartColors.orange} radius={[4, 4, 0, 0]} name="Project Leads" />
                  <Bar dataKey="conversions" fill={chartColors.emerald} radius={[4, 4, 0, 0]} name="Conversions" />
                </BarChart>
              ) : (
                <LineChart data={metrics} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                  <XAxis dataKey="month" stroke="#6b7280" style={{ fontSize: 9, fontFamily: "monospace" }} />
                  <YAxis stroke="#6b7280" style={{ fontSize: 9, fontFamily: "monospace" }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#030614", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px" }}
                    labelStyle={{ color: "#fff", fontSize: 10, fontFamily: "monospace" }}
                    itemStyle={{ fontSize: 11 }}
                  />
                  <Legend wrapperStyle={{ fontSize: 9, fontFamily: "monospace", paddingTop: 10 }} />
                  <Line type="monotone" dataKey="revenue" stroke={chartColors.purple} strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Monthly Revenue ($)" />
                  <Line type="monotone" dataKey="growth" stroke={chartColors.orange} strokeWidth={2.5} strokeDasharray="5 5" name="Growth Rate (%)" />
                </LineChart>
              )}
            </ResponsiveContainer>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Sync Status bar */}
      <div className="flex justify-between items-center text-[9px] font-mono text-gray-500 mt-4 border-t border-white/5 pt-3">
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
          Firestore Synchronization Active
        </span>
        <span>Version: 1.0 (RECHARTS_LIVE)</span>
      </div>
    </motion.div>
  );
}
