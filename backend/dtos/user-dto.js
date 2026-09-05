module.exports = class UserDto {
  email;
  id;
  isActivated;
  volunteering;
  bonuses;
  bonusBalance;
  totalEarned;
  totalSpent;
  role;

  constructor(model) {
    this.email = model.email;
    this.id = model._id;
    this.role = model.role || "volunteer";
    this.isActivated = model.isActivated;
    this.volunteering = {
      cleanedCount: model.cleanedCount || 0,
      cleanedDistance: model.cleanedDistance || 0,
      refCount: model.refCount || 0,
      placesCount: model.placesCount || 0,
    };
    this.bonusBalance = Number(model.bonusBalance || 0);
    this.totalEarned = Number(model.totalEarned || 0);
    this.totalSpent = Number(model.totalSpent || 0);
    this.bonuses = this.bonusBalance;
  }
};
