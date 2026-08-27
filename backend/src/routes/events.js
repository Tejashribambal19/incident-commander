const express = require("express");
const Event = require("../models/Event");

const router = express.Router();


// GET events for an incident
router.get("/:incidentId", async (req, res) => {
    try {
        const events = await Event.find({
            incidentId: req.params.incidentId,
        }).sort({
            timestamp: 1,
        });

        res.json(events);

    } catch (error) {
        console.error("Event fetch error:", error.message);

        res.status(500).json({
            message: "Failed to fetch incident events",
        });
    }
});

module.exports = router;