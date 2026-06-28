import { ArrowLeft, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api, { getErrorMessage } from "../api/axios.js";
import Loading from "../components/Loading.jsx";
import TaskCard from "../components/TaskCard.jsx";
import TaskModal from "../components/TaskModal.jsx";
import styles from "../styles/board.module.css";

const columns = [
  { id: "todo", title: "To Do" },
  { id: "in-progress", title: "In Progress" },
  { id: "done", title: "Done" },
];

const priorityRank = {
  high: 3,
  medium: 2,
  low: 1,
};

const getDueTime = (task) => (task.dueDate ? new Date(task.dueDate).getTime() : Number.MAX_SAFE_INTEGER);

export default function BoardView() {
  const { id } = useParams();
  const [board, setBoard] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [sortBy, setSortBy] = useState("created");
  const [modalTask, setModalTask] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadBoard = async () => {
      setLoading(true);
      setError("");

      try {
        const [{ data: boardData }, { data: taskData }] = await Promise.all([
          api.get(`/boards/${id}`),
          api.get(`/tasks/board/${id}`),
        ]);
        setBoard(boardData.board);
        setTasks(taskData.tasks);
      } catch (loadError) {
        setError(getErrorMessage(loadError));
      } finally {
        setLoading(false);
      }
    };

    loadBoard();
  }, [id]);

  const visibleTasks = useMemo(() => {
    const filtered =
      priorityFilter === "all"
        ? tasks
        : tasks.filter((task) => task.priority === priorityFilter);

    return [...filtered].sort((a, b) => {
      if (sortBy === "due") return getDueTime(a) - getDueTime(b);
      if (sortBy === "priority") return priorityRank[b.priority] - priorityRank[a.priority];
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [priorityFilter, sortBy, tasks]);

  const openNewTask = () => {
    setModalTask(null);
    setModalOpen(true);
  };

  const saveTask = async (form) => {
    const payload = {
      ...form,
      dueDate: form.dueDate || "",
    };

    if (modalTask) {
      const { data } = await api.patch(`/tasks/${modalTask._id}`, payload);
      setTasks((current) => current.map((task) => (task._id === modalTask._id ? data.task : task)));
      return;
    }

    const { data } = await api.post("/tasks", { ...payload, boardId: id });
    setTasks((current) => [data.task, ...current]);
  };

  const moveTask = async (task, status) => {
    try {
      const { data } = await api.patch(`/tasks/${task._id}`, { status });
      setTasks((current) => current.map((item) => (item._id === task._id ? data.task : item)));
    } catch (moveError) {
      setError(getErrorMessage(moveError));
    }
  };

  const deleteTask = async (taskId) => {
    const confirmed = window.confirm("Delete this task?");

    if (!confirmed) return;

    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks((current) => current.filter((task) => task._id !== taskId));
    } catch (deleteError) {
      setError(getErrorMessage(deleteError));
    }
  };

  if (loading) {
    return <Loading label="Loading board" />;
  }

  if (error && !board) {
    return (
      <section className={styles.boardPage}>
        <Link className={styles.backLink} to="/">
          <ArrowLeft size={17} />
          Back to boards
        </Link>
        <p className="error-text">{error}</p>
      </section>
    );
  }

  return (
    <section className={styles.boardPage}>
      <div className={styles.boardHeader}>
        <div>
          <Link className={styles.backLink} to="/">
            <ArrowLeft size={17} />
            Boards
          </Link>
          <p className="eyebrow">Board</p>
          <h1>{board.title}</h1>
          {board.description && <p>{board.description}</p>}
        </div>
        <button className="button" type="button" onClick={openNewTask}>
          <Plus size={18} />
          New task
        </button>
      </div>

      {error && <p className="error-text">{error}</p>}

      <div className={styles.toolbar}>
        <label>
          Priority
          <select value={priorityFilter} onChange={(event) => setPriorityFilter(event.target.value)}>
            <option value="all">All</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </label>
        <label>
          Sort
          <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
            <option value="created">Newest</option>
            <option value="due">Due date</option>
            <option value="priority">Priority</option>
          </select>
        </label>
      </div>

      <div className={styles.columns}>
        {columns.map((column) => {
          const columnTasks = visibleTasks.filter((task) => task.status === column.id);

          return (
            <section className={styles.column} key={column.id}>
              <div className={styles.columnHeader}>
                <h2>{column.title}</h2>
                <span>{columnTasks.length}</span>
              </div>
              <div className={styles.taskList}>
                {columnTasks.length === 0 ? (
                  <p className={styles.emptyColumn}>No tasks here.</p>
                ) : (
                  columnTasks.map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      onDelete={deleteTask}
                      onEdit={(selectedTask) => {
                        setModalTask(selectedTask);
                        setModalOpen(true);
                      }}
                      onMove={moveTask}
                    />
                  ))
                )}
              </div>
            </section>
          );
        })}
      </div>

      {modalOpen && (
        <TaskModal
          initialTask={modalTask}
          onClose={() => setModalOpen(false)}
          onSubmit={saveTask}
        />
      )}
    </section>
  );
}
