import { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { BonusService } from "../services/AuthService";

const statusMap = {
  active: "Активна",
  used: "Использована",
  expired: "Истекла",
};

export default function MyRewards() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await BonusService.myRewards();
        setItems(response.data || []);
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <main className="volunteer-page">
        <div className="volunteer-shell">
          <div className="empty-state">Загрузка ваших наград...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="volunteer-page">
      <div className="volunteer-shell bonus-shop-shell">
        <div className="page-heading bonus-shop-header">
          <div>
            <span className="eyebrow">Мои бонусы</span>
            <h1>Мои награды</h1>
            <p>
              Активные и использованные промокоды по всем полученным наградам.
            </p>
          </div>
          <div className="bonus-shop-tabs">
            <NavLink className="bonus-tab-link" to="/rewards">
              Покупка награды
            </NavLink>
            <NavLink className="bonus-tab-link active" to="/my-rewards">
              Мои награды
            </NavLink>
          </div>
        </div>

        <div className="event-cards">
          {items.length ? (
            items.map((item) => (
              <article className="public-event-card bonus-card" key={item.id}>
                <div className="event-card-top">
                  <span className="event-day">
                    {item.partnerName || "Партнёр"}
                  </span>
                  <span className="event-status">
                    {statusMap[item.status] || item.status}
                  </span>
                </div>
                <h2>{item.rewardTitle || "Награда"}</h2>
                <p>Скидка: {item.discountPercent || 0}%</p>
                <div className="event-detail-line">
                  <span>Промокод: {item.promoCode}</span>
                  <span>
                    {new Date(item.redeemedAt).toLocaleDateString("ru-RU")}
                  </span>
                </div>
                <div className="event-detail-line">
                  <span>
                    Срок:{" "}
                    {item.expiresAt
                      ? new Date(item.expiresAt).toLocaleDateString("ru-RU")
                      : "—"}
                  </span>
                  <span>Стоимость: {item.bonusCost}</span>
                </div>
              </article>
            ))
          ) : (
            <div className="empty-state bonus-empty-state">
              Пока нет полученных наград.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
