import { useEffect, useState } from "react";
import {
    Bell,
    Search,
    Circle,
    X,
} from "lucide-react";
import API_URL from "../../services/api";
function TopNavbar() {
    const [searchQuery, setSearchQuery] = useState("");
    const [incidents, setIncidents] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [showResults, setShowResults] = useState(false);

    // ============================================================
    // NOTIFICATIONS
    // ============================================================

    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] =
        useState(false);
    const [notificationsLoading, setNotificationsLoading] =
        useState(false);
    const [notificationsRead, setNotificationsRead] =
        useState(false);

    // ============================================================
    // PROFILE
    // ============================================================

    const [showProfile, setShowProfile] = useState(false);

    // ============================================================
    // LOAD INCIDENTS
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

                setIncidents(data);
            } catch (error) {
                console.error(
                    "Search incident loading failed:",
                    error
                );
            }
        };

        fetchIncidents();
    }, []);

    // ============================================================
    // SEARCH
    // ============================================================

    useEffect(() => {
        const query = searchQuery
            .trim()
            .toLowerCase();

        if (!query) {
            setSearchResults([]);
            setShowResults(false);
            return;
        }

        const filtered = incidents.filter(
            (incident) => {
                const title =
                    incident.title?.toLowerCase() || "";

                const service =
                    incident.service?.toLowerCase() || "";

                const severity =
                    incident.severity?.toLowerCase() || "";

                const status =
                    incident.status?.toLowerCase() || "";

                return (
                    title.includes(query) ||
                    service.includes(query) ||
                    severity.includes(query) ||
                    status.includes(query)
                );
            }
        );

        setSearchResults(filtered);
        setShowResults(true);
    }, [searchQuery, incidents]);

    // ============================================================
    // SELECT SEARCH RESULT
    // ============================================================

    const handleSelectIncident = (incident) => {
        window.dispatchEvent(
            new CustomEvent(
                "incident-selected-from-search",
                {
                    detail: incident,
                }
            )
        );

        setSearchQuery(
            incident.title || ""
        );

        setShowResults(false);
        setShowNotifications(false);
        setShowProfile(false);
    };

    // ============================================================
    // KEYBOARD
    // ============================================================

    const handleKeyDown = (event) => {
        if (event.key === "Escape") {
            setShowResults(false);
            setShowNotifications(false);
            setShowProfile(false);
        }
    };

    // ============================================================
    // FETCH NOTIFICATIONS
    // ============================================================

    const fetchNotifications = async () => {
        try {
            setNotificationsLoading(true);

            const incidentsResponse = await fetch(
                `${API_URL}/api/incidents`
            );

            if (!incidentsResponse.ok) {
                throw new Error(
                    "Failed to load incidents"
                );
            }

            const incidentData =
                await incidentsResponse.json();

            const eventRequests =
                incidentData.map(async (incident) => {
                    try {
                        const response =
                            await fetch(
                                `${API_URL}/api/events/${incident._id}`
                            );

                        if (!response.ok) {
                            return [];
                        }

                        const data =
                            await response.json();

                        const events =
                            Array.isArray(data)
                                ? data
                                : data.value || [];

                        return events.map(
                            (event) => ({
                                ...event,
                                incidentTitle:
                                    incident.title,
                                incidentService:
                                    incident.service,
                                incidentSeverity:
                                    incident.severity,
                            })
                        );
                    } catch {
                        return [];
                    }
                });

            const eventResults =
                await Promise.all(
                    eventRequests
                );

            const allEvents =
                eventResults.flat();

            allEvents.sort(
                (a, b) =>
                    new Date(
                        b.timestamp ||
                        b.createdAt
                    ) -
                    new Date(
                        a.timestamp ||
                        a.createdAt
                    )
            );

            setNotifications(
                allEvents.slice(0, 10)
            );

        } catch (error) {
            console.error(
                "Failed to load notifications:",
                error
            );

            setNotifications([]);

        } finally {
            setNotificationsLoading(false);
        }
    };

    // ============================================================
    // NOTIFICATION BUTTON
    // ============================================================

    const handleNotificationClick = async () => {
        const nextState =
            !showNotifications;

        setShowNotifications(nextState);

        setShowResults(false);
        setShowProfile(false);

        if (nextState) {
            await fetchNotifications();

            setNotificationsRead(true);
        }
    };

    // ============================================================
    // EVENT STYLE
    // ============================================================

    const getNotificationStyle = (type) => {
        switch (type) {
            case "INCIDENT_DETECTED":
                return {
                    icon: "⚠",
                    color: "text-red-400",
                    bg: "bg-red-500/10",
                };

            case "AI_INVESTIGATION_STARTED":
                return {
                    icon: "✦",
                    color: "text-cyan-400",
                    bg: "bg-cyan-500/10",
                };

            case "ROOT_CAUSE_IDENTIFIED":
                return {
                    icon: "⌕",
                    color: "text-purple-400",
                    bg: "bg-purple-500/10",
                };

            case "REMEDIATION_RECOMMENDED":
                return {
                    icon: "→",
                    color: "text-yellow-400",
                    bg: "bg-yellow-500/10",
                };

            case "REMEDIATION_APPROVED":
                return {
                    icon: "✓",
                    color: "text-cyan-400",
                    bg: "bg-cyan-500/10",
                };

            case "REMEDIATION_EXECUTED":
                return {
                    icon: "⚙",
                    color: "text-yellow-400",
                    bg: "bg-yellow-500/10",
                };

            case "TELEMETRY_RECOVERED":
                return {
                    icon: "↓",
                    color: "text-green-400",
                    bg: "bg-green-500/10",
                };

            case "INCIDENT_RESOLVED":
                return {
                    icon: "✓",
                    color: "text-green-400",
                    bg: "bg-green-500/10",
                };

            default:
                return {
                    icon: "•",
                    color: "text-slate-400",
                    bg: "bg-slate-800",
                };
        }
    };

    // ============================================================
    // FORMAT TIME
    // ============================================================

    const formatNotificationTime = (
        timestamp
    ) => {
        if (!timestamp) {
            return "--:--";
        }

        return new Date(
            timestamp
        ).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // ============================================================
    // SELECT NOTIFICATION
    // ============================================================

    const handleSelectNotification = (
        notification
    ) => {
        if (!notification?.incidentId) {
            return;
        }

        const incident =
            incidents.find(
                (item) =>
                    item._id ===
                    notification.incidentId
            );

        if (incident) {
            handleSelectIncident(
                incident
            );
        }

        setShowNotifications(false);
    };

    // ============================================================
    // PROFILE BUTTON
    // ============================================================

    const handleProfileClick = () => {
        setShowProfile(
            (current) => !current
        );

        setShowNotifications(false);
        setShowResults(false);
    };

    // ============================================================
    // PROFILE ACTIONS
    // ============================================================

    const handleSettings = () => {
        setShowProfile(false);

        alert(
            "Settings will be available here."
        );
    };

    const handleSystemStatus = () => {
        setShowProfile(false);

        alert(
            "All monitored systems are operational."
        );
    };

    const handleSignOut = () => {
        setShowProfile(false);

        alert(
            "Sign out will be connected when authentication is added."
        );
    };

    // ============================================================
    // RENDER
    // ============================================================

    return (
        <header className="relative z-50 flex h-16 w-full min-w-0 items-center justify-between overflow-visible border-b border-slate-800 bg-slate-950 px-3 sm:px-4 lg:px-6">

            {/* ================================================= */}
            {/* LEFT SECTION */}
            {/* ================================================= */}

            <div className="flex min-w-0 items-center gap-2 sm:gap-4">

                <h2 className="shrink-0 text-lg font-bold text-white sm:text-2xl">
                    Dashboard
                </h2>

                {/* ================================================= */}
                {/* SEARCH */}
                {/* ================================================= */}

                <div className="relative min-w-0 flex-1 sm:flex-none">

                    <Search
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(event) =>
                            setSearchQuery(
                                event.target.value
                            )
                        }
                        onFocus={() => {
                            if (
                                searchQuery.trim()
                            ) {
                                setShowResults(
                                    true
                                );
                            }
                        }}
                        onKeyDown={
                            handleKeyDown
                        }
                        placeholder="Search incidents..."
                        className="w-full max-w-[180px] rounded-lg border border-slate-700 bg-slate-900 py-2 pl-9 pr-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-500 sm:max-w-[240px] sm:pl-10 sm:pr-4 lg:w-72 lg:max-w-none xl:w-80"
                    />

                    {/* SEARCH RESULTS */}

                    {showResults && (
                        <div className="absolute left-0 top-full mt-2 w-[min(24rem,calc(100vw-1.5rem))] max-w-[24rem] overflow-hidden rounded-xl border border-slate-700 bg-slate-950 shadow-2xl">

                            {searchResults.length >
                            0 ? (
                                <div className="max-h-80 overflow-y-auto">

                                    {searchResults.map(
                                        (incident) => (
                                            <button
                                                key={
                                                    incident._id
                                                }
                                                type="button"
                                                onClick={() =>
                                                    handleSelectIncident(
                                                        incident
                                                    )
                                                }
                                                className="w-full border-b border-slate-800 px-4 py-3 text-left transition hover:bg-slate-900"
                                            >

                                                <div className="flex items-center justify-between gap-3">

                                                    <p className="font-semibold text-white">
                                                        {
                                                            incident.title
                                                        }
                                                    </p>

                                                    <span
                                                        className={`text-xs font-semibold ${
                                                            incident.status ===
                                                            "Resolved"
                                                                ? "text-green-400"
                                                                : incident.severity ===
                                                                  "Critical"
                                                                ? "text-red-400"
                                                                : "text-yellow-400"
                                                        }`}
                                                    >
                                                        {
                                                            incident.status
                                                        }
                                                    </span>

                                                </div>

                                                <div className="mt-1 flex items-center justify-between">

                                                    <p className="text-xs text-slate-500">
                                                        {
                                                            incident.service
                                                        }
                                                    </p>

                                                    <p className="text-xs text-slate-600">
                                                        {
                                                            incident.severity
                                                        }
                                                    </p>

                                                </div>

                                            </button>
                                        )
                                    )}

                                </div>
                            ) : (
                                <div className="px-4 py-6 text-center">

                                    <Search
                                        size={20}
                                        className="mx-auto text-slate-600"
                                    />

                                    <p className="mt-2 text-sm text-slate-400">
                                        No incidents found
                                    </p>

                                    <p className="mt-1 text-xs text-slate-600">
                                        Try searching by title,
                                        service, status or severity.
                                    </p>

                                </div>
                            )}

                        </div>
                    )}

                </div>

            </div>

            {/* ================================================= */}
            {/* RIGHT SECTION */}
            {/* ================================================= */}

            <div className="flex shrink-0 items-center gap-3 sm:gap-6">

                {/* SYSTEM STATUS */}

                <div className="hidden items-center gap-2 text-green-400 lg:flex">

                    <Circle
                        size={10}
                        fill="currentColor"
                    />

                    <span className="text-sm">
                        All Systems Operational
                    </span>

                </div>

                {/* ================================================= */}
                {/* NOTIFICATIONS */}
                {/* ================================================= */}

                <div className="relative">

                    <button
                        type="button"
                        onClick={
                            handleNotificationClick
                        }
                        className="relative text-slate-300 transition hover:text-white"
                        title="Notifications"
                    >

                        <Bell size={21} />

                        {!notificationsRead && (
                            <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-red-500" />
                        )}

                    </button>

                    {/* NOTIFICATION DROPDOWN */}

                    {showNotifications && (
                        <div className="absolute right-0 top-full mt-3 w-[min(420px,calc(100vw-1.5rem))] max-w-[420px] overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 shadow-2xl">

                            <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">

                                <div>

                                    <h3 className="font-semibold text-white">
                                        Notifications
                                    </h3>

                                    <p className="mt-1 text-xs text-slate-500">
                                        Recent incident activity
                                    </p>

                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowNotifications(
                                            false
                                        )
                                    }
                                    className="text-slate-500 transition hover:text-white"
                                >
                                    <X size={18} />
                                </button>

                            </div>

                            {notificationsLoading ? (
                                <div className="px-5 py-10 text-center">

                                    <p className="text-sm text-slate-500">
                                        Loading notifications...
                                    </p>

                                </div>
                            ) : notifications.length ===
                              0 ? (
                                <div className="px-5 py-10 text-center">

                                    <div className="text-3xl">
                                        ✓
                                    </div>

                                    <p className="mt-3 text-sm font-semibold text-white">
                                        No recent notifications
                                    </p>

                                    <p className="mt-1 text-xs text-slate-500">
                                        Your system has no recorded incident events.
                                    </p>

                                </div>
                            ) : (
                                <div className="max-h-[420px] overflow-y-auto">

                                    {notifications.map(
                                        (
                                            notification,
                                            index
                                        ) => {
                                            const style =
                                                getNotificationStyle(
                                                    notification.type
                                                );

                                            return (
                                                <button
                                                    key={
                                                        notification._id ||
                                                        index
                                                    }
                                                    type="button"
                                                    onClick={() =>
                                                        handleSelectNotification(
                                                            notification
                                                        )
                                                    }
                                                    className="flex w-full gap-3 border-b border-slate-800 px-5 py-4 text-left transition hover:bg-slate-900"
                                                >

                                                    <div
                                                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${style.bg} ${style.color}`}
                                                    >
                                                        {
                                                            style.icon
                                                        }
                                                    </div>

                                                    <div className="min-w-0 flex-1">

                                                        <div className="flex items-start justify-between gap-3">

                                                            <p
                                                                className={`text-xs font-semibold ${style.color}`}
                                                            >
                                                                {notification.type
                                                                    ?.replaceAll(
                                                                        "_",
                                                                        " "
                                                                    )}
                                                            </p>

                                                            <span className="shrink-0 text-[10px] text-slate-600">
                                                                {formatNotificationTime(
                                                                    notification.timestamp ||
                                                                    notification.createdAt
                                                                )}
                                                            </span>

                                                        </div>

                                                        <p className="mt-1 truncate text-sm font-semibold text-white">
                                                            {
                                                                notification.incidentTitle
                                                            }
                                                        </p>

                                                        <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                                                            {
                                                                notification.message
                                                            }
                                                        </p>

                                                    </div>

                                                </button>
                                            );
                                        }
                                    )}

                                </div>
                            )}

                            {notifications.length >
                                0 && (
                                <div className="border-t border-slate-800 px-5 py-3">

                                    <p className="text-center text-xs text-slate-600">
                                        Showing latest{" "}
                                        {
                                            notifications.length
                                        }{" "}
                                        events
                                    </p>

                                </div>
                            )}

                        </div>
                    )}

                </div>

                {/* ================================================= */}
                {/* PROFILE */}
                {/* ================================================= */}

                <div className="relative">

                    <button
                        type="button"
                        onClick={
                            handleProfileClick
                        }
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500 font-bold text-slate-950 transition hover:bg-cyan-400"
                        title="User Profile"
                        aria-label="Open user profile"
                        aria-expanded={
                            showProfile
                        }
                    >
                        T
                    </button>

                    {/* PROFILE DROPDOWN */}

                    {showProfile && (
                        <div className="absolute right-0 top-full mt-3 w-64 overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 shadow-2xl">

                            {/* PROFILE HEADER */}

                            <div className="border-b border-slate-800 px-4 py-4">

                                <div className="flex items-center gap-3">

                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cyan-500 font-bold text-slate-950">
                                        T
                                    </div>

                                    <div className="min-w-0">

                                        <p className="truncate font-semibold text-white">
                                            Operator
                                        </p>

                                        <p className="truncate text-xs text-slate-500">
                                            Incident Commander
                                        </p>

                                    </div>

                                </div>

                            </div>

                            {/* PROFILE OPTIONS */}

                            <div className="p-2">

                                <button
                                    type="button"
                                    onClick={
                                        handleSettings
                                    }
                                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-slate-300 transition hover:bg-slate-900 hover:text-white"
                                >
                                    <span className="text-base">
                                        ⚙
                                    </span>

                                    <span>
                                        Settings
                                    </span>
                                </button>

                                <button
                                    type="button"
                                    onClick={
                                        handleSystemStatus
                                    }
                                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-slate-300 transition hover:bg-slate-900 hover:text-white"
                                >
                                    <span className="text-base text-green-400">
                                        ●
                                    </span>

                                    <span>
                                        System Status
                                    </span>
                                </button>

                            </div>

                            {/* SIGN OUT */}

                            <div className="border-t border-slate-800 p-2">

                                <button
                                    type="button"
                                    onClick={
                                        handleSignOut
                                    }
                                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-slate-400 transition hover:bg-red-500/10 hover:text-red-400"
                                >
                                    <span className="text-base">
                                        ↪
                                    </span>

                                    <span>
                                        Sign Out
                                    </span>

                                </button>

                            </div>

                        </div>
                    )}

                </div>

            </div>

        </header>
    );
}

export default TopNavbar;