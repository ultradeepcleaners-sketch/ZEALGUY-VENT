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
