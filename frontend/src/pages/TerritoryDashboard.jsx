import { useEffect, useMemo, useRef, useState } from "react";
import $api from "../http";
import "./TerritoryDashboard.css";

const confirmParticipation = async (eventId, userId) => {
  const response = await $api.post(
    `/events/${eventId}/participants/${userId}/confirm`,
  );
  return response.data;
};

const defaultFilters = {
  period: "all",
  territory: "all",
  status: "all",
};

const statusMap = {
  detected: { label: "Новая", className: "status-detected" },
  planned: { label: "Требует внимания", className: "status-planned" },
  in_progress: { label: "В работе", className: "status-progress" },
  resolved: { label: "Решена", className: "status-resolved" },
};

const priorityMap = {
  Высокий: "priority-high",
  Средний: "priority-medium",
  Низкий: "priority-low",
};

export default function TerritoryDashboard() {
  const [filters, setFilters] = useState(defaultFilters);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedAreaId, setSelectedAreaId] = useState("");
  const [selectedEventId, setSelectedEventId] = useState("");
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [showEventForm, setShowEventForm] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [participantsLoading, setParticipantsLoading] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const areaMapRef = useRef(null);
  const [volunteerSearch, setVolunteerSearch] = useState("");
  const [eventForm, setEventForm] = useState({
    title: "",
    date: "",
    time: "09:00",
    volunteersNeeded: 10,
    description: "",
  });

  const reload = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await $api.get("/territory/analytics", {
        params: filters,
      });
      setData(response.data);
      setSelectedAreaId(
        (current) => current || response.data?.areas?.[0]?.id || "",
      );
      setSelectedEventId(
        (current) => current || response.data?.events?.items?.[0]?.id || "",
      );
    } catch {
      setError(
        "Не удалось загрузить данные аналитики. Попробуйте обновить страницу.",
      );
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reload();
  }, [filters.period, filters.territory, filters.status]);

  const selectedArea = useMemo(
    () =>
      data?.areas?.find((area) => area.id === selectedAreaId) ||
      data?.areas?.[0],
    [data, selectedAreaId],
  );

  const selectedEvent = useMemo(
    () =>
      data?.events?.items?.find((event) => event.id === selectedEventId) ||
      data?.events?.items?.[0],
    [data, selectedEventId],
  );

  const filteredVolunteers = useMemo(() => {
    const query = volunteerSearch.trim().toLowerCase();
    if (!query) return data?.volunteerItems || [];
    return (data?.volunteerItems || []).filter((volunteer) =>
      [volunteer.name, volunteer.territory, volunteer.status]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query)),
    );
  }, [data, volunteerSearch]);

  useEffect(() => {
    if (selectedArea && !selectedAreaId) setSelectedAreaId(selectedArea.id);
    if (selectedEvent && !selectedEventId) setSelectedEventId(selectedEvent.id);
  }, [selectedArea, selectedAreaId, selectedEvent, selectedEventId]);

  const loadParticipants = async (eventId) => {
    if (!eventId) return;
    setParticipantsLoading(true);
    try {
      const response = await $api.get(`/events/${eventId}/participants`);
      setParticipants(response.data || []);
    } catch {
      setParticipants([]);
    } finally {
      setParticipantsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedEvent?.id) {
      loadParticipants(selectedEvent.id);
    }
  }, [selectedEvent?.id]);

  const updateArea = async (area, nextStatus) => {
    const areaId = area.id;
    setData((current) => ({
      ...current,
      areas: (current?.areas || []).map((item) =>
        item.id === areaId ? { ...item, status: nextStatus } : item,
      ),
    }));
    try {
      await $api.patch(`/territory/areas/${areaId}`, { status: nextStatus });
    } catch {
      // demo mode; request is optional for the mock analytics
    }
  };

  const createEvent = async (payload) => {
    const response = await $api.post("/territory/events", {
      ...payload,
      areaId: selectedArea?.id || "demo-area",
      status: "published",
      volunteersRegistered: 0,
      actualParticipants: 0,
      attendanceRate: 0,
      result: "Новый результат будет подтверждён после мероприятия",
    });

    setData((current) => ({
      ...current,
      events: {
        ...current.events,
        items: [response.data, ...(current.events?.items || [])],
      },
      areas: (current?.areas || []).map((area) =>
        area.id === response.data.areaId
          ? {
              ...area,
              assignedEventId: response.data.id,
              resolutionStatus: "Мероприятие запланировано",
            }
          : area,
      ),
    }));
    setSelectedEventId(response.data.id);
    setShowEventForm(false);
    setEventForm({
      title: "",
      date: "",
      time: "09:00",
      volunteersNeeded: 10,
      description: "",
    });
  };

  const openTaskAction = (task) => {
    if (!task) return;
    if (task.type === "area") {
      setSelectedAreaId(task.id);
      if (task.assignedEventId) {
        setSelectedEventId(task.assignedEventId);
        setShowEventDetails(true);
      } else {
        setShowEventForm(true);
      }
      return;
    }
    const event = data?.events?.items?.find((item) => item.id === task.id);
    if (event?.areaId) {
      setSelectedAreaId(event.areaId);
      setSelectedEventId(event.id);
      setShowEventDetails(false);
      requestAnimationFrame(() => {
        areaMapRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      });
    }
  };

  const handleEventOpen = (eventId) => {
    if (!eventId) return;
    setSelectedEventId(eventId);
    setShowEventDetails(true);
  };

  if (loading) {
    return (
      <main className="territory-page">
        <section className="territory-shell">
          <div className="empty-state">Загрузка аналитики...</div>
        </section>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="territory-page">
        <section className="territory-shell">
          <div className="empty-state error-state">
            {error || "Данные за выбранный период отсутствуют."}
          </div>
        </section>
      </main>
    );
  }

  const territoryOptions = [
    "all",
    ...new Set((data?.areas || []).map((area) => area.territory)),
  ];
  const overview = data.overview || {};
  const funnelStages = [
    {
      key: "registered",
      label: "Регистрация",
      total: data.funnel?.registered || 0,
    },
    {
      key: "startedEducation",
      label: "Начали обучение",
      total: data.funnel?.startedEducation || 0,
    },
    {
      key: "completedEducation",
      label: "Завершили обучение",
      total: data.funnel?.completedEducation || 0,
    },
    {
      key: "registeredForEvent",
      label: "Записались на мероприятие",
      total: data.funnel?.registeredForEvent || 0,
    },
    {
      key: "participated",
      label: "Приняли участие",
      total: data.funnel?.participated || 0,
    },
    {
      key: "repeatedParticipation",
      label: "Повторно участвовали",
      total: data.funnel?.repeatedParticipation || 0,
    },
  ];

  return (
    <main className="territory-page">
      <section className="territory-shell">
        <div className="dashboard-header">
          <div>
            <span className="eyebrow">Кабинет сотрудника ООПТ</span>
            <h1>Аналитика территории и вовлечения</h1>
            <p>
              Состояние зон, активность волонтёров и экологический эффект в
              одном рабочем интерфейсе.
            </p>
          </div>
          <div className="live-pill">
            <span className="dot" />
            Обновлено сегодня
          </div>
        </div>

        <nav className="dashboard-nav" aria-label="Разделы кабинета">
          <a href="#overview">Обзор</a>
          <a href="#areas">Проблемные зоны</a>
          <a href="#events">Мероприятия</a>
          <a href="#volunteers">Волонтёры</a>
        </nav>

        <div className="filters-bar" id="overview">
          <label>
            Период
            <select
              value={filters.period}
              onChange={(event) =>
                setFilters({ ...filters, period: event.target.value })
              }
            >
              <option value="all">Весь период</option>
              <option value="7">7 дней</option>
              <option value="30">30 дней</option>
              <option value="90">90 дней</option>
            </select>
          </label>
          <label>
            Территория
            <select
              value={filters.territory}
              onChange={(event) =>
                setFilters({ ...filters, territory: event.target.value })
              }
            >
              <option value="all">Все</option>
              {territoryOptions.filter(Boolean).map((territory) => (
                <option value={territory} key={territory}>
                  {territory}
                </option>
              ))}
            </select>
          </label>
          <label>
            Статус
            <select
              value={filters.status}
              onChange={(event) =>
                setFilters({ ...filters, status: event.target.value })
              }
            >
              <option value="all">Все</option>
              <option value="active">Активные</option>
              <option value="completed">Завершённые</option>
            </select>
          </label>
        </div>

        <div className="kpi-grid">
          {data.kpis?.map((item) => (
            <article className="kpi-card" key={item.label}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
              <small>{item.description}</small>
              <em>{item.delta}</em>
            </article>
          ))}
        </div>

        <section className="panel attention-panel">
          <div className="panel-header">
            <div>
              <span className="section-kicker">Требует внимания</span>
              <h2>Ключевые задачи сегодня</h2>
            </div>
          </div>
          <div className="attention-list">
            {(data.attention || []).length ? (
              data.attention.map((task) => (
                <article
                  key={`${task.type}-${task.id}`}
                  className="attention-item"
                >
                  <div>
                    <span
                      className={`priority-pill ${priorityMap[task.priority] || "priority-medium"}`}
                    >
                      {task.priority || "Средний"}
                    </span>
                    <h3>{task.title}</h3>
                    <p>{task.territory}</p>
                  </div>
                  <div className="attention-meta">
                    <strong>{task.reason}</strong>
                    <button
                      type="button"
                      className="text-button"
                      onClick={() => openTaskAction(task)}
                    >
                      {task.action}
                    </button>
                  </div>
                </article>
              ))
            ) : (
              <div className="empty-state">Нет задач, требующих внимания.</div>
            )}
          </div>
        </section>

        <div className="two-column">
          <section className="panel chart-panel">
            <div className="panel-header">
              <div>
                <span className="section-kicker">Экологический результат</span>
                <h2>Динамика по времени</h2>
              </div>
            </div>
            <div className="chart-bars">
              {(data.timeline || []).map((point) => (
                <div key={point.date} className="bar-column">
                  <span
                    className="bar-fill"
                    style={{
                      height: `${Math.min(100, (point.cleanedArea / 360) * 100)}%`,
                    }}
                  />
                  <small>{point.date.slice(5)}</small>
                </div>
              ))}
            </div>
            <div className="impact-summary">
              <div>
                <span>Очищенная площадь</span>
                <strong>{overview.cleanedArea || 0} м²</strong>
              </div>
              <div>
                <span>Мероприятий</span>
                <strong>{overview.activeEvents || 0}</strong>
              </div>
              <div>
                <span>Решённых зон</span>
                <strong>{data.impact?.resolvedAreas || 0}</strong>
              </div>
            </div>
          </section>

          <section className="panel chart-panel">
            <div className="panel-header">
              <div>
                <span className="section-kicker">Проблемные зоны</span>
                <h2>Статусы</h2>
              </div>
            </div>
            <div className="status-chart">
              {Object.entries(statusMap).map(([key, item]) => {
                const value = data.areasStatus?.[key] || 0;
                const percentage = Math.max(
                  8,
                  (value / Math.max(1, overview.totalAreas || 1)) * 100,
                );
                return (
                  <div key={key} className="status-row">
                    <span>{item.label}</span>
                    <div className="meter">
                      <i style={{ width: `${percentage}%` }} />
                    </div>
                    <b>{value}</b>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        <section className="panel">
          <div className="panel-header">
            <div>
              <span className="section-kicker">Воронка вовлечения</span>
              <h2>Путь волонтёра</h2>
            </div>
          </div>
          <div className="funnel-grid">
            {funnelStages.map((stage, index) => {
              const prev =
                index === 0 ? stage.total : funnelStages[index - 1].total;
              const conversion =
                index === 0 ? 100 : Math.round((stage.total / prev) * 100);
              return (
                <div key={stage.key} className="funnel-step">
                  <div className="funnel-top">
                    <span>{stage.label}</span>
                    <strong>{stage.total}</strong>
                  </div>
                  <div className="funnel-track">
                    <i
                      style={{
                        width: `${Math.max(14, (stage.total / (data.funnel?.registered || 1)) * 100)}%`,
                      }}
                    />
                  </div>
                  <small>{index === 0 ? "100%" : `${conversion}%`}</small>
                </div>
              );
            })}
          </div>
        </section>

        <div className="two-column">
          <section className="panel" id="areas">
            <div className="panel-header">
              <div>
                <span className="section-kicker">Проблемные зоны</span>
                <h2>Карта приоритетов</h2>
              </div>
            </div>
            <div className="territory-map" ref={areaMapRef}>
              <div className="map-grid" />
              <div className="map-label map-label-top">Северный сектор</div>
              <div className="map-label map-label-bottom">Южный сектор</div>
              {(data.areas || []).map((area, index) => (
                <button
                  type="button"
                  key={`map-${area.id}`}
                  className={`map-marker ${selectedArea?.id === area.id ? "active" : ""}`}
                  style={{
                    left: `${18 + ((index * 23) % 66)}%`,
                    top: `${25 + ((index * 31) % 48)}%`,
                  }}
                  title={`Открыть ${area.name}`}
                  aria-label={`Открыть участок ${area.name}`}
                  onClick={() => setSelectedAreaId(area.id)}
                >
                  <span />
                  <small>{index + 1}</small>
                </button>
              ))}
              {selectedArea && (
                <div className="map-selection">
                  <strong>{selectedArea.name}</strong>
                  <span>{selectedArea.coordinates}</span>
                </div>
              )}
            </div>
            <div className="areas-list">
              {(data.areas || []).map((area) => (
                <button
                  type="button"
                  className={`area-card ${selectedArea?.id === area.id ? "selected" : ""}`}
                  key={area.id}
                  onClick={() => setSelectedAreaId(area.id)}
                >
                  <div className="card-main">
                    <div>
                      <h3>{area.name}</h3>
                      <small>{area.territory}</small>
                    </div>
                    <span
                      className={`status-badge ${statusMap[area.status]?.className || "status-detected"}`}
                    >
                      {statusMap[area.status]?.label || "Новая"}
                    </span>
                  </div>
                  <div className="card-meta">
                    <span
                      className={`priority-pill ${priorityMap[area.priority] || "priority-medium"}`}
                    >
                      {area.priority}
                    </span>
                    <span>{area.coordinates}</span>
                  </div>
                  <div className="card-meta subtle">
                    <span>Источник: {area.source}</span>
                    <span>
                      confidence: {Number(area.confidence || 0).toFixed(2)}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section className="panel">
            <div className="panel-header">
              <div>
                <span className="section-kicker">Событие</span>
                <h2>Подробности мероприятия</h2>
              </div>
            </div>
            {selectedEvent ? (
              <>
                <div className="event-details">
                  <h3>{selectedEvent.title}</h3>
                  <ul>
                    <li>
                      <b>Территория:</b> {selectedEvent.territory}
                    </li>
                    <li>
                      <b>Дата:</b> {selectedEvent.date}
                    </li>
                    <li>
                      <b>Статус:</b>{" "}
                      {selectedEvent.status === "published"
                        ? "Активно"
                        : "Завершено"}
                    </li>
                    <li>
                      <b>Зарегистрировано:</b>{" "}
                      {selectedEvent.volunteersRegistered}
                    </li>
                    <li>
                      <b>Участвовало:</b> {selectedEvent.actualParticipants}
                    </li>
                    <li>
                      <b>Явка:</b>{" "}
                      {Math.round((selectedEvent.attendanceRate || 0) * 100)}%
                    </li>
                    <li>
                      <b>Результат:</b> {selectedEvent.result}
                    </li>
                  </ul>
                  <button
                    className="primary-button"
                    type="button"
                    onClick={() => {
                      setShowEventDetails(false);
                      setShowEventForm(true);
                    }}
                  >
                    Назначить мероприятие
                  </button>
                </div>

                <div className="panel" style={{ marginTop: 20 }}>
                  <div className="panel-header">
                    <div>
                      <span className="section-kicker">Участники</span>
                      <h2>Подтверждение явки</h2>
                    </div>
                  </div>
                  {confirmMessage && (
                    <div className="toast-message">{confirmMessage}</div>
                  )}
                  {participantsLoading ? (
                    <div className="empty-state">Загрузка участников...</div>
                  ) : participants.length ? (
                    <div className="table-wrap">
                      <table>
                        <thead>
                          <tr>
                            <th>Пользователь</th>
                            <th>Статус</th>
                            <th>Бонусы</th>
                            <th>Действие</th>
                          </tr>
                        </thead>
                        <tbody>
                          {participants.map((participant) => (
                            <tr key={participant.id}>
                              <td>{participant.email}</td>
                              <td>
                                {participant.status === "confirmed"
                                  ? "Подтверждён"
                                  : participant.status === "absent"
                                    ? "Отсутствовал"
                                    : "Зарегистрирован"}
                              </td>
                              <td>{participant.bonusPoints || 0}</td>
                              <td>
                                <button
                                  className="primary-button"
                                  type="button"
                                  onClick={async () => {
                                    const result = await confirmParticipation(
                                      selectedEvent.id,
                                      participant.userId,
                                    );
                                    setConfirmMessage(
                                      result.message || "Участие подтверждено",
                                    );
                                    await loadParticipants(selectedEvent.id);
                                    reload();
                                  }}
                                  disabled={participant.status === "confirmed"}
                                  style={{
                                    opacity:
                                      participant.status === "confirmed"
                                        ? 0.5
                                        : 1,
                                  }}
                                >
                                  {participant.status === "confirmed"
                                    ? "Подтверждено"
                                    : "Подтвердить участие"}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="empty-state">
                      На мероприятие ещё никто не зарегистрирован.
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="empty-state">Нет доступных мероприятий.</div>
            )}
          </section>
        </div>

        <section className="panel" id="events">
          <div className="panel-header">
            <div>
              <span className="section-kicker">Эффективность мероприятий</span>
              <h2>Сводка по событиям</h2>
            </div>
          </div>
          <div className="event-grid">
            {(data.events?.items || []).map((event) => (
              <button
                type="button"
                key={event.id}
                className="event-card"
                onClick={() => handleEventOpen(event.id)}
              >
                <div className="event-card-top">
                  <strong>{event.title}</strong>
                  <span>
                    {event.status === "published" ? "Активно" : "Завершено"}
                  </span>
                </div>
                <small>{event.territory}</small>
                <p>{event.date}</p>
                <div className="mini-metrics">
                  <span>Зарегистрировано: {event.volunteersRegistered}</span>
                  <span>Участвовало: {event.actualParticipants}</span>
                  <span>
                    Явка: {Math.round((event.attendanceRate || 0) * 100)}%
                  </span>
                  <span>Площадь: {event.cleanedArea || 0} м²</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="panel" id="volunteers">
          <div className="panel-header">
            <div>
              <span className="section-kicker">Волонтёры</span>
              <h2>Активность сообщества</h2>
            </div>
            <div className="volunteer-search">
              <label htmlFor="volunteer-search-input">Поиск</label>
              <input
                id="volunteer-search-input"
                type="search"
                value={volunteerSearch}
                placeholder="Имя или территория"
                onChange={(event) => setVolunteerSearch(event.target.value)}
              />
            </div>
          </div>
          <div className="volunteer-metrics">
            <div>
              <span>Всего</span>
              <strong>{data.volunteers?.total || 0}</strong>
            </div>
            <div>
              <span>Активных</span>
              <strong>{data.volunteers?.active || 0}</strong>
            </div>
            <div>
              <span>Участвовали</span>
              <strong>{data.volunteers?.participated || 0}</strong>
            </div>
            <div>
              <span>Повторных</span>
              <strong>{data.volunteers?.repeatParticipants || 0}</strong>
            </div>
            <div>
              <span>Средне мероприятий</span>
              <strong>{data.volunteers?.averageEvents || 0}</strong>
            </div>
            <div>
              <span>Средний балл</span>
              <strong>{data.volunteers?.averagePoints || 0}</strong>
            </div>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Волонтёр</th>
                  <th>Мероприятий</th>
                  <th>Посещаемость</th>
                  <th>Баллы</th>
                  <th>Последняя активность</th>
                  <th>Статус</th>
                </tr>
              </thead>
              <tbody>
                {filteredVolunteers.length ? (
                  filteredVolunteers.map((volunteer) => (
                    <tr key={volunteer.id}>
                      <td>{volunteer.name}</td>
                      <td>{volunteer.attendedEvents || 0}</td>
                      <td>{volunteer.attended ? "100%" : "Ожидает"}</td>
                      <td>{volunteer.points || 0}</td>
                      <td>{volunteer.lastActive || "—"}</td>
                      <td>
                        {volunteer.status === "active"
                          ? "Активный"
                          : "Неактивный"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">Данные по волонтёрам отсутствуют.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </section>

      {showEventDetails && selectedEvent && (
        <div
          className="modal-backdrop"
          onClick={() => setShowEventDetails(false)}
        >
          <section
            className="event-modal event-details-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="event-details-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-heading">
              <div>
                <span className="section-kicker">Карточка мероприятия</span>
                <h2 id="event-details-title">{selectedEvent.title}</h2>
              </div>
              <button
                type="button"
                className="modal-close"
                aria-label="Закрыть"
                onClick={() => setShowEventDetails(false)}
              >
                x
              </button>
            </div>
            <div className="event-detail-status">
              <span
                className={`status-badge ${selectedEvent.status === "published" ? "status-progress" : "status-resolved"}`}
              >
                {selectedEvent.status === "published" ? "Активно" : "Завершено"}
              </span>
              <span>{selectedEvent.territory}</span>
            </div>
            <ul className="event-detail-list">
              <li>
                <b>Дата:</b> {selectedEvent.date}
              </li>
              <li>
                <b>Время:</b> {selectedEvent.time || "Не указано"}
              </li>
              <li>
                <b>Зарегистрировано:</b>{" "}
                {selectedEvent.volunteersRegistered || 0}
              </li>
              <li>
                <b>Участвовало:</b> {selectedEvent.actualParticipants || 0}
              </li>
              <li>
                <b>Явка:</b>{" "}
                {Math.round((selectedEvent.attendanceRate || 0) * 100)}%
              </li>
              <li>
                <b>Очищено:</b> {selectedEvent.cleanedArea || 0} м²
              </li>
            </ul>
            <p className="event-detail-description">
              {selectedEvent.description ||
                selectedEvent.result ||
                "Подробное описание мероприятия пока не добавлено."}
            </p>
            <div className="modal-actions">
              <button
                type="button"
                className="outline-button"
                onClick={() => setShowEventDetails(false)}
              >
                Закрыть
              </button>
              <button
                type="button"
                className="primary-button"
                onClick={() => {
                  setShowEventDetails(false);
                  setShowEventForm(true);
                }}
              >
                Назначить мероприятие
              </button>
            </div>
          </section>
        </div>
      )}

      {showEventForm && (
        <div className="modal-backdrop" onClick={() => setShowEventForm(false)}>
          <form
            className="event-modal"
            onClick={(event) => event.stopPropagation()}
            onSubmit={(event) => {
              event.preventDefault();
              createEvent(eventForm);
            }}
          >
            <span className="section-kicker">Новое мероприятие</span>
            <h2>Запланировать экологическую акцию</h2>
            <label>
              Название
              <input
                value={eventForm.title}
                onChange={(e) =>
                  setEventForm({ ...eventForm, title: e.target.value })
                }
                required
              />
            </label>
            <label>
              Дата
              <input
                type="date"
                value={eventForm.date}
                onChange={(e) =>
                  setEventForm({ ...eventForm, date: e.target.value })
                }
                required
              />
            </label>
            <label>
              Время
              <input
                type="time"
                value={eventForm.time}
                onChange={(e) =>
                  setEventForm({ ...eventForm, time: e.target.value })
                }
                required
              />
            </label>
            <label>
              Нужно волонтёров
              <input
                type="number"
                min="1"
                value={eventForm.volunteersNeeded}
                onChange={(e) =>
                  setEventForm({
                    ...eventForm,
                    volunteersNeeded: Number(e.target.value),
                  })
                }
                required
              />
            </label>
            <label>
              Описание
              <textarea
                value={eventForm.description}
                onChange={(e) =>
                  setEventForm({ ...eventForm, description: e.target.value })
                }
                required
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
              <button className="primary-button" type="submit">
                Опубликовать
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}
