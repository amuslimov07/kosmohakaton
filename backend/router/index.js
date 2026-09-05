const Router = require("express").Router;
const userController = require("../controllers/user-controller");
const router = new Router();
const { body, param, query, validationResult } = require("express-validator");
const authMiddleware = require("../middlewares/auth-middleware");
const territoryController = require("../controllers/territory-controller");
const roleMiddleware = require("../middlewares/role-middleware");
const volunteerController = require("../controllers/volunteer-controller");

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res
      .status(400)
      .json({ message: "Некорректные данные", errors: errors.array() });
  next();
};

router.post(
  "/registration",
  body("email").isEmail(),
  body("password").isLength({ min: 8, max: 32 }),
  body("role").isIn(["volunteer", "employee"]),
  userController.registration,
);
router.post(
  "/login",
  body("email").isEmail(),
  body("password").isLength({ min: 8, max: 32 }),
  body("role").isIn(["volunteer", "employee"]),
  userController.login,
);
router.post("/logout", userController.logout);
router.get("/activate/:link", userController.activate);
router.get("/refresh", userController.refresh);
router.get("/user/me", authMiddleware, userController.profile);

router.get(
  "/territory/dashboard",
  authMiddleware,
  roleMiddleware("employee"),
  territoryController.dashboard,
);
router.get(
  "/territory/analytics",
  authMiddleware,
  roleMiddleware("employee"),
  territoryController.analytics,
);
router.post(
  "/territory/areas",
  authMiddleware,
  roleMiddleware("employee"),
  territoryController.createArea,
);
router.patch(
  "/territory/areas/:id",
  authMiddleware,
  roleMiddleware("employee"),
  territoryController.updateArea,
);
router.post(
  "/territory/events",
  authMiddleware,
  roleMiddleware("employee"),
  territoryController.createEvent,
);
router.patch(
  "/territory/events/:id",
  authMiddleware,
  roleMiddleware("employee"),
  territoryController.updateEvent,
);
router.patch(
  "/territory/volunteers/:id",
  authMiddleware,
  roleMiddleware("employee"),
  territoryController.updateVolunteer,
);

router.get(
  "/education/courses",
  authMiddleware,
  volunteerController.listCourses,
);
router.get(
  "/education/courses/:courseId",
  authMiddleware,
  param("courseId").isString().notEmpty(),
  validate,
  volunteerController.getCourse,
);
router.get(
  "/education/progress",
  authMiddleware,
  volunteerController.getProgress,
);
router.post(
  "/education/courses/:courseId/modules/:moduleId",
  authMiddleware,
  param("courseId").isString().notEmpty(),
  param("moduleId").isInt({ min: 0 }),
  body("answer").isInt({ min: 0 }),
  validate,
  volunteerController.submitModule,
);
router.get(
  "/events",
  authMiddleware,
  query("territory").optional().isString(),
  query("date").optional().isISO8601(),
  query("status").optional().isIn(["published", "completed", "cancelled"]),
  validate,
  volunteerController.listEvents,
);
router.get(
  "/events/:eventId",
  authMiddleware,
  param("eventId").isString().notEmpty(),
  validate,
  volunteerController.getEvent,
);
router.post(
  "/events/:eventId/register",
  authMiddleware,
  param("eventId").isString().notEmpty(),
  validate,
  volunteerController.register,
);
router.delete(
  "/events/:eventId/register",
  authMiddleware,
  param("eventId").isString().notEmpty(),
  validate,
  volunteerController.cancelRegistration,
);
router.get("/events/my", authMiddleware, volunteerController.myEvents);
router.get(
  "/achievements",
  authMiddleware,
  volunteerController.getAchievements,
);
router.get("/activity", authMiddleware, volunteerController.getActivity);
router.get("/volunteer/stats", authMiddleware, volunteerController.getStats);
router.get("/territory/areas", authMiddleware, volunteerController.getAreas);
router.get(
  "/territory/areas/:areaId/dzz",
  authMiddleware,
  param("areaId").isString().notEmpty(),
  validate,
  volunteerController.getDzz,
);

module.exports = router;
