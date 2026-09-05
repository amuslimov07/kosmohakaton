import Home from "../pages/Home";
import Login from "../pages/Login";
import Registration from "../pages/Registration";
import Profile from "../pages/Profile";
import TerritoryDashboard from "../pages/TerritoryDashboard";
import Education from "../pages/Education";
import Events from "../pages/Events";
import EventDetails from "../pages/EventDetails";
import Achievements from "../pages/Achievements";
import Rewards from "../pages/Rewards";
import MyRewards from "../pages/MyRewards";

export const privateRoutes = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/territory",
    element: <TerritoryDashboard />,
  },
  { path: "/education", element: <Education /> },
  { path: "/events", element: <Events /> },
  { path: "/events/:eventId", element: <EventDetails /> },
  { path: "/achievements", element: <Achievements /> },
  { path: "/rewards", element: <Rewards /> },
  { path: "/my-rewards", element: <MyRewards /> },
];
export const publicRoutes = [
  {
    path: "/registration",
    element: <Registration />,
  },
  {
    path: "/login",
    element: <Login />,
  },
];
