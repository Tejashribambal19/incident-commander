import { motion } from "framer-motion";

function StatCard({ title, value, color }) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.2 }}
      className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-8 shadow-lg"
    >
      <p className="text-sm uppercase tracking-wide text-slate-400">
        {title}
      </p>

      <h2 className={`mt-5 text-5xl font-bold ${color}`}>
        {value}
      </h2>
    </motion.div>
  );
}

export default StatCard;