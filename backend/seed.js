require("dotenv").config();

const mongoose = require("mongoose");
const Incident = require("./src/models/Incident");

const incidents = [
    {
        title: "Payment Service Error Spike",
        service: "Payment Service",
        severity: "Critical",
        status: "Investigating",
        description: "Payment service is experiencing a sudden increase in errors.",
        rootCause:
            "Payment Service v2.3.1 introduced a database connection failure.",
        confidence: 94,
        recommendedAction: "Rollback deployment v2.3.1",
    },

    {
        title: "API Gateway Latency",
        service: "API Gateway",
        severity: "High",
        status: "Active",
        description: "API Gateway response latency has increased significantly.",
        rootCause:
            "Increased upstream response time is causing API Gateway latency.",
        confidence: 89,
        recommendedAction: "Investigate upstream service performance",
    },

    {
        title: "Inventory Database CPU",
        service: "Inventory Database",
        severity: "High",
        status: "Active",
        description: "Inventory database CPU usage is unusually high.",
        rootCause:
            "Inventory database CPU usage increased due to a heavy query workload.",
        confidence: 91,
        recommendedAction: "Optimize high-cost database queries",
    },

    {
        title: "Notification Queue Delay",
        service: "Notification Service",
        severity: "Medium",
        status: "Active",
        description: "Notification messages are experiencing processing delays.",
        rootCause:
            "Notification workers are processing messages slower than the incoming queue rate.",
        confidence: 87,
        recommendedAction: "Scale notification workers",
    },
];

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        console.log("✅ MongoDB connected");

        await Incident.deleteMany();

        await Incident.insertMany(incidents);

        console.log("✅ 4 incidents inserted successfully");

        await mongoose.connection.close();

        console.log("✅ Database connection closed");
    } catch (error) {
        console.error("❌ Seed failed:", error.message);
        process.exit(1);
    }
};

seedDatabase();