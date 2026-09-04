import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Context } from "../main";
import AuthService from "../services/AuthService";
import { observer } from "mobx-react-lite";

function Profile() {
  const { store } = useContext(Context);
  const [profile, setProfile] = useState(store.user);
  const [isLoading, setIsLoading] = useState(true);

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
  }, [store]);

  if (isLoading)
    return (
      <main className="profile-page">
        <p>Загрузка профиля...</p>
      </main>
    );

  const volunteering = profile.volunteering || {};
  return (
    <main className="profile-page">
      <section className="profile-card">
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
        <div className="profile-status">
          <span>Статус аккаунта</span>
          <strong>
            {profile.isActivated ? "Подтвержден" : "Ожидает подтверждения"}
          </strong>
        </div>
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
        <div className="bonus-panel">
          <span>Бонусный баланс</span>
          <strong>{profile.bonuses || 0} баллов</strong>
          <small>
            Баллы начисляются за очищенные объекты, километры и участие в
            акциях.
          </small>
        </div>
        <Link className="profile-back" to="/">
          Вернуться к мониторингу
        </Link>
      </section>
    </main>
  );
}

export default observer(Profile);
