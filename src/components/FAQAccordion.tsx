import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ChevronDown, 
  Search, 
  ThumbsUp, 
  Share2, 
  Sparkles, 
  HelpCircle, 
  Info, 
  Check, 
  ExternalLink,
  Cpu,
  Lock,
  Zap,
  DollarSign
} from "lucide-react";

export interface FAQItem {
  id: string;
  category: string;
  question: string;
  shortAnswer: string;
  longAnswer: string;
  relatedIds: string[];
}

const FAQ_DATA: FAQItem[] = [
  {
    id: "engagement-process",
    category: "Engagement",
    question: "How do we begin a project engagement with Zealguy Venture?",
    shortAnswer: "Engagement begins with our Interactive Project Discovery Wizard or a 30-minute discovery call. We synthesize a complete, customized system specification and architecture blueprint before drafting a master service agreement.",
    longAnswer: "Our engagement lifecycle is split into 4 key phases: 1) Neural Synthesis (gathering parameters through our AI Wizard); 2) Architectural Blueprinting (mapping database schemas, CDNs, and UI models); 3) Sprint-based Development (weekly milestones with live sandbox previews); and 4) Orchestrated Launch (comprehensive stress tests, HIPAA auditing, and cloud hand-off). We ensure full code ownership is transferred directly to your organization.",
    relatedIds: ["project-pricing", "delivery-timeline"]
  },
  {
    id: "project-pricing",
    category: "Pricing",
    question: "What pricing models do you offer for enterprise software?",
    shortAnswer: "We offer milestone-based fixed pricing, dedicated squad retention, and customized enterprise SLA models. All quotes are entirely transparent with zero hidden support costs.",
    longAnswer: "We align pricing directly to software scope and target complexity. For standard MVP modules, we use fixed-price milestones with 30% upfront and remaining split by major feature delivery. For ongoing enterprise systems, we supply a dedicated squad (Product Owner, Lead Architect, 2-3 Fullstack Engineers) billed monthly. Custom SLA support models start at $2,500/month with guaranteed 1-hour critical response windows.",
    relatedIds: ["engagement-process", "ip-ownership"]
  },
  {
    id: "tech-performance",
    category: "Technology",
    question: "What does 'sub-0.5s pre-rendered platforms' mean for our business?",
    shortAnswer: "It means your web system loads instantly. We utilize advanced edge-cached static generation (SSG) combined with lazy-loaded dynamic microfrontends, maximizing SEO and user retention.",
    longAnswer: "Traditional single-page applications suffer from slow 'first contentful paint' times. Our architecture pre-renders the entire visual framework on global edge CDNs. Dynamic user data is fetched asynchronously via edge-optimized serverless routes, resulting in nearly zero load latency. This translates to an average 35% reduction in page bounce rates and higher conversion funnel efficiency.",
    relatedIds: ["security-hipaa"]
  },
  {
    id: "security-hipaa",
    category: "Security",
    question: "How do you handle security, data privacy, and HIPAA compliance?",
    shortAnswer: "We construct secure, end-to-end encrypted databases, automated SSL certificates, role-based access control (RBAC), and fully-isolated database virtual clouds (VPC).",
    longAnswer: "Security is baked into our foundation. For medical/biometric systems, we enforce end-to-end data encryption at rest (using AES-256) and in transit (using TLS 1.3). We structure custom Firestore or SQL security rules matching strict HIPAA regulations, implement automated secure JWT-session handling, and run daily automated penetration testing. All database instances are housed within dedicated Google Cloud VPCs.",
    relatedIds: ["tech-performance", "ip-ownership"]
  },
  {
    id: "ip-ownership",
    category: "Engagement",
    question: "Do we retain full intellectual property (IP) and source code ownership?",
    shortAnswer: "Yes. Once the final milestone of the project is delivered and signed off, complete ownership of the repository, assets, and database architecture is legally transferred to you.",
    longAnswer: "Unlike agencies that trap clients with proprietary hosting or licensing fees, we build entirely on industry-standard open-source stacks. All codebase repositories on GitHub/GitLab are handed off to your corporate organization with detailed system administration guides, architecture maps, and environment instructions.",
    relatedIds: ["engagement-process", "project-pricing"]
  },
  {
    id: "delivery-timeline",
    category: "Technology",
    question: "What is the typical timeline for an enterprise system rollout?",
    shortAnswer: "Most specialized modules or platforms launch within 6 to 12 weeks. We maintain a strict sprint cycle with real-time sandbox access for absolute transparency.",
    longAnswer: "Our standardized development pipeline runs on 2-week agile sprints. You receive a dedicated staging environment (e.g., Vercel, Cloud Run) where you can audit working code updates in real-time. A standard multi-user system typically goes from discovery call to live deployment in 8 weeks, including visual layouts, database setup, and payment pipelines.",
    relatedIds: ["engagement-process", "tech-performance"]
  }
];

const CATEGORIES = ["All", "Engagement", "Technology", "Pricing", "Security"];

export interface FAQAccordionProps {
  onTriggerConsultation?: () => void;
}

export default function FAQAccordion({ onTriggerConsultation }: FAQAccordionProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  // Local state for votes & sharing animations
  const [votes, setVotes] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem("faq_votes");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [votedIds, setVotedIds] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [aiExpandedIds, setAiExpandedIds] = useState<Record<string, boolean>>({});
  const [aiGeneratingId, setAiGeneratingId] = useState<string | null>(null);

  // Filter FAQs based on category & search query
  const filteredFAQs = useMemo(() => {
    return FAQ_DATA.filter((faq) => {
      const matchesCategory = selectedCategory === "All" || faq.category === selectedCategory;
      const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            faq.shortAnswer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            faq.longAnswer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleVote = (id: string) => {
    if (votedIds.includes(id)) return;
    
    const newVotes = { ...votes, [id]: (votes[id] || 0) + 1 };
    setVotes(newVotes);
    setVotedIds([...votedIds, id]);
    try {
      localStorage.setItem("faq_votes", JSON.stringify(newVotes));
    } catch (e) {
      console.warn("Storage write failed:", e);
    }
  };

  const handleShare = (id: string) => {
    const url = `${window.location.origin}${window.location.pathname}#faq-${id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }).catch(err => {
      console.error("Clipboard write failed:", err);
    });
  };

  // Simulated AI reasoning deep dive with custom typewriter effect
  const handleAIExpand = (id: string) => {
    if (aiGeneratingId) return;
    
    setAiGeneratingId(id);
    setTimeout(() => {
      setAiExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
      setAiGeneratingId(null);
    }, 1200);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Engagement": return <Cpu className="w-3.5 h-3.5 text-blue-400" />;
      case "Technology": return <Zap className="w-3.5 h-3.5 text-brand-orange" />;
      case "Pricing": return <DollarSign className="w-3.5 h-3.5 text-emerald-400" />;
      case "Security": return <Lock className="w-3.5 h-3.5 text-purple-400" />;
      default: return <HelpCircle className="w-3.5 h-3.5 text-gray-400" />;
    }
  };

  return (
    <div className="w-full bg-[#030614]/50 border-t border-white/5 py-24 relative overflow-hidden" id="faq-section">
      {/* Background visual accents */}
      <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-brand-orange/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <span className="text-[10px] font-mono text-brand-orange uppercase tracking-widest font-bold flex items-center justify-center gap-1.5">
            <Info className="w-3.5 h-3.5" />
            Clear Transparency Blueprint
          </span>
          <h2 className="text-3xl font-bold text-white tracking-tight font-display">
            Frequently Asked Inquiries
          </h2>
          <p className="text-xs text-gray-400 leading-relaxed font-sans">
            Have questions about code handoff, HIPAA cloud infrastructure, or dynamic sprint-based pricing models? Find comprehensive engineering answers here.
          </p>
        </div>

        {/* Search & Categories Bar */}
        <div className="space-y-4 mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search specific technical keywords (compliance, code transfer, squads...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-[#050816]/80 border border-white/10 rounded-[20px] text-gray-200 placeholder-gray-500 text-xs focus:outline-none focus:border-brand-orange/50 transition-all font-mono"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 justify-center">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`h-12 min-h-[48px] px-5 py-3 font-mono text-[10px] uppercase font-bold rounded-[14px] transition-all cursor-pointer flex items-center justify-center ${
                  selectedCategory === category
                    ? "bg-brand-orange/15 border border-brand-orange/30 text-brand-orange"
                    : "bg-[#050816] border border-white/5 text-gray-400 hover:text-white"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredFAQs.length > 0 ? (
              filteredFAQs.map((faq) => {
                const isExpanded = expandedId === faq.id;
                const isAiExpanded = aiExpandedIds[faq.id];
                const currentVoteCount = votes[faq.id] || 0;
                const hasVoted = votedIds.includes(faq.id);

                return (
                  <motion.div
                    key={faq.id}
                    layoutId={`faq-card-${faq.id}`}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className={`border rounded-[24px] overflow-hidden transition-all duration-300 ${
                      isExpanded 
                        ? "bg-[#060a1e]/90 border-white/15 shadow-xl shadow-black/40" 
                        : "bg-[#030614]/80 border-white/5 hover:border-white/10"
                    }`}
                    id={`faq-${faq.id}`}
                  >
                    {/* Header/Question Trigger */}
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : faq.id)}
                      className="w-full px-6 py-5 flex items-center justify-between text-left gap-4 cursor-pointer focus:outline-none"
                    >
                      <div className="flex items-center gap-3">
                        <span className="p-2 bg-white/[0.02] border border-white/5 rounded-[12px] shrink-0">
                          {getCategoryIcon(faq.category)}
                        </span>
                        <span className="text-sm font-semibold text-white tracking-tight hover:text-brand-orange transition-colors font-display">
                          {faq.question}
                        </span>
                      </div>
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="text-gray-500 hover:text-white shrink-0"
                      >
                        <ChevronDown className="w-5 h-5" />
                      </motion.div>
                    </button>

                    {/* Accordion Content Panel */}
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ 
                            height: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
                            opacity: { duration: 0.3, delay: 0.1, ease: "easeOut" }
                          }}
                        >
                          <div className="px-6 pb-5 pt-1 border-t border-white/5 space-y-4">
                            
                            {/* Short Answer (Visual Emphasis) */}
                            <p className="text-xs text-gray-300 leading-relaxed font-sans">
                              {faq.shortAnswer}
                            </p>

                            {/* Deep Dive Action (AI Expand) */}
                            <div className="bg-[#030614] border border-white/5 rounded-[18px] p-4 relative overflow-hidden">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                                  <Cpu className="w-3.5 h-3.5 text-purple-400" />
                                  Architectural Deep Dive
                                </span>
                                
                                <button
                                  onClick={() => handleAIExpand(faq.id)}
                                  disabled={aiGeneratingId === faq.id}
                                  className="h-12 min-h-[48px] px-4 py-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 text-xs font-mono rounded-[12px] flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                                >
                                  {aiGeneratingId === faq.id ? (
                                    <>
                                      <div className="w-2.5 h-2.5 rounded-full border border-purple-400 border-t-transparent animate-spin" />
                                      Analyzing...
                                    </>
                                  ) : (
                                    <>
                                      <Sparkles className="w-3 h-3 text-purple-400" />
                                      {isAiExpanded ? "Collapse Specs" : "Run Deep Dive"}
                                    </>
                                  )}
                                </button>
                              </div>

                              <AnimatePresence>
                                {isAiExpanded && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{
                                      height: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
                                      opacity: { duration: 0.25, delay: 0.08, ease: "easeOut" }
                                    }}
                                    className="text-[11px] text-gray-400 leading-relaxed font-sans mt-2 pt-2 border-t border-white/5 space-y-2"
                                  >
                                    <p>{faq.longAnswer}</p>
                                    <div className="flex items-center gap-1.5 text-[10px] text-brand-orange font-mono font-semibold pt-1">
                                      <Check className="w-3.5 h-3.5" /> Full Enterprise Standards Met
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>

                            {/* Interactive Footer (Helpful & Share & Related) */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-3 border-t border-white/5 text-[10px] font-mono">
                              
                              {/* Related Questions links */}
                              <div className="flex items-center gap-1.5 text-gray-500">
                                <span>Related:</span>
                                <div className="flex gap-2">
                                  {faq.relatedIds.map((relId) => {
                                    const relFaq = FAQ_DATA.find((f) => f.id === relId);
                                    if (!relFaq) return null;
                                    return (
                                      <button
                                        key={relId}
                                        onClick={() => setExpandedId(relId)}
                                        className="text-blue-400 hover:text-blue-300 underline cursor-pointer"
                                      >
                                        {relFaq.question.slice(0, 18)}...
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* Interactive Actions */}
                              <div className="flex items-center gap-3 ml-auto sm:ml-0">
                                
                                {/* Helpful Vote */}
                                <button
                                  onClick={() => handleVote(faq.id)}
                                  className={`flex items-center justify-center gap-1.5 h-12 min-h-[48px] px-4 rounded-[12px] transition-all cursor-pointer ${
                                    hasVoted 
                                      ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" 
                                      : "bg-white/[0.02] border border-white/5 text-gray-500 hover:text-gray-300"
                                  }`}
                                >
                                  <ThumbsUp className="w-3.5 h-3.5" />
                                  <span>Helpful ({currentVoteCount})</span>
                                </button>

                                {/* Share anchor */}
                                <button
                                  onClick={() => handleShare(faq.id)}
                                  className="flex items-center justify-center gap-1.5 h-12 min-h-[48px] px-4 bg-white/[0.02] border border-white/5 text-gray-500 hover:text-gray-300 rounded-[12px] transition-all cursor-pointer"
                                >
                                  {copiedId === faq.id ? (
                                    <>
                                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                                      <span className="text-emerald-400">Copied!</span>
                                    </>
                                  ) : (
                                    <>
                                      <Share2 className="w-3.5 h-3.5" />
                                      <span>Share Link</span>
                                    </>
                                  )}
                                </button>

                              </div>

                            </div>

                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })
            ) : (
              <div className="w-full text-center py-12 border border-dashed border-white/5 rounded-[24px] bg-[#030614]/40">
                <p className="text-xs text-gray-500 font-mono">No matching inquiries found in this category.</p>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Still have questions footer callout */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12 p-6 rounded-[24px] bg-gradient-to-r from-blue-950/40 to-indigo-950/40 border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left"
        >
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white tracking-tight font-display">Still have unanswered questions?</h4>
            <p className="text-xs text-gray-400 font-sans max-w-md">
              Our engineering architects are here to guide you. Initiate an interactive discovery session or request a synthesized blueprint of your custom requirements.
            </p>
          </div>
          <button
            onClick={onTriggerConsultation}
            className="h-12 min-h-[48px] px-6 bg-gradient-to-r from-brand-orange to-amber-500 hover:from-brand-orange/95 hover:to-amber-500/95 text-white font-mono text-xs font-bold rounded-[18px] transition-all cursor-pointer active:scale-[0.98] shadow-lg shadow-brand-orange/15 whitespace-nowrap shrink-0 flex items-center justify-center"
          >
            Book Consultation
          </button>
        </motion.div>

      </div>
    </div>
  );
}
