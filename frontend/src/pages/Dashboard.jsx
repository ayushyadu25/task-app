import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import api, { getErrorMessage } from "../api/axios.js";
import BoardCard from "../components/BoardCard.jsx";
import Loading from "../components/Loading.jsx";
import styles from "../styles/dashboard.module.css";

export default function Dashboard() {
  const [boards, setBoards] = useState([]);
  const [form, setForm] = useState({ title: "", description: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadBoards = async () => {
      try {
        const { data } = await api.get("/boards");
        setBoards(data.boards);
      } catch (loadError) {
        setError(getErrorMessage(loadError));
      } finally {
        setLoading(false);
      }
    };

    loadBoards();
  }, []);

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const createBoard = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const { data } = await api.post("/boards", form);
      setBoards((current) => [data.board, ...current]);
      setForm({ title: "", description: "" });
    } catch (createError) {
      setError(getErrorMessage(createError));
    } finally {
      setSaving(false);
    }
  };

  const renameBoard = async (id, payload) => {
    setError("");

    try {
      const { data } = await api.patch(`/boards/${id}`, payload);
      setBoards((current) => current.map((board) => (board._id === id ? data.board : board)));
    } catch (renameError) {
      setError(getErrorMessage(renameError));
      throw renameError;
    }
  };

  const deleteBoard = async (id) => {
    const confirmed = window.confirm("Delete this board and all of its tasks?");

    if (!confirmed) return;

    try {
      await api.delete(`/boards/${id}`);
      setBoards((current) => current.filter((board) => board._id !== id));
    } catch (deleteError) {
      setError(getErrorMessage(deleteError));
    }
  };

  if (loading) {
    return <Loading label="Loading boards" />;
  }

  return (
    <section className={styles.dashboard}>
      <div className={styles.header}>
        <div>
          <p className="eyebrow">Workspace</p>
          <h1>Your boards</h1>
        </div>
        <form className={styles.createForm} onSubmit={createBoard}>
          <input
            name="title"
            value={form.title}
            onChange={updateField}
            placeholder="Board title"
            minLength={2}
            maxLength={100}
            required
          />
          <input
            name="description"
            value={form.description}
            onChange={updateField}
            placeholder="Short description"
            maxLength={500}
          />
          <button className="button" type="submit" disabled={saving}>
            <Plus size={18} />
            {saving ? "Adding..." : "Add board"}
          </button>
        </form>
      </div>

      {error && <p className="error-text">{error}</p>}

      {boards.length === 0 ? (
        <div className={styles.emptyState}>
          <h2>No boards yet</h2>
          <p>Create your first board to organize tasks by status, priority, and due date.</p>
        </div>
      ) : (
        <div className={styles.boardGrid}>
          {boards.map((board) => (
            <BoardCard
              key={board._id}
              board={board}
              onDelete={deleteBoard}
              onRename={renameBoard}
            />
          ))}
        </div>
      )}
    </section>
  );
}
