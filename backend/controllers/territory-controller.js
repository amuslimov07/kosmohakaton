const { randomUUID } = require("crypto");

const state = {
  areas: [
    {
      id: "area-1",
      name: "Черноморский сектор А",
      type: "Мазутное пятно",
      status: "attention",
      level: "Высокий",
      coordinates: "44.605, 33.522",
      area: 2.4,
      updatedAt: "Сегодня, 09:40",
    },
    {
      id: "area-2",
      name: "Балтийская коса Б",
      type: "Пластик",
      status: "event",
      level: "Средний",
      coordinates: "54.639, 19.976",
      area: 1.1,
      updatedAt: "Вчера, 16:20",
    },
    {
      id: "area-3",
      name: "Тихоокеанский лиман Г",
      type: "Нет аномалий",
      status: "clean",
      level: "Норма",
      coordinates: "43.115, 131.885",
      area: 4.8,
      updatedAt: "12.09.2026",
    },
  ],
  events: [
    {
      id: "event-1",
      areaId: "area-1",
      title: "Очистка Черноморского сектора",
      date: "15.09.2026",
      time: "09:00",
      volunteersNeeded: 24,
      volunteersRegistered: 18,
      status: "published",
      description: "Сбор мазута и вывоз загрязнённого грунта.",
    },
    {
      id: "event-2",
      areaId: "area-2",
      title: "Сбор пластика на косе",
      date: "18.09.2026",
      time: "10:30",
      volunteersNeeded: 12,
      volunteersRegistered: 7,
      status: "published",
      description: "Раздельный сбор и сортировка отходов.",
    },
  ],
  volunteers: [
    {
      id: "vol-1",
      name: "Анна Петрова",
      eventId: "event-1",
      status: "confirmed",
      attended: true,
      bonusStatus: "Начислено",
    },
    {
      id: "vol-2",
      name: "Илья Смирнов",
      eventId: "event-1",
      status: "pending",
      attended: false,
      bonusStatus: "Ожидает",
    },
    {
      id: "vol-3",
      name: "Мария Волкова",
      eventId: "event-2",
      status: "confirmed",
      attended: false,
      bonusStatus: "Ожидает",
    },
  ],
};

const getStats = () => ({
  totalAreas: state.areas.length,
  attentionAreas: state.areas.filter((area) => area.status !== "clean").length,
  activeEvents: state.events.filter((event) => event.status === "published")
    .length,
  completedEvents: state.events.filter((event) => event.status === "completed")
    .length,
  volunteers: state.volunteers.length,
  cleanedArea: state.areas
    .filter((area) => area.status === "clean")
    .reduce((sum, area) => sum + area.area, 0),
});

class TerritoryController {
  dashboard(req, res) {
    return res.json({
      stats: getStats(),
      areas: state.areas,
      events: state.events,
      volunteers: state.volunteers,
    });
  }

  createArea(req, res) {
    const area = {
      id: randomUUID(),
      status: "attention",
      updatedAt: "Только что",
      ...req.body,
    };
    state.areas.unshift(area);
    return res.status(201).json(area);
  }

  updateArea(req, res) {
    const area = state.areas.find((item) => item.id === req.params.id);
    if (!area) return res.status(404).json({ message: "Участок не найден" });
    Object.assign(area, req.body, { updatedAt: "Только что" });
    return res.json(area);
  }

  createEvent(req, res) {
    const event = {
      id: randomUUID(),
      status: "published",
      volunteersRegistered: 0,
      ...req.body,
    };
    state.events.unshift(event);
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
