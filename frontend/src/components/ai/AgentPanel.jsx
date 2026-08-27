import { useEffect, useState } from "react";
import API_URL from "../../services/api";
function AgentPanel({ incident, onApproveFix }) {
    const [investigation, setInvestigation] = useState(null);
    const [loading, setLoading] = useState(false);
    const [remediating, setRemediating] = useState(false);
    const [error, setError] = useState("");
    const [approved, setApproved] = useState(false);

    useEffect(() => {
        setInvestigation(null);
        setError("");
        setApproved(false);

        if (!incident) {
            return;
        }
        if (incident.status === "Resolved") {
            setInvestigation({
                rootCause: incident.rootCause || "Root cause recorded during investigation.",
                confidence: incident.confidence || 0,
                recommendedAction:
                    incident.recommendedAction || "Remediation has already been executed.",
            });

            setLoading(false);
            return;
        }
        const investigate = async () => {
            setLoading(true);

            try {
                const response = await fetch(
                    `${API_URL}/api/ai/investigate`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            incident,
                        }),
                    }
                );

                if (!response.ok) {
                    throw new Error("AI investigation failed");
                }

                const data = await response.json();

                console.log("AI investigation:", data);

                setInvestigation(data);
            } catch (error) {
                console.error("AI investigation error:", error);
                setError("Unable to complete AI investigation");
            } finally {
                setLoading(false);
            }
        };

        investigate();
    }, [incident]);

    const handleApproveFix = async () => {
        if (!incident || remediating) {
            return;
        }

        setRemediating(true);
        setError("");

        try {
            const response = await fetch(
                `${API_URL}/api/remediation/approve`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        incidentId: incident._id,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to execute remediation"
                );
            }

            console.log("Remediation result:", data);

            setApproved(true);

            // Tell Dashboard that the incident has changed.
            if (onApproveFix) {
                onApproveFix(data.incident);
            }
        } catch (error) {
            console.error("Remediation error:", error);

            setError(
                error.message || "Unable to execute remediation"
            );
        } finally {
            setRemediating(false);
        }
    };

    if (!incident) {
        return (
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 min-h-[430px]">
                <h2 className="text-xl font-semibold text-white">
                    AI Investigation
                </h2>

                <p className="mt-8 text-center text-slate-500">
                    Select an incident to begin investigation.
                </p>
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 min-h-[430px]">

            <h2 className="text-xl font-semibold text-white">
                AI Investigation
            </h2>

            <div className="mt-6 space-y-6">

                {/* Incident */}
                <div>
                    <p className="text-sm text-slate-500">
                        INVESTIGATING INCIDENT
                    </p>

                    <p className="mt-1 font-semibold text-white">
                        {incident.title}
                    </p>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-4">
                        <p className="text-cyan-400">
                            AI is investigating this incident...
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                            Analyzing telemetry and deployment data
                            with local AI.
                        </p>
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4">
                        <p className="text-red-400">
                            {error}
                        </p>
                    </div>
                )}

                {/* AI Result */}
                {investigation && !loading && (
                    <>
                        {/* Root Cause */}
                        <div>
                            <p className="text-sm text-slate-500">
                                ROOT CAUSE
                            </p>

                            <p className="mt-2 text-slate-300">
                                {investigation.rootCause}
                            </p>
                        </div>

                        {/* Confidence */}
                        <div>
                            <div className="flex justify-between">
                                <p className="text-sm text-slate-500">
                                    CONFIDENCE
                                </p>

                                <p className="font-semibold text-cyan-400">
                                    {investigation.confidence}%
                                </p>
                            </div>

                            <div className="mt-2 h-2 rounded-full bg-slate-800">
                                <div
                                    className="h-2 rounded-full bg-cyan-400"
                                    style={{
                                        width: `${investigation.confidence}%`,
                                    }}
                                />
                            </div>
                        </div>

                        {/* Recommended Action */}
                        <div>
                            <p className="text-sm text-slate-500">
                                RECOMMENDED ACTION
                            </p>

                            <p className="mt-2 font-semibold text-yellow-400">
                                {investigation.recommendedAction}
                            </p>
                        </div>

                        {/* Remediation */}
                        {/* Remediation */}
                        {incident.status === "Resolved" ? (
                            <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-4 text-center">
                                <p className="font-semibold text-green-400">
                                    ✓ Incident Resolved
                                </p>

                                <p className="mt-1 text-sm text-slate-500">
                                    Remediation has already been executed successfully.
                                </p>
                            </div>
                        ) : !approved ? (
                            <button
                                onClick={handleApproveFix}
                                disabled={remediating}
                                className="w-full rounded-lg bg-cyan-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {remediating
                                    ? "Executing Fix..."
                                    : "Approve Fix"}
                            </button>
                        ) : (
                            <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-3 text-center text-green-400">
                                ✓ Fix approved and executed
                            </div>
                        )}
                    </>
                )}

            </div>
        </div>
    );
}

export default AgentPanel;