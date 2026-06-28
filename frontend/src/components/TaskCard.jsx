import { ArrowLeft, ArrowRight, Calendar, Clock3, Edit3, Trash2 } from "lucide-react";
import styles from "../styles/board.module.css";

const statusOrder = ["todo", "in-progress", "done"];

const formatDate = (dateValue) => {
  if (!dateValue) return "No due date";

  return new Date(dateValue).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
};

const isOverdue = (task) => {
  if (!task.dueDate || task.status === "done") return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(task.dueDate) < today;
};

export default function TaskCard({ task, onDelete, onEdit, onMove }) {
  const currentIndex = statusOrder.indexOf(task.status);
  const canMoveLeft = currentIndex > 0;
  const canMoveRight = currentIndex < statusOrder.length - 1;

  return (
    <article className={`${styles.taskCard} ${isOverdue(task) ? styles.overdue : ""}`}>
      <div className={styles.taskHeader}>
        <h3>{task.title}</h3>
        <span className={`${styles.priority} ${styles[task.priority]}`}>{task.priority}</span>
      </div>
      {task.description && <p className={styles.taskDescription}>{task.description}</p>}
      <div className={styles.taskMeta}>
        <span>
          <Calendar size={15} />
          {formatDate(task.dueDate)}
        </span>
        <span>
          <Clock3 size={15} />
          {task.estimatedEffort || "No estimate"}
        </span>
      </div>
      <div className={styles.taskActions}>
        <button
          className="icon-button"
          type="button"
          disabled={!canMoveLeft}
          onClick={() => onMove(task, statusOrder[currentIndex - 1])}
          title="Move left"
        >
          <ArrowLeft size={17} />
        </button>
        <button
          className="icon-button"
          type="button"
          disabled={!canMoveRight}
          onClick={() => onMove(task, statusOrder[currentIndex + 1])}
          title="Move right"
        >
          <ArrowRight size={17} />
        </button>
        <button className="icon-button" type="button" onClick={() => onEdit(task)} title="Edit task">
          <Edit3 size={17} />
        </button>
        <button className="icon-button danger" type="button" onClick={() => onDelete(task._id)} title="Delete task">
          <Trash2 size={17} />
        </button>
      </div>
    </article>
  );
}
