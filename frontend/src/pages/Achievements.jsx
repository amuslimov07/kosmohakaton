import { useEffect, useState } from "react";
import $api from "../http";
import "./VolunteerPages.css";

export default function Achievements() {
  const [achievements, setAchievements] = useState([]);
  const [activity, setActivity] = useState([]);
  const [stats, setStats] = useState({
    educationPoints: 0,
    events: 0,
    cleanedAreas: 0,
    totalPoints: 0,
  });
  useEffect(() => {
    Promise.all([
      $api.get("/achievements"),
      $api.get("/activity"),
      $api.get("/volunteer/stats"),
    ])
      .then(([achievementResponse, activityResponse, statsResponse]) => {
        setAchievements(achievementResponse.data);
        setActivity(activityResponse.data);
        setStats(statsResponse.data);
      })
      .catch(() => {});
  }, []);
  return (
    <main className="volunteer-page">
      <div className="volunteer-shell">
        <div className="page-heading">
          <div>
            <span className="eyebrow">Личный прогресс</span>
            <h1>Достижения и активность</h1>
            <p>
              Ваш путь: обучение → мероприятия → очищенные территории → баллы.
            </p>
          </div>
          <strong className="total-score">{stats.totalPoints} баллов</strong>
        </div>
        <div className="journey">
          <div>
            <strong>{stats.educationPoints}</strong>
            <span>обучение</span>
          </div>
          <i>→</i>
          <div>
            <strong>{stats.events}</strong>
            <span>мероприятия</span>
          </div>
          <i>→</i>
          <div>
            <strong>{stats.cleanedAreas}</strong>
            <span>очищено</span>
          </div>
          <i>→</i>
          <div>
            <strong>{stats.totalPoints}</strong>
            <span>баллы</span>
          </div>
        </div>
        <section className="achievement-section">
          <span className="section-kicker">Коллекция</span>
          <h2>Ваши бейджи</h2>
          <div className="achievement-grid">
            {achievements.map((achievement) => (
              <article
                className={achievement.unlocked ? "unlocked" : "locked"}
                key={achievement.code}
              >
                <strong>{achievement.icon}</strong>
                <h3>{achievement.title}</h3>
                <p>{achievement.description}</p>
                <span>{achievement.unlocked ? "Получен" : "Ещё впереди"}</span>
              </article>
            ))}
          </div>
        </section>
        <section className="activity-section">
          <span className="section-kicker">История</span>
          <h2>История активности</h2>
          {activity.length ? (
            activity.map((item) => (
              <div className="activity-row" key={item.id}>
                <span>
                  {item.type === "education" ? "Обучение" : "Мероприятие"}
                </span>
                <strong>{item.title}</strong>
                <b>+{item.points} баллов</b>
              </div>
            ))
          ) : (
            <p className="empty-state">
              Активность появится после первого урока или записи на мероприятие.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
