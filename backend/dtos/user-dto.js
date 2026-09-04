module.exports = class UserDto {
  email;
  id;
  isActivated;
  volunteering;
  bonuses;
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
    this.bonuses =
      this.volunteering.cleanedCount * 50 +
      this.volunteering.cleanedDistance * 10 +
      this.volunteering.refCount * 25 +
      this.volunteering.placesCount * 100;
  }
};
