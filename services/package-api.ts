const API_URL = "http://localhost:3001/api/v1";

function getToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("zen-token");
  }
  return null;
}

async function request(endpoint: string, options: RequestInit = {}) {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

export const packageApi = {
  getInstalled: () => request("/packages/installed"),

  search: (query: string) => request(`/packages/search?q=${encodeURIComponent(query)}`),

  install: (name: string) =>
    request("/packages/install", {
      method: "POST",
      body: JSON.stringify({ name }),
    }),

  remove: (name: string) =>
    request("/packages/remove", {
      method: "POST",
      body: JSON.stringify({ name }),
    }),
};
