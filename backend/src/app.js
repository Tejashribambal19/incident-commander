const express = require("express");
const cors = require("cors");
const aiRoutes = require("./routes/ai");
const incidentRoutes = require("./routes/incidents");
const telemetryRoutes = require("./routes/telemetry");
const remediationRoutes = require("./routes/remediation");
const eventsRoutes = require("./routes/events");

const app = express();

app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "https://incident-commander-frontend.onrender.com",
        ],
    })
);

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Incident Commander Backend is running",
    });
});

app.use("/api/incidents", incidentRoutes);
app.use("/api/telemetry", telemetryRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/remediation", remediationRoutes);
app.use("/api/events", eventsRoutes);

module.exports = app;