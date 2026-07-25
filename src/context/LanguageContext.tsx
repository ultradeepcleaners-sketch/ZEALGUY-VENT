import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Language = "en" | "fr" | "es";

export interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
  shortName: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: "en", name: "English", nativeName: "English", flag: "🇺🇸", shortName: "EN" },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷", shortName: "FR" },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸", shortName: "ES" },
];

type Translations = Record<string, Record<Language, string>>;

export const translations: Translations = {
  // Navigation
  "nav.home": {
    en: "Home",
    fr: "Accueil",
    es: "Inicio",
  },
  "nav.services": {
    en: "Services",
    fr: "Services",
    es: "Servicios",
  },
  "nav.portfolio": {
    en: "Portfolio",
    fr: "Portfolio",
    es: "Portafolio",
  },
  "nav.about": {
    en: "About",
    fr: "À propos",
    es: "Nosotros",
  },
  "nav.blog": {
    en: "Blog",
    fr: "Blog",
    es: "Blog",
  },
  "nav.contact": {
    en: "Contact",
    fr: "Contact",
    es: "Contacto",
  },
  "nav.freeAudit": {
    en: "Free Audit",
    fr: "Audit Gratuit",
    es: "Auditoría Gratis",
  },
  "nav.bookConsultation": {
    en: "Book Consultation",
    fr: "Réserver une Consultation",
    es: "Reservar Consulta",
  },

  // Hero Section
  "hero.badge": {
    en: "Intelligent Digital Transformation Company",
    fr: "Entreprise de Transformation Numérique Intelligente",
    es: "Empresa de Transformación Digital Inteligente",
  },
  "hero.title1": {
    en: "We Don't Simply Design Websites.",
    fr: "Nous ne faisons pas que concevoir des sites Web.",
    es: "No solo diseñamos sitios web.",
  },
  "hero.title2": {
    en: "We Engineer Digital Growth Systems.",
    fr: "Nous concevons des systèmes de croissance numérique.",
    es: "Diseñamos sistemas de crecimiento digital.",
  },
  "hero.subtitle": {
    en: "Helping businesses launch, grow, automate and scale globally through premium custom software, mobile apps, artificial intelligence, and corporate digital experiences.",
    fr: "Aider les entreprises à se lancer, croître, automatiser et évoluer à l'échelle mondiale grâce à des logiciels sur mesure, des applications mobiles, l'intelligence artificielle et des expériences numériques d'entreprise.",
    es: "Ayudando a las empresas a lanzar, crecer, automatizar y escalar globalmente a través de software personalizado, aplicaciones móviles, inteligencia artificial y experiencias digitales corporativas.",
  },
  "hero.ctaPrimary": {
    en: "Initiate Project Discovery",
    fr: "Lancer la Découverte de Projet",
    es: "Iniciar Descubrimiento de Proyecto",
  },
  "hero.ctaSecondary": {
    en: "Explore Service Galaxy",
    fr: "Explorer la Galaxie de Services",
    es: "Explorar Galaxia de Servicios",
  },

  // Hero Stats
  "stats.platforms": {
    en: "Platforms Created",
    fr: "Plateformes Créées",
    es: "Plataformas Creadas",
  },
  "stats.revenue": {
    en: "Client Revenue Growth",
    fr: "Croissance des Revenus Clients",
    es: "Crecimiento de Ingresos del Cliente",
  },
  "stats.apps": {
    en: "Mobile Apps Live",
    fr: "Apps Mobiles en Ligne",
    es: "Apps Móviles en Vivo",
  },
  "stats.countries": {
    en: "Countries Served",
    fr: "Pays Servis",
    es: "Países Atendidos",
  },
  "stats.aiAgents": {
    en: "AI Agents Deployed",
    fr: "Agents IA Déployés",
    es: "Agentes de IA Desplegados",
  },

  // Section Headers
  "services.badge": {
    en: "Interactive Ecosystem",
    fr: "Écosystème Interactif",
    es: "Ecosistema Interactivo",
  },
  "services.title": {
    en: "Ecosystem Service Galaxy",
    fr: "Galaxie de Services de l'Écosystème",
    es: "Galaxia de Servicios del Ecosistema",
  },
  "services.desc": {
    en: "Each floating node serves as an interactive compilation module. Select an orb to visualize real-time dynamic web layouts and asset models.",
    fr: "Chaque nœud flottant sert de module de compilation interactif. Sélectionnez un orbe pour visualiser des mises en page web dynamiques et des modèles en temps réel.",
    es: "Cada nodo flotante sirve como un módulo de compilación interactivo. Seleccione un orbe para visualizar diseños web dinámicos y modelos de activos en tiempo real.",
  },

  "industries.badge": {
    en: "Tailored Sector Frameworks",
    fr: "Cadres Sectoriels Sur Mesure",
    es: "Marcos Sectoriales A Medida",
  },
  "industries.title": {
    en: "Enterprise Vertical Previews",
    fr: "Aperçus Sectoriels d'Entreprise",
    es: "Vistas Previas Sectoriales Corporativas",
  },
  "industries.desc": {
    en: "Select an industry sector to immediately render optimized HIPAA-compliant portals, wealth trackers, learn systems, and checkout pipelines.",
    fr: "Sélectionnez un secteur d'activité pour afficher immédiatement des portails conformes HIPAA, des suiveurs de patrimoine et des tunnels de paiement optimisés.",
    es: "Seleccione un sector industrial para procesar inmediatamente portales compatibles con HIPAA, rastreadores de patrimonio y tubos de pago optimizados.",
  },

  "tech.badge": {
    en: "Technological Nucleus",
    fr: "Noyau Technologique",
    es: "Núcleo Tecnológico",
  },
  "tech.title": {
    en: "Orbiting Core Systems Core",
    fr: "Noyau des Systèmes Centraux en Orbite",
    es: "Núcleo de Sistemas Centrales en Órbita",
  },

  "aiLab.badge": {
    en: "Compulsory Neural Sandbox",
    fr: "Bac à Sable Neuronal Obligatoire",
    es: "Entorno de Prueba Neuronal",
  },
  "aiLab.title": {
    en: "AI Demonstration Lab",
    fr: "Laboratoire de Démonstration IA",
    es: "Laboratorio de Demostración de IA",
  },

  "growth.badge": {
    en: "Financial & Growth Modeler",
    fr: "Modélisateur Financier et de Croissance",
    es: "Modelador Financiero y de Crecimiento",
  },
  "growth.title": {
    en: "Revenue ROI & Cost Estimator",
    fr: "Estimateur de ROI et de Coûts",
    es: "Estimador de ROI e Ingresos",
  },

  "portfolio.badge": {
    en: "Visual Craftsmanship",
    fr: "Savoir-Faire Visuel",
    es: "Artesanía Visual",
  },
  "portfolio.title": {
    en: "Immersive Project Portfolio",
    fr: "Portfolio de Projets Immersif",
    es: "Portafolio de Proyectos Inmersivo",
  },

  "globalMap.badge": {
    en: "Global Operations Telemetry",
    fr: "Télémétrie des Opérations Mondiales",
    es: "Telemetría de Operaciones Globales",
  },
  "globalMap.title": {
    en: "Global Client Network",
    fr: "Réseau Mondial de Clients",
    es: "Red Global de Clientes",
  },

  "clientPortal.badge": {
    en: "SaaS Transparency",
    fr: "Transparence SaaS",
    es: "Transparencia SaaS",
  },
  "clientPortal.title": {
    en: "Your Custom Client Portal",
    fr: "Votre Portail Client Personnalisé",
    es: "Su Portal de Cliente Personalizado",
  },

  "faq.badge": {
    en: "Executive Knowledge Base",
    fr: "Base de Connaissances Dirigeante",
    es: "Base de Conocimientos Ejecutiva",
  },
  "faq.title": {
    en: "Frequently Asked Questions",
    fr: "Foire Aux Questions",
    es: "Preguntas Frecuentes",
  },

  // Contact Modal
  "modal.title": {
    en: "Initiate Strategic Consultation",
    fr: "Initier une Consultation Stratégique",
    es: "Iniciar Consulta Estratégica",
  },
  "modal.subtitle": {
    en: "Schedule a high-impact technical workshop with our lead software architects.",
    fr: "Planifiez un atelier technique à fort impact avec nos architectes logiciels principaux.",
    es: "Programe un taller técnico de alto impacto con nuestros arquitectos de software principales.",
  },
  "modal.fullName": {
    en: "Full Name",
    fr: "Nom Complet",
    es: "Nombre Completo",
  },
  "modal.workEmail": {
    en: "Corporate Work Email",
    fr: "E-mail Professionnel",
    es: "Correo Corporativo",
  },
  "modal.budget": {
    en: "Estimated Project Budget",
    fr: "Budget Estimé du Projet",
    es: "Presupuesto Estimado del Proyecto",
  },
  "modal.timeframe": {
    en: "Target Launch Horizon",
    fr: "Horizon de Lancement Cible",
    es: "Plazo de Lanzamiento Objetivo",
  },
  "modal.message": {
    en: "Project Objectives & Technical Scope",
    fr: "Objectifs du Projet & Portée Technique",
    es: "Objetivos del Proyecto y Alcance Técnico",
  },
  "modal.submit": {
    en: "Submit Consultation Request",
    fr: "Envoyer la Demande de Consultation",
    es: "Enviar Solicitud de Consulta",
  },
  "modal.submittedTitle": {
    en: "Consultation Request Received",
    fr: "Demande de Consultation Reçue",
    es: "Solicitud de Consulta Recibida",
  },

  // Audit Modal
  "audit.title": {
    en: "Request Free Technical Website Audit",
    fr: "Demander un Audit Technique Gratuit",
    es: "Solicitar Auditoría Técnica Gratuita de Sitio Web",
  },

  // Newsletter & Footer
  "footer.newsletterTitle": {
    en: "Subscribe to Engineering Insights",
    fr: "S'abonner aux Perspectives d'Ingénierie",
    es: "Suscribirse a Perspectivas de Ingeniería",
  },
  "footer.newsletterSub": {
    en: "Receive bi-weekly technical briefs on AI integration, modern web performance, and cloud architecture.",
    fr: "Recevez des synthèses techniques bimensuelles sur l'intégration de l'IA, la performance web et l'architecture cloud.",
    es: "Reciba informes técnicos quincenales sobre integración de IA, rendimiento web moderno y arquitectura en la nube.",
  },
  "footer.rights": {
    en: "All Rights Reserved. Engineered for Global Digital Scale.",
    fr: "Tous droits réservés. Conçu pour l'échelle numérique mondiale.",
    es: "Todos los derechos reservados. Diseñado para escala digital global.",
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, defaultText?: string) => string;
  currentLanguageOption: LanguageOption;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("zealguy_app_lang");
      if (saved && (saved === "en" || saved === "fr" || saved === "es")) {
        return saved as Language;
      }
      // Check browser navigator language
      const navLang = navigator.language.slice(0, 2).toLowerCase();
      if (navLang === "fr") return "fr";
      if (navLang === "es") return "es";
    }
    return "en";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("zealguy_app_lang", lang);
    }
  };

  const t = (key: string, defaultText?: string): string => {
    if (translations[key] && translations[key][language]) {
      return translations[key][language];
    }
    // Fallback to english if available
    if (translations[key] && translations[key]["en"]) {
      return translations[key]["en"];
    }
    return defaultText || key;
  };

  const currentLanguageOption = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, currentLanguageOption }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
