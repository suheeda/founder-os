import { useState, useEffect } from "react";
import { api } from "../api";
import DictionarySearch from "./DictionarySearch";

const CATEGORY_ORDER = ["Fundraising", "Legal", "Growth", "Product", "Operations"];

function groupByCategory(videos) {
  const grouped = {};
  for (const v of videos) {
    if (!grouped[v.category]) grouped[v.category] = [];
    grouped[v.category].push(v);
  }
  return grouped;
}

export default function LearningHub() {
  const [videos, setVideos] = useState([]);
  const [tab, setTab] = useState("videos");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getVideos()
      .then((data) => {
        setVideos(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const grouped = groupByCategory(videos);
  const categories = CATEGORY_ORDER.filter((c) => grouped[c]);

  return (
    <div className="fade-in">
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/90 border border-ink-100 px-3 py-1 mb-3 shadow-sm">
          <span className="text-xs font-mono text-ink-400">Learning resources</span>
        </div>

        <h2 className="text-xl font-semibold text-ink-800 mb-1">Learning Hub</h2>
        <p className="text-sm text-ink-400 max-w-xl leading-relaxed">
          Curated startup resources and practical definitions for quick decision support.
        </p>
      </div>

      <div className="flex gap-1 mb-6 bg-ink-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setTab("videos")}
          className={
            "px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 " +
            (tab === "videos"
              ? "bg-white text-ink-800 shadow-sm"
              : "text-ink-500 hover:text-ink-700")
          }
        >
          Videos
        </button>
        <button
          onClick={() => setTab("dictionary")}
          className={
            "px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 " +
            (tab === "dictionary"
              ? "bg-white text-ink-800 shadow-sm"
              : "text-ink-500 hover:text-ink-700")
          }
        >
          Founder Dictionary
        </button>
      </div>

      {tab === "videos" && (
        <div>
          {loading ? (
            <p className="text-sm text-ink-300 font-mono soft-pulse">
              Loading videos...
            </p>
          ) : categories.length === 0 ? (
            <p className="text-sm text-ink-300 font-mono">
              No learning resources available.
            </p>
          ) : (
            categories.map((cat) => (
              <div key={cat} className="mb-8">
                <p className="section-title">{cat}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {grouped[cat].map((video) => (
                    <a
                      key={video.id}
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="card block group hover:border-ink-300 no-underline bg-white/95"
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <span className="text-xs font-mono text-ink-300">
                          {video.category}
                        </span>

                        <span className="text-[10px] text-red-500 bg-red-50 px-2 py-0.5 rounded font-mono">
                          YouTube
                        </span>
                      </div>

                      <p className="text-sm font-semibold text-ink-700 group-hover:text-ink-900 leading-snug transition-colors duration-200">
                        {video.title}
                      </p>

                      <p className="text-xs text-ink-400 mt-2 leading-relaxed line-clamp-2">
                        {video.description || "Practical overview for early-stage founders."}
                      </p>
                    </a>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {tab === "dictionary" && <DictionarySearch />}
    </div>
  );
}