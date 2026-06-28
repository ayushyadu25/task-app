import { Check, Edit3, FolderKanban, Trash2, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "../styles/dashboard.module.css";

export default function BoardCard({ board, onDelete, onRename }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(board.title);
  const [description, setDescription] = useState(board.description || "");

  const updated = new Date(board.updatedAt).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const submitEdit = async (event) => {
    event.preventDefault();

    try {
      await onRename(board._id, { title, description });
      setEditing(false);
    } catch {
      // The dashboard shows the API error. Keep the edit form open.
    }
  };

  return (
    <article className={styles.boardCard}>
      {editing ? (
        <form className={styles.cardEditForm} onSubmit={submitEdit}>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            minLength={2}
            maxLength={100}
            required
          />
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            maxLength={500}
            rows={3}
          />
          <div className={styles.cardActions}>
            <button className="icon-button success" type="submit" title="Save board">
              <Check size={18} />
            </button>
            <button className="icon-button" type="button" onClick={() => setEditing(false)} title="Cancel">
              <X size={18} />
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className={styles.boardIcon}>
            <FolderKanban size={24} />
          </div>
          <div>
            <h3>{board.title}</h3>
            <p>{board.description || "No description yet."}</p>
          </div>
          <span className={styles.updatedText}>Updated {updated}</span>
          <div className={styles.cardActions}>
            <Link className="button compact" to={`/boards/${board._id}`}>
              Open
            </Link>
            <button className="icon-button" type="button" onClick={() => setEditing(true)} title="Rename board">
              <Edit3 size={18} />
            </button>
            <button className="icon-button danger" type="button" onClick={() => onDelete(board._id)} title="Delete board">
              <Trash2 size={18} />
            </button>
          </div>
        </>
      )}
    </article>
  );
}
