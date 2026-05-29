import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div className="bg-dark-200 border-b border-white/10 px-10 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link to="/home" className="text-gray-400 hover:text-white text-sm">
          ←
        </Link>
        <h1 className="text-white font-black text-xl">Admin Panel</h1>
      </div>
      <span className="text-gray-500 text-sm">
        {new Date().toLocaleDateString("en-IN", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </span>
    </div>
  );
};

export default Header;
