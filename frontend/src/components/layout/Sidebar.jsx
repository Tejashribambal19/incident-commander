import {
  LayoutDashboard,
  AlertTriangle,
  FileText,
  Settings,
} from "lucide-react";

import { NavLink } from "react-router-dom";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    title: "Incidents",
    icon: AlertTriangle,
    path: "/incidents",
  },
  {
    title: "Reports",
    icon: FileText,
    path: "/reports",
  },
  {
    title: "Settings",
    icon: Settings,
    path: "/settings",
  },
];

function Sidebar() {
  return (<aside className="w-72 bg-slate-950 border-r border-slate-800">

    <div className="p-8">

      <h1 className="text-xl font-bold text-cyan-400">
        Incident Commander
      </h1>

      <p className="text-xs text-slate-400 mt-1">
        AI Operations Center
      </p>

    </div>

    <nav className="px-4">

      {menuItems.map((item) => {
        const Icon = item.icon;

        return (
          <NavLink
            key={item.title}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 w-full rounded-lg px-4 py-3 mb-2 transition ${isActive
                ? "bg-cyan-500/10 text-cyan-400"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`
            }
          >
            <Icon size={20} />

            {item.title}
          </NavLink>
        );
      })}

    </nav>

  </aside>
  );


}

export default Sidebar;
