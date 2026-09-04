import { useEffect, useState } from "react";
import $api from "../http";
import "./TerritoryDashboard.css";

const demo = {
  stats: {
    totalAreas: 3,
    attentionAreas: 2,
    activeEvents: 2,
    completedEvents: 5,
    volunteers: 42,
    cleanedArea: 4.8,
  },
  areas: [
    {
      id: "area-1",
      name: "Черноморский сектор А",
      type: "Мазутное пятно",
      status: "attention",
      level: "Высокий",
      coordinates: "44.605, 33.522",
      area: 2.4,
      updatedAt: "Сегодня, 09:40",
    },
    {
      id: "area-2",
      name: "Балтийская коса Б",
      type: "Пластик",
      status: "event",
      level: "Средний",
      coordinates: "54.639, 19.976",
      area: 1.1,
      updatedAt: "Вчера, 16:20",
    },
    {
      id: "area-3",
      name: "Тихоокеанский лиман Г",
      type: "Нет аномалий",
      status: "clean",
      level: "Норма",
      coordinates: "43.115, 131.885",
      area: 4.8,
      updatedAt: "12.09.2026",
    },
  ],
  events: [
    {
      id: "event-1",
      areaId: "area-1",
      title: "Очистка Черноморского сектора",
      date: "15.09.2026",
      time: "09:00",
      volunteersNeeded: 24,
      volunteersRegistered: 18,
      status: "published",
      description: "Сбор мазута и вывоз загрязнённого грунта.",
    },
    {
      id: "event-2",
      areaId: "area-2",
      title: "Сбор пластика на косе",
      date: "18.09.2026",
      time: "10:30",
      volunteersNeeded: 12,
      volunteersRegistered: 7,
      status: "published",
      description: "Раздельный сбор и сортировка отходов.",
    },
  ],
  volunteers: [
    {
      id: "vol-1",
      name: "Анна Петрова",
      eventId: "event-1",
      status: "confirmed",
      attended: true,
      bonusStatus: "Начислено",
    },
    {
      id: "vol-2",
      name: "Илья Смирнов",
      eventId: "event-1",
      status: "pending",
      attended: false,
      bonusStatus: "Ожидает",
    },
    {
      id: "vol-3",
      name: "Мария Волкова",
      eventId: "event-2",
      status: "confirmed",
      attended: false,
      bonusStatus: "Ожидает",
    },
  ],
};

const statusLabels = {
  attention: "Требует внимания",
  event: "Мероприятие создано",
  clean: "Очищен",
};

export default function TerritoryDashboard() {
  const [data, setData] = useState(demo);
  const [tab, setTab] = useState("overview");
  const [selectedArea, setSelectedArea] = useState(demo.areas[0]);
  const [showEventForm, setShowEventForm] = useState(false);
  const [eventForm, setEventForm] = useState({
    title: "",
    date: "",
    time: "09:00",
    volunteersNeeded: 10,
    description: "",
  });

  const reload = async () => {
    try {
      const response = await $api.get("/territory/dashboard");
      setData(response.data);
      setSelectedArea(response.data.areas[0]);
    } catch {
      setData(demo);
    }
  };

  useEffect(() => {
    const loadDashboard = async () => {
      await reload();
    };
    loadDashboard();
  }, []);

  const updateArea = async (area, status) => {
    const updated = { ...area, status };
    setData((current) => ({
      ...current,
      areas: current.areas.map((item) =>
        item.id === area.id ? updated : item,
      ),
    }));
    setSelectedArea(updated);
    try {
      await $api.patch(`/territory/areas/${area.id}`, { status });
    } catch {
      /* demo mode */
    }
  };

  const createEvent = async (event) => {
    const payload = { ...event, areaId: selectedArea.id };
    try {
      const response = await $api.post("/territory/events", payload);
      setData((current) => ({
        ...current,
        events: [response.data, ...current.events],
      }));
    } catch {
      setData((current) => ({
        ...current,
        events: [
          {
            ...payload,
            id: `local-${Date.now()}`,
            status: "published",
            volunteersRegistered: 0,
          },
          ...current.events,
        ],
      }));
    }
    setShowEventForm(false);
    setEventForm({
      title: "",
      date: "",
      time: "09:00",
      volunteersNeeded: 10,
      description: "",
    });
  };

  const updateVolunteer = async (volunteer, patch) => {
    const updated = { ...volunteer, ...patch };
    setData((current) => ({
      ...current,
      volunteers: current.volunteers.map((item) =>
        item.id === volunteer.id ? updated : item,
      ),
    }));
    try {
      await $api.patch(`/territory/volunteers/${volunteer.id}`, patch);
    } catch {
      /* demo mode */
    }
  };

  return (
    <main className="territory-page">
      <section className="territory-shell">
        <div className="territory-heading">
          <div>
            <span className="eyebrow">Кабинет сотрудника ООПТ</span>
            <h1>Территория «Черноморское побережье»</h1>
            <p>
              Контроль состояния, мероприятий и экологического результата в
              одном месте.
            </p>
          </div>
          <div className="live-indicator">
            <span /> Данные обновлены сегодня в 09:40
          </div>
        </div>
        <div className="territory-stats">
          <article>
            <span>Проблемные участки</span>
            <strong>{data.stats.attentionAreas}</strong>
            <small>из {data.stats.totalAreas} отслеживаемых</small>
          </article>
          <article>
            <span>Активные мероприятия</span>
            <strong>{data.stats.activeEvents}</strong>
            <small>{data.stats.completedEvents} завершено в этом сезоне</small>
          </article>
          <article>
            <span>Волонтёры</span>
            <strong>{data.stats.volunteers}</strong>
            <small>участников в системе</small>
          </article>
          <article>
            <span>Очищено территории</span>
            <strong>{data.stats.cleanedArea} га</strong>
            <small>динамика: +18% к прошлому месяцу</small>
          </article>
        </div>
        <nav className="territory-tabs">
          {[
            ["overview", "Обзор"],
            ["areas", "Участки и ДЗЗ"],
            ["events", "Мероприятия"],
            ["volunteers", "Волонтёры"],
            ["reports", "Отчётность"],
          ].map(([key, label]) => (
            <button
              className={tab === key ? "active" : ""}
              onClick={() => setTab(key)}
              key={key}
            >
              {label}
            </button>
          ))}
        </nav>
        {(tab === "overview" || tab === "areas") && (
          <section className="territory-grid">
            <article className="map-panel">
              <div className="panel-title">
                <div>
                  <span className="section-kicker">ДЗЗ-мониторинг</span>
                  <h2>Карта территории</h2>
                </div>
                <button className="outline-button">Снимок от 12.09.2026</button>
              </div>
              <div className="satellite-map">
                <div className="map-grid" />
                {data.areas.map((area, index) => (
                  <button
                    key={area.id}
                    className={`map-pin pin-${index + 1} ${area.status}`}
                    onClick={() => setSelectedArea(area)}
                  >
                    {index + 1}
                  </button>
                ))}
                <div className="map-label">Спутниковый слой · 2 м/пиксель</div>
              </div>
            </article>
            <article className="area-panel">
              <div className="panel-title">
                <div>
                  <span className="section-kicker">Выбранный участок</span>
                  <h2>{selectedArea.name}</h2>
                </div>
                <span className={`status status-${selectedArea.status}`}>
                  {statusLabels[selectedArea.status]}
                </span>
              </div>
              <div className="area-image">
                <div className="scan-line" />
                <span>АНАЛИЗ ДЗЗ · {selectedArea.level.toUpperCase()}</span>
              </div>
              <dl className="area-facts">
                <div>
                  <dt>Тип аномалии</dt>
                  <dd>{selectedArea.type}</dd>
                </div>
                <div>
                  <dt>Координаты</dt>
                  <dd>{selectedArea.coordinates}</dd>
                </div>
                <div>
                  <dt>Площадь</dt>
                  <dd>{selectedArea.area} га</dd>
                </div>
                <div>
                  <dt>Обновлено</dt>
                  <dd>{selectedArea.updatedAt}</dd>
                </div>
              </dl>
              <div className="area-actions">
                <select
                  value={selectedArea.status}
                  onChange={(event) =>
                    updateArea(selectedArea, event.target.value)
                  }
                >
                  <option value="attention">Требует внимания</option>
                  <option value="event">Мероприятие создано</option>
                  <option value="clean">Очищен</option>
                </select>
                <button
                  className="primary-button"
                  onClick={() => {
                    setEventForm((form) => ({
                      ...form,
                      title: `Очистка: ${selectedArea.name}`,
                    }));
                    setShowEventForm(true);
                  }}
                >
                  Создать мероприятие
                </button>
              </div>
            </article>
          </section>
        )}
        {(tab === "overview" || tab === "events") && (
          <section className="data-section">
            <div className="section-header">
              <div>
                <span className="section-kicker">Операционный план</span>
                <h2>Ближайшие мероприятия</h2>
              </div>
              <button
                className="primary-button"
                onClick={() => setShowEventForm(true)}
              >
                + Новое мероприятие
              </button>
            </div>
            <div className="event-list">
              {data.events.map((event) => (
                <article className="event-row" key={event.id}>
                  <div className="event-date">
                    <strong>{event.date?.slice(0, 2) || "--"}</strong>
                    <span>{event.date?.slice(3) || "дата"}</span>
                  </div>
                  <div className="event-copy">
                    <h3>{event.title}</h3>
                    <p>
                      {event.time} · {event.description}
                    </p>
                  </div>
                  <div className="event-capacity">
                    <strong>
                      {event.volunteersRegistered}/{event.volunteersNeeded}
                    </strong>
                    <span>участников</span>
                    <div className="capacity-bar">
                      <i
                        style={{
                          width: `${Math.min(100, (event.volunteersRegistered / event.volunteersNeeded) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                  <span className="event-status">
                    {event.status === "published"
                      ? "Опубликовано"
                      : event.status}
                  </span>
                </article>
              ))}
            </div>
          </section>
        )}
        {(tab === "overview" || tab === "volunteers") && (
          <section className="data-section">
            <div className="section-header">
              <div>
                <span className="section-kicker">Контроль участия</span>
                <h2>Волонтёры и мотивация</h2>
              </div>
              <span className="section-note">
                Подтверждение явки инициирует бонусы
              </span>
            </div>
            <div className="volunteer-table">
              <div className="table-head">
                <span>Участник</span>
                <span>Мероприятие</span>
                <span>Статус</span>
                <span>Действие</span>
              </div>
              {data.volunteers.map((volunteer) => (
                <div className="table-row" key={volunteer.id}>
                  <strong>{volunteer.name}</strong>
                  <span>
                    {data.events.find((event) => event.id === volunteer.eventId)
                      ?.title || "Мероприятие"}
                  </span>
                  <span
                    className={volunteer.attended ? "confirmed" : "waiting"}
                  >
                    {volunteer.attended
                      ? "Явка подтверждена"
                      : volunteer.status === "confirmed"
                        ? "Записан"
                        : "Ожидает подтверждения"}
                  </span>
                  <button
                    className="text-button"
                    onClick={() =>
                      updateVolunteer(volunteer, {
                        attended: true,
                        status: "confirmed",
                      })
                    }
                  >
                    {volunteer.attended
                      ? volunteer.bonusStatus
                      : "Подтвердить явку"}
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}
        {tab === "reports" && (
          <section className="report-grid">
            <article>
              <span className="section-kicker">Сезон 2026</span>
              <strong>5</strong>
              <span>проведённых мероприятий</span>
            </article>
            <article>
              <span className="section-kicker">Вовлечённость</span>
              <strong>87%</strong>
              <span>средняя явка участников</span>
            </article>
            <article>
              <span className="section-kicker">Результат ДЗЗ</span>
              <strong>4.8 га</strong>
              <span>подтверждено очищено</span>
            </article>
            <article className="chart-card">
              <span className="section-kicker">Динамика состояния</span>
              <div className="bars">
                {[42, 55, 48, 66, 74, 88].map((height, index) => (
                  <i style={{ height: `${height}%` }} key={index} />
                ))}
              </div>
              <div className="chart-labels">
                <span>апр</span>
                <span>май</span>
                <span>июн</span>
                <span>июл</span>
                <span>авг</span>
                <span>сен</span>
              </div>
            </article>
          </section>
        )}
      </section>
      {showEventForm && (
        <div className="modal-backdrop" onClick={() => setShowEventForm(false)}>
          <form
            className="event-modal"
            onSubmit={(event) => {
              event.preventDefault();
              createEvent(eventForm);
            }}
            onClick={(event) => event.stopPropagation()}
          >
            <span className="section-kicker">Новое мероприятие</span>
            <h2>Запланировать экологическую акцию</h2>
            {[
              ["title", "Название"],
              ["date", "Дата"],
              ["time", "Время"],
              ["volunteersNeeded", "Нужно волонтёров"],
            ].map(([key, label]) => (
              <label key={key}>
                {label}
                <input
                  required={key !== "time"}
                  type={
                    key === "date"
                      ? "date"
                      : key === "volunteersNeeded"
                        ? "number"
                        : "text"
                  }
                  value={eventForm[key]}
                  onChange={(event) =>
                    setEventForm({ ...eventForm, [key]: event.target.value })
                  }
                />
              </label>
            ))}
            <label>
              Описание работ
              <textarea
                required
                value={eventForm.description}
                onChange={(event) =>
                  setEventForm({
                    ...eventForm,
                    description: event.target.value,
                  })
                }
              />
            </label>
            <div className="modal-actions">
              <button
                type="button"
                className="outline-button"
                onClick={() => setShowEventForm(false)}
              >
                Отмена
              </button>
              <button className="primary-button">Опубликовать</button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}
