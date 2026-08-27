const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
    {
        incidentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Incident",
            required: true,
        },

        type: {
            type: String,
            required: true,
        },

        message: {
            type: String,
            required: true,
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

module.exports = mongoose.model("Event", eventSchema);