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
    throw new Error(data.message || data.output || "Request failed");
  }

  return data;
}

export const terminalApi = {
  exec: (command: string, cwd?: string): Promise<any> =>
    request("/terminal/exec", {
      method: "POST",
      body: JSON.stringify({ command, cwd }),
    }),

  cd: (path: string, cwd?: string): Promise<any> =>
    request("/terminal/cd", {
      method: "POST",
      body: JSON.stringify({ path, cwd }),
    }),

  pwd: (): Promise<any> => request("/terminal/pwd"),
};
