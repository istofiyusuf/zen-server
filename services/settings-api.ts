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

export const settingsApi = {
  get: () => request("/settings"),

  update: (data: any) =>
    request("/settings", {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  changePassword: (currentPassword: string, newPassword: string) =>
    request("/auth/password", {
      method: "PUT",
      body: JSON.stringify({ currentPassword, newPassword }),
    }),
};
