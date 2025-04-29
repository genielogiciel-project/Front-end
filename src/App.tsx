import { Provider } from "react-redux";
import { store } from "./lib/store";
import { Toaster } from "@/components/ui/toaster";
import { AppRouter } from "./router/Router";
import "./App.css";

export default function App() {
  return (
    <Provider store={store}>
      <AppRouter />
      <Toaster />
    </Provider>
  );
}
