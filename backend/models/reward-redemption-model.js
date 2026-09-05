const { Schema, model } = require("mongoose");

const RewardRedemptionSchema = new Schema(
  {
    userId: { type: String, required: true },
    rewardId: { type: String, required: true },
    bonusCost: { type: Number, required: true },
    promoCode: { type: String, required: true },
    status: {
      type: String,
      enum: ["active", "used", "expired"],
      default: "active",
    },
    redeemedAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, default: null },
  },
  { timestamps: true },
);

module.exports = model("RewardRedemption", RewardRedemptionSchema);
