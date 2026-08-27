import { useEffect, useState } from "react";
import API_URL from "../../services/api";

function TimelinePanel({ incident }) {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const eventOrder = {
        INCIDENT_DETECTED: 1,
        AI_INVESTIGATION_STARTED: 2,
        ROOT_CAUSE_IDENTIFIED: 3,
        REMEDIATION_RECOMMENDED: 4,
        REMEDIATION_APPROVED: 5,
        REMEDIATION_EXECUTED: 6,
        TELEMETRY_RECOVERED: 7,
        INCIDENT_RESOLVED: 8,
    };

    const getEventStyle = (type) => {
        switch (type) {
            case "INCIDENT_DETECTED":
                return {
                    icon: "⚠",
                    color: "text-red-400",
                    border: "border-red-500/30",
                    background: "bg-red-500/5",
                };

            case "AI_INVESTIGATION_STARTED":
                return {
                    icon: "✦",
                    color: "text-cyan-400",
                    border: "border-cyan-500/30",
                    background: "bg-cyan-500/5",
                };

            case "ROOT_CAUSE_IDENTIFIED":
                return {
                    icon: "⌕",
                    color: "text-purple-400",
                    border: "border-purple-500/30",
                    background: "bg-purple-500/5",
                };

            case "REMEDIATION_RECOMMENDED":
                return {
                    icon: "→",
                    color: "text-yellow-400",
                    border: "border-yellow-500/30",
                    background: "bg-yellow-500/5",
                };

            case "REMEDIATION_APPROVED":
                return {
                    icon: "✓",
                    color: "text-cyan-400",
                    border: "border-cyan-500/30",
                    background: "bg-cyan-500/5",
                };

            case "REMEDIATION_EXECUTED":
                return {
                    icon: "⚙",
                    color: "text-yellow-400",
                    border: "border-yellow-500/30",
                    background: "bg-yellow-500/5",
                };

            case "TELEMETRY_RECOVERED":
                return {
                    icon: "↓",
                    color: "text-green-400",
                    border: "border-green-500/30",
                    background: "bg-green-500/5",
                };

            case "INCIDENT_RESOLVED":
                return {
                    icon: "✓",
                    color: "text-green-400",
                    border: "border-green-500/30",
                    background: "bg-green-500/5",
                };

            default:
                return {
                    icon: "•",
                    color: "text-slate-400",
                    border: "border-slate-700",
                    background: "bg-slate-950",
                };
        }
    };

    const formatTime = (timestamp) => {
        if (!timestamp) {
            return "--:--";
        }

        const date = new Date(timestamp);

        if (Number.isNaN(date.getTime())) {
            return "--:--";
        }

        return date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
    };

    const fetchEvents = async (showLoading = true) => {
        if (!incident?._id) {
            setEvents([]);
            return;
        }

        try {
            if (showLoading) {
                setLoading(true);
            }

            setError("");

            const response = await fetch(
                `${API_URL}/api/events/${incident._id}`
            );

            if (!response.ok) {
                throw new Error("Failed to fetch timeline events");
            }

            const data = await response.json();

            const eventList = Array.isArray(data)
                ? data
                : Array.isArray(data.value)
                    ? data.value
                    : [];

            /*
             * Remove duplicate events.
             */
            const uniqueEvents = Array.from(
                new Map(
                    eventList.map((event) => [
                        event._id ||
                        `${event.type}-${event.timestamp}`,
                        event,
                    ])
                ).values()
            );

            /*
             * Sort by actual operational sequence.
             * If two events have the same type/order,
             * use timestamp as the fallback.
             */
            const sortedEvents = [...uniqueEvents].sort(
                (a, b) => {
                    const orderA =
                        eventOrder[a.type] ?? 99;

                    const orderB =
                        eventOrder[b.type] ?? 99;

                    if (orderA !== orderB) {
                        return orderA - orderB;
                    }

                    return (
                        new Date(a.timestamp) -
                        new Date(b.timestamp)
                    );
                }
            );

            setEvents(sortedEvents);

        } catch (error) {
            console.error(
                "Failed to load incident timeline:",
                error
            );

            setError(
                error.message ||
                "Unable to load timeline"
            );
        } finally {
            setLoading(false);
        }
    };

    /*
     * Fetch when selected incident changes.
     */
    useEffect(() => {
        fetchEvents(true);
    }, [incident?._id]);

    /*
     * Automatically refresh the timeline every 5 seconds.
     *
     * This allows events such as:
     *
     * AI_INVESTIGATION_STARTED
     * ROOT_CAUSE_IDENTIFIED
     * REMEDIATION_RECOMMENDED
     *
     * to appear without manually refreshing the page.
     */
    useEffect(() => {
        if (!incident?._id) {
            return;
        }

        const interval = setInterval(() => {
            fetchEvents(false);
        }, 5000);

        return () => {
            clearInterval(interval);
        };
    }, [incident?._id]);

    return (
        <div className="min-h-[430px] rounded-2xl border border-slate-800 bg-slate-900 p-6">

            {/* HEADER */}

            <div className="flex items-start justify-between">

                <div>
                    <h2 className="text-xl font-semibold text-white">
                        Incident Timeline
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Investigation and remediation events
                    </p>
                </div>

                {incident && (
                    <button
                        type="button"
                        onClick={() => fetchEvents(true)}
                        className="rounded-lg border border-slate-800 px-3 py-1.5 text-xs text-slate-400 transition hover:border-slate-700 hover:text-white"
                    >
                        Refresh
                    </button>
                )}

            </div>

            {/* NO INCIDENT */}

            {!incident && (
                <div className="mt-16 text-center">

                    <div className="text-3xl text-slate-700">
                        ◷
                    </div>

                    <p className="mt-3 text-sm text-slate-500">
                        Select an incident to view its timeline.
                    </p>

                </div>
            )}

            {/* LOADING */}

            {incident && loading && (
                <div className="mt-10 text-center">

                    <p className="text-sm text-slate-500">
                        Loading timeline...
                    </p>

                </div>
            )}

            {/* ERROR */}

            {incident && !loading && error && (
                <div className="mt-8 rounded-xl border border-red-500/20 bg-red-500/5 p-4">

                    <p className="text-sm font-medium text-red-400">
                        Unable to load timeline
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={() => fetchEvents(true)}
                        className="mt-3 rounded-lg bg-cyan-500 px-3 py-1.5 text-xs font-semibold text-slate-950 hover:bg-cyan-400"
                    >
                        Retry
                    </button>

                </div>
            )}

            {/* EMPTY */}

            {incident &&
                !loading &&
                !error &&
                events.length === 0 && (
                    <div className="mt-16 text-center">

                        <div className="text-3xl text-slate-700">
                            ◷
                        </div>

                        <p className="mt-3 text-sm text-slate-500">
                            No timeline events recorded yet.
                        </p>

                    </div>
                )}

            {/* TIMELINE */}

            {incident &&
                !loading &&
                !error &&
                events.length > 0 && (
                    <div className="mt-7 max-h-[330px] overflow-y-auto pr-2">

                        <div className="space-y-0">

                            {events.map((event, index) => {

                                const style =
                                    getEventStyle(
                                        event.type
                                    );

                                const isLatest =
                                    index ===
                                    events.length - 1;

                                const eventTitle =
                                    event.type
                                        ?.replaceAll(
                                            "_",
                                            " "
                                        )
                                        ?.toUpperCase();

                                return (
                                    <div
                                        key={
                                            event._id ||
                                            index
                                        }
                                        className="flex gap-4"
                                    >

                                        {/* MARKER */}

                                        <div className="flex w-9 shrink-0 flex-col items-center">

                                            <div
                                                className={`relative z-10 flex h-9 w-9 items-center justify-center rounded-full border ${style.border} ${style.background} ${style.color} ${isLatest
                                                    ? "ring-2 ring-cyan-500/10"
                                                    : ""
                                                    }`}
                                            >
                                                {style.icon}
                                            </div>

                                            {index <
                                                events.length -
                                                1 && (
                                                    <div className="w-px flex-1 bg-slate-800" />
                                                )}

                                        </div>

                                        {/* CONTENT */}

                                        <div
                                            className={`mb-4 flex-1 rounded-xl border p-3 ${isLatest
                                                ? "border-slate-700 bg-slate-950"
                                                : "border-slate-800/60 bg-slate-950/40"
                                                }`}
                                        >

                                            <div className="flex items-start justify-between gap-4">

                                                <div>

                                                    <div className="flex items-center gap-2">

                                                        <p
                                                            className={`text-xs font-bold tracking-wide ${style.color}`}
                                                        >
                                                            {
                                                                eventTitle
                                                            }
                                                        </p>

                                                        {isLatest && (
                                                            <span className="rounded-full bg-cyan-500/10 px-2 py-0.5 text-[10px] font-semibold text-cyan-400">
                                                                LATEST
                                                            </span>
                                                        )}

                                                    </div>

                                                    <p className="mt-1 text-sm leading-5 text-slate-400">
                                                        {
                                                            event.message
                                                        }
                                                    </p>

                                                </div>

                                                <span className="shrink-0 text-[10px] text-slate-600">
                                                    {formatTime(
                                                        event.timestamp
                                                    )}
                                                </span>

                                            </div>

                                        </div>

                                    </div>
                                );
                            })}

                        </div>

                    </div>
                )}

        </div>
    );
}

export default TimelinePanel;