import { BrowserRouter } from "react-router-dom";
import { useContext, useEffect } from "react";
import AppRouter from "./components/AppRouter";
import Navbar from "./components/UI/navbar/Navbar";
import { Context } from "./main";
import "./App.css";

export default function App() {
  const { store } = useContext(Context);

  useEffect(() => {
    store.checkAuth();
  }, [store]);

  return (
    <BrowserRouter>
      <Navbar />
      <AppRouter />
    </BrowserRouter>
  );
}
