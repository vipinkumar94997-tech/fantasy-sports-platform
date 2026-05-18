const variants = {
  live: "bg-red-500/20 text-red-400 border border-red-500/30",
  upcoming: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
  completed: "bg-gray-500/20 text-gray-400 border border-gray-500/30",
  success: "bg-primary-500/20 text-primary-400 border border-primary-500/30",
  warning: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
  danger: "bg-red-500/20 text-red-400 border border-red-500/30",
};

const Badge = ({ label, variant = "success", pulse = false }) => {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${variants[variant]}`}
    >
      {pulse && (
        <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" />
      )}
      {label}
    </span>
  );
};

export default Badge;
