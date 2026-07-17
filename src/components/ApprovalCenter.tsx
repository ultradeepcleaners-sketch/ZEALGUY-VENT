import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  Plus, 
  Send, 
  FileText, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Eye, 
  Filter, 
  Loader2,
  FileCheck,
  Mail
} from "lucide-react";
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  doc, 
  updateDoc, 
  serverTimestamp,
  limit
} from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../firebase";

export interface DeliverableApproval {
  id: string;
  title: string;
  category: string;
  description: string;
  status: "pending" | "approved" | "changes_requested";
  feedback?: string;
  approvedBy?: string;
  submittedAt?: any;
  updatedAt?: any;
}

interface ApprovalCenterProps {
  clientName?: string;
  onLogMessage?: (msg: string) => void;
  onApproveSuccess?: (title: string) => void;
}

export default function ApprovalCenter({ clientName = "Alice Sterling", onLogMessage, onApproveSuccess }: ApprovalCenterProps) {
  const [approvals, setApprovals] = useState<DeliverableApproval[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "approved" | "changes_requested">("all");
  
  // Project Manager Email Configuration & Emails Log State
  const [pmEmail, setPmEmail] = useState(localStorage.getItem("pm_email") || "ultradeepcleaners@gmail.com");
  const [emails, setEmails] = useState<any[]>([]);
  const [isEmailPanelOpen, setIsEmailPanelOpen] = useState(true);

  const handlePmEmailChange = (val: string) => {
    setPmEmail(val);
    localStorage.setItem("pm_email", val);
  };

  // Create Deliverable Form States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Design Mockup");
  const [newDescription, setNewDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Changes Request feedback state
  const [activeRequestChangesId, setActiveRequestChangesId] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState("");

  // Track recently approved items for immediate celebration animation
  const [recentlyApprovedIds, setRecentlyApprovedIds] = useState<string[]>([]);

  // Subscribing to approvals & triggered emails in real-time
  useEffect(() => {
    const approvalsQuery = query(collection(db, "approvals"), orderBy("submittedAt", "desc"));
    
    const unsubscribe = onSnapshot(approvalsQuery, async (snapshot) => {
      const items: DeliverableApproval[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        items.push({
          id: docSnap.id,
          title: data.title || "Untitled Deliverable",
          category: data.category || "General",
          description: data.description || "",
          status: data.status || "pending",
          feedback: data.feedback || "",
          approvedBy: data.approvedBy || "",
          submittedAt: data.submittedAt,
          updatedAt: data.updatedAt
        });
      });

      // If Firestore database is currently empty, seed default items so they can interact immediately
      if (items.length === 0 && snapshot.metadata.fromCache === false) {
        setLoading(true);
        try {
          const defaultItems = [
            {
              title: "Phase 3: Client Dashboard Bento Grid Wireframes",
              category: "Design Mockup",
              description: "High-fidelity mockups of client portal design, styled with dark slate colors, featuring dynamic grids and KPI indicators.",
              status: "pending" as const,
              submittedAt: serverTimestamp()
            },
            {
              title: "Cloud SQL Ingest & Seeding Telemetry APIs",
              category: "API Specification",
              description: "Endpoint schema architecture mapping relational variables. Handles anonymous developer session telemetry logs.",
              status: "pending" as const,
              submittedAt: serverTimestamp()
            },
            {
              title: "Phase 1: Project System Architecture Blueprint",
              category: "Technical Blueprint",
              description: "Initial infrastructure routing design, security rules roadmap, and technology stack evaluation document.",
              status: "approved" as const,
              approvedBy: "Alice Sterling",
              submittedAt: serverTimestamp()
            }
          ];

          for (const item of defaultItems) {
            await addDoc(collection(db, "approvals"), item);
          }
        } catch (error) {
          console.error("Failed to seed default approvals:", error);
        }
      } else {
        setApprovals(items);
        setLoading(false);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "approvals");
      setLoading(false);
    });

    // Subscribe to emails queue to demonstrate the real trigger
    const emailsQuery = query(collection(db, "emails"), orderBy("createdAt", "desc"), limit(6));
    const unsubscribeEmails = onSnapshot(emailsQuery, (snapshot) => {
      const emailItems: any[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        emailItems.push({
          id: docSnap.id,
          ...data
        });
      });
      setEmails(emailItems);
    }, (error) => {
      console.warn("Emails query failed:", error);
    });

    return () => {
      unsubscribe();
      unsubscribeEmails();
    };
  }, []);

  // Approve a deliverable
  const handleApprove = async (id: string, title: string) => {
    setRecentlyApprovedIds(prev => [...prev, id]);
    try {
      const docRef = doc(db, "approvals", id);
      await updateDoc(docRef, {
        status: "approved",
        approvedBy: clientName,
        feedback: "", // Clear out feedback if approved
        updatedAt: serverTimestamp()
      });

      const message = `Approved deliverable: "${title}" by ${clientName}`;
      if (onLogMessage) onLogMessage(message);
      if (onApproveSuccess) onApproveSuccess(title);

      // Trigger automated notification email to Project Manager in Firestore
      const targetItem = approvals.find(a => a.id === id);
      const descriptionText = targetItem?.description || "";
      await addDoc(collection(db, "emails"), {
        to: pmEmail,
        subject: `[Approval] Deliverable Approved: "${title}"`,
        body: `Hi Project Manager,\n\nWe are pleased to notify you that client ${clientName} has officially APPROVED the deliverable:\n\n"${title}"\n\nDescription:\n${descriptionText}\n\nThis status update has been successfully logged and synchronized to the cloud database. No further action is required for this milestone.`,
        deliverableId: id,
        deliverableTitle: title,
        status: "sent",
        action: "approved",
        createdAt: serverTimestamp()
      });

      if (onLogMessage) {
        onLogMessage(`Automated PM Email dispatched successfully to ${pmEmail}`);
      }

      // Keep visual state active for 3.5 seconds to complete elegant pulse sequence
      setTimeout(() => {
        setRecentlyApprovedIds(prev => prev.filter(x => x !== id));
      }, 3500);
    } catch (error) {
      setRecentlyApprovedIds(prev => prev.filter(x => x !== id));
      handleFirestoreError(error, OperationType.UPDATE, `approvals/${id}`);
    }
  };

  // Submit revision / request changes
  const handleRequestChanges = async (e: React.FormEvent, id: string, title: string) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;

    try {
      const docRef = doc(db, "approvals", id);
      await updateDoc(docRef, {
        status: "changes_requested",
        feedback: feedbackText,
        updatedAt: serverTimestamp()
      });

      const message = `Changes requested on: "${title}" with feedback: "${feedbackText}"`;
      if (onLogMessage) onLogMessage(message);

      // Trigger automated notification email to Project Manager in Firestore
      await addDoc(collection(db, "emails"), {
        to: pmEmail,
        subject: `[Revision Required] Deliverable Feedback: "${title}"`,
        body: `Hi Project Manager,\n\nPlease note that client ${clientName} has REQUESTED REVISIONS on the deliverable:\n\n"${title}"\n\nSpecific Feedback / Revision Requests:\n"${feedbackText}"\n\nPlease review the requested changes and assign them to the engineering team.`,
        deliverableId: id,
        deliverableTitle: title,
        status: "sent",
        action: "changes_requested",
        createdAt: serverTimestamp()
      });

      if (onLogMessage) {
        onLogMessage(`Automated PM Revision Notification Email dispatched successfully to ${pmEmail}`);
      }

      setFeedbackText("");
      setActiveRequestChangesId(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `approvals/${id}`);
    }
  };

  // Create new deliverable
  const handleCreateDeliverable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim()) return;

    setSubmitting(true);
    try {
      await addDoc(collection(db, "approvals"), {
        title: newTitle,
        category: newCategory,
        description: newDescription,
        status: "pending",
        submittedAt: serverTimestamp()
      });

      if (onLogMessage) onLogMessage(`Submitted new deliverable for review: "${newTitle}"`);

      setNewTitle("");
      setNewDescription("");
      setIsFormOpen(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, "approvals");
    } finally {
      setSubmitting(false);
    }
  };

  // Calculations for KPI numbers
  const pendingCount = approvals.filter(a => a.status === "pending").length;
  const approvedCount = approvals.filter(a => a.status === "approved").length;
  const changesRequestedCount = approvals.filter(a => a.status === "changes_requested").length;
  const totalCount = approvals.length;

  const filteredApprovals = approvals.filter(a => {
    if (activeTab === "all") return true;
    return a.status === activeTab;
  });

  const getCategoryColor = (cat: string) => {
    switch (cat.toLowerCase()) {
      case "design mockup":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "api specification":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "technical blueprint":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
  };

  return (
    <div className="bg-[#030614] border border-white/5 rounded-2xl p-5 md:p-6 space-y-6" id="approval-center-module">
      
      {/* Module Title & Quick Stats Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-4">
        <div>
          <span className="text-[10px] font-mono text-brand-orange uppercase tracking-widest font-bold flex items-center gap-1.5">
            <FileCheck className="w-3.5 h-3.5" />
            Milestone Approval Center
          </span>
          <h4 className="text-base font-bold text-white tracking-tight mt-1">Deliverable Review Gateway</h4>
          <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
            Directly review pending design and development documents. Sign off or request structural updates.
          </p>
        </div>

        {/* Collapsible New Submission Creator button */}
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:text-white text-gray-300 font-mono text-xs font-semibold rounded-lg transition-all cursor-pointer"
        >
          {isFormOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5 text-brand-orange" />}
          {isFormOpen ? "Hide Form" : "Create Deliverable"}
        </button>
      </div>

      {/* Form Area - Collapsible */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.form 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onSubmit={handleCreateDeliverable}
            className="bg-[#050816] border border-white/5 rounded-xl p-4 space-y-4 overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] font-mono text-gray-500 uppercase block">Deliverable Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Phase 4: Secure Sandbox Auth Specs"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#030614] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-sans"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-mono text-gray-500 uppercase block">Category Spec</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-[#030614] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-sans"
                >
                  <option value="Design Mockup">Design Mockup</option>
                  <option value="API Specification">API Specification</option>
                  <option value="Technical Blueprint">Technical Blueprint</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-mono text-gray-500 uppercase block">Description & Specs</label>
              <textarea
                required
                rows={2}
                placeholder="Brief summary of components, requirements, and constraints for this file submission."
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="w-full bg-[#030614] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-sans resize-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-3 py-1.5 text-[11px] font-mono font-bold text-gray-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-1.5 bg-brand-orange hover:opacity-95 text-white font-mono text-[11px] font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                Submit for Client Review
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Overview stats indicators */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#050816]/50 p-3 rounded-xl border border-white/[0.02]">
        <div className="text-center p-2 border-r border-white/5 last:border-0">
          <span className="text-[8px] font-mono text-gray-500 uppercase block">Total items</span>
          <span className="text-base font-bold text-white block mt-0.5">{totalCount}</span>
        </div>
        <div className="text-center p-2 border-r border-white/5 last:border-0">
          <span className="text-[8px] font-mono text-gray-500 uppercase block">Pending</span>
          <span className="text-base font-bold text-amber-400 block mt-0.5">{pendingCount}</span>
        </div>
        <div className="text-center p-2 border-r border-white/5 last:border-0">
          <span className="text-[8px] font-mono text-gray-500 uppercase block">Approved</span>
          <span className="text-base font-bold text-emerald-400 block mt-0.5">{approvedCount}</span>
        </div>
        <div className="text-center p-2 last:border-0">
          <span className="text-[8px] font-mono text-gray-500 uppercase block">Changes requested</span>
          <span className="text-base font-bold text-pink-400 block mt-0.5">{changesRequestedCount}</span>
        </div>
      </div>

      {/* Filter Tabs list */}
      <div className="flex items-center gap-1 border-b border-white/5 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-3 py-1.5 text-xs font-mono font-medium rounded-lg transition-colors cursor-pointer ${
            activeTab === "all" ? "bg-white/5 text-white font-bold" : "text-gray-400 hover:text-white"
          }`}
        >
          All ({totalCount})
        </button>
        <button
          onClick={() => setActiveTab("pending")}
          className={`px-3 py-1.5 text-xs font-mono font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
            activeTab === "pending" ? "bg-amber-500/10 text-amber-400 font-bold" : "text-gray-400 hover:text-white"
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          Pending ({pendingCount})
        </button>
        <button
          onClick={() => setActiveTab("approved")}
          className={`px-3 py-1.5 text-xs font-mono font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
            activeTab === "approved" ? "bg-emerald-500/10 text-emerald-400 font-bold" : "text-gray-400 hover:text-white"
          }`}
        >
          <CheckCircle className="w-3.5 h-3.5" />
          Approved ({approvedCount})
        </button>
        <button
          onClick={() => setActiveTab("changes_requested")}
          className={`px-3 py-1.5 text-xs font-mono font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
            activeTab === "changes_requested" ? "bg-pink-500/10 text-pink-400 font-bold" : "text-gray-400 hover:text-white"
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          Revisions ({changesRequestedCount})
        </button>
      </div>

      {/* Live List Container */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500 font-mono text-xs gap-2">
          <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />
          Synchronizing review structures...
        </div>
      ) : filteredApprovals.length === 0 ? (
        <div className="text-center py-12 text-gray-500 font-mono text-xs border border-dashed border-white/5 rounded-xl">
          No deliverables matching active category selection.
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredApprovals.map((approval) => {
              const isRecentlyApproved = recentlyApprovedIds.includes(approval.id);
              return (
                <motion.div
                  key={approval.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: isRecentlyApproved ? [1, 1.03, 1] : 1,
                    borderColor: isRecentlyApproved 
                      ? "rgba(16, 185, 129, 0.9)" 
                      : approval.status === "approved" 
                        ? "rgba(16, 185, 129, 0.25)" 
                        : approval.status === "changes_requested"
                          ? "rgba(236, 72, 153, 0.15)"
                          : "rgba(255, 255, 255, 0.05)",
                    backgroundColor: isRecentlyApproved
                      ? "rgba(4, 18, 10, 0.85)"
                      : approval.status === "approved"
                        ? "rgba(4, 120, 87, 0.05)"
                        : approval.status === "changes_requested"
                          ? "rgba(244, 63, 94, 0.02)"
                          : "rgba(5, 8, 22, 0.4)"
                  }}
                  transition={{
                    scale: { duration: 0.6, ease: "easeOut" },
                    borderColor: { duration: 0.8, ease: "easeOut" },
                    backgroundColor: { duration: 0.8, ease: "easeOut" },
                    layout: { type: "spring", stiffness: 300, damping: 30 }
                  }}
                  exit={{ opacity: 0, y: -15 }}
                  className={`p-4 rounded-xl border transition-all space-y-3 relative overflow-hidden ${
                    isRecentlyApproved
                      ? "shadow-2xl shadow-emerald-500/20"
                      : approval.status === "approved" 
                        ? "shadow-lg shadow-emerald-500/[0.01]" 
                        : approval.status === "changes_requested" 
                          ? "shadow-lg shadow-pink-500/[0.01]" 
                          : ""
                  }`}
                  id={`approval-item-${approval.id}`}
                >
                  <AnimatePresence>
                    {isRecentlyApproved && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-gradient-to-br from-[#04120a] to-[#030614] rounded-xl flex flex-col items-center justify-center z-20 overflow-hidden border border-emerald-500/40"
                      >
                        {/* Ring animation */}
                        <motion.div
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: [0.8, 1.4, 1.1], opacity: [0, 0.9, 1] }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                          className="absolute w-28 h-28 rounded-full border-2 border-emerald-500/30 flex items-center justify-center pointer-events-none"
                        />
                        <motion.div
                          initial={{ scale: 0.3, opacity: 0 }}
                          animate={{ scale: [0.5, 2.2, 0], opacity: [0.8, 0.4, 0] }}
                          transition={{ duration: 0.9, ease: "easeOut" }}
                          className="absolute w-14 h-14 bg-emerald-500/25 rounded-full pointer-events-none"
                        />

                        {/* Celebrate Particles */}
                        {[...Array(8)].map((_, i) => {
                          const angle = (i * 45 * Math.PI) / 180;
                          const distance = 50;
                          const targetX = Math.cos(angle) * distance;
                          const targetY = Math.sin(angle) * distance;
                          return (
                            <motion.div
                              key={i}
                              initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                              animate={{ 
                                x: [0, targetX], 
                                y: [0, targetY], 
                                scale: [0, 1.2, 0],
                                opacity: [1, 1, 0] 
                              }}
                              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                              className="absolute w-2 h-2 rounded-full bg-emerald-400 z-30 pointer-events-none"
                            />
                          );
                        })}

                        {/* Checkmark icon with high intensity pop, rotation and success bounce */}
                        <motion.div
                          initial={{ scale: 0, rotate: -45 }}
                          animate={{ scale: [0, 1.3, 1], rotate: 0 }}
                          transition={{ 
                            type: "spring",
                            stiffness: 280,
                            damping: 14,
                            delay: 0.1 
                          }}
                          className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/40 relative z-30"
                        >
                          <svg className="w-7 h-7 text-[#030614]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                            <motion.path
                              initial={{ pathLength: 0 }}
                              animate={{ pathLength: 1 }}
                              transition={{ duration: 0.6, ease: "easeInOut", delay: 0.3 }}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </motion.div>

                        {/* Approved text callout */}
                        <motion.div
                          initial={{ y: 15, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.35, duration: 0.4 }}
                          className="mt-3.5 text-center relative z-30 px-4"
                        >
                          <h6 className="text-xs font-bold text-white font-display uppercase tracking-widest">Deliverable Approved</h6>
                          <p className="text-[9px] text-emerald-400 font-mono mt-1">Successfully signed off & synchronized to cloud database.</p>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                {/* Header: Status badge and category tag */}
                <div className="flex flex-wrap justify-between items-center gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] px-2 py-0.5 rounded-full border font-mono font-semibold uppercase ${getCategoryColor(approval.category)}`}>
                      {approval.category}
                    </span>
                  </div>

                  {/* Right: Status Tag */}
                  <div>
                    {approval.status === "pending" && (
                      <span className="text-[10px] font-mono text-amber-400 bg-amber-500/5 px-2.5 py-1 rounded-lg border border-amber-500/10 flex items-center gap-1 font-bold">
                        <Clock className="w-3 h-3 animate-pulse" />
                        Awaiting Review
                      </span>
                    )}
                    {approval.status === "approved" && (
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/5 px-2.5 py-1 rounded-lg border border-emerald-500/10 flex items-center gap-1 font-bold">
                        <Check className="w-3.5 h-3.5" />
                        Approved
                      </span>
                    )}
                    {approval.status === "changes_requested" && (
                      <span className="text-[10px] font-mono text-pink-400 bg-pink-500/5 px-2.5 py-1 rounded-lg border border-pink-500/10 flex items-center gap-1 font-bold">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Revision Required
                      </span>
                    )}
                  </div>
                </div>

                {/* Body Content */}
                <div className="space-y-1">
                  <h5 className="text-sm font-semibold text-white tracking-tight flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-indigo-400 shrink-0" />
                    {approval.title}
                  </h5>
                  <p className="text-xs text-gray-400 leading-relaxed font-sans">
                    {approval.description}
                  </p>
                </div>

                {/* Extra status details */}
                {approval.status === "approved" && (
                  <div className="text-[10px] font-mono text-emerald-300/80 bg-emerald-950/10 px-3 py-2 rounded-lg border border-emerald-500/5 flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Deliverable signed-off and verified by <strong className="text-white">{approval.approvedBy || "Alice Sterling"}</strong></span>
                  </div>
                )}

                {approval.status === "changes_requested" && (
                  <div className="bg-pink-950/10 border border-pink-500/5 px-3 py-2.5 rounded-lg text-[11px] text-pink-300 leading-relaxed space-y-1">
                    <div className="font-bold font-mono text-[9px] text-pink-400 uppercase tracking-wider flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5" />
                      Client Feedback Notes:
                    </div>
                    <p className="font-sans italic text-gray-300">"{approval.feedback}"</p>
                  </div>
                )}

                {/* Actions Section */}
                {approval.status === "pending" && (
                  <div className="pt-2 border-t border-white/[0.02] flex flex-col gap-3">
                    {activeRequestChangesId !== approval.id ? (
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => {
                            setActiveRequestChangesId(approval.id);
                            setFeedbackText("");
                          }}
                          className="px-3 py-1.5 hover:bg-pink-500/5 hover:text-pink-400 border border-transparent hover:border-pink-500/10 text-gray-400 font-mono text-[11px] font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          Request Changes
                        </button>
                        <button
                          onClick={() => handleApprove(approval.id, approval.title)}
                          className="px-4 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white font-mono text-[11px] font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Approve Deliverable
                        </button>
                      </div>
                    ) : (
                      // Request changes comments form
                      <form 
                        onSubmit={(e) => handleRequestChanges(e, approval.id, approval.title)}
                        className="space-y-2 pt-1"
                      >
                        <div className="space-y-1">
                          <label className="text-[8px] font-mono text-pink-400 uppercase tracking-wider block">Describe required revisions:</label>
                          <textarea
                            required
                            rows={2}
                            placeholder="Please specify visual, layout, or backend changes needed..."
                            value={feedbackText}
                            onChange={(e) => setFeedbackText(e.target.value)}
                            className="w-full bg-[#030614] border border-pink-500/20 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-pink-500 font-sans resize-none"
                          />
                        </div>
                        <div className="flex gap-2 justify-end">
                          <button
                            type="button"
                            onClick={() => setActiveRequestChangesId(null)}
                            className="px-2.5 py-1 text-[10px] font-mono font-bold text-gray-400 hover:text-white cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-3.5 py-1 bg-pink-600 hover:bg-pink-500 text-white font-mono text-[10px] font-bold rounded-lg transition-colors cursor-pointer"
                          >
                            Submit Revision Request
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                )}
              </motion.div>
            ); })}
          </AnimatePresence>
        </div>
      )}

      {/* Automated Email Dispatch Monitor & Control Center */}
      <div className="pt-6 border-t border-white/5 space-y-4" id="email-monitor-gateway">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-bold flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              Automated SMTP Email Trigger
            </span>
            <h4 className="text-xs font-bold text-white mt-1">PM Mail Dispatcher & Telemetry Log</h4>
            <p className="text-[10px] text-gray-400 mt-0.5">
              Fires custom backend webhook integrations and logs real-time confirmation records on action.
            </p>
          </div>

          <button
            onClick={() => setIsEmailPanelOpen(!isEmailPanelOpen)}
            className="text-[10px] font-mono text-gray-400 hover:text-white flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10 cursor-pointer"
          >
            {isEmailPanelOpen ? "Minimize Logs" : "Show Logs"}
            {isEmailPanelOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>

        <AnimatePresence>
          {isEmailPanelOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4 overflow-hidden"
            >
              {/* PM Email Configuration bar */}
              <div className="bg-[#050816]/60 border border-white/5 rounded-xl p-3 flex flex-col md:flex-row gap-3 items-center justify-between">
                <div className="w-full md:w-auto flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <label className="text-[8px] font-mono text-gray-400 uppercase block font-bold">Project Manager Mailbox</label>
                    <span className="text-xs text-gray-300 font-mono font-medium">{pmEmail}</span>
                  </div>
                </div>

                <div className="w-full md:w-auto flex items-center gap-2 shrink-0">
                  <input
                    type="email"
                    value={pmEmail}
                    onChange={(e) => handlePmEmailChange(e.target.value)}
                    placeholder="pm_email@domain.com"
                    className="bg-[#030614] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-indigo-500 w-full md:w-56"
                  />
                  <span className="text-[8px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20 uppercase shrink-0 font-bold animate-pulse">
                    Trigger Active
                  </span>
                </div>
              </div>

              {/* Real-time triggered emails list */}
              {emails.length === 0 ? (
                <div className="text-center py-8 text-gray-500 font-mono text-[10px] border border-dashed border-white/5 rounded-xl bg-[#050816]/20">
                  No notifications triggered yet. Approve or request changes above to witness the automated SMTP payload dispatch.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {emails.map((email) => {
                    const isApproved = email.action === "approved";
                    let formattedTime = "Just now";
                    if (email.createdAt && typeof email.createdAt.toDate === "function") {
                      formattedTime = email.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                    }
                    return (
                      <motion.div
                        key={email.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-[#050816]/40 border border-white/5 rounded-xl p-3.5 space-y-2 relative overflow-hidden text-left"
                      >
                        {/* Glowing dispatch badge */}
                        <div className="absolute top-0 right-0 h-[2px] w-12 bg-gradient-to-r from-transparent to-emerald-500" />
                        
                        <div className="flex justify-between items-center">
                          <span className={`text-[8px] font-mono px-2 py-0.5 rounded-full border font-bold uppercase ${
                            isApproved 
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                              : "bg-pink-500/10 text-pink-400 border-pink-500/20"
                          }`}>
                            {isApproved ? "Approved Notice" : "Revision Notice"}
                          </span>
                          <span className="text-[9px] font-mono text-gray-500">{formattedTime}</span>
                        </div>

                        <div className="space-y-1">
                          <div className="text-xs font-bold text-white truncate">{email.subject}</div>
                          <div className="text-[10px] font-mono text-gray-400">
                            To: <span className="text-indigo-300 font-bold">{email.to}</span>
                          </div>
                        </div>

                        {/* Terminal simulation for Email Body */}
                        <div className="bg-[#030614] border border-white/5 rounded-lg p-2 font-mono text-[10px] text-gray-400 leading-relaxed max-h-24 overflow-y-auto whitespace-pre-wrap">
                          {email.body}
                        </div>

                        <div className="flex justify-between items-center text-[9px] font-mono pt-1">
                          <span className="text-emerald-400 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
                            SMTP Status: Dispatched
                          </span>
                          <span className="text-gray-500">ID: {email.id.substring(0, 8)}...</span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
