const API_URL = "http://localhost:3001/api/v1";
const TOKEN_KEY = "zen-token";

function getToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem(TOKEN_KEY);
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

export const websiteApi = {
  list: () => request("/websites"),

  create: (data: {
    name: string;
    domain?: string;
    port: number;
    type: string;
    phpVersion?: string;
    nodeVersion?: string;
    path?: string;
  }) => request("/websites", {
    method: "POST",
    body: JSON.stringify(data),
  }),

  get: (id: string) => request(`/websites/${id}`),

  update: (id: string, data: any) => request(`/websites/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  }),

  delete: (id: string) => request(`/websites/${id}`, {
    method: "DELETE",
  }),

  start: (id: string) => request(`/websites/${id}/start`, {
    method: "POST",
  }),

  stop: (id: string) => request(`/websites/${id}/stop`, {
    method: "POST",
  }),

  getLogs: (id: string) => request(`/websites/${id}/logs`),
};
