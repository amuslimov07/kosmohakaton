import { useEffect } from "react";
import RegistrationForm from "../components/RegistrationForm";
import { useContext } from "react";
import { Context } from "../main";
import { observer } from "mobx-react-lite";
function Registration() {
  const { store } = useContext(Context);
  useEffect(() => {
    store.checkAuth();
  }, [store]);

  if (store.isLoading) {
    return <div>Загрузка....</div>;
  }
  if (!store.isAuth) {
    return (
      <main className="auth-page">
        <section className="auth-card">
          <div className="eyebrow">Шаг навстречу природе</div>
          <h1>Создайте аккаунт</h1>
          <p className="auth-lead">
            Присоединяйтесь к игре и помогите вернуть воде чистоту.
          </p>
          <RegistrationForm />
        </section>
      </main>
    );
  }
  return (
    <div>
      <h1>Вы уже вошли</h1>
      <p>{store.user.email}</p>
      <button className="form-submit" onClick={() => store.logout()}>
        Выйти
      </button>
    </div>
  );
}
export default observer(Registration);
