import { Navigate, RouteObject } from "react-router-dom";
import { Middleware } from "@/components/layout/Middleware";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import { lazy } from "react";
import { Register } from "@/pages/Register";
import PanicReport from "@/pages/panicReport";

const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Requests = lazy(() => import("@/pages/Requests"));
const Resources = lazy(() => import("@/pages/Resources"));
const Maintenance = lazy(() => import("@/pages/Maintenance"));
const Tenders = lazy(() => import("@/pages/Tenders"));
const Suppliers = lazy(() => import("@/pages/Suppliers"));
const Reports = lazy(() => import("@/pages/Reports"));
const Settings = lazy(() => import("@/pages/Settings"));

const publicRoutes: RouteObject[] = [
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/404",
    element: <NotFound />,
  },
];

const protectedRoutes: RouteObject[] = [
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/requests",
    element: <Requests />,
  },
  {
    path: "/resources",
    element: <Resources />,
  },
  {
    path: "/maintenance",
    element: <Maintenance />,
  },
  {
    path: "/tenders",
    element: <Tenders />,
  },
  {
    path: "/suppliers",
    element: <Suppliers />,
  },
  {
    path: "/reports",
    element: <Reports />,
  },
  {
    path: "/panic",
    element: <PanicReport />,
  },
  {
    path: "/settings",
    element: <Settings />,
  },
];

export const routes: RouteObject[] = [
  ...publicRoutes,
  {
    element: <Middleware />,
    children: protectedRoutes,
  },
  {
    path: "*",
    element: <Navigate to="/404" replace />,
  },
];
