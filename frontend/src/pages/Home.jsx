import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import $api from "../http";
import "./Home.css";
import "leaflet/dist/leaflet.css";
import { CircleMarker, MapContainer, Popup, TileLayer } from "react-leaflet";

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
  "#ai-analysis": "ai",
  "#volunteer-hq": "volunteers",
};

export default function Home() {
  const [activeTab, setActiveTab] = useState(
    () => tabs[window.location.hash] || "map",
  );
  const [areas, setAreas] = useState(fallbackAreas);
  const [selectedArea, setSelectedArea] = useState(fallbackAreas[0]);
  const [aiLogs, setAiLogs] = useState([
    "Слой ДЗЗ готов к анализу",
    "Демонстрационный источник MVP подключён",
  ]);
  const [volunteerCount, setVolunteerCount] = useState(42);

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
  const runAnalysis = () => {
    setAiLogs((logs) => [
      `Анализ участка «${selectedArea.name}» завершён`,
      "Найдены объекты для полевой проверки",
      ...logs,
    ]);
  };

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
            Спутниковые данные, ИИ-анализ и команда волонтёров помогают
            превращать наблюдение в реальный результат.
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
          className={activeTab === "ai" ? "active" : ""}
          id="ai-analysis"
          onClick={() => selectTab("ai")}
        >
          🧠 ИИ-анализ
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
                <MapContainer
                  center={[50.5, 45]}
                  zoom={3}
                  scrollWheelZoom
                  className="real-map"
                >
                  <TileLayer
                    attribution="&copy; OpenStreetMap contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {areas.map((area) => {
                    const [latitude, longitude] = area.coordinates
                      .split(",")
                      .map(Number);
                    return (
                      <CircleMarker
                        center={[latitude, longitude]}
                        radius={10}
                        pathOptions={{
                          color:
                            area.problemType === "pollution"
                              ? "#e87857"
                              : area.problemType === "trash"
                                ? "#e5b452"
                                : "#79c18d",
                          fillOpacity: 0.9,
                        }}
                        key={area.id}
                        eventHandlers={{ click: () => setSelectedArea(area) }}
                      >
                        <Popup>
                          <strong>{area.name}</strong>
                          <br />
                          {area.type}
                        </Popup>
                      </CircleMarker>
                    );
                  })}
                </MapContainer>
                <span className="map-source">
                  OpenStreetMap · участки из backend
                </span>
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
        {activeTab === "ai" && (
          <section className="home-panel ai-panel" id="ai-panel">
            <div className="panel-heading">
              <div>
                <span className="section-kicker">ИИ-анализ</span>
                <h2>Экологический помощник</h2>
              </div>
              <span className="demo-badge">Модель · MVP</span>
            </div>
            <div className="ai-layout">
              <div className="ai-visual">
                <div className="ai-scan" />
                <span>АНАЛИЗ ДЗЗ</span>
                <strong>{selectedArea.name}</strong>
              </div>
              <div className="ai-console">
                <p>
                  Выбранный участок: <strong>{selectedArea.type}</strong>
                </p>
                {aiLogs.map((log, index) => (
                  <div key={`${log}-${index}`}>› {log}</div>
                ))}
                <button className="primary-button" onClick={runAnalysis}>
                  Запустить анализ
                </button>
              </div>
            </div>
            <div className="info-note">
              ИИ помогает находить аномалии на демонстрационных снимках. Решение
              о выезде всегда подтверждается экологом или сотрудником ООПТ.
            </div>
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
                  onClick={() => setVolunteerCount((count) => count + 1)}
                >
                  Я готов участвовать
                </button>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
