function IncidentItem({ incident, selected, onClick }) {
    const getSeverityStyle = (severity) => {
        switch (severity) {
            case "Critical":
                return {
                    badge: "bg-red-500/10 text-red-400 border-red-500/20",
                    dot: "bg-red-400",
                };

            case "High":
                return {
                    badge: "bg-orange-500/10 text-orange-400 border-orange-500/20",
                    dot: "bg-orange-400",
                };

            case "Medium":
                return {
                    badge: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
                    dot: "bg-yellow-400",
                };

            default:
                return {
                    badge: "bg-slate-500/10 text-slate-400 border-slate-500/20",
                    dot: "bg-slate-400",
                };
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case "Investigating":
                return "text-cyan-400";

            case "Active":
                return "text-yellow-400";

            case "Resolved":
                return "text-green-400";

            default:
                return "text-slate-400";
        }
    };

    const severityStyle = getSeverityStyle(incident.severity);

    return (
        <button
            type="button"
            onClick={onClick}
            className={`w-full rounded-xl border p-4 text-left transition-all ${
                selected
                    ? "border-cyan-500/50 bg-cyan-500/5 shadow-lg shadow-cyan-500/5"
                    : "border-slate-800 bg-slate-950 hover:border-slate-700 hover:bg-slate-900"
            }`}
        >
            {/* Top row */}
            <div className="flex items-start justify-between gap-3">

                <div className="flex min-w-0 items-start gap-3">

                    <span
                        className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${severityStyle.dot}`}
                    />

                    <div className="min-w-0">

                        <h3 className="truncate font-semibold text-white">
                            {incident.title}
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                            {incident.service}
                        </p>

                    </div>

                </div>

                {/* Severity */}
                <span
                    className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-semibold ${severityStyle.badge}`}
                >
                    {incident.severity}
                </span>

            </div>

            {/* Bottom row */}
            <div className="mt-4 flex items-center justify-between">

                <span
                    className={`text-xs font-medium ${getStatusStyle(
                        incident.status
                    )}`}
                >
                    ● {incident.status}
                </span>

                <span className="text-xs text-slate-600">
                    {incident.deployment?.version || "No deployment"}
                </span>

            </div>
        </button>
    );
}

export default IncidentItem;