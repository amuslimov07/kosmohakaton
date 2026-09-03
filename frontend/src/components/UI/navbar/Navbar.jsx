import { useContext } from "react";
import { NavLink, Link } from "react-router-dom";
import { Context } from "../../../main";
import { observer } from "mobx-react-lite";
function Navbar() {
  const { store } = useContext(Context);

  return (
    <header className="navbar">
      <Link className="brand" to="/">
        <span className="brand-mark">✦</span>
        <span>
          <strong>ЧИСТЫЙ БЕРЕГ</strong>
        </span>
      </Link>
      <div className="navbar__links">
        {store.isAuth ? (
          <>
            <NavLink to="/profile">Профиль</NavLink>
            <button className="nav-logout" onClick={() => store.logout()}>
              Выйти
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login">Войти</NavLink>
            <NavLink className="nav-cta" to="/registration">
              Регистрация <span>→</span>
            </NavLink>
          </>
        )}
      </div>
    </header>
  );
}

export default observer(Navbar);
