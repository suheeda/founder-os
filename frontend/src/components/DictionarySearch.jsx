import { useState, useEffect } from "react";
import { api } from "../api";

const CATEGORY_STYLES = {
  Legal: "bg-purple-50 text-purple-700 border-purple-200",
  Growth: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Finance: "bg-amber-50 text-amber-700 border-amber-200",
  Fundraising: "bg-blue-50 text-blue-700 border-blue-200",
  Product: "bg-pink-50 text-pink-700 border-pink-200",
  Role: "bg-slate-100 text-slate-700 border-slate-200",
};

function getInitials(term) {
  return term
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function DictionarySearch() {
  const [entries, setEntries] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getDictionary()
      .then((data) => {
        setEntries(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const filtered = query.trim()
    ? entries.filter(
        (e) =>
          e.term.toLowerCase().includes(query.toLowerCase()) ||
          e.definition.toLowerCase().includes(query.toLowerCase()) ||
          (e.category || "").toLowerCase().includes(query.toLowerCase())
      )
    : entries;

  return (
    <div className="fade-in">
      <div className="mb-5 rounded-2xl border border-ink-100 bg-white/95 p-4 shadow-sm">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink-800 text-white shadow-sm">
            📘
          </div>
          <div>
            <h3 className="text-base font-semibold text-ink-900 tracking-tight">
              Founder Dictionary
            </h3>
            <p className="text-xs text-ink-400 leading-relaxed">
              Search startup terms, funding concepts, and founder vocabulary.
            </p>
          </div>
        </div>

        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-ink-300">
            ⌕
          </span>
          <input
            type="text"
            className="input-base pl-10 transition-all duration-300 focus:scale-[1.01]"
            placeholder="Search terms... (ESOP, ARR, Cap Table)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-ink-100 bg-white/90 p-5 shadow-sm">
          <p className="text-sm text-ink-300 font-mono soft-pulse">
            Loading dictionary...
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-ink-200 bg-white/80 p-6 text-center slide-up">
          <p className="text-2xl mb-2">🔎</p>
          <p className="text-sm font-medium text-ink-500">
            No matching terms found
          </p>
          <p className="text-xs text-ink-300 font-mono mt-2">
            Try searching ESOP, ARR, PMF, or Term Sheet.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((entry) => (
            <div key={entry.id} className="card fade-in overflow-hidden">
              <div className="mb-4 h-1 w-full rounded-full bg-gradient-to-r from-ink-200 via-ink-100 to-transparent"></div>

              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ink-100 text-xs font-semibold text-ink-700 shadow-sm">
                  {getInitials(entry.term)}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <p className="text-base font-semibold text-ink-900 tracking-tight">
                      {entry.term}
                    </p>

                    {entry.category ? (
                      <span
                        className={
                          "shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-mono " +
                          (CATEGORY_STYLES[entry.category] ||
                            "bg-slate-100 text-slate-700 border-slate-200")
                        }
                      >
                        {entry.category}
                      </span>
                    ) : null}
                  </div>

                  <p className="text-sm text-ink-600 leading-relaxed">
                    {entry.definition}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-ink-300 font-mono mt-4">
        {filtered.length} of {entries.length} terms
      </p>
    </div>
  );
}