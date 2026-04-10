import { useState } from "react";
import { api } from "../api";

const EXAMPLE =
  "Need to finalize vendor agreement, gym from tomorrow, investor follow-up Friday, confused about ESOP structure";

export default function CaptureInput({ onParsed }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleParse = async () => {
    if (!text.trim()) {
      setFeedback({
        type: "error",
        msg: "Please enter some text before parsing",
      });
      return;
    }

    setLoading(true);
    setFeedback(null);

    try {
      const items = await api.parseInput(text.trim());
      onParsed(items);
      setFeedback({
        type: "success",
        msg:
          "Parsed and saved successfully. " +
          items.length +
          " item" +
          (items.length !== 1 ? "s" : "") +
          " created.",
      });
      setText("");
    } catch (e) {
      setFeedback({
        type: "error",
        msg: "Could not connect to backend",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      handleParse();
    }
  };

  return (
    <div className="mb-8 rounded-2xl border border-ink-100 bg-white/95 p-5 shadow-sm fade-in">
      <div className="mb-3 flex items-start justify-between gap-4">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-ink-100 bg-ink-50 px-3 py-1">
            <span className="h-2 w-2 rounded-full bg-ink-400 pulse-dot" />
            <span className="text-[11px] font-mono text-ink-400">
              Quick capture
            </span>
          </div>

          <p className="text-sm font-medium text-ink-700">Capture Founder Input</p>
          <p className="mt-1 max-w-2xl text-xs leading-relaxed text-ink-400">
            Paste raw founder thoughts, messy notes, follow-ups, or concerns.
            Founder OS will classify them into structured items.
          </p>
        </div>

        <button
          className="rounded-lg border border-ink-200 bg-ink-50 px-3 py-1.5 text-xs font-mono text-ink-400 transition-all duration-200 hover:border-ink-300 hover:bg-white hover:text-ink-600"
          onClick={() => {
            setText(EXAMPLE);
            setFeedback(null);
          }}
        >
          Try Sample Input
        </button>
      </div>

      <div className="rounded-2xl border border-ink-100 bg-[#f8f7f3] p-3 transition-all duration-200 focus-within:border-ink-300 focus-within:shadow-sm">
        <textarea
          className="min-h-[110px] w-full resize-none rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm leading-relaxed text-ink-800 placeholder:text-ink-300 focus:outline-none focus:border-ink-400 focus:ring-2 focus:ring-ink-100 transition-all duration-200"
          placeholder="Dump your thoughts here - tasks, risks, goals, reminders. Separate with commas."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <div className="mt-3 flex items-center justify-between gap-4">
          <span className="text-xs font-mono text-ink-300">
            Cmd + Enter to parse
          </span>

          <div className="flex items-center gap-3">
            {feedback && (
              <span
                className={
                  "text-xs font-mono slide-up " +
                  (feedback.type === "success" ? "text-green-600" : "text-red-500")
                }
              >
                {feedback.type === "success" ? "✓ " : "✗ "}
                {feedback.msg}
              </span>
            )}

            <button
              className="btn-primary"
              onClick={handleParse}
              disabled={loading || !text.trim()}
            >
              {loading ? "Parsing..." : "Structure Input"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}