import { Navigate, Route, Routes } from "react-router-dom";
import { publicRoutes, privateRoutes } from "../router/routes";
import NotFound from "../pages/NotFound";
import { useContext } from "react";
import { Context } from "../main";
import { observer } from "mobx-react-lite";

function AppRouter() {
  const { store } = useContext(Context);

  return (
    <Routes>
      {store.isAuth
        ? privateRoutes
            .filter(
              (route) =>
                route.path !== "/territory" || store.user.role === "employee",
            )
            .map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
              />
            ))
        : publicRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}

      {store.isAuth
        ? publicRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={<Navigate to="/" replace />}
            />
          ))
        : privateRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={<Navigate to="/registration" replace />}
            />
          ))}

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default observer(AppRouter);
