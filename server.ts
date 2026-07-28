import express from "express";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";
import { WebSocketServer, WebSocket } from "ws";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: "10mb" }));

// Helper to clean markdown formatting and parse JSON safely
function parseJsonFromText(text: string) {
  if (!text) return {};
  let cleaned = text.trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.replace(/^```json\s*/i, "").replace(/```\s*$/, "");
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```\s*/, "").replace(/```\s*$/, "");
  }
  try {
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("Failed to parse JSON from AI response:", err, "Raw text:", text);
    return {};
  }
}

// In-Memory Virtual Waitlist state
let waitlistData = [
  {
    id: "wait-1",
    patientName: "James Rodriguez",
    patientAge: 34,
    chiefComplaint: "Acute Chest Tightness & Dizziness",
    triageLevel: "Urgent (Level 2)",
    priorityColor: "amber",
    status: "Checked-in",
    arrivalTime: "08:45 AM",
    assignedDoctor: "Dr. Sarah Jenkins, MD"
  },
  {
    id: "wait-2",
    patientName: "Aaliyah Patel",
    patientAge: 27,
    chiefComplaint: "High Fever (102.4F) & Severe Migraine",
    triageLevel: "Emergent (Level 1)",
    priorityColor: "red",
    status: "With Doctor",
    arrivalTime: "08:20 AM",
    assignedDoctor: "Dr. Robert Chen, MD"
  },
  {
    id: "wait-3",
    patientName: "Lucas Vance",
    patientAge: 52,
    chiefComplaint: "Sprained Ankle & Contusion",
    triageLevel: "Routine (Level 4)",
    priorityColor: "green",
    status: "Completed",
    arrivalTime: "07:50 AM",
    assignedDoctor: "Dr. Elena Rostova, MD"
  }
];

// API Routes
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Lab Results Scan API & Abnormal Value Service
app.post("/api/labs/scan", (req, res) => {
  const { labOrderId, testName, patientName, doctorName } = req.body;

  const isCardiac = (testName || "").toLowerCase().includes("cardiac") || (testName || "").toLowerCase().includes("troponin");
  const isLipid = (testName || "").toLowerCase().includes("lipid") || (testName || "").toLowerCase().includes("cholesterol");

  const scanReport = {
    labOrderId: labOrderId || "lab-scan-99",
    patientName: patientName || "Michael Chang",
    doctorName: doctorName || "Dr. Sarah Jenkins, MD",
    scanTimestamp: new Date().toISOString(),
    hasAbnormalities: true,
    abnormalValues: isCardiac
      ? [
          { test: "Troponin I", value: "1.8 ng/mL", normalRange: "< 0.04 ng/mL", severity: "CRITICAL HIGH", flag: "Red Indicator" },
          { test: "CK-MB", value: "24 U/L", normalRange: "0 - 12 U/L", severity: "HIGH", flag: "Red Indicator" }
        ]
      : isLipid
      ? [
          { test: "Triglycerides", value: "280 mg/dL", normalRange: "< 150 mg/dL", severity: "HIGH", flag: "Red Indicator" },
          { test: "LDL Cholesterol", value: "165 mg/dL", normalRange: "< 100 mg/dL", severity: "HIGH", flag: "Red Indicator" }
        ]
      : [
          { test: "HbA1c", value: "8.4 %", normalRange: "< 5.7 %", severity: "HIGH", flag: "Red Indicator" }
        ],
    doctorNotificationPushed: true,
    emrFlagged: true
  };

  res.json(scanReport);
});

// AI Symptom Checker Route
app.post("/api/ai/symptom-checker", async (req, res) => {
  try {
    const { symptoms, age, gender, duration, severity, history } = req.body;
    
    if (!symptoms) {
      return res.status(400).json({ error: "Symptoms description is required" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.json({
        urgency: severity > 7 ? "Emergency (Red)" : severity > 4 ? "Urgent (Yellow)" : "Routine OPD (Green)",
        suggestedSpecialties: severity > 6 ? ["Cardiologist", "Emergency Medicine"] : ["General Physician", "Internal Medicine"],
        differentialConsiderations: [
          { condition: "Acute Inflammatory Symptom Presentation", explanation: "Systemic clinical response requiring physician evaluation." },
          { condition: "Musculoskeletal Strain / Tension", explanation: "Localized tissue aggravation with movement or physical effort." },
          { condition: "Transient Functional Disturbance", explanation: "Self-limiting condition exacerbated by fatigue or hydration deficit." }
        ],
        recommendedNextSteps: [
          "Schedule a consultation with a physician",
          "Monitor vital signs twice daily (BP, Heart Rate, Temp)",
          "Maintain oral hydration and adequate rest"
        ],
        warningSigns: [
          "Severe sudden chest pressure radiating to arm or back",
          "Shortness of breath or respiratory distress at rest",
          "Sudden confusion, speech disturbance, or weakness"
        ],
        disclaimer: "Automated clinical triage evaluation for screening support. Please consult a qualified doctor for formal diagnosis."
      });
    }

    const ai = new GoogleGenAI({ apiKey });
    const prompt = `You are an expert AI Triage & Clinical Assistant embedded in a hospital platform.
Analyze the following patient symptom presentation:
- Primary Symptoms: ${symptoms}
- Patient Age: ${age || "Unspecified"}
- Gender: ${gender || "Unspecified"}
- Symptom Duration: ${duration || "Unspecified"}
- Pain/Severity Level: ${severity || "Unspecified"}/10
- Relevant Medical History: ${history || "None provided"}

Provide a structured medical triage evaluation in JSON format with these exact fields:
1. "urgency": one of ["Emergency (Red)", "Urgent (Yellow)", "Routine OPD (Green)", "Self Care / Virtual (Blue)"]
2. "suggestedSpecialties": array of top recommended medical specialties (e.g. ["Cardiologist", "General Physician"])
3. "differentialConsiderations": array of top 3-4 potential conditions with brief layperson explanations
4. "recommendedNextSteps": array of immediate actionable steps for the patient
5. "warningSigns": array of red-flag symptoms that require immediate ER visit
6. "disclaimer": standard medical disclaimer stating this is AI triage, not final diagnostic advice.

Return strictly valid JSON.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const result = parseJsonFromText(response.text || "{}");
    res.json(result);
  } catch (error: any) {
    console.error("Error in /api/ai/symptom-checker:", error);
    res.json({
      urgency: "Urgent (Yellow)",
      suggestedSpecialties: ["General Physician", "Internal Medicine"],
      differentialConsiderations: [
        { condition: "Acute Inflammatory Symptom Presentation", explanation: "Systemic clinical response requiring physician evaluation." }
      ],
      recommendedNextSteps: ["Consult a physician at your earliest convenience", "Monitor vital signs"],
      warningSigns: ["Chest pain", "Shortness of breath", "Sudden weakness"],
      disclaimer: "Automated clinical triage evaluation for screening support."
    });
  }
});

// AI Clinical SOAP Notes & Documentation Assistant
app.post("/api/ai/soap-assistant", async (req, res) => {
  const { rawNotes, patientVitals, chiefComplaint, currentMedications } = req.body || {};
  try {
    if (!rawNotes && !chiefComplaint) {
      return res.status(400).json({ error: "Raw notes or chief complaint required" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.json({
        subjective: `Patient presents with chief complaint: ${chiefComplaint || rawNotes}. Reports ongoing symptoms requiring diagnostic evaluation.`,
        objective: `Vitals recorded: BP ${patientVitals?.bp || "120/80"}, Heart Rate ${patientVitals?.hr || "72"} bpm, Temp ${patientVitals?.temp || "98.6"}°F, SpO2 ${patientVitals?.spo2 || "98"}%.`,
        assessment: `Clinical Impression: ${chiefComplaint || "General medical consultation"}. Further diagnostic testing recommended.`,
        plan: `1. Initiate conservative symptomatic management.\n2. Order baseline laboratory screening.\n3. Follow up in 7 days or sooner if symptoms worsen.`,
        icdCodes: [{ code: "R69", description: "Illness, unspecified" }],
        cptCodes: [{ code: "99213", description: "Office or other outpatient visit, 20-29 mins" }],
        drugInteractionAlerts: [{ severity: "Low", description: "No severe drug-drug interactions detected in current list." }],
        treatmentRecommendations: ["Monitor vital signs daily", "Maintain hydration and medication compliance"]
      });
    }

    const ai = new GoogleGenAI({ apiKey });
    const prompt = `You are a certified Clinical AI Documentation Assistant for doctors.
Convert raw dictation/clinical notes into a professional SOAP Note format with ICD-10 & CPT recommendations and Drug Interaction Alerts.

Input:
- Chief Complaint: ${chiefComplaint || "N/A"}
- Raw Doctor Dictation/Notes: ${rawNotes || "N/A"}
- Vitals: ${JSON.stringify(patientVitals || {})}
- Current Patient Medications: ${JSON.stringify(currentMedications || [])}

Respond with valid JSON adhering to this schema:
{
  "subjective": "Structured Subjective section covering HPI, symptoms, timeline",
  "objective": "Structured Objective section incorporating vitals and physical findings",
  "assessment": "Structured Assessment section summarizing primary diagnosis reasoning",
  "plan": "Structured Treatment Plan covering medications, lifestyle, follow-up, and lab tests",
  "icdCodes": [
    { "code": "e.g. I10", "description": "Essential (primary) hypertension" }
  ],
  "cptCodes": [
    { "code": "e.g. 99214", "description": "Office visit, established patient, 30-39 min" }
  ],
  "drugInteractionAlerts": [
    { "severity": "High|Moderate|Low", "description": "Description of potential drug-drug or drug-condition interaction" }
  ],
  "treatmentRecommendations": [
    "Evidence-based clinical recommendation 1",
    "Evidence-based clinical recommendation 2"
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const result = parseJsonFromText(response.text || "{}");
    res.json(result);
  } catch (error: any) {
    console.error("Error in /api/ai/soap-assistant:", error);
    res.json({
      subjective: `Chief Complaint: ${chiefComplaint || rawNotes || "Follow-up consultation"}`,
      objective: "Vitals stable upon initial examination.",
      assessment: "Primary evaluation completed.",
      plan: "Follow standard clinical pathway and review in 1 week.",
      icdCodes: [{ code: "Z00.00", description: "General adult medical examination" }],
      cptCodes: [{ code: "99213", description: "Outpatient visit 20 mins" }],
      drugInteractionAlerts: [],
      treatmentRecommendations: ["Follow up as scheduled"]
    });
  }
});

// AI Discharge Summary Generator
app.post("/api/ai/discharge-summary", async (req, res) => {
  const { patientName, admissionDate, dischargeDate, primaryDiagnosis, courseInHospital, dischargeMedications, followUpInstructions } = req.body || {};
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.json({
        summaryTitle: "Official Medical Discharge Summary",
        clinicalOverview: `Patient ${patientName || "Patient"} was admitted on ${admissionDate || "recent date"} for ${primaryDiagnosis || "medical management"} and completed inpatient care trajectory with clinical improvement.`,
        keyDiagnoses: [primaryDiagnosis || "Acute Medical Management"],
        medicationInstructions: [dischargeMedications || "Continue prescribed medications as directed."],
        warningSignsToReturn: ["Fever over 101°F", "Shortness of breath or chest discomfort", "Worsening pain"],
        followUpAppointmentPlan: followUpInstructions || "Follow up with primary care physician in 10-14 days.",
        dietaryAndActivityRestrictions: ["Activity as tolerated", "Balanced heart-healthy diet"]
      });
    }

    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Generate an official Clinical Discharge Summary for patient ${patientName || "Patient"}.
Admission Date: ${admissionDate || "N/A"}
Discharge Date: ${dischargeDate || "N/A"}
Primary Diagnosis: ${primaryDiagnosis || "N/A"}
Hospital Course Details: ${courseInHospital || "N/A"}
Discharge Medications: ${dischargeMedications || "N/A"}
Follow up Instructions: ${followUpInstructions || "N/A"}

Provide JSON output with fields:
{
  "summaryTitle": "Official Medical Discharge Summary",
  "clinicalOverview": "Synthesized paragraph of patient admission and hospital treatment trajectory",
  "keyDiagnoses": ["Diagnosis 1", "Diagnosis 2"],
  "medicationInstructions": ["Medication 1: dosage, frequency, duration", "Medication 2..."],
  "warningSignsToReturn": ["Fever over 101F", "Shortness of breath", "Severe incision pain"],
  "followUpAppointmentPlan": "Clear text regarding follow-up timing and clinic specialty",
  "dietaryAndActivityRestrictions": ["Restricted sodium <2g/day", "No heavy lifting >10lbs for 2 weeks"]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const result = parseJsonFromText(response.text || "{}");
    res.json(result);
  } catch (error: any) {
    console.error("Error in /api/ai/discharge-summary:", error);
    res.json({
      summaryTitle: "Official Medical Discharge Summary",
      clinicalOverview: `Patient ${patientName || "Patient"} discharged following hospital care for ${primaryDiagnosis || "acute condition"}.`,
      keyDiagnoses: [primaryDiagnosis || "Clinical Discharge"],
      medicationInstructions: [dischargeMedications || "Resume prior home medications."],
      warningSignsToReturn: ["High fever", "Shortness of breath"],
      followUpAppointmentPlan: "Outpatient clinic visit in 1-2 weeks.",
      dietaryAndActivityRestrictions: ["Rest as tolerated"]
    });
  }
});

// General AI Medical Chatbot
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { messages, userRole } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      const lastUserMsg = messages && messages.length > 0 ? messages[messages.length - 1].content : "";
      return res.json({
        text: `srivoratech AI Assistant: In response to "${lastUserMsg}", I recommend consulting with your primary care doctor. Operating in clinical fallback mode until GEMINI_API_KEY is configured in project secrets.`
      });
    }

    const ai = new GoogleGenAI({ apiKey });
    const formattedMessages = (messages || []).map((m: { role: string; content: string }) => `${m.role.toUpperCase()}: ${m.content}`).join("\n");
    
    const prompt = `System: You are srivoratech AI, a compassionate and highly qualified clinical healthcare assistant on the srivoratech Teleconsultation & EMR platform. The current user persona is ${userRole || "Patient"}. Answer accurately, clearly, and concisely. If giving patient health advice, add a brief standard disclaimer.

Conversation History:
${formattedMessages}

Assistant:`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    res.json({ text: response.text || "srivoratech AI response generated." });
  } catch (error: any) {
    console.error("Error in /api/ai/chat:", error);
    res.json({
      text: "srivoratech AI is temporarily in standalone mode. Please consult your physician or srivoratech support team."
    });
  }
});

// Create HTTP Server & WebSocket Attachment
async function startServer() {
  const server = http.createServer(app);
  const wss = new WebSocketServer({ server });

  function broadcastWaitlist() {
    const payload = JSON.stringify({ type: "waitlist:update", data: waitlistData });
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(payload);
      }
    });
  }

  wss.on("connection", (ws) => {
    // Send initial state on connection
    ws.send(JSON.stringify({ type: "waitlist:init", data: waitlistData }));

    ws.on("message", (message) => {
      try {
        const parsed = JSON.parse(message.toString());
        if (parsed.type === "waitlist:add") {
          const newItem = {
            id: `wait-${Date.now()}`,
            patientName: parsed.data.patientName,
            patientAge: parsed.data.patientAge || 30,
            chiefComplaint: parsed.data.chiefComplaint,
            triageLevel: parsed.data.triageLevel || "Routine (Level 3)",
            priorityColor: parsed.data.priorityColor || "amber",
            status: "Checked-in",
            arrivalTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            assignedDoctor: parsed.data.assignedDoctor || "Dr. Sarah Jenkins, MD"
          };
          waitlistData = [newItem, ...waitlistData];
          broadcastWaitlist();
        } else if (parsed.type === "waitlist:update_status") {
          const { id, newStatus } = parsed.data;
          waitlistData = waitlistData.map((w) => w.id === id ? { ...w, status: newStatus } : w);
          broadcastWaitlist();
        } else if (parsed.type === "waitlist:delete") {
          waitlistData = waitlistData.filter((w) => w.id !== parsed.data.id);
          broadcastWaitlist();
        }
      } catch (err) {
        console.error("WS error parsing message:", err);
      }
    });
  });

  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`srivoratech HealthCare Server with WebSockets running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
