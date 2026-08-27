import { useEffect, useState } from "react";
import axios from "axios";
import IncidentItem from "./IncidentItem";
import API_URL from "../../services/api";

function IncidentList({
    selectedIncident,
    setSelectedIncident,
}) {
    const [incidents, setIncidents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ============================================================
    // FETCH INCIDENTS
    // ============================================================

    const fetchIncidents = async () => {
        try {
            const response = await axios.get(
                `${API_URL}/api/incidents`,
                {
                    headers: {
                        Accept: "application/json",
            },
        }
    );

    const data = Array.isArray(
        response.data
    )
        ? response.data
        : [];

    setIncidents(data);

    // Keep selected incident synchronized
    setSelectedIncident((current) => {
        if (!current) {
            return data.length > 0
                ? data[0]
                : null;
        }

        const updatedIncident =
            data.find(
                (incident) =>
                    incident._id ===
                    current._id
            );

        return (
            updatedIncident ||
            current
        );
    });

} catch (err) {
    console.error(
        "Failed to fetch incidents:",
        err
    );

    setError(
        err.response?.data?.message ||
        err.message ||
        "Unable to load incidents"
    );
} finally {
    setLoading(false);
}
    };

// ============================================================
// INITIAL LOAD
// ============================================================

useEffect(() => {
    fetchIncidents();
}, []);

// ============================================================
// COUNTS
// ============================================================

const activeCount =
    incidents.filter(
        (incident) =>
            incident.status === "Active" ||
            incident.status ===
            "Investigating"
    ).length;

const criticalCount =
    incidents.filter(
        (incident) =>
            incident.severity ===
            "Critical"
    ).length;

const resolvedCount =
    incidents.filter(
        (incident) =>
            incident.status ===
            "Resolved"
    ).length;

// ============================================================
// LOADING
// ============================================================

if (loading) {
    return (
        <div className="min-h-[430px] rounded-2xl border border-slate-800 bg-slate-900 p-6">

            <div className="flex items-center justify-between">

                <div>

                    <h2 className="text-xl font-semibold text-white">
                        Incidents
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Production incident overview
                    </p>

                </div>

            </div>

            <div className="mt-8 flex items-center justify-center">

                <p className="text-sm text-slate-500">
                    Loading incidents...
                </p>

            </div>

        </div>
    );
}

// ============================================================
// ERROR
// ============================================================

if (error) {
    return (
        <div className="min-h-[430px] rounded-2xl border border-slate-800 bg-slate-900 p-6">

            <h2 className="text-xl font-semibold text-white">
                Incidents
            </h2>

            <div className="mt-8 rounded-xl border border-red-500/20 bg-red-500/5 p-5">

                <p className="text-sm font-medium text-red-400">
                    Unable to load incidents
                </p>

                <p className="mt-2 text-sm text-slate-500">
                    {error}
                </p>

                <button
                    type="button"
                    onClick={() => {
                        setLoading(true);
                        fetchIncidents();
                    }}
                    className="mt-4 rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
                >
                    Retry
                </button>

            </div>

        </div>
    );
}

// ============================================================
// EMPTY STATE
// ============================================================

if (incidents.length === 0) {
    return (
        <div
            id="incident-list-section"
            className="min-h-[430px] rounded-2xl border border-slate-800 bg-slate-900 p-6"
        >

            <div className="flex items-center justify-between">

                <div>

                    <h2 className="text-xl font-semibold text-white">
                        Incidents
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Production incident overview
                    </p>

                </div>

                <span className="rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-400">
                    All Clear
                </span>

            </div>

            <div className="mt-16 text-center">

                <div className="text-4xl">
                    ✓
                </div>

                <p className="mt-4 font-semibold text-white">
                    No incidents detected
                </p>

                <p className="mt-2 text-sm text-slate-500">
                    The monitored infrastructure is
                    currently healthy.
                </p>

            </div>

        </div>
    );
}

// ============================================================
// MAIN INCIDENT LIST
// ============================================================

return (
    <div
        id="incident-list-section"
        className="min-h-[430px] rounded-2xl border border-slate-800 bg-slate-900 p-6"
    >

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div className="flex items-start justify-between gap-4">

            <div>

                <h2 className="text-xl font-semibold text-white">
                    Active Incidents
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                    Production incident overview
                </p>

            </div>

            <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-400">
                {activeCount} Active
            </span>

        </div>

        {/* ================================================= */}
        {/* SUMMARY */}
        {/* ================================================= */}

        <div className="mt-5 grid grid-cols-3 gap-3">

            <div className="rounded-xl bg-slate-950 p-3">

                <p className="text-xs text-slate-500">
                    Total
                </p>

                <p className="mt-1 text-lg font-semibold text-cyan-400">
                    {incidents.length}
                </p>

            </div>

            <div className="rounded-xl bg-slate-950 p-3">

                <p className="text-xs text-slate-500">
                    Critical
                </p>

                <p className="mt-1 text-lg font-semibold text-red-400">
                    {criticalCount}
                </p>

            </div>

            <div className="rounded-xl bg-slate-950 p-3">

                <p className="text-xs text-slate-500">
                    Resolved
                </p>

                <p className="mt-1 text-lg font-semibold text-green-400">
                    {resolvedCount}
                </p>

            </div>

        </div>

        {/* ================================================= */}
        {/* INCIDENT CARDS */}
        {/* ================================================= */}

        <div className="mt-5 space-y-3">

            {incidents.map(
                (incident) => (
                    <IncidentItem
                        key={incident._id}
                        incident={incident}
                        selected={
                            selectedIncident?._id ===
                            incident._id
                        }
                        onClick={() =>
                            setSelectedIncident(
                                incident
                            )
                        }
                    />
                )
            )}

        </div>

    </div>
);
}

export default IncidentList;