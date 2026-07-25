import React, { useState, useEffect, useMemo } from "react";
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
  UserCheck,
  TrendingUp,
  SlidersHorizontal,
  Flame,
  ShieldCheck,
  Eye,
  Sliders,
  X,
  Layers,
  ChevronLeft,
  ChevronRight as ChevronRightIcon
} from "lucide-react";
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { BlogPost } from "../types";
import { initialBlogPosts } from "../data/initialBlogPosts";
import ArticleDetailView from "./blog/ArticleDetailView";
import BlogAdminStudio from "./blog/BlogAdminStudio";

interface BlogViewProps {
  onTriggerConsultation?: () => void;
}

const CATEGORIES = [
  "All",
  "Artificial Intelligence",
  "Website Development",
  "Mobile Apps",
  "UI/UX",
  "SEO",
  "Cybersecurity",
  "Cloud",
  "Business Automation",
  "Digital Marketing",
  "Branding",
  "E-Commerce",
  "Programming",
  "Startups",
  "Technology News",
  "Case Studies"
];

const DIFFICULTY_LEVELS = ["All", "Beginner", "Intermediate", "Advanced", "Architect Tier"];
const CONTENT_TYPES = ["All", "Article", "Industry Report", "Whitepaper", "Tutorial", "Case Study"];

export default function BlogView({ onTriggerConsultation }: BlogViewProps) {
  // Navigation & Mode States
  const [adminMode, setAdminMode] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  // Posts State (combines initial defaults + Firestore live posts)
  const [posts, setPosts] = useState<BlogPost[]>(initialBlogPosts);
  const [loadingPosts, setLoadingPosts] = useState(false);

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [selectedContentType, setSelectedContentType] = useState("All");
  const [sortBy, setSortBy] = useState<"latest" | "popular" | "likes">("latest");

  // Carousel active index
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Newsletter Form State
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterName, setNewsletterName] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch Firestore Posts on Mount
  useEffect(() => {
    async function loadFirestorePosts() {
      setLoadingPosts(true);
      try {
        const q = query(collection(db, "blog_posts"));
        const snapshot = await getDocs(q);
        const fetched: BlogPost[] = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title || "Untitled Article",
            slug: data.slug || doc.id,
            category: data.category || "Artificial Intelligence",
            contentType: data.contentType || "Article",
            difficulty: data.difficulty || "Architect Tier",
            excerpt: data.excerpt || "",
            content: data.content || [],
            keyTakeaways: data.keyTakeaways || [],
            author: data.author || { name: "Zeal Patel", role: "Lead Systems Architect", avatar: "ZP" },
            date: data.date || "Just now",
            readTime: data.readTime || "5 min read",
            views: data.views || 100,
            likes: data.likes || 10,
            image: data.image || "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&auto=format&fit=crop",
            tableOfContents: data.tableOfContents || [],
            faq: data.faq || [],
            seoMetadata: data.seoMetadata,
            schemaMarkup: data.schemaMarkup,
            cta: data.cta,
            citations: data.citations || [],
            originalityScore: data.originalityScore || 98.4,
            status: data.status || "published"
          };
        });

        if (fetched.length > 0) {
          // Deduplicate by ID
          const existingIds = new Set(initialBlogPosts.map(p => p.id));
          const newUnique = fetched.filter(f => !existingIds.has(f.id));
          setPosts([...newUnique, ...initialBlogPosts]);
        }
      } catch (err) {
        console.warn("Firestore posts fetch fallback:", err);
      } finally {
        setLoadingPosts(false);
      }
    }

    loadFirestorePosts();
  }, []);

  // Filtered & Sorted Posts Computation
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesSearch = 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === "All" || post.difficulty === selectedDifficulty;
      const matchesContentType = selectedContentType === "All" || post.contentType === selectedContentType;

      return matchesSearch && matchesCategory && matchesDifficulty && matchesContentType;
    }).sort((a, b) => {
      if (sortBy === "popular") return (b.views || 0) - (a.views || 0);
      if (sortBy === "likes") return (b.likes || 0) - (a.likes || 0);
      return 0; // Default order
    });
  }, [posts, searchQuery, selectedCategory, selectedDifficulty, selectedContentType, sortBy]);

  // Featured Spotlight Article
  const featuredPost = posts[0] || initialBlogPosts[0];

  // Handle Newsletter Subscribe
  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "newsletter_subscribers"), {
        email: newsletterEmail.trim(),
        name: newsletterName.trim() || "Valued Reader",
        subscribedAt: serverTimestamp()
      });
    } catch (err) {
      console.warn("Newsletter Firestore write fallback:", err);
    }

    setIsSubmitting(false);
    setNewsletterSubscribed(true);
    setNewsletterEmail("");
    setNewsletterName("");
  };

  const handlePublishedNewPost = (newPost: BlogPost) => {
    setPosts(prev => [newPost, ...prev]);
    setAdminMode(false);
    setSelectedPost(newPost);
  };

  // If reading an article, show detail view
  if (selectedPost) {
    return (
      <ArticleDetailView
        post={selectedPost}
        onBack={() => setSelectedPost(null)}
        onSelectPost={(post) => setSelectedPost(post)}
        allPosts={posts}
        onTriggerConsultation={onTriggerConsultation || (() => {})}
      />
    );
  }

  return (
    <div className="space-y-12 py-6 text-left relative">
      
      {/* Top Controls Bar: Reader Platform vs Editorial AI Studio */}
      <div className="bg-[#050816]/80 border border-white/10 rounded-[24px] p-4 flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-md shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[14px] bg-gradient-to-tr from-purple-500 via-[#FF7A00] to-bright-orange p-0.5 flex items-center justify-center font-bold text-white shadow-lg">
            <div className="w-full h-full rounded-[12px] bg-[#070c24] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#FF7A00]" />
            </div>
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white font-mono flex items-center gap-2">
              <span>ZEALGUY AI KNOWLEDGE PLATFORM</span>
              <span className="px-2 py-0.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] rounded-full">
                LIVE 2026
              </span>
            </h2>
            <p className="text-[11px] text-gray-400 font-sans">
              Systems Engineering, Gemini AI Workflows, CRO Ergonomics & Security Whitepapers.
            </p>
          </div>
        </div>

        {/* Mode Switcher Buttons */}
        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-[16px] border border-white/10 w-full sm:w-auto">
          <button
            onClick={() => setAdminMode(false)}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-[12px] text-xs font-mono font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              !adminMode 
                ? "bg-[#071E4A] text-white border border-[#0C2D70] shadow-md" 
                : "text-gray-400 hover:text-white"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-[#FF7A00]" />
            <span>Reader Knowledge Hub</span>
          </button>

          <button
            onClick={() => setAdminMode(true)}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-[12px] text-xs font-mono font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              adminMode 
                ? "bg-brand-orange text-white shadow-[0_0_15px_rgba(255,122,0,0.4)]" 
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-white animate-pulse" />
            <span>✦ Editorial AI Studio (Admin)</span>
          </button>
        </div>
      </div>

      {/* Render Admin Editorial Studio if toggled */}
      {adminMode ? (
        <BlogAdminStudio
          onPublishPost={handlePublishedNewPost}
          onCloseAdmin={() => setAdminMode(false)}
        />
      ) : (
        /* READER KNOWLEDGE HUB VIEW */
        <div className="space-y-12">
          
          {/* Hero Section */}
          <section className="bg-gradient-to-br from-[#071E4A] via-[#050816] to-[#0c1435] border border-white/10 rounded-[32px] p-8 sm:p-12 relative overflow-hidden text-center sm:text-left space-y-6 shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF7A00]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-3xl space-y-4 relative z-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-mono text-[#FF7A00] uppercase tracking-widest font-bold">
                <Flame className="w-3.5 h-3.5 text-[#FF7A00]" />
                <span>ELEVATING DIGITAL AGENCY AUTHORITY</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1] font-display">
                Engineering <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-[#FF7A00] to-bright-orange">Architectures</span> & AI Systems
              </h1>

              <p className="text-sm sm:text-base text-gray-300 font-sans leading-relaxed max-w-2xl">
                Explore authoritative technical guides, conversion rate research, Gemini SDK middlewares, and cloud cybersecurity whitepapers authored by Zealguy Venture's senior engineering team.
              </p>
            </div>

            {/* Quick Search Bar inside Hero */}
            <div className="relative max-w-2xl z-10 pt-2">
              <div className="relative flex items-center">
                <Search className="w-5 h-5 text-[#FF7A00] absolute left-4 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles, keywords, or topics (e.g. Sub-0.5s Rendering, Gemini API, CRO)..."
                  className="w-full h-14 min-h-[56px] pl-12 pr-10 bg-slate-950/80 border border-white/15 focus:border-[#FF7A00] rounded-[20px] text-xs sm:text-sm text-white placeholder-gray-400 focus:outline-none font-mono shadow-2xl transition-all"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 text-gray-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </section>

          {/* Interactive Trending Carousel */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white font-mono text-sm font-bold">
                <Flame className="w-4 h-4 text-bright-orange" />
                <h3>Trending Technical Insights</h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCarouselIndex(prev => (prev === 0 ? posts.length - 1 : prev - 1))}
                  className="w-9 h-9 rounded-[10px] bg-white/5 border border-white/10 hover:border-[#FF7A00] text-gray-300 hover:text-white flex items-center justify-center cursor-pointer transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCarouselIndex(prev => (prev === posts.length - 1 ? 0 : prev + 1))}
                  className="w-9 h-9 rounded-[10px] bg-white/5 border border-white/10 hover:border-[#FF7A00] text-gray-300 hover:text-white flex items-center justify-center cursor-pointer transition-all"
                >
                  <ChevronRightIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Carousel Item */}
            {posts[carouselIndex] && (
              <div 
                onClick={() => setSelectedPost(posts[carouselIndex])}
                className="bg-gradient-to-r from-[#071E4A] via-[#050816] to-[#0c1435] border border-white/10 rounded-[28px] p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center hover:border-brand-orange/50 transition-all cursor-pointer group shadow-xl"
              >
                <div className="md:col-span-7 space-y-4">
                  <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono">
                    <span className="px-3 py-1 bg-brand-orange/20 border border-brand-orange/40 text-brand-orange rounded-full font-bold">
                      Trending #{carouselIndex + 1}
                    </span>
                    <span className="px-3 py-1 bg-purple-500/15 border border-purple-500/30 text-purple-400 rounded-full font-bold">
                      {posts[carouselIndex].category}
                    </span>
                    <span className="text-emerald-400 font-bold">
                      {posts[carouselIndex].views || 3420} Readers
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-brand-orange transition-colors font-display">
                    {posts[carouselIndex].title}
                  </h3>

                  <p className="text-xs sm:text-sm text-gray-300 font-sans line-clamp-2 leading-relaxed">
                    {posts[carouselIndex].excerpt}
                  </p>

                  <div className="pt-2 flex items-center gap-4 text-xs font-mono text-gray-400">
                    <span>{posts[carouselIndex].author.name}</span>
                    <span>•</span>
                    <span>{posts[carouselIndex].readTime}</span>
                    <span className="text-brand-orange font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Read Article <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>

                <div className="md:col-span-5 h-48 sm:h-56 rounded-[20px] overflow-hidden border border-white/10">
                  <img 
                    src={posts[carouselIndex].image} 
                    alt={posts[carouselIndex].title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            )}
          </section>

          {/* Filter Bar with 15 Categories, Content Types, Difficulty, and Sort */}
          <section className="space-y-4 bg-[#070c24]/60 border border-white/10 p-6 rounded-[28px] shadow-lg">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div className="flex items-center gap-2 text-white font-mono text-xs font-bold uppercase">
                <SlidersHorizontal className="w-4 h-4 text-[#FF7A00]" />
                <span>Knowledge Base Filters</span>
              </div>

              {/* Sort & Quick Selectors */}
              <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
                <span className="text-gray-400">Sort By:</span>
                <button
                  onClick={() => setSortBy("latest")}
                  className={`px-3 py-1 rounded-[10px] cursor-pointer transition-all ${
                    sortBy === "latest" ? "bg-[#FF7A00] text-white font-bold" : "bg-white/5 text-gray-400 hover:text-white"
                  }`}
                >
                  Latest
                </button>
                <button
                  onClick={() => setSortBy("popular")}
                  className={`px-3 py-1 rounded-[10px] cursor-pointer transition-all ${
                    sortBy === "popular" ? "bg-[#FF7A00] text-white font-bold" : "bg-white/5 text-gray-400 hover:text-white"
                  }`}
                >
                  Most Read
                </button>
                <button
                  onClick={() => setSortBy("likes")}
                  className={`px-3 py-1 rounded-[10px] cursor-pointer transition-all ${
                    sortBy === "likes" ? "bg-[#FF7A00] text-white font-bold" : "bg-white/5 text-gray-400 hover:text-white"
                  }`}
                >
                  Highest Rated
                </button>
              </div>
            </div>

            {/* Category Chips Bar (Scrollable 15 Categories) */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-gray-400 uppercase font-bold block">
                Categories ({CATEGORIES.length - 1} Specializations):
              </span>
              <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto pr-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-[12px] text-xs font-mono transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? "bg-[#FF7A00] text-white font-bold shadow-md"
                        : "bg-white/5 border border-white/5 text-gray-300 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Sub-Filters Grid: Difficulty & Content Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/5 font-mono text-xs">
              <div className="space-y-1.5">
                <span className="text-[10px] text-gray-400 uppercase font-bold block">Target Difficulty Level:</span>
                <div className="flex flex-wrap gap-1.5">
                  {DIFFICULTY_LEVELS.map((diff) => (
                    <button
                      key={diff}
                      onClick={() => setSelectedDifficulty(diff)}
                      className={`px-2.5 py-1 rounded-[8px] text-[11px] cursor-pointer transition-all ${
                        selectedDifficulty === diff
                          ? "bg-purple-500/30 border border-purple-500 text-purple-300 font-bold"
                          : "bg-white/5 text-gray-400 hover:text-white"
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] text-gray-400 uppercase font-bold block">Publication Format:</span>
                <div className="flex flex-wrap gap-1.5">
                  {CONTENT_TYPES.map((ct) => (
                    <button
                      key={ct}
                      onClick={() => setSelectedContentType(ct)}
                      className={`px-2.5 py-1 rounded-[8px] text-[11px] cursor-pointer transition-all ${
                        selectedContentType === ct
                          ? "bg-blue-500/30 border border-blue-500 text-blue-300 font-bold"
                          : "bg-white/5 text-gray-400 hover:text-white"
                      }`}
                    >
                      {ct}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Posts Grid List */}
          <section className="space-y-6">
            <div className="flex items-center justify-between text-xs font-mono text-gray-400">
              <span>Showing {filteredPosts.length} Technical Articles</span>
              {(selectedCategory !== "All" || selectedDifficulty !== "All" || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedCategory("All");
                    setSelectedDifficulty("All");
                    setSelectedContentType("All");
                    setSearchQuery("");
                  }}
                  className="text-brand-orange hover:underline cursor-pointer"
                >
                  Clear All Filters
                </button>
              )}
            </div>

            {filteredPosts.length === 0 ? (
              <div className="bg-[#070c24]/40 border border-white/10 rounded-[24px] p-12 text-center space-y-3 font-mono">
                <BookOpen className="w-8 h-8 text-gray-500 mx-auto" />
                <p className="text-sm text-gray-300">No articles matched your exact filter criteria.</p>
                <button
                  onClick={() => {
                    setSelectedCategory("All");
                    setSelectedDifficulty("All");
                    setSelectedContentType("All");
                    setSearchQuery("");
                  }}
                  className="px-4 py-2 bg-brand-orange text-white text-xs font-bold rounded-[12px] cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.map((post) => (
                  <div
                    key={post.id}
                    onClick={() => setSelectedPost(post)}
                    className="bg-[#070c24]/70 border border-white/10 rounded-[24px] overflow-hidden hover:border-brand-orange/60 transition-all group flex flex-col justify-between cursor-pointer shadow-lg"
                  >
                    <div>
                      {/* Image Thumbnail */}
                      <div className="h-48 w-full overflow-hidden relative">
                        <img 
                          src={post.image} 
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                          <span className="px-2.5 py-0.5 bg-slate-950/80 border border-white/20 text-brand-orange font-mono text-[10px] rounded-full backdrop-blur-md font-bold">
                            {post.category}
                          </span>
                          {post.difficulty && (
                            <span className="px-2 py-0.5 bg-purple-950/80 border border-purple-500/30 text-purple-300 font-mono text-[10px] rounded-full backdrop-blur-md">
                              {post.difficulty}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Content Info */}
                      <div className="p-5 space-y-3">
                        <div className="flex items-center gap-3 text-[10px] font-mono text-gray-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-gray-500" /> {post.date}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-gray-500" /> {post.readTime}
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-white group-hover:text-brand-orange transition-colors font-display line-clamp-2 leading-snug">
                          {post.title}
                        </h3>

                        <p className="text-xs text-gray-300 font-sans line-clamp-3 leading-relaxed">
                          {post.excerpt}
                        </p>
                      </div>
                    </div>

                    {/* Author & Footer Bar */}
                    <div className="p-5 pt-0 flex items-center justify-between border-t border-white/5 text-xs font-mono text-gray-400">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-500 to-brand-orange p-0.5 flex items-center justify-center font-bold text-white text-[10px]">
                          <div className="w-full h-full rounded-full bg-[#070c24] flex items-center justify-center">
                            {post.author.avatar}
                          </div>
                        </div>
                        <span className="text-[11px] font-semibold text-gray-200">{post.author.name}</span>
                      </div>

                      <span className="text-brand-orange font-bold text-[11px] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                        Read <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Newsletter Subscription Card */}
          <section className="bg-gradient-to-br from-[#071E4A] via-[#050816] to-[#0c1435] border border-brand-orange/30 rounded-[32px] p-8 sm:p-10 relative overflow-hidden text-center sm:text-left shadow-2xl">
            <div className="absolute top-0 right-0 w-80 h-80 bg-brand-orange/10 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10">
              <div className="md:col-span-7 space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-orange/20 border border-brand-orange/40 rounded-full text-[10px] font-mono text-brand-orange font-bold uppercase">
                  <Mail className="w-3.5 h-3.5 text-brand-orange" />
                  <span>WEEKLY EXECUTIVE TECH INSIGHTS</span>
                </div>
                
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
                  Subscribe to Architectural Briefings
                </h3>

                <p className="text-xs sm:text-sm text-gray-300 font-sans leading-relaxed">
                  Join 14,000+ CTOs and digital agency founders receiving weekly deep-dives into Gemini SDK middlewares, sub-0.5s rendering physics, and zero-trust security.
                </p>
              </div>

              <div className="md:col-span-5">
                {newsletterSubscribed ? (
                  <div className="bg-emerald-500/15 border border-emerald-500/30 p-6 rounded-[20px] text-center space-y-2 font-mono">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                    <h5 className="font-bold text-white text-sm">Subscription Confirmed!</h5>
                    <p className="text-xs text-emerald-300">Welcome to the Zealguy technical dispatch community.</p>
                  </div>
                ) : (
                  <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                    <input
                      type="text"
                      value={newsletterName}
                      onChange={(e) => setNewsletterName(e.target.value)}
                      placeholder="Your Name (Optional)"
                      className="w-full h-12 min-h-[48px] bg-slate-950/80 border border-white/10 rounded-[14px] px-3.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-orange font-mono transition-all"
                    />

                    <input
                      type="email"
                      required
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      placeholder="Enter your work email address *"
                      className="w-full h-12 min-h-[48px] bg-slate-950/80 border border-white/10 rounded-[14px] px-3.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-orange font-mono transition-all"
                    />

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-12 min-h-[48px] bg-brand-orange hover:bg-bright-orange text-white font-mono text-xs font-bold rounded-[14px] shadow-lg hover:shadow-[0_0_20px_rgba(255,122,0,0.4)] transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? "Subscribing..." : "Join Technical Dispatch"}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                )}
              </div>
            </div>
          </section>

        </div>
      )}

    </div>
  );
}
