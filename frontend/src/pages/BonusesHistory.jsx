import { useEffect, useState } from "react";
import { BonusService } from "../services/AuthService";

export default function BonusesHistory() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await BonusService.getHistory();
        setItems(response.data || []);
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return <div className="empty-state">Загрузка истории...</div>;
  }

  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <span className="section-kicker">История бонусов</span>
          <h2>Операции с балансом</h2>
        </div>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Сумма</th>
              <th>Описание</th>
              <th>Дата</th>
            </tr>
          </thead>
          <tbody>
            {items.length ? (
              items.map((item) => (
                <tr key={item.id}>
                  <td>{item.amount > 0 ? `+${item.amount}` : item.amount}</td>
                  <td>{item.description}</td>
                  <td>
                    {new Date(item.createdAt).toLocaleDateString("ru-RU")}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">История бонусных операций пока пуста.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
