import { makeAutoObservable } from "mobx";
import AuthService from "../services/AuthService";
import axios from "axios";
import { API_URL } from "../http";
export default class Store {
  user = {};
  isAuth = false;
  isLoading = false;

  constructor() {
    makeAutoObservable(this);
  }
  setAuth(bool) {
    this.isAuth = bool;
  }
  setUser(user) {
    this.user = user;
  }
  setIsLoading(bool) {
    this.isLoading = bool;
  }

  async login(email, password, role) {
    try {
      const response = await AuthService.login(email, password, role);
      localStorage.setItem("token", response.data.accessToken);
      this.setAuth(true);
      this.setUser(response.data.user);
      return { success: true };
    } catch (e) {
      return {
        success: false,
        message: e.response?.data?.message || "Не удалось войти в аккаунт",
      };
    }
  }
  async registration(email, password, role) {
    try {
      const response = await AuthService.registration(email, password, role);
      localStorage.setItem("token", response.data.accessToken);
      this.setAuth(true);
      this.setUser(response.data.user);
      return { success: true };
    } catch (e) {
      return {
        success: false,
        message: e.response?.data?.message || "Не удалось создать аккаунт",
      };
    }
  }
  async logout() {
    try {
      const response = await AuthService.logout();
      localStorage.removeItem("token");
      this.setAuth(false);
      this.setUser({});
      console.log(response);
    } catch (e) {
      if (e.response?.status !== 401) {
        console.error(e.response?.data?.message || "Ошибка выхода");
      }
    }
  }

  async checkAuth() {
    this.setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/refresh`, {
        withCredentials: true,
      });
      localStorage.setItem("token", response.data.accessToken);
      this.setAuth(true);
      this.setUser(response.data.user);
    } catch (e) {
      if (e.response?.status !== 401) {
        console.error(
          e.response?.data?.message || "Ошибка проверки авторизации",
        );
      }
    } finally {
      this.setIsLoading(false);
    }
  }
}
