import { Provider } from "react-redux";
import { store } from "./lib/store";
import { Toaster } from "@/components/ui/toaster";
import { AppRouter } from "./router/Router";
import "./App.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <AppRouter />
        <Toaster />
      </Provider>
    </QueryClientProvider>
  );
}
