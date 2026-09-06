import { Bell, Menu, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = ({ onMenuClick }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const roleLabel =
    user?.role === "worker"
      ? "Worker"
      : user?.role === "admin"
        ? "Admin"
        : "Customer";

  return (
    <header className="top-navbar">
      <div className="navbar-left">
        <button className="mobile-menu-btn" onClick={onMenuClick} type="button" aria-label="Open menu">
          <Menu size={22} />
        </button>

        <div className="navbar-search">
          <Search size={18} />
          <input type="text" placeholder="Search jobs, services..." aria-label="Search" />
        </div>
      </div>

      <div className="navbar-right">
        <button
          className="notification-btn"
          type="button"
          onClick={() => navigate("/notifications")}
          aria-label="Notifications"
        >
          <Bell size={21} />
          <span className="notification-dot" />
        </button>

        <div className="navbar-user">
          <div className="user-avatar">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="navbar-user-info">
            <strong>{user?.name || "User"}</strong>
            <span>{roleLabel}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
