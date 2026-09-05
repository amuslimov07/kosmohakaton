import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import $api from "../http";
import "./VolunteerPages.css";

const missionData = [
  {
    id: 0,
    number: "01",
    title: "Увидеть Землю",
    short: "Спутник как космический бинокль",
    lesson:
      "ДЗЗ — это наблюдение за Землёй с орбиты. Спутник фиксирует отражённый свет и тепловое излучение, а человек учится читать эту информацию как карту состояния территории.",
    visual: {
      src: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1200&q=80",
      alt: "Спутник над Землёй",
      caption:
        "Спутник делает снимки поверхностных изменений, которые можно читать как сигналы о состоянии среды.",
    },
    task: "Что означает термин ДЗЗ?",
    options: [
      "Наблюдение Земли с помощью спутников и космических сенсоров",
      "Система городского транспорта",
      "Простой маршрутный планировщик",
    ],
    answer: 0,
    points: 15,
    feedback: {
      correct:
        "Верно. ДЗЗ помогает видеть изменения на больших территориях и распознавать экологические сигналы до того, как человек увидит их на месте.",
      incorrect:
        "Не совсем. ДЗЗ — это не навигатор и не транспорт, а дистанционное наблюдение Земли со спутников.",
    },
  },
  {
    id: 1,
    number: "02",
    title: "Читать снимок",
    short: "Свет, цвет и тень на изображении",
    lesson:
      "На космическом снимке разные материалы выглядят по-разному: вода тёмная, растительность зелёная, искусственные объекты — светлые или контрастные. Цвет и текстура подсказывают, что находится на земле.",
    visual: {
      src: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1200&q=80",
      alt: "Спутниковый снимок береговой линии",
      caption:
        "На снимке важно замечать контраст: вода, берег, растительность и аномалии резко отличаются по цвету и фактуре.",
    },
    task: "Что на спутниковом снимке чаще всего помогает заметить природную и техногенную разницу?",
    options: [
      "Мелкие детали шрифта в подписи",
      "Контраст цвета, форма и текстура поверхности",
      "Уровень громкости звука",
    ],
    answer: 1,
    points: 15,
    feedback: {
      correct:
        "Верно. Разница в цвете, форме и структуре помогает отличить природные участки от загрязнений или искусственных объектов.",
      incorrect:
        "Обратите внимание на визуальную структуру снимка: не звук, а контраст цвета, форма и текстура поверхности говорят о типе участка.",
    },
  },
  {
    id: 2,
    number: "03",
    title: "Найти проблему",
    short: "Экологические аномалии на снимке",
    lesson:
      "Спутник может показать пятна мазута, зоны скопления мусора, изменение береговой линии или поврежденную растительность. Нужно не просто увидеть пятно, а понять, что оно может означать.",
    visual: {
      src: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80",
      alt: "Экологическая зона с аномалиями на побережье",
      caption:
        "Аномалия не всегда — мусор. Иногда это тень, вода, следы волн или реальная экологическая проблема. Смотрим на контекст.",
    },
    task: "Какая область требует дополнительной проверки специалистом?",
    options: [
      "Участок с темным пятном и резким контрастом на фоне береговой линии",
      "Однородная открытая вода без заметных изменений",
      "Обычная береговая зона с равномерной текстурой",
    ],
    answer: 0,
    points: 20,
    feedback: {
      correct:
        "Верно. Контрастное тёмное пятно на фоне берега часто сигнализирует о потенциальной проблеме и требует проверки данных и маршрута обхода.",
      incorrect:
        "Не совсем. На участке с резким пятном и изменением формы легче заметить потенциальную проблему, чем в ровной, однородной зоне.",
    },
  },
  {
    id: 3,
    number: "04",
    title: "Сравнить во времени",
    short: "История территории в двух снимках",
    lesson:
      "Сравнение снимков до и после помогает увидеть изменение в состоянии участка: появление мусора, исчезновение растительности или рост зоны загрязнения. Это ключевой навык анализа ДЗЗ.",
    visual: {
      src: "https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=1200&q=80",
      alt: "Сравнение территорий до и после",
      caption:
        "Видимое изменение между датами часто говорит не о случайной тени, а о реальном изменении территории.",
    },
    task: "Что лучше показывает изменение территории?",
    options: [
      "Сравнение снимков разных дат в одном районе",
      "Один снимок, сделанный в удобный момент",
      "Только отчёт волонтёров без изображений",
    ],
    answer: 0,
    points: 20,
    feedback: {
      correct:
        "Верно. Сравнение нескольких дат помогает увидеть динамику: рост загрязнения, потерю растительности или эффективность уборки.",
      incorrect:
        "Изменение территории виднее в сравнении временных слоёв, а не в одном снимке без контекста.",
    },
  },
  {
    id: 4,
    number: "05",
    title: "Оптический и SAR",
    short: "Разные датчики, разные сигналы",
    lesson:
      "Оптические снимки похожи на обычную фотографию, а SAR — на радарный сигнал, который иногда видит структуру поверхности даже через облака. У каждого типа данных есть свои преимущества.",
    visual: {
      src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
      alt: "Радарный снимок и оптическая карта земли",
      caption:
        "Оптическое изображение помогает читать цвет и ландшафт, а SAR — понимать рельеф и структуру даже при плохой погоде.",
    },
    task: "Когда SAR особенно полезен?",
    options: [
      "Когда на поверхности много облаков и осадков",
      "Когда нужно запустить новый сервер",
      "Когда требуется только текстовой отчёт",
    ],
    answer: 0,
    points: 20,
    feedback: {
      correct:
        "Верно. SAR особенно полезен в сложных погодных условиях, когда оптическая съёмка может быть скрыта облаками.",
      incorrect:
        "Не совсем. SAR хорош при плохой погоде и для изучения структуры поверхности, а не для серверных задач.",
    },
  },
  {
    id: 5,
    number: "06",
    title: "Понять false color",
    short: "Здоровая растительность и спектры",
    lesson:
      "В спектральных изображениях разные диапазоны света перекладываются в цвета, которые помогают отличать здоровую и повреждённую растительность. Это позволяет видеть экологические изменения раньше, чем они станут заметны невооружённым глазом.",
    visual: {
      src: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&w=1200&q=80",
      alt: "Лес и спутниковый false color",
      caption:
        "В false color здоровая растительность часто выглядит ярче и насыщеннее, чем повреждённые участки.",
    },
    task: "Какой сигнал указывает на проблемный участок растительности?",
    options: [
      "Резкое отличие цвета и насыщенности относительно соседних участков",
      "Отсутствие любых отличий от равномерного фона",
      "Появление одинаковой прозрачности по всей карте",
    ],
    answer: 0,
    points: 20,
    feedback: {
      correct:
        "Верно. Изменение спектральной яркости и различие с соседними участками могут указывать на стресс, деградацию или изменение состояния растительности.",
      incorrect:
        "Сигналом является не отсутствие различий, а заметный контраст и изменение цветовой насыщенности в сравнении с окружающими зонами.",
    },
  },
  {
    id: 6,
    number: "07",
    title: "Выбрать территорию",
    short: "Где нужна проверка на месте",
    lesson:
      "После анализа снимка специалист выбирает наиболее вероятную точку для проверки: там, где есть аномалия, контраст или динамика. Это помогает распределить силы команды и сократить время реагирования.",
    visual: {
      src: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=1200&q=80",
      alt: "Карта с отмеченной точкой проверки",
      caption:
        "Решение «где проверить» строится на данных, а не на интуиции: важно выбрать участок с наибольшей вероятностью реальной проблемы.",
    },
    task: "Что важно сделать после того, как вы заметили потенциальную аномалию на спутниковом снимке?",
    options: [
      "Проверить контекст, сравнить даты и выбрать точку для дальнейшего анализа",
      "Отметить случайную область и забыть про неё",
      "Сразу закрыть всё и ждать следующего месяца",
    ],
    answer: 0,
    points: 20,
    feedback: {
      correct:
        "Верно. Сначала учитывается контекст, затем динамика и только после этого формируется дальнейший маршрут работы.",
      incorrect:
        "Точка на карте нужна не случайно: анализ и сравнение времени позволяют понять, есть ли реальная проблема и насколько она серьёзна.",
    },
  },
  {
    id: 7,
    number: "08",
    title: "Планировать действия",
    short: "От данных к экологической задаче",
    lesson:
      "ДЗЗ не заканчивается на картинке. Данные помогают выбрать участок, оценить масштаб, понять тип проблемы и предложить корректное мероприятие. Это соединяет наблюдение и реальное действие.",
    visual: {
      src: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80",
      alt: "Команда на экологическом мероприятии",
      caption:
        "Наблюдение становится полезным, когда данные и план действий ведут к конкретной экологической задаче и участию команды.",
    },
    task: "Что логично делать после обнаружения проблемной территории по снимку?",
    options: [
      "Выбрать соответствующее мероприятие и проверить маршрут действий",
      "Отключить все данные и начать заново",
      "Считать, что проблема решена без проверки на месте",
    ],
    answer: 0,
    points: 25,
    feedback: {
      correct:
        "Верно. Анализ спутниковых данных должен вести к действию: маршруту, задачам и участникам, которые могут подтвердить или решить проблему.",
      incorrect:
        "Данные не завершаются на изображении: они помогают сформировать реальный ответ и выбрать правильный следующий шаг.",
    },
  },
  {
    id: 8,
    number: "09",
    title: "Проверить себя",
    short: "Мини-исследование на примере",
    lesson:
      "На этом уровне вы уже видите не отдельные факты, а систему: спутниковые данные, аномалия, причина, зона проверки и связанная задача. Важно уметь соединить эти элементы в один вывод.",
    visual: {
      src: "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=1200&q=80",
      alt: "Снимок береговой зоны с отмеченными участками",
      caption:
        "В реальной работе аналитик проверяет как визуальные признаки, так и контекст территории, чтобы сделать обоснованное заключение.",
    },
    task: "Какой вывод наиболее обоснован для участка с изменением верхнего слоя и новым контрастным пятном?",
    options: [
      "На участке вероятна экологическая проблема, требующая дополнительной проверки и привязки к маршруту работ",
      "Это просто декоративная особенность карты, которой не стоит уделять внимание",
      "Проблема уже решена, потому что на снимке есть контраст",
    ],
    answer: 0,
    points: 25,
    feedback: {
      correct:
        "Верно. Поскольку есть визуальное изменение и перспективный участок, логично считать это потенциальной проблемой и организовать дополнительную проверку.",
      incorrect:
        "Контраст на снимке — это повод для осмысления, а не основание считать всё безопасным. Сигнал требует проверки, а не игнорирования.",
    },
  },
  {
    id: 9,
    number: "10",
    title: "Экологический патруль",
    short: "Финальная миссия курса",
    lesson:
      "Теперь вы умеете замечать визуальные признаки, сравнивать даты и понимать, куда двигаться дальше. Завершающая миссия — это проверка, что вы можете соединить анализ изображения с решением экологической задачи.",
    visual: {
      src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
      alt: "Карта с экологическим анализом",
      caption:
        "На финише вы должны не просто увидеть проблему, а объяснить, почему она имеет значение и куда направить усилия команды.",
    },
    task: "Какой вывод продемонстрирует уверенное понимание ДЗЗ?",
    options: [
      "Я вижу отличие по цвету, объясняю его и понимаю, какие действия необходимы дальше",
      "Я игнорирую контраст и жду, пока кто-то другой решит задачу",
      "Я считаю, что спутниковые данные — это просто красивые картинки без значения",
    ],
    answer: 0,
    points: 30,
    feedback: {
      correct:
        "Верно. Умение увидеть, объяснить и перейти к действиям — это основа анализа спутниковых данных и экологической работы на практике.",
      incorrect:
        "Смысл ДЗЗ в том, чтобы не просто смотреть на картинки, а использовать их для формулировки проблемы и выбора дальнейшего шага.",
    },
  },
];

const finalLevels = [
  {
    id: "basics",
    title: "Уровень 1 — Основы",
    description:
      "Проверка базового понимания ДЗЗ и принципов спутникового наблюдения.",
    threshold: 70,
    questions: [
      {
        id: "q1",
        prompt: "Что такое ДЗЗ в практическом смысле?",
        options: [
          "Система наблюдения Земли с помощью спутников и космических сенсоров",
          "Платёжная система для космических сервисов",
          "Метод сортировки мусора вручную",
        ],
        answer: 0,
        explanation:
          "ДЗЗ — это дистанционное зондирование Земли: спутники регистрируют данные о поверхности без необходимости находиться на месте.",
      },
      {
        id: "q2",
        prompt:
          "Какие типы данных чаще всего используются для анализа земной поверхности?",
        options: [
          "Оптические снимки и SAR",
          "Только текстовые отчёты",
          "Только метеорологические карты",
        ],
        answer: 0,
        explanation:
          "Оптические изображения сохраняют визуальную картину поверхности, а SAR помогает видеть структуру и детали даже в сложных погодных условиях.",
      },
      {
        id: "q3",
        prompt:
          "Что обычно помогает отличить участок загрязнения от обычного фона?",
        options: [
          "Контраст, цвет, форма и текстура поверхности",
          "Только время суток",
          "Количество подписей на карте",
        ],
        answer: 0,
        explanation:
          "Контраст и визуальная структура часто указывают на аномалию или изменение состояния территории, а не на обычный фон.",
      },
    ],
  },
  {
    id: "analysis",
    title: "Уровень 2 — Анализ",
    description:
      "Сравнение снимков, поиск изменений и выбор наиболее вероятного объяснения.",
    threshold: 70,
    questions: [
      {
        id: "q1",
        prompt:
          "Почему сравнение снимков разных дат важно для анализа территории?",
        options: [
          "Потому что помогает увидеть динамику и реальные изменения на участке",
          "Потому что ускоряет работу карты и не даёт ошибок",
          "Потому что рисунок всегда выглядит одинаково в разные даты",
        ],
        answer: 0,
        explanation:
          "Сравнение временных слоёв позволяет понять, есть ли рост загрязнения, изменение растительности или сезонная динамика.",
      },
      {
        id: "q2",
        prompt:
          "Какой вывод наиболее обоснован, если на участке появилось ярко выраженное пятно в районе берега?",
        options: [
          "Это возможная экологическая аномалия, требующая проверки и дальнейшей оценки",
          "Это всегда декоративный элемент карты",
          "Это обязательно связано с погодой и не требует действий",
        ],
        answer: 0,
        explanation:
          "Появление яркого пятна — повод для проверки, потому что оно может быть связанно с загрязнением или изменением состояния территории.",
      },
      {
        id: "q3",
        prompt: "Что важно помнить при интерпретации спутниковых данных?",
        options: [
          "Нужно учитывать контекст, сравнение с соседними зонами и возможные причины изменения",
          "Если объект хорошо видно, можно не проверять его причинную природу",
          "Подпись на карте всегда полностью объясняет ситуацию",
        ],
        answer: 0,
        explanation:
          "Снимок — это сигнал, а не окончательный вердикт. Для правильной интерпретации нужен контекст и проверка гипотез.",
      },
    ],
  },
  {
    id: "practice",
    title: "Уровень 3 — Практика",
    description:
      "Мини-симулятор: определить риск, выбрать дальнейшее действие и объяснить выбор.",
    threshold: 70,
    questions: [
      {
        id: "q1",
        prompt:
          "Представьте, что на берегу заметно изменение цвета и повышенная контрастность участка в сравнении с соседними зонами. Что наиболее корректно сделать?",
        options: [
          "Включить анализ, сравнить временные снимки и определить возможную экологическую проблему для проверки",
          "Считать участок безопасным, потому что он расположен рядом с берегом",
          "Игнорировать изменение и продолжать без заметок",
        ],
        answer: 0,
        explanation:
          "Наиболее корректный путь — анализ, сравнение и оценка вероятности проблемы, а не случайное игнорирование или поспешная трактовка.",
      },
      {
        id: "q2",
        prompt:
          "Если на участке видна аномалия, но вы не уверены в природе проблемы, какой следующий шаг логичен?",
        options: [
          "Выбрать зону для дополнительной проверки и подготовить маршрут действий",
          "Сказать, что данных недостаточно, и закрыть задачу",
          "Сразу объявить проблему без анализа",
        ],
        answer: 0,
        explanation:
          "Правильная реакция — не паника и не бездействие, а дополнительная проверка и подготовка участков для дальнейшего решения.",
      },
      {
        id: "q3",
        prompt:
          "Что показывает практическое понимание ДЗЗ в экологической работе?",
        options: [
          "Способность увидеть изменение, объяснить вероятность проблемы и связать её с реальным действием",
          "Умение только узнавать название спутника",
          "Возможность создавать красивые фото без анализа",
        ],
        answer: 0,
        explanation:
          "Главное — не просто знать термин, а уметь применять спутниковые данные для выявления проблемы и решения задачи.",
      },
    ],
  },
];

const getSavedProgress = () => {
  try {
    const raw = window.localStorage.getItem("dzz-mission-progress");
    if (!raw) return { completedModules: [], points: 0, status: "not-started" };
    return JSON.parse(raw);
  } catch {
    return { completedModules: [], points: 0, status: "not-started" };
  }
};

const persistProgress = (progressState) => {
  try {
    window.localStorage.setItem(
      "dzz-mission-progress",
      JSON.stringify(progressState),
    );
  } catch {
    // ignore local storage write errors in demo mode
  }
};

const readCertification = () => {
  try {
    return window.localStorage.getItem("dzz-specialist-certified") === "true";
  } catch {
    return false;
  }
};

const setCertification = (value) => {
  try {
    window.localStorage.setItem("dzz-specialist-certified", String(value));
  } catch {
    // ignore local storage write errors in demo mode
  }
};

export default function Education() {
  const [course] = useState({
    id: "course-dzz-101",
    title: "ДЗЗ: путь от наблюдения к действию",
    description:
      "Миссии для новичка: от знакомства с спутниковым снимком до анализа экологических изменений и выбора дальнейшего шага.",
    modules: missionData,
  });
  const [progress, setProgress] = useState(getSavedProgress);
  const [activeMission, setActiveMission] = useState(0);
  const [viewMode, setViewMode] = useState("training");
  const [missionFeedback, setMissionFeedback] = useState(null);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [assessmentState, setAssessmentState] = useState({
    currentLevel: 0,
    answers: {},
    results: {},
  });
  const [isCertified, setIsCertified] = useState(readCertification());

  useEffect(() => {
    Promise.all([
      $api.get("/education/courses/course-dzz-101").catch(() => null),
      $api.get("/education/progress").catch(() => null),
    ]).then(([courseResponse, progressResponse]) => {
      if (courseResponse?.data) {
        // Keep the existing backend course shape, but render the mission-based experience.
      }
      if (progressResponse?.data) {
        const incoming = {
          completedModules: progressResponse.data.completedModules || [],
          points: progressResponse.data.points || 0,
          status: progressResponse.data.status || "in-progress",
        };
        setProgress((previous) => ({
          ...previous,
          ...incoming,
          completedModules: incoming.completedModules.length
            ? incoming.completedModules
            : previous.completedModules,
        }));
      }
    });
  }, []);

  useEffect(() => {
    persistProgress(progress);
  }, [progress]);

  useEffect(() => {
    const passed = Object.values(assessmentState.results).filter(
      (result) => result?.passed,
    ).length;
    const allComplete = passed === finalLevels.length;
    setIsCertified(allComplete);
    setCertification(allComplete);
  }, [assessmentState.results]);

  const mission = course.modules[activeMission];
  const completedCount = progress.completedModules.length;
  const totalProgress = Math.round(
    ((completedCount +
      Object.keys(assessmentState.results).filter(
        (key) => assessmentState.results[key]?.passed,
      ).length) /
      (course.modules.length + finalLevels.length)) *
      100,
  );

  const handleMissionAnswer = (selectedIndex) => {
    if (selectedIndex === mission.answer) {
      setProgress((previous) => {
        const alreadyCompleted = previous.completedModules.includes(mission.id);
        const completedModules = alreadyCompleted
          ? previous.completedModules
          : [...previous.completedModules, mission.id];
        const nextPoints = alreadyCompleted
          ? previous.points
          : previous.points + mission.points;
        const nextStatus =
          completedModules.length === course.modules.length
            ? "completed"
            : "in-progress";

        return {
          completedModules,
          points: nextPoints,
          status: nextStatus,
        };
      });
      setMissionFeedback({
        correct: true,
        message: mission.feedback.correct,
      });
      return;
    }

    setMissionFeedback({
      correct: false,
      message: mission.feedback.incorrect,
    });
  };

  const openTaskModal = () => {
    setTaskModalOpen(true);
    setMissionFeedback(null);
  };

  const closeTaskModal = () => {
    setTaskModalOpen(false);
  };

  const handleTaskSubmit = (selectedIndex) => {
    handleMissionAnswer(selectedIndex);
  };

  const updateAssessmentAnswer = (levelId, questionId, answerIndex) => {
    setAssessmentState((previous) => ({
      ...previous,
      answers: {
        ...previous.answers,
        [levelId]: {
          ...(previous.answers[levelId] || {}),
          [questionId]: answerIndex,
        },
      },
    }));
  };

  const submitLevel = (levelIndex) => {
    const level = finalLevels[levelIndex];
    const answers = assessmentState.answers[level.id] || {};
    let correct = 0;
    level.questions.forEach((question) => {
      if (answers[question.id] === question.answer) correct += 1;
    });

    const score = Math.round((correct / level.questions.length) * 100);
    const passed = score >= level.threshold;

    setAssessmentState((previous) => ({
      ...previous,
      currentLevel: Math.min(levelIndex + 1, finalLevels.length - 1),
      results: {
        ...previous.results,
        [level.id]: {
          score,
          passed,
          correct,
          total: level.questions.length,
        },
      },
    }));
  };

  const completedLevels = Object.keys(assessmentState.results).filter(
    (key) => assessmentState.results[key]?.passed,
  ).length;

  return (
    <main className="volunteer-page mission-page-shell">
      <div className="volunteer-shell mission-shell">
        <div className="mission-hero">
          <div>
            <span className="eyebrow">Образовательный путь</span>
            <h1>{course.title}</h1>
            <p>{course.description}</p>
          </div>
          <div className="mission-summary">
            <strong>{totalProgress}%</strong>
            <span>
              {isCertified
                ? "Навык подтверждён"
                : completedCount === 0
                  ? "Курс не начат"
                  : "Путь в процессе"}
            </span>
            <div className="progress-track">
              <i style={{ width: `${totalProgress}%` }} />
            </div>
            <small>
              {completedCount}/{course.modules.length} миссий ·{" "}
              {progress.points} очков
            </small>
          </div>
        </div>

        <div className="mission-status-strip">
          <div>
            <span>Миссии</span>
            <strong>
              {completedCount}/{course.modules.length}
            </strong>
          </div>
          <div>
            <span>Баллы</span>
            <strong>{progress.points}</strong>
          </div>
          <div>
            <span>Проверка</span>
            <strong>
              {completedLevels}/{finalLevels.length}
            </strong>
          </div>
          <div>
            <span>Статус</span>
            <strong>{isCertified ? "Специалист" : "В обучении"}</strong>
          </div>
        </div>

        <div className="mode-switcher">
          <button
            className={viewMode === "training" ? "active" : ""}
            onClick={() => setViewMode("training")}
          >
            Обучение
          </button>
          <button
            className={viewMode === "exam" ? "active" : ""}
            onClick={() => setViewMode("exam")}
          >
            Экзамен
          </button>
        </div>

        {viewMode === "training" && (
          <>
            <div className="learning-layout mission-layout">
              <aside className="module-list mission-list">
                {course.modules.map((item, index) => (
                  <button
                    className={activeMission === index ? "selected" : ""}
                    onClick={() => setActiveMission(index)}
                    key={item.id}
                  >
                    <span>
                      {progress.completedModules.includes(item.id)
                        ? "✓"
                        : item.number}
                    </span>
                    <div>
                      <strong>{item.title}</strong>
                      <small>
                        {progress.completedModules.includes(item.id)
                          ? "Пройдено"
                          : `${item.points} очков`}
                      </small>
                    </div>
                  </button>
                ))}
              </aside>

              <section className="lesson-card mission-card">
                <span className="section-kicker">
                  {mission.number} · {mission.short}
                </span>
                <h2>{mission.title}</h2>
                <p className="lesson-description">{mission.lesson}</p>

                <div className="mission-visual">
                  <img src={mission.visual.src} alt={mission.visual.alt} />
                  <div className="mission-visual-caption">
                    <strong>Что нужно увидеть</strong>
                    <p>{mission.visual.caption}</p>
                  </div>
                </div>

                <div className="task-preview">
                  <span className="section-kicker">Задача по теме</span>
                  <p>
                    После изучения материала вы получите короткое практическое
                    задание, которое поможет закрепить навык на конкретном
                    примере.
                  </p>
                </div>

                {missionFeedback && (
                  <div
                    className={
                      missionFeedback.correct
                        ? "quiz-message success"
                        : "quiz-message"
                    }
                  >
                    {missionFeedback.message}
                  </div>
                )}

                <div className="mission-footer">
                  <span>
                    {progress.completedModules.includes(mission.id)
                      ? "Миссия выполнена"
                      : "Доступна к прохождению"}
                  </span>
                  <button className="primary-button" onClick={openTaskModal}>
                    Следующий уровень →
                  </button>
                </div>
              </section>
            </div>
          </>
        )}

        {viewMode === "exam" && (
          <section className="final-check">
            <div className="section-header">
              <div>
                <span className="section-kicker">Проверка навыков ДЗЗ</span>
                <h2>3 уровня сертификации</h2>
              </div>
              <span className="status-badge">
                {isCertified
                  ? "🛰️ Специалист по ДЗЗ"
                  : "Навык ещё не подтверждён"}
              </span>
            </div>

            <div className="assessment-tabs">
              {finalLevels.map((level, index) => (
                <button
                  key={level.id}
                  className={
                    assessmentState.currentLevel === index ? "selected" : ""
                  }
                  onClick={() =>
                    setAssessmentState((previous) => ({
                      ...previous,
                      currentLevel: index,
                    }))
                  }
                >
                  {level.title}
                </button>
              ))}
            </div>

            {finalLevels.map((level, index) => {
              const isActive = assessmentState.currentLevel === index;
              const result = assessmentState.results[level.id];

              return (
                <div
                  className={
                    isActive ? "assessment-panel active" : "assessment-panel"
                  }
                  key={level.id}
                >
                  <div className="assessment-panel-header">
                    <div>
                      <h3>{level.title}</h3>
                      <p>{level.description}</p>
                    </div>
                    {result && (
                      <span
                        className={
                          result.passed ? "score success" : "score warning"
                        }
                      >
                        {result.score}%
                      </span>
                    )}
                  </div>

                  <div className="assessment-questions">
                    {level.questions.map((question) => (
                      <div key={question.id} className="assessment-question">
                        <p>{question.prompt}</p>
                        <div className="quiz-options vertical-options">
                          {question.options.map((option, optionIndex) => (
                            <button
                              key={option}
                              className={
                                (assessmentState.answers[level.id]?.[
                                  question.id
                                ] ?? null) === optionIndex
                                  ? "selected"
                                  : ""
                              }
                              onClick={() =>
                                updateAssessmentAnswer(
                                  level.id,
                                  question.id,
                                  optionIndex,
                                )
                              }
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="assessment-footer">
                    {result && (
                      <div className="assessment-result">
                        <strong>
                          {result.passed
                            ? "Уровень пройден"
                            : "Нужно повторить материал"}
                        </strong>
                        <span>
                          {result.correct}/{result.total} правильных ответов ·{" "}
                          {result.score}%
                        </span>
                        <small>
                          {result.passed
                            ? "Отлично. Вы демонстрируете понимание принципов ДЗЗ и анализа данных."
                            : "Проверьте тему ещё раз и повторите соответствующие миссии, затем попробуйте снова."}
                        </small>
                      </div>
                    )}
                    <button
                      className="primary-button"
                      onClick={() => submitLevel(index)}
                    >
                      Проверить уровень
                    </button>
                  </div>
                </div>
              );
            })}
          </section>
        )}

        {isCertified && (
          <section className="completion-cta mission-completion">
            <div>
              <span className="section-kicker">Навык подтверждён</span>
              <h2>🛰️ Специалист по ДЗЗ</h2>
              <p>
                Курс ДЗЗ пройден. Финальная проверка пройдена. Навык анализа
                спутниковых данных подтверждён.
              </p>
            </div>
            <div className="completion-actions">
              <Link className="primary-button" to="/territory-dashboard">
                К проблемным территориям →
              </Link>
              <Link className="outline-button" to="/events">
                К экологическим мероприятиям →
              </Link>
            </div>
          </section>
        )}
      </div>

      {taskModalOpen && (
        <div className="task-modal-backdrop" onClick={closeTaskModal}>
          <div
            className="task-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="task-modal-header">
              <div>
                <span className="section-kicker">Задача по теме</span>
                <h3>{mission.title}</h3>
              </div>
              <button className="close-modal" onClick={closeTaskModal}>
                ×
              </button>
            </div>

            <p className="task-modal-question">{mission.task}</p>

            <div className="quiz-options vertical-options compact-list">
              {mission.options.map((option, index) => (
                <button
                  key={option}
                  onClick={() => {
                    handleTaskSubmit(index);
                  }}
                >
                  {option}
                </button>
              ))}
            </div>

            {missionFeedback && (
              <div
                className={
                  missionFeedback.correct
                    ? "quiz-message success"
                    : "quiz-message"
                }
              >
                {missionFeedback.message}
              </div>
            )}

            <div className="task-modal-actions">
              <button className="outline-button" onClick={closeTaskModal}>
                Закрыть
              </button>
              <button
                className="primary-button"
                onClick={() => {
                  setTaskModalOpen(false);
                  setActiveMission((previous) =>
                    Math.min(previous + 1, course.modules.length - 1),
                  );
                }}
              >
                Продолжить →
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
