import Home from "../pages/Home";
import Login from "../pages/Login";
import Registration from "../pages/Registration";
import Profile from "../pages/Profile";
import TerritoryDashboard from "../pages/TerritoryDashboard";

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
