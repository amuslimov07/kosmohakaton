import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Context } from "../main";
import AuthService, { BonusService } from "../services/AuthService";
import { observer } from "mobx-react-lite";
import BonusesHistory from "./BonusesHistory";
import "./VolunteerPages.css";

const readCertification = () => {
  try {
    const userId = window.localStorage.getItem("userId");
    return (
      Boolean(userId) &&
      window.localStorage.getItem(`dzz-specialist-certified:${userId}`) ===
        "true"
    );
  } catch {
    return false;
  }
};

function Profile() {
  const { store } = useContext(Context);
  const [profile, setProfile] = useState(store.user);
  const [bonusBalance, setBonusBalance] = useState(profile?.bonusBalance || 0);
  const [isLoading, setIsLoading] = useState(true);
  const isCertified = readCertification();

  useEffect(() => {
    AuthService.profile()
      .then(({ data }) => {
        setProfile(data.user);
        setBonusBalance(data.user?.bonusBalance || 0);
        store.setUser(data.user);
      })
      .catch((error) => {
        if (error.response?.status === 401) {
          store.setAuth(false);
          store.setUser({});
        }
      })
      .finally(() => setIsLoading(false));

    BonusService.getBalance()
      .then(({ data }) => setBonusBalance(data.balance || 0))
      .catch(() => null);
  }, [store]);

  if (isLoading) {
    return (
      <main className="volunteer-page">
        <div className="volunteer-shell">
          <div className="empty-state">Загрузка профиля...</div>
        </div>
      </main>
    );
  }

  const volunteering = profile.volunteering || {};

  return (
    <main className="volunteer-page">
      <div className="volunteer-shell profile-shell">
        <div className="page-heading profile-page-heading">
          <div>
            <span className="eyebrow">Личный кабинет</span>
            <h1>Профиль волонтера</h1>
            <p>{profile.email}</p>
          </div>
          <div className="profile-avatar">
            {profile.email?.[0]?.toUpperCase() || "В"}
          </div>
        </div>

        <section className="profile-overview">
          <div className="profile-status">
            <span>Статус аккаунта</span>
            <strong>
              {profile.isActivated ? "Подтвержден" : "Ожидает подтверждения"}
            </strong>
          </div>

          {isCertified && (
            <div className="certificate-badge">
              <span>🛰️</span>
              <div>
                <strong>Специалист по ДЗЗ</strong>
                <small>Курс ДЗЗ пройден · финальная проверка пройдена</small>
              </div>
            </div>
          )}

          <div className="profile-stats">
            <div>
              <strong>{volunteering.cleanedCount || 0}</strong>
              <span>очищено объектов</span>
            </div>
            <div>
              <strong>{volunteering.cleanedDistance || 0}</strong>
              <span>км очищено</span>
            </div>
            <div>
              <strong>{volunteering.refCount || 0}</strong>
              <span>приглашено друзей</span>
            </div>
            <div>
              <strong>{volunteering.placesCount || 0}</strong>
              <span>участий</span>
            </div>
          </div>

          <div className="bonus-panel">
            <span>Бонусный баланс</span>
            <strong>
              {bonusBalance || profile.bonusBalance || profile.bonuses || 0}{" "}
              бонусов
            </strong>
            <small>
              Заработано: {profile.totalEarned || 0} · Потрачено:{" "}
              {profile.totalSpent || 0}
            </small>
          </div>
        </section>

        <div className="profile-actions">
          <Link className="outline-button" to="/">
            Вернуться к мониторингу
          </Link>
          <Link className="primary-button" to="/education">
            К обучению ДЗЗ
          </Link>
          <Link className="outline-button" to="/rewards">
            Награды
          </Link>
        </div>

        <div className="profile-history">
          <BonusesHistory />
        </div>
      </div>
    </main>
  );
}

export default observer(Profile);
