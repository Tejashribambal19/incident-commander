import { useEffect, useState } from "react";
import API_URL from "../../services/api";

function AIInvestigationPanel({ incident, onApproveFix }) {
    const [approving, setApproving] = useState(false);
    const [approved, setApproved] = useState(false);
    const [error, setError] = useState("");

    /*
     * Reset local approval state when the user
     * selects a different incident.
     */
    useEffect(() => {
        setApproving(false);
        setApproved(false);
        setError("");
    }, [incident?._id]);

    if (!incident) {
        return (
            <div className="min-h-[430px] rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <h2 className="text-xl font-semibold text-white">
                    AI Investigation
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                    AI-powered incident analysis
                </p>

                <div className="mt-16 text-center text-slate-500">
                    Select an incident to view AI analysis.
                </div>
            </div>
        );
    }

    const confidence = Math.min(
        Math.max(Number(incident.confidence || 0), 0),
        100
    );

    const isResolved = incident.status === "Resolved";

    const hasInvestigation =
        Boolean(incident.rootCause) &&
        Boolean(incident.recommendedAction);

    const canApprove =
        hasInvestigation &&
        !isResolved &&
        !approving &&
        !approved;

    const handleApproveFix = async () => {
        if (!canApprove || !incident?._id) {
            return;
        }

        try {
            setApproving(true);
            setError("");

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

            const data = await response
                .json()
                .catch(() => ({}));

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to approve remediation"
                );
            }

            console.log(
                "Remediation executed successfully:",
                data
            );

            /*
             * Lock the button immediately so the same
             * remediation cannot be submitted twice.
             */
            setApproved(true);

            /*
             * Update Dashboard state.
             */
            if (onApproveFix && data.incident) {
                onApproveFix(data.incident);
            }

        } catch (error) {
            console.error(
                "Remediation approval failed:",
                error
            );

            setError(
                error.message ||
                "Unable to execute remediation"
            );

            setApproved(false);

        } finally {
            setApproving(false);
        }
    };

    return (
        <div className="min-h-[430px] rounded-2xl border border-slate-800 bg-slate-900 p-6">

            {/* ================================================= */}
            {/* HEADER */}
            {/* ================================================= */}

            <div className="flex items-start justify-between gap-4">

                <div>
                    <h2 className="text-xl font-semibold text-white">
                        AI Investigation
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        AI-powered incident analysis
                    </p>
                </div>

                <span
                    className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                        isResolved
                            ? "border-green-500/20 bg-green-500/10 text-green-400"
                            : hasInvestigation
                            ? "border-cyan-500/20 bg-cyan-500/10 text-cyan-400"
                            : "border-yellow-500/20 bg-yellow-500/10 text-yellow-400"
                    }`}
                >
                    {isResolved
                        ? "Resolved"
                        : hasInvestigation
                        ? "Analysis Ready"
                        : "Analyzing"}
                </span>

            </div>

            {/* ================================================= */}
            {/* INCIDENT */}
            {/* ================================================= */}

            <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950 p-4">

                <p className="text-xs uppercase tracking-wide text-slate-500">
                    Incident
                </p>

                <p className="mt-1 font-semibold text-white">
                    {incident.title}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                    {incident.service}
                </p>

                <div className="mt-3 flex items-center gap-2">

                    <span className="text-xs text-slate-600">
                        Status
                    </span>

                    <span
                        className={`text-xs font-semibold ${
                            isResolved
                                ? "text-green-400"
                                : incident.status ===
                                  "Investigating"
                                ? "text-cyan-400"
                                : "text-yellow-400"
                        }`}
                    >
                        ● {incident.status}
                    </span>

                </div>

            </div>

            {/* ================================================= */}
            {/* ROOT CAUSE */}
            {/* ================================================= */}

            <div className="mt-5">

                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Root Cause
                </p>

                <div className="mt-2 rounded-xl border border-slate-800 bg-slate-950 p-4">

                    {incident.rootCause ? (
                        <p className="text-sm leading-6 text-slate-300">
                            {incident.rootCause}
                        </p>
                    ) : (
                        <div className="flex items-center gap-2">

                            <span className="h-2 w-2 animate-pulse rounded-full bg-yellow-400" />

                            <p className="text-sm text-slate-500">
                                AI investigation in progress...
                            </p>

                        </div>
                    )}

                </div>

            </div>

            {/* ================================================= */}
            {/* CONFIDENCE */}
            {/* ================================================= */}

            <div className="mt-5">

                <div className="flex items-center justify-between">

                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        AI Confidence
                    </p>

                    <p className="text-sm font-semibold text-cyan-400">
                        {confidence}%
                    </p>

                </div>

                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">

                    <div
                        className="h-full rounded-full bg-cyan-400 transition-all duration-500"
                        style={{
                            width: `${confidence}%`,
                        }}
                    />

                </div>

            </div>

            {/* ================================================= */}
            {/* RECOMMENDED ACTION */}
            {/* ================================================= */}

            <div className="mt-5">

                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Recommended Action
                </p>

                <div className="mt-2 rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4">

                    {incident.recommendedAction ? (
                        <p className="text-sm leading-6 text-slate-300">
                            {incident.recommendedAction}
                        </p>
                    ) : (
                        <p className="text-sm text-slate-600">
                            Waiting for AI recommendation.
                        </p>
                    )}

                </div>

            </div>

            {/* ================================================= */}
            {/* ERROR */}
            {/* ================================================= */}

            {error && (
                <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/5 p-3">

                    <p className="text-xs font-semibold text-red-400">
                        Remediation Failed
                    </p>

                    <p className="mt-1 text-sm text-slate-400">
                        {error}
                    </p>

                </div>
            )}

            {/* ================================================= */}
            {/* REMEDIATION ACTION */}
            {/* ================================================= */}

            <div className="mt-6">

                {isResolved ? (

                    <div className="rounded-xl border border-green-500/20 bg-green-500/10 p-4">

                        <div className="flex items-center justify-center gap-2">

                            <span className="text-green-400">
                                ✓
                            </span>

                            <span className="text-sm font-semibold text-green-400">
                                Incident Resolved
                            </span>

                        </div>

                        <p className="mt-2 text-center text-xs text-slate-500">
                            Remediation completed successfully.
                        </p>

                    </div>

                ) : approved ? (

                    <div className="rounded-xl border border-green-500/20 bg-green-500/10 p-4">

                        <div className="flex items-center justify-center gap-2">

                            <span className="text-green-400">
                                ✓
                            </span>

                            <span className="text-sm font-semibold text-green-400">
                                Remediation Executed
                            </span>

                        </div>

                        <p className="mt-2 text-center text-xs text-slate-500">
                            The remediation request was successfully
                            submitted.
                        </p>

                    </div>

                ) : (

                    <button
                        type="button"
                        onClick={handleApproveFix}
                        disabled={!canApprove}
                        className={`w-full rounded-xl px-4 py-3 font-semibold transition ${
                            canApprove
                                ? "bg-cyan-500 text-slate-950 hover:bg-cyan-400"
                                : "cursor-not-allowed bg-slate-800 text-slate-500"
                        }`}
                    >
                        {approving
                            ? "Executing Remediation..."
                            : hasInvestigation
                            ? "Approve & Execute Fix"
                            : "Waiting for AI Analysis"}
                    </button>

                )}

            </div>

            {/* ================================================= */}
            {/* SAFETY MESSAGE */}
            {/* ================================================= */}

            {!isResolved && !approved && (
                <p className="mt-3 text-center text-xs text-slate-600">
                    Remediation requires operator approval.
                </p>
            )}

        </div>
    );
}

export default AIInvestigationPanel;