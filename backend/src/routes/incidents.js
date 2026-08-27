const express = require("express");
const Incident = require("../models/Incident");

const router = express.Router();

// GET all incidents
router.get("/", async (req, res) => {
try {
const incidents = await Incident.find().sort({ createdAt: -1 });


    res.json(incidents);
} catch (error) {
    console.error("Error fetching incidents:", error.message);

    res.status(500).json({
        message: "Failed to fetch incidents",
    });
}


});

// GET one incident
router.get("/:id", async (req, res) => {
try {
const incident = await Incident.findById(req.params.id);


    if (!incident) {
        return res.status(404).json({
            message: "Incident not found",
        });
    }

    res.json(incident);
} catch (error) {
    console.error("Error fetching incident:", error.message);

    res.status(500).json({
        message: "Failed to fetch incident",
    });
}


});

// PATCH incident
router.patch("/:id", async (req, res) => {
try {
const incident = await Incident.findByIdAndUpdate(
req.params.id,
req.body,
{
new: true,
runValidators: true,
}
);


    if (!incident) {
        return res.status(404).json({
            message: "Incident not found",
        });
    }

    res.json(incident);
} catch (error) {
    console.error("Error updating incident:", error.message);

    res.status(500).json({
        message: "Failed to update incident",
    });
}


});

module.exports = router;
