import React, { useState } from 'react';

export default function App() {
  const [loading, setLoading] = useState(false);

  const handleStartGame = () => {
    setLoading(true);
    alert('🌱 Уборка начинается!');
    setLoading(false);
  };

  return (
    <div>
      {/* Видеофон */}
      <div className="bg-container">
        <video autoPlay loop muted playsInline>
          <source src="https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-background-1610-large.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Шапка */}
      <header>
        <div className="logo">
          <div className="logo-icon">
            {/* Иконка бутылки */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 2h4v2h-4z"/>
              <path d="M9 4h6v3a2 2 0 0 1 1 1.73V20a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V8.73A2 2 0 0 1 9 7V4z"/>
            </svg>
          </div>
          <span>ЧИСТЫЙ<span style={{ color: '#4ade80' }}>БЕРЕГ</span></span>
        </div>
      </header>

      {/* Центральный контент */}
      <main>
        <div className="glass-card">
          <div className="badge">Эко-Проект v1.0</div>
          <h1>Чистый Берег</h1>
          <p>
            Добро пожаловать в приложение! Очистите побережье от мусора, сортируйте отходы и сделайте мир чище в интерактивном режиме. Это приложение может служить обучением для тех, кто заинтересован в том, чтобы сделать реальный мир чище и экологичнее.
          </p>
        </div>

        <button className="start-btn" onClick={handleStartGame} disabled={loading}>
          {loading ? 'ЗАГРУЗКА...' : 'НАЧАТЬ УБОРКУ →'}
        </button>
      </main>
    </div>
  );
}