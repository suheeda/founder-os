const TYPE_STYLES = {
  task: { bg: "bg-blue-50", text: "text-blue-700", label: "Task" },
  risk: { bg: "bg-red-50", text: "text-red-700", label: "Risk" },
  goal: { bg: "bg-green-50", text: "text-green-700", label: "Goal" },
  reminder: { bg: "bg-amber-50", text: "text-amber-700", label: "Reminder" },
};

const PRIORITY_STYLES = {
  High: "text-red-600 bg-red-50",
  Medium: "text-amber-600 bg-amber-50",
  Low: "text-green-600 bg-green-50",
};

const CATEGORY_STYLES = {
  Business: "text-ink-500 bg-ink-100",
  Legal: "text-purple-600 bg-purple-50",
  Personal: "text-teal-600 bg-teal-50",
};

function formatDate(ts) {
  const d = new Date(ts);
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  }) +
    ", " +
    d.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    }).toLowerCase();
}

export default function ItemCard({ item, onStatusChange, onDelete }) {
  const typeStyle = TYPE_STYLES[item.type] || TYPE_STYLES.task;

  const handleStatusChange = (e) => {
    onStatusChange(item.id, e.target.value);
  };

  const isDone = item.status === "Done";
  const isIgnored = item.status === "Ignored";

  return (
    <div className={"card " + (isDone ? "opacity-50" : isIgnored ? "opacity-40" : "")}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p
            className={
              "text-sm font-medium text-ink-800 leading-snug " +
              (isDone ? "line-through" : "")
            }
          >
            {item.title}
          </p>

          <div className="flex flex-wrap items-center gap-1.5 mt-2">
            <span className={"badge " + typeStyle.bg + " " + typeStyle.text}>
              {typeStyle.label}
            </span>
            <span className={"badge " + PRIORITY_STYLES[item.priority]}>
              {item.priority}
            </span>
            <span className={"badge " + CATEGORY_STYLES[item.category]}>
              {item.category}
            </span>
          </div>

          <p className="text-xs text-ink-300 font-mono mt-2">
            {formatDate(item.created_at)}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <select
            value={item.status}
            onChange={handleStatusChange}
            className="text-xs border border-ink-200 rounded px-2 py-1 bg-white text-ink-600 focus:outline-none focus:border-ink-400 cursor-pointer"
          >
            <option value="Pending">Pending</option>
            <option value="Done">Done</option>
            <option value="Ignored">Ignored</option>
          </select>

          <button
            onClick={() => onDelete(item.id)}
            className="text-ink-200 hover:text-red-400 transition-colors text-sm px-1"
            title="Delete"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}