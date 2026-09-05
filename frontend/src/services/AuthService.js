import $api from "../http";

export default class AuthService {
  static async login(email, password) {
    return $api.post("/login", { email, password });
  }
  static async registration(email, password, role, employeeSecret) {
    return $api.post("/registration", {
      email,
      password,
      role,
      ...(role === "employee" ? { employeeSecret } : {}),
    });
  }
  static async logout() {
    return $api.post("/logout");
  }
  static async profile() {
    return $api.get("/user/me");
  }
}

export class BonusService {
  static async getBalance() {
    return $api.get("/bonus/balance");
  }

  static async getHistory() {
    return $api.get("/bonus/history");
  }

  static async listRewards() {
    return $api.get("/rewards");
  }

  static async myRewards() {
    return $api.get("/rewards/my");
  }

  static async redeemReward(rewardId) {
    return $api.post(`/rewards/${rewardId}/redeem`);
  }
}
