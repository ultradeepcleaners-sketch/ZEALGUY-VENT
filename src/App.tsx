import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";
import { 
  Sparkles, 
  Layers, 
  ArrowRight, 
  MessageSquare, 
  CheckCircle, 
  Zap, 
  Globe, 
  Award, 
  Compass, 
  Mail, 
  Building, 
  Calendar,
  X,
  Copy,
  Check,
  Share2,
  Github,
  Linkedin,
  Twitter,
  ExternalLink,
  Send,
  RefreshCw
} from "lucide-react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "./firebase";
import AIDigitalUniverse from "./components/AIDigitalUniverse";
import ServiceGalaxy from "./components/ServiceGalaxy";
import AIDemonstrator from "./components/AIDemonstrator";
import GrowthCalculator from "./components/GrowthCalculator";
import PortfolioShowcase from "./components/PortfolioShowcase";
import ClientDashboard from "./components/ClientDashboard";
import InnovationTimeline from "./components/InnovationTimeline";
import TestimonialsCarousel from "./components/TestimonialsCarousel";
import CustomCursor from "./components/CustomCursor";
import PageLoader from "./components/PageLoader";

// Import new premium Volume 2 components
import ClientLogos from "./components/ClientLogos";
import HeroVisual from "./components/HeroVisual";
import TechnologyOrbit from "./components/TechnologyOrbit";
import ProjectDiscoveryWizard from "./components/ProjectDiscoveryWizard";
import IndustriesSelector from "./components/IndustriesSelector";
import GlobalProjectsMap from "./components/GlobalProjectsMap";
import AIConsultantFloating from "./components/AIConsultantFloating";
import FAQAccordion from "./components/FAQAccordion";
import APIDocumentation from "./components/APIDocumentation";
import ProjectCostEstimator from "./components/ProjectCostEstimator";

// Import custom page views and modals
import AboutView from "./components/AboutView";
import ServicesView from "./components/ServicesView";
import PortfolioView from "./components/PortfolioView";
import BlogView from "./components/BlogView";
import ContactView from "./components/ContactView";
import WebsiteAuditModal from "./components/WebsiteAuditModal";
import ExitIntentPopup from "./components/ExitIntentPopup";
import ReactHelmet from "./components/ReactHelmet";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<"home" | "services" | "ai-solutions" | "portfolio" | "client-portal" | "about" | "contact" | "blog">("home");
  const [auditModalOpen, setAuditModalOpen] = useState(false);
  const [policyType, setPolicyType] = useState<"privacy" | "terms" | "cookies" | null>(null);
  const [growthTab, setGrowthTab] = useState<"calculator" | "estimator">("estimator");
  
  // Navigation tabs or section scroll state
  const [scrolled, setScrolled] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Custom contact form state
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactBudget, setContactBudget] = useState("10k-25k");
  const [contactLaunch, setContactLaunch] = useState("");
  const [contactMsg, setContactMsg] = useState("");
  const [submittedContact, setSubmittedContact] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactCopied, setContactCopied] = useState(false);
  const contactCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const nameInputRef = useRef<HTMLInputElement | null>(null);

  // Newsletter subscription states
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [newsletterSubmitting, setNewsletterSubmitting] = useState(false);
  const [newsletterError, setNewsletterError] = useState("");

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes("@")) {
      setNewsletterError("Please specify a valid corporate email address.");
      return;
    }
    setNewsletterSubmitting(true);
    setNewsletterError("");
    try {
      const subscribersRef = collection(db, "newsletter_subscribers");
      await addDoc(subscribersRef, {
        email: newsletterEmail,
        timestamp: serverTimestamp(),
      });
      setNewsletterSubscribed(true);
      setNewsletterEmail("");
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.85 },
        colors: ["#FF7A00", "#3b82f6", "#10b981"]
      });
    } catch (err) {
      console.error("Newsletter subscription failure: ", err);
      setNewsletterSubscribed(true);
    } finally {
      setNewsletterSubmitting(false);
    }
  };

  const handleApplyEstimate = (budgetString: string, details: string) => {
    const matches = budgetString.match(/\d+[\d,]*/g);
    if (matches && matches.length >= 2) {
      const maxVal = parseInt(matches[1].replace(/,/g, ""), 10);
      
      if (maxVal <= 10000) {
        setContactBudget("5k-10k");
      } else if (maxVal <= 25000) {
        setContactBudget("10k-25k");
      } else if (maxVal <= 50000) {
        setContactBudget("25k-50k");
      } else {
        setContactBudget("50k+");
      }
    }
    setContactMsg(details);
    setModalOpen(true);

    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.35 }
    });
  };

  const handleCopyContactSummary = () => {
    const summaryText = `========================================
ARCHITECTURAL CONSULTATION REQUEST
========================================
Client Name: ${contactName}
Assigned Email: ${contactEmail}
Estimated Budget: ${contactBudget}
Target Launch: ${contactLaunch || "Immediate / Undefined"}
Details / Selected Slot: ${contactMsg || "None specified"}

----------------------------------------
PROVISIONING CONFIGURATION:
----------------------------------------
Database Status: SYNCHRONIZED
Staged Queue: DISPATCHED
SLA Priority Channel: ROUTED

========================================
Generated on: ${new Date().toLocaleDateString()}
`;
    navigator.clipboard.writeText(summaryText.trim());
    setContactCopied(true);
    setTimeout(() => setContactCopied(false), 2000);
  };

  const [shareCopied, setShareCopied] = useState(false);

  const handleShare = async () => {
    const textToShare = `Let's build with Zealguy Venture! Consultation request details:\nName: ${contactName || "[Not Specified]"}\nBudget: ${contactBudget || "[Not Specified]"}\nTarget Launch: ${contactLaunch || "[Not Specified]"}\nRequirements/Slot: ${contactMsg || "[Not Specified]"}`;
    const shareData = {
      title: "Zealguy Venture Consultation Request",
      text: textToShare,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error("Error sharing with Web Share API:", err);
        fallbackCopyToClipboard(textToShare);
      }
    } else {
      fallbackCopyToClipboard(textToShare);
    }
  };

  const fallbackCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    }).catch(err => {
      console.error("Failed to copy share text to clipboard: ", err);
    });
  };

  // Animated numbers count triggers
  const [stats, setStats] = useState({
    websites: 0,
    growth: 0,
    apps: 0,
    countries: 0,
    aiSolutions: 0,
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    // Progressive counter trigger
    const duration = 2000;
    const steps = 60;
    const stepTime = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      setStats({
        websites: Math.min(Math.round((140 / steps) * step), 140),
        growth: Math.min(Math.round((450 / steps) * step), 450),
        apps: Math.min(Math.round((32 / steps) * step), 32),
        countries: Math.min(Math.round((18 / steps) * step), 18),
        aiSolutions: Math.min(Math.round((110 / steps) * step), 110),
      });

      if (step >= steps) {
        clearInterval(timer);
      }
    }, stepTime);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (modalOpen) {
      const timer = setTimeout(() => {
        nameInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [modalOpen]);

  const handleNavClick = (view: "home" | "services" | "ai-solutions" | "portfolio" | "client-portal" | "about" | "contact" | "blog", anchor?: string) => {
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (anchor) {
      setTimeout(() => {
        const el = document.getElementById(anchor);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }, 150);
    }
  };

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

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactEmail.trim() || isSubmitting) return;
    const validation = getEmailValidation(contactEmail);
    if (!validation.isValid) return;
    setIsSubmitting(true);

    try {
      await addDoc(collection(db, "contact_submissions"), {
        name: contactName.trim(),
        email: contactEmail.trim(),
        budget: contactBudget,
        launchDate: contactLaunch.trim() || "Immediate / Undecided",
        message: contactMsg.trim() || "No custom brief provided",
        createdAt: serverTimestamp()
      });

      setSubmittedContact(true);
      setIsSubmitting(false);

      setTimeout(() => {
        const canvas = contactCanvasRef.current;
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

      setTimeout(() => {
        setSubmittedContact(false);
        setContactName("");
        setContactEmail("");
        setContactLaunch("");
        setContactMsg("");
        setModalOpen(false);
      }, 8000);
    } catch (error) {
      setIsSubmitting(false);
      handleFirestoreError(error, OperationType.CREATE, "contact_submissions");
    }
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && <PageLoader onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      <CustomCursor />

      {/* Dynamic SEO Meta Management */}
      {activeView === "home" && (
        <ReactHelmet>
          <title>Zealguy Venture | Premium Full-Stack Software Engineering & Design</title>
          <meta name="description" content="Zealguy Venture specializes in military-grade web applications, dynamic mobile systems, custom AI agents, and high-performance system configurations engineered for elite businesses." />
          <meta property="og:title" content="Zealguy Venture | Premium Full-Stack Software Engineering & Design" />
          <meta property="og:description" content="Zealguy Venture specializes in military-grade web applications, dynamic mobile systems, custom AI agents, and high-performance system configurations engineered for elite businesses." />
        </ReactHelmet>
      )}
      {activeView === "services" && (
        <ReactHelmet>
          <title>Core Services & Ecosystem Galaxy | Zealguy Venture</title>
          <meta name="description" content="Explore our range of premium software services. From custom checkout pipelines to HIPAA-compliant medical systems and AI strategic deployment." />
          <meta property="og:title" content="Core Services & Ecosystem Galaxy | Zealguy Venture" />
          <meta property="og:description" content="Explore our range of premium software services. From custom checkout pipelines to HIPAA-compliant medical systems and AI strategic deployment." />
        </ReactHelmet>
      )}
      {activeView === "portfolio" && (
        <ReactHelmet>
          <title>Immersive Case Studies & Portfolio | Zealguy Venture</title>
          <meta name="description" content="Browse our elite real-world implementation case studies, including TraderSphere Africa, specialized medical portals, and biometric identity verification." />
          <meta property="og:title" content="Immersive Case Studies & Portfolio | Zealguy Venture" />
          <meta property="og:description" content="Browse our elite real-world implementation case studies, including TraderSphere Africa, specialized medical portals, and biometric identity verification." />
        </ReactHelmet>
      )}
      {activeView === "about" && (
        <ReactHelmet>
          <title>Our Vision, Team & Engineering Philosophy | Zealguy Venture</title>
          <meta name="description" content="Read about Zealguy Venture's core team, Swiss-modern architectural blueprints, 6-step project engineering guidelines, and dedicated client-first approach." />
          <meta property="og:title" content="Our Vision, Team & Engineering Philosophy | Zealguy Venture" />
          <meta property="og:description" content="Read about Zealguy Venture's core team, Swiss-modern architectural blueprints, 6-step project engineering guidelines, and dedicated client-first approach." />
        </ReactHelmet>
      )}
      {activeView === "blog" && (
        <ReactHelmet>
          <title>Technical Hub & Engineering Insight Blog | Zealguy Venture</title>
          <meta name="description" content="Gain expert technical insights regarding high-speed caching mechanisms, next-generation WebRTC architectures, HIPAA compliance, and SaaS engineering." />
          <meta property="og:title" content="Technical Hub & Engineering Insight Blog | Zealguy Venture" />
          <meta property="og:description" content="Gain expert technical insights regarding high-speed caching mechanisms, next-generation WebRTC architectures, HIPAA compliance, and SaaS engineering." />
        </ReactHelmet>
      )}
      {activeView === "contact" && (
        <ReactHelmet>
          <title>Initiate Consultation & Custom Systems Design | Zealguy Venture</title>
          <meta name="description" content="Connect with our expert developers, schedule a custom consultation slot, and receive a customized, AI-driven project pricing blueprint." />
          <meta property="og:title" content="Initiate Consultation & Custom Systems Design | Zealguy Venture" />
          <meta property="og:description" content="Connect with our expert developers, schedule a custom consultation slot, and receive a customized, AI-driven project pricing blueprint." />
        </ReactHelmet>
      )}

      <div className="min-h-screen bg-[#030817] text-gray-100 font-sans relative selection:bg-[#FF7A00]/30 selection:text-white overflow-x-hidden">
        
        {/* Background visual canvas (floating interactive 3D particle universe) */}
        <div className="absolute inset-0 h-full w-full pointer-events-none z-0 overflow-hidden">
          <AIDigitalUniverse />
          {/* Soft atmospheric gradient backdrops */}
          <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[80vw] h-[80vw] max-w-[1000px] bg-gradient-radial from-secondary-navy/10 via-transparent to-transparent rounded-full blur-3xl" />
          <div className="absolute top-[40%] right-[-10%] w-[50vw] h-[50vw] bg-gradient-radial from-brand-orange/5 via-transparent to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-[20%] left-[-10%] w-[60vw] h-[60vw] bg-gradient-radial from-blue-500/5 via-transparent to-transparent rounded-full blur-3xl" />
        </div>

        {/* Floating Header */}
        <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-[#030817]/90 backdrop-blur-md border-b border-[#0C2D70]/20 py-4" : "bg-transparent py-6"
        }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <button onClick={() => handleNavClick("home")} className="flex items-center gap-3 group cursor-pointer text-left bg-transparent border-0 focus:outline-none">
            <div className="relative w-8 h-8 flex items-center justify-center bg-[#071E4A] rounded-lg border border-white/10 group-hover:border-brand-orange/30 transition-all">
              <svg viewBox="0 0 100 100" className="w-5 h-5">
                {/* Background V logo element */}
                <path d="M 20 30 L 50 80 L 80 30" stroke="#FF7A00" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
                {/* Foreground Z logo element */}
                <path d="M 30 35 L 70 35 L 30 75 L 70 75" stroke="#93C5FD" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-base font-bold tracking-wider text-white font-display group-hover:text-brand-orange transition-all">
              ZEALGUY VENTURE
            </span>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-xs font-mono text-gray-400">
            <button 
              onClick={() => handleNavClick("home")}
              className={`hover:text-brand-orange transition-all cursor-pointer ${activeView === "home" ? "text-brand-orange font-bold underline decoration-brand-orange underline-offset-4" : ""}`}
            >
              ✦ Home
            </button>
            <button 
              onClick={() => handleNavClick("services")}
              className={`hover:text-brand-orange transition-all cursor-pointer ${activeView === "services" ? "text-brand-orange font-bold underline decoration-brand-orange underline-offset-4" : ""}`}
            >
              ✦ Services
            </button>
            <button 
              onClick={() => handleNavClick("portfolio")}
              className={`hover:text-brand-orange transition-all cursor-pointer ${activeView === "portfolio" ? "text-brand-orange font-bold underline decoration-brand-orange underline-offset-4" : ""}`}
            >
              ✦ Portfolio
            </button>
            <button 
              onClick={() => handleNavClick("about")}
              className={`hover:text-brand-orange transition-all cursor-pointer ${activeView === "about" ? "text-brand-orange font-bold underline decoration-brand-orange underline-offset-4" : ""}`}
            >
              ✦ About
            </button>
            <button 
              onClick={() => handleNavClick("blog")}
              className={`hover:text-brand-orange transition-all cursor-pointer ${activeView === "blog" ? "text-brand-orange font-bold underline decoration-brand-orange underline-offset-4" : ""}`}
            >
              ✦ Blog
            </button>
            <button 
              onClick={() => handleNavClick("contact")}
              className={`hover:text-brand-orange transition-all cursor-pointer ${activeView === "contact" ? "text-brand-orange font-bold underline decoration-brand-orange underline-offset-4" : ""}`}
            >
              ✦ Contact
            </button>
            <button 
              onClick={() => setAuditModalOpen(true)}
              className="text-emerald-400 hover:text-emerald-300 font-bold transition-all cursor-pointer flex items-center gap-1 bg-transparent border-none"
            >
              <Sparkles className="w-3 h-3 text-[#FF7A00] animate-pulse" /> Free Audit
            </button>
          </nav>

          {/* Action Call Button - Secondary outline style */}
          <button
            onClick={() => setModalOpen(true)}
            className="px-4.5 py-2 bg-white hover:bg-slate-100 text-[#071E4A] border border-secondary-navy font-mono text-xs font-semibold rounded-[18px] shadow-sm hover:shadow-[0_0_15px_rgba(255,122,0,0.25)] transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.97] cursor-pointer"
            id="book-consultation-header"
          >
            Book Consultation
          </button>
        </div>
      </header>

      {activeView === "home" ? (
        <>
          {/* Hero Section */}
          <section className="pt-32 pb-16 md:pt-40 md:pb-24 max-w-7xl mx-auto px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Left Column: Copywriting & Stats */}
              <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
                
                {/* Visual Badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#071E4A]/60 border border-[#0C2D70]/60 rounded-full text-xs font-mono text-blue-300">
                  <Sparkles className="w-3.5 h-3.5 text-brand-orange animate-pulse" />
                  <span>Intelligent Digital Transformation Company</span>
                </div>

                {/* Hero Typography */}
                <div className="space-y-4">
                  <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.1] font-display">
                    We Don't Simply Design Websites.<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-brand-orange to-bright-orange">
                      We Engineer Digital Growth Systems.
                    </span>
                  </h1>
                  <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-sans">
                    Helping businesses launch, grow, automate and scale globally through premium custom software, mobile apps, artificial intelligence, and corporate digital experiences.
                  </p>
                </div>

                {/* Hero CTA buttons (Primary: Blue with Orange Hover, Secondary: White) */}
                <div className="flex flex-col sm:flex-row justify-center lg:justify-start items-center gap-4">
                  <button
                    onClick={() => setModalOpen(true)}
                    className="w-full sm:w-auto px-7 py-4 bg-[#0C2D70] hover:bg-[#FF7A00] text-white font-mono text-xs font-bold rounded-[18px] shadow-lg hover:shadow-[0_0_20px_rgba(255,122,0,0.35)] transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.97] flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Initiate Project Discovery
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleNavClick("services")}
                    className="w-full sm:w-auto px-7 py-4 bg-white/5 hover:bg-white/10 text-white font-mono text-xs font-semibold rounded-[18px] border border-white/10 hover:border-white/20 transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.97] flex items-center justify-center gap-2 text-center"
                  >
                    Explore Service Galaxy
                  </button>
                </div>

                {/* Compounding Live Counter statistics */}
                <div className="pt-8 border-t border-white/5">
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-center lg:text-left">
                    <div className="space-y-1">
                      <span className="text-xl sm:text-2xl font-extrabold text-white block tracking-tight font-mono">
                        {stats.websites}+
                      </span>
                      <span className="text-[9px] font-mono text-gray-500 uppercase tracking-wider block">Platforms Created</span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xl sm:text-2xl font-extrabold text-white block tracking-tight font-mono">
                        {stats.growth}%
                      </span>
                      <span className="text-[9px] font-mono text-gray-500 uppercase tracking-wider block">Client Revenue Growth</span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xl sm:text-2xl font-extrabold text-white block tracking-tight font-mono">
                        {stats.apps}+
                      </span>
                      <span className="text-[9px] font-mono text-gray-500 uppercase tracking-wider block">Mobile Apps Live</span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xl sm:text-2xl font-extrabold text-white block tracking-tight font-mono">
                        {stats.countries}+
                      </span>
                      <span className="text-[9px] font-mono text-gray-500 uppercase tracking-wider block">Countries Served</span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xl sm:text-2xl font-extrabold text-white block tracking-tight font-mono">
                        {stats.aiSolutions}+
                      </span>
                      <span className="text-[9px] font-mono text-gray-500 uppercase tracking-wider block">AI Agents Deployed</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column: Interactive 3-Device Mockups */}
              <div className="lg:col-span-5 flex justify-center w-full">
                <HeroVisual />
              </div>

            </div>
          </section>

          {/* Infinite scrolling branding Ribbon */}
          <div className="w-full py-4 bg-slate-950/40 border-y border-white/5 relative z-10 overflow-hidden">
            <ClientLogos />
          </div>

          {/* Main interactive modules */}
          <main className="max-w-7xl mx-auto px-6 pb-24 space-y-24 relative z-10">

            {/* Section: Service Galaxy */}
            <section id="services-galaxy" className="space-y-8 scroll-mt-24">
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest">Interactive Ecosystem</span>
                <h2 className="text-3xl font-bold text-white tracking-tight">Ecosystem Service Galaxy</h2>
                <p className="text-xs text-gray-400 leading-relaxed font-sans">
                  Each floating node serves as an interactive compilation module. Select an orb to visualize real-time dynamic web layouts and asset models.
                </p>
              </div>
              <ServiceGalaxy />
            </section>

            {/* Section: Industries Theme Selector */}
            <section id="industries-selector" className="space-y-8 scroll-mt-24">
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest">Tailored Sector Frameworks</span>
                <h2 className="text-3xl font-bold text-white tracking-tight">Enterprise Vertical Previews</h2>
                <p className="text-xs text-gray-400 leading-relaxed font-sans">
                  Select an industry sector to immediately render optimized HIPAA-compliant portals, wealth trackers, learn systems, and checkout pipelines.
                </p>
              </div>
              <IndustriesSelector />
            </section>

            {/* Section: Technology Orbit */}
            <section id="technology-orbit" className="space-y-8 scroll-mt-24">
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest">Technological Nucleus</span>
                <h2 className="text-3xl font-bold text-white tracking-tight">Orbiting Core Systems Core</h2>
                <p className="text-xs text-gray-400 leading-relaxed font-sans">
                  Experience the gravity of our multi-layered tech stack. Hover and click floating layers to inspect database architectures, CDNs, and UI models.
                </p>
              </div>
              <TechnologyOrbit />
            </section>

            {/* Section: AI Strategist / Assets Synthesizer */}
            <section id="ai-lab" className="space-y-8 scroll-mt-24">
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest">Compulsory Neural Sandbox</span>
                <h2 className="text-3xl font-bold text-white tracking-tight">AI Demonstration Lab</h2>
                <p className="text-xs text-gray-400 leading-relaxed font-sans">
                  Test drive real AI outputs. Formulate a complete business landing page model or synthesize custom graphics instantly at 1K, 2K, or 4K.
                </p>
              </div>
              <AIDemonstrator />
            </section>

            {/* Section: Business Growth Calculator & Cost Estimator */}
            <section id="growth-engine" className="space-y-8 scroll-mt-24">
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest">Financial & Growth Modeler</span>
                <h2 className="text-3xl font-bold text-white tracking-tight">Revenue ROI & Cost Estimator</h2>
                <p className="text-xs text-gray-400 leading-relaxed font-sans">
                  Forecast the value of customized, sub-0.5s pre-rendered code or compile a bespoke project budget dynamically.
                </p>
                
                {/* Custom Tab Switcher */}
                <div className="flex justify-center pt-3">
                  <div className="inline-flex p-1.5 bg-[#030614] border border-white/5 rounded-xl shadow-inner">
                    <button
                      onClick={() => setGrowthTab("calculator")}
                      className={`px-5 py-2.5 rounded-lg text-xs font-mono transition-all duration-250 cursor-pointer ${
                        growthTab === "calculator"
                          ? "bg-emerald-500/15 text-emerald-400 font-black shadow-md border border-emerald-500/20"
                          : "text-gray-400 hover:text-white hover:bg-white/[0.02]"
                      }`}
                    >
                      ✦ Growth ROI Calculator
                    </button>
                    <button
                      onClick={() => setGrowthTab("estimator")}
                      className={`px-5 py-2.5 rounded-lg text-xs font-mono transition-all duration-250 cursor-pointer ${
                        growthTab === "estimator"
                          ? "bg-brand-orange/15 text-brand-orange font-black shadow-md border border-brand-orange/20"
                          : "text-gray-400 hover:text-white hover:bg-white/[0.02]"
                      }`}
                    >
                      ✦ Project Cost Estimator
                    </button>
                  </div>
                </div>
              </div>

              <div className="relative min-h-[400px]">
                <AnimatePresence mode="wait">
                  {growthTab === "calculator" ? (
                    <motion.div
                      key="calculator"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.2 }}
                    >
                      <GrowthCalculator />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="estimator"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ProjectCostEstimator onApplyEstimate={handleApplyEstimate} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </section>

            {/* Section: Premium Portfolio & Rotatable Devices */}
            <section id="portfolio" className="space-y-8 scroll-mt-24">
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest">Visual Craftsmanship</span>
                <h2 className="text-3xl font-bold text-white tracking-tight">Immersive Project Portfolio</h2>
                <p className="text-xs text-gray-400 leading-relaxed font-sans">
                  Rotate realistic devices, click to explore responsive layouts, and audit real biometric, medical, and financial cases.
                </p>
              </div>
              <PortfolioShowcase />
            </section>

            {/* Section: Global Deployment Network Map */}
            <section id="global-map" className="space-y-8 scroll-mt-24">
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest">Global Operations Telemetry</span>
                <h2 className="text-3xl font-bold text-white tracking-tight">Global Client Network</h2>
                <p className="text-xs text-gray-400 leading-relaxed font-sans">
                  Interact with our active international deployment nodes. Tap on satellite cities to inspect localized metrics and customized software scopes.
                </p>
              </div>
              <GlobalProjectsMap />
            </section>

            {/* Section: Client Dashboard Preview */}
            <section id="client-portal" className="space-y-8 scroll-mt-24">
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest">SaaS Transparency</span>
                <h2 className="text-3xl font-bold text-white tracking-tight">Your Custom Client Portal</h2>
                <p className="text-xs text-gray-400 leading-relaxed font-sans">
                  Simulate real incoming sales, evaluate ongoing project tasks, and message developer specialists in real time.
                </p>
              </div>
              <ClientDashboard />
            </section>

            {/* Section: Testimonials Carousel */}
            <section id="testimonials" className="space-y-8 scroll-mt-24">
              <TestimonialsCarousel />
            </section>

            {/* Section: Innovation Timeline */}
            <section id="innovation-timeline" className="space-y-8 scroll-mt-24">
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Orchestrated Deployment</span>
                <h2 className="text-3xl font-bold text-white tracking-tight">Our Architectural Blueprint</h2>
                <p className="text-xs text-gray-400 leading-relaxed font-sans">
                  Take a self-guided walkthrough across our premium 6-step project engineering pipeline.
                </p>
              </div>
              <InnovationTimeline />
            </section>

            {/* Section: Project Discovery Wizard */}
            <section id="contact-section" className="space-y-8 scroll-mt-24">
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest animate-pulse">INTELLIGENT PIPELINE</span>
                <h2 className="text-3xl font-bold text-white tracking-tight">Interactive Project Discovery</h2>
                <p className="text-xs text-gray-400 leading-relaxed font-sans">
                  Formulate a production-ready system specification, coordinate real-time pricing plans, and receive instantly custom AI-backed solutions.
                </p>
              </div>
              <ProjectDiscoveryWizard />
            </section>

            {/* Section: Frequently Asked Questions Accordion */}
            <FAQAccordion onTriggerConsultation={() => setModalOpen(true)} />

            {/* Section: API Gateways & Architecture Documentation */}
            <APIDocumentation />

          </main>
        </>
      ) : (
        <main className="max-w-7xl mx-auto px-6 pt-32 pb-24 relative z-10">
          {activeView === "services" && (
            <ServicesView 
              onTriggerConsultation={() => setModalOpen(true)} 
              onNavigateToPortfolio={() => handleNavClick("portfolio")} 
            />
          )}
          {activeView === "portfolio" && (
            <PortfolioView onTriggerConsultation={() => setModalOpen(true)} />
          )}
          {activeView === "about" && <AboutView />}
          {activeView === "blog" && <BlogView />}
          {activeView === "contact" && <ContactView />}
        </main>
      )}

      {/* Luxury Dialog Modal for Book Discovery Call */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            {/* Backdrop lock */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={isMobile ? { y: "100%", opacity: 0.5 } : { scale: 0.95, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={isMobile ? { y: "100%", opacity: 0.5 } : { scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="bg-[#090e24]/95 border-t border-x sm:border border-white/15 rounded-t-[32px] sm:rounded-[32px] rounded-b-none sm:rounded-b-[32px] max-w-lg w-full p-6 pb-10 sm:pb-6 relative overflow-hidden shadow-2xl z-10 backdrop-blur-xl max-h-[90vh] overflow-y-auto"
              id="discovery-modal-container"
            >
              {/* Confetti canvas inside the modal */}
              <canvas 
                ref={contactCanvasRef} 
                className="absolute inset-0 pointer-events-none w-full h-full z-50 rounded-[32px]" 
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
              />

              <button
                onClick={handleShare}
                className="absolute top-4 right-14 w-12 h-12 flex items-center justify-center text-gray-500 hover:text-white transition-colors cursor-pointer z-50"
                aria-label="Share consultation request details"
                title="Share consultation request details"
              >
                {shareCopied ? (
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md animate-pulse">Copied!</span>
                ) : (
                  <Share2 className="w-5 h-5" />
                )}
              </button>

              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-4 right-4 w-12 h-12 flex items-center justify-center text-gray-500 hover:text-white transition-colors cursor-pointer z-50"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              <AnimatePresence mode="wait">
                {!submittedContact ? (
                  <motion.div
                    key="consultation-form"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4 text-left"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-purple-400" />
                        <h4 className="text-lg font-bold text-white font-mono">Book Strategic Discovery Call</h4>
                      </div>
                      <p className="text-xs text-gray-400 leading-relaxed font-sans">
                        Provide your coordinates to schedule a convenient 30-minute window with our lead systems architect.
                      </p>
                    </div>

                    <form onSubmit={handleContactSubmit} className="space-y-3.5">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-mono text-gray-500 uppercase">Your Name *</label>
                          <input
                            ref={nameInputRef}
                            type="text"
                            required
                            disabled={isSubmitting}
                            value={contactName}
                            onChange={(e) => setContactName(e.target.value)}
                            placeholder="e.g. Satoshi"
                            className="w-full h-12 min-h-[48px] bg-[#030614] border border-white/10 rounded-[14px] px-3.5 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FF7A00] focus:scale-[1.015] focus:shadow-[0_0_12px_rgba(255,122,0,0.35)] font-mono transition-all duration-250 disabled:opacity-50 disabled:cursor-not-allowed"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-center">
                            <label className="block text-[10px] font-mono text-gray-500 uppercase">Your Email *</label>
                            {contactEmail.trim() && (() => {
                              const v = getEmailValidation(contactEmail);
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
                            disabled={isSubmitting}
                            value={contactEmail}
                            onChange={(e) => setContactEmail(e.target.value)}
                            placeholder="e.g. satoshi@bitcoin.org"
                            className={`w-full h-12 min-h-[48px] bg-[#030614] border rounded-[14px] px-3.5 py-3 text-xs text-white placeholder-gray-500 focus:outline-none font-mono transition-all duration-250 focus:scale-[1.015] disabled:opacity-50 disabled:cursor-not-allowed ${
                              !contactEmail.trim() 
                                ? "border-white/10 focus:border-[#FF7A00] focus:shadow-[0_0_12px_rgba(255,122,0,0.35)]" 
                                : (() => {
                                    const v = getEmailValidation(contactEmail);
                                    return v.status === "invalid" || v.status === "disposable"
                                      ? "border-red-500/80 focus:border-red-500 focus:shadow-[0_0_12px_rgba(239,68,68,0.35)]"
                                      : v.status === "personal"
                                        ? "border-yellow-500/40 focus:border-yellow-500 focus:shadow-[0_0_12px_rgba(234,179,8,0.35)]"
                                        : "border-emerald-500/40 focus:border-emerald-500 focus:shadow-[0_0_12px_rgba(16,185,129,0.35)]";
                                  })()
                            }`}
                          />
                          {contactEmail.trim() && (() => {
                            const v = getEmailValidation(contactEmail);
                            return (
                              <p className={`text-[9px] font-sans leading-tight mt-1 ${
                                v.status === "invalid" || v.status === "disposable" ? "text-red-400/80" :
                                v.status === "personal" ? "text-yellow-400/80" :
                                "text-emerald-400/80"
                              }`}>
                                {v.status === "invalid" && "Please enter a valid email format."}
                                {v.status === "disposable" && "Please use a genuine personal or corporate email address."}
                                {v.status === "personal" && "Work/company email domains receive priority system provisioning."}
                                {v.status === "professional" && "Business-tier architectural discovery channels initialized."}
                              </p>
                            );
                          })()}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-mono text-gray-500 uppercase">Estimated Budget</label>
                          <select
                            disabled={isSubmitting}
                            value={contactBudget}
                            onChange={(e) => setContactBudget(e.target.value)}
                            className="w-full h-12 min-h-[48px] bg-[#030614] border border-white/10 rounded-[14px] px-3 py-3 text-xs text-white focus:outline-none focus:border-[#FF7A00] focus:scale-[1.015] focus:shadow-[0_0_12px_rgba(255,122,0,0.35)] font-mono transition-all duration-250 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <option value="5k-10k">$5,000 - $10,000</option>
                            <option value="10k-25k">$10,000 - $25,000</option>
                            <option value="25k-50k">$25,000 - $50,000</option>
                            <option value="50k+">$50,000+ Premium</option>
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-mono text-gray-500 uppercase">Target Launch</label>
                          <input
                            type="text"
                            disabled={isSubmitting}
                            value={contactLaunch}
                            onChange={(e) => setContactLaunch(e.target.value)}
                            placeholder="e.g. Next 30 Days"
                            className="w-full h-12 min-h-[48px] bg-[#030614] border border-white/10 rounded-[14px] px-3.5 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FF7A00] focus:scale-[1.015] focus:shadow-[0_0_12px_rgba(255,122,0,0.35)] font-mono transition-all duration-250 disabled:opacity-50 disabled:cursor-not-allowed"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-mono text-gray-500 uppercase">Message / Slot Details</label>
                        <textarea
                          disabled={isSubmitting}
                          value={contactMsg}
                          onChange={(e) => setContactMsg(e.target.value)}
                          placeholder="Describe your systems requirements, or select a slot below..."
                          rows={2}
                          className="w-full h-12 min-h-[48px] bg-[#030614] border border-white/10 rounded-[14px] px-3.5 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FF7A00] focus:scale-[1.015] focus:shadow-[0_0_12px_rgba(255,122,0,0.35)] font-sans resize-none transition-all duration-250 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                      </div>

                      {/* Simulated Interactive Calendar Mockup */}
                      <div className="bg-[#030614] border border-white/5 p-4 rounded-[24px] space-y-3 font-mono text-xs">
                        <span className="text-[10px] text-gray-500 uppercase tracking-widest block text-left">Available Time Slots:</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <button
                            type="button"
                            disabled={isSubmitting}
                            onClick={() => setContactMsg("Requesting Slot: Tues 10:00 AM EST")}
                            className={`h-12 min-h-[48px] px-3 rounded-[14px] text-center border transition-all text-[11px] cursor-pointer font-mono disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center ${
                              contactMsg.includes("Tues 10:00 AM")
                                ? "bg-purple-500/20 border-purple-400 text-white"
                                : "bg-white/5 border-white/5 hover:bg-white/10 text-gray-300"
                            }`}
                          >
                            Tues 10:00 AM EST
                          </button>
                          <button
                            type="button"
                            disabled={isSubmitting}
                            onClick={() => setContactMsg("Requesting Slot: Tues 2:00 PM EST")}
                            className={`h-12 min-h-[48px] px-3 rounded-[14px] text-center border transition-all text-[11px] cursor-pointer font-mono disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center ${
                              contactMsg.includes("Tues 2:00 PM")
                                ? "bg-purple-500/20 border-purple-400 text-white"
                                : "bg-white/5 border-white/5 hover:bg-white/10 text-gray-300"
                            }`}
                          >
                            Tues 2:00 PM EST
                          </button>
                          <button
                            type="button"
                            disabled={isSubmitting}
                            onClick={() => setContactMsg("Requesting Slot: Wed 11:30 AM EST")}
                            className={`h-12 min-h-[48px] px-3 rounded-[14px] text-center border transition-all text-[11px] cursor-pointer font-mono disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center ${
                              contactMsg.includes("Wed 11:30 AM")
                                ? "bg-purple-500/20 border-purple-400 text-white"
                                : "bg-white/5 border-white/5 hover:bg-white/10 text-gray-300"
                            }`}
                          >
                            Wed 11:30 AM EST
                          </button>
                          <button
                            type="button"
                            disabled={isSubmitting}
                            onClick={() => setContactMsg("Requesting Slot: Thurs 4:00 PM EST")}
                            className={`h-12 min-h-[48px] px-3 rounded-[14px] text-center border transition-all text-[11px] cursor-pointer font-mono disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center ${
                              contactMsg.includes("Thurs 4:00 PM")
                                ? "bg-purple-500/20 border-purple-400 text-white"
                                : "bg-white/5 border-white/5 hover:bg-white/10 text-gray-300"
                            }`}
                          >
                            Thurs 4:00 PM EST
                          </button>
                        </div>
                        <span className="text-[9px] text-gray-500 block text-center mt-1">✦ Slots automatically align to your timezone</span>
                      </div>

                      <div className="flex gap-2.5 justify-end pt-2 border-t border-white/5">
                        <button
                          type="button"
                          disabled={isSubmitting}
                          onClick={() => setModalOpen(false)}
                          className="px-5 h-12 min-h-[48px] bg-white/5 hover:bg-white/10 text-white font-mono text-xs rounded-[18px] transition-all border border-white/10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none flex items-center justify-center"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmitting || (contactEmail.trim() !== "" && !getEmailValidation(contactEmail).isValid)}
                          className="px-6 h-12 min-h-[48px] bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs rounded-[18px] transition-all font-bold cursor-pointer hover:shadow-[0_0_15px_rgba(147,51,234,0.3)] disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none flex items-center justify-center gap-2"
                        >
                          {isSubmitting ? (
                            <>
                              <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                              </svg>
                              Scheduling...
                            </>
                          ) : (
                            "Confirm & Schedule"
                          )}
                        </button>
                      </div>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div
                    key="consultation-success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="text-center py-8 space-y-6 flex flex-col items-center justify-center font-sans"
                  >
                    <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.15)] animate-bounce">
                      <CheckCircle className="w-7 h-7" />
                    </div>
                    <div className="space-y-1.5">
                      <h5 className="text-xl font-bold text-white tracking-tight">Request Successfully Transmitted</h5>
                      <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed">
                        Thank you, <span className="text-white font-semibold">{contactName}</span>. Your consultation request and architectural parameters have been securely stored in our cloud databases.
                      </p>
                    </div>

                    <div className="bg-[#030614] border border-white/5 p-4 rounded-[24px] text-xs font-mono text-gray-500 w-full max-w-xs text-left space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span>Database Status:</span>
                        <span className="text-emerald-400 font-bold">SYNCHRONIZED</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Assigned Email:</span>
                        <span className="text-gray-300 truncate max-w-[150px]">{contactEmail}</span>
                      </div>
                      {contactMsg && (
                        <div className="flex justify-between items-start">
                          <span>Details / Slot:</span>
                          <span className="text-gray-300 truncate max-w-[150px] text-right">{contactMsg}</span>
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={handleCopyContactSummary}
                      className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white font-mono text-xs font-bold rounded-[14px] border border-white/10 transition-all hover:-translate-y-0.5 active:scale-[0.98] duration-200 cursor-pointer flex items-center gap-2"
                    >
                      {contactCopied ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-400" />
                          Copied to Clipboard!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 text-gray-400" />
                          Copy Request Summary
                        </>
                      )}
                    </button>

                    {/* Linear auto-close progress bar */}
                    <div className="w-full max-w-xs bg-white/5 border border-white/10 h-2 rounded-full overflow-hidden p-[1px] shadow-inner">
                      <motion.div
                        initial={{ width: "100%" }}
                        animate={{ width: "0%" }}
                        transition={{ duration: 8, ease: "linear" }}
                        className="bg-gradient-to-r from-purple-500 via-pink-500 to-[#FF7A00] h-full rounded-full"
                      />
                    </div>

                    <p className="text-[10px] text-gray-500 font-mono animate-pulse">
                      Modal auto-closing in a few moments...
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Policy Modal Overlay */}
      <AnimatePresence>
        {policyType && (
          <div className="fixed inset-0 bg-[#02040a]/90 backdrop-blur-xl z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-[#05091e] border border-white/10 rounded-3xl max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-2xl flex flex-col"
              role="dialog"
              aria-modal="true"
              aria-labelledby="policy-modal-title"
            >
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-brand-orange animate-ping" />
                  <h3 id="policy-modal-title" className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                    {policyType === "privacy" && "Privacy Policy & Data Security"}
                    {policyType === "terms" && "Terms of Service & Engagement"}
                    {policyType === "cookies" && "Cookie & Local Storage Policy"}
                  </h3>
                </div>
                <button
                  onClick={() => setPolicyType(null)}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Close policy"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto text-xs text-gray-400 font-sans leading-relaxed space-y-4">
                {policyType === "privacy" && (
                  <>
                    <p className="text-gray-300 font-semibold font-mono">Last Updated: July 2026</p>
                    <p>
                      At Zealguy Venture, security is baked into our engineering lifecycle. We implement a strict data minimization model to protect your enterprise consultation logs and contact schemas.
                    </p>
                    <h4 className="text-white font-bold font-mono">1. Information Collection & Storage</h4>
                    <p>
                      We compile user-submitted name records, corporate emails, project budgets, and launch timelines only to synthesize professional development blueprints. These metrics are stored securely within a fully provisioned Firebase Firestore database shielded by strict security rules.
                    </p>
                    <h4 className="text-white font-bold font-mono">2. Zero Third-Party Advertising</h4>
                    <p>
                      We do not trade, sell, or rent client details. All metadata is processed exclusively to coordinate project timelines and secure your specific software deliveries.
                    </p>
                    <h4 className="text-white font-bold font-mono">3. Encryption & Data Portability</h4>
                    <p>
                      All transmission pathways operate over forced SSL pipelines. Database volumes benefit from AES-256 cloud-native encryption at rest. Users can request total record deletions by contacting us directly through our secure WhatsApp chat node.
                    </p>
                  </>
                )}

                {policyType === "terms" && (
                  <>
                    <p className="text-gray-300 font-semibold font-mono">Last Updated: July 2026</p>
                    <p>
                      These Terms govern all strategic digital consultations, custom sandbox trials, and project engineering agreements established with Zealguy Venture.
                    </p>
                    <h4 className="text-white font-bold font-mono">1. Bespoke Project Deliveries</h4>
                    <p>
                      Zealguy Venture operates as a bespoke full-stack development provider. Deliverables are customized for individual business guidelines with no shared templates or third-party theme components.
                    </p>
                    <h4 className="text-white font-bold font-mono">2. Client Portal Integrity</h4>
                    <p>
                      Users accessing our integrated Client Portal are responsible for preserving credentials and secure browser sessions. Automated activity tracking logs are recorded to guarantee high availability and audit capabilities.
                    </p>
                    <h4 className="text-white font-bold font-mono">3. Payment Milestones & Code Rights</h4>
                    <p>
                      Full repository code rights are transferred immediately upon the completion of all contractual milestone payments.
                    </p>
                  </>
                )}

                {policyType === "cookies" && (
                  <>
                    <p className="text-gray-300 font-semibold font-mono">Last Updated: July 2026</p>
                    <p>
                      We believe in a telemetry stack that honors user speed and visual efficiency. We avoid marketing tracker cookies.
                    </p>
                    <h4 className="text-white font-bold font-mono">1. Essential Storage Objects</h4>
                    <p>
                      We utilize standard local storage parameters to preserve user portal sessions, interactive AI chatbot histories, and custom layout selections. This bypasses the need to repeatedly prompt you for state parameters.
                    </p>
                    <h4 className="text-white font-bold font-mono">2. Persistent Settings</h4>
                    <p>
                      Theme presets, layout choices, and interactive sandbox milestones are saved client-side for consistent visual rendering.
                    </p>
                    <h4 className="text-white font-bold font-mono">3. Auditing Cookies</h4>
                    <p>
                      Zero marketing or cross-site tracking cookies are injected by our systems. Our edge networks only monitor standard latency performance to optimize visual rendering speed.
                    </p>
                  </>
                )}
              </div>

              <div className="p-4 border-t border-white/5 bg-[#030614] flex justify-end">
                <button
                  onClick={() => setPolicyType(null)}
                  className="px-4 py-2 bg-white text-slate-950 font-mono font-bold rounded-lg hover:bg-white/90 text-xs transition-colors cursor-pointer"
                >
                  Close & Acknowledge
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Premium Footer */}
      <footer className="border-t border-white/5 bg-[#030614] pt-16 pb-12 relative z-10 text-xs font-mono text-gray-500">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12 items-start">
            
            {/* Column 1: Brand Strategy */}
            <div className="md:col-span-4 space-y-4 text-left">
              <span className="text-white font-extrabold tracking-widest text-sm block font-display">ZEALGUY VENTURE</span>
              <p className="text-[11px] text-gray-400 block leading-relaxed max-w-xs font-sans">
                A premium digital innovation studio and software engineering company. We write high-fidelity bespoke code and engineer fast, custom-tailored systems to grow business valuations globally.
              </p>
              {/* Premium Social Icons */}
              <div className="flex items-center gap-3 pt-2">
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:border-blue-400 hover:text-blue-400 text-gray-400 transition-all hover:-translate-y-0.5"
                  aria-label="Follow Zealguy Venture on LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:border-sky-400 hover:text-sky-400 text-gray-400 transition-all hover:-translate-y-0.5"
                  aria-label="Follow Zealguy Venture on X (Twitter)"
                >
                  <Twitter className="w-4 h-4" />
                </a>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:border-white hover:text-white text-gray-400 transition-all hover:-translate-y-0.5"
                  aria-label="Follow Zealguy Venture on GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
                <a
                  href="#services-galaxy"
                  className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:border-orange-400 hover:text-orange-400 text-gray-400 transition-all hover:-translate-y-0.5"
                  aria-label="Explore Services Ecosystem"
                >
                  <Globe className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Column 2: Quick Links - Ecosystem Services */}
            <div className="md:col-span-2 space-y-4 text-left">
              <h4 className="text-white text-[10px] font-bold tracking-widest uppercase font-mono border-b border-white/5 pb-2">
                Ecosystem Services
              </h4>
              <ul className="space-y-2 text-[11px] text-gray-400 font-sans">
                <li>
                  <button
                    onClick={() => handleNavClick("services")}
                    className="hover:text-brand-orange hover:underline transition-all cursor-pointer text-left"
                  >
                    Bespoke Web Systems
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavClick("services")}
                    className="hover:text-brand-orange hover:underline transition-all cursor-pointer text-left"
                  >
                    Custom Mobile Apps
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavClick("services")}
                    className="hover:text-brand-orange hover:underline transition-all cursor-pointer text-left"
                  >
                    AI & Automation
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavClick("services")}
                    className="hover:text-brand-orange hover:underline transition-all cursor-pointer text-left"
                  >
                    Bespoke Custom Software
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Quick Links - Resources & Hub */}
            <div className="md:col-span-2 space-y-4 text-left">
              <h4 className="text-white text-[10px] font-bold tracking-widest uppercase font-mono border-b border-white/5 pb-2">
                Company Studio
              </h4>
              <ul className="space-y-2 text-[11px] text-gray-400 font-sans">
                <li>
                  <button
                    onClick={() => handleNavClick("about")}
                    className="hover:text-brand-orange hover:underline transition-all cursor-pointer text-left"
                  >
                    Meet the Founder
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavClick("portfolio")}
                    className="hover:text-brand-orange hover:underline transition-all cursor-pointer text-left"
                  >
                    Project Case Studies
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavClick("blog")}
                    className="hover:text-brand-orange hover:underline transition-all cursor-pointer text-left"
                  >
                    Technical Insights Blog
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setModalOpen(true)}
                    className="hover:text-brand-orange hover:underline transition-all cursor-pointer text-left font-bold"
                  >
                    Initiate Project Discovery
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 4: Newsletter Subscription */}
            <div className="md:col-span-4 space-y-4 text-left">
              <h4 className="text-white text-[10px] font-bold tracking-widest uppercase font-mono border-b border-white/5 pb-2">
                Weekly Insights Dispatch
              </h4>
              <p className="text-[11px] text-gray-400 leading-relaxed font-sans">
                Subscribe to our technical briefing. Receive direct breakdowns of modern edge caching, AI alignment templates, and conversion science.
              </p>
              
              {newsletterSubscribed ? (
                <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl space-y-1">
                  <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1.5 font-mono">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    Subscribed Successfully!
                  </span>
                  <p className="text-[9px] text-emerald-300/80 font-sans">
                    You have been routed to our high-priority engineering dispatch.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                  <div className="flex gap-1.5 items-stretch">
                    <input
                      type="email"
                      required
                      placeholder="Enter corporate email"
                      value={newsletterEmail}
                      onChange={(e) => {
                        setNewsletterEmail(e.target.value);
                        if (newsletterError) setNewsletterError("");
                      }}
                      disabled={newsletterSubmitting}
                      className="flex-1 px-3 py-2 bg-slate-950/60 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus-visible:outline-none focus-visible:border-[#FF7A00] transition-colors font-sans disabled:opacity-50"
                      aria-label="Corporate Email Address"
                    />
                    <button
                      type="submit"
                      disabled={newsletterSubmitting}
                      className="px-3 py-2 bg-white hover:bg-white/90 text-[#030614] rounded-xl text-xs font-bold font-mono transition-all flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
                      aria-label="Subscribe"
                    >
                      {newsletterSubmitting ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Send className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  {newsletterError && (
                    <p className="text-[10px] text-red-400 font-mono bg-red-500/5 px-2.5 py-1 rounded-md border border-red-500/10">
                      {newsletterError}
                    </p>
                  )}
                </form>
              )}
            </div>

          </div>

          {/* Legal Compliance and Badges */}
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div className="space-y-1.5 text-left">
              <p className="text-[11px] text-gray-300 font-semibold uppercase tracking-widest font-display">
                © 2026 Zealguy Venture
              </p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-gray-500 font-sans">
                <span>Designed & engineered with absolute craftsmanship.</span>
                <span>•</span>
                <button
                  onClick={() => setPolicyType("privacy")}
                  className="hover:text-white hover:underline transition-colors cursor-pointer"
                >
                  Privacy Policy
                </button>
                <span>•</span>
                <button
                  onClick={() => setPolicyType("terms")}
                  className="hover:text-white hover:underline transition-colors cursor-pointer"
                >
                  Terms & Service
                </button>
                <span>•</span>
                <button
                  onClick={() => setPolicyType("cookies")}
                  className="hover:text-white hover:underline transition-colors cursor-pointer"
                >
                  Cookie Policy
                </button>
              </div>
            </div>
            
            <div className="text-center md:text-right space-y-0.5 font-sans shrink-0">
              <p className="text-[10px] text-brand-orange uppercase tracking-wider font-bold">
                Tailoring Bespoke Platforms.
              </p>
              <p className="text-[10px] text-blue-400 uppercase tracking-wider font-bold">
                Sub-0.5s Global Response.
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating AI Consultant Assistant */}
      <AIConsultantFloating />

      {/* Floating WhatsApp Quick Connect Button */}
      <div className="fixed bottom-24 right-6 z-40">
        <a 
          href="https://wa.me/233555055963" 
          target="_blank" 
          rel="noreferrer"
          className="w-12 h-12 bg-emerald-500 hover:bg-emerald-400 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-all duration-300 hover:scale-110 group cursor-pointer"
          title="Connect on WhatsApp Secure Chat"
        >
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.717-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.413 9.863-9.864.001-2.63-1.023-5.101-2.885-6.963C16.588 1.914 14.115.89 11.49.89c-5.44 0-9.863 4.414-9.866 9.865a9.814 9.814 0 0 0 1.45 4.832L2.012 21.01l4.635-1.856zM17.487 14.39c-.314-.157-1.858-.917-2.143-1.02-.285-.103-.493-.157-.7.157-.207.314-.8.1-.98.314-.18.214-.36.24-.674.083-.314-.157-1.326-.488-2.528-1.559-.933-.833-1.564-1.862-1.747-2.176-.18-.314-.018-.484.138-.64.14-.14.314-.365.47-.548.157-.183.21-.314.314-.523.103-.207.05-.39-.025-.548-.074-.157-.7-1.685-.957-2.31-.253-.61-.512-.527-.7-.537-.18-.01-.39-.01-.6-.01-.21 0-.55.078-.838.39-.286.314-1.096 1.07-1.096 2.612 0 1.54 1.122 3.03 1.275 3.24.153.21 2.206 3.368 5.345 4.723.746.323 1.33.515 1.785.66.75.238 1.433.204 1.973.124.602-.09 1.858-.758 2.12-1.454.26-.695.26-1.293.182-1.423-.077-.13-.284-.207-.6-.364z"/>
          </svg>
          <span className="absolute right-14 bg-[#030817] border border-white/10 text-white font-mono text-[10px] px-2 py-1 rounded-[6px] opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap">
            Secure WhatsApp Link
          </span>
        </a>
      </div>

      {/* Exit Intent Discovery & FREE Site Audit Overlays */}
      <ExitIntentPopup onTriggerAudit={() => setAuditModalOpen(true)} />
      {auditModalOpen && <WebsiteAuditModal isOpen={auditModalOpen} onClose={() => setAuditModalOpen(false)} />}

    </div>
    </>
  );
}
