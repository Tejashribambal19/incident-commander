const express = require("express");

const router = express.Router();

const OLLAMA_URL = "http://localhost:11434/api/generate";
const MODEL = "llama3.2:3b";


// ============================================================
// AI INVESTIGATION FUNCTION
// ============================================================

async function investigateIncident(incident) {
    const telemetry = incident.telemetry || {};
    const deployment = incident.deployment || {};

    const prompt = `
You are an AI Incident Commander analyzing a production incident.

INCIDENT
Title: ${incident.title}
Service: ${incident.service}
Severity: ${incident.severity}
Status: ${incident.status}
Description: ${incident.description}

TELEMETRY
CPU Usage: ${telemetry.cpu ?? 0}%
Memory Usage: ${telemetry.memory ?? 0}%
Latency: ${telemetry.latency ?? 0} ms
Error Rate: ${telemetry.errorRate ?? 0}%
Database Connections: ${telemetry.dbConnections ?? 0}/${telemetry.dbConnectionLimit ?? 100}

DEPLOYMENT
Version: ${deployment.version || "Unknown"}

Analyze the evidence above.

Pay particular attention to:

- unusually high CPU or memory
- high latency
- elevated error rate
- database connection saturation
- recent deployments that could have caused the incident

Return ONLY valid JSON.

Do not use markdown.
Do not use code fences.
Do not add explanations outside the JSON.

Use exactly this format:

{
  "rootCause": "specific likely root cause based on the evidence",
  "confidence": 0,
  "recommendedAction": "specific practical remediation action"
}

Rules:

- confidence must be a number from 0 to 100.
- Base the root cause on the telemetry and deployment information.
- Do not invent metrics that were not provided.
- Keep rootCause concise.
- recommendedAction must directly address the suspected root cause.
`;

    const response = await fetch(OLLAMA_URL, {
        method: "POST",

        headers: {
            "Content-Type": "application/json",
        },

        body: JSON.stringify({
            model: MODEL,
            prompt,
            stream: false,
            format: "json",
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();

        console.error(
            "Ollama request failed:",
            response.status,
            errorText
        );

        throw new Error("Ollama AI request failed");
    }

    const data = await response.json();

    const result = JSON.parse(data.response);

    return {
        rootCause: result.rootCause,
        confidence: Number(result.confidence),
        recommendedAction: result.recommendedAction,
    };
}


// ============================================================
// POST /api/ai/investigate
// Manual AI investigation
// ============================================================

router.post("/investigate", async (req, res) => {
    try {
        const { incident } = req.body;

        if (!incident) {
            return res.status(400).json({
                message: "Incident data is required",
            });
        }

        const result = await investigateIncident(incident);

        res.json(result);

    } catch (error) {
        console.error("AI investigation error:", error);

        res.status(500).json({
            message: "AI investigation failed",
        });
    }
});

router.investigateIncident = investigateIncident;

module.exports = router;