const API_URL = "http://localhost:3001/api/v1";

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: any;
}

class ApiService {
  private token: string | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("zen-token");
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== "undefined") {
      localStorage.setItem("zen-token", token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("zen-token");
    }
  }

  getToken(): string | null {
    return this.token;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
          ...headers,
          ...(options.headers as Record<string, string> || {}),
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Request failed with status ${response.status}`);
      }

      return data;
    } catch (error: any) {
      if (error.name === "TypeError" && error.message === "Failed to fetch") {
        throw new Error("Cannot connect to server. Make sure the backend is running.");
      }
      throw error;
    }
  }

  async register(username: string, email: string, password: string) {
    const response = await this.request<{ user: any; token: string }>(
      "/auth/register",
      {
        method: "POST",
        body: JSON.stringify({ username, email, password }),
      }
    );

    if (response.success && response.data?.token) {
      this.setToken(response.data.token);
    }

    return response;
  }

  async login(username: string, password: string) {
    const response = await this.request<{ user: any; token: string }>(
      "/auth/login",
      {
        method: "POST",
        body: JSON.stringify({ username, password }),
      }
    );

    if (response.success && response.data?.token) {
      this.setToken(response.data.token);
    }

    return response;
  }

  async logout() {
    try {
      await this.request("/auth/logout", { method: "POST" });
    } catch (error) {
      // Tetap clear token meskipun API error
    }
    this.clearToken();
  }

  async getMe() {
    return this.request<{ user: any }>("/auth/me");
  }
}

export const api = new ApiService();
