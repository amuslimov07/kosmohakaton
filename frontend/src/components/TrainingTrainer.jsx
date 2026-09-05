import { useState } from "react";
import "./TrainingTrainer.css";

const trainingTasks = [
  {
    id: "shore-01",
    leftImage:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQW3w5CX5c6LwC2f0gpcbgnf-dW5RQ0STVg968qR33pZQ&s=10",
    leftCorrectAnswer: "clean",
    rightImage:
      "https://ocean.ru/media/k2/items/cache/2955874dabdd61fd763b543a1fbf3447_XL.jpg",
    rightCorrectAnswer: "dirty",
  },
  {
    id: "shore-02",
    leftImage:
      "https://ocean.ru/media/k2/items/cache/2955874dabdd61fd763b543a1fbf3447_XL.jpg",
    leftCorrectAnswer: "dirty",
    rightImage:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQW3w5CX5c6LwC2f0gpcbgnf-dW5RQ0STVg968qR33pZQ&s=10",
    rightCorrectAnswer: "clean",
  },
  {
    id: "shore-03",
    leftImage:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQW3w5CX5c6LwC2f0gpcbgnf-dW5RQ0STVg968qR33pZQ&s=10",
    leftCorrectAnswer: "clean",
    rightImage:
      "https://ocean.ru/media/k2/items/cache/2955874dabdd61fd763b543a1fbf3447_XL.jpg",
    rightCorrectAnswer: "dirty",
  },
];

const answerLabels = { clean: "Чисто", dirty: "Грязно" };
const statsKey = "dzz-training-stats";

const readStats = () => {
  try {
    return JSON.parse(localStorage.getItem(statsKey)) || { streak: 0, best: 0 };
  } catch {
    return { streak: 0, best: 0 };
  }
};

export default function TrainingTrainer() {
  const [taskIndex, setTaskIndex] = useState(0);
  const [answers, setAnswers] = useState({ left: null, right: null });
  const [result, setResult] = useState(null);
  const [stats, setStats] = useState(readStats);
  const task = trainingTasks[taskIndex];

  const chooseAnswer = (side, answer) => {
    if (result) return;
    setAnswers((previous) => ({ ...previous, [side]: answer }));
  };

  const checkTask = () => {
    if (!answers.left || !answers.right || result) return;

    const nextResult = {
      left: answers.left === task.leftCorrectAnswer,
      right: answers.right === task.rightCorrectAnswer,
    };
    const taskCorrect = nextResult.left && nextResult.right;
    const nextStats = {
      streak: taskCorrect ? stats.streak + 1 : 0,
      best: Math.max(stats.best, taskCorrect ? stats.streak + 1 : stats.best),
    };

    setResult(nextResult);
    setStats(nextStats);
    localStorage.setItem(statsKey, JSON.stringify(nextStats));
  };

  const nextTask = () => {
    setTaskIndex((previous) => (previous + 1) % trainingTasks.length);
    setAnswers({ left: null, right: null });
    setResult(null);
  };

  const renderImageCard = (side, image, correctAnswer) => {
    const selectedAnswer = answers[side];
    const isCorrect = result?.[side];
    const hasResult = result !== null;

    return (
      <article className="training-image-card">
        <div className="training-image-frame">
          <img src={image} alt="Спутниковый снимок береговой зоны" />
        </div>
        <div className="training-answer-buttons">
          {Object.entries(answerLabels).map(([answer, label]) => (
            <button
              className={`${selectedAnswer === answer ? "selected" : ""} ${
                hasResult && selectedAnswer === answer
                  ? isCorrect
                    ? "correct"
                    : "incorrect"
                  : ""
              }`}
              disabled={hasResult}
              key={answer}
              onClick={() => chooseAnswer(side, answer)}
            >
              {label}
            </button>
          ))}
        </div>
        {hasResult && (
          <div className={`training-result ${isCorrect ? "success" : "error"}`}>
            <strong>{isCorrect ? "✓ Верно" : "✕ Ошибка"}</strong>
            {!isCorrect && (
              <span>Правильный ответ: {answerLabels[correctAnswer]}</span>
            )}
          </div>
        )}
      </article>
    );
  };

  return (
    <section className="training-trainer">
      <div className="training-trainer-heading">
        <div>
          <span className="section-kicker">Практика анализа</span>
          <h2>Тренажёр береговой линии</h2>
          <p>Определите состояние территории по спутниковым снимкам.</p>
        </div>
        <div className="training-stats" aria-label="Статистика серии">
          <div>
            <strong>🔥 {stats.streak}</strong>
            <span>Серия</span>
          </div>
          <div>
            <strong>🏆 {stats.best}</strong>
            <span>Рекорд</span>
          </div>
        </div>
      </div>

      <div className="training-task-grid">
        {renderImageCard("left", task.leftImage, task.leftCorrectAnswer)}
        <div className="training-check-column">
          {!result ? (
            <button
              className="primary-button training-check-button"
              disabled={!answers.left || !answers.right}
              onClick={checkTask}
            >
              Проверить
            </button>
          ) : (
            <button
              className="primary-button training-check-button"
              onClick={nextTask}
            >
              Следующая задача
            </button>
          )}
        </div>
        {renderImageCard("right", task.rightImage, task.rightCorrectAnswer)}
      </div>
    </section>
  );
}
