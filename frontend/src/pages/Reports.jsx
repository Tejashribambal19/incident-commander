import { useEffect, useState } from "react";
import API_URL from "../services/api";

function Reports() {
    const [incidents, setIncidents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_URL}/api/incidents`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch incidents");
                }

                return response.json();
            })
            .then((data) => {
                console.log("Reports received:", data);
                setIncidents(data);
            })
            .catch((error) => {
                console.error("Reports error:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const total = incidents.length;

    const active = incidents.filter(
        (incident) =>
            incident.status === "Active" ||
            incident.status === "Investigating"
    ).length;

    const critical = incidents.filter(
        (incident) => incident.severity === "Critical"
    ).length;

    const resolved = incidents.filter(
        (incident) => incident.status === "Resolved"
    ).length;

    if (loading) {
        return (
            <div>
                <h1 className="text-4xl font-bold">
                    Incident Reports
                </h1>

                <p className="mt-6 text-slate-400">
                    Loading reports...
                </p>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-10">
                <h1 className="text-4xl font-bold">
                    Incident Reports
                </h1>

                <p className="mt-3 text-slate-400">
                    Overview of incidents from MongoDB.
                </p>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 xl:grid-cols-4">

                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                    <p className="text-sm text-slate-400">
                        Total Incidents
                    </p>

                    <p className="mt-3 text-4xl font-bold text-cyan-400">
                        {total}
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                    <p className="text-sm text-slate-400">
                        Active
                    </p>

                    <p className="mt-3 text-4xl font-bold text-yellow-400">
                        {active}
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                    <p className="text-sm text-slate-400">
                        Critical
                    </p>

                    <p className="mt-3 text-4xl font-bold text-red-400">
                        {critical}
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                    <p className="text-sm text-slate-400">
                        Resolved
                    </p>

                    <p className="mt-3 text-4xl font-bold text-green-400">
                        {resolved}
                    </p>
                </div>

            </div>

            {/* Incident History */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

                <h2 className="mb-6 text-xl font-semibold">
                    Incident History
                </h2>

                <div className="space-y-4">

                    {incidents.map((incident) => (
                        <div
                            key={incident._id}
                            className="rounded-xl border border-slate-800 bg-slate-950 p-5"
                        >
                            <div className="flex items-center justify-between">

                                <div>
                                    <h3 className="font-semibold text-white">
                                        {incident.title}
                                    </h3>

                                    <p className="mt-1 text-sm text-slate-400">
                                        {incident.service}
                                    </p>
                                </div>

                                <div className="text-right">

                                    <p className="text-sm text-slate-300">
                                        {incident.status}
                                    </p>

                                    <p className="mt-1 text-xs text-slate-500">
                                        {incident.severity}
                                    </p>

                                </div>

                            </div>
                        </div>
                    ))}

                </div>

            </div>
        </div>
    );
}

export default Reports;