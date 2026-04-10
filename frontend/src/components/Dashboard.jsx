import ItemList from "./ItemList";

function isPending(item) {
  return item.status === "Pending";
}

function isTodayFocusReminder(item) {
  if (item.type !== "reminder" || !isPending(item)) return false;

  const title = item.title.toLowerCase();
  return (
    title.includes("today") ||
    title.includes("tomorrow") ||
    title.includes("friday") ||
    title.includes("monday") ||
    title.includes("next week") ||
    title.includes("deadline") ||
    title.includes("evening")
  );
}

export default function Dashboard({ items, onStatusChange, onDelete }) {
  const pendingItems = items.filter(isPending);
  const activeItems = items.filter((item) => item.status !== "Ignored");

  const todayFocus = pendingItems.filter(
    (item) =>
      (item.type === "task" && item.priority === "High") ||
      (item.type === "risk" && item.priority === "High") ||
      isTodayFocusReminder(item)
  );

  const tasks = pendingItems.filter((item) => item.type === "task");
  const risks = pendingItems.filter((item) => item.type === "risk");
  const reminders = pendingItems.filter((item) => item.type === "reminder");
  const goals = pendingItems.filter((item) => item.type === "goal");

  const totalPending = pendingItems.length;
  const totalDone = items.filter((item) => item.status === "Done").length;
  const totalRisks = risks.length;

  return (
    <div className="fade-in">
      {items.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 p-4 bg-white/95 border border-ink-100 rounded-2xl shadow-sm">
          <Stat label="Total" value={items.length} />
          <Stat label="Pending" value={totalPending} />
          <Stat label="Done" value={totalDone} />
          <Stat label="Risks" value={totalRisks} accent />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
        <div>
          <ItemList
            title="Today's Focus"
            items={todayFocus}
            onStatusChange={onStatusChange}
            onDelete={onDelete}
            emptyMsg="Nothing urgent right now."
          />
          <ItemList
            title="Active Risks"
            items={risks}
            onStatusChange={onStatusChange}
            onDelete={onDelete}
            emptyMsg="No active risks right now."
          />
          <ItemList
            title="Goals"
            items={goals}
            onStatusChange={onStatusChange}
            onDelete={onDelete}
            emptyMsg="No goals added yet."
          />
        </div>

        <div>
          <ItemList
            title="Pending Tasks"
            items={tasks}
            onStatusChange={onStatusChange}
            onDelete={onDelete}
            emptyMsg="No tasks yet. Add a thought above to get started."
          />
          <ItemList
            title="Upcoming Reminders"
            items={reminders}
            onStatusChange={onStatusChange}
            onDelete={onDelete}
            emptyMsg="No reminders scheduled."
          />
        </div>
      </div>

      {activeItems.length === 0 && (
        <div className="text-center py-16 text-ink-300 fade-in">
          <p className="text-4xl mb-4">🧠</p>
          <p className="text-sm font-mono">
            Paste your thoughts above and structure them into tasks, risks, goals, and reminders.
          </p>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, accent = false }) {
  return (
    <div className="rounded-xl bg-ink-50 border border-ink-100 px-4 py-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm">
      <span className={"block text-2xl font-semibold " + (accent ? "text-red-500" : "text-ink-800")}>
        {value}
      </span>
      <span className="text-xs font-mono text-ink-400 mt-1 block">{label}</span>
    </div>
  );
}