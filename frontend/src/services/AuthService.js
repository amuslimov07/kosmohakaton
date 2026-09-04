import $api from "../http";

export default class AuthService {
  static async login(email, password, role) {
    return $api.post("/login", { email, password, role });
  }
  static async registration(email, password, role) {
    return $api.post("/registration", { email, password, role });
  }
  static async logout() {
    return $api.post("/logout");
  }
  static async profile() {
    return $api.get("/user/me");
  }
}
