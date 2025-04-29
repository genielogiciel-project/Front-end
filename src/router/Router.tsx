import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { routes } from "@/router";
import { Suspense } from "react";
import { Loading } from "@/components/ui/loading";

const router = createBrowserRouter(routes);

export function AppRouter() {
  return (
    <Suspense fallback={<Loading />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}
