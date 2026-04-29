import { GoogleGenAI, Type } from "@google/genai";

export interface AuditResult {
  platform: string;
  status: 'Found' | 'Not Found' | 'Optimization Needed';
  score: number; // 0-100
  details: string;
  url?: string;
  recommendations: string[];
}

export interface AuditReport {
  doctorName: string;
  specialty: string;
  clinicName: string;
  contactInfo: {
    phone: string;
    email: string;
    address: string;
    hours: string;
  };
  overallScore: number;
  technicalAudit: AuditResult[];
  marketingAudit: AuditResult[];
  summary: string;
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function performDigitalAudit(doctorName: string, specialty: string, phone: string): Promise<AuditReport> {
  const prompt = `Perform a dual-perspective digital audit for a medical professional in Aswan City, Egypt.
  Doctor Name: ${doctorName}
  Specialty: ${specialty}
  Reference Phone: ${phone || 'Not specified'}
  
  Requirements:
  1. Generate TWO sets of audit results:
     - Technical Audit: Focus on data accuracy, SEO gaps (Google Maps/Search), and technical vulnerabilities.
     - Marketing Audit: Focus on visual identity gaps, social media engagement, and professional brand image.
  
  2. ANALYTICAL FOCUS (Arabic):
     - Identify Pain Points (نقاط الألم): Focus on where the doctor is losing patients or credibility.
     - Identify Weaknesses (نقاط الضعف): Be direct about missing or low-quality digital assets.
     - Strategic Solutions (أهم الأساليب): Provide actionable steps for:
       * Visual Identity (الهوية البصرية)
       * Search Engine Optimization (تحسين البحث)
       * Social Media Management (التواصل الاجتماعي)

  3. ALL text fields (summary, details, recommendations) MUST be in ARABIC with a professional, authoritative tone.
  
  Provide exactly this JSON structure:
  {
    "doctorName": "string",
    "specialty": "string",
    "clinicName": "string",
    "contactInfo": { "phone": "string", "email": "string", "address": "string", "hours": "string" },
    "overallScore": number,
    "summary": "Arabic Text highlighting the most critical pain points",
    "technicalAudit": [{ "platform": "string", "status": "Found|Not Found|Optimization Needed", "score": number, "details": "Arabic focus on vulnerabilities", "recommendations": ["Arabic solutions for SEO/Tech"] }],
    "marketingAudit": [{ "platform": "string", "status": "Found|Not Found|Optimization Needed", "score": number, "details": "Arabic focus on brand/visual identity gaps", "recommendations": ["Arabic solutions for Visual Identity/Social"] }]
  }`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          doctorName: { type: Type.STRING },
          specialty: { type: Type.STRING },
          clinicName: { type: Type.STRING },
          contactInfo: {
            type: Type.OBJECT,
            properties: {
              phone: { type: Type.STRING },
              email: { type: Type.STRING },
              address: { type: Type.STRING },
              hours: { type: Type.STRING }
            },
            required: ["phone", "email", "address", "hours"]
          },
          overallScore: { type: Type.NUMBER },
          summary: { type: Type.STRING },
          technicalAudit: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                platform: { type: Type.STRING },
                status: { type: Type.STRING, enum: ["Found", "Not Found", "Optimization Needed"] },
                score: { type: Type.NUMBER },
                details: { type: Type.STRING },
                url: { type: Type.STRING },
                recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["platform", "status", "score", "details", "recommendations"]
            }
          },
          marketingAudit: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                platform: { type: Type.STRING },
                status: { type: Type.STRING, enum: ["Found", "Not Found", "Optimization Needed"] },
                score: { type: Type.NUMBER },
                details: { type: Type.STRING },
                url: { type: Type.STRING },
                recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["platform", "status", "score", "details", "recommendations"]
            }
          }
        },
        required: ["doctorName", "specialty", "clinicName", "contactInfo", "overallScore", "summary", "technicalAudit", "marketingAudit"]
      }
    }
  });

  try {
    const report: AuditReport = JSON.parse(response.text);
    return report;
  } catch (error) {
    console.error("Failed to parse audit report:", error);
    throw new Error("Failed to generate digital audit report. Please try again.");
  }
}

export async function saveAuditToSheet(report: AuditReport, htmlContent?: string): Promise<{ success: boolean; message: string }> {
  // Use VITE_SHEETS_WEBHOOK_URL from environment or fallback to simulation
  const WEBHOOK_URL = (import.meta as any).env.VITE_SHEETS_WEBHOOK_URL || '/api/save-to-sheets';
  
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...report, htmlContent }),
    });
    return await response.json();
  } catch (error) {
    return { success: false, message: "Network error or API unavailable" };
  }
}
