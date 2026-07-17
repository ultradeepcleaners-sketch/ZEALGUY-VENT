import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { db, handleFirestoreError, OperationType, ensureAnonymousSession } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import confetti from "canvas-confetti";
import { 
  Laptop, 
  Smartphone, 
  Tablet,
  ExternalLink, 
  RotateCw, 
  Monitor, 
  Compass, 
  ShieldCheck, 
  ShoppingBag, 
  Check, 
  CheckCircle, 
  Flame, 
  Clock, 
  Sparkles, 
  Info, 
  X, 
  ArrowUpRight,
  Activity,
  MessageSquare,
  Play,
  Copy
} from "lucide-react";

interface PortfolioItem {
  id: string;
  name: string;
  slogan: string;
  description: string;
  industry: string;
  completionDate: string;
  category: string;
  allCategories: string[];
  accentColor: string;
  mockUrl: string;
  liveUrl?: string; // undefined means COMING SOON
  progress?: number;
  aboutClient: string;
  businessGoals: string;
  challenge: string;
  solution: string;
  features: string[];
  techStack: string[];
  results: {
    loadingSpeed: string;
    conversion: string;
    seoScore: string;
    salesIncrease?: string;
  };
  testimonial: {
    feedback: string;
    clientName: string;
    role: string;
  };
  timeline?: { phase: string; status: "completed" | "active" | "scheduled" }[];
  stats: { label: string; value: string }[];
}

const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    id: "immortal",
    name: "IMMORTAL Electronics",
    slogan: "Premium AI-Powered Electronics Marketplace",
    description: "An ultra-premium, high-velocity online marketplace for IMMORTAL Electronics, featuring automated AI catalog management and secure international checkout pipelines.",
    industry: "Consumer Electronics E-Commerce",
    completionDate: "May 2026",
    category: "E-commerce",
    allCategories: ["Website", "E-commerce", "Retail", "Corporate", "AI"],
    accentColor: "amber",
    mockUrl: "immortalelectronics.com",
    liveUrl: "https://immortalelectronics.com",
    aboutClient: "IMMORTAL Electronics is a premier distributor of high-end components and consumer audio rigs.",
    businessGoals: "To expand from physical retail spaces into a streamlined automated global merchant site.",
    challenge: "Suffered from slow catalog lookups, manual item uploads (taking hours), and high payment dropoffs.",
    solution: "Engineered a Next.js storefront with Stripe + regional mobile money, plus an AI agent that automatically describes and parses stock uploads.",
    features: ["AI Product Upload", "Admin Dashboard", "Mobile Responsive", "SEO Optimization", "Payment Integration", "WhatsApp Checkout Support", "Inventory Management", "Analytics Telemetry"],
    techStack: ["Next.js", "Node.js", "Supabase", "Stripe API", "Cloudflare CDN", "Tailwind CSS"],
    stats: [
      { label: "LOADING SPEED", value: "0.45s Avg" },
      { label: "SEO AUDIT SCORE", value: "100/100" },
      { label: "CONVERSION VELOCITY", value: "+4.2x Growth" }
    ],
    results: {
      loadingSpeed: "0.45s (Next.js Edge Caching)",
      conversion: "+312% in the first quarter",
      seoScore: "100/100 (Perfect Core Web Vitals)",
      salesIncrease: "+180% Year-over-Year"
    },
    testimonial: {
      feedback: "Zealguy Venture took our manual brick-and-mortar retail operations and translated them into an automated sales machine. Our catalog handles itself through AI, and our conversion rate is at an all-time high.",
      clientName: "Emmanuel Kojo",
      role: "Founder, IMMORTAL Electronics"
    }
  },
  {
    id: "saljays",
    name: "Saljays Bookshop",
    slogan: "Corporate + Educational Online Bookstore",
    description: "An interactive digital bookstore and inventory control hub that manages school supplies, educational text logs, and retail parent orders with automated WhatsApp forwarding.",
    industry: "Education & Literature",
    completionDate: "March 2026",
    category: "Retail",
    allCategories: ["Website", "E-commerce", "Retail", "School", "Corporate"],
    accentColor: "sky",
    mockUrl: "saljaysbookshop.com",
    liveUrl: "https://saljaysbookshop.com",
    aboutClient: "Saljays Bookshop serves school communities, local libraries, and private educational institutes with physical syllabus textbooks.",
    businessGoals: "To offer parents an instantaneous search engine to buy exact curriculum book sets securely.",
    challenge: "Customer inquiries clogged physical counters, and textbook allocations suffered frequent double-bookings.",
    solution: "Developed an instant category-search algorithm, custom WhatsApp order dispatch nodes, and direct mobile wallet billing sheets.",
    features: ["Online Catalog", "Admin Books Manager", "Mobile Responsive", "SEO Optimized", "WhatsApp Order Dispatch", "Real-Time Stock Counters", "Mobile Money Gateway"],
    techStack: ["React", "Firebase Store", "Tailwind CSS", "Vite", "Stripe API", "Google Maps"],
    stats: [
      { label: "CATALOG SEARCH", value: "Instantaneous" },
      { label: "ORDER LEAD TIME", value: "-75% Reduction" },
      { label: "ONLINE SATISFACTION", value: "98.7%" }
    ],
    results: {
      loadingSpeed: "0.6s (React Vite Bundle)",
      conversion: "+140% parent signups",
      seoScore: "96/100 (Perfect Accessibility)",
      salesIncrease: "+65% textbook packages sold"
    },
    testimonial: {
      feedback: "Parents can now check out their children's books in under a minute. The WhatsApp order dispatcher automatically coordinates with our logistics team without manual re-entry.",
      clientName: "Sarah Jay-Jones",
      role: "Operations Director, Saljays"
    }
  },
  {
    id: "dvventure",
    name: "DV Venture Limited",
    slogan: "Enterprise Corporate Advisory Flagship",
    description: "A high-end corporate presentation portal displaying enterprise project portfolios, infrastructure audits, and real-time consultation leads with high-fidelity transitions.",
    industry: "Business Consulting & Construction",
    completionDate: "January 2026",
    category: "Corporate",
    allCategories: ["Website", "Corporate", "Real Estate"],
    accentColor: "emerald",
    mockUrl: "dvventureltd.com",
    liveUrl: "https://dvventureltd.com",
    aboutClient: "DV Venture Limited is an infrastructure and strategic business development group working across regional real estate and industrial ventures.",
    businessGoals: "To present a bulletproof, institutional digital presence to international investors.",
    challenge: "Legacy web presence was slow, outdated, non-responsive, and failed to communicate their premium scale.",
    solution: "Constructed an immersive, motion-driven corporate flagship featuring rich typography, interactive project showcases, and a secure lead inquiry vault.",
    features: ["Interactive Projects Gallery", "Real-Time Inquiry Vault", "Fluid Framer Motion", "SEO Architecture", "Highly Responsive Layout", "Custom Client Testimonials"],
    techStack: ["React", "Vite", "Drizzle ORM", "Cloud SQL", "Tailwind CSS"],
    stats: [
      { label: "CORPORATE AUDIT", value: "Passed 100%" },
      { label: "INBOUND LEADS", value: "+240% Growth" },
      { label: "PAGE RESPONSE", value: "0.22s Edge" }
    ],
    results: {
      loadingSpeed: "0.22s (Global Edge Network)",
      conversion: "+240% inbound partnership calls",
      seoScore: "99/100 (Sleek Semantics)",
      salesIncrease: "3 major international project bids secured"
    },
    testimonial: {
      feedback: "We finally have a digital flagship that reflects our enterprise capability. Partner inquiries have spiked since our launch.",
      clientName: "Dennis Victor",
      role: "Managing Partner, DV Venture"
    }
  },
  {
    id: "frimbell",
    name: "Frimbell Collections",
    slogan: "Luxury Couture Fashion Boutique Flagship",
    description: "A highly visual luxury fashion apparel store featuring custom product customizers, 3D clothing viewports, and automated inventory sync.",
    industry: "Luxury Fashion & Apparel",
    completionDate: "UNDER DEVELOPMENT (90%)",
    category: "E-commerce",
    allCategories: ["Website", "E-commerce", "Retail"],
    accentColor: "pink",
    mockUrl: "frimbellcollections.com",
    liveUrl: undefined, // COMING SOON
    progress: 90,
    aboutClient: "Frimbell Collections is a luxury couture and trend-forward fashion label establishing their global e-commerce flagship.",
    businessGoals: "To deliver an immersive digital boutique experience that mirrors the personalized, high-touch luxury of their offline studios.",
    challenge: "Translating fabric textures and personalized sizing online without a physical showroom.",
    solution: "Zealguy Venture is tailoring a Next-generation shop with automated high-resolution asset zoom systems, detailed sizing guides, and 90% completion status.",
    features: ["Couture Customizer", "3D Apparel Previews", "Dynamic Sizing Guides", "Mobile Responsive", "Global Payment Rails", "Instant WhatsApp Concierge"],
    techStack: ["Next.js", "Supabase", "Three.js", "Stripe API", "Tailwind CSS", "Framer Motion"],
    stats: [
      { label: "COMPLETION STATUS", value: "90% Active" },
      { label: "TEST SPEED SCORE", value: "99/100" },
      { label: "EXPECTED REVENUE", value: "+200% Projected" }
    ],
    results: {
      loadingSpeed: "0.3s Projected",
      conversion: "TBD (Beta testing active)",
      seoScore: "98/100 (Pre-launch index ready)",
      salesIncrease: "500+ pre-registered buyers"
    },
    testimonial: {
      feedback: "Zealguy Venture is building something spectacular. The interactive previews are incredibly rich and the team's engineering velocity is unmatched.",
      clientName: "Abiola Frimbell",
      role: "Creative Director, Frimbell Collections"
    },
    timeline: [
      { phase: "Architecture Design & Wireframes", status: "completed" },
      { phase: "Interactive couture preview engine", status: "completed" },
      { phase: "Payment gateways & Inventory database integration", status: "active" },
      { phase: "Domain migration & Public deployment launch", status: "scheduled" }
    ]
  },
  {
    id: "elysian",
    name: "Elysian FinTech",
    slogan: "Predictive Decentralized Liquidity Pool Desktop",
    description: "Designed a premium financial analytics desk that renders high-precision vector maps of assets on visual canvas boards with real-time API sync.",
    industry: "Decentralized Finance",
    completionDate: "December 2025",
    category: "Finance",
    allCategories: ["Website", "Finance", "Dashboard", "AI"],
    accentColor: "indigo",
    mockUrl: "elysianfintech.io",
    liveUrl: "https://elysianfintech.io",
    aboutClient: "Elysian FinTech is an institutional blockchain indexer delivering liquidity stats directly into banking terminals.",
    businessGoals: "To build a real-time web portal capable of streaming millions of data points without causing UI latency.",
    challenge: "Standard socket wrappers caused layout locking on browser runtimes under heavy traffic spikes.",
    solution: "Engineered isolated web workers to compute canvas vector indices in the background, keeping the UI at a buttery 120 FPS.",
    features: ["Dynamic Candlestick Vectors", "Web Worker Processing", "Multi-Asset Indexing", "Enterprise API Gateway", "Ultra-Low Latency Sockets"],
    techStack: ["React", "D3.js", "WebSockets", "Node.js", "Vite", "Cloudflare"],
    stats: [
      { label: "TRANSACTIONS", value: "$4.2M/day" },
      { label: "PAGE SPEED", value: "98/100" },
      { label: "USER SATISFACTION", value: "99.4%" }
    ],
    results: {
      loadingSpeed: "0.35s",
      conversion: "120 FPS Rendering Speed sustained",
      seoScore: "98/100",
      salesIncrease: "+280% enterprise terminal signups"
    },
    testimonial: {
      feedback: "The canvas charts Zealguy Venture built are unparalleled. They handle millions of live index points without any stuttering on mobile or desktop.",
      clientName: "Alice Sterling",
      role: "VP of Engineering, Elysian"
    }
  },
  {
    id: "aegis",
    name: "Aegis MedTech Portal",
    slogan: "HIPAA Compliant Symptoms AI Portal",
    description: "Constructed deep reasoning clinical triage pipelines that process electronic records instantaneously with multi-layer TLS security and clinical logs.",
    industry: "Healthcare Technology",
    completionDate: "October 2025",
    category: "Healthcare",
    allCategories: ["Website", "Healthcare", "AI", "Dashboard"],
    accentColor: "emerald",
    mockUrl: "aegishealth.ai",
    liveUrl: "https://aegishealth.ai",
    aboutClient: "Aegis MedTech delivers cloud software to clinics looking to streamline emergency room symptoms pre-screening.",
    businessGoals: "To reduce clinic check-in friction by pre-triaging patient files securely.",
    challenge: "Strict healthcare guidelines required total data separation and complete audit records of every AI analysis.",
    solution: "Engineered single-tenant Firestore isolation schemas with encrypted audit logs and offline-first queue syncing.",
    features: ["Clinical AI Classifier", "HIPAA Compliant Vaults", "Dynamic Doctor Schedulers", "Patient Symptoms Matrix", "Real-Time Clinic Dashboards"],
    techStack: ["React", "Express.js", "Firestore DB", "Firebase Auth", "Gemini API", "Tailwind CSS"],
    stats: [
      { label: "PATIENTS OUTREACH", value: "145,000+" },
      { label: "LLM REASONING", value: "0.2s Avg" },
      { label: "API SECURED", value: "AES-256" }
    ],
    results: {
      loadingSpeed: "0.4s",
      conversion: "Average waiting time slashed by 45 minutes",
      seoScore: "100/100",
      salesIncrease: "Adopted by 14 state medical networks"
    },
    testimonial: {
      feedback: "HIPAA audits can be terrifying, but the security structure built by Zealguy Venture sailed through with flying colors. Highly recommended for complex healthcare software.",
      clientName: "Dr. Albert Vance",
      role: "Chief Medical Officer"
    }
  },
  {
    id: "stjude",
    name: "St. Jude Parish Hub",
    slogan: "Community Faith & Donation Web Portal",
    description: "A beautiful parish portal with secure live-streaming, community event scheduling, and automated mobile tithe/donation rails.",
    industry: "Faith-Based Organization",
    completionDate: "February 2026",
    category: "Church",
    allCategories: ["Website", "Church", "Corporate"],
    accentColor: "emerald",
    mockUrl: "stjudehub.org",
    liveUrl: "https://stjudehub.org",
    aboutClient: "St. Jude's Parish is a community church serving over 2,500 active families.",
    businessGoals: "To simplify community schedules, host mass broadcasts, and allow parishioners to donate safely via mobile networks.",
    challenge: "Parishioners missed sermons due to limited broadcast capability, and physical bulletin printing was expensive.",
    solution: "Developed an elegant CMS for event postings, live-stream feeds directly on mass pages, and direct integrated billing forms.",
    features: ["Live Streaming Modules", "Dynamic Mass Bulletins", "Tithes Payment Rails", "Secure Event Registries", "WhatsApp Community Hub", "Sermon Audio Archives"],
    techStack: ["React", "Vite", "Firebase Auth", "Firestore", "Tailwind CSS"],
    stats: [
      { label: "TITHE EFFICIENCY", value: "+180% digital" },
      { label: "LIVE ATTENDEES", value: "1,200/Sunday" },
      { label: "MOBILE OPTIMIZED", value: "100%" }
    ],
    results: {
      loadingSpeed: "0.5s",
      conversion: "+180% digital contributions increase",
      seoScore: "95/100",
      salesIncrease: "30% more community engagement"
    },
    testimonial: {
      feedback: "Zealguy Venture created a digital home for our parish. Our older members find it incredibly simple to use, and our event registration is fully automated now.",
      clientName: "Reverend Father Michael",
      role: "Lead Pastor, St. Jude"
    }
  },
  {
    id: "apex",
    name: "Apex Academy System",
    slogan: "Enterprise Learning Management Ecosystem",
    description: "An enterprise learning management system and parent-teacher feedback dashboard supporting interactive grade books and secure class streams.",
    industry: "Education & EdTech",
    completionDate: "April 2026",
    category: "School",
    allCategories: ["Website", "School", "Corporate", "Dashboard"],
    accentColor: "indigo",
    mockUrl: "apexacademysystem.edu",
    liveUrl: "https://apexacademysystem.edu",
    aboutClient: "Apex Academy is a high-ranking private secondary institution focusing on STEM curriculum.",
    businessGoals: "To centralize student records, distribute homework tasks digitally, and allow parent billing.",
    challenge: "Managing tuition billing, grade sheets, and curriculum schedules across multiple software led to significant admin bottlenecks.",
    solution: "Zealguy Venture engineered a custom educational dashboard separating student, teacher, and parent portals with clean unified views.",
    features: ["Interactive Gradebooks", "Parent Billing Portal", "Dynamic Course Curriculums", "Real-Time Attendance Tracker", "SMS Notifications Engine", "Digital Homework Feedback"],
    techStack: ["React", "Express.js", "Cloud SQL", "Drizzle ORM", "Tailwind CSS"],
    stats: [
      { label: "ADMIN EFFICIENCY", value: "+85% Saved Time" },
      { label: "PARENTS ENGAGED", value: "94% Active Logins" },
      { label: "PAGE LOAD", value: "0.4s" }
    ],
    results: {
      loadingSpeed: "0.4s",
      conversion: "85% administrative hours saved",
      seoScore: "97/100",
      salesIncrease: "Fee collections streamlined by 99%"
    },
    testimonial: {
      feedback: "Managing tuition fees and grade distribution used to take weeks of administrative labor. Now, our operations are completely synchronized in one central school portal.",
      clientName: "Dr. Clara Mensah",
      role: "Principal, Apex Academy"
    }
  },
  {
    id: "tradersphere",
    name: "TraderSphere Africa",
    slogan: "FinTech & Retail Trader Educational Ecosystem",
    description: "An interactive educational portal and premium market insights ecosystem delivering real-time currency analytics and learning pathways to African retail traders.",
    industry: "FinTech & Financial Education",
    completionDate: "June 2026",
    category: "Finance",
    allCategories: ["Website", "Finance", "Dashboard"],
    accentColor: "amber",
    mockUrl: "tradersphere.africa",
    liveUrl: "https://tradersphere.africa",
    aboutClient: "TraderSphere Africa is a pioneering financial education network delivering market insights and learning resources to traders across Sub-Saharan Africa.",
    businessGoals: "To provide a high-performance web portal that simplifies financial markets training and real-time asset insights on standard cellular devices.",
    challenge: "High system latency and data-heavy interfaces caused extreme page-loading delays on mobile internet connections, frustrating active learners.",
    solution: "We engineered a clean, lightweight React portal featuring static routing architectures, local client-side data pre-fetching, and low-bandwidth asset bundles.",
    features: ["Interactive Portals", "Real-Time Market Tickers", "Tactile Learning Pathways", "Student Performance Tracking", "Low-Bandwidth Mobile Mode", "WhatsApp Direct Concierge"],
    techStack: ["React", "Vite", "Tailwind CSS", "Motion", "Lucide Icons"],
    stats: [
      { label: "PAGE LOAD VELOCITY", value: "0.28s Edge" },
      { label: "UPTIME RATING", value: "99.99% Core" },
      { label: "LEARNING SIGNUPS", value: "+140% Growth" }
    ],
    results: {
      loadingSpeed: "0.28s (Optimized CSS & Code-Splitting)",
      conversion: "+140% active student signups on launch week",
      seoScore: "100/100 (Flawless Accessibility Standards)",
      salesIncrease: "3.5x boost in daily educational course completions"
    },
    testimonial: {
      feedback: "The platform built by Zealguy Venture runs with zero friction even on slower mobile networks. Our student engagement and retention metrics have reached all-time highs.",
      clientName: "Alhassan Ibrahim",
      role: "Managing Director, TraderSphere"
    }
  }
];

const CATEGORIES = [
  "All",
  "Website",
  "E-commerce",
  "Mobile App",
  "Dashboard",
  "Healthcare",
  "Church",
  "School",
  "Retail",
  "Finance",
  "AI",
  "Corporate",
  "Real Estate"
];

export default function PortfolioShowcase() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeItem, setActiveItem] = useState<PortfolioItem>(PORTFOLIO_ITEMS[0]);
  const [deviceMode, setDeviceMode] = useState<"laptop" | "tablet" | "phone">("laptop");
  const [rotationDegrees, setRotationDegrees] = useState(0);
  const [activeCaseStudy, setActiveCaseStudy] = useState<PortfolioItem | null>(null);

  const [inquiryName, setInquiryName] = useState("");
  const [inquiryEmail, setInquiryEmail] = useState("");
  const [inquiryNote, setInquiryNote] = useState("");
  const [inquirySubmitting, setInquirySubmitting] = useState(false);
  const [inquirySubmitted, setInquirySubmitted] = useState(false);
  const [inquiryCopied, setInquiryCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleCopyInquiry = () => {
    if (!activeCaseStudy) return;
    const summaryText = `========================================
STAGING & VPN GATEWAY ACCESS REQUEST
========================================
Case Study: ${activeCaseStudy.name}
Client Name: ${inquiryName}
Business Email: ${inquiryEmail}
Request Note: ${inquiryNote || "None provided"}

----------------------------------------
PROVISIONING CONFIGURATION:
----------------------------------------
Secure Port: OPEN
Status: SYNCHRONIZED
Dispatch: COMPLETED
VPN Gateway Sandbox: ASSIGNED

========================================
Generated on: ${new Date().toLocaleDateString()}
`;
    navigator.clipboard.writeText(summaryText.trim());
    setInquiryCopied(true);
    setTimeout(() => setInquiryCopied(false), 2000);
  };

  useEffect(() => {
    if (activeCaseStudy) {
      setInquiryName("");
      setInquiryEmail("");
      setInquiryNote("");
      setInquirySubmitting(false);
      setInquirySubmitted(false);
    }
  }, [activeCaseStudy]);

  const getEmailValidation = (email: string) => {
    if (!email.trim()) {
      return { status: "idle", message: "", isValid: false };
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { status: "invalid", message: "Invalid email format", isValid: false };
    }
    const domain = email.split("@")[1]?.toLowerCase() || "";
    
    const disposableDomains = [
      "mailinator.com", "10minutemail.com", "tempmail.com", "yopmail.com", 
      "guerrillamail.com", "sharklasers.com", "dispostable.com", "getairmail.com", 
      "burnermail.io", "temp-mail.org", "trashmail.com", "disposable.com",
      "tempmail.net", "guerrillamailblock.com"
    ];
    const personalDomains = [
      "gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "aol.com", 
      "icloud.com", "mail.com", "zoho.com", "protonmail.com", "proton.me", 
      "gmx.com", "yandex.com", "live.com", "msn.com", "me.com", "googlemail.com",
      "fastmail.com", "hushmail.com"
    ];

    if (disposableDomains.some(d => domain.includes(d))) {
      return { status: "disposable", message: "Disposable domains are blocked.", isValid: false };
    }
    if (personalDomains.some(d => domain === d || domain.endsWith("." + d))) {
      return { status: "personal", message: "Personal email. Verified work email preferred.", isValid: true };
    }
    return { status: "professional", message: "Verified business email domain.", isValid: true };
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName.trim() || !inquiryEmail.trim() || inquirySubmitting || !activeCaseStudy) return;
    const validation = getEmailValidation(inquiryEmail);
    if (!validation.isValid) return;
    setInquirySubmitting(true);

    try {
      ensureAnonymousSession(async () => {
        try {
          await addDoc(collection(db, "contact_submissions"), {
            name: inquiryName.trim(),
            email: inquiryEmail.trim(),
            budget: "Staging Access Query",
            launchDate: activeCaseStudy.name.substring(0, 50),
            message: inquiryNote.trim() ? inquiryNote.trim().substring(0, 1000) : "Requested staging access for case study"
          });

          setInquirySubmitted(true);
          setInquirySubmitting(false);

          // Fire the custom canvas confetti animation inside the modal!
          setTimeout(() => {
            const canvas = canvasRef.current;
            if (canvas) {
              const myConfetti = confetti.create(canvas, {
                resize: true,
                useWorker: true
              });
              myConfetti({
                particleCount: 80,
                spread: 60,
                origin: { y: 0.6, x: 0.2 }
              });
              myConfetti({
                particleCount: 80,
                spread: 60,
                origin: { y: 0.6, x: 0.8 }
              });
            } else {
              confetti({
                particleCount: 120,
                spread: 70,
                origin: { y: 0.6 }
              });
            }
          }, 50);
        } catch (error) {
          setInquirySubmitting(false);
          handleFirestoreError(error, OperationType.CREATE, "contact_submissions");
        }
      });
    } catch (outerErr) {
      setInquirySubmitting(false);
      console.error(outerErr);
    }
  };

  const [simState, setSimState] = useState<{
    status: "idle" | "loading" | "success";
    message: string;
  }>({ status: "idle", message: "" });

  const rotateDevice = () => {
    setRotationDegrees((prev) => (prev + 90) % 360);
  };

  const filteredItems = useMemo(() => {
    return PORTFOLIO_ITEMS.filter((item) => {
      if (selectedCategory === "All") return true;
      return item.allCategories.includes(selectedCategory);
    });
  }, [selectedCategory]);

  useEffect(() => {
    if (filteredItems.length > 0 && !filteredItems.find((f) => f.id === activeItem.id)) {
      setActiveItem(filteredItems[0]);
    }
    setSimState((prev) => {
      if (prev.status === "idle" && prev.message === "") return prev;
      return { status: "idle", message: "" };
    });
  }, [selectedCategory, activeItem.id, filteredItems]);

  const handleSimulationTrigger = (item: PortfolioItem) => {
    if (simState.status === "loading") return;
    setSimState({ status: "loading", message: "Connecting to secure sandbox staging environments..." });

    setTimeout(() => {
      let msg = `Staging handshake established for ${item.name} live simulation channel.`;
      if (item.id === "immortal") {
        msg = "AI Product Synthesizer Online: Successfully auto-generated descriptive tags, localized pricing metadata, and pushed Amber-Core Processor Rig to Live Catalog!";
      } else if (item.id === "saljays") {
        msg = "WhatsApp Order Dispatch simulated: Generated automated invoice #SAL-8493 and dispatched WhatsApp courier coordinates to logistics team!";
      } else if (item.id === "dvventure") {
        msg = "Secure Lead Vault Synced: Transmitted encrypted investment partnership query to managing directors in 0.05s.";
      } else if (item.id === "frimbell") {
        msg = "Couture customizer compile: Pre-launch 3D assets verified at 99.8% precision index.";
      }
      setSimState({
        status: "success",
        message: msg
      });

      setTimeout(() => {
        setSimState({ status: "idle", message: "" });
      }, 5000);
    }, 1200);
  };

  return (
    <div className="space-y-12">
      {/* 1. Statistics Grid and "Trusted by Growing Businesses" Banner */}
      <div className="bg-[#030614]/75 border border-white/5 rounded-2xl p-6 relative overflow-hidden" id="trusted-showcase">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none" />
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-4 text-center md:text-left space-y-1">
            <span className="text-[9px] font-mono text-[#FF7A00] uppercase tracking-widest block font-bold">Trusted by Growing Businesses</span>
            <h4 className="text-xl font-bold text-white tracking-tight font-display">Proven Agency Infrastructure</h4>
            <p className="text-xs text-gray-400 font-sans">
              We engineer secure production frameworks built to sustain real-world transaction scale.
            </p>
          </div>
          
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-3.5 bg-white/[0.02] border border-white/5 rounded-xl text-center space-y-1 hover:border-brand-orange/20 transition-colors">
              <span className="text-2xl font-extrabold text-white block tracking-tight font-mono">150+</span>
              <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest block">Projects Delivered</span>
            </div>
            <div className="p-3.5 bg-white/[0.02] border border-white/5 rounded-xl text-center space-y-1 hover:border-brand-orange/20 transition-colors">
              <span className="text-2xl font-extrabold text-white block tracking-tight font-mono">99%</span>
              <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest block">Client Satisfaction</span>
            </div>
            <div className="p-3.5 bg-white/[0.02] border border-white/5 rounded-xl text-center space-y-1 hover:border-[#FF7A00]/20 transition-colors">
              <span className="text-2xl font-extrabold text-[#16C784] block tracking-tight font-mono">24</span>
              <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest block">Industries Served</span>
            </div>
            <div className="p-3.5 bg-white/[0.02] border border-white/5 rounded-xl text-center space-y-1 hover:border-brand-orange/20 transition-colors">
              <span className="text-2xl font-extrabold text-white block tracking-tight font-mono">8</span>
              <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest block">Countries</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Interactive Portfolio Filters (Categories) */}
      <div className="space-y-4 text-center">
        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block">Explore and filter case studies by dynamic tag triggers</span>
        <div className="flex flex-wrap justify-center gap-1.5 max-w-4xl mx-auto px-4 py-2 bg-[#030614]/40 border border-white/5 rounded-2xl">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-[11px] font-mono transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-[#FF7A00] text-white font-bold shadow-[0_0_12px_rgba(255,122,0,0.3)]"
                  : "bg-white/[0.02] text-gray-400 hover:text-white hover:bg-white/5 border border-white/5"
              }`}
            >
              {cat === "All" ? "✦ Show All" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Empty State fallback */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-[#090e24]/60 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
          <Info className="w-12 h-12 text-[#FF7A00] mx-auto opacity-70 animate-pulse mb-3" />
          <h4 className="text-lg font-bold text-white font-mono">No Matching Frameworks Active</h4>
          <p className="text-xs text-gray-400 max-w-md mx-auto mt-1 leading-relaxed">
            Our teams are constantly compiling brand new vertical products. Contact us to establish custom parameters for the <span className="text-[#FF7A00] font-mono font-bold">"{selectedCategory}"</span> industry.
          </p>
          <button
            onClick={() => setSelectedCategory("All")}
            className="mt-4 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono text-xs rounded-xl cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        /* 4. Core Active Grid */
        <div className="w-full bg-[#090e24]/60 border border-white/10 rounded-2xl p-6 lg:p-8 backdrop-blur-xl relative overflow-hidden shadow-2xl" id="portfolio-showcase-container">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

          {/* Tab lists inside filter results */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center border-b border-white/10 pb-4 mb-8 gap-4">
            <div>
              <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest block">Active Engagements ({filteredItems.length})</span>
              <h3 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2 mt-1">
                <Laptop className="w-6 h-6 text-[#FF7A00]" />
                Digital Museum Emulator
              </h3>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                Rotate physical device frames to test layouts. Click simulated controls to interact with real staging triggers.
              </p>
            </div>

            {/* Inner Project Selector Tabs */}
            <div className="flex flex-wrap bg-[#030614] border border-white/5 p-1 rounded-xl gap-1">
              {filteredItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveItem(item)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                    activeItem.id === item.id
                      ? "bg-white/10 text-white font-bold border border-white/10"
                      : "text-gray-400 hover:text-white border border-transparent"
                  }`}
                >
                  ✦ {item.name.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Interactive Screen / Device Emulator (Option 3) */}
            <div className="lg:col-span-7 flex flex-col items-center justify-center space-y-6">
              
              {/* Controls Box */}
              <div className="flex flex-col sm:flex-row gap-3 justify-between items-center w-full max-w-lg bg-[#030614] border border-white/5 px-4 py-2.5 rounded-xl font-mono text-xs">
                <div className="flex gap-2">
                  <button
                    onClick={() => setDeviceMode("laptop")}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors cursor-pointer ${
                      deviceMode === "laptop" ? "bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/10" : "text-gray-500 hover:text-gray-300"
                    }`}
                  >
                    <Monitor className="w-3.5 h-3.5" />
                    LAPTOP
                  </button>
                  <button
                    onClick={() => setDeviceMode("tablet")}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors cursor-pointer ${
                      deviceMode === "tablet" ? "bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/10" : "text-gray-500 hover:text-gray-300"
                    }`}
                  >
                    <Tablet className="w-3.5 h-3.5" />
                    TABLET
                  </button>
                  <button
                    onClick={() => setDeviceMode("phone")}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors cursor-pointer ${
                      deviceMode === "phone" ? "bg-purple-500/20 text-purple-300 font-bold border border-purple-500/10" : "text-gray-500 hover:text-gray-300"
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    PHONE
                  </button>
                </div>

                <button
                  onClick={rotateDevice}
                  className="flex items-center gap-1.5 px-2.5 py-1 bg-white/5 hover:bg-white/10 rounded text-[10px] text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  <RotateCw className="w-3.5 h-3.5 text-[#FF7A00]" />
                  Rotate perspective ({rotationDegrees}°)
                </button>
              </div>

              {/* Core Interactive Device Display with CSS Rotations */}
              <div className="w-full h-[360px] flex flex-col items-center justify-center relative overflow-hidden bg-black/40 rounded-2xl border border-white/5 p-4">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

                <motion.div
                  animate={{ rotate: rotationDegrees }}
                  transition={{ type: "spring", stiffness: 80, damping: 14 }}
                  className="relative flex items-center justify-center z-10 w-full h-full"
                >
                  {deviceMode === "laptop" && (
                    /* LAPTOP VIEWPORT */
                    <div className="w-[340px] sm:w-[420px] md:w-[460px] aspect-[16/10] bg-slate-900 border-[8px] border-slate-950 rounded-2xl shadow-2xl relative overflow-hidden flex flex-col justify-between">
                      <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-black rounded-full z-20" />
                      
                      {/* Browser Header */}
                      <div className="h-6 bg-slate-950 flex items-center px-3 border-b border-white/5 justify-between select-none">
                        <div className="flex gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500/60" />
                          <span className="w-1.5 h-1.5 rounded-full bg-yellow-500/60" />
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500/60" />
                        </div>
                        <span className="text-[8px] font-mono text-gray-500 flex items-center gap-1">
                          <ShieldCheck className="w-2.5 h-2.5 text-emerald-500" />
                          {activeItem.mockUrl}
                        </span>
                        <div className="w-4 opacity-0">.</div>
                      </div>

                      {/* Viewport Content */}
                      <div className="flex-1 relative overflow-hidden bg-slate-950 p-4 flex flex-col justify-between">
                        <div className="flex justify-between items-center text-[9px] font-mono text-gray-500 border-b border-white/5 pb-2">
                          <span className="font-extrabold text-white tracking-wider flex items-center gap-1">
                            <Activity className="w-3.5 h-3.5 text-[#FF7A00]" />
                            {activeItem.name.toUpperCase()}
                          </span>
                          <div className="flex gap-2">
                            <span>Staging</span>
                            <span>Secure API</span>
                          </div>
                        </div>

                        {activeItem.liveUrl === undefined ? (
                          /* COMING SOON LAYOUT */
                          <div className="text-center py-3 my-auto space-y-3">
                            <span className="px-2 py-0.5 bg-pink-500/10 border border-pink-500/20 text-pink-400 font-mono text-[8px] rounded-full tracking-widest uppercase animate-pulse">
                              ✦ Active Development Stage (90%) ✦
                            </span>
                            <h4 className="text-xs sm:text-sm font-black text-white tracking-tight leading-tight">{activeItem.name}</h4>
                            <p className="text-[9px] text-gray-400 max-w-xs mx-auto">
                              Designed by Zealguy Venture. Custom inventory sync is active.
                            </p>
                            
                            <div className="w-full max-w-[160px] mx-auto bg-white/5 h-2 rounded-full overflow-hidden border border-white/5">
                              <div className="bg-pink-500 h-full w-[90%] animate-pulse" />
                            </div>
                            <span className="text-[8px] font-mono text-pink-400 block">Deploying soon</span>
                          </div>
                        ) : (
                          /* COMPLETED APP LAYOUT */
                          <div className="space-y-3 my-auto text-left">
                            <span className="text-[7px] font-mono text-[#FF7A00] uppercase tracking-widest block">✦ {activeItem.industry}</span>
                            <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight leading-snug">{activeItem.slogan}</h4>
                            <p className="text-[9px] text-gray-400 leading-normal max-w-sm">{activeItem.description.slice(0, 110)}...</p>
                            
                            <div className="pt-2 flex items-center gap-2">
                              <button
                                onClick={() => handleSimulationTrigger(activeItem)}
                                className="px-3 py-1.5 bg-white/5 hover:bg-[#FF7A00]/20 text-white font-mono text-[8px] rounded-lg border border-white/10 transition-all cursor-pointer flex items-center gap-1"
                              >
                                <Play className="w-2.5 h-2.5 text-[#FF7A00]" />
                                Simulate User Flow
                              </button>
                            </div>
                          </div>
                        )}

                        <div className="border-t border-white/5 pt-1.5 flex justify-between items-center text-[7px] font-mono text-gray-500">
                          <span>Status: Online Staging</span>
                          <span className="text-white">
                            Tailored by <span className="text-[#FF7A00] font-bold">ZEALGUY VENTURE</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {deviceMode === "tablet" && (
                    /* TABLET VIEWPORT */
                    <div className="w-[240px] sm:w-[280px] md:w-[310px] aspect-[3/4] bg-slate-900 border-[8px] border-slate-950 rounded-2xl shadow-2xl relative overflow-hidden flex flex-col justify-between">
                      <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-black rounded-full z-20" />
                      
                      <div className="h-5 bg-slate-950 flex items-center px-3 border-b border-white/5 justify-between select-none">
                        <span className="text-[8px] text-gray-500">HTTPS</span>
                        <span className="text-[8px] font-mono text-gray-400 font-bold">{activeItem.mockUrl}</span>
                        <span className="text-emerald-500 font-bold text-[7px]">SECURED</span>
                      </div>

                      <div className="flex-1 relative overflow-hidden bg-slate-950 p-4 flex flex-col justify-between">
                        <div className="space-y-3 my-auto">
                          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                            <Compass className="w-4.5 h-4.5 text-[#FF7A00]" />
                          </div>
                          <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight leading-tight">{activeItem.name}</h4>
                          <span className="text-[8px] font-mono text-gray-400 block italic">"{activeItem.slogan}"</span>
                          <p className="text-[9px] text-gray-400 leading-relaxed">{activeItem.description.slice(0, 100)}...</p>

                          {activeItem.liveUrl === undefined ? (
                            <div className="p-2 bg-pink-500/5 border border-pink-500/10 rounded-lg text-center space-y-1">
                              <span className="text-[8px] font-mono text-pink-400 block font-bold">90% COMING SOON</span>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleSimulationTrigger(activeItem)}
                              className="w-full py-1.5 bg-white/5 hover:bg-[#FF7A00]/10 text-white font-mono text-[8px] rounded-lg border border-white/15 cursor-pointer text-center"
                            >
                              ✦ Trigger Sandbox Event ✦
                            </button>
                          )}
                        </div>

                        <div className="border-t border-white/5 pt-2 text-center text-[7px] font-mono text-gray-600">
                          Tailored & Developed by <span className="text-[#FF7A00] font-bold">ZEALGUY VENTURE</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {deviceMode === "phone" && (
                    /* PHONE VIEWPORT */
                    <div className="w-[140px] sm:w-[160px] aspect-[9/19] bg-slate-950 border-[5px] border-slate-900 rounded-[20px] shadow-2xl relative overflow-hidden flex flex-col justify-between">
                      <div className="absolute top-1 left-1/2 -translate-x-1/2 w-10 h-2.5 bg-slate-900 rounded-b-lg z-20" />
                      
                      <div className="flex-1 relative overflow-hidden bg-slate-950 p-2.5 flex flex-col justify-between pt-4">
                        <div className="flex justify-between items-center text-[7px] font-mono text-gray-500 select-none">
                          <span>9:41 AM</span>
                          <span className="text-[#FF7A00] font-bold">LTE 100%</span>
                        </div>

                        <div className="space-y-1 text-center my-auto">
                          <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center mx-auto border border-white/10">
                            <ShoppingBag className="w-3 h-3 text-[#FF7A00]" />
                          </div>
                          <h4 className="text-[9px] font-extrabold text-white tracking-tight leading-tight">{activeItem.name.split(" ")[0]}</h4>
                          <p className="text-[8px] text-gray-400 leading-tight">{activeItem.slogan.slice(0, 45)}...</p>

                          {activeItem.liveUrl === undefined ? (
                            <div className="p-1 bg-pink-500/10 border border-pink-500/20 rounded-md">
                              <span className="text-[7px] font-mono text-pink-400 font-bold block">COMING SOON</span>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleSimulationTrigger(activeItem)}
                              className="w-full py-1 bg-[#FF7A00] hover:bg-[#FF7A00]/85 text-white font-mono text-[7px] rounded-lg cursor-pointer text-center font-bold"
                            >
                              Launch Flow
                            </button>
                          )}
                        </div>

                        <div className="border-t border-white/5 pt-1 text-center text-[6px] font-mono text-gray-500">
                          Tailored by <span className="text-white font-bold">ZEALGUY</span>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Simulation feedback banner */}
              <AnimatePresence mode="wait">
                {simState.status !== "idle" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`w-full max-w-lg p-3 rounded-xl border text-left font-mono text-[10px] ${
                      simState.status === "loading"
                        ? "bg-blue-500/5 border-blue-500/20 text-blue-300"
                        : "bg-emerald-500/5 border-emerald-500/20 text-emerald-300"
                    }`}
                  >
                    <div className="flex gap-2 items-start">
                      {simState.status === "loading" ? (
                        <svg className="animate-spin h-3.5 w-3.5 text-blue-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                      ) : (
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5 animate-bounce" />
                      )}
                      <div>
                        <span className="font-bold block uppercase">{simState.status === "loading" ? "✦ COMPILING DEMO..." : "✦ SANDBOX REACTION CONFIRMED"}</span>
                        <p className="mt-0.5 leading-relaxed text-gray-300">{simState.message}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right Column: Case Study Data */}
            <div className="lg:col-span-5 space-y-6 text-left">
              <div 
                onClick={() => setActiveCaseStudy(activeItem)}
                className="cursor-pointer group/card p-4 bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 hover:border-[#FF7A00]/30 rounded-2xl transition-all relative overflow-hidden"
                title="Click to view full project dossier"
              >
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-[#FF7A00]/5 to-transparent rounded-full blur-xl group-hover/card:bg-[#FF7A00]/10 transition-colors" />
                <div className="flex flex-wrap gap-1.5 items-center">
                  <span className="text-[10px] font-mono text-[#FF7A00] uppercase tracking-widest bg-white/[0.02] border border-white/5 px-2 py-0.5 rounded-full">
                    {activeItem.category} case_study
                  </span>
                  {activeItem.liveUrl === undefined && (
                    <span className="text-[10px] font-mono text-pink-400 uppercase tracking-widest bg-pink-500/10 border border-pink-500/20 px-2 py-0.5 rounded-full animate-pulse">
                      90% Built
                    </span>
                  )}
                  <span className="text-[9px] font-mono text-indigo-400 ml-auto opacity-0 group-hover/card:opacity-100 transition-opacity flex items-center gap-1">
                    Details <ArrowUpRight className="w-3 h-3" />
                  </span>
                </div>
                
                <h4 className="text-3xl font-extrabold text-white tracking-tight mt-2 group-hover/card:text-[#FF7A00] transition-colors">{activeItem.name}</h4>
                <p className="text-xs font-semibold text-gray-400 italic mt-1 font-mono">"{activeItem.slogan}"</p>
                <p className="text-xs text-gray-300 mt-3 leading-relaxed font-sans">{activeItem.description}</p>
              </div>

              {/* Performance Metrics Breakdown */}
              <div className="space-y-2.5">
                <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest block font-bold">Proven Staging Telemetry Metrics:</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-2.5">
                  {activeItem.stats.map((st, idx) => (
                    <div key={idx} className="p-3 bg-[#030614] border border-white/5 rounded-xl flex lg:justify-between items-center gap-3 hover:border-[#FF7A00]/20 transition-all">
                      <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">{st.label}</span>
                      <span className="text-xs font-bold text-white ml-auto font-mono flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 text-[#FF7A00]" />
                        {st.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* COMING SOON Timeline blueprint */}
              {activeItem.liveUrl === undefined && activeItem.timeline && (
                <div className="p-4 bg-pink-500/[0.02] border border-pink-500/10 rounded-2xl space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono text-pink-400 uppercase tracking-widest block font-bold">Under Construction</span>
                    <span className="text-[10px] font-mono text-gray-400 font-bold">{activeItem.progress}% complete</span>
                  </div>
                  
                  <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/10 relative">
                    <div className="bg-gradient-to-r from-pink-500 to-purple-500 h-full rounded-full animate-pulse" style={{ width: `${activeItem.progress}%` }} />
                  </div>

                  <div className="space-y-2 text-left font-mono text-[10px] pt-1">
                    <span className="text-gray-500 block uppercase tracking-wider text-[9px]">Milestone Blueprint:</span>
                    <div className="space-y-2 border-l border-white/5 ml-1.5 pl-3">
                      {activeItem.timeline.map((step, sIdx) => (
                        <div key={sIdx} className="relative">
                          <span className={`absolute -left-[16.5px] top-1 w-1.5 h-1.5 rounded-full ${
                            step.status === "completed" 
                              ? "bg-pink-500" 
                              : step.status === "active" 
                              ? "bg-purple-400 animate-ping" 
                              : "bg-gray-700"
                          }`} />
                          <div className="flex justify-between items-start gap-2">
                            <span className={step.status === "completed" ? "text-gray-400 line-through" : "text-white font-medium"}>
                              {step.phase}
                            </span>
                            <span className={`text-[8px] uppercase tracking-wider px-1.5 py-0.2 rounded shrink-0 ${
                              step.status === "completed" 
                                ? "bg-white/5 text-gray-500" 
                                : step.status === "active" 
                                ? "bg-purple-500/20 text-purple-300"
                                : "bg-gray-800 text-gray-400"
                            }`}>
                              {step.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Toggles */}
              <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                <button
                  onClick={() => setActiveCaseStudy(activeItem)}
                  className="px-5 py-3 bg-[#FF7A00] hover:bg-[#FF7A00]/90 text-white font-mono text-xs font-bold rounded-xl transition-all cursor-pointer shadow-lg hover:shadow-[0_0_15px_rgba(255,122,0,0.25)] flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4 text-white shrink-0" />
                  View Detailed Case Study
                </button>
                
                {activeItem.liveUrl ? (
                  <a
                    href={activeItem.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-3 bg-white/5 hover:bg-white/10 text-white font-mono text-xs font-semibold rounded-xl border border-white/10 hover:border-white/20 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    Visit Live Website
                    <ArrowUpRight className="w-4 h-4 text-gray-400 shrink-0" />
                  </a>
                ) : (
                  <button
                    disabled
                    className="px-5 py-3 bg-white/5 text-gray-500 font-mono text-xs rounded-xl border border-white/5 flex items-center justify-center gap-1.5 cursor-not-allowed"
                  >
                    <Clock className="w-4 h-4 shrink-0" />
                    COMING SOON
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Project Catalog Grid */}
      {filteredItems.length > 0 && (
        <div className="space-y-6 pt-6">
          <div className="text-left border-b border-white/5 pb-3">
            <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest block font-bold">Project Catalog Archives</span>
            <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2 mt-1">
              <Compass className="w-5 h-5 text-[#FF7A00]" />
              Production-Grade Client Solutions
            </h3>
            <p className="text-xs text-gray-400 mt-1 leading-relaxed">
              Click on any project card to open its detailed design and engineering dossier — showcasing its legacy bottleneck challenges, custom solutions, and technology stack.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ y: -4, scale: 1.01 }}
                onClick={() => setActiveCaseStudy(item)}
                className="bg-[#090e24]/50 border border-white/10 hover:border-[#FF7A00]/40 rounded-2xl p-5 cursor-pointer transition-all flex flex-col justify-between group relative overflow-hidden h-full"
              >
                {/* Accent glow on hover */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#FF7A00]/5 rounded-full blur-2xl group-hover:bg-[#FF7A00]/10 transition-colors pointer-events-none" />

                <div className="space-y-4">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-[9px] font-mono text-gray-400 uppercase tracking-wider bg-white/[0.02] border border-white/5 px-2.5 py-0.5 rounded-full">
                      {item.industry}
                    </span>
                    {item.liveUrl === undefined && (
                      <span className="text-[8px] font-mono text-pink-400 uppercase tracking-wider bg-pink-500/10 border border-pink-500/20 px-2 py-0.5 rounded-full animate-pulse">
                        In Progress
                      </span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-lg font-bold text-white group-hover:text-[#FF7A00] transition-colors leading-tight flex items-center gap-1">
                      {item.name}
                      <ArrowUpRight className="w-4 h-4 text-gray-500 opacity-0 group-hover:opacity-100 group-hover:text-[#FF7A00] transition-all shrink-0" />
                    </h4>
                    <p className="text-[10px] font-mono text-[#FF7A00] italic">"{item.slogan}"</p>
                  </div>

                  <p className="text-xs text-gray-300 line-clamp-3 font-sans leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-5 mt-4 border-t border-white/5 flex justify-between items-center text-[10px] font-mono">
                  <div className="flex gap-1.5 items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-gray-400">View Blueprint</span>
                  </div>
                  <span className="text-[#FF7A00] hover:underline flex items-center gap-1 font-bold">
                    Case Study ✦
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Case Study Modal Overlay */}
      <AnimatePresence>
        {activeCaseStudy && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveCaseStudy(null)}
              className="absolute inset-0 bg-[#030817]/95 backdrop-blur-md cursor-zoom-out"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#090e24] border border-white/15 rounded-[32px] w-full max-w-4xl max-h-[85vh] overflow-y-auto p-6 md:p-8 z-10 shadow-2xl relative"
            >
              {/* Confetti canvas inside the modal */}
              <canvas 
                ref={canvasRef} 
                className="absolute inset-0 pointer-events-none w-full h-full z-50 rounded-[32px]" 
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
              />

              <button
                type="button"
                onClick={() => setActiveCaseStudy(null)}
                className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-all cursor-pointer z-20"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-8">
                {/* Header */}
                <div className="border-b border-white/10 pb-6 text-left space-y-2">
                  <span className="text-[10px] font-mono text-[#FF7A00] uppercase tracking-widest font-bold">Client Success Dossier</span>
                  <h3 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight font-display">
                    {activeCaseStudy.name}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 font-mono text-[11px] text-gray-400">
                    <div>
                      <span className="text-gray-500 uppercase text-[9px] block">INDUSTRY</span>
                      <span className="text-white font-medium">{activeCaseStudy.industry}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 uppercase text-[9px] block">LAUNCH DATE</span>
                      <span className="text-white font-medium">{activeCaseStudy.completionDate}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 uppercase text-[9px] block">CATEGORY</span>
                      <span className="text-white font-medium">{activeCaseStudy.category}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 uppercase text-[9px] block">CREDIT ASSIGN</span>
                      <span className="text-white">ZEALGUY VENTURE</span>
                    </div>
                  </div>
                </div>

                {/* Narrative */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 text-left">
                  <div className="md:col-span-7 space-y-6">
                    <div className="space-y-1">
                      <h4 className="text-sm font-mono text-[#FF7A00] uppercase tracking-widest font-bold flex items-center gap-1.5">
                        <Info className="w-4 h-4 text-[#FF7A00]" />
                        Business Context & Goals
                      </h4>
                      <p className="text-xs text-gray-300 leading-relaxed font-sans">{activeCaseStudy.aboutClient}</p>
                      <p className="text-xs text-indigo-300 leading-relaxed font-sans font-medium">{activeCaseStudy.businessGoals}</p>
                    </div>

                    <div className="space-y-2 p-4 bg-red-500/[0.02] border border-red-500/10 rounded-xl">
                      <h4 className="text-sm font-mono text-red-400 uppercase tracking-widest font-bold flex items-center gap-1.5">
                        <X className="w-4 h-4 text-red-400" />
                        The Challenge (Legacy Bottleneck)
                      </h4>
                      <p className="text-xs text-gray-300 leading-relaxed font-sans">{activeCaseStudy.challenge}</p>
                    </div>

                    <div className="space-y-2 p-4 bg-emerald-500/[0.02] border border-emerald-500/10 rounded-xl">
                      <h4 className="text-sm font-mono text-emerald-400 uppercase tracking-widest font-bold flex items-center gap-1.5">
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                        The Solution (Custom Architecture)
                      </h4>
                      <p className="text-xs text-gray-200 leading-relaxed font-sans">{activeCaseStudy.solution}</p>
                    </div>
                  </div>

                  {/* Features & Tech Stack */}
                  <div className="md:col-span-5 space-y-6 bg-[#030614]/60 border border-white/5 p-5 rounded-2xl">
                    <div className="space-y-2.5">
                      <h4 className="text-xs font-mono text-white uppercase tracking-wider font-bold">Engineered Core Features:</h4>
                      <div className="space-y-1.5">
                        {activeCaseStudy.features.map((feat, fIdx) => (
                          <div key={fIdx} className="flex gap-2 items-center text-[11px] text-gray-300 font-sans">
                            <div className="w-4 h-4 rounded bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                              <Check className="w-2.5 h-2.5" />
                            </div>
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2 pt-3 border-t border-white/5">
                      <h4 className="text-xs font-mono text-[#FF7A00] uppercase tracking-wider font-bold flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5 text-[#FF7A00]" />
                        Tech Stack
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {activeCaseStudy.techStack.map((tech) => (
                          <span
                            key={tech}
                            className="text-[9px] font-mono text-gray-300 bg-white/5 px-2 py-0.5 rounded border border-white/10"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Outcomes */}
                <div className="p-5 bg-gradient-to-r from-blue-500/5 to-purple-500/5 border border-white/5 rounded-2xl text-left space-y-3">
                  <h4 className="text-xs font-mono text-white uppercase tracking-widest font-bold block">MEASURABLE OUTCOMES:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-[#030614]/80 p-3 rounded-xl border border-white/5">
                      <span className="text-[9px] font-mono text-gray-500 uppercase block">LOADING VELOCITY</span>
                      <span className="text-xs font-bold text-emerald-400 font-mono block">{activeCaseStudy.results.loadingSpeed}</span>
                    </div>
                    <div className="bg-[#030614]/80 p-3 rounded-xl border border-white/5">
                      <span className="text-[9px] font-mono text-gray-500 uppercase block">SEO SCORE</span>
                      <span className="text-xs font-bold text-white font-mono block">{activeCaseStudy.results.seoScore}</span>
                    </div>
                    <div className="bg-[#030614]/80 p-3 rounded-xl border border-white/5">
                      <span className="text-[9px] font-mono text-gray-500 uppercase block">CONVERSION INTENSITY</span>
                      <span className="text-xs font-bold text-[#FF7A00] font-mono block">{activeCaseStudy.results.conversion}</span>
                    </div>
                  </div>
                </div>

                {/* Testimonial */}
                <div className="p-6 bg-slate-950/40 border border-white/5 rounded-2xl text-left space-y-3 relative overflow-hidden">
                  <div className="absolute top-2 right-4 text-gray-700/20 font-serif text-7xl select-none pointer-events-none">“</div>
                  <h4 className="text-xs font-mono text-gray-400 uppercase tracking-widest font-bold flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-[#FF7A00]" />
                    Client Testimonial Feedback
                  </h4>
                  <p className="text-xs text-gray-300 font-sans leading-relaxed italic">
                    "{activeCaseStudy.testimonial.feedback}"
                  </p>
                  <div className="flex gap-2 items-center pt-1">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0C2D70] to-[#FF7A00] flex items-center justify-center font-mono text-xs font-bold text-white shrink-0">
                      {activeCaseStudy.testimonial.clientName[0]}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">{activeCaseStudy.testimonial.clientName}</span>
                      <span className="text-[9px] font-mono text-gray-500 block">{activeCaseStudy.testimonial.role}</span>
                    </div>
                  </div>
                </div>

                {/* Request Architectural Staging Access Form */}
                <div className="p-6 bg-indigo-950/20 border border-indigo-500/10 rounded-2xl text-left space-y-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF7A00]/5 rounded-full blur-3xl pointer-events-none" />
                  
                  <div className="space-y-1.5 text-left">
                    <span className="text-[9px] font-mono text-[#FF7A00] uppercase tracking-widest block font-bold">STAGING & VPN GATEWAY</span>
                    <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      Request Sandbox Environment Staging Access
                    </h4>
                    <p className="text-xs text-gray-400 font-sans leading-relaxed">
                      Need a technical briefing? Submit your credentials to automatically receive temporary VPN credentials and an automated SLA deployment plan for <b>{activeCaseStudy.name}</b>.
                    </p>
                  </div>

                  <AnimatePresence mode="wait">
                    {!inquirySubmitted ? (
                      <motion.form
                        key="inquiry-form"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onSubmit={handleInquirySubmit}
                        className="space-y-3"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="block text-[10px] font-mono text-gray-500 uppercase">Your Name *</label>
                            <input
                              type="text"
                              required
                              disabled={inquirySubmitting}
                              value={inquiryName}
                              onChange={(e) => setInquiryName(e.target.value)}
                              placeholder="e.g. Satya Nadella"
                              className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#FF7A00] focus:scale-[1.015] focus:shadow-[0_0_12px_rgba(255,122,0,0.35)] font-mono transition-all duration-250 disabled:opacity-50"
                            />
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between items-center">
                              <label className="block text-[10px] font-mono text-gray-500 uppercase">Business Email *</label>
                              {inquiryEmail.trim() && (() => {
                                const v = getEmailValidation(inquiryEmail);
                                return (
                                  <span className={`text-[9px] font-mono font-semibold ${
                                    v.status === "invalid" ? "text-red-400" :
                                    v.status === "disposable" ? "text-red-500" :
                                    v.status === "personal" ? "text-yellow-400" :
                                    "text-emerald-400"
                                  }`}>
                                    {v.status === "invalid" && "Invalid Format"}
                                    {v.status === "disposable" && "Disposable Domain Blocked"}
                                    {v.status === "personal" && "Personal Domain"}
                                    {v.status === "professional" && "Professional Domain Verified"}
                                  </span>
                                );
                              })()}
                            </div>
                            <input
                              type="email"
                              required
                              disabled={inquirySubmitting}
                              value={inquiryEmail}
                              onChange={(e) => setInquiryEmail(e.target.value)}
                              placeholder="e.g. satya@microsoft.com"
                              className={`w-full bg-slate-950/60 border rounded-xl px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none font-mono transition-all duration-250 focus:scale-[1.015] disabled:opacity-50 ${
                                !inquiryEmail.trim()
                                  ? "border-white/10 focus:border-[#FF7A00] focus:shadow-[0_0_12px_rgba(255,122,0,0.35)]"
                                  : (() => {
                                      const v = getEmailValidation(inquiryEmail);
                                      return v.status === "invalid" || v.status === "disposable"
                                        ? "border-red-500/80 focus:border-red-500 focus:shadow-[0_0_12px_rgba(239,68,68,0.35)]"
                                        : v.status === "personal"
                                          ? "border-yellow-500/40 focus:border-yellow-500 focus:shadow-[0_0_12px_rgba(234,179,8,0.35)]"
                                          : "border-emerald-500/40 focus:border-emerald-500 focus:shadow-[0_0_12px_rgba(16,185,129,0.35)]";
                                    })()
                              }`}
                            />
                            {inquiryEmail.trim() && (() => {
                              const v = getEmailValidation(inquiryEmail);
                              return (
                                <p className={`text-[9px] font-sans leading-tight mt-0.5 ${
                                  v.status === "invalid" || v.status === "disposable" ? "text-red-400/80" :
                                  v.status === "personal" ? "text-yellow-400/80" :
                                  "text-emerald-400/80"
                                }`}>
                                  {v.status === "invalid" && "Please enter a valid business email."}
                                  {v.status === "disposable" && "Please use your professional email domain."}
                                  {v.status === "personal" && "Work emails receive direct API sandbox keys instantly."}
                                  {v.status === "professional" && "Architectural staging privileges automatically assigned."}
                                </p>
                              );
                            })()}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[10px] font-mono text-gray-500 uppercase">Custom Architectural Objective / Request Note</label>
                          <textarea
                            disabled={inquirySubmitting}
                            value={inquiryNote}
                            onChange={(e) => setInquiryNote(e.target.value)}
                            placeholder="Describe any target volume SLA, customized deployment integrations, or specific questions..."
                            rows={2}
                            className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#FF7A00] focus:scale-[1.015] focus:shadow-[0_0_12px_rgba(255,122,0,0.35)] font-sans resize-none transition-all duration-250 disabled:opacity-50"
                          />
                        </div>

                        <div className="flex justify-end pt-1">
                          <button
                            type="submit"
                            disabled={inquirySubmitting || (inquiryEmail.trim() !== "" && !getEmailValidation(inquiryEmail).isValid)}
                            className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-[#FF7A00] hover:opacity-90 disabled:opacity-50 text-white font-mono text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-md active:scale-95"
                          >
                            {inquirySubmitting ? (
                              <>
                                <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Requesting...
                              </>
                            ) : (
                              <>
                                Request Staging Access
                                <ArrowUpRight className="w-3.5 h-3.5 text-white" />
                              </>
                            )}
                          </button>
                        </div>
                      </motion.form>
                    ) : (
                      <motion.div
                        key="inquiry-success"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center py-4 space-y-3 flex flex-col items-center justify-center font-sans border border-emerald-500/20 bg-emerald-500/[0.02] p-4 rounded-xl"
                      >
                        <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center text-emerald-400">
                          <CheckCircle className="w-5 h-5" />
                        </div>
                        <div className="space-y-1">
                          <h5 className="text-sm font-bold text-white tracking-tight">Temporary VPN Credentials Provisioned!</h5>
                          <p className="text-xs text-gray-300 max-w-md mx-auto leading-relaxed">
                            Thank you, <span className="text-white font-semibold">{inquiryName}</span>. Your staging access query for <b>{activeCaseStudy.name}</b> has been synchronized with the cloud backend. Credentials and custom SLA charts have been dispatched to <b>{inquiryEmail}</b>.
                          </p>
                        </div>
                        <div className="text-[9px] font-mono text-gray-500 bg-[#030614] border border-white/5 px-3 py-1.5 rounded-lg flex gap-3">
                          <span>✔ INQUIRY: <span className="text-emerald-400">SYNCED</span></span>
                          <span>✔ SECURE PORT: <span className="text-emerald-400">OPEN</span></span>
                          <span>✔ DISPATCH: <span className="text-[#FF7A00]">COMPLETED</span></span>
                        </div>

                        <button
                          type="button"
                          onClick={handleCopyInquiry}
                          className="mt-1 px-4 py-2 bg-white/5 hover:bg-white/10 text-white font-mono text-[10px] font-bold rounded-lg border border-white/10 transition-all hover:-translate-y-0.5 active:scale-[0.98] duration-200 cursor-pointer flex items-center gap-1.5"
                        >
                          {inquiryCopied ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              Copied Request Details!
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-gray-400" />
                              Copy Request Details
                            </>
                          )}
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Bottom CTA / Visit Action with Footer Credit */}
                <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="text-center sm:text-left">
                    <span className="text-[9px] font-mono text-gray-500 block">TAILORED AND MANUFACTURED UNDER AGENCY SPEC</span>
                    <span className="text-[11px] font-mono text-white">
                      Tailored & Developed by <a href="https://zealguyventure.com" target="_blank" rel="noreferrer" className="text-[#FF7A00] font-bold hover:underline">ZEALGUY VENTURE</a>
                    </span>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setActiveCaseStudy(null)}
                      className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white font-mono text-xs rounded-xl border border-white/10 cursor-pointer"
                    >
                      Close Dossier
                    </button>
                    {activeCaseStudy.liveUrl ? (
                      <a
                        href={activeCaseStudy.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-2 bg-[#FF7A00] hover:bg-[#FF7A00]/90 text-white font-mono text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-lg"
                      >
                        Visit Live Website
                        <ExternalLink className="w-3.5 h-3.5 text-white" />
                      </a>
                    ) : (
                      <span className="px-5 py-2 bg-white/5 text-gray-500 font-mono text-xs rounded-xl border border-white/5 flex items-center gap-1.5 cursor-not-allowed">
                        <Clock className="w-3.5 h-3.5" />
                        COMING SOON
                      </span>
                    )}
                  </div>
                </div>

                {/* Related projects */}
                <div className="pt-4 border-t border-white/5 text-left space-y-2">
                  <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest block font-bold">OTHER ACTIVE CASE STUDIES:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {PORTFOLIO_ITEMS.filter((item) => item.id !== activeCaseStudy.id).slice(0, 3).map((rel) => (
                      <button
                        key={rel.id}
                        onClick={() => setActiveCaseStudy(rel)}
                        className="p-3 bg-white/[0.01] hover:bg-white/5 border border-white/5 rounded-xl text-left cursor-pointer transition-all group"
                      >
                        <span className="text-[10px] font-bold text-white block group-hover:text-[#FF7A00] transition-colors">{rel.name}</span>
                        <span className="text-[8px] font-mono text-gray-500 block truncate">{rel.slogan}</span>
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
