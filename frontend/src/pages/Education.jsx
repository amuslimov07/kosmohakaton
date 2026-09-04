import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import $api from "../http";
import "./VolunteerPages.css";

const fallbackCourse = {
  id: "course-dzz-101",
  title: "Взгляд из космоса",
  description:
    "Интерактивный курс о ДЗЗ: от космического бинокля до экологического патруля.",
  modules: [
    [
      "Космический бинокль",
      "Что такое ДЗЗ простыми словами.",
      "ДЗЗ — это космический бинокль: спутники изучают Землю издалека и делают подробные снимки природы.",
      "Что такое ДЗЗ?",
      [
        "Способ изучать Землю со спутников",
        "Только прогноз погоды",
        "Наземный фотоаппарат",
      ],
      0,
    ],
    [
      "Как спутники видят невидимое",
      "Принципы работы сенсоров.",
      "Спутники улавливают не только обычный свет: специальные приборы измеряют температуру воды и почвы даже сквозь облака.",
      "Что могут измерять специальные приборы?",
      [
        "Только размер фотографии",
        "Температуру воды и почвы",
        "Число волонтёров",
      ],
      1,
    ],
    [
      "Разные ракурсы: фото и радары",
      "Главные технологии космической съёмки.",
      "Обычная съёмка показывает цвет поверхности, а радар определяет рельеф при любой погоде.",
      "Что делает радар?",
      ["Определяет рельеф по сигналу", "Меняет цвет карты", "Удаляет облака"],
      0,
    ],
    [
      "Космический сыщик",
      "Как находить экологические проблемы.",
      "Спутник фиксирует пятна мазута, скопления пластика и передаёт экологам координаты.",
      "Что может заметить спутник?",
      ["Только здания", "Мазутные пятна и пластик", "Пароли пользователей"],
      1,
    ],
    [
      "Умный помощник",
      "Как компьютер анализирует снимки.",
      "Программы быстро просматривают тысячи кадров и подсвечивают найденный мусор.",
      "Зачем нужен компьютерный анализ?",
      [
        "Чтобы быстро найти объекты",
        "Чтобы заменить спутники",
        "Чтобы выключить карту",
      ],
      0,
    ],
    [
      "Спасательная миссия",
      "Практика планирования.",
      "По снимку с отмеченной зоной команда выбирает быстрый маршрут по побережью.",
      "Что нужно спланировать?",
      ["Маршрут до проблемной зоны", "Новую соцсеть", "Цвет формы"],
      0,
    ],
    [
      "Машина времени для планеты",
      "Сравниваем природу во времени.",
      "Архивные снимки показывают, становится ли берег чище после уборок.",
      "Зачем сравнивать снимки дат?",
      [
        "Чтобы увидеть изменения",
        "Чтобы увеличить файл",
        "Чтобы скрыть результат",
      ],
      0,
    ],
    [
      "Секреты цвета",
      "Анализируем спектры.",
      "Специальные снимки помогают отличать здоровые растения от повреждённых участков.",
      "Что различают спектры?",
      [
        "Состояние природы и загрязнений",
        "Только время суток",
        "Количество снимков",
      ],
      0,
    ],
    [
      "Команда спасения",
      "Роль волонтёров.",
      "Волонтёры используют спутниковые карты, чтобы проводить субботники там, где помощь нужнее всего.",
      "Кто превращает данные в действия?",
      ["Волонтёры и экологи", "Только камера", "Случайный алгоритм"],
      0,
    ],
    [
      "Экологический патруль",
      "Итоговая проверка.",
      "В финале нужно отличить природную тень от настоящего мусора на космической карте.",
      "Что проверяет итоговый уровень?",
      ["Умение применять логику ДЗЗ", "Скорость печати", "Настройки телефона"],
      0,
      20,
    ],
  ].map(
    (
      [title, description, lesson, question, options, answer, points = 10],
      id,
    ) => ({
      id,
      title,
      description,
      lesson,
      question,
      options,
      answer,
      points,
    }),
  ),
};

export default function Education() {
  const [course, setCourse] = useState(fallbackCourse);
  const [progress, setProgress] = useState({
    completedModules: [],
    points: 0,
    status: "not-started",
  });
  const [active, setActive] = useState(0);
  const [message, setMessage] = useState("");

  useEffect(() => {
    Promise.all([
      $api.get("/education/courses/course-dzz-101"),
      $api.get("/education/progress"),
    ])
      .then(([courseResponse, progressResponse]) => {
        setCourse(courseResponse.data);
        setProgress(progressResponse.data);
      })
      .catch(() => {});
  }, []);

  const module = course.modules[active];
  const submit = async (answer) => {
    try {
      const response = await $api.post(
        `/education/courses/${course.id}/modules/${module.id}`,
        { answer },
      );
      setProgress(response.data);
      setMessage(
        response.data.correct
          ? `Верно. +${module.points} баллов`
          : "Пока не получилось. Изучите материал и попробуйте ещё раз.",
      );
      if (response.data.correct && active < course.modules.length - 1)
        setActive(active + 1);
    } catch {
      setMessage("Не удалось сохранить результат. Попробуйте ещё раз.");
    }
  };
  const percent = Math.round(
    (progress.completedModules.length / course.modules.length) * 100,
  );

  return (
    <main className="volunteer-page">
      <div className="volunteer-shell">
        <div className="volunteer-hero">
          <div>
            <span className="eyebrow">Обучение</span>
            <h1>{course.title}</h1>
            <p>{course.description}</p>
          </div>
          <div className="course-status">
            <strong>{percent}%</strong>
            <span>
              {progress.status === "not-started"
                ? "Не начат"
                : progress.status === "completed"
                  ? "Завершён"
                  : "В процессе"}
            </span>
            <div className="progress-track">
              <i style={{ width: `${percent}%` }} />
            </div>
            <small>{progress.points} баллов обучения</small>
          </div>
        </div>
        <div className="learning-layout">
          <aside className="module-list">
            {course.modules.map((item, index) => (
              <button
                className={active === index ? "selected" : ""}
                onClick={() => setActive(index)}
                key={item.id}
              >
                <span>
                  {progress.completedModules.includes(item.id)
                    ? "✓"
                    : String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <strong>{item.title}</strong>
                  <small>
                    {progress.completedModules.includes(item.id)
                      ? "Пройдено"
                      : `${item.points} баллов`}
                  </small>
                </div>
              </button>
            ))}
          </aside>
          <section className="lesson-card">
            <span className="section-kicker">
              Модуль {active + 1} из {course.modules.length}
            </span>
            <h2>{module.title}</h2>
            <p className="lesson-description">{module.description}</p>
            <div className="lesson-content">
              <p>{module.lesson}</p>
            </div>
            <div className="quiz">
              <span className="section-kicker">Проверьте себя</span>
              <h3>{module.question}</h3>
              <div className="quiz-options">
                {module.options.map((option, index) => (
                  <button key={option} onClick={() => submit(index)}>
                    {option}
                  </button>
                ))}
              </div>
              {message && <p className="quiz-message">{message}</p>}
            </div>
          </section>
        </div>
        <section className="practice-section">
          <div>
            <span className="section-kicker">Практикум после курса</span>
            <h2>Грязно или чисто?</h2>
            <p>
              Научитесь отличать естественный берег от экологической аномалии по
              космическому снимку.
            </p>
          </div>
          <div className="practice-cards">
            <article>
              <div className="practice-image clean-image">
                <span>Вода прозрачная · берег ровный</span>
              </div>
              <strong>Карточка 1</strong>
              <p>Дикий песчаный пляж без посторонних предметов.</p>
              <button
                onClick={() =>
                  setMessage("Верно: это чистый участок. +10 баллов")
                }
              >
                Чисто
              </button>
            </article>
            <article>
              <div className="practice-image dirty-image">
                <span>Тёмные пятна · скопление точек</span>
              </div>
              <strong>Карточка 2</strong>
              <p>Аномалии резко выделяются на фоне песка и воды.</p>
              <button
                onClick={() =>
                  setMessage("Верно: это загрязнённый участок. +10 баллов")
                }
              >
                Грязно
              </button>
            </article>
          </div>
          {message && <p className="quiz-message">{message}</p>}
        </section>
        {progress.status === "completed" && (
          <section className="completion-cta">
            <div>
              <span className="section-kicker">Курс завершён</span>
              <h2>Теперь найдите реальную задачу рядом</h2>
              <p>
                Ваш следующий шаг: выбрать участок, изучить его и записаться на
                экологическую акцию.
              </p>
            </div>
            <Link className="primary-button" to="/events">
              Найти мероприятие →
            </Link>
          </section>
        )}
      </div>
    </main>
  );
}
