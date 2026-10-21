import { createBrowserRouter } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import ProtectedRoute from "./ProtectedRoute";

// Public Pages
import HomePage from "../pages/public/HomePage";
import AboutPage from "../pages/public/AboutPage";
import ServicesPage from "../pages/public/ServicesPage";
import ContactPage from "../pages/public/ContactPage";
import DoctorDirectoryPage from "../pages/doctors/DoctorDirectoryPage";
import DesignSystemShowcase from "../pages/public/DesignSystemShowcase";

// Auth Pages (Dedicated Separate Portals for Patient, Doctor, and Admin)
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import DoctorLoginPage from "../pages/auth/DoctorLoginPage";
import AdminLoginPage from "../pages/auth/AdminLoginPage";

// Dashboard & Appointment Pages
import DashboardDispatcher from "../pages/dashboard/DashboardDispatcher";
import BookAppointmentPage from "../pages/appointments/BookAppointmentPage";
import AppointmentListPage from "../pages/appointments/AppointmentListPage";
import ProfilePage from "../pages/patients/ProfilePage";

// Error Pages
import NotFoundPage from "../pages/errors/NotFoundPage";
import UnauthorizedPage from "../pages/errors/UnauthorizedPage";

export const router = createBrowserRouter([
  // 1. Public Website Routes (Wrapped with Header & Footer)
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "about",
        element: <AboutPage />,
      },
      {
        path: "services",
        element: <ServicesPage />,
      },
      {
        path: "doctors",
        element: <DoctorDirectoryPage />,
      },
      {
        path: "contact",
        element: <ContactPage />,
      },
      {
        path: "design-system",
        element: <DesignSystemShowcase />,
      },
      {
        path: "unauthorized",
        element: <UnauthorizedPage />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },

  // 2. Authentication Routes (Separated Portals for Patient, Doctor & Admin)
  {
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
      {
        path: "doctor/login",
        element: <DoctorLoginPage />,
      },
      {
        path: "admin/login",
        element: <AdminLoginPage />,
      },
    ],
  },

  // 3. Authenticated Clinical Application Routes (Protected via RBAC)
  {
    element: <ProtectedRoute allowedRoles={["patient", "doctor", "admin"]} />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          {
            path: "dashboard",
            element: <DashboardDispatcher />,
          },
          {
            path: "appointments",
            element: <AppointmentListPage />,
          },
          {
            path: "appointments/book",
            element: <BookAppointmentPage />,
          },
          {
            path: "profile",
            element: <ProfilePage />,
          },
        ],
      },
    ],
  },
]);