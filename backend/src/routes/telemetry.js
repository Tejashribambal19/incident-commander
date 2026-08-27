const express = require("express");
const Incident = require("../models/Incident");
const Event = require("../models/Event");
const aiRouter = require("./ai");

const investigateIncident =
    aiRouter.investigateIncident;

const router = express.Router();


// ============================================================
// CREATE INCIDENT TIMELINE EVENT
// ============================================================

async function createEvent(
    incidentId,
    type,
    message
) {
    try {
        await Event.create({
            incidentId,
            type,
            message,
            timestamp: new Date(),
        });

        console.log(
            `📝 Event recorded: ${type}`
        );
    } catch (error) {
        console.error(
            `Failed to create event ${type}:`,
            error.message
        );
    }
}


// ============================================================
// GET CURRENT TELEMETRY
// ============================================================

router.get("/", async (req, res) => {
    try {
        const incidents =
            await Incident.find(
                {},
                {
                    title: 1,
                    service: 1,
                    severity: 1,
                    status: 1,
                    telemetry: 1,
                    deployment: 1,
                }
            );

        res.json(incidents);

    } catch (error) {
        console.error(
            "Telemetry fetch error:",
            error.message
        );

        res.status(500).json({
            message:
                "Failed to fetch telemetry",
        });
    }
});


// ============================================================
// POST /simulate
// Simulate telemetry changes
// ============================================================

router.post(
    "/simulate",
    async (req, res) => {
        try {
            const incidents =
                await Incident.find();

            const updatedIncidents = [];

            for (const incident of incidents) {

                const telemetry =
                    incident.telemetry || {};

                const cpuChange =
                    Math.floor(
                        Math.random() * 11
                    ) - 5;

                const memoryChange =
                    Math.floor(
                        Math.random() * 7
                    ) - 3;

                const latencyChange =
                    Math.floor(
                        Math.random() * 101
                    ) - 50;

                const errorChange =
                    Math.round(
                        (
                            Math.random() * 2 -
                            1
                        ) * 10
                    ) / 10;

                telemetry.cpu =
                    Math.max(
                        0,
                        Math.min(
                            100,
                            (
                                telemetry.cpu ||
                                0
                            ) + cpuChange
                        )
                    );

                telemetry.memory =
                    Math.max(
                        0,
                        Math.min(
                            100,
                            (
                                telemetry.memory ||
                                0
                            ) + memoryChange
                        )
                    );

                telemetry.latency =
                    Math.max(
                        0,
                        (
                            telemetry.latency ||
                            0
                        ) + latencyChange
                    );

                telemetry.errorRate =
                    Math.max(
                        0,
                        Math.round(
                            (
                                (
                                    telemetry.errorRate ||
                                    0
                                ) +
                                errorChange
                            ) * 10
                        ) / 10
                    );

                if (
                    telemetry.dbConnections !==
                    undefined
                ) {
                    const dbChange =
                        Math.floor(
                            Math.random() * 7
                        ) - 3;

                    telemetry.dbConnections =
                        Math.max(
                            0,
                            Math.min(
                                telemetry.dbConnectionLimit ||
                                    100,
                                telemetry.dbConnections +
                                    dbChange
                            )
                        );
                }

                incident.telemetry =
                    telemetry;

                await incident.save();

                updatedIncidents.push(
                    incident
                );
            }

            res.json({
                message:
                    "Telemetry simulated successfully",
                incidents:
                    updatedIncidents,
            });

        } catch (error) {
            console.error(
                "Telemetry simulation error:",
                error.message
            );

            res.status(500).json({
                message:
                    "Failed to simulate telemetry",
            });
        }
    }
);


// ============================================================
// POST /check
// Check telemetry for anomalies
// ============================================================

router.post(
    "/check",
    async (req, res) => {
        try {
            const incidents =
                await Incident.find();

            const anomalies = [];

            for (
                const incident of incidents
            ) {
                const telemetry =
                    incident.telemetry || {};

                const reasons = [];

                if (
                    telemetry.cpu > 90
                ) {
                    reasons.push(
                        `CPU usage ${telemetry.cpu}% exceeds threshold of 90%`
                    );
                }

                if (
                    telemetry.memory > 90
                ) {
                    reasons.push(
                        `Memory usage ${telemetry.memory}% exceeds threshold of 90%`
                    );
                }

                if (
                    telemetry.latency > 600
                ) {
                    reasons.push(
                        `Latency ${telemetry.latency}ms exceeds threshold of 600ms`
                    );
                }

                if (
                    telemetry.errorRate > 10
                ) {
                    reasons.push(
                        `Error rate ${telemetry.errorRate}% exceeds threshold of 10%`
                    );
                }

                if (
                    telemetry.dbConnectionLimit &&
                    telemetry.dbConnections >
                        telemetry.dbConnectionLimit *
                            0.9
                ) {
                    reasons.push(
                        `Database connections ${telemetry.dbConnections}/${telemetry.dbConnectionLimit} exceed 90% capacity`
                    );
                }

                if (
                    reasons.length === 0
                ) {
                    continue;
                }

                let severity = "Medium";

                if (
                    telemetry.cpu > 95 ||
                    telemetry.memory > 95 ||
                    telemetry.errorRate > 15 ||
                    (
                        telemetry.dbConnectionLimit &&
                        telemetry.dbConnections >=
                            telemetry.dbConnectionLimit *
                                0.95
                    )
                ) {
                    severity = "Critical";

                } else if (
                    telemetry.cpu > 90 ||
                    telemetry.memory > 90 ||
                    telemetry.latency > 600 ||
                    telemetry.errorRate > 10
                ) {
                    severity = "High";
                }

                anomalies.push({
                    incidentId:
                        incident._id,
                    title:
                        incident.title,
                    service:
                        incident.service,
                    severity,
                    reasons,
                    telemetry,
                });
            }

            res.json({
                message:
                    "Telemetry checked successfully",
                anomalyCount:
                    anomalies.length,
                anomalies,
            });

        } catch (error) {
            console.error(
                "Telemetry anomaly check error:",
                error.message
            );

            res.status(500).json({
                message:
                    "Failed to check telemetry",
            });
        }
    }
);


// ============================================================
// POST /process
// Process detected anomalies manually
//
// This route also uses the same investigation protection.
// ============================================================

router.post(
    "/process",
    async (req, res) => {
        try {
            const incidents =
                await Incident.find();

            const processed = [];
            const anomalies = [];

            for (
                const incident of incidents
            ) {
                const telemetry =
                    incident.telemetry || {};

                const reasons = [];

                if (
                    telemetry.cpu > 90
                ) {
                    reasons.push(
                        `CPU usage ${telemetry.cpu}% exceeds threshold of 90%`
                    );
                }

                if (
                    telemetry.memory > 90
                ) {
                    reasons.push(
                        `Memory usage ${telemetry.memory}% exceeds threshold of 90%`
                    );
                }

                if (
                    telemetry.latency > 600
                ) {
                    reasons.push(
                        `Latency ${telemetry.latency}ms exceeds threshold of 600ms`
                    );
                }

                if (
                    telemetry.errorRate > 10
                ) {
                    reasons.push(
                        `Error rate ${telemetry.errorRate}% exceeds threshold of 10%`
                    );
                }

                if (
                    telemetry.dbConnectionLimit &&
                    telemetry.dbConnections >
                        telemetry.dbConnectionLimit *
                            0.9
                ) {
                    reasons.push(
                        `Database connections ${telemetry.dbConnections}/${telemetry.dbConnectionLimit} exceed 90% capacity`
                    );
                }

                if (
                    reasons.length === 0
                ) {
                    continue;
                }

                const previousDetection =
                    await Event.findOne({
                        incidentId:
                            incident._id,
                        type:
                            "INCIDENT_DETECTED",
                    }).sort({
                        timestamp: -1,
                    });

                const wasResolved =
                    incident.status ===
                    "Resolved";

                const newIncident =
                    !previousDetection ||
                    wasResolved;

                if (wasResolved) {
                    incident.status =
                        "Investigating";
                }

                let severity = "Medium";

                if (
                    telemetry.cpu > 95 ||
                    telemetry.memory > 95 ||
                    telemetry.errorRate > 15 ||
                    (
                        telemetry.dbConnectionLimit &&
                        telemetry.dbConnections >=
                            telemetry.dbConnectionLimit *
                                0.95
                    )
                ) {
                    severity = "Critical";

                } else if (
                    telemetry.cpu > 90 ||
                    telemetry.memory > 90 ||
                    telemetry.latency > 600 ||
                    telemetry.errorRate > 10
                ) {
                    severity = "High";
                }

                incident.severity =
                    severity;

                incident.description =
                    `Telemetry anomaly detected: ${reasons.join("; ")}.`;

                await incident.save();

                if (newIncident) {
                    await createEvent(
                        incident._id,
                        "INCIDENT_DETECTED",
                        `Telemetry anomaly detected: ${reasons.join("; ")}.`
                    );
                }

                let aiResult = null;

                const latestAIInvestigation =
                    await Event.findOne({
                        incidentId:
                            incident._id,
                        type:
                            "AI_INVESTIGATION_STARTED",
                    }).sort({
                        timestamp: -1,
                    });

                const needsInvestigation =
                    newIncident ||
                    !latestAIInvestigation;

                if (
                    needsInvestigation
                ) {
                    await createEvent(
                        incident._id,
                        "AI_INVESTIGATION_STARTED",
                        "AI investigation started using current incident telemetry and deployment data."
                    );

                    try {
                        console.log(
                            `🤖 AI investigating ${incident.title}...`
                        );

                        aiResult =
                            await investigateIncident(
                                incident
                            );

                        incident.rootCause =
                            aiResult.rootCause;

                        incident.confidence =
                            aiResult.confidence;

                        incident.recommendedAction =
                            aiResult.recommendedAction;

                        await incident.save();

                        await createEvent(
                            incident._id,
                            "ROOT_CAUSE_IDENTIFIED",
                            `AI identified the likely root cause: ${aiResult.rootCause}`
                        );

                        await createEvent(
                            incident._id,
                            "REMEDIATION_RECOMMENDED",
                            `Recommended remediation: ${aiResult.recommendedAction}`
                        );

                    } catch (
                        aiError
                    ) {
                        console.error(
                            `❌ AI investigation failed for ${incident.title}:`,
                            aiError.message
                        );

                        aiResult = {
                            rootCause:
                                incident.rootCause ||
                                null,
                            confidence:
                                incident.confidence ||
                                0,
                            recommendedAction:
                                incident.recommendedAction ||
                                null,
                            failed: true,
                        };
                    }

                } else {

                    console.log(
                        `⏭️ Skipping AI investigation for ${incident.title} - already investigated for current incident`
                    );

                    aiResult = {
                        rootCause:
                            incident.rootCause,

                        confidence:
                            incident.confidence,

                        recommendedAction:
                            incident.recommendedAction,

                        skipped: true,
                    };
                }

                const result = {
                    incidentId:
                        incident._id,
                    title:
                        incident.title,
                    service:
                        incident.service,
                    severity:
                        incident.severity,
                    status:
                        incident.status,
                    reasons,
                    telemetry:
                        incident.telemetry,
                    aiInvestigation:
                        aiResult,
                };

                anomalies.push(
                    result
                );

                processed.push(
                    result
                );
            }

            res.json({
                message:
                    "Telemetry anomalies processed successfully",
                processedCount:
                    processed.length,
                anomalies,
            });

        } catch (error) {
            console.error(
                "Telemetry processing error:",
                error.message
            );

            res.status(500).json({
                message:
                    "Failed to process telemetry anomalies",
            });
        }
    }
);


// ============================================================
// POST /monitor
// Automatic telemetry monitoring
//
// IMPORTANT:
// AI investigation is tied to the INCIDENT EPISODE,
// not to updatedAt and not to a time cooldown.
//
// Same incident:
//     Detect → AI → Skip future cycles
//
// Resolved + new anomaly:
//     New detection → AI again
// ============================================================

let monitoringRunning = false;

router.post(
    "/monitor",
    async (req, res) => {

        if (monitoringRunning) {
            return res.status(409).json({
                message:
                    "Telemetry monitoring is already running",
            });
        }

        monitoringRunning = true;

        try {

            console.log(
                "🔍 Automatic telemetry monitoring started..."
            );

            // ====================================================
            // STEP 1: UPDATE TELEMETRY
            // ====================================================

            const incidents =
                await Incident.find();

            for (
                const incident of incidents
            ) {

                const telemetry =
                    incident.telemetry || {};

                const cpuChange =
                    Math.floor(
                        Math.random() * 11
                    ) - 5;

                const memoryChange =
                    Math.floor(
                        Math.random() * 7
                    ) - 3;

                const latencyChange =
                    Math.floor(
                        Math.random() * 101
                    ) - 50;

                const errorChange =
                    Math.round(
                        (
                            Math.random() * 2 -
                            1
                        ) * 10
                    ) / 10;

                telemetry.cpu =
                    Math.max(
                        0,
                        Math.min(
                            100,
                            (
                                telemetry.cpu ||
                                0
                            ) +
                                cpuChange
                        )
                    );

                telemetry.memory =
                    Math.max(
                        0,
                        Math.min(
                            100,
                            (
                                telemetry.memory ||
                                0
                            ) +
                                memoryChange
                        )
                    );

                telemetry.latency =
                    Math.max(
                        0,
                        (
                            telemetry.latency ||
                            0
                        ) +
                            latencyChange
                    );

                telemetry.errorRate =
                    Math.max(
                        0,
                        Math.round(
                            (
                                (
                                    telemetry.errorRate ||
                                    0
                                ) +
                                    errorChange
                            ) * 10
                        ) / 10
                    );

                if (
                    telemetry.dbConnections !==
                    undefined
                ) {

                    const dbChange =
                        Math.floor(
                            Math.random() * 7
                        ) - 3;

                    telemetry.dbConnections =
                        Math.max(
                            0,
                            Math.min(
                                telemetry.dbConnectionLimit ||
                                    100,
                                telemetry.dbConnections +
                                    dbChange
                            )
                        );
                }

                incident.telemetry =
                    telemetry;

                await incident.save();
            }

            console.log(
                "📡 Telemetry updated."
            );


            // ====================================================
            // STEP 2: PROCESS ANOMALIES
            // ====================================================

            const updatedIncidents =
                await Incident.find();

            const anomalies = [];

            for (
                const incident of
                updatedIncidents
            ) {

                const telemetry =
                    incident.telemetry || {};

                const reasons = [];


                // ------------------------------------------------
                // THRESHOLDS
                // ------------------------------------------------

                if (
                    telemetry.cpu > 90
                ) {
                    reasons.push(
                        `CPU usage ${telemetry.cpu}% exceeds threshold of 90%`
                    );
                }

                if (
                    telemetry.memory > 90
                ) {
                    reasons.push(
                        `Memory usage ${telemetry.memory}% exceeds threshold of 90%`
                    );
                }

                if (
                    telemetry.latency > 600
                ) {
                    reasons.push(
                        `Latency ${telemetry.latency}ms exceeds threshold of 600ms`
                    );
                }

                if (
                    telemetry.errorRate > 10
                ) {
                    reasons.push(
                        `Error rate ${telemetry.errorRate}% exceeds threshold of 10%`
                    );
                }

                if (
                    telemetry.dbConnectionLimit &&
                    telemetry.dbConnections >
                        telemetry.dbConnectionLimit *
                            0.9
                ) {
                    reasons.push(
                        `Database connections ${telemetry.dbConnections}/${telemetry.dbConnectionLimit} exceed 90% capacity`
                    );
                }


                // ------------------------------------------------
                // NO ANOMALY
                // ------------------------------------------------

                if (
                    reasons.length === 0
                ) {
                    continue;
                }


                // =================================================
                // STEP 3: SEVERITY
                // =================================================

                let severity = "Medium";

                if (
                    telemetry.cpu > 95 ||
                    telemetry.memory > 95 ||
                    telemetry.errorRate > 15 ||
                    (
                        telemetry.dbConnectionLimit &&
                        telemetry.dbConnections >=
                            telemetry.dbConnectionLimit *
                                0.95
                    )
                ) {

                    severity =
                        "Critical";

                } else if (
                    telemetry.cpu > 90 ||
                    telemetry.memory > 90 ||
                    telemetry.latency > 600 ||
                    telemetry.errorRate > 10
                ) {

                    severity =
                        "High";
                }


                // =================================================
                // STEP 4: INCIDENT EPISODE
                // =================================================

                const previousDetection =
                    await Event.findOne({
                        incidentId:
                            incident._id,

                        type:
                            "INCIDENT_DETECTED",

                    }).sort({
                        timestamp: -1,
                    });

                const wasResolved =
                    incident.status ===
                    "Resolved";

                /*
                 * New incident episode:
                 *
                 * 1. No previous detection
                 * OR
                 * 2. Previous incident was resolved
                 */

                const newIncident =
                    !previousDetection ||
                    wasResolved;


                // =================================================
                // STEP 5: REOPEN IF NECESSARY
                // =================================================

                if (
                    wasResolved
                ) {
                    incident.status =
                        "Investigating";
                }

                incident.severity =
                    severity;

                incident.description =
                    `Telemetry anomaly detected: ${reasons.join("; ")}.`;

                await incident.save();


                // =================================================
                // STEP 6: INCIDENT DETECTED EVENT
                // =================================================

                if (
                    newIncident
                ) {

                    await createEvent(
                        incident._id,
                        "INCIDENT_DETECTED",
                        `Telemetry anomaly detected: ${reasons.join("; ")}.`
                    );

                    console.log(
                        `🚨 New incident detected: ${incident.title}`
                    );
                }


                // =================================================
                // STEP 7: AI INVESTIGATION
                // =================================================

                let aiResult =
                    null;

                /*
                 * IMPORTANT:
                 *
                 * There is NO 60-second cooldown anymore.
                 *
                 * AI runs once per incident episode.
                 *
                 * If the same incident remains active,
                 * AI is skipped on every future monitoring cycle.
                 *
                 * If the incident is resolved and later becomes
                 * anomalous again, newIncident becomes true and
                 * AI runs again.
                 */

                const latestAIInvestigation =
                    await Event.findOne({
                        incidentId:
                            incident._id,

                        type:
                            "AI_INVESTIGATION_STARTED",

                    }).sort({
                        timestamp: -1,
                    });


                const needsInvestigation =
                    newIncident ||
                    !latestAIInvestigation;


                // =================================================
                // RUN AI
                // =================================================

                if (
                    needsInvestigation
                ) {

                    await createEvent(
                        incident._id,
                        "AI_INVESTIGATION_STARTED",
                        "AI investigation started using current incident telemetry and deployment data."
                    );

                    try {

                        console.log(
                            `🤖 AI investigating ${incident.title}...`
                        );

                        aiResult =
                            await investigateIncident(
                                incident
                            );


                        // -----------------------------------------
                        // SAVE AI RESULT
                        // -----------------------------------------

                        incident.rootCause =
                            aiResult.rootCause;

                        incident.confidence =
                            aiResult.confidence;

                        incident.recommendedAction =
                            aiResult.recommendedAction;

                        await incident.save();


                        // -----------------------------------------
                        // ROOT CAUSE EVENT
                        // -----------------------------------------

                        await createEvent(
                            incident._id,
                            "ROOT_CAUSE_IDENTIFIED",
                            `AI identified the likely root cause: ${aiResult.rootCause}`
                        );


                        // -----------------------------------------
                        // REMEDIATION RECOMMENDED EVENT
                        // -----------------------------------------

                        await createEvent(
                            incident._id,
                            "REMEDIATION_RECOMMENDED",
                            `Recommended remediation: ${aiResult.recommendedAction}`
                        );


                        console.log(
                            `✅ AI investigation completed for ${incident.title}`
                        );

                    } catch (
                        aiError
                    ) {

                        console.error(
                            `❌ AI investigation failed for ${incident.title}:`,
                            aiError.message
                        );

                        aiResult = {

                            rootCause:
                                incident.rootCause ||
                                null,

                            confidence:
                                incident.confidence ||
                                0,

                            recommendedAction:
                                incident.recommendedAction ||
                                null,

                            failed:
                                true,
                        };
                    }


                } else {

                    // =================================================
                    // SKIP AI
                    // =================================================

                    console.log(
                        `⏭️ Skipping AI investigation for ${incident.title} - already investigated for current incident`
                    );

                    aiResult = {

                        rootCause:
                            incident.rootCause,

                        confidence:
                            incident.confidence,

                        recommendedAction:
                            incident.recommendedAction,

                        skipped:
                            true,
                    };
                }


                // =================================================
                // STEP 8: FINAL ANOMALY RESULT
                // =================================================

                anomalies.push({

                    incidentId:
                        incident._id,

                    title:
                        incident.title,

                    service:
                        incident.service,

                    severity:
                        incident.severity,

                    status:
                        incident.status,

                    reasons,

                    telemetry:
                        incident.telemetry,

                    aiInvestigation:
                        aiResult,
                });
            }


            // ====================================================
            // STEP 9: RESPONSE
            // ====================================================

            console.log(
                `📊 Monitoring completed. ${anomalies.length} anomalies found.`
            );

            return res.json({

                message:
                    "Automatic telemetry monitoring completed",

                anomalyCount:
                    anomalies.length,

                anomalies,
            });

        } catch (
            error
        ) {

            console.error(
                "Automatic telemetry monitoring error:",
                error
            );

            return res.status(
                500
            ).json({

                message:
                    "Automatic telemetry monitoring failed",

                error:
                    error.message,
            });

        } finally {

            monitoringRunning =
                false;
        }
    }
);


// ============================================================
// EXPORT
// ============================================================

module.exports = router;