// Commented out unused imports for dev phase
// import { Navigate } from "react-router-dom";
// import React, { useEffect, useState } from "react";
// import axios from "axios";
import React from "react";
interface PrivateRouteProps {
  element: React.ReactElement;
  path?: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
  // Commented out for dev phase - auth bypassed, directly return element
  // const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // const token = localStorage.getItem("token");
  // useEffect(() => {
  //   const checkAuth = async () => {
  //     try {
  //       const response = await axios.get("http://localhost:4000/api/auth/me",  {
  //       headers: {
  //           Authorization: `Bearer ${token}`
  //       }
  //     });

  //       if (response.status === 200) {
  //         setIsAuthenticated(true);
          
  //       } else {
  //         setIsAuthenticated(false);
  //       }
  //     } catch (error) {
  //       localStorage.removeItem("token");
  //       setIsAuthenticated(false);
  //       window.location.href = "/auth";

  //       console.error("Error checking authentication:", error);
  //       setIsAuthenticated(false);
  //     }
  //   };

  //   checkAuth();
  // }, []);
  // console.log("isAuthenticated", isAuthenticated);
  // if (isAuthenticated === null) {
  //   return <div>Loading...</div>;
  // }

  // return isAuthenticated ? element : <Navigate to="/auth" />;
  return element;
};

export default PrivateRoute;
