import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import $api from "../http";
import "./Home.css";
import SatelliteMap from "../components/SatelliteMap/SatelliteMap";

const fallbackAreas = [
  {
    id: "area-1",
    name: "Черноморский сектор А",
    type: "Мазутное пятно",
    problemType: "pollution",
    status: "detected",
    coordinates: "44.605, 33.522",
  },
  {
    id: "area-2",
    name: "Балтийская коса Б",
    type: "Скопление пластика",
    problemType: "trash",
    status: "planned",
    coordinates: "54.639, 19.976",
  },
  {
    id: "area-3",
    name: "Тихоокеанский лиман Г",
    type: "Требует анализа",
    problemType: "other",
    status: "detected",
    coordinates: "43.115, 131.885",
  },
];
const tabs = {
  "#satellite-analysis": "map",
  "#volunteer-hq": "volunteers",
};

export default function Home() {
  const [activeTab, setActiveTab] = useState(
    () => tabs[window.location.hash] || "map",
  );
  const [areas, setAreas] = useState(fallbackAreas);
  const [selectedArea, setSelectedArea] = useState(fallbackAreas[0]);
  const [volunteerCount, setVolunteerCount] = useState(42);
  const [readyEvent, setReadyEvent] = useState(null);
  const [isReadyLoading, setIsReadyLoading] = useState(false);

  useEffect(() => {
    $api
      .get("/events/my")
      .then((response) => {
        const registration = response.data?.find(
          (item) => item.eventId === "event-1" && item.status !== "cancelled",
        );
        if (registration) {
          setReadyEvent(registration);
        }
      })
      .catch(() => {});
  }, []);

  const confirmReadiness = async () => {
    if (isReadyLoading || readyEvent) return;
    setIsReadyLoading(true);
    try {
      const response = await $api.post("/events/event-1/register");
      setReadyEvent(response.data.registration);
      setVolunteerCount((count) => count + 1);
    } catch (error) {
      if (error.response?.status === 409) {
        setReadyEvent({ eventId: "event-1", status: "registered" });
      }
    } finally {
      setIsReadyLoading(false);
    }
  };

  useEffect(() => {
    $api
      .get("/territory/areas")
      .then(({ data }) => {
        setAreas(data);
        setSelectedArea(data[0]);
      })
      .catch(() => {});
  }, []);

  const selectTab = (tab) => setActiveTab(tab);

  return (
    <div className="home-page">
      <div className="bg-container" />
      <section className="home-hero">
        <div>
          <span className="eyebrow">Центр экологических действий</span>
          <h1>
            Увидеть проблему.
            <br />
            <strong>Изменить берег.</strong>
          </h1>
          <p>
            Спутниковые данные и команда волонтёров помогают превращать
            наблюдение в реальный результат.
          </p>
        </div>
        <div className="home-hero-actions">
          <Link className="home-profile-button" to="/events">
            Найти мероприятие →
          </Link>
          <span>Демонстрационные данные MVP</span>
        </div>
      </section>
      <nav className="home-analysis-nav">
        <button
          className={activeTab === "map" ? "active" : ""}
          id="satellite-analysis"
          onClick={() => selectTab("map")}
        >
          🛰️ Спутниковый анализ
        </button>
        <button
          className={activeTab === "volunteers" ? "active" : ""}
          id="volunteer-hq"
          onClick={() => selectTab("volunteers")}
        >
          👥 Штаб волонтёров
        </button>
        <a
          className="telegram-bot-button"
          href="https://t.me/ChistyBeregoBot"
          target="_blank"
          rel="noreferrer"
        >
          🤖 Telegram-бот
        </a>
      </nav>
      <main className="home-workspace">
        {activeTab === "map" && (
          <section className="home-panel" id="satellite-panel">
            <div className="panel-heading">
              <div>
                <span className="section-kicker">Спутниковый анализ</span>
                <h2>Проблемные участки территории</h2>
              </div>
              <span className="demo-badge">ДЗЗ · demo-mvp</span>
            </div>
            <p className="panel-lead">
              Выберите участок на карте данных, чтобы увидеть тип проблемы и
              перейти к связанному мероприятию.
            </p>
            <div className="workspace-grid">
              <div className="workspace-map">
                <SatelliteMap />
              </div>
              <div className="area-list">
                {areas.map((area) => (
                  <button
                    className={selectedArea?.id === area.id ? "selected" : ""}
                    key={area.id}
                    onClick={() => setSelectedArea(area)}
                  >
                    <span className={`problem-dot ${area.problemType}`} />
                    <div>
                      <strong>{area.name}</strong>
                      <small>
                        {area.type} · {area.coordinates}
                      </small>
                    </div>
                    <b>
                      {area.status === "planned"
                        ? "Мероприятие создано"
                        : "Проблема обнаружена"}
                    </b>
                  </button>
                ))}
                <Link className="outline-button" to="/events">
                  Перейти к мероприятиям →
                </Link>
              </div>
            </div>
            {selectedArea && (
              <div className="selected-area">
                <div>
                  <span className="section-kicker">Выбранный участок</span>
                  <h3>{selectedArea.name}</h3>
                  <p>
                    {selectedArea.type} · {selectedArea.coordinates}
                  </p>
                </div>
                <Link
                  className="primary-button"
                  to={`/events/${selectedArea.id === "area-1" ? "event-1" : selectedArea.id === "area-2" ? "event-2" : "event-3"}`}
                >
                  Открыть задачу →
                </Link>
              </div>
            )}
          </section>
        )}
        {activeTab === "volunteers" && (
          <section className="home-panel" id="volunteer-panel">
            <div className="panel-heading">
              <div>
                <span className="section-kicker">Штаб волонтёров</span>
                <h2>Команда на сегодня</h2>
              </div>
              <Link className="primary-button" to="/events">
                Присоединиться →
              </Link>
            </div>
            <div className="hq-grid">
              <article>
                <strong>{volunteerCount}</strong>
                <span>волонтёров в системе</span>
              </article>
              <article>
                <strong>18</strong>
                <span>записались на ближайшую акцию</span>
              </article>
              <article>
                <strong>4.8 га</strong>
                <span>очищено в этом сезоне</span>
              </article>
            </div>
            <div className="hq-callout">
              <div>
                <span className="section-kicker">Следующий шаг</span>
                <h3>Увидели проблему? Изучите участок и приходите на акцию.</h3>
                <p>
                  Обучение поможет читать ДЗЗ, а штаб подберёт задачу по силам и
                  территории.
                </p>
              </div>
              <div>
                <Link className="outline-button" to="/education">
                  Пройти обучение
                </Link>
                <button
                  className="text-button"
                  disabled={isReadyLoading || Boolean(readyEvent)}
                  onClick={confirmReadiness}
                >
                  {readyEvent
                    ? "Вы уже участвуете"
                    : isReadyLoading
                      ? "Подтверждаем..."
                      : "Я готов участвовать"}
                </button>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
