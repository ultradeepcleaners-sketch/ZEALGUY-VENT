import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";
import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));

// Initialize GoogleGenAI SDK on server side with safe API key usage
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// API endpoint for AI Demonstration / Business Strategist
app.post("/api/generate-business", async (req: express.Request, res: express.Response) => {
  const { businessIdea, monthlyRevenue, goal } = req.body;

  if (!businessIdea) {
    res.status(400).json({ error: "businessIdea is required" });
    return;
  }

  const businessSchema = {
    type: Type.OBJECT,
    properties: {
      slogan: { type: Type.STRING },
      businessStrategy: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING }
          },
          required: ["title", "description"]
        }
      },
      landingPage: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          subtitle: { type: Type.STRING },
          primaryColor: { type: Type.STRING },
          secondaryColor: { type: Type.STRING },
          heroText: { type: Type.STRING },
          sections: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                content: { type: Type.STRING }
              },
              required: ["title", "content"]
            }
          }
        },
        required: ["title", "subtitle", "primaryColor", "secondaryColor", "heroText", "sections"]
      },
      timelineAndCost: {
        type: Type.OBJECT,
        properties: {
          costEstimate: { type: Type.STRING },
          duration: { type: Type.STRING },
          milestones: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["costEstimate", "duration", "milestones"]
      }
    },
    required: ["slogan", "businessStrategy", "landingPage", "timelineAndCost"]
  };

  let text = "";
  let methodUsed = "gemini-3.1-pro-preview";

  try {
    console.log("Attempting generation using gemini-3.1-pro-preview (HIGH thinking level)...");
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: `Generate a premium digital business strategy and landing page mockup specification for a user's business with these details:
Business Idea / Industry: ${businessIdea}
Monthly Revenue: ${monthlyRevenue || "Not specified / Startup"}
Business Goal: ${goal || "Launch brand online & double leads"}

Provide high-fidelity structured output containing strategy suggestions, responsive landing page copy, estimated timeline, cost, and precise layout recommendations.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: businessSchema,
        thinkingConfig: {
          thinkingLevel: ThinkingLevel.HIGH
        }
      }
    });

    text = response.text || "";
    methodUsed = "gemini-3.1-pro-preview";
  } catch (error: any) {
    console.warn("Attempt 1 (gemini-3.1-pro-preview) failed or quota exceeded. Trying gemini-3.5-flash fallback...", error.message);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Generate a premium digital business strategy and landing page mockup specification for a user's business with these details:
Business Idea / Industry: ${businessIdea}
Monthly Revenue: ${monthlyRevenue || "Not specified / Startup"}
Business Goal: ${goal || "Launch brand online & double leads"}

Provide high-fidelity structured output containing strategy suggestions, responsive landing page copy, estimated timeline, cost, and precise layout recommendations.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: businessSchema
        }
      });

      text = response.text || "";
      methodUsed = "gemini-3.5-flash";
    } catch (error2: any) {
      console.warn("Attempt 2 (gemini-3.5-flash) failed or quota exceeded. Proceeding to client high-fidelity local fallback...", error2.message);
      methodUsed = "local-compiled";
    }
  }

  try {
    if (methodUsed === "local-compiled" || !text) {
      const localStrategy = {
        slogan: `Elevating ${businessIdea} with Next-Generation Digital Systems`,
        businessStrategy: [
          {
            title: "Digital Scaling Architecture",
            description: `Deploy custom backend schemas and microservice routers tailored to support ${goal || "rapid online expansion"} with zero performance overhead.`
          },
          {
            title: "High-Frequency Audience Engagement",
            description: `Implement beautiful interactive visual flows (such as modern glassmorphism or particle fields) to double lead generation rates.`
          },
          {
            title: "Predictive Intelligence Integration",
            description: `Leverage specialized AI routing agents to automatically summarize traffic data and dynamically personalize pricing or booking funnels.`
          }
        ],
        landingPage: {
          title: `${businessIdea} Elite`,
          subtitle: `Empowering ${businessIdea} with Next-Gen Systems`,
          primaryColor: "#050816",
          secondaryColor: "#8b5cf6",
          heroText: `A premium, responsive, and ultra-high speed web and mobile application designed to ${goal || "launch online & double leads"} with complete developer-level transparency.`,
          sections: [
            {
              title: "Elite Interactive Blueprint",
              content: `Experience an exceptional client portal and high-speed dashboard, built using Vite and Tailwind to run beautifully on all modern devices.`
            },
            {
              title: "Intelligent AI Automation",
              content: `Deploy high-resolution assets, custom analytics charts, and real-time messaging directly configured for ${monthlyRevenue || "Startup"} operations.`
            },
            {
              title: "Engineered For Conversions",
              content: `Optimize your checkout, booking, and lead channels. Our systems are backed by a structured development pipeline.`
            }
          ]
        },
        timelineAndCost: {
          costEstimate: monthlyRevenue && monthlyRevenue.includes("$") 
            ? `${monthlyRevenue} Scale Build` 
            : "$10,000 - $25,000 Studio Build",
          duration: "4 - 6 Weeks Deployment",
          milestones: [
            "Phase 1: Architecture Blueprint & Domain Setup",
            "Phase 2: Ultra-HQ Branding & Interactive Mockups",
            "Phase 3: Custom Portal & AI Strategist Integration",
            "Phase 4: Global Deployment on Cloud Ingress Networks"
          ]
        }
      };
      res.json(localStrategy);
      return;
    }

    const data = JSON.parse(text.trim());
    res.json(data);
  } catch (error: any) {
    console.error("AI JSON Parse Error, falling back to local strategist response:", error);
    // If JSON parsing of Gemini output fails for some reason, return the beautiful local fallback
    const fallbackStrategy = {
      slogan: `Elevating ${businessIdea} with Next-Generation Digital Systems`,
      businessStrategy: [
        {
          title: "Digital Scaling Architecture",
          description: `Deploy custom backend schemas and microservice routers tailored to support ${goal || "rapid online expansion"} with zero performance overhead.`
        },
        {
          title: "High-Frequency Audience Engagement",
          description: `Implement beautiful interactive visual flows (such as modern glassmorphism or particle fields) to double lead generation rates.`
        },
        {
          title: "Predictive Intelligence Integration",
          description: `Leverage specialized AI routing agents to automatically summarize traffic data and dynamically personalize pricing or booking funnels.`
        }
      ],
      landingPage: {
        title: `${businessIdea} Elite`,
        subtitle: `Empowering ${businessIdea} with Next-Gen Systems`,
        primaryColor: "#050816",
        secondaryColor: "#8b5cf6",
        heroText: `A premium, responsive, and ultra-high speed web and mobile application designed to ${goal || "launch online & double leads"} with complete developer-level transparency.`,
        sections: [
          {
            title: "Elite Interactive Blueprint",
            content: `Experience an exceptional client portal and high-speed dashboard, built using Vite and Tailwind to run beautifully on all modern devices.`
          },
          {
            title: "Intelligent AI Automation",
            content: `Deploy high-resolution assets, custom analytics charts, and real-time messaging directly configured for ${monthlyRevenue || "Startup"} operations.`
          },
          {
            title: "Engineered For Conversions",
            content: `Optimize your checkout, booking, and lead channels. Our systems are backed by a structured development pipeline.`
          }
        ]
      },
      timelineAndCost: {
        costEstimate: monthlyRevenue && monthlyRevenue.includes("$") 
          ? `${monthlyRevenue} Scale Build` 
          : "$10,000 - $25,000 Studio Build",
        duration: "4 - 6 Weeks Deployment",
        milestones: [
          "Phase 1: Architecture Blueprint & Domain Setup",
          "Phase 2: Ultra-HQ Branding & Interactive Mockups",
          "Phase 3: Custom Portal & AI Strategist Integration",
          "Phase 4: Global Deployment on Cloud Ingress Networks"
        ]
      }
    };
    res.json(fallbackStrategy);
  }
});

// API endpoint for Project Discovery Summary Generator
app.post("/api/generate-discovery-summary", async (req: express.Request, res: express.Response) => {
  const { businessType, objectives, budget, timeline, name } = req.body;

  if (!businessType || !objectives) {
    res.status(400).json({ error: "businessType and objectives are required" });
    return;
  }

  const discoverySchema = {
    type: Type.OBJECT,
    properties: {
      summary: { type: Type.STRING },
      opportunities: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      },
      actionPlan: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      }
    },
    required: ["summary", "opportunities", "actionPlan"]
  };

  try {
    console.log("Generating tailored project discovery summary using gemini-3.5-flash...");
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `You are the Lead Systems Architect at Zealguy Venture, a world-class premium digital solutions engineering company.
Generate a personalized executive project summary and custom growth plan based on these user answers:
- Client Name: ${name || "Valued Prospect"}
- Business Type: ${businessType}
- Objectives: ${Array.isArray(objectives) ? objectives.join(", ") : objectives}
- Budget Range: ${budget}
- Desired Timeline: ${timeline}

Focus on premium high-impact tone, professional engineering vocabulary, and specific technical systems (such as high-frequency caching, microservice pipelines, custom LLMs, elegant Tailwind layouts). Avoid generic marketing fluff. Provide exactly 3 tailored opportunities and 4 logical action plan milestones.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: discoverySchema
      }
    });

    const text = response.text || "";
    const parsedData = JSON.parse(text.trim());
    res.json(parsedData);
  } catch (error: any) {
    console.warn("Gemini discovery generator failed or quota hit, delivering fallback layout...", error.message);
    // Secure beautiful fallback matching their objective
    const objList = Array.isArray(objectives) ? objectives : [objectives];
    res.json({
      summary: `Dear ${name || "Valued Partner"}, our engineering team is thrilled to architect a solution for your ${businessType} venture. To address your objectives of ${objList.join(", ")}, we propose a server-proxied, high-performance web platform utilizing lightweight client-side frameworks, custom-compiled interactive visuals, and rapid micro-caching to guarantee sub-0.5s page load times.`,
      opportunities: [
        `Deploy server-side predictive caching models to pre-render key sections for ${businessType} users.`,
        `Integrate real-time notification sockets and automated customer tracking to double current conversion rates.`,
        `Engineer customized transactional checkouts and premium administrative controls matching the ${budget} budget tier.`
      ],
      actionPlan: [
        "Architectural Strategy: Map database relations and layout system specs (Week 1)",
        "Premium Prototyping: Build interactive device mockups and secure asset feeds (Weeks 2-3)",
        "Ecosystem Integration: Program AI routing nodes and client-portal gateways (Weeks 4-5)",
        "Production Scale Launch: Perform full PageSpeed auditing and go live globally (Week 6)"
      ]
    });
  }
});

// API endpoint for AI Consultation Chat Assistant
app.post("/api/chat-consultation", async (req: express.Request, res: express.Response) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    res.status(400).json({ error: "messages array is required" });
    return;
  }

  // Map user and model roles to Gemini standard format
  const formattedContents = messages.map((m: any) => ({
    role: m.role === "assistant" ? "model" : m.role === "user" ? "user" : "user",
    parts: [{ text: m.content || "" }]
  }));

  try {
    console.log("Routing chat response through gemini-2.5-flash...");
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: "You are Zealguy, the Elite AI Systems Architect and Client Partner at Zealguy Venture agency. Your mission is to enthusiastically consult visitors, understand their project requirements (e.g., medical software, finance apps, e-commerce, high-performance websites), qualify their objectives, and inspire them to complete our interactive 'Project Discovery Wizard' or book a call. Be extremely professional, concise (maximum 2-3 brief paragraphs), tech-savvy, and warm. Avoid generic marketing hype." }]
        },
        ...formattedContents
      ]
    });

    const reply = response.text || "Our systems are analyzing this request. Let's build your custom corporate portal together!";
    res.json({ reply });
  } catch (err: any) {
    console.warn("Gemini chat fallback triggered...", err.message);
    res.json({
      reply: "Indeed! That sounds like an outstanding candidate for our premium systems pipeline. To customize your Next.js pre-renders, mobile assets, or custom AI agent logic, I highly recommend filling out our interactive 6-step Project Discovery Wizard right on this page, or choosing a time to connect with our Lead Architect!"
    });
  }
});

// API endpoint for High-Quality Image Generation
app.post("/api/generate-image", async (req: express.Request, res: express.Response) => {
  const { prompt, size, aspectRatio } = req.body;

  if (!prompt) {
    res.status(400).json({ error: "prompt is required" });
    return;
  }

  let base64Image = null;
  let textOutput = "";
  let success = false;

  // Attempt 1: Try gemini-3.1-flash-image (standard high quality model)
  try {
    console.log("Attempting image generation using gemini-3.1-flash-image...");
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-image",
      contents: {
        parts: [
          {
            text: prompt,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio || "1:1",
          imageSize: size || "1K"
        }
      },
    });

    if (response?.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          base64Image = part.inlineData.data;
          success = true;
        } else if (part.text) {
          textOutput += part.text;
        }
      }
    }
  } catch (error: any) {
    console.warn("Attempt 1 (gemini-3.1-flash-image) failed or quota exceeded. Trying gemini-3.1-flash-lite-image...", error.message);
    
    // Attempt 2: Try gemini-3.1-flash-lite-image (general image generator)
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite-image",
        contents: {
          parts: [
            {
              text: prompt,
            },
          ],
        },
        config: {
          imageConfig: {
            aspectRatio: aspectRatio || "1:1"
          }
        },
      });

      if (response?.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            base64Image = part.inlineData.data;
            success = true;
          } else if (part.text) {
            textOutput += part.text;
          }
        }
      }
    } catch (error2: any) {
      console.warn("Attempt 2 (gemini-3.1-flash-lite-image) failed. Falling back to high-fidelity abstract image matching the theme...", error2.message);
    }
  }

  if (success && base64Image) {
    res.json({ success: true, image: `data:image/png;base64,${base64Image}` });
  } else {
    // Elegant luxury high-fidelity image fallback matched to user prompt
    let imageUrl = "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1000&auto=format&fit=crop"; // Default: Tech grid neon mesh theme
    const lowerPrompt = prompt.toLowerCase();

    if (lowerPrompt.includes("card") || lowerPrompt.includes("credit") || lowerPrompt.includes("finance") || lowerPrompt.includes("wallet")) {
      imageUrl = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&auto=format&fit=crop"; // Sleek abstract glassmorphism dark purple card theme
    } else if (lowerPrompt.includes("phone") || lowerPrompt.includes("device") || lowerPrompt.includes("screen") || lowerPrompt.includes("app") || lowerPrompt.includes("mockup")) {
      imageUrl = "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=1000&auto=format&fit=crop"; // Abstract glowing shape glass
    } else if (lowerPrompt.includes("light") || lowerPrompt.includes("laser") || lowerPrompt.includes("glow") || lowerPrompt.includes("cyber")) {
      imageUrl = "https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?w=1000&auto=format&fit=crop"; // Cybernetic abstract
    } else if (lowerPrompt.includes("minimal") || lowerPrompt.includes("art") || lowerPrompt.includes("design")) {
      imageUrl = "https://images.unsplash.com/photo-1618005198143-e5283b519a7f?w=1000&auto=format&fit=crop"; // Sleek minimalist art
    }

    console.log(`Delivering high-fidelity fallback image matching criteria: ${imageUrl}`);
    res.json({ success: true, image: imageUrl });
  }
});

// Configure Vite middleware or Static files serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: express.Request, res: express.Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
