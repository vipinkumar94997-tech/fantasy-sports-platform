const SkeletonCard = ({ lines = 3 }) => {
  return (
    <div className="card p-4 animate-pulse">
      <div className="h-4 bg-white/10 rounded w-3/4 mb-3" />
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`h-3 bg-white/10 rounded mb-2 ${i % 2 === 0 ? "w-full" : "w-2/3"}`}
        />
      ))}
      <div className="h-8 bg-white/10 rounded mt-4" />
    </div>
  );
};

export default SkeletonCard;
