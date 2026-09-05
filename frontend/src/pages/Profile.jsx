import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Context } from "../main";
import AuthService from "../services/AuthService";
import { observer } from "mobx-react-lite";

const readCertification = () => {
  try {
    return window.localStorage.getItem("dzz-specialist-certified") === "true";
  } catch {
    return false;
  }
};

function Profile() {
  const { store } = useContext(Context);
  const [profile, setProfile] = useState(store.user);
  const [isLoading, setIsLoading] = useState(true);
  const [isCertified, setIsCertified] = useState(readCertification());

  useEffect(() => {
    AuthService.profile()
      .then(({ data }) => {
        setProfile(data.user);
        store.setUser(data.user);
      })
      .catch((error) => {
        if (error.response?.status === 401) {
          store.setAuth(false);
          store.setUser({});
        }
      })
      .finally(() => setIsLoading(false));

    setIsCertified(readCertification());
  }, [store]);

  if (isLoading)
    return (
      <main className="profile-page">
        <p>Загрузка профиля...</p>
      </main>
    );

  const volunteering = profile.volunteering || {};
  return (
    <main className="profile-page profile-page-light">
      <section className="profile-card profile-card-light">
        <div className="eyebrow">Личный кабинет</div>
        <div className="profile-heading">
          <div className="profile-avatar">
            {profile.email?.[0]?.toUpperCase() || "В"}
          </div>
          <div>
            <h1>Профиль волонтера</h1>
            <p>{profile.email}</p>
          </div>
        </div>

        <div className="profile-status profile-status-light">
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
            <strong>{volunteering.cleanedCount}</strong>
            <span>очищено объектов</span>
          </div>
          <div>
            <strong>{volunteering.cleanedDistance}</strong>
            <span>км очищено</span>
          </div>
          <div>
            <strong>{volunteering.refCount}</strong>
            <span>приглашено друзей</span>
          </div>
          <div>
            <strong>{volunteering.placesCount}</strong>
            <span>участий</span>
          </div>
        </div>
        <div className="bonus-panel bonus-panel-light">
          <span>Бонусный баланс</span>
          <strong>{profile.bonuses || 0} баллов</strong>
          <small>
            Баллы начисляются за очищенные объекты, километры и участие в
            акциях.
          </small>
        </div>
        <div className="profile-actions">
          <Link className="profile-back" to="/">
            Вернуться к мониторингу
          </Link>
          <Link className="profile-back accent" to="/education">
            К обучению ДЗЗ
          </Link>
        </div>
      </section>
    </main>
  );
}

export default observer(Profile);
