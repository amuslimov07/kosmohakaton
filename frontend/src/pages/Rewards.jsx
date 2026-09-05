import { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { BonusService } from "../services/AuthService";

export default function Rewards() {
  const [rewards, setRewards] = useState([]);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const [rewardsResponse, balanceResponse] = await Promise.all([
        BonusService.listRewards(),
        BonusService.getBalance(),
      ]);
      setRewards(rewardsResponse.data || []);
      setBalance(balanceResponse.data?.balance || 0);
      setMessage("");
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Не удалось загрузить награды",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const redeem = async (rewardId) => {
    try {
      const response = await BonusService.redeemReward(rewardId);
      setMessage(
        `Награда получена! Промокод: ${response.data.redemption.promoCode}`,
      );
      await load();
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Не удалось получить награду",
      );
    }
  };

  if (loading) {
    return (
      <main className="volunteer-page">
        <div className="volunteer-shell">
          <div className="empty-state">Загрузка наград...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="volunteer-page">
      <div className="volunteer-shell bonus-shop-shell">
        <div className="page-heading bonus-shop-header">
          <div>
            <span className="eyebrow">Бонусная программа</span>
            <h1>Магазин Бонусов</h1>
            <p>
              Обменивайте накопленные бонусы на реальные преимущества от
              партнёров.
            </p>
          </div>
          <div className="bonus-shop-tabs">
            <NavLink className="bonus-tab-link active" to="/rewards">
              Покупка награды
            </NavLink>
            <NavLink className="bonus-tab-link" to="/my-rewards">
              Мои награды
            </NavLink>
          </div>
        </div>

        <section className="bonus-summary-box">
          <div className="bonus-summary-main">
            <span>Баланс</span>
            <strong>{balance}</strong>
            <small>бонусов доступно</small>
          </div>
          <Link className="outline-button" to="/my-rewards">
            Посмотреть мои награды
          </Link>
        </section>

        {message && <div className="toast-message">{message}</div>}

        <div className="event-cards">
          {rewards.map((reward) => {
            const affordable = balance >= reward.bonusCost;
            return (
              <article className="public-event-card bonus-card" key={reward.id}>
                <div className="event-card-top">
                  <span className="event-day">{reward.partnerLogo || "★"}</span>
                  <span className="event-status">{reward.partnerName}</span>
                </div>
                <span className="section-kicker">
                  {reward.demoPartner || "DemoPartner"}
                </span>
                <h2>{reward.title}</h2>
                <p>{reward.description}</p>
                <div className="event-detail-line">
                  <span>💰 {reward.bonusCost} бонусов</span>
                  <span>🎁 Скидка {reward.discountPercent}%</span>
                </div>
                <div className="event-card-actions">
                  <button
                    className="primary-button"
                    disabled={!affordable}
                    onClick={() => redeem(reward.id)}
                    style={{ opacity: affordable ? 1 : 0.5 }}
                  >
                    {affordable ? "Получить" : "Недостаточно бонусов"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {rewards.length === 0 && (
          <div className="empty-state">Сейчас нет доступных наград.</div>
        )}
      </div>
    </main>
  );
}
