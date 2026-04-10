const BASE_URL = "http://localhost:8000";

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || `HTTP ${res.status}`);
  }

  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return res.json();
  }

  return null;
}

export const api = {
  parseInput: (text) =>
    request("/parse-input", {
      method: "POST",
      body: JSON.stringify({ text }),
    }),

  getItems: () => request("/items"),

  createItem: (item) =>
    request("/items", {
      method: "POST",
      body: JSON.stringify(item),
    }),

  updateStatus: (id, status) =>
    request(`/items/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),

  deleteItem: (id) =>
    request(`/items/${id}`, { method: "DELETE" }),

  getVideos: () => request("/videos"),

  getDictionary: () => request("/dictionary"),

  searchDictionary: (q) =>
    request(`/dictionary/search?q=${encodeURIComponent(q)}`),
};