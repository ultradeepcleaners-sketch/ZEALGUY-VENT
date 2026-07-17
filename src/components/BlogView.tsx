import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, 
  Calendar, 
  Clock, 
  ArrowRight, 
  BookOpen, 
  Mail, 
  ChevronRight, 
  Sparkles, 
  ArrowLeft,
  ThumbsUp,
  Share2,
  CheckCircle2,
  UserCheck
} from "lucide-react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

interface BlogPost {
  id: string;
  title: string;
  category: "Systems Engineering" | "Artificial Intelligence" | "Conversion Optimization" | "UI/UX Craft";
  excerpt: string;
  content: string[];
  author: { name: string; role: string; avatar: string };
  date: string;
  readTime: string;
  image: string;
}

export default function BlogView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [readingPostId, setReadingPostId] = useState<string | null>(null);
  const [shareCopied, setShareCopied] = useState(false);
  
  // Newsletter Form State
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterName, setNewsletterName] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Like stats
  const [likes, setLikes] = useState<Record<string, number>>({
    "physics-rendering": 42,
    "structured-json-llm": 56,
    "cro-touch-targets": 28,
    "headless-static-cms": 37
  });
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});

  const handleLike = (id: string) => {
    if (likedPosts[id]) {
      setLikes(prev => ({ ...prev, [id]: prev[id] - 1 }));
      setLikedPosts(prev => ({ ...prev, [id]: false }));
    } else {
      setLikes(prev => ({ ...prev, [id]: prev[id] + 1 }));
      setLikedPosts(prev => ({ ...prev, [id]: true }));
    }
  };

  const blogPosts: BlogPost[] = [
    {
      id: "physics-rendering",
      title: "The Physics of Sub-0.5s Rendering: Eliminating Core Web Vital Latency",
      category: "Systems Engineering",
      excerpt: "Analyze why standard web setups experience heavy latency spikes, and learn how to implement strict pre-rendering strategies that score 99+ on PageSpeed.",
      author: { name: "Zeal Patel", role: "Lead Systems Architect", avatar: "ZP" },
      date: "May 14, 2026",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
      content: [
        "In modern digital markets, speed isn't merely a nice preference—it is a critical revenue driver. Google's Search algorithms explicitly penalize websites with slow Core Web Vitals, and consumer data proves that bounce rates increase by 50% for every additional second of load latency.",
        "Most standard websites rely on server-side engines that query databases dynamically on every single page load. This introduces significant network hops, slow database queries, and server thread blockage under traffic.",
        "The solution is Static Pre-Rendering with Edge-Caching. By compiling code ahead of time during the build phase into pure static HTML, CSS, and JS files, we completely decouple page loads from runtime database queries.",
        "We host these pre-compiled assets across global Content Delivery Networks (CDNs). When a user requests a page, it is instantly served from the closest satellite node (less than 100km away). The result is immediate, frictionless page rendering under 0.5s, scoring a perfect 100 on mobile performance audits.",
        "Furthermore, we utilize native TypeScript type-stripping on server-side handlers to keep bundle sizes compact, meaning mobile browsers compile the layout almost instantaneously. Transition to pre-rendering today to secure your digital authority."
      ]
    },
    {
      id: "structured-json-llm",
      title: "Structured JSON Schema in LLMs: Designing Safe Server-Side GenAI Middlewares",
      category: "Artificial Intelligence",
      excerpt: "Avoid messy parsing errors. Learn how to configure strict structured JSON output schemas via secure server-side Express proxy API routers.",
      author: { name: "Arjun Mehta", role: "AI Integration Specialist", avatar: "AM" },
      date: "June 02, 2026",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&q=80",
      content: [
        "Generative AI models are incredibly powerful, but their raw outputs are notoriously unpredictable. If your front-end layout relies on parsing a raw text response, a single unexpected character, formatting choice, or markdown block will crash your UI.",
        "To build robust, production-ready AI applications, we must enforce Structured Outputs. By passing a strict JSON Schema definition directly to the AI model configuration, we constrain the response to a pre-defined layout structure.",
        "Crucially, all AI prompts and API calls must live behind secure server-side routes (like /api/generate-business). Exposing your raw API keys or custom prompt templates to the web browser invites reverse-engineering and bad actors.",
        "Our Express proxy router receives client requests, handles rate-limiting, injects the hidden Gemini API keys, and calls the Google GenAI SDK. Once the model returns the structured JSON, our server validates it against our TypeScript interfaces before returning it to the browser.",
        "This architectural loop guarantees that your front-end component always receives a reliable, type-safe payload, ensuring zero layout bugs, perfect error handling, and high-performance server processing."
      ]
    },
    {
      id: "cro-touch-targets",
      title: "Conversion Rate Optimization: Touch-Targets, Rhythm, and Micro-Animations",
      category: "Conversion Optimization",
      excerpt: "Discover the psychological design principles that guide user attention, optimize responsive mobile touch targets, and double form completions.",
      author: { name: "Emily Rodriguez", role: "Head of UX/UI Design", avatar: "ER" },
      date: "June 18, 2026",
      readTime: "4 min read",
      image: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?auto=format&fit=crop&w=800&q=80",
      content: [
        "A website can have millions of monthly visitors, but if none of those visitors convert into paying clients, the platform is a financial failure. High-converting interfaces are built with design intent—not default layouts.",
        "First, we must design for mobile touch. Apple and Google UI guidelines state that the minimum touch target for interactive buttons must be 44px by 44px, but we prefer 48px to accommodate all users comfortably. When layouts shrink to small screens, we collapse grids into single columns to maximize space.",
        "Second, we create visual rhythm through negative space and typographic pairing. Large display headers (like Space Grotesk) establish hierarchical focus, while compact mono indicators (like JetBrains Mono) display technical statistics without clutter.",
        "Third, we use Micro-Animations to provide tactile confirmation. When a user focuses on a text input, we apply a subtle border-glow and slight scale-up. When they hover over buttons, we trigger smooth translation transitions.",
        "By aligning physical touch constraints with clean visual psychology and tasteful animation transitions, we remove friction, build confidence, and multiply form submission conversions across all client portals."
      ]
    },
    {
      id: "headless-static-cms",
      title: "The Case Against WordPress: Heading Towards Modern Headless Static Tech",
      category: "Systems Engineering",
      excerpt: "Examine the technical debt, security vulnerabilities, and database bloat that plague legacy systems, and learn the modern alternative.",
      author: { name: "Zeal Patel", role: "Lead Systems Architect", avatar: "ZP" },
      date: "July 01, 2026",
      readTime: "4 min read",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
      content: [
        "WordPress powers a massive portion of the web, but for premium modern businesses, it has become a liability. Outdated PHP plugins introduces endless security vulnerabilities, database tables become bloated over time, and layouts lag under standard user interaction.",
        "Headless Architecture completely separates the front-end display from the back-end content database. The editor manages content inside a simple, isolated interface, and our systems compile that data into static HTML pages on every content update.",
        "Because there is no active database query occurring when a visitor loads your page, there is no database thread block or SQL injection risk. Static pages can withstand unlimited concurrent traffic without crashing.",
        "If you are looking to maximize business security, maintain lightning load speeds, and eliminate platform maintenance fees, moving away from legacy WordPress into headless React frameworks is the single best investment you can make."
      ]
    }
  ];

  const categories = ["All", "Systems Engineering", "Artificial Intelligence", "Conversion Optimization", "UI/UX Craft"];

  const filteredPosts = useMemo(() => {
    return blogPosts.filter(post => {
      const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            post.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const featuredPost = blogPosts[0];

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim() || isSubmitting) return;
    setIsSubmitting(true);

    try {
      await addDoc(collection(db, "newsletter_subscribers"), {
        name: newsletterName.trim() || "Subscriber",
        email: newsletterEmail.trim(),
        createdAt: serverTimestamp()
      });
      setNewsletterSubscribed(true);
      setIsSubmitting(false);
      setNewsletterEmail("");
      setNewsletterName("");
    } catch (err) {
      console.error("Newsletter submission failed:", err);
      setIsSubmitting(false);
    }
  };

  const activeReadingPost = blogPosts.find(p => p.id === readingPostId);

  return (
    <div className="space-y-12 py-12 text-left">
      <AnimatePresence mode="wait">
        {!activeReadingPost ? (
          <motion.div
            key="blog-list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-12"
          >
            {/* Blog Header */}
            <section className="text-center max-w-2xl mx-auto space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-mono text-brand-orange uppercase tracking-widest">
                <BookOpen className="w-3.5 h-3.5" />
                <span>TECHNICAL KNOWLEDGE HUB</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Systems Insights & Design</h1>
              <p className="text-xs text-gray-400 font-sans leading-relaxed">
                Written by our lead developers and branding specialists. Dive deep into static speed, custom schema validations, and high-conversion UX psychology.
              </p>
            </section>

            {/* Search and Category Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between max-w-4xl mx-auto bg-[#070c24]/30 p-4 rounded-[24px] border border-white/5">
              <div className="relative w-full md:max-w-xs">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles..."
                  className="w-full h-12 min-h-[48px] bg-slate-950/80 border border-white/10 rounded-[14px] px-3.5 py-3 pl-10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-orange focus:scale-[1.01] font-mono transition-all duration-200"
                />
                <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>

              <div className="flex flex-wrap gap-2 justify-center">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`h-12 min-h-[48px] px-5 py-3 rounded-full text-[10px] font-mono border transition-all cursor-pointer flex items-center justify-center ${
                      selectedCategory === cat
                        ? "bg-[#FF7A00]/10 border-brand-orange text-[#FF7A00]"
                        : "bg-white/5 border-white/5 hover:border-white/15 text-gray-400"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Featured Post (only shown when no filter and search is empty) */}
            {!searchQuery && selectedCategory === "All" && (
              <div className="max-w-4xl mx-auto bg-[#070c24]/40 border border-white/5 rounded-[32px] overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-6 hover:border-white/15 transition-all">
                <div className="lg:col-span-6 h-56 sm:h-72 lg:h-auto relative">
                  <img 
                    src={featuredPost.image} 
                    alt={featuredPost.title}
                    className="w-full h-full object-cover filter brightness-[0.75] saturate-[0.8]"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 px-2.5 py-1 bg-brand-orange/15 border border-[#FF7A00]/40 text-[#FF7A00] font-mono text-[9px] uppercase tracking-wider rounded-full">
                    Featured Article
                  </div>
                </div>
                <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between text-left space-y-4">
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest block">{featuredPost.category}</span>
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug font-display">{featuredPost.title}</h2>
                    <p className="text-xs text-gray-400 font-sans leading-relaxed">{featuredPost.excerpt}</p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-[#FF7A00] flex items-center justify-center font-bold text-white font-mono text-xs">
                        {featuredPost.author.avatar}
                      </div>
                      <div>
                        <h5 className="text-[10px] font-bold text-white font-mono">{featuredPost.author.name}</h5>
                        <p className="text-[9px] text-gray-500 font-mono uppercase">{featuredPost.author.role}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => setReadingPostId(featuredPost.id)}
                      className="h-12 min-h-[48px] px-5 bg-[#FF7A00] hover:bg-orange-500 text-white font-mono text-[10px] font-bold rounded-[12px] flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                    >
                      Read Now
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5vw mx-auto">
              {filteredPosts.map(post => (
                <div 
                  key={post.id}
                  className="bg-[#050816]/60 border border-white/5 rounded-[24px] overflow-hidden flex flex-col justify-between hover:border-white/15 transition-all group"
                >
                  <div className="relative h-40 overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-full object-cover filter brightness-[0.65] saturate-[0.8] group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute bottom-3 left-3 px-2 py-0.5 bg-slate-950/80 border border-white/10 rounded-full text-[9px] font-mono text-gray-300">
                      {post.category}
                    </span>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[9px] font-mono text-gray-500">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {post.date}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</span>
                      </div>
                      <h3 className="text-xs sm:text-sm font-bold text-white tracking-tight leading-snug font-mono group-hover:text-brand-orange transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-[10px] text-gray-400 font-sans leading-relaxed line-clamp-3">
                        {post.excerpt}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-white/5">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-bold text-white font-mono">
                          {post.author.avatar}
                        </div>
                        <span className="text-[9px] text-gray-400 font-mono">{post.author.name}</span>
                      </div>
                      <button
                        onClick={() => setReadingPostId(post.id)}
                        className="h-12 min-h-[48px] px-4 bg-white/5 border border-white/5 hover:border-[#FF7A00]/30 hover:bg-[#FF7A00]/5 text-[10px] font-mono font-bold text-[#FF7A00] flex items-center justify-center gap-1.5 rounded-[12px] transition-all cursor-pointer"
                      >
                        Read Article <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Newsletter Subscription Block */}
            <section className="bg-gradient-to-br from-[#0c1435] to-[#050816] border border-white/10 rounded-[32px] p-6 sm:p-10 max-w-4xl mx-auto relative overflow-hidden text-center sm:text-left">
              <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#FF7A00]/5 rounded-full blur-3xl pointer-events-none" />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-[9px] font-mono text-purple-400 uppercase tracking-widest">
                    <Mail className="w-3 h-3" />
                    <span>SUBSCRIBE TO INSIGHTS</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-display">
                    Join Our Systems Engineering Newsletter
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed font-sans max-w-md">
                    Receive technical breakdowns, speed audits, security bulletins, and premium CRO strategies once a month. No spam. Unsubscribe anytime.
                  </p>
                </div>

                <div className="lg:col-span-5 w-full">
                  <AnimatePresence mode="wait">
                    {!newsletterSubscribed ? (
                      <motion.form 
                        key="news-form"
                        onSubmit={handleNewsletterSubmit} 
                        className="space-y-2.5"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <input
                          type="text"
                          value={newsletterName}
                          onChange={(e) => setNewsletterName(e.target.value)}
                          placeholder="Your First Name"
                          className="w-full h-12 min-h-[48px] bg-slate-950/80 border border-white/10 rounded-[12px] px-3.5 py-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-purple-400 font-sans transition-all"
                        />
                        <div className="flex flex-col sm:flex-row gap-2">
                          <input
                            type="email"
                            required
                            value={newsletterEmail}
                            onChange={(e) => setNewsletterEmail(e.target.value)}
                            placeholder="Your Business Email"
                            className="flex-1 h-12 min-h-[48px] bg-slate-950/80 border border-white/10 rounded-[12px] px-3.5 py-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-brand-orange font-sans transition-all"
                          />
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 h-12 min-h-[48px] bg-[#FF7A00] hover:bg-orange-500 text-white font-mono text-xs font-bold rounded-[12px] shadow hover:shadow-[0_0_12px_rgba(255,122,0,0.25)] transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            {isSubmitting ? "Subscribing..." : "Subscribe"}
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.form>
                    ) : (
                      <motion.div 
                        key="news-success"
                        className="bg-emerald-500/10 border border-emerald-500/25 p-5 rounded-[20px] text-center flex flex-col items-center gap-2"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 shadow-sm">
                          <UserCheck className="w-5 h-5" />
                        </div>
                        <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wider">Verification Complete!</h4>
                        <p className="text-[11px] text-gray-400 font-sans">
                          You are registered for our Technical Digests. Stay tuned!
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </section>
          </motion.div>
        ) : (
          <motion.article
            key="blog-reading"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="max-w-3xl mx-auto space-y-8 text-left"
          >
            {/* Visual Reading Progress Bar */}
            <div className="fixed top-0 inset-x-0 h-1 bg-[#0c1435] z-[60]">
              <motion.div 
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 4.5, ease: "easeOut" }}
                className="h-full bg-brand-orange"
              />
            </div>

            <button
              onClick={() => setReadingPostId(null)}
              className="h-12 min-h-[48px] px-4 bg-white/5 border border-white/5 hover:border-white/15 rounded-[12px] inline-flex items-center gap-1.5 text-xs font-mono text-gray-400 hover:text-white transition-colors cursor-pointer group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              Back to Technical Hub
            </button>

            {/* Title Section */}
            <div className="space-y-4">
              <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-mono text-[#FF7A00] uppercase tracking-wider">
                {activeReadingPost.category}
              </span>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-snug font-display">
                {activeReadingPost.title}
              </h1>
              
              <div className="flex items-center gap-4 py-4 border-y border-white/5 text-xs text-gray-400 font-mono">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-500 to-[#FF7A00] flex items-center justify-center font-bold text-white font-mono text-xs">
                    {activeReadingPost.author.avatar}
                  </div>
                  <div>
                    <h5 className="font-bold text-white font-mono">{activeReadingPost.author.name}</h5>
                    <p className="text-[10px] text-gray-500 font-mono uppercase">{activeReadingPost.author.role}</p>
                  </div>
                </div>
                <span className="text-gray-600">|</span>
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {activeReadingPost.date}</span>
                <span className="text-gray-600">|</span>
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {activeReadingPost.readTime}</span>
              </div>
            </div>

            {/* Post Image */}
            <div className="h-56 sm:h-80 w-full rounded-[24px] overflow-hidden border border-white/5">
              <img 
                src={activeReadingPost.image} 
                alt={activeReadingPost.title}
                className="w-full h-full object-cover filter brightness-[0.75] saturate-[0.8]"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Article Content */}
            <div className="space-y-6 text-xs sm:text-sm text-gray-300 font-sans leading-relaxed">
              {activeReadingPost.content.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>

            {/* Foot Interactions */}
            <div className="flex items-center justify-between py-6 border-y border-white/5">
              <button
                onClick={() => handleLike(activeReadingPost.id)}
                className={`h-12 min-h-[48px] px-5 rounded-full border text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  likedPosts[activeReadingPost.id]
                    ? "bg-[#FF7A00]/10 border-brand-orange text-[#FF7A00]"
                    : "bg-white/5 border-white/5 hover:border-white/10 text-gray-400 hover:text-white"
                }`}
              >
                <ThumbsUp className={`w-4 h-4 ${likedPosts[activeReadingPost.id] ? "fill-[#FF7A00]" : ""}`} />
                <span>Liked ({likes[activeReadingPost.id]})</span>
              </button>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  setShareCopied(true);
                  setTimeout(() => setShareCopied(false), 2000);
                }}
                className="h-12 min-h-[48px] px-5 bg-white/5 border border-white/5 hover:border-white/10 rounded-full text-xs font-mono text-gray-400 hover:text-white transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Share2 className="w-4 h-4" />
                <span>{shareCopied ? "Copied!" : "Share Link"}</span>
              </button>
            </div>
          </motion.article>
        )}
      </AnimatePresence>
    </div>
  );
}
