import { UserPlus } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getErrorMessage } from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import styles from "../styles/forms.module.css";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
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
      await register(form);
      navigate("/", { replace: true });
    } catch (registerError) {
      setError(getErrorMessage(registerError));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.authShell}>
      <form className={styles.authPanel} onSubmit={submit}>
        <div className={styles.authIntro}>
          <span className={styles.authIcon}>
            <UserPlus size={24} />
          </span>
          <div>
            <h1>Create account</h1>
            <p>Start a workspace for your projects and tasks.</p>
          </div>
        </div>

        {error && <p className="error-text">{error}</p>}

        <label>
          Name
          <input name="name" value={form.name} onChange={updateField} minLength={2} required />
        </label>
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
            minLength={6}
            required
          />
        </label>

        <button className="button" type="submit" disabled={loading}>
          {loading ? "Creating..." : "Register"}
        </button>

        <p className={styles.authSwitch}>
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
    </section>
  );
}
