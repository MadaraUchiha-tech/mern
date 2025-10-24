import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

export const authStore = create((set, get) => ({
  loggedUser: null,
  onlineUsers: [],
  socket: null,
  
  checkAuth: async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No token in localStorage");
        return;
      }
      const res = await axiosInstance.get("/auth/check");
      if (res.data) {
        set({ loggedUser: res.data });
        get().connectSocket();
      }
    } catch (error) {
      console.log("Not authenticated");
      localStorage.removeItem("token");
    }
  },

  signup: async (data) => {
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ loggedUser: res.data });
      // Store token in localStorage for cross-domain requests
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }
      toast.success("Signup successfull");
      get().connectSocket();
    } catch (error) {
      toast.error("Signup failed. Please try again.");
      set({ loggedUser: null });
    }
  },

  login: async (data) => {
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ loggedUser: res.data });
      // Store token in localStorage for cross-domain requests
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }
      toast.success("Login successfull");
      get().connectSocket();
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      toast.error("Login failed. please try again");
      set({ loggedUser: null });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.get("/auth/logout");
      set({ loggedUser: null });
      localStorage.removeItem("token");
      toast.success("Logout successful");
      get().disconnectSocket();
    } catch (error) {
      toast.error("Logout failed. please try again");
    }
  },

  updateProfile: async (data) => {
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ loggedUser: res.data });
      toast.success("Profile updated successfully.");
    } catch (error) {
      toast.error("Updating Profile failed.");
    }
  },

  connectSocket: () => {
    const { loggedUser } = get();
    const socketUrl =
      import.meta.env.VITE_SOCKET_URL ||
      import.meta.env.VITE_API_URL ||
      window.location.origin;
    const socket = io(socketUrl, {
      query: { userId: loggedUser._id },
      withCredentials: true,
    });
    set({ socket: socket });
    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },

  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));