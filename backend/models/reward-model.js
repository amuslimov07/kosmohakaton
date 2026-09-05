const { Schema, model } = require("mongoose");

const RewardSchema = new Schema(
  {
    _id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    partnerName: { type: String, required: true },
    partnerLogo: { type: String, default: "" },
    bonusCost: { type: Number, required: true },
    discountPercent: { type: Number, default: 0 },
    promoCode: { type: String, default: "" },
    image: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
    expiresAt: { type: Date, default: null },
    demoPartner: { type: String, default: "DemoPartner" },
  },
  { timestamps: true },
);

module.exports = model("Reward", RewardSchema);
