import { Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";
import api, { getErrorMessage } from "../api/axios.js";
import styles from "../styles/modal.module.css";

const toInputDate = (dateValue) => {
  if (!dateValue) return "";
  return new Date(dateValue).toISOString().slice(0, 10);
};

const emptyForm = {
  title: "",
  description: "",
  status: "todo",
  priority: "medium",
  dueDate: "",
  estimatedEffort: "",
};

export default function TaskModal({ initialTask, onClose, onSubmit }) {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [suggesting, setSuggesting] = useState(false);
  const [suggestion, setSuggestion] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!initialTask) {
      setForm(emptyForm);
      return;
    }

    setForm({
      title: initialTask.title,
      description: initialTask.description || "",
      status: initialTask.status,
      priority: initialTask.priority,
      dueDate: toInputDate(initialTask.dueDate),
      estimatedEffort: initialTask.estimatedEffort || "",
    });
  }, [initialTask]);

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      await onSubmit(form);
      onClose();
    } catch (submitError) {
      setError(getErrorMessage(submitError));
    } finally {
      setSaving(false);
    }
  };

  const requestSuggestion = async () => {
    setSuggesting(true);
    setError("");
    setSuggestion(null);

    try {
      const { data } = await api.post("/ai/task-estimate", {
        title: form.title,
        description: form.description,
      });
      setSuggestion(data.estimate);
    } catch (suggestError) {
      setError(getErrorMessage(suggestError));
    } finally {
      setSuggesting(false);
    }
  };

  const acceptSuggestion = () => {
    setForm((current) => ({
      ...current,
      dueDate: suggestion.dueDate,
      estimatedEffort: suggestion.effort,
    }));
  };

  return (
    <div className={styles.backdrop} role="presentation">
      <section className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="task-modal-title">
        <div className={styles.modalHeader}>
          <h2 id="task-modal-title">{initialTask ? "Edit task" : "New task"}</h2>
          <button className="icon-button" type="button" onClick={onClose} title="Close dialog">
            <X size={18} />
          </button>
        </div>

        <form className={styles.form} onSubmit={submit}>
          {error && <p className="error-text">{error}</p>}

          <label>
            Title
            <input
              name="title"
              value={form.title}
              onChange={updateField}
              minLength={2}
              maxLength={140}
              required
            />
          </label>

          <label>
            Description
            <textarea
              name="description"
              value={form.description}
              onChange={updateField}
              maxLength={1000}
              rows={4}
            />
          </label>

          <div className={styles.twoColumns}>
            <label>
              Status
              <select name="status" value={form.status} onChange={updateField}>
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </label>
            <label>
              Priority
              <select name="priority" value={form.priority} onChange={updateField}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </label>
          </div>

          <div className={styles.twoColumns}>
            <label>
              Due date
              <input name="dueDate" type="date" value={form.dueDate} onChange={updateField} />
            </label>
            <label>
              Effort
              <input
                name="estimatedEffort"
                value={form.estimatedEffort}
                onChange={updateField}
                maxLength={60}
                placeholder="4 hours"
              />
            </label>
          </div>

          <div className={styles.aiBox}>
            <button
              className="button secondary"
              type="button"
              onClick={requestSuggestion}
              disabled={suggesting || form.title.trim().length < 2}
            >
              <Sparkles size={17} />
              {suggesting ? "Thinking..." : "Suggest estimate"}
            </button>
            {suggestion && (
              <div className={styles.suggestion}>
                <p>
                  <strong>{suggestion.effort}</strong> by <strong>{suggestion.dueDate}</strong>
                </p>
                <span>{suggestion.reasoning}</span>
                <button className="button compact" type="button" onClick={acceptSuggestion}>
                  Accept
                </button>
              </div>
            )}
          </div>

          <div className={styles.footer}>
            <button className="button secondary" type="button" onClick={onClose}>
              Cancel
            </button>
            <button className="button" type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save task"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
