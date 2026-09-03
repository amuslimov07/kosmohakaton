import Home from "../pages/Home";
import Login from "../pages/Login";
import Registration from "../pages/Registration";

export const privateRoutes = [
  {
    path: "/",
    element: <Home />,
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
