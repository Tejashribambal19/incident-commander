import { useEffect, useState } from "react";
import StatCard from "../components/dashboard/StatCard";
import DashboardGrid from "../components/dashboard/DashboardGrid";
import API_URL from "../services/api"; 
function Dashboard() {
    const [incidentList, setIncidentList] = useState([]);
    const [selectedIncident, setSelectedIncident] = useState(null);
    const [loading, setLoading] = useState(true);
    const [monitoring, setMonitoring] = useState(false);

    const [lastChecked, setLastChecked] = useState(null);
    const [anomalyCount, setAnomalyCount] = useState(0);
    const [manualMonitoring, setManualMonitoring] = useState(false);

    // ============================================================
    // INITIAL INCIDENT LOAD
    // ============================================================

    useEffect(() => {
        const fetchIncidents = async () => {
            try {
                const response = await fetch(
                    `${API_URL}/api/incidents`
                );

                if (!response.ok) {
                    throw new Error(
                        "Failed to load incidents"
                    );
                }

                const data = await response.json();

                setIncidentList(data);

                if (data.length > 0) {
                    setSelectedIncident(data[0]);
                }
            } catch (error) {
                console.error(
                    "Failed to load dashboard incidents:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        fetchIncidents();
    }, []);

    // ============================================================
    // HANDLE INCIDENT SELECTED FROM TOP NAVBAR SEARCH
    // ============================================================

    useEffect(() => {
        const handleSearchSelection = (event) => {
            const incident = event.detail;

            if (!incident?._id) {
                return;
            }

            console.log(
                "Incident selected from navbar search:",
                incident
            );

            setSelectedIncident(incident);

            // Scroll to the incident list
            setTimeout(() => {
                const incidentSection =
                    document.getElementById(
                        "incident-list-section"
                    );

                if (incidentSection) {
                    incidentSection.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                    });
                }
            }, 100);
        };

        window.addEventListener(
            "incident-selected-from-search",
            handleSearchSelection
        );

        return () => {
            window.removeEventListener(
                "incident-selected-from-search",
                handleSearchSelection
            );
        };
    }, []);

    // ============================================================
    // AUTOMATIC TELEMETRY MONITORING
    // ============================================================

    useEffect(() => {
        let isRunning = true;
        let monitoringInProgress = false;

        const runMonitoring = async () => {
            if (!isRunning) {
                return;
            }

            // Prevent overlapping monitoring requests
            if (monitoringInProgress) {
                console.log(
                    "Monitoring already in progress. Skipping cycle."
                );
                return;
            }

            monitoringInProgress = true;

            try {
                setMonitoring(true);

                console.log(
                    "Starting automatic telemetry monitoring..."
                );

                // ------------------------------------------------
                // STEP 1: Run backend monitoring
                // ------------------------------------------------

                const monitorResponse = await fetch(
                     `${API_URL}/api/telemetry/monitor`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (!monitorResponse.ok) {
                    throw new Error(
                        "Telemetry monitoring failed"
                    );
                }

                const monitorData =
                    await monitorResponse.json();

                console.log(
                    "Telemetry monitoring result:",
                    monitorData
                );

                setAnomalyCount(
                    monitorData.anomalyCount || 0
                );

                setLastChecked(new Date());

                // ------------------------------------------------
                // STEP 2: Fetch updated incidents
                // ------------------------------------------------

                const response = await fetch(
                    `${API_URL}/api/incidents`
                );

                if (!response.ok) {
                    throw new Error(
                        "Failed to refresh incidents"
                    );
                }

                const data = await response.json();

                if (!isRunning) {
                    return;
                }

                // ------------------------------------------------
                // STEP 3: Update incident list
                // ------------------------------------------------

                setIncidentList(data);

                // ------------------------------------------------
                // STEP 4: Keep selected incident synchronized
                // ------------------------------------------------

                setSelectedIncident((current) => {
                    if (!current) {
                        return data.length > 0
                            ? data[0]
                            : null;
                    }

                    const updatedIncident = data.find(
                        (incident) =>
                            incident._id === current._id
                    );

                    return updatedIncident || current;
                });

            } catch (error) {
                console.error(
                    "Automatic monitoring failed:",
                    error
                );
            } finally {
                monitoringInProgress = false;

                if (isRunning) {
                    setMonitoring(false);
                }
            }
        };

        // Run immediately
        runMonitoring();

        // Continue every 10 seconds
        const interval = setInterval(
            runMonitoring,
            10000
        );

        return () => {
            isRunning = false;
            clearInterval(interval);
        };
    }, []);

    // ============================================================
    // MANUAL MONITORING
    // ============================================================

    const handleRunMonitoring = async () => {
        if (manualMonitoring || monitoring) {
            return;
        }

        try {
            setManualMonitoring(true);
            setMonitoring(true);

            const response = await fetch(
                `${API_URL}/api/telemetry/monitor`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) {
                throw new Error(
                    "Monitoring failed"
                );
            }

            const result = await response.json();

            setAnomalyCount(
                result.anomalyCount || 0
            );

            setLastChecked(new Date());

            // Refresh incidents
            const incidentsResponse = await fetch(
                `${API_URL}/api/incidents`
            );

            if (!incidentsResponse.ok) {
                throw new Error(
                    "Failed to refresh incidents"
                );
            }

            const data =
                await incidentsResponse.json();

            setIncidentList(data);

            setSelectedIncident((current) => {
                if (!current) {
                    return data.length > 0
                        ? data[0]
                        : null;
                }

                const updatedIncident = data.find(
                    (incident) =>
                        incident._id === current._id
                );

                return updatedIncident || current;
            });

        } catch (error) {
            console.error(
                "Manual monitoring failed:",
                error
            );
        } finally {
            setManualMonitoring(false);
            setMonitoring(false);
        }
    };

    // ============================================================
    // HANDLE REMEDIATION RESULT
    // ============================================================

    const handleApproveFix = (updatedIncident) => {
        if (!updatedIncident) {
            return;
        }

        setIncidentList((currentIncidents) =>
            currentIncidents.map((incident) =>
                incident._id === updatedIncident.id
                    ? {
                        ...incident,
                        status:
                            updatedIncident.status,
                        telemetry:
                            updatedIncident.telemetry,
                        deployment:
                            updatedIncident.deployment,
                        description:
                            `Remediation approved and executed: ${updatedIncident.recommendedAction}`,
                    }
                    : incident
            )
        );

        setSelectedIncident((current) =>
            current &&
                current._id === updatedIncident.id
                ? {
                    ...current,
                    status:
                        updatedIncident.status,
                    telemetry:
                        updatedIncident.telemetry,
                    deployment:
                        updatedIncident.deployment,
                    description:
                        `Remediation approved and executed: ${updatedIncident.recommendedAction}`,
                }
                : current
        );
    };

    // ============================================================
    // STATISTICS
    // ============================================================

    const totalIncidents =
        incidentList.length;

    const activeIncidents =
        incidentList.filter(
            (incident) =>
                incident.status === "Active" ||
                incident.status === "Investigating"
        ).length;

    const criticalIncidents =
    incidentList.filter(
        (incident) =>
            String(incident.severity || "")
                .trim()
                .toLowerCase() === "critical"
    ).length;

    const resolvedIncidents =
        incidentList.filter(
            (incident) =>
                incident.status === "Resolved"
        ).length;

    // ============================================================
    // LOADING
    // ============================================================

    if (loading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <p className="text-slate-400">
                    Loading dashboard...
                </p>
            </div>
        );
    }

    // ============================================================
    // DASHBOARD
    // ============================================================

    return (
        <div className="w-full min-w-0 max-w-full overflow-x-hidden">

            {/* ================================================== */}
            {/* HEADER */}
            {/* ================================================== */}

            <div className="mb-8 w-full min-w-0">

                <h1 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
                    Autonomous Incident Commander
                </h1>

                <p className="mt-3 max-w-3xl text-lg text-slate-400">
                    Monitor infrastructure, investigate production
                    incidents, correlate logs and metrics, and receive
                    AI-powered remediation recommendations in real time.
                </p>

                {/* Monitoring Control Panel */}

                <div className="mt-6 w-full min-w-0 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:p-5">

                    <div className="flex min-w-0 flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                        {/* Monitoring Status */}

                        <div className="flex min-w-0 items-center gap-4">

                            <div
                                className={`flex h-10 w-10 items-center justify-center rounded-full ${monitoring
                                        ? "bg-yellow-400/10"
                                        : "bg-green-400/10"
                                    }`}
                            >
                                <span
                                    className={`h-3 w-3 rounded-full ${monitoring
                                            ? "animate-pulse bg-yellow-400"
                                            : "bg-green-400"
                                        }`}
                                />
                            </div>

                            <div>

                                <p className="font-semibold text-white">
                                    {monitoring
                                        ? "Monitoring infrastructure..."
                                        : "Automatic monitoring active"}
                                </p>

                                <p className="mt-1 text-xs text-slate-500">
                                    {lastChecked
                                        ? `Last checked ${lastChecked.toLocaleTimeString()}`
                                        : "Waiting for first telemetry check"}
                                </p>

                            </div>

                        </div>

                        {/* Monitoring Metrics */}

                        <div className="flex min-w-0 flex-wrap items-center gap-4 sm:gap-6">

                            <div>
                                <p className="text-xs uppercase tracking-wide text-slate-500">
                                    Anomalies
                                </p>

                                <p
                                    className={`mt-1 text-xl font-semibold ${anomalyCount > 0
                                            ? "text-red-400"
                                            : "text-green-400"
                                        }`}
                                >
                                    {anomalyCount}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs uppercase tracking-wide text-slate-500">
                                    Monitoring
                                </p>

                                <p className="mt-1 text-xl font-semibold text-cyan-400">
                                    10s
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={
                                    handleRunMonitoring
                                }
                                disabled={
                                    monitoring ||
                                    manualMonitoring
                                }
                                className={`rounded-lg px-5 py-3 font-semibold transition ${monitoring ||
                                        manualMonitoring
                                        ? "cursor-not-allowed bg-slate-800 text-slate-500"
                                        : "bg-cyan-500 text-slate-950 hover:bg-cyan-400"
                                    }`}
                            >
                                {manualMonitoring
                                    ? "Running..."
                                    : "Run Monitoring Now"}
                            </button>

                        </div>

                    </div>

                </div>

            </div>

            {/* ================================================== */}
            {/* STATISTICS */}
            {/* ================================================== */}

            <div className="grid w-full min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

                <StatCard
                    title="Total Incidents"
                    value={totalIncidents}
                    color="text-cyan-400"
                />

                <StatCard
                    title="Active"
                    value={activeIncidents}
                    color="text-yellow-400"
                />

                <StatCard
                    title="Critical"
                    value={criticalIncidents}
                    color="text-red-400"
                />

                <StatCard
                    title="Resolved"
                    value={resolvedIncidents}
                    color="text-green-400"
                />

            </div>

            {/* ================================================== */}
            {/* DASHBOARD GRID */}
            {/* ================================================== */}

            <div className="w-full min-w-0 max-w-full overflow-x-hidden">
                <DashboardGrid
                    selectedIncident={
                        selectedIncident
                    }
                    setSelectedIncident={
                        setSelectedIncident
                    }
                    onApproveFix={
                        handleApproveFix
                    }
                />
            </div>

        </div>
    );
}

export default Dashboard;