import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import $api from "../http";
import "./VolunteerPages.css";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [areas, setAreas] = useState([]);
  const [filters, setFilters] = useState({
    territory: "",
    date: "",
    status: "published",
  });
  const [message, setMessage] = useState("");

  const load = async () => {
    try {
      const response = await $api.get("/events", { params: filters });
      setEvents(response.data);
    } catch {
      setEvents([]);
    }
  };
  useEffect(() => {
    $api
      .get("/territory/areas")
      .then((response) => setAreas(response.data))
      .catch(() => {});
  }, []);
  useEffect(() => {
    const loadEvents = async () => {
      try {
        const response = await $api.get("/events", { params: filters });
        setEvents(response.data);
      } catch {
        setEvents([]);
      }
    };
    loadEvents();
  }, [filters]);
  const register = async (eventId) => {
    try {
      await $api.post(`/events/${eventId}/register`);
      setMessage("Вы записаны. До встречи на территории!");
      load();
    } catch (error) {
      setMessage(error.response?.data?.message || "Не удалось записаться");
    }
  };

  return (
    <main className="volunteer-page">
      <div className="volunteer-shell">
        <div className="page-heading">
          <div>
            <span className="eyebrow">Экологические акции</span>
            <h1>Мероприятия рядом</h1>
            <p>
              Изучите проблемный участок, выберите задачу и присоединитесь к
              команде.
            </p>
          </div>
          <Link className="outline-button" to="/education">
            Пройти обучение
          </Link>
        </div>
        <div className="filters">
          <label>
            Территория
            <select
              value={filters.territory}
              onChange={(event) =>
                setFilters({ ...filters, territory: event.target.value })
              }
            >
              <option value="">Все территории</option>
              {[...new Set(areas.map((area) => area.territory))].map(
                (territory) => (
                  <option value={territory} key={territory}>
                    {territory}
                  </option>
                ),
              )}
            </select>
          </label>
          <label>
            Дата
            <input
              type="date"
              value={filters.date}
              onChange={(event) =>
                setFilters({ ...filters, date: event.target.value })
              }
            />
          </label>
          <label>
            Статус
            <select
              value={filters.status}
              onChange={(event) =>
                setFilters({ ...filters, status: event.target.value })
              }
            >
              <option value="">Все статусы</option>
              <option value="published">Доступно</option>
              <option value="completed">Завершено</option>
            </select>
          </label>
        </div>
        {message && <div className="toast-message">{message}</div>}
        <div className="event-cards">
          {events.map((event) => (
            <article className="public-event-card" key={event.id}>
              <div className="event-card-top">
                <span className="event-day">
                  {new Date(event.date).toLocaleDateString("ru-RU", {
                    day: "2-digit",
                    month: "short",
                  })}
                </span>
                <span className="event-status">
                  {event.volunteersRegistered}/{event.volunteersNeeded} мест
                  занято
                </span>
              </div>
              <span className="section-kicker">{event.territory}</span>
              <h2>{event.title}</h2>
              <p>{event.description}</p>
              <div className="event-detail-line">
                <span>◷ {event.time}</span>
                <span>⌖ {event.task}</span>
              </div>
              <div className="event-card-actions">
                <Link className="outline-button" to={`/events/${event.id}`}>
                  Подробнее
                </Link>
                <button
                  className="primary-button"
                  onClick={() => register(event.id)}
                >
                  Записаться
                </button>
              </div>
            </article>
          ))}
        </div>
        {events.length === 0 && (
          <div className="empty-state">
            По выбранным фильтрам мероприятий нет.
          </div>
        )}
        <section className="dzz-note">
          <span className="section-kicker">Демонстрационные данные MVP</span>
          <h2>Как работает ДЗЗ</h2>
          <p>
            Спутниковые снимки помогают заметить изменения, определить
            приоритетный участок и подготовить работу команды. Сейчас на карте
            используются демонстрационные данные. Реальные спутниковые снимки
            будут подключены на следующем этапе.
          </p>
          <Link to="/" className="text-link">
            Открыть карту участков →
          </Link>
        </section>
      </div>
    </main>
  );
}
