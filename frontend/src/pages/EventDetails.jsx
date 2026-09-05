import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import $api from "../http";
import "./VolunteerPages.css";

export default function EventDetails() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [area, setArea] = useState(null);
  const [message, setMessage] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  useEffect(() => {
    Promise.all([$api.get(`/events/${eventId}`), $api.get("/territory/areas")])
      .then(([eventResponse, areasResponse]) => {
        setEvent(eventResponse.data);
        setArea(
          areasResponse.data.find(
            (item) => item.id === eventResponse.data.areaId,
          ),
        );
      })
      .catch(() => {});
  }, [eventId]);
  if (!event)
    return (
      <main className="volunteer-page">
        <div className="empty-state">Загрузка мероприятия...</div>
      </main>
    );
  const register = async () => {
    if (isRegistering || event.isRegistered) return;
    setIsRegistering(true);
    try {
      await $api.post(`/events/${event.id}/register`);
      setMessage("Вы записаны на мероприятие");
      setEvent({
        ...event,
        volunteersRegistered: event.volunteersRegistered + 1,
        isRegistered: true,
      });
    } catch (error) {
      setMessage(error.response?.data?.message || "Не удалось записаться");
    } finally {
      setIsRegistering(false);
    }
  };
  return (
    <main className="volunteer-page">
      <div className="volunteer-shell detail-shell">
        <Link className="text-link" to="/events">
          ← Все мероприятия
        </Link>
        <div className="detail-hero">
          <span className="section-kicker">{event.territory}</span>
          <h1>{event.title}</h1>
          <p>{event.description}</p>
          <div className="detail-meta">
            <span>
              ◷ {event.date} в {event.time}
            </span>
            <span>
              ◎ {event.volunteersRegistered} из {event.volunteersNeeded}{" "}
              участников
            </span>
          </div>
        </div>
        <div className="detail-grid">
          <section className="detail-content">
            <span className="section-kicker">Задача</span>
            <h2>Что будем делать</h2>
            <p>{event.task}</p>
            <span className="section-kicker">Связанный проблемный участок</span>
            {area && (
              <div className={`linked-area problem-${area.problemType}`}>
                <div>
                  <strong>{area.name}</strong>
                  <span>
                    {area.type} · {area.coordinates}
                  </span>
                </div>
                <Link to="/" className="text-link">
                  Открыть на карте →
                </Link>
              </div>
            )}
            <div className="dzz-note compact">
              <span className="section-kicker">
                Демонстрационные данные MVP
              </span>
              <p>
                Связь участка и мероприятия построена на демонстрационных данных
                ДЗЗ. Реальные снимки будут подключены на следующем этапе.
              </p>
            </div>
          </section>
          <aside className="signup-panel">
            <span className="section-kicker">Ваше участие</span>
            <strong>
              {event.volunteersNeeded - event.volunteersRegistered}
            </strong>
            <span>свободных мест</span>
            <button
              className="primary-button"
              disabled={isRegistering || event.isRegistered}
              onClick={register}
            >
              {event.isRegistered
                ? "Вы записаны"
                : isRegistering
                  ? "Записываем..."
                  : "Записаться на акцию"}
            </button>
            {message && <p className="quiz-message">{message}</p>}
          </aside>
        </div>
      </div>
    </main>
  );
}
