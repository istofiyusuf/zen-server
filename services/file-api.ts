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

export const fileApi = {
  list: (dirPath?: string) =>
    request(`/files/list?path=${encodeURIComponent(dirPath || "./")}`),

  readFile: (filePath: string) =>
    request(`/files/read?file=${encodeURIComponent(filePath)}`),

  createFolder: (basePath: string, folderName: string) =>
    request("/files/mkdir", {
      method: "POST",
      body: JSON.stringify({ basePath, folderName }),
    }),

  delete: (targetPath: string) =>
    request("/files/delete", {
      method: "DELETE",
      body: JSON.stringify({ path: targetPath }),
    }),

  rename: (oldPath: string, newName: string) =>
    request("/files/rename", {
      method: "POST",
      body: JSON.stringify({ oldPath, newName }),
    }),
};
