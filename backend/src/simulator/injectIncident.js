const Incident = require("../models/Incident");

const injectIncident = async (type = "payment") => {
    const faultProfiles = {
        payment: {
            title: "Payment Service Error Spike",
            telemetry: {
                cpu: 78,
                memory: 72,
                latency: 850,
                errorRate: 18,
                dbConnections: 96,
                dbConnectionLimit: 100,
            },
        },

        gateway: {
            title: "API Gateway Latency",
            telemetry: {
                cpu: 65,
                memory: 60,
                latency: 850,
                errorRate: 12,
                dbConnections: 20,
                dbConnectionLimit: 100,
            },
        },

        inventory: {
            title: "Inventory Database CPU",
            telemetry: {
                cpu: 97,
                memory: 82,
                latency: 180,
                errorRate: 4,
                dbConnections: 96,
                dbConnectionLimit: 100,
            },
        },

        notification: {
            title: "Notification Queue Delay",
            telemetry: {
                cpu: 65,
                memory: 70,
                latency: 750,
                errorRate: 11,
                dbConnections: 30,
                dbConnectionLimit: 100,
            },
        },
    };

    const profile =
        faultProfiles[type];

    if (!profile) {
        throw new Error(
            `Unknown fault type: ${type}. Use payment, gateway, inventory, or notification.`
        );
    }

    const incident =
        await Incident.findOne({
            title: profile.title,
        });

    if (!incident) {
        throw new Error(
            `Incident not found: ${profile.title}`
        );
    }

    incident.telemetry =
        profile.telemetry;

    incident.status =
        "Investigating";

    await incident.save();

    return incident;
};

module.exports = injectIncident;