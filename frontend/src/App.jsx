import React, { useState } from 'react';

export default function App() {
  const [loading, setLoading] = useState(false);

  const handleStartGame = () => {
    setLoading(true);
    alert('🚀 Игра запускается!');
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
          <div className="logo-icon">⚡</div>
          <span>KOSMO<span style={{ color: '#22d3ee' }}>HAKATON</span></span>
        </div>
        <div className="server-status">
          ● Сервер подключен
        </div>
      </header>

      {/* Центральный контент */}
      <main>
        <div className="glass-card">
          <div className="badge">MVP Release v1.0</div>
          <h1>Интерактивный Космический Симулятор</h1>
          <p>
            Добро пожаловать в веб-приложение! Пройдите серию испытаний, накапливайте очки и взаимодействуйте с системой в режиме реального времени.
          </p>
          <div className="card-footer">
            <div>Статус: <b>Готов к старту</b></div>
            <div>Пинг: <b style={{ color: '#34d399' }}>~12 ms</b></div>
          </div>
        </div>

        <button className="start-btn" onClick={handleStartGame} disabled={loading}>
          {loading ? 'ЗАГРУЗКА...' : 'ЗАПУСТИТЬ ИГРУ →'}
        </button>
      </main>
    </div>
  );
}