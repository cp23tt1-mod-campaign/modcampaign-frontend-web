// eslint-disable-next-line no-unused-vars
import { Navigate, Outlet, useOutletContext } from "react-router-dom";

// eslint-disable-next-line react/prop-types
const PrivateRoutes = ({ children }) => {
  const accessToken = localStorage.getItem("accessToken");

  let auth = { token: accessToken };
  console.log(auth);

  return auth.token ? children : <Navigate to="/login" />;
  // <Route {...rest}>{auth.token ? children : <Navigate to="/login" />}</Route>
};

export default PrivateRoutes;
