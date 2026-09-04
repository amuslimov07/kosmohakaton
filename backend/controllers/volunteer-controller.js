const { randomUUID } = require("crypto");

const courses = [
  {
    id: "course-dzz-101",
    title: "ДЗЗ: как увидеть изменения природы",
    description:
      "Короткий курс о спутниковом мониторинге, экологических аномалиях и действиях волонтёра.",
    modules: [
      {
        id: 0,
        title: "Что такое ДЗЗ",
        description:
          "Дистанционное зондирование Земли помогает наблюдать территорию без выезда на каждый участок.",
        lesson:
          "Спутник фиксирует отражение и излучение поверхности, а аналитика находит изменения.",
        question: "Что помогает увидеть ДЗЗ?",
        options: [
          "Только прогноз погоды",
          "Изменения поверхности территории",
          "Количество зарегистрированных волонтёров",
        ],
        answer: 1,
        points: 10,
      },
      {
        id: 1,
        title: "Читаем аномалию",
        description:
          "Необычный цвет или форма на снимке не всегда означает загрязнение.",
        lesson:
          "Гипотеза проверяется координатами, датой снимка и полевыми данными.",
        question: "Что нужно сделать после обнаружения аномалии?",
        options: [
          "Проверить данные и зафиксировать проблему",
          "Удалить снимок",
          "Сразу закрыть участок",
        ],
        answer: 0,
        points: 10,
      },
      {
        id: 2,
        title: "Типы экологических проблем",
        description: "Разделяем мусор, загрязнение и другие изменения среды.",
        lesson:
          "Тип проблемы помогает выбрать мероприятие и оценить результат до и после работ.",
        question: "Зачем указывать тип проблемы?",
        options: [
          "Для выбора подходящего плана работ",
          "Только для цвета карты",
          "Это необязательно",
        ],
        answer: 0,
        points: 10,
      },
      {
        id: 3,
        title: "От снимка к действию",
        description:
          "Волонтёрский сценарий начинается с наблюдения и заканчивается подтверждённым результатом.",
        lesson:
          "Увидел проблему → изучил → записался → участвовал → подтвердил результат.",
        question: "Какой следующий шаг после изучения участка?",
        options: [
          "Записаться на подходящее мероприятие",
          "Сменить пароль",
          "Создать новую карту",
        ],
        answer: 0,
        points: 10,
      },
    ],
  },
];

const achievements = [
  {
    code: "student",
    title: "Первый урок",
    description: "Пройден первый учебный модуль",
    icon: "◈",
  },
  {
    code: "course-complete",
    title: "Голос территории",
    description: "Курс по ДЗЗ завершён",
    icon: "✦",
  },
  {
    code: "participant",
    title: "В деле",
    description: "Участие в экологическом мероприятии",
    icon: "◎",
  },
  {
    code: "returning",
    title: "Снова в деле",
    description: "Повторное участие в мероприятиях",
    icon: "↻",
  },
];

courses[0].title = "Взгляд из космоса";
courses[0].description =
  "Интерактивный курс о ДЗЗ: от космического бинокля до экологического патруля.";
courses[0].modules = [
  {
    id: 0,
    title: "Космический бинокль",
    description: "Что такое ДЗЗ простыми словами.",
    lesson:
      "ДЗЗ — это космический бинокль: спутники изучают Землю издалека и делают подробные снимки природы.",
    question: "Что такое ДЗЗ?",
    options: [
      "Способ изучать Землю со спутников",
      "Только прогноз погоды",
      "Наземный фотоаппарат",
    ],
    answer: 0,
    points: 10,
  },
  {
    id: 1,
    title: "Как спутники видят невидимое",
    description: "Принципы работы сенсоров.",
    lesson:
      "Спутники улавливают не только обычный свет: специальные приборы измеряют температуру воды и почвы даже сквозь облака.",
    question: "Что могут измерять специальные приборы?",
    options: [
      "Только размер фотографии",
      "Температуру воды и почвы",
      "Число волонтёров",
    ],
    answer: 1,
    points: 10,
  },
  {
    id: 2,
    title: "Разные ракурсы: фото и радары",
    description: "Главные технологии космической съёмки.",
    lesson:
      "Обычная съёмка показывает цвет поверхности, а радар отправляет сигнал и определяет рельеф при любой погоде.",
    question: "Что делает радар?",
    options: [
      "Определяет рельеф по отражённому сигналу",
      "Только меняет цвет карты",
      "Удаляет облака вручную",
    ],
    answer: 0,
    points: 10,
  },
  {
    id: 3,
    title: "Космический сыщик",
    description: "Как находить экологические проблемы.",
    lesson:
      "Спутник фиксирует пятна мазута, скопления пластика и передаёт экологам точные координаты.",
    question: "Что может заметить спутник?",
    options: [
      "Только здания",
      "Мазутные пятна и пластик",
      "Пароли пользователей",
    ],
    answer: 1,
    points: 10,
  },
  {
    id: 4,
    title: "Умный помощник",
    description: "Как компьютер анализирует снимки.",
    lesson:
      "Программы быстро просматривают тысячи кадров и подсвечивают найденный мусор яркими рамками.",
    question: "Зачем нужен компьютерный анализ?",
    options: [
      "Чтобы быстро найти объекты на снимках",
      "Чтобы заменить спутники",
      "Чтобы выключить карту",
    ],
    answer: 0,
    points: 10,
  },
  {
    id: 5,
    title: "Спасательная миссия",
    description: "Планируем полезное действие.",
    lesson:
      "По снимку с отмеченной зоной команда выбирает самый удобный и быстрый маршрут по побережью.",
    question: "Что нужно спланировать команде?",
    options: ["Маршрут до проблемной зоны", "Новую соцсеть", "Цвет формы"],
    answer: 0,
    points: 10,
  },
  {
    id: 6,
    title: "Машина времени для планеты",
    description: "Сравниваем природу во времени.",
    lesson:
      "Архивные снимки показывают, становится ли берег чище после уборок и как меняется природа.",
    question: "Зачем сравнивать снимки разных дат?",
    options: [
      "Чтобы увидеть изменения территории",
      "Чтобы увеличить файл",
      "Чтобы скрыть результат",
    ],
    answer: 0,
    points: 10,
  },
  {
    id: 7,
    title: "Секреты цвета",
    description: "Анализируем спектры.",
    lesson:
      "На специальных снимках здоровые растения могут выглядеть ярко-красными, а повреждённые участки — тусклыми.",
    question: "Что помогают различать спектры?",
    options: [
      "Состояние живой природы и загрязнений",
      "Только время суток",
      "Количество снимков",
    ],
    answer: 0,
    points: 10,
  },
  {
    id: 8,
    title: "Команда спасения",
    description: "Соединяем технологии и добрые дела.",
    lesson:
      "Волонтёры используют спутниковые карты, чтобы проводить субботники там, где помощь нужнее всего.",
    question: "Кто превращает данные в реальные действия?",
    options: [
      "Команда волонтёров и экологов",
      "Только камера",
      "Случайный алгоритм",
    ],
    answer: 0,
    points: 10,
  },
  {
    id: 9,
    title: "Экологический патруль",
    description: "Итоговая проверка курса.",
    lesson:
      "В финале нужно отличить природную тень от настоящего мусора на космической карте.",
    question: "Что проверяет итоговый уровень?",
    options: [
      "Умение применять логику ДЗЗ",
      "Скорость печати",
      "Настройки телефона",
    ],
    answer: 0,
    points: 20,
  },
];

const events = [
  {
    id: "event-1",
    title: "Очистка Черноморского сектора",
    territory: "Черноморское побережье",
    areaId: "area-1",
    date: "2026-09-15",
    time: "09:00",
    volunteersNeeded: 24,
    volunteersRegistered: 18,
    status: "published",
    task: "Сбор мазута и вывоз загрязнённого грунта",
    description: "Работаем в командах под руководством инспектора ООПТ.",
  },
  {
    id: "event-2",
    title: "Сбор пластика на Балтийской косе",
    territory: "Балтийская коса",
    areaId: "area-2",
    date: "2026-09-18",
    time: "10:30",
    volunteersNeeded: 12,
    volunteersRegistered: 7,
    status: "published",
    task: "Раздельный сбор и сортировка отходов",
    description: "Собираем пластик, фиксируем объём и передаём на сортировку.",
  },
  {
    id: "event-3",
    title: "Мониторинг лимана",
    territory: "Тихоокеанский лиман",
    areaId: "area-3",
    date: "2026-09-22",
    time: "08:30",
    volunteersNeeded: 10,
    volunteersRegistered: 3,
    status: "published",
    task: "Полевое подтверждение состояния участка",
    description: "Сверяем демонстрационные снимки с наблюдениями на местности.",
  },
];

const areas = [
  {
    id: "area-1",
    name: "Черноморский сектор А",
    territory: "Черноморское побережье",
    problemType: "pollution",
    type: "Мазутное пятно",
    status: "detected",
    coordinates: "44.605, 33.522",
    area: 2.4,
    dzz: {
      source: "demo-mvp",
      imageUrl: "",
      coordinates: "44.605, 33.522",
      date: "2026-09-12",
      type: "pollution",
      detectedObjects: ["тёмное пятно", "изменение береговой линии"],
      confidence: 0.91,
    },
  },
  {
    id: "area-2",
    name: "Балтийская коса Б",
    territory: "Балтийская коса",
    problemType: "trash",
    type: "Скопление пластика",
    status: "planned",
    coordinates: "54.639, 19.976",
    area: 1.1,
    dzz: {
      source: "demo-mvp",
      imageUrl: "",
      coordinates: "54.639, 19.976",
      date: "2026-09-12",
      type: "trash",
      detectedObjects: ["светлые фрагменты", "скопление предметов"],
      confidence: 0.84,
    },
  },
  {
    id: "area-3",
    name: "Тихоокеанский лиман Г",
    territory: "Тихоокеанский лиман",
    problemType: "other",
    type: "Требует анализа",
    status: "detected",
    coordinates: "43.115, 131.885",
    area: 4.8,
    dzz: {
      source: "demo-mvp",
      imageUrl: "",
      coordinates: "43.115, 131.885",
      date: "2026-09-12",
      type: "other",
      detectedObjects: ["изменение растительности"],
      confidence: 0.68,
    },
  },
];

const userState = new Map();
const getUserState = (userId) => {
  if (!userState.has(userId))
    userState.set(userId, {
      completedModules: [],
      points: 0,
      registrations: [],
      activity: [],
      achievements: [],
    });
  return userState.get(userId);
};
const findEvent = (id) => events.find((event) => event.id === id);
const statusFor = (progress) =>
  progress.completedModules.length === 0
    ? "not-started"
    : progress.completedModules.length === courses[0].modules.length
      ? "completed"
      : "in-progress";
const addAchievement = (state, code) => {
  if (!state.achievements.includes(code)) state.achievements.push(code);
};

class VolunteerController {
  listCourses(req, res) {
    return res.json(
      courses.map(({ modules, ...course }) => ({
        ...course,
        moduleCount: modules.length,
      })),
    );
  }
  getCourse(req, res) {
    const course = courses.find((item) => item.id === req.params.courseId);
    return course
      ? res.json(course)
      : res.status(404).json({ message: "Курс не найден" });
  }
  getProgress(req, res) {
    const state = getUserState(req.user.id);
    return res.json({
      courseId: courses[0].id,
      completedModules: state.completedModules,
      points: state.points,
      status: statusFor(state),
    });
  }
  submitModule(req, res) {
    const course = courses.find((item) => item.id === req.params.courseId);
    const module = course?.modules[Number(req.params.moduleId)];
    if (!module) return res.status(404).json({ message: "Модуль не найден" });
    const state = getUserState(req.user.id);
    const isCorrect = Number(req.body.answer) === module.answer;
    if (isCorrect && !state.completedModules.includes(module.id)) {
      state.completedModules.push(module.id);
      state.points += module.points;
      state.activity.unshift({
        id: randomUUID(),
        type: "education",
        title: `Пройден модуль «${module.title}»`,
        points: module.points,
        date: new Date().toISOString(),
      });
      addAchievement(state, "student");
    }
    if (statusFor(state) === "completed")
      addAchievement(state, "course-complete");
    return res.json({
      correct: isCorrect,
      correctAnswer: module.answer,
      ...state,
      status: statusFor(state),
    });
  }
  listEvents(req, res) {
    const { territory, date, status } = req.query;
    return res.json(
      events.filter(
        (event) =>
          (!territory || event.territory === territory) &&
          (!date || event.date === date) &&
          (!status || event.status === status),
      ),
    );
  }
  getEvent(req, res) {
    const event = findEvent(req.params.eventId);
    return event
      ? res.json(event)
      : res.status(404).json({ message: "Мероприятие не найдено" });
  }
  register(req, res) {
    const event = findEvent(req.params.eventId);
    const state = getUserState(req.user.id);
    if (!event)
      return res.status(404).json({ message: "Мероприятие не найдено" });
    if (
      state.registrations.some(
        (item) => item.eventId === event.id && item.status !== "cancelled",
      )
    )
      return res
        .status(400)
        .json({ message: "Вы уже записаны на это мероприятие" });
    if (event.volunteersRegistered >= event.volunteersNeeded)
      return res.status(400).json({ message: "Свободных мест больше нет" });
    event.volunteersRegistered += 1;
    state.registrations.push({ eventId: event.id, status: "registered" });
    state.activity.unshift({
      id: randomUUID(),
      type: "event",
      title: `Запись: ${event.title}`,
      points: 0,
      date: new Date().toISOString(),
    });
    addAchievement(state, "participant");
    if (
      state.registrations.filter((item) => item.status !== "cancelled").length >
      1
    )
      addAchievement(state, "returning");
    return res
      .status(201)
      .json({ event, registration: state.registrations.at(-1) });
  }
  cancelRegistration(req, res) {
    const state = getUserState(req.user.id);
    const registration = state.registrations.find(
      (item) =>
        item.eventId === req.params.eventId && item.status !== "cancelled",
    );
    if (!registration)
      return res.status(404).json({ message: "Запись не найдена" });
    registration.status = "cancelled";
    const event = findEvent(req.params.eventId);
    if (event)
      event.volunteersRegistered = Math.max(0, event.volunteersRegistered - 1);
    return res.json(registration);
  }
  myEvents(req, res) {
    return res.json(
      getUserState(req.user.id).registrations.map((registration) => ({
        ...registration,
        event: findEvent(registration.eventId),
      })),
    );
  }
  getAchievements(req, res) {
    const state = getUserState(req.user.id);
    return res.json(
      achievements.map((item) => ({
        ...item,
        unlocked: state.achievements.includes(item.code),
      })),
    );
  }
  getActivity(req, res) {
    return res.json(getUserState(req.user.id).activity);
  }
  getAreas(req, res) {
    return res.json(areas);
  }
  getDzz(req, res) {
    const area = areas.find((item) => item.id === req.params.areaId);
    return area
      ? res.json(area.dzz)
      : res.status(404).json({ message: "Участок не найден" });
  }
  getStats(req, res) {
    const state = getUserState(req.user.id);
    return res.json({
      educationPoints: state.points,
      events: state.registrations.filter((item) => item.status !== "cancelled")
        .length,
      cleanedAreas: 0,
      cleanedArea: 0,
      totalPoints: state.points,
    });
  }
}

module.exports = new VolunteerController();
