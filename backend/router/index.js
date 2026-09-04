const Router = require("express").Router;
const userController = require("../controllers/user-controller");
const router = new Router();
const { body } = require("express-validator");
const authMiddleware = require("../middlewares/auth-middleware");
const territoryController = require("../controllers/territory-controller");
const roleMiddleware = require("../middlewares/role-middleware");

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

module.exports = router;
