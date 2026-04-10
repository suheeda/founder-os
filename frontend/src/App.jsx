import { useState, useEffect } from "react";
import { api } from "./api";
import CaptureInput from "./components/CaptureInput";
import Dashboard from "./components/Dashboard";
import LearningHub from "./components/LearningHub";

export default function App() {
  const [items, setItems] = useState([]);
  const [tab, setTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState("light");

  const fetchItems = async () => {
    try {
      const data = await api.getItems();
      setItems(data);
      setError(null);
    } catch (e) {
      setError("Cannot connect to backend. Is the server running on port 8000?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark", "soft");
    document.documentElement.classList.add(theme);
  }, [theme]);

  const handleParsed = (newItems) => {
    setItems((prev) => [...newItems, ...prev]);
  };

  const handleStatusChange = async (id, status) => {
    try {
      await api.updateStatus(id, status);
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status } : item))
      );
      setError(null);
    } catch (e) {
      setError("Could not update item status.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.deleteItem(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
      setError(null);
    } catch (e) {
      setError("Could not delete item.");
    }
  };

  const toggleTheme = () => {
    setTheme((prev) =>
      prev === "light" ? "dark" : prev === "dark" ? "soft" : "light"
    );
  };

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{ backgroundColor: "var(--bg-main)", color: "var(--text-main)" }}
    >
      <header
        className="sticky top-0 z-20 border-b backdrop-blur-md transition-colors duration-300"
        style={{
          backgroundColor: "var(--header-bg)",
          borderColor: "var(--border-main)",
        }}
      >
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="fade-in">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink-800 text-white shadow-sm float-soft">
                  🧠
                </div>
                <div>
                  <p className="font-semibold tracking-tight" style={{ color: "var(--text-strong)" }}>
                    Founder OS
                  </p>
                  <p className="text-[11px] font-mono" style={{ color: "var(--text-muted)" }}>
                    Dotko assignment build
                  </p>
                </div>
              </div>

              <h1
                className="text-2xl md:text-3xl font-semibold tracking-tight"
                style={{ color: "var(--text-strong)" }}
              >
                Turn fragmented founder thinking into structured action.
              </h1>
              <p
                className="mt-2 max-w-2xl text-sm md:text-base leading-relaxed"
                style={{ color: "var(--text-soft)" }}
              >
                Founder OS helps founders convert messy thoughts into tasks, risks,
                reminders, and goals with a lightweight dashboard and learning hub.
              </p>
            </div>

            <div className="fade-in flex items-center gap-3 self-end md:self-start">
              <button
                onClick={toggleTheme}
                className="theme-toggle-btn"
                title="Toggle theme"
              >
                <span className="text-sm">
                  {theme === "light" ? "🌙" : theme === "dark" ? "☀️" : "🌗"}
                </span>
              </button>

              <div className="inline-flex rounded-2xl border border-ink-200 bg-[#ece9e1] p-1 shadow-sm">
                <button
                  onClick={() => setTab("dashboard")}
                  className={`top-toggle ${
                    tab === "dashboard" ? "top-toggle-active" : "top-toggle-inactive"
                  }`}
                >
                  <span className="mr-2">▣</span>
                  Dashboard
                </button>

                <button
                  onClick={() => setTab("learn")}
                  className={`top-toggle ${
                    tab === "learn" ? "top-toggle-active" : "top-toggle-inactive"
                  }`}
                >
                  <span className="mr-2">◎</span>
                  Learning Hub
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {tab === "dashboard" && (
          <div className="mb-6 slide-up">
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1 shadow-sm transition-colors duration-300"
              style={{
                backgroundColor: "var(--surface-card)",
                border: "1px solid var(--border-main)",
              }}
            >
              <span className="h-2 w-2 rounded-full bg-emerald-500 pulse-dot" />
              <span className="text-xs font-mono" style={{ color: "var(--text-soft)" }}>
                Founder productivity system
              </span>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-mono text-red-700 slide-up shadow-sm">
            ⚠ {error}
          </div>
        )}

        {tab === "dashboard" && (
          <>
            <CaptureInput onParsed={handleParsed} />
            {loading ? (
              <div className="mt-10 text-center text-sm font-mono soft-pulse" style={{ color: "var(--text-soft)" }}>
                Loading items...
              </div>
            ) : (
              <Dashboard
                items={items}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
              />
            )}
          </>
        )}

        {tab === "learn" && <LearningHub />}
      </main>

      <footer
        className="max-w-5xl mx-auto px-6 py-6 mt-8 border-t transition-colors duration-300"
        style={{ borderColor: "var(--border-main)" }}
      >
        <p className="text-center text-xs font-mono" style={{ color: "var(--text-muted)" }}>
          Founder OS — built for builders who think in fragments
        </p>
      </footer>
    </div>
  );
}