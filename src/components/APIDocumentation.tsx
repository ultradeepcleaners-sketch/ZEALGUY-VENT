import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Terminal, 
  Code2, 
  Server, 
  Search, 
  Copy, 
  Check, 
  Globe, 
  Database, 
  Key, 
  Lock, 
  Activity, 
  Cpu, 
  Play, 
  Eye, 
  Sparkles, 
  ArrowRight,
  TrendingUp,
  ExternalLink,
  ShieldAlert,
  Settings
} from "lucide-react";

// Types
export interface APIEndpoint {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  path: string;
  version: "v1" | "v2";
  category: "Auth" | "Leads" | "Projects" | "Billing" | "AI & Quotation" | "Analytics" | "CRM";
  description: string;
  authRequired: boolean;
  requiredRole: string;
  requestParams?: Array<{ name: string; type: string; required: boolean; description: string }>;
  requestBody?: string;
  successResponse: string;
}

export interface GraphQLQuery {
  type: "query" | "mutation";
  name: string;
  description: string;
  arguments: string;
  schema: string;
  response: string;
}

// Volume 5 Backend Architecture Datasets
const REST_ENDPOINTS: APIEndpoint[] = [
  // --- AUTHENTICATION & USERS ---
  {
    method: "POST",
    path: "/auth/register",
    version: "v1",
    category: "Auth",
    description: "Register a new account or client workspace on the DBOS platform.",
    authRequired: false,
    requiredRole: "Guest",
    requestBody: `{
  "fullName": "Alice Sterling",
  "email": "alice@company.com",
  "phone": "+1 (555) 982-1243",
  "companyName": "Sterling Cybernetics",
  "industry": "Artificial Intelligence"
}`,
    successResponse: `{
  "status": "success",
  "message": "Verification email dispatched.",
  "data": {
    "userId": "usr_90a1b2c3d4",
    "email": "alice@company.com",
    "mfaEnabled": false,
    "role": "Client"
  }
}`
  },
  {
    method: "POST",
    path: "/auth/login",
    version: "v1",
    category: "Auth",
    description: "Authenticate user and issue secure JWT cookies or session tokens.",
    authRequired: false,
    requiredRole: "Guest",
    requestBody: `{
  "email": "lead_pm@zealguy.com",
  "passwordHash": "SHA256_HASH_STRING"
}`,
    successResponse: `{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 86400,
  "user": {
    "userId": "usr_pm_883a",
    "fullName": "Marcus Aurelius",
    "role": "Project Manager",
    "lastLogin": "2026-07-14T03:00:00Z"
  }
}`
  },
  // --- LEADS ---
  {
    method: "GET",
    path: "/leads",
    version: "v1",
    category: "Leads",
    description: "Retrieve complete sales pipeline and leads sorted by estimated budget and priority.",
    authRequired: true,
    requiredRole: "Sales, Admin, Super Admin",
    successResponse: `[
  {
    "leadId": "ld_0918a",
    "source": "Interactive Discovery Wizard",
    "businessType": "Enterprise AI Portal",
    "estimatedBudget": 75000,
    "priority": "High",
    "stage": "Qualified",
    "assignedSalesperson": "Sarah Jenkins",
    "notes": "Interested in HIPAA compliant Firestore blueprinting."
  }
]`
  },
  {
    method: "POST",
    path: "/leads",
    version: "v1",
    category: "Leads",
    description: "Ingest a new lead from internal or external marketing webhooks.",
    authRequired: true,
    requiredRole: "Sales, Developer, Admin",
    requestBody: `{
  "source": "Google Ads API",
  "businessType": "SaaS Platform",
  "estimatedBudget": 45000,
  "notes": "Requests Next.js SSR with sub-0.5s edge caching."
}`,
    successResponse: `{
  "status": "created",
  "leadId": "ld_9918z",
  "score": 85,
  "pipelineStage": "New"
}`
  },
  // --- PROJECTS ---
  {
    method: "GET",
    path: "/projects/:id/milestones",
    version: "v1",
    category: "Projects",
    description: "List all active project milestones, completion percentages, and delivery statuses.",
    authRequired: true,
    requiredRole: "Client, Developer, PM, Admin",
    successResponse: `{
  "projectId": "proj_zeus_11",
  "projectName": "Project ZEUS",
  "progress": 78.5,
  "milestones": [
    {
      "id": "ms_phase1",
      "name": "Database Schema Setup & Seeding",
      "completed": true,
      "deadline": "2026-07-01"
    },
    {
      "id": "ms_phase2",
      "name": "Live Telemetry Recharts Widget",
      "completed": true,
      "deadline": "2026-07-10"
    },
    {
      "id": "ms_phase3",
      "name": "Interactive API Documentation",
      "completed": false,
      "deadline": "2026-07-18"
    }
  ]
}`
  },
  {
    method: "PATCH",
    path: "/projects/:id/tasks/:taskId",
    version: "v2",
    category: "Projects",
    description: "Update task parameters, time-tracking logs, and attachments on the DBOS platform.",
    authRequired: true,
    requiredRole: "Developer, PM, Admin",
    requestBody: `{
  "status": "In_Progress",
  "timeLoggedMinutes": 180,
  "checklistUpdates": {
    "itemIndex": 2,
    "checked": true
  }
}`,
    successResponse: `{
  "taskId": "task_recharts_integration",
  "updatedAt": "2026-07-14T03:25:00Z",
  "auditLogged": true
}`
  },
  // --- BILLING / INVOICES ---
  {
    method: "POST",
    path: "/billing/invoices/generate-pdf",
    version: "v1",
    category: "Billing",
    description: "Trigger automated PDF generation for client billing and upload to cloud storage.",
    authRequired: true,
    requiredRole: "Finance, Admin",
    requestBody: `{
  "invoiceNumber": "INV-2026-004",
  "taxRate": 15,
  "currency": "USD",
  "discount": 500
}`,
    successResponse: `{
  "invoiceId": "inv_88a",
  "pdfUrl": "https://storage.zealguy.com/vault/invoices/INV-2026-004.pdf",
  "status": "Generated"
}`
  },
  {
    method: "POST",
    path: "/billing/payments/stripe-webhook",
    version: "v2",
    category: "Billing",
    description: "Stripe Webhook handler to reconcile manual/automated credit invoices on receipt.",
    authRequired: false,
    requiredRole: "Stripe System",
    requestBody: `{
  "type": "payment_intent.succeeded",
  "data": {
    "object": {
      "amount": 2640000,
      "currency": "usd",
      "customer": "cus_993hba"
    }
  }
}`,
    successResponse: `{
  "received": true,
  "reconciledInvoice": "INV-2026-004",
  "stage": "Won"
}`
  },
  // --- AI & QUOTATION ---
  {
    method: "POST",
    path: "/ai/generate-proposal",
    version: "v2",
    category: "AI & Quotation",
    description: "Draft an automated high-fidelity system proposal based on interactive Wizard logs.",
    authRequired: true,
    requiredRole: "Sales, PM, Admin",
    requestBody: `{
  "leadId": "ld_0918a",
  "preferredPlatform": "Next.js + GCP",
  "timelineWeeks": 12,
  "brandingLevel": "Premium"
}`,
    successResponse: `{
  "proposalId": "prop_ai_99a",
  "generatedProposalMarkdown": "# Technical Proposal for Sterling Cybernetics\\n\\n### 1. Abstract\\n...",
  "estimatedCost": 75000,
  "confidenceScore": 96.4
}`
  },
  {
    method: "POST",
    path: "/ai/consultant/query",
    version: "v1",
    category: "AI & Quotation",
    description: "Post a query to the automated virtual AI website consultant proxy.",
    authRequired: false,
    requiredRole: "Guest",
    requestBody: `{
  "userId": "guest_session_9932",
  "message": "Do you build HIPAA-compliant applications with cloud hosting?"
}`,
    successResponse: `{
  "reply": "Yes! We specialize in HIPAA compliant medical data pipelines. Our setups use Google Cloud VPC isolation with AES-256 databases.",
  "recommendedService": "Enterprise Cloud Architecture Strategy",
  "escalatedToHuman": false
}`
  },
  // --- TELEMETRY & ANALYTICS ---
  {
    method: "GET",
    path: "/analytics/telemetry/monthly",
    version: "v2",
    category: "Analytics",
    description: "Retrieve comprehensive monthly aggregated business stats for visitors, leads, and conversion ratios.",
    authRequired: true,
    requiredRole: "Admin, Super Admin, Finance",
    successResponse: `{
  "metrics": [
    { "month": "Jan", "visitors": 2100, "leads": 80, "conversions": 18, "revenue": 18500 },
    { "month": "Feb", "visitors": 2450, "leads": 95, "conversions": 24, "revenue": 22000 }
  ],
  "totalRevenueYearToDate": 40500,
  "growthPercent": 14.2
}`
  }
];

const GRAPHQL_ENDPOINTS: GraphQLQuery[] = [
  {
    type: "query",
    name: "projectDetails",
    description: "Retrieve a project by ID with deep graphs of nested milestones, assigned team, and invoices.",
    arguments: "id: ID!",
    schema: `query GetProjectDetails($id: ID!) {
  project(id: $id) {
    projectName
    budget
    deadline
    status
    assignedTeam {
      fullName
      role
    }
    milestones {
      name
      completed
      tasks {
        taskName
        priority
      }
    }
  }
}`,
    response: `{
  "data": {
    "project": {
      "projectName": "Project ZEUS DBOS Integration",
      "budget": 120000,
      "deadline": "2026-10-31",
      "status": "In_Progress",
      "assignedTeam": [
        { "fullName": "Jane Doe", "role": "Lead Architect" }
      ],
      "milestones": [
        {
          "name": "Backend REST Core Setup",
          "completed": true,
          "tasks": [
            { "taskName": "Setup API Gateway Routing", "priority": "High" }
          ]
        }
      ]
    }
  }
}`
  },
  {
    type: "mutation",
    name: "createLead",
    description: "Directly mutation-inject a qualified project lead into the pipeline database.",
    arguments: "input: CreateLeadInput!",
    schema: `mutation IngestLead($input: CreateLeadInput!) {
  createLead(input: $input) {
    leadId
    pipelineStage
    assignedSalesperson
    createdAt
  }
}`,
    response: `{
  "data": {
    "createLead": {
      "leadId": "ld_gql_883a",
      "pipelineStage": "New",
      "assignedSalesperson": "Unassigned",
      "createdAt": "2026-07-14T03:20:00Z"
    }
  }
}`
  },
  {
    type: "query",
    name: "telemetryAggregate",
    description: "Fetch real-time analytical telemetry for the administrative overview board.",
    arguments: "rangeDays: Int!",
    schema: `query FetchTelemetry($rangeDays: Int!) {
  telemetryAggregate(rangeDays: $rangeDays) {
    activeSessions
    errorRate
    latencyMs
    databaseQueriesCount
  }
}`,
    response: `{
  "data": {
    "telemetryAggregate": {
      "activeSessions": 148,
      "errorRate": 0.02,
      "latencyMs": 142.5,
      "databaseQueriesCount": 38240
    }
  }
}`
  }
];

export default function APIDocumentation() {
  const [activeTab, setActiveTab] = useState<"v1" | "v2" | "graphql">("v1");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [copiedPath, setCopiedPath] = useState<string | null>(null);
  
  // Simulation Playground states
  const [simulatedEndpoint, setSimulatedEndpoint] = useState<APIEndpoint | null>(null);
  const [simulating, setSimulating] = useState<boolean>(false);
  const [simulationResponse, setSimulationResponse] = useState<string>("");
  const [simulatedLatency, setSimulatedLatency] = useState<number>(0);
  const [simulatedStatusCode, setSimulatedStatusCode] = useState<number>(200);

  // List of active categories for REST
  const categories = useMemo(() => {
    return ["All", "Auth", "Leads", "Projects", "Billing", "AI & Quotation", "Analytics"];
  }, []);

  // Filtered REST Endpoints
  const filteredREST = useMemo(() => {
    return REST_ENDPOINTS.filter((endpoint) => {
      const isCorrectVersion = endpoint.version === activeTab;
      const matchesCategory = selectedCategory === "All" || endpoint.category === selectedCategory;
      const matchesSearch = 
        endpoint.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
        endpoint.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        endpoint.category.toLowerCase().includes(searchQuery.toLowerCase());
      return isCorrectVersion && matchesCategory && matchesSearch;
    });
  }, [activeTab, selectedCategory, searchQuery]);

  // Filtered GraphQL Queries
  const filteredGQL = useMemo(() => {
    return GRAPHQL_ENDPOINTS.filter((gql) => {
      return (
        gql.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        gql.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        gql.type.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [searchQuery]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedPath(id);
      setTimeout(() => setCopiedPath(null), 2000);
    });
  };

  // Run Simulated API Call locally
  const runSimulator = (endpoint: APIEndpoint) => {
    setSimulatedEndpoint(endpoint);
    setSimulating(true);
    setSimulationResponse("");
    
    // Random latency matching high speed
    const latency = Math.floor(80 + Math.random() * 190);
    setSimulatedLatency(latency);

    setTimeout(() => {
      setSimulationResponse(endpoint.successResponse);
      setSimulatedStatusCode(200);
      setSimulating(false);
    }, latency + 400); // Add a small animation delay
  };

  const runGQLSimulator = (gql: GraphQLQuery) => {
    setSimulating(true);
    setSimulationResponse("");
    const latency = Math.floor(60 + Math.random() * 120);
    setSimulatedLatency(latency);

    setTimeout(() => {
      setSimulationResponse(gql.response);
      setSimulatedStatusCode(200);
      setSimulating(false);
    }, latency + 400);
  };

  return (
    <div className="w-full bg-[#030614]/70 border-t border-white/5 py-24 relative overflow-hidden" id="api-documentation-section">
      {/* Design Grid & Lighting overlays */}
      <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#0c132c_1px,transparent_1px),linear-gradient(to_bottom,#0c132c_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-35" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-blue-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-brand-orange/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 border-b border-white/5 pb-10">
          <div className="space-y-3">
            <span className="text-[10px] font-mono text-brand-orange uppercase tracking-widest font-bold flex items-center gap-1.5">
              <Server className="w-4 h-4 animate-pulse" />
              Zealguy Venture DBOS Spec v1.0
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight font-display">
              API Gateways & Architecture
            </h2>
            <p className="text-xs text-gray-400 max-w-xl leading-relaxed font-sans">
              Connect external webhooks, sales engines, client platforms, and custom pipelines directly into our Digital Business Operating System. Fully secure, compliant, and scale-ready.
            </p>
          </div>

          {/* Interactive Top Tab switcher */}
          <div className="flex bg-[#050816] p-1.5 rounded-[18px] border border-white/5 shadow-inner self-start md:self-auto">
            <button
              onClick={() => { setActiveTab("v1"); setSelectedCategory("All"); }}
              className={`px-4 py-2 font-mono text-[10px] uppercase font-bold rounded-[12px] transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "v1" 
                  ? "bg-blue-500/10 border border-blue-500/25 text-blue-400" 
                  : "text-gray-500 hover:text-white"
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              REST API v1
            </button>
            <button
              onClick={() => { setActiveTab("v2"); setSelectedCategory("All"); }}
              className={`px-4 py-2 font-mono text-[10px] uppercase font-bold rounded-[12px] transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "v2" 
                  ? "bg-brand-orange/15 border border-brand-orange/20 text-brand-orange" 
                  : "text-gray-500 hover:text-white"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              REST API v2 (Enterprise)
            </button>
            <button
              onClick={() => { setActiveTab("graphql"); setSelectedCategory("All"); }}
              className={`px-4 py-2 font-mono text-[10px] uppercase font-bold rounded-[12px] transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "graphql" 
                  ? "bg-purple-500/15 border border-purple-500/20 text-purple-400" 
                  : "text-gray-500 hover:text-white"
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              GraphQL Schema
            </button>
          </div>
        </div>

        {/* Search, Categories, and Documentation Body layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT AREA: Filter Sidebar & Explorer */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Quick Search Panel */}
            <div className="bg-[#050816]/90 border border-white/10 rounded-[24px] p-5">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-display mb-3 flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-brand-orange" />
                Live Schema Search
              </h4>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Filter endpoints, params, paths..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 bg-[#030614] border border-white/5 rounded-[14px] text-gray-300 placeholder-gray-500 text-xs focus:outline-none focus:border-blue-500/50 transition-all font-mono"
                />
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-600" />
              </div>
            </div>

            {/* REST Category Selector (Only visible for v1 and v2 tabs) */}
            {activeTab !== "graphql" && (
              <div className="bg-[#050816]/90 border border-white/10 rounded-[24px] p-5 space-y-2">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider font-display mb-3 flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-blue-400" />
                  Database Modules
                </h4>
                <div className="flex flex-col gap-1.5">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full text-left px-3 py-2 rounded-[12px] text-[11px] font-mono transition-all flex items-center justify-between cursor-pointer ${
                        selectedCategory === cat
                          ? "bg-white/5 text-white font-bold border-l-2 border-brand-orange"
                          : "text-gray-500 hover:text-gray-300 hover:bg-white/[0.01]"
                      }`}
                    >
                      <span>{cat}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded-[8px] bg-white/[0.02] border border-white/5 text-gray-600">
                        {cat === "All" 
                          ? REST_ENDPOINTS.filter(e => e.version === activeTab).length
                          : REST_ENDPOINTS.filter(e => e.version === activeTab && e.category === cat).length
                        }
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Secure Authorization Credentials Card */}
            <div className="bg-gradient-to-br from-[#070b22] to-[#030614] border border-white/5 rounded-[24px] p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center gap-2 text-xs font-mono text-brand-orange font-bold uppercase tracking-wider mb-2">
                <Lock className="w-3.5 h-3.5 text-brand-orange animate-pulse" />
                Secure RBAC Authorization
              </div>
              <p className="text-[11px] text-gray-400 leading-relaxed font-sans mb-3">
                API requests to protected business directories are governed by role-based access tokens. Attach your secure credentials to authorize communication:
              </p>
              <div className="bg-[#030614] border border-white/5 rounded-[14px] p-3 font-mono text-[10px] text-blue-400 select-all relative group">
                Authorization: Bearer <span className="text-gray-500">{"<YOUR_JWT_TOKEN>"}</span>
              </div>
            </div>

          </div>

          {/* RIGHT AREA: Expanded Details, Code Schemas, Playground */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* If REST (v1 or v2) is selected */}
            {activeTab !== "graphql" && (
              <div className="space-y-6">
                {filteredREST.length > 0 ? (
                  filteredREST.map((endpoint) => (
                    <motion.div
                      layoutId={`rest-card-${endpoint.method}-${endpoint.path}`}
                      key={`${endpoint.method}-${endpoint.path}`}
                      className="bg-[#050816]/90 border border-white/10 rounded-[28px] overflow-hidden"
                    >
                      {/* Accordion/Card Header */}
                      <div className="p-5 sm:p-6 border-b border-white/5">
                        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                          <div className="flex items-center gap-2">
                            <span className={`px-2.5 py-1 text-[9px] font-mono font-bold uppercase rounded-[8px] tracking-wider ${
                              endpoint.method === "GET" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                              endpoint.method === "POST" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                              endpoint.method === "PUT" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                              "bg-red-500/10 text-red-400 border border-red-500/20"
                            }`}>
                              {endpoint.method}
                            </span>
                            <span className="font-mono text-xs text-white font-semibold select-all">
                              {endpoint.path}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-1.5 text-[9px] font-mono">
                            <span className="text-gray-500">Access:</span>
                            <span className={endpoint.authRequired ? "text-brand-orange font-bold flex items-center gap-1" : "text-emerald-400 font-semibold"}>
                              {endpoint.authRequired ? (
                                <>
                                  <Lock className="w-2.5 h-2.5" />
                                  Secure ({endpoint.requiredRole})
                                </>
                              ) : "Public / Anonymous"}
                            </span>
                          </div>
                        </div>

                        <p className="text-xs text-gray-300 leading-relaxed font-sans mb-4">
                          {endpoint.description}
                        </p>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => runSimulator(endpoint)}
                            className="px-3.5 py-1.5 bg-[#0a1835] hover:bg-blue-600 border border-blue-500/30 text-blue-300 hover:text-white font-mono text-[10px] rounded-[14px] flex items-center gap-1.5 cursor-pointer transition-all active:scale-[0.98]"
                          >
                            <Play className="w-3 h-3 fill-current" />
                            Simulate Request
                          </button>
                          <button
                            onClick={() => handleCopy(`${endpoint.method} https://api.zealguy.com/v1${endpoint.path}`, `${endpoint.method}-${endpoint.path}`)}
                            className="px-3 py-1.5 bg-white/[0.02] border border-white/5 hover:bg-white/5 text-gray-500 hover:text-white rounded-[14px] text-[10px] font-mono flex items-center gap-1 cursor-pointer transition-all"
                          >
                            {copiedPath === `${endpoint.method}-${endpoint.path}` ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span className="text-emerald-400">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy Path</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Code Snippets Body Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 bg-[#030614] border-t border-white/5">
                        {/* Request Body Payload */}
                        <div className="p-4 border-r border-white/5">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Request Payload</span>
                            <span className="text-[9px] font-mono text-blue-400">JSON</span>
                          </div>
                          {endpoint.requestBody ? (
                            <pre className="font-mono text-[10px] text-gray-300 bg-[#050816] p-3 rounded-[12px] border border-white/5 overflow-x-auto select-all max-h-48 leading-relaxed">
                              {endpoint.requestBody}
                            </pre>
                          ) : (
                            <div className="font-mono text-[9px] text-gray-500 bg-[#050816] p-3 rounded-[12px] border border-white/5 flex items-center justify-center h-28">
                              No request body required
                            </div>
                          )}
                        </div>

                        {/* Response Schema Payload */}
                        <div className="p-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Expected Success Response</span>
                            <span className="text-[9px] font-mono text-emerald-400">200 OK</span>
                          </div>
                          <pre className="font-mono text-[10px] text-gray-300 bg-[#050816] p-3 rounded-[12px] border border-white/5 overflow-x-auto select-all max-h-48 leading-relaxed">
                            {endpoint.successResponse}
                          </pre>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="w-full text-center py-16 border border-dashed border-white/5 rounded-[28px] bg-[#050816]/60">
                    <p className="text-xs text-gray-500 font-mono">No matching REST endpoints found for current filters.</p>
                  </div>
                )}
              </div>
            )}

            {/* If GraphQL tab is active */}
            {activeTab === "graphql" && (
              <div className="space-y-6">
                <div className="p-5 bg-gradient-to-r from-purple-950/20 to-transparent border border-purple-500/10 rounded-[28px] flex items-start gap-4 mb-6">
                  <div className="p-2 bg-purple-500/10 border border-purple-500/20 rounded-[14px]">
                    <Code2 className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-mono text-white uppercase tracking-widest font-bold">Unified GraphQL Ingress</h4>
                    <p className="text-[11px] text-gray-400 leading-relaxed font-sans">
                      Our schema allows deep query fetching of client accounts, related milestone matrices, and historical CRM timelines in a single synchronous query pipeline.
                    </p>
                    <div className="text-[10px] font-mono text-purple-400 pt-1">
                      Endpoint: <span className="text-gray-300 select-all">https://api.zealguy.com/graphql</span>
                    </div>
                  </div>
                </div>

                {filteredGQL.length > 0 ? (
                  filteredGQL.map((gql) => (
                    <motion.div
                      layoutId={`gql-card-${gql.name}`}
                      key={gql.name}
                      className="bg-[#050816]/90 border border-white/10 rounded-[28px] overflow-hidden"
                    >
                      {/* Header */}
                      <div className="p-5 sm:p-6 border-b border-white/5">
                        <div className="flex items-center justify-between gap-3 mb-2">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 text-[9px] font-mono uppercase rounded-[6px] ${
                              gql.type === "query" ? "bg-purple-500/10 text-purple-400 border border-purple-500/25" : "bg-brand-orange/10 text-brand-orange border border-brand-orange/20"
                            }`}>
                              {gql.type}
                            </span>
                            <span className="font-mono text-xs text-white font-bold">
                              {gql.name}({gql.arguments})
                            </span>
                          </div>
                          
                          <button
                            onClick={() => runGQLSimulator(gql)}
                            className="px-3 py-1 bg-purple-950/50 hover:bg-purple-600 border border-purple-500/30 text-purple-300 hover:text-white font-mono text-[9px] rounded-[10px] flex items-center gap-1 cursor-pointer transition-all"
                          >
                            <Play className="w-2.5 h-2.5 fill-current" />
                            Run Query
                          </button>
                        </div>

                        <p className="text-xs text-gray-300 leading-relaxed font-sans mb-1">
                          {gql.description}
                        </p>
                      </div>

                      {/* Query Body Graph */}
                      <div className="grid grid-cols-1 md:grid-cols-2 bg-[#030614] border-t border-white/5">
                        {/* Schema Field */}
                        <div className="p-4 border-r border-white/5">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">GraphQL Document</span>
                            <span className="text-[9px] font-mono text-purple-400">GQL</span>
                          </div>
                          <pre className="font-mono text-[10px] text-gray-300 bg-[#050816] p-3 rounded-[12px] border border-white/5 overflow-x-auto select-all max-h-48 leading-relaxed">
                            {gql.schema}
                          </pre>
                        </div>

                        {/* Return Payload */}
                        <div className="p-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Expected JSON Return</span>
                            <span className="text-[9px] font-mono text-emerald-400">JSON</span>
                          </div>
                          <pre className="font-mono text-[10px] text-gray-300 bg-[#050816] p-3 rounded-[12px] border border-white/5 overflow-x-auto select-all max-h-48 leading-relaxed">
                            {gql.response}
                          </pre>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="w-full text-center py-16 border border-dashed border-white/5 rounded-[28px] bg-[#050816]/60">
                    <p className="text-xs text-gray-500 font-mono">No matching GraphQL schemas found.</p>
                  </div>
                )}
              </div>
            )}

            {/* LIVE CONSOLE & SIMULATOR LOGS (Fixed bottom layout) */}
            <AnimatePresence>
              {simulationResponse && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="bg-black/95 border border-white/10 rounded-[28px] p-5 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
                  
                  {/* Console status top panel */}
                  <div className="flex flex-wrap items-center justify-between border-b border-white/5 pb-3 mb-4 gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      <span className="text-[10px] font-mono text-white font-bold uppercase tracking-widest">Response Sandbox Terminal</span>
                    </div>

                    <div className="flex items-center gap-4 text-[10px] font-mono">
                      <div className="flex items-center gap-1.5 text-gray-400">
                        <span>Latency:</span>
                        <span className="text-emerald-400 font-bold">{simulatedLatency}ms</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-400">
                        <span>Status:</span>
                        <span className="px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 font-bold">
                          {simulatedStatusCode} OK
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Body Log stream */}
                  <div className="space-y-3">
                    <pre className="font-mono text-[10px] text-emerald-400 bg-white/[0.01] border border-white/5 p-4 rounded-[16px] overflow-x-auto max-h-56 select-all leading-relaxed">
                      {simulationResponse}
                    </pre>
                    
                    <div className="flex justify-between items-center text-[9px] font-mono text-gray-500">
                      <span className="flex items-center gap-1 text-gray-400">
                        <Activity className="w-3 h-3 text-brand-orange" />
                        Simulation telemetry compiled and authorized successfully.
                      </span>
                      <button
                        onClick={() => setSimulationResponse("")}
                        className="text-gray-400 hover:text-white underline cursor-pointer"
                      >
                        Clear Sandbox
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

        </div>

      </div>
    </div>
  );
}
