const StatCard = ({ icon, label, value, sub, color = "text-primary-400" }) => {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-2xl">{icon}</span>
        <span
          className={`text-xs font-semibold px-2 py-1 rounded-full bg-white/5 ${color}`}
        >
          {sub}
        </span>
      </div>
      <p className={`font-black text-2xl ${color} mb-1`}>{value}</p>
      <p className="text-gray-500 text-sm">{label}</p>
    </div>
  );
};

export default StatCard;
