import { useState } from "react";

function Settings() {
const [autoInvestigation, setAutoInvestigation] = useState(true);
const [notifications, setNotifications] = useState(true);
const [autoRefresh, setAutoRefresh] = useState(true);


return (
    <div>

        <div className="mb-10">
            <h1 className="text-4xl font-bold">
                Settings
            </h1>

            <p className="mt-3 text-slate-400">
                Configure Incident Commander operations and monitoring.
            </p>
        </div>

        <div className="max-w-4xl space-y-6">

            {/* AI Investigation */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

                <h2 className="text-xl font-semibold">
                    AI Investigation
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                    Configure automated incident investigation.
                </p>

                <div className="mt-6 flex items-center justify-between">

                    <div>
                        <p className="font-medium">
                            Automatic investigation
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                            Automatically investigate newly detected incidents.
                        </p>
                    </div>

                    <button
                        onClick={() =>
                            setAutoInvestigation(!autoInvestigation)
                        }
                        className={`relative h-6 w-11 rounded-full transition ${
                            autoInvestigation
                                ? "bg-cyan-500"
                                : "bg-slate-700"
                        }`}
                    >
                        <span
                            className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                                autoInvestigation
                                    ? "left-6"
                                    : "left-1"
                            }`}
                        />
                    </button>

                </div>

            </div>

            {/* Notifications */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

                <h2 className="text-xl font-semibold">
                    Notifications
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                    Configure incident alerts.
                </p>

                <div className="mt-6 flex items-center justify-between">

                    <div>
                        <p className="font-medium">
                            Incident notifications
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                            Receive notifications when critical incidents occur.
                        </p>
                    </div>

                    <button
                        onClick={() =>
                            setNotifications(!notifications)
                        }
                        className={`relative h-6 w-11 rounded-full transition ${
                            notifications
                                ? "bg-cyan-500"
                                : "bg-slate-700"
                        }`}
                    >
                        <span
                            className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                                notifications
                                    ? "left-6"
                                    : "left-1"
                            }`}
                        />
                    </button>

                </div>

            </div>

            {/* Monitoring */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

                <h2 className="text-xl font-semibold">
                    Monitoring
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                    Configure dashboard monitoring behavior.
                </p>

                <div className="mt-6 flex items-center justify-between">

                    <div>
                        <p className="font-medium">
                            Auto refresh
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                            Automatically refresh incident and system data.
                        </p>
                    </div>

                    <button
                        onClick={() =>
                            setAutoRefresh(!autoRefresh)
                        }
                        className={`relative h-6 w-11 rounded-full transition ${
                            autoRefresh
                                ? "bg-cyan-500"
                                : "bg-slate-700"
                        }`}
                    >
                        <span
                            className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                                autoRefresh
                                    ? "left-6"
                                    : "left-1"
                            }`}
                        />
                    </button>

                </div>

            </div>

            {/* System */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

                <h2 className="text-xl font-semibold">
                    System
                </h2>

                <div className="mt-6 space-y-4">

                    <div className="flex justify-between border-b border-slate-800 pb-4">
                        <span className="text-slate-400">
                            Backend
                        </span>

                        <span className="text-green-400">
                            Connected
                        </span>
                    </div>

                    <div className="flex justify-between border-b border-slate-800 pb-4">
                        <span className="text-slate-400">
                            Database
                        </span>

                        <span className="text-green-400">
                            MongoDB Atlas
                        </span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-slate-400">
                            Environment
                        </span>

                        <span className="text-cyan-400">
                            Development
                        </span>
                    </div>

                </div>

            </div>

        </div>

    </div>
);

}

export default Settings;
