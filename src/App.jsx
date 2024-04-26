/* eslint-disable no-unused-vars */
// import { useState } from "react";
// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
// import "./App.css";
// import { GoogleLogin } from "@react-oauth/google";

import {
  BrowserRouter as Router,
  Route,
  Routes,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import PrivateRoutes from "./utils/PrivateRoutes";
import NotFound from "./pages/NotFound";

function App() {
  const route = createBrowserRouter([
    {
      path: "/",
      element: (
        <PrivateRoutes>
          <Home />
        </PrivateRoutes>
      ),
      ErrorBoundary: () => <NotFound />,
    },
    {
      path: "/login",
      element: <Login />,
    },
  ]);
  return (
    // <>
    <div className="App">
      {/* <Router>
        <Routes>
          <Route element={<PrivateRoutes />}>
            <Route element={<Home />} path="/" exact />
          </Route>
          <Route element={<Login />} path="/login" />
        </Routes>
      </Router> */}
      <RouterProvider router={route} />
    </div>

    // </>
  );
}

export default App;
