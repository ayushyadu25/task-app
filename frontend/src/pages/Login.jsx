import { LogIn } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getErrorMessage } from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import styles from "../styles/forms.module.css";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(form);
      navigate(location.state?.from?.pathname || "/", { replace: true });
    } catch (loginError) {
      setError(getErrorMessage(loginError));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.authShell}>
      <form className={styles.authPanel} onSubmit={submit}>
        <div className={styles.authIntro}>
          <span className={styles.authIcon}>
            <LogIn size={24} />
          </span>
          <div>
            <h1>Welcome back</h1>
            <p>Log in to continue planning your boards.</p>
          </div>
        </div>

        {error && <p className="error-text">{error}</p>}

        <label>
          Email
          <input name="email" type="email" value={form.email} onChange={updateField} required />
        </label>
        <label>
          Password
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={updateField}
            required
          />
        </label>

        <button className="button" type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className={styles.authSwitch}>
          New to TaskFlow? <Link to="/register">Create an account</Link>
        </p>
      </form>
    </section>
  );
}
