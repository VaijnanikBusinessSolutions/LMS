// src/utils/loginApi.ts

import { API_ENDPOINTS } from "../constants/api";
import type { LoginRequest, LoginResponse } from "../constants/types";


export const authAPI = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    console.log("Making login request to:", `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.LOGIN}`);
    console.log("Request payload:", credentials);

    try {
      const response = await fetch(`${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.LOGIN}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        mode: "cors",
        body: JSON.stringify(credentials),
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);

        try {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.message || errorData.error || `HTTP ${response.status}: ${response.statusText}`);
        } catch (parseError) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      }

      const data = await response.json();
      console.log("Login response:", data);
      // === ADD THESE LINES HERE ===
      if (data.access_token) {
        localStorage.setItem('access_token', data.access_token);
        console.log("Access token saved to localStorage");
      }
      if (data.refresh_token) {
        localStorage.setItem('refresh_token', data.refresh_token);
        console.log("Refresh token saved to localStorage");
      }
      // ============================
      return data;
    } catch (error) {
      console.error("Network error during login:", error);

      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error("Unable to connect to server. Please check if the backend is running.");
      }

      throw error;
    }
  },

  logout: async (refreshToken: string, accessToken: string): Promise<{ message: string; success: boolean }> => {
    const response = await fetch(`${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.LOGOUT}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      mode: "cors",
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
    // === ALWAYS CLEAR STORAGE ON LOGOUT ===
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || errorData.error || "Logout failed");
    }

    return await response.json();
  },
};
