import React, { useContext } from "react";

import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import Register from "./pages/register/Register";
import Login from "./pages/login/Login";
import Home from "./pages/home/Home";
import Navbar from "./components/navbar/Navbar";
import LeftBar from "./components/leftBar/LeftBar";
import Profile from "./pages/profile/Profile";
import RightBar from "./components/rightBar/RightBar";
import { DarkModeContext } from "./context/darkModeContext";
import { AuthContext } from "./context/authContext";
import { queryClient } from "./utils/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import ScrollToTop from "./components/ScrollToTop";

interface ProtectedRoute {
  children: React.ReactNode;
}

const App: React.FC = () => {
  const { darkMode } = useContext(DarkModeContext);

  const Layout: React.FC = () => {
    return (
      <QueryClientProvider client={queryClient}>
        <div className={darkMode ? "theme-dark" : "theme-light"}>
          <Navbar />
          <div style={{ display: "flex" }}>
            <LeftBar />
            <div style={{ flex: 6 }}>
              <ScrollToTop />
              <Outlet />
            </div>
            <RightBar />
          </div>
        </div>
        <ReactQueryDevtools
          initialIsOpen={false}
          buttonPosition="bottom-left"
        />
      </QueryClientProvider>
    );
  };

  const ProtectedRoute: React.FC<ProtectedRoute> = ({ children }) => {
    const { currentUser, isLoading } = useContext(AuthContext);

    if (isLoading) return <div>Loading...</div>;
    if (!currentUser) {
      return <Navigate to={"/login"} />;
    }
    return children;
  };
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/profile/:id",
          element: <Profile />,
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
  ]);
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
