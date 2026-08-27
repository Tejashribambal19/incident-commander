const mongoose = require("mongoose");

const incidentSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },

        service: {
            type: String,
            required: true,
        },

        severity: {
            type: String,
            enum: ["Critical", "High", "Medium", "Low"],
            required: true,
        },

        status: {
            type: String,
            enum: ["Investigating", "Active", "Resolved"],
            default: "Active",
        },

        description: {
            type: String,
            default: "",
        },

        rootCause: {
            type: String,
            default: "",
        },

        confidence: {
            type: Number,
            default: 0,
        },

        recommendedAction: {
            type: String,
            default: "",
        },

        // Operational telemetry used by the AI investigation
        telemetry: {
            cpu: {
                type: Number,
                default: 0,
            },

            memory: {
                type: Number,
                default: 0,
            },

            latency: {
                type: Number,
                default: 0,
            },

            errorRate: {
                type: Number,
                default: 0,
            },

            dbConnections: {
                type: Number,
                default: 0,
            },

            dbConnectionLimit: {
                type: Number,
                default: 100,
            },
        },

        // Recent deployment associated with the incident
        deployment: {
            version: {
                type: String,
                default: "",
            },

            timestamp: {
                type: Date,
                default: null,
            },
        },

        timestamp: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Incident", incidentSchema);