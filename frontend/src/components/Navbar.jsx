import { LayoutDashboard, LogOut, Moon, Sun } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import styles from "../styles/layout.module.css";

export default function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className={styles.navbar}>
      <Link className={styles.brand} to="/">
        <span className={styles.brandMark}>TF</span>
        <span>TaskFlow</span>
      </Link>

      <nav className={styles.navLinks} aria-label="Primary">
        {isAuthenticated ? (
          <NavLink end to="/" className={({ isActive }) => (isActive ? styles.activeLink : "")}>
            <LayoutDashboard size={18} />
            Dashboard
          </NavLink>
        ) : (
          <>
            <NavLink to="/login" className={({ isActive }) => (isActive ? styles.activeLink : "")}>
              Login
            </NavLink>
            <NavLink
              to="/register"
              className={({ isActive }) => (isActive ? styles.activeLink : "")}
            >
              Register
            </NavLink>
          </>
        )}
      </nav>

      <div className={styles.navActions}>
        {isAuthenticated && <span className={styles.userChip}>{user?.name}</span>}
        <button className="icon-button" type="button" onClick={toggleTheme} title="Toggle theme">
          {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </button>
        {isAuthenticated && (
          <button className="icon-button" type="button" onClick={handleLogout} title="Logout">
            <LogOut size={18} />
          </button>
        )}
      </div>
    </header>
  );
}
