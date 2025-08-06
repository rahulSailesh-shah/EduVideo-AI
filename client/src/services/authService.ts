interface TokenResponse {
  access_token: string;
  token_type: string;
}

interface RefreshResponse {
  message: string;
  expires_in: number;
}

class AuthService {
  private baseUrl = "http://localhost:8000/api";

  async login(username: string, password: string): Promise<TokenResponse> {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);

    const response = await fetch(`${this.baseUrl}/auth/login`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    return response.json();
  }

  async googleAuth(code: string, redirectUri: string): Promise<TokenResponse> {
    const response = await fetch(`${this.baseUrl}/auth/google`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code,
        redirect_uri: redirectUri,
      }),
    });

    if (!response.ok) {
      throw new Error("Google authentication failed");
    }

    return response.json();
  }

  async refreshGoogleToken(token: string): Promise<RefreshResponse> {
    const response = await fetch(`${this.baseUrl}/auth/google/refresh`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to refresh Google token");
    }

    return response.json();
  }

  async getUserInfo(token: string) {
    const response = await fetch(`${this.baseUrl}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to get user info");
    }

    return response.json();
  }

  async makeAuthenticatedRequest(url: string, options: RequestInit = {}) {
    const token = localStorage.getItem("auth_token");

    if (!token) {
      throw new Error("No authentication token");
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    });

    // Handle token expiration
    if (response.status === 401) {
      // Clear expired tokens
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");

      // Redirect to login
      window.location.href = "/";
      throw new Error("Authentication expired. Please login again.");
    }

    return response;
  }

  // Check if JWT token is expired
  isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch {
      return true;
    }
  }

  // Get token expiration time
  getTokenExpiration(token: string): Date | null {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return new Date(payload.exp * 1000);
    } catch {
      return null;
    }
  }
}

export const authService = new AuthService();
