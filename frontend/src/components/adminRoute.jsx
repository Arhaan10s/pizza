import { Navigate, Outlet } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

const AdminRoute = () => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to='/admin-login' replace />;
  }

  const decodedToken = jwtDecode(token);

  const isAdmin = decodedToken;
  console.log("is",isAdmin)

  if (isAdmin) {
    return <Outlet />;
  } else {
    return <Navigate to='/admin-login' replace />;
  }
};

export default AdminRoute;