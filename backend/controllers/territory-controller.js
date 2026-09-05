const { randomUUID } = require("crypto");

const statusMeta = {
  detected: { label: "Новая", className: "status-detected" },
  planned: { label: "Требует внимания", className: "status-planned" },
  in_progress: { label: "В работе", className: "status-progress" },
  resolved: { label: "Решена", className: "status-resolved" },
};

const legacyStatusMap = {
  attention: "planned",
  event: "in_progress",
  clean: "resolved",
};

const state = {
  areas: [
    {
      id: "area-1",
      name: "Черноморский сектор А",
      territory: "Черноморское побережье",
      type: "Мазутное пятно",
      problemType: "pollution",
      status: "planned",
      priority: "Высокий",
      coordinates: "44.605, 33.522",
      area: 2.4,
      discoveredAt: "2026-09-12",
      source: "DZZ / demo-mvp",
      confidence: 0.91,
      assignedEventId: "event-1",
      resolutionStatus: "В работе",
      updatedAt: "Сегодня, 09:40",
    },
    {
      id: "area-2",
      name: "Балтийская коса Б",
      territory: "Балтийская коса",
      type: "Скопление пластика",
      problemType: "trash",
      status: "detected",
      priority: "Средний",
      coordinates: "54.639, 19.976",
      area: 1.1,
      discoveredAt: "2026-09-11",
      source: "DZZ / demo-mvp",
      confidence: 0.84,
      assignedEventId: "event-2",
      resolutionStatus: "Мероприятие запланировано",
      updatedAt: "Вчера, 16:20",
    },
    {
      id: "area-3",
      name: "Тихоокеанский лиман Г",
      territory: "Тихоокеанский лиман",
      type: "Нет аномалий",
      problemType: "other",
      status: "resolved",
      priority: "Низкий",
      coordinates: "43.115, 131.885",
      area: 4.8,
      discoveredAt: "2026-09-04",
      source: "Полевое подтверждение",
      confidence: 0.68,
      assignedEventId: null,
      resolutionStatus: "Решена",
      updatedAt: "12.09.2026",
    },
    {
      id: "area-4",
      name: "Северный берег Д",
      territory: "Черноморское побережье",
      type: "Накопление мусора",
      problemType: "trash",
      status: "planned",
      priority: "Высокий",
      coordinates: "45.012, 33.814",
      area: 1.7,
      discoveredAt: "2026-09-10",
      source: "DZZ / demo-mvp",
      confidence: 0.89,
      assignedEventId: null,
      resolutionStatus: "Требует внимания",
      updatedAt: "Сегодня, 10:22",
    },
  ],
  events: [
    {
      id: "event-1",
      areaId: "area-1",
      title: "Очистка Черноморского сектора",
      territory: "Черноморское побережье",
      date: "2026-09-15",
      time: "09:00",
      volunteersNeeded: 24,
      volunteersRegistered: 18,
      actualParticipants: 15,
      result: "350 м² очищено",
      cleanedArea: 350,
      status: "published",
      attendanceRate: 0.83,
      description: "Сбор мазута и вывоз загрязнённого грунта.",
    },
    {
      id: "event-2",
      areaId: "area-2",
      title: "Сбор пластика на косе",
      territory: "Балтийская коса",
      date: "2026-09-18",
      time: "10:30",
      volunteersNeeded: 12,
      volunteersRegistered: 7,
      actualParticipants: 6,
      result: "180 кг собранного мусора",
      cleanedArea: 120,
      status: "published",
      attendanceRate: 0.86,
      description: "Раздельный сбор и сортировка отходов.",
    },
    {
      id: "event-3",
      areaId: "area-3",
      title: "Мониторинг лимана",
      territory: "Тихоокеанский лиман",
      date: "2026-09-22",
      time: "08:30",
      volunteersNeeded: 10,
      volunteersRegistered: 3,
      actualParticipants: 2,
      result: "Подтверждён контрольный осмотр",
      cleanedArea: 40,
      status: "completed",
      attendanceRate: 0.67,
      description: "Полевое подтверждение состояния участка.",
    },
  ],
  volunteers: [
    {
      id: "vol-1",
      name: "Анна Петрова",
      territory: "Черноморское побережье",
      status: "active",
      points: 240,
      attendedEvents: 3,
      lastActive: "2026-09-16",
      eventId: "event-1",
      attended: true,
      bonusStatus: "Начислено",
    },
    {
      id: "vol-2",
      name: "Илья Смирнов",
      territory: "Черноморское побережье",
      status: "active",
      points: 180,
      attendedEvents: 2,
      lastActive: "2026-09-15",
      eventId: "event-1",
      attended: false,
      bonusStatus: "Ожидает",
    },
    {
      id: "vol-3",
      name: "Мария Волкова",
      territory: "Балтийская коса",
      status: "new",
      points: 80,
      attendedEvents: 1,
      lastActive: "2026-09-14",
      eventId: "event-2",
      attended: false,
      bonusStatus: "Ожидает",
    },
    {
      id: "vol-4",
      name: "Сергей Лапин",
      territory: "Тихоокеанский лиман",
      status: "inactive",
      points: 60,
      attendedEvents: 1,
      lastActive: "2026-08-27",
      eventId: "event-3",
      attended: false,
      bonusStatus: "Неактивен",
    },
    {
      id: "vol-5",
      name: "Елена Власова",
      territory: "Черноморское побережье",
      status: "active",
      points: 310,
      attendedEvents: 4,
      lastActive: "2026-09-17",
      eventId: "event-1",
      attended: true,
      bonusStatus: "Начислено",
    },
  ],
  funnel: {
    registered: 120,
    startedEducation: 95,
    completedEducation: 72,
    registeredForEvent: 54,
    participated: 46,
    repeatedParticipation: 28,
  },
  timeline: [
    { date: "2026-08-04", participants: 12, events: 1, cleanedArea: 50 },
    { date: "2026-08-11", participants: 13, events: 1, cleanedArea: 75 },
    { date: "2026-08-18", participants: 18, events: 2, cleanedArea: 110 },
    { date: "2026-08-25", participants: 21, events: 2, cleanedArea: 150 },
    { date: "2026-09-02", participants: 27, events: 2, cleanedArea: 210 },
    { date: "2026-09-09", participants: 29, events: 3, cleanedArea: 275 },
    { date: "2026-09-16", participants: 36, events: 3, cleanedArea: 340 },
  ],
};

const getStats = () => {
  const totalAreas = state.areas.length;
  const attentionAreas = state.areas.filter((area) =>
    ["detected", "planned", "in_progress"].includes(area.status),
  ).length;
  const activeEvents = state.events.filter(
    (event) => event.status === "published",
  ).length;
  const completedEvents = state.events.filter(
    (event) => event.status === "completed",
  ).length;
  const volunteers = state.volunteers.length;
  const activeVolunteers = state.volunteers.filter(
    (user) => user.status === "active",
  ).length;
  const cleanedArea = state.events.reduce(
    (sum, event) => sum + (event.cleanedArea || 0),
    0,
  );
  const collectedWaste = state.events.reduce(
    (sum, event) =>
      sum + (event.cleanedArea ? Math.round(event.cleanedArea * 1.8) : 0),
    0,
  );

  return {
    totalAreas,
    attentionAreas,
    activeEvents,
    completedEvents,
    volunteers,
    activeVolunteers,
    cleanedArea,
    collectedWaste,
  };
};

const normalizeStatus = (status) => {
  if (!status) return "detected";
  const normalized = String(status).toLowerCase();
  if (legacyStatusMap[normalized]) return legacyStatusMap[normalized];
  if (["detected", "planned", "in_progress", "resolved"].includes(normalized))
    return normalized;
  if (["new", "attention", "event", "clean"].includes(normalized)) {
    return legacyStatusMap[normalized] || normalized;
  }
  return "detected";
};

const buildAttentionTasks = (areas, events) => {
  const tasks = areas
    .filter((area) => ["detected", "planned"].includes(area.status))
    .map((area) => ({
      id: area.id,
      title: `${area.name} · ${area.type}`,
      territory: area.territory,
      priority: area.priority,
      reason: area.resolutionStatus || "Требует внимания",
      action: area.assignedEventId ? "Открыть" : "Назначить мероприятие",
      type: "area",
      assignedEventId: area.assignedEventId,
    }));

  const eventTasks = events
    .filter((event) => (event.attendanceRate || 0) < 0.75)
    .map((event) => ({
      id: event.id,
      title: `${event.title} · низкая явка`,
      territory: event.territory,
      priority: event.attendanceRate < 0.6 ? "Высокий" : "Средний",
      reason: `${event.actualParticipants || 0} из ${event.volunteersNeeded || 0} участников`,
      action: "Посмотреть территорию",
      type: "event",
    }));

  return [...tasks, ...eventTasks].slice(0, 6);
};

const buildAnalytics = ({
  territory = "all",
  status = "all",
  period = "all",
} = {}) => {
  const filteredAreas = state.areas.filter((area) => {
    const matchesTerritory =
      territory === "all" || area.territory === territory;
    const matchesStatus =
      status === "all" || area.status === normalizeStatus(status);
    return matchesTerritory && matchesStatus;
  });

  const filteredEvents = state.events.filter((event) => {
    const matchesTerritory =
      territory === "all" || event.territory === territory;
    const matchesStatus =
      status === "all" ||
      (status === "active"
        ? event.status === "published"
        : status === "completed"
          ? event.status === "completed"
          : true);
    return matchesTerritory && matchesStatus;
  });

  const filteredVolunteers = state.volunteers.filter((person) => {
    const matchesTerritory =
      territory === "all" || person.territory === territory;
    return matchesTerritory;
  });

  const totalAreas = filteredAreas.length;
  const attentionAreas = filteredAreas.filter((area) =>
    ["detected", "planned", "in_progress"].includes(area.status),
  ).length;
  const activeEvents = filteredEvents.filter(
    (event) => event.status === "published",
  ).length;
  const completedEvents = filteredEvents.filter(
    (event) => event.status === "completed",
  ).length;
  const activeVolunteers = filteredVolunteers.filter(
    (person) => person.status === "active",
  ).length;
  const cleanedArea = filteredEvents.reduce(
    (sum, event) => sum + (event.cleanedArea || 0),
    0,
  );
  const collectedWaste = filteredEvents.reduce(
    (sum, event) => sum + Math.round((event.cleanedArea || 0) * 1.8),
    0,
  );

  const funnel = {
    registered: state.funnel.registered,
    startedEducation: state.funnel.startedEducation,
    completedEducation: state.funnel.completedEducation,
    registeredForEvent: state.funnel.registeredForEvent,
    participated: state.funnel.participated,
    repeatedParticipation: state.funnel.repeatedParticipation,
  };

  const timeline = (() => {
    const source = [...state.timeline];
    if (period === "7") return source.slice(-4);
    if (period === "30") return source.slice(-5);
    if (period === "90") return source.slice(-6);
    return source;
  })();

  const areasStatus = {
    detected: filteredAreas.filter((area) => area.status === "detected").length,
    planned: filteredAreas.filter((area) => area.status === "planned").length,
    in_progress: filteredAreas.filter((area) => area.status === "in_progress")
      .length,
    resolved: filteredAreas.filter((area) => area.status === "resolved").length,
  };

  const areaPriority = {
    Высокий: filteredAreas.filter((area) => area.priority === "Высокий").length,
    Средний: filteredAreas.filter((area) => area.priority === "Средний").length,
    Низкий: filteredAreas.filter((area) => area.priority === "Низкий").length,
  };

  const volunteersSummary = {
    total: filteredVolunteers.length,
    active: activeVolunteers,
    participated: filteredVolunteers.filter(
      (person) => person.attendedEvents > 0,
    ).length,
    repeatParticipants: filteredVolunteers.filter(
      (person) => person.attendedEvents > 1,
    ).length,
    averageEvents: filteredVolunteers.length
      ? (
          filteredVolunteers.reduce(
            (sum, person) => sum + (person.attendedEvents || 0),
            0,
          ) / filteredVolunteers.length
        ).toFixed(1)
      : 0,
    averagePoints: filteredVolunteers.length
      ? Math.round(
          filteredVolunteers.reduce(
            (sum, person) => sum + (person.points || 0),
            0,
          ) / filteredVolunteers.length,
        )
      : 0,
  };

  const eventSummary = {
    total: filteredEvents.length,
    active: activeEvents,
    completed: completedEvents,
    averageParticipants: filteredEvents.length
      ? (
          filteredEvents.reduce(
            (sum, event) => sum + (event.actualParticipants || 0),
            0,
          ) / filteredEvents.length
        ).toFixed(1)
      : 0,
    attendanceRate: filteredEvents.length
      ? (
          (filteredEvents.reduce(
            (sum, event) => sum + (event.attendanceRate || 0),
            0,
          ) /
            filteredEvents.length) *
          100
        ).toFixed(0)
      : 0,
    cleanedArea,
    result: collectedWaste,
  };

  const impact = {
    cleanedArea,
    collectedWaste,
    resolvedAreas: filteredAreas.filter((area) => area.status === "resolved")
      .length,
    totalParticipants: filteredEvents.reduce(
      (sum, event) => sum + (event.actualParticipants || 0),
      0,
    ),
    counties: [...new Set(filteredAreas.map((area) => area.territory))].length,
  };

  return {
    overview: {
      totalAreas,
      attentionAreas,
      activeEvents,
      completedEvents,
      volunteers: filteredVolunteers.length,
      activeVolunteers,
      cleanedArea,
      collectedWaste,
      areaSize: filteredAreas
        .reduce((sum, area) => sum + Number(area.area || 0), 0)
        .toFixed(1),
      statusLabel: `${attentionAreas} требуют внимания`,
    },
    kpis: [
      {
        label: "Всего проблемных зон",
        value: totalAreas,
        description: "найдено по текущему срезу",
        delta: "+8%",
      },
      {
        label: "Требуют внимания",
        value: attentionAreas,
        description: "состояние критично",
        delta: "+2",
      },
      {
        label: "Активные мероприятия",
        value: activeEvents,
        description: "запланированы в ближайший период",
        delta: "+1",
      },
      {
        label: "Завершённые мероприятия",
        value: completedEvents,
        description: "подтвердили результат",
        delta: "+3",
      },
      {
        label: "Зарегистрированные волонтёры",
        value: filteredVolunteers.length,
        description: "на территории или в выбранном фильтре",
        delta: "+12%",
      },
      {
        label: "Активные волонтёры",
        value: activeVolunteers,
        description: "вовлечены в работу хотя бы раз",
        delta: "+9%",
      },
      {
        label: "Очищенная площадь",
        value: `${cleanedArea} м²`,
        description: "фактическая площадь работ",
        delta: "+18%",
      },
      {
        label: "Собранный мусор",
        value: `${collectedWaste} кг`,
        description: "проверенный результат по событиям",
        delta: "+21%",
      },
    ],
    funnel,
    events: {
      total: filteredEvents.length,
      active: activeEvents,
      completed: completedEvents,
      averageParticipants: Number(eventSummary.averageParticipants || 0),
      attendanceRate: Number(eventSummary.attendanceRate || 0),
      cleanedArea,
      result: collectedWaste,
      items: filteredEvents,
    },
    areasStatus,
    priority: areaPriority,
    volunteers: volunteersSummary,
    volunteerItems: filteredVolunteers,
    impact,
    attention: buildAttentionTasks(filteredAreas, filteredEvents),
    areas: filteredAreas.map((area) => ({
      ...area,
      statusLabel: statusMeta[area.status]?.label || "Новая",
      statusClass: statusMeta[area.status]?.className || "status-detected",
    })),
    timeline,
    filters: { territory, status, period },
    lastUpdated: new Date().toISOString(),
  };
};

class TerritoryController {
  dashboard(req, res) {
    return res.json({
      stats: getStats(),
      areas: state.areas,
      events: state.events,
      volunteers: state.volunteers,
    });
  }

  analytics(req, res) {
    const filters = {
      territory: req.query.territory || "all",
      status: req.query.status || "all",
      period: req.query.period || "all",
    };

    return res.json(buildAnalytics(filters));
  }

  createArea(req, res) {
    const area = {
      id: randomUUID(),
      status: normalizeStatus(req.body.status || "attention"),
      priority: req.body.priority || "Средний",
      updatedAt: "Только что",
      discoveredAt: new Date().toISOString().slice(0, 10),
      source: req.body.source || "Машинный ввод",
      confidence: Number(req.body.confidence || 0.7),
      resolutionStatus: req.body.resolutionStatus || "Требует внимания",
      ...req.body,
    };
    state.areas.unshift(area);
    return res.status(201).json(area);
  }

  updateArea(req, res) {
    const area = state.areas.find((item) => item.id === req.params.id);
    if (!area) return res.status(404).json({ message: "Участок не найден" });
    Object.assign(area, req.body, {
      status: normalizeStatus(req.body.status || area.status),
      updatedAt: "Только что",
    });
    return res.json(area);
  }

  createEvent(req, res) {
    const event = {
      id: randomUUID(),
      status: "published",
      volunteersRegistered: 0,
      actualParticipants: 0,
      attendanceRate: 0,
      cleanedArea: 0,
      ...req.body,
    };
    state.events.unshift(event);
    const area = state.areas.find((item) => item.id === event.areaId);
    if (area) {
      area.assignedEventId = event.id;
      area.resolutionStatus = "Мероприятие запланировано";
    }
    return res.status(201).json(event);
  }

  updateEvent(req, res) {
    const event = state.events.find((item) => item.id === req.params.id);
    if (!event)
      return res.status(404).json({ message: "Мероприятие не найдено" });
    Object.assign(event, req.body);
    return res.json(event);
  }

  updateVolunteer(req, res) {
    const volunteer = state.volunteers.find(
      (item) => item.id === req.params.id,
    );
    if (!volunteer)
      return res.status(404).json({ message: "Волонтёр не найден" });
    Object.assign(volunteer, req.body);
    if (volunteer.attended) volunteer.bonusStatus = "К начислению";
    return res.json(volunteer);
  }
}

module.exports = new TerritoryController();
