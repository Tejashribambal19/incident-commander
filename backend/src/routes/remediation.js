const express = require("express");
const Incident = require("../models/Incident");
const Event = require("../models/Event");
const router = express.Router();


// ============================================================
// POST /api/remediation/approve
// Execute a simulated remediation for an incident
// ============================================================

router.post("/approve", async (req, res) => {
    try {
        const { incidentId } = req.body;

        if (!incidentId) {
            return res.status(400).json({
                message: "Incident ID is required",
            });
        }

        const incident = await Incident.findById(incidentId);

        if (!incident) {
            return res.status(404).json({
                message: "Incident not found",
            });
        }

        // Only allow remediation for incidents being investigated
        if (
            incident.status !== "Investigating" &&
            incident.status !== "Active"
        ) {
            return res.status(400).json({
                message: `Incident cannot be remediated while status is ${incident.status}`,
            });
        }


        // ========================================================
        // SIMULATED REMEDIATION
        // ========================================================

        const action =
            incident.recommendedAction || "Apply recommended remediation";


        // Payment Service
        if (incident.title === "Payment Service Error Spike") {

            incident.telemetry.cpu = 72;
            incident.telemetry.memory = 65;
            incident.telemetry.latency = 180;
            incident.telemetry.errorRate = 2.1;
            incident.telemetry.dbConnections = 64;

            incident.deployment.version = "v2.3.0";
        }


        // API Gateway
        else if (incident.title === "API Gateway Latency") {

            incident.telemetry.cpu = 48;
            incident.telemetry.memory = 58;
            incident.telemetry.latency = 190;
            incident.telemetry.errorRate = 2.4;
            incident.telemetry.dbConnections = 54;
        }


        // Inventory Database
        else if (incident.title === "Inventory Database CPU") {

            incident.telemetry.cpu = 62;
            incident.telemetry.memory = 68;
            incident.telemetry.latency = 210;
            incident.telemetry.errorRate = 1.8;
            incident.telemetry.dbConnections = 61;
        }


        // Notification Service
        else if (incident.title === "Notification Queue Delay") {

            incident.telemetry.cpu = 48;
            incident.telemetry.memory = 55;
            incident.telemetry.latency = 150;
            incident.telemetry.errorRate = 1.5;
            incident.telemetry.dbConnections = 45;
        }


        // Generic remediation
        else {

            incident.telemetry.cpu = Math.min(
                incident.telemetry.cpu || 50,
                70
            );

            incident.telemetry.memory = Math.min(
                incident.telemetry.memory || 50,
                70
            );

            incident.telemetry.latency = Math.min(
                incident.telemetry.latency || 200,
                250
            );

            incident.telemetry.errorRate = Math.min(
                incident.telemetry.errorRate || 2,
                5
            );

            incident.telemetry.dbConnections = Math.min(
                incident.telemetry.dbConnections || 50,
                70
            );
        }


        // ========================================================
        // MARK INCIDENT RESOLVED
        // ========================================================

        incident.status = "Resolved";

incident.description =
    `Remediation approved and executed: ${action}`;

await incident.save();


// ============================================================
// RECORD INCIDENT TIMELINE EVENTS
// ============================================================

await Event.create([
    {
        incidentId: incident._id,
        type: "REMEDIATION_APPROVED",
        message: "Operator approved the recommended remediation.",
    },

    {
        incidentId: incident._id,
        type: "REMEDIATION_EXECUTED",
        message: `Remediation executed: ${action}`,
    },

    {
        incidentId: incident._id,
        type: "TELEMETRY_RECOVERED",
        message:
            `Telemetry recovered. CPU ${incident.telemetry.cpu}%, latency ${incident.telemetry.latency}ms, error rate ${incident.telemetry.errorRate}%.`,
    },

    {
        incidentId: incident._id,
        type: "INCIDENT_RESOLVED",
        message: "Incident resolved after successful remediation.",
    },
]);


        res.json({
            message: "Remediation executed successfully",

            incident: {
                id: incident._id,
                title: incident.title,
                status: incident.status,
                telemetry: incident.telemetry,
                deployment: incident.deployment,
                recommendedAction: incident.recommendedAction,
            },
        });

    } catch (error) {

        console.error(
            "Remediation error:",
            error.message
        );

        res.status(500).json({
            message: "Failed to execute remediation",
        });
    }
});


module.exports = router;