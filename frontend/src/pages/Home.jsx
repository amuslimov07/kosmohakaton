import { useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const [activeTab, setActiveTab] = useState("map");

  // Расширенные данные секторов: с фото, координатами для карт и статусом волонтеров
  const [sectors, setSectors] = useState([
    {
      id: 1,
      name: "Черноморский сектор-А",
      status: "critical",
      pollution: "Мазутное пятно",
      coordinates: "44.605° N, 33.522° E",
      lat: 44.605,
      lon: 33.522,
      imageUrl:
        "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=600&q=80",
      volunteerOpen: true,
      spotsLeft: 12,
      date: "15 сентября 2026",
      scanned: false,
      cleaned: false,
    },
    {
      id: 2,
      name: "Балтийская коса-Б",
      status: "warning",
      pollution: "Скопление пластика",
      coordinates: "54.639° N, 19.976° E",
      lat: 54.639,
      lon: 19.976,
      imageUrl:
        "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80",
      volunteerOpen: true,
      spotsLeft: 5,
      date: "18 сентября 2026",
      scanned: false,
      cleaned: false,
    },
    {
      id: 3,
      name: "Арктическая зона-В",
      status: "danger",
      pollution: "Ядерные отходы (Контейнер)",
      coordinates: "69.021° N, 33.075° E",
      lat: 69.021,
      lon: 33.075,
      imageUrl:
        "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80",
      volunteerOpen: false,
      spotsLeft: 0,
      date: "Набор закрыт (спец. отряд)",
      scanned: false,
      cleaned: false,
    },
    {
      id: 4,
      name: "Тихоокеанский лиман-Г",
      status: "clean",
      pollution: "Нет аномалий",
      coordinates: "43.115° N, 131.885° E",
      lat: 43.115,
      lon: 131.885,
      imageUrl:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
      volunteerOpen: false,
      spotsLeft: 0,
      date: "Экосистема в норме",
      scanned: true,
      cleaned: true,
    },
  ]);

  const [selectedSector, setSelectedSector] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [aiLogs, setAiLogs] = useState([
    "Инициализация нейросети Яндекс.Облако...",
    "Подключение к орбитальным спутникам «СР Дата» (ДЗЗ)...",
  ]);

  const [volunteerForm, setVolunteerForm] = useState({
    name: "",
    email: "",
    sectorId: 1,
  });
  const [volunteerSubmitted, setVolunteerSubmitted] = useState(false);

  const handleScan = (sectorId) => {
    setIsScanning(true);
    setAiLogs((prev) => [
      `Запрос телеметрии и фотофиксации для сектора #${sectorId} через Яндекс.Облако...`,
      ...prev,
    ]);

    setTimeout(() => {
      setSectors((prev) =>
        prev.map((sec) =>
          sec.id === sectorId ? { ...sec, scanned: true } : sec,
        ),
      );
      setIsScanning(false);
      setAiLogs((prev) => [
        `Спектрограмма и спутниковый снимок сектора #${sectorId} успешно загружены («СР Дата»).`,
        ...prev,
      ]);
    }, 1200);
  };

  const handleClean = (sectorId) => {
    setSectors((prev) =>
      prev.map((sec) =>
        sec.id === sectorId ? { ...sec, cleaned: true, status: "clean" } : sec,
      ),
    );
    setAiLogs((prev) => [
      `Ликвидация загрязнения в секторе #${sectorId} подтверждена со спутника.`,
      ...prev,
    ]);
  };

  const handleVolunteerSubmit = (e) => {
    e.preventDefault();
    if (!volunteerForm.name || !volunteerForm.email) return;
    setVolunteerSubmitted(true);
  };

  const totalSectors = sectors.length;
  const cleanedCount = sectors.filter((s) => s.cleaned).length;
  const progressPercent = Math.round((cleanedCount / totalSectors) * 100);

  return (
    <div>
      <div className="bg-container"></div>

      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div className="logo" style={{ cursor: "pointer" }}>
          <div className="logo-icon">🛰️</div>
          <span>
            ЧИСТЫЙ <span style={{ color: "#4ade80" }}>БЕРЕГ</span>
          </span>
        </div>
        <div className="home-header-actions">
          <div
            style={{
              fontSize: "0.85rem",
              color: "#94a3b8",
              background: "rgba(255,255,255,0.05)",
              padding: "0.4rem 0.8rem",
              borderRadius: "0.8rem",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            Партнеры: <b>СР Дата</b> × <b>Яндекс.Облако</b> ×{" "}
            <b>Фонд защитников природы</b>
          </div>
          <Link className="home-profile-button" to="/profile">
            Профиль <span aria-hidden="true">→</span>
          </Link>
        </div>
      </header>

      <nav
        style={{
          display: "flex",
          gap: "0.5rem",
          margin: "1.5rem 0",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={() => setActiveTab("map")}
          style={{
            padding: "0.6rem 1.2rem",
            borderRadius: "0.6rem",
            border: "none",
            background:
              activeTab === "map" ? "#4ade80" : "rgba(255,255,255,0.08)",
            color: activeTab === "map" ? "#030712" : "#fff",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          🛰️ Спутниковый мониторинг & Карта
        </button>
        <button
          onClick={() => setActiveTab("ai")}
          style={{
            padding: "0.6rem 1.2rem",
            borderRadius: "0.6rem",
            border: "none",
            background:
              activeTab === "ai" ? "#4ade80" : "rgba(255,255,255,0.08)",
            color: activeTab === "ai" ? "#030712" : "#fff",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          🧠 ИИ-Анализ & Облако
        </button>
        <button
          onClick={() => setActiveTab("volunteers")}
          style={{
            padding: "0.6rem 1.2rem",
            borderRadius: "0.6rem",
            border: "none",
            background:
              activeTab === "volunteers" ? "#4ade80" : "rgba(255,255,255,0.08)",
            color: activeTab === "volunteers" ? "#030712" : "#fff",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          👥 Штаб волонтеров
        </button>
      </nav>

      <main>
        {activeTab === "map" && (
          <div
            className="glass-card"
            style={{ width: "100%", maxWidth: "900px" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1rem",
                flexWrap: "wrap",
                gap: "0.5rem",
              }}
            >
              <div>
                <h2>Карта побережий и ДЗЗ-аналитика</h2>
                <p style={{ fontSize: "0.85rem", color: "#94a3b8" }}>
                  Нажмите на сектор, чтобы посмотреть спутниковое фото, карту
                  местоположения и статус набора волонтеров.
                </p>
              </div>
              <div
                style={{
                  background: "rgba(74, 222, 128, 0.1)",
                  border: "1px solid #4ade80",
                  padding: "0.4rem 0.8rem",
                  borderRadius: "0.6rem",
                  fontSize: "0.85rem",
                  color: "#4ade80",
                }}
              >
                Очищено: <b>{progressPercent}%</b>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "1rem",
                marginBottom: "1.5rem",
              }}
            >
              {sectors.map(({ id, coordinates, name, cleaned, pollution }) => (
                <div
                  key={id}
                  onClick={() =>
                    setSelectedSector(
                      sectors.find((sector) => sector.id === id),
                    )
                  }
                  style={{
                    background:
                      selectedSector?.id === id
                        ? "rgba(74, 222, 128, 0.15)"
                        : "rgba(255,255,255,0.04)",
                    border:
                      selectedSector?.id === id
                        ? "1px solid #4ade80"
                        : "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "0.8rem",
                    padding: "1rem",
                    textAlign: "left",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "#94a3b8",
                      marginBottom: "0.2rem",
                    }}
                  >
                    {coordinates}
                  </div>
                  <h4 style={{ marginBottom: "0.4rem", color: "#fff" }}>
                    {name}
                  </h4>
                  <div
                    style={{
                      fontSize: "0.8rem",
                      marginBottom: "0.8rem",
                      color: cleaned ? "#4ade80" : "#f87171",
                    }}
                  >
                    {cleaned ? "✅ Ликвидировано" : `⚠️ ${pollution}`}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "#38bdf8" }}>
                    🔍 Нажмите для детального обзора
                  </div>
                </div>
              ))}
            </div>

            {/* Детали выбранного сектора (Фото, Карта, Волонтерство) */}
            {selectedSector && (
              <div
                style={{
                  background: "rgba(10, 20, 14, 0.9)",
                  border: "1px solid rgba(74, 222, 128, 0.3)",
                  borderRadius: "0.8rem",
                  padding: "1.2rem",
                  textAlign: "left",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "1rem",
                  }}
                >
                  <h3 style={{ color: "#4ade80" }}>
                    📊 Детали сектора: {selectedSector.name}
                  </h3>
                  <button
                    onClick={() => setSelectedSector(null)}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "#94a3b8",
                      cursor: "pointer",
                      fontSize: "1rem",
                    }}
                  >
                    ✖
                  </button>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                    gap: "1.2rem",
                  }}
                >
                  {/* Спутниковое фото */}
                  <div>
                    <div
                      style={{
                        fontSize: "0.85rem",
                        fontWeight: "bold",
                        marginBottom: "0.5rem",
                        color: "#cbd5e1",
                      }}
                    >
                      📸 Спутниковый снимок (ДЗЗ):
                    </div>
                    {!selectedSector.scanned ? (
                      <div
                        style={{
                          height: "180px",
                          background: "rgba(255,255,255,0.05)",
                          borderRadius: "0.6rem",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "0.5rem",
                        }}
                      >
                        <p style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
                          Снимок не запрошен у сервера
                        </p>
                        <button
                          onClick={() => handleScan(selectedSector.id)}
                          disabled={isScanning}
                          style={{
                            padding: "0.5rem 1rem",
                            background: "#3b82f6",
                            color: "#fff",
                            border: "none",
                            borderRadius: "4px",
                            fontWeight: "bold",
                            cursor: "pointer",
                            fontSize: "0.8rem",
                          }}
                        >
                          {isScanning
                            ? "Загрузка..."
                            : "🛰️ Загрузить ДЗЗ-снимок"}
                        </button>
                      </div>
                    ) : (
                      <div style={{ position: "relative" }}>
                        <img
                          src={selectedSector.imageUrl}
                          alt="Sectors eco status"
                          style={{
                            width: "100%",
                            height: "180px",
                            objectFit: "cover",
                            borderRadius: "0.6rem",
                            border: "1px solid rgba(255,255,255,0.1)",
                          }}
                        />
                        <div
                          style={{
                            position: "absolute",
                            bottom: "8px",
                            left: "8px",
                            background: "rgba(0,0,0,0.7)",
                            padding: "2px 6px",
                            borderRadius: "4px",
                            fontSize: "0.75rem",
                            color: "#4ade80",
                          }}
                        >
                          Обработано в Яндекс.Облаке
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Карта местоположения */}
                  <div>
                    <div
                      style={{
                        fontSize: "0.85rem",
                        fontWeight: "bold",
                        marginBottom: "0.5rem",
                        color: "#cbd5e1",
                      }}
                    >
                      🗺️ Координаты на карте:
                    </div>
                    <div
                      style={{
                        height: "180px",
                        borderRadius: "0.6rem",
                        overflow: "hidden",
                        border: "1px solid rgba(255,255,255,0.1)",
                      }}
                    >
                      <iframe
                        title="map"
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        scrolling="no"
                        marginHeight="0"
                        marginWidth="0"
                        src={`https://www.openstreetmap.org/export/embed.html?bbox=${selectedSector.lon - 0.1}%2C${selectedSector.lat - 0.1}%2C${selectedSector.lon + 0.1}%2C${selectedSector.lat + 0.1}&layer=mapnik&marker=${selectedSector.lat}%2C${selectedSector.lon}`}
                        style={{
                          filter: "invert(90%) hue-rotate(180deg)",
                          border: 0,
                        }}
                      ></iframe>
                    </div>
                  </div>
                </div>

                {/* Блок информации о волонтерстве для этого места */}
                <div
                  style={{
                    marginTop: "1.2rem",
                    background: "rgba(255,255,255,0.03)",
                    padding: "1rem",
                    borderRadius: "0.6rem",
                    border: "1px solid rgba(255,255,255,0.08)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "1rem",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: "0.85rem",
                        fontWeight: "bold",
                        color: "#4ade80",
                        marginBottom: "2px",
                      }}
                    >
                      👥 Статус набора волонтеров:
                    </div>
                    <div style={{ fontSize: "0.85rem", color: "#cbd5e1" }}>
                      {selectedSector.volunteerOpen
                        ? `🟢 Открыто! Свободных мест: ${selectedSector.spotsLeft} (Выезд: ${selectedSector.date})`
                        : `🔴 ${selectedSector.date}`}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    {selectedSector.volunteerOpen &&
                      !selectedSector.cleaned && (
                        <button
                          onClick={() => {
                            setActiveTab("volunteers");
                            setVolunteerForm({
                              ...volunteerForm,
                              sectorId: selectedSector.id,
                            });
                          }}
                          style={{
                            padding: "0.5rem 1rem",
                            background: "#4ade80",
                            color: "#030712",
                            border: "none",
                            borderRadius: "6px",
                            fontWeight: "bold",
                            fontSize: "0.85rem",
                            cursor: "pointer",
                          }}
                        >
                          Записаться на этот сектор
                        </button>
                      )}
                    {!selectedSector.cleaned && selectedSector.scanned && (
                      <button
                        onClick={() => handleClean(selectedSector.id)}
                        style={{
                          padding: "0.5rem 1rem",
                          background: "#3b82f6",
                          color: "#fff",
                          border: "none",
                          borderRadius: "6px",
                          fontWeight: "bold",
                          fontSize: "0.85rem",
                          cursor: "pointer",
                        }}
                      >
                        🧹 Провести очистку
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "ai" && (
          <div
            className="glass-card"
            style={{ width: "100%", maxWidth: "850px", textAlign: "left" }}
          >
            <h2 style={{ marginBottom: "0.5rem" }}>
              🧠 Нейросетевой анализ (Яндекс.Облако & СР Дата)
            </h2>
            <p
              style={{
                fontSize: "0.9rem",
                color: "#94a3b8",
                marginBottom: "1.2rem",
              }}
            >
              Автоматическая классификация снимков дистанционного зондирования
              Земли.
            </p>

            <div
              style={{
                background: "#0b130e",
                border: "1px solid rgba(74, 222, 128, 0.2)",
                borderRadius: "0.8rem",
                padding: "1rem",
                fontFamily: "monospace",
                fontSize: "0.85rem",
                color: "#4ade80",
                height: "220px",
                overflowY: "auto",
                marginBottom: "1.2rem",
              }}
            >
              {aiLogs.map((log, idx) => (
                <div
                  key={idx}
                  style={{ marginBottom: "0.4rem" }}
                >{`> ${log}`}</div>
              ))}
            </div>

            <button
              onClick={() =>
                setAiLogs((prev) => [
                  `Перерасчет спектральных индексов NDVI завершен успешно.`,
                  ...prev,
                ])
              }
              style={{
                padding: "0.6rem 1.2rem",
                background: "#4ade80",
                color: "#030712",
                border: "none",
                borderRadius: "0.6rem",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              🔄 Запустить полный анализ облака
            </button>
          </div>
        )}

        {activeTab === "volunteers" && (
          <div
            className="glass-card"
            style={{ width: "100%", maxWidth: "600px", textAlign: "left" }}
          >
            <h2 style={{ marginBottom: "0.5rem" }}>
              👥 Запись на волонтерские акции
            </h2>
            <p
              style={{
                fontSize: "0.9rem",
                color: "#94a3b8",
                marginBottom: "1.2rem",
              }}
            >
              Помогите очистить выбранный по результатам спутникового
              мониторинга сектор.
            </p>

            {volunteerSubmitted ? (
              <div
                style={{
                  background: "rgba(74, 222, 128, 0.15)",
                  border: "1px solid #4ade80",
                  padding: "1.5rem",
                  borderRadius: "0.8rem",
                  textAlign: "center",
                }}
              >
                <h3 style={{ color: "#4ade80", marginBottom: "0.5rem" }}>
                  Заявка успешно отправлена!
                </h3>
                <p style={{ fontSize: "0.9rem", color: "#cbd5e1" }}>
                  Мы забронировали для вас место в экспедиции. Координатор
                  свяжется с вами по почте.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleVolunteerSubmit}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.85rem",
                      marginBottom: "0.4rem",
                      color: "#cbd5e1",
                    }}
                  >
                    Ваше имя:
                  </label>
                  <input
                    type="text"
                    value={volunteerForm.name}
                    onChange={(e) =>
                      setVolunteerForm({
                        ...volunteerForm,
                        name: e.target.value,
                      })
                    }
                    placeholder="Введите имя..."
                    style={{
                      width: "100%",
                      padding: "0.7rem",
                      borderRadius: "0.6rem",
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.15)",
                      color: "#fff",
                      outline: "none",
                    }}
                    required
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.85rem",
                      marginBottom: "0.4rem",
                      color: "#cbd5e1",
                    }}
                  >
                    Электронная почта:
                  </label>
                  <input
                    type="email"
                    value={volunteerForm.email}
                    onChange={(e) =>
                      setVolunteerForm({
                        ...volunteerForm,
                        email: e.target.value,
                      })
                    }
                    placeholder="name@example.com"
                    style={{
                      width: "100%",
                      padding: "0.7rem",
                      borderRadius: "0.6rem",
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.15)",
                      color: "#fff",
                      outline: "none",
                    }}
                    required
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.85rem",
                      marginBottom: "0.4rem",
                      color: "#cbd5e1",
                    }}
                  >
                    Выбрать целевой сектор для очистки:
                  </label>
                  <select
                    value={volunteerForm.sectorId}
                    onChange={(e) =>
                      setVolunteerForm({
                        ...volunteerForm,
                        sectorId: Number(e.target.value),
                      })
                    }
                    style={{
                      width: "100%",
                      padding: "0.7rem",
                      borderRadius: "0.6rem",
                      background: "#112218",
                      border: "1px solid rgba(255,255,255,0.15)",
                      color: "#fff",
                      outline: "none",
                    }}
                  >
                    {sectors
                      .filter((s) => s.volunteerOpen && !s.cleaned)
                      .map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.pollution}) — Свободно мест:{" "}
                          {s.spotsLeft}
                        </option>
                      ))}
                  </select>
                </div>

                <button
                  type="submit"
                  style={{
                    width: "100%",
                    padding: "0.8rem",
                    background: "#4ade80",
                    color: "#030712",
                    border: "none",
                    borderRadius: "0.6rem",
                    fontWeight: "bold",
                    cursor: "pointer",
                    marginTop: "0.5rem",
                  }}
                >
                  ПОДТВЕРДИТЬ УЧАСТИЕ В ЭКСПЕДИЦИИ →
                </button>
              </form>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
