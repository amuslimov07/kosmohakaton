const UserModel = require("../models/user-model");
const EventRegistrationModel = require("../models/event-registration-model");
const BonusTransactionModel = require("../models/bonus-transaction-model");
const RewardModel = require("../models/reward-model");
const RewardRedemptionModel = require("../models/reward-redemption-model");
const ApiError = require("../exceptions/api-error");
const {
  PARTICIPATION_BONUS,
  BONUS_TRANSACTION_TYPES,
} = require("../config/bonus-config");

const demoRewards = [
  {
    id: "demo-reward-eco-15",
    title: "Скидка 15% на заказ",
    description: "Скидка на экологичные товары и наборы для дома.",
    partnerName: "EcoMarket",
    partnerLogo: "🌿",
    bonusCost: 1000,
    discountPercent: 15,
    promoCode: "ECO-15",
    image: "",
    isActive: true,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 45).toISOString(),
    demoPartner: "DemoPartner",
  },
  {
    id: "demo-reward-green-20",
    title: "Скидка 20% на товары",
    description: "Персональная скидка на товары GreenStore.",
    partnerName: "GreenStore",
    partnerLogo: "♻️",
    bonusCost: 1500,
    discountPercent: 20,
    promoCode: "GREEN-20",
    image: "",
    isActive: true,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 60).toISOString(),
    demoPartner: "DemoPartner",
  },
  {
    id: "demo-reward-eco-brand",
    title: "Бесплатный экологичный товар",
    description: "Подарочный набор eco-продуктов от EcoBrand.",
    partnerName: "EcoBrand",
    partnerLogo: "🌱",
    bonusCost: 2000,
    discountPercent: 100,
    promoCode: "ECO-BRAND",
    image: "",
    isActive: true,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 90).toISOString(),
    demoPartner: "DemoPartner",
  },
];

const buildUserBalance = (user) => ({
  balance: Number(user.bonusBalance || 0),
  totalEarned: Number(user.totalEarned || 0),
  totalSpent: Number(user.totalSpent || 0),
});

const generatePromoCode = () => {
  const randomPart = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `ECO-${randomPart}`;
};

const normalizeReward = (reward) => ({
  id: reward._id ? String(reward._id) : reward.id,
  title: reward.title,
  description: reward.description,
  partnerName: reward.partnerName,
  partnerLogo: reward.partnerLogo,
  bonusCost: Number(reward.bonusCost || 0),
  discountPercent: Number(reward.discountPercent || 0),
  promoCode: reward.promoCode || "",
  image: reward.image || "",
  isActive: reward.isActive !== false,
  expiresAt: reward.expiresAt ? new Date(reward.expiresAt).toISOString() : null,
  demoPartner: reward.demoPartner || "DemoPartner",
  createdAt: reward.createdAt,
  updatedAt: reward.updatedAt,
});

const getDemoRewards = async () => {
  const savedRewards = await RewardModel.find({}).lean();
  if (savedRewards.length > 0) {
    return savedRewards.map(normalizeReward);
  }

  const created = await RewardModel.insertMany(
    demoRewards.map((reward) => ({
      ...reward,
      _id: reward.id,
      promoCode: reward.promoCode,
      expiresAt: reward.expiresAt,
    })),
  );

  return created.map(normalizeReward);
};

class BonusController {
  async listRewards(req, res, next) {
    try {
      const rewards = await getDemoRewards();
      return res.json(rewards);
    } catch (error) {
      next(error);
    }
  }

  async getReward(req, res, next) {
    try {
      const reward = await RewardModel.findOne({ _id: req.params.id }).lean();
      if (!reward) {
        return next(ApiError.BadRequest("Награда не найдена"));
      }
      return res.json(normalizeReward(reward));
    } catch (error) {
      next(error);
    }
  }

  async getBalance(req, res, next) {
    try {
      const user = await UserModel.findById(req.user.id);
      if (!user) {
        return next(ApiError.UnauthorizedError());
      }
      return res.json({
        userId: String(user._id),
        ...buildUserBalance(user),
      });
    } catch (error) {
      next(error);
    }
  }

  async getHistory(req, res, next) {
    try {
      const transactions = await BonusTransactionModel.find({
        userId: req.user.id,
      })
        .sort({ createdAt: -1 })
        .lean();
      return res.json(
        transactions.map((t) => ({
          id: String(t._id),
          userId: String(t.userId),
          amount: Number(t.amount || 0),
          type: t.type,
          description: t.description,
          eventId: t.eventId || null,
          rewardId: t.rewardId ? String(t.rewardId) : null,
          createdAt: t.createdAt,
        })),
      );
    } catch (error) {
      next(error);
    }
  }

  async listEventParticipants(req, res, next) {
    try {
      const registrations = await EventRegistrationModel.find({
        eventId: req.params.eventId,
      })
        .populate("user", "email role")
        .sort({ createdAt: -1 })
        .lean();
      return res.json(
        registrations.map((item) => ({
          id: String(item._id),
          userId: String(item.user?._id || item.user),
          email: item.user?.email || "",
          status: item.status,
          bonusPoints: Number(item.bonusPoints || 0),
          confirmedAt: item.confirmedAt,
          createdAt: item.createdAt,
        })),
      );
    } catch (error) {
      next(error);
    }
  }

  async confirmParticipation(req, res, next) {
    try {
      const { eventId, userId } = req.params;
      const user = await UserModel.findById(userId);
      if (!user) {
        return next(ApiError.BadRequest("Пользователь не найден"));
      }

      const registration = await EventRegistrationModel.findOne({
        eventId,
        user: userId,
      });
      if (!registration) {
        return next(
          ApiError.BadRequest("Пользователь не зарегистрирован на мероприятие"),
        );
      }

      if (registration.status === "confirmed") {
        return res.json({
          message: "Участие уже подтверждено",
          registration,
          bonusGranted: false,
          bonusAmount: 0,
        });
      }

      if (registration.status === "absent") {
        return res.json({
          message: "Участие отмечено как отсутствующее",
          registration,
          bonusGranted: false,
          bonusAmount: 0,
        });
      }

      const confirmedRegistration =
        await EventRegistrationModel.findOneAndUpdate(
          {
            _id: registration._id,
            status: { $in: ["registered", "attended"] },
            bonusPoints: 0,
          },
          {
            $set: {
              status: "confirmed",
              confirmedAt: new Date(),
              bonusPoints: PARTICIPATION_BONUS,
            },
          },
          { new: true },
        );
      if (!confirmedRegistration) {
        return res.json({
          message: "Участие уже подтверждено",
          registration,
          bonusGranted: false,
          bonusAmount: 0,
        });
      }

      const bonusAmount = PARTICIPATION_BONUS;
      try {
        await BonusTransactionModel.create({
          userId: String(user._id),
          amount: bonusAmount,
          type: BONUS_TRANSACTION_TYPES.EVENT_PARTICIPATION,
          description: "Участие в экологическом мероприятии",
          eventId,
          dedupeKey: `${user._id}:${eventId}:event_participation`,
          createdAt: new Date(),
        });
        await UserModel.updateOne(
          { _id: user._id },
          { $inc: { bonusBalance: bonusAmount, totalEarned: bonusAmount } },
        );
      } catch (error) {
        if (error?.code !== 11000) throw error;
      }
      const updatedUser = await UserModel.findById(user._id);

      return res.json({
        message: "Участие подтверждено",
        bonusGranted: true,
        bonusAmount,
        registration,
        balance: buildUserBalance(updatedUser),
      });
    } catch (error) {
      next(error);
    }
  }

  async redeemReward(req, res, next) {
    try {
      const reward = await RewardModel.findById(req.params.id);
      if (!reward) {
        return next(ApiError.BadRequest("Награда не найдена"));
      }
      if (!reward.isActive) {
        return next(ApiError.BadRequest("Награда неактивна"));
      }

      const user = await UserModel.findById(req.user.id);
      if (!user) {
        return next(ApiError.UnauthorizedError());
      }

      if (Number(user.bonusBalance || 0) < Number(reward.bonusCost || 0)) {
        return next(ApiError.BadRequest("Недостаточно бонусов"));
      }

      user.bonusBalance =
        Number(user.bonusBalance || 0) - Number(reward.bonusCost || 0);
      user.totalSpent =
        Number(user.totalSpent || 0) + Number(reward.bonusCost || 0);
      await user.save();

      const redemption = await RewardRedemptionModel.create({
        userId: String(user._id),
        rewardId: String(reward._id),
        bonusCost: Number(reward.bonusCost || 0),
        promoCode: reward.promoCode || generatePromoCode(),
        status: "active",
        redeemedAt: new Date(),
        expiresAt:
          reward.expiresAt || new Date(Date.now() + 1000 * 60 * 60 * 24 * 60),
      });

      await BonusTransactionModel.create({
        userId: String(user._id),
        amount: -Number(reward.bonusCost || 0),
        type: BONUS_TRANSACTION_TYPES.BONUS_SPEND,
        description: `Получение награды ${reward.title}`,
        rewardId: String(reward._id),
        createdAt: new Date(),
      });

      return res.status(201).json({
        message: "Награда получена",
        reward: normalizeReward(reward),
        redemption: {
          id: String(redemption._id),
          userId: String(redemption.userId),
          rewardId: String(redemption.rewardId),
          bonusCost: Number(redemption.bonusCost || 0),
          promoCode: redemption.promoCode,
          status: redemption.status,
          redeemedAt: redemption.redeemedAt,
          expiresAt: redemption.expiresAt,
        },
        balance: buildUserBalance(user),
      });
    } catch (error) {
      next(error);
    }
  }

  async myRewards(req, res, next) {
    try {
      const redemptions = await RewardRedemptionModel.find({
        userId: req.user.id,
      })
        .populate("rewardId")
        .sort({ redeemedAt: -1 })
        .lean();

      return res.json(
        redemptions.map((item) => ({
          id: String(item._id),
          userId: String(item.userId),
          rewardId: String(item.rewardId?._id || item.rewardId),
          rewardTitle: item.rewardId?.title || "Награда",
          partnerName: item.rewardId?.partnerName || "Партнёр",
          discountPercent: Number(item.rewardId?.discountPercent || 0),
          bonusCost: Number(item.bonusCost || 0),
          promoCode: item.promoCode,
          status: item.status,
          redeemedAt: item.redeemedAt,
          expiresAt: item.expiresAt,
        })),
      );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new BonusController();
