export interface StrategyItem {
  title: string;
  description: string;
}

export interface LandingPageSection {
  title: string;
  content: string;
}

export interface LandingPageSpec {
  title: string;
  subtitle: string;
  primaryColor: string;
  secondaryColor: string;
  heroText: string;
  sections: LandingPageSection[];
}

export interface TimelineAndCost {
  costEstimate: string;
  duration: string;
  milestones: string[];
}

export interface BusinessDemoResult {
  slogan: string;
  businessStrategy: StrategyItem[];
  landingPage: LandingPageSpec;
  timelineAndCost: TimelineAndCost;
}

export interface ServiceOrb {
  id: string;
  title: string;
  description: string;
  icon: string;
  themeColor: string; // "blue", "emerald", "purple"
  interactiveType: "website" | "app" | "ai" | "marketing" | "software" | "branding";
}

export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  image: string;
  description: string;
  stats: { label: string; value: string }[];
  accentColor: string;
}

export type PageId =
  | "home"
  | "services"
  | "ai-solutions"
  | "portfolio"
  | "client-portal"
  | "about"
  | "contact"
  | "blog";

export interface BlogPostAuthor {
  name: string;
  role: string;
  avatar: string;
  bio?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  contentType?: "Article" | "Industry Report" | "Whitepaper" | "Tutorial" | "Case Study";
  difficulty?: "Beginner" | "Intermediate" | "Advanced" | "Architect Tier";
  excerpt: string;
  content: string[];
  keyTakeaways?: string[];
  author: BlogPostAuthor;
  date: string;
  updatedDate?: string;
  readTime: string;
  views?: number;
  likes?: number;
  image: string;
  tableOfContents?: { id: string; title: string }[];
  faq?: { question: string; answer: string }[];
  seoMetadata?: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
    canonicalUrl?: string;
    ogType?: string;
  };
  schemaMarkup?: {
    articleSchema: string;
    faqSchema: string;
    breadcrumbSchema: string;
  };
  cta?: {
    title: string;
    description: string;
    buttonText: string;
  };
  citations?: string[];
  originalityScore?: number;
  status?: "draft" | "published" | "scheduled";
}

export interface BlogComment {
  id: string;
  postId: string;
  authorName: string;
  commentText: string;
  createdAt: string;
}

export interface TrendItem {
  id: string;
  topic: string;
  category: string;
  businessRelevance: number;
  searchDemand: string;
  competition: string;
  trendGrowth: string;
  evergreenScore: number;
  suggestedTitle: string;
  summary: string;
}

