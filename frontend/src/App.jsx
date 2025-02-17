import { useState, useEffect } from "react";
import "./App.css";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import Dashboard from "./pages/dashboard";
import Header from "./pages/header";
import Menu from "./pages/menu";
import Cart from "./pages/cart";
import Login from "./pages/login";
import Register from "./pages/register";
import AdminRoute from "./components/adminRoute";
import AdminDashboard from "./components/adminDashboard";
import AdminLogin from "./components/adminLogin";
import Ts from "./pages/ts";
import AddPizza from "./components/adminAddPizza";

function App() {

  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(JSON.parse(storedUserId));
    }
  }, []);

 
  const handleLogin = ({ user }) => {
    const { username, userId, token } = user;
    console.log("user----", username, userId);
    setUser(username);
    setUserId(userId);
    localStorage.setItem("user", JSON.stringify(username));
    localStorage.setItem("userId", JSON.stringify(userId));
    localStorage.setItem("token", token); // Assuming the user object contains a token property
    console.log("User logged in");
  };

  const handleLogout = (e) => {
    e.preventDefault();
    const data = {
      username: user,
      adminname: user,
    };
    const isAdminRoute = location.pathname.startsWith("/admin");

    const apiEndpoint = isAdminRoute
      ? "http://localhost:3000/api/logOutAdmin"
      : "http://localhost:3000/api/logOutUser";
    console.log("end", apiEndpoint);
    fetch(apiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setUser(null);
          setUserId(null);
          localStorage.removeItem("user");
          localStorage.removeItem("userId");
          localStorage.removeItem("token");
          navigate(isAdminRoute ? "/admin-login" : "/login");
          console.log("Logged out");
        } else {
          console.log(data.message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleAdminLogin = (user) => {
    setUser(user.name);
    localStorage.setItem("user", JSON.stringify(user.name));
    localStorage.setItem("token", user.token); // Assuming the user object contains a token property
  };

  const isAdminRoute = location.pathname.startsWith("/admin");
  return (
    <>
      {!isAdminRoute && <Header user={user} onLogout={handleLogout} />}{" "}
      <div className="content-wrapper">
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="/menu" element={<Menu  userId={userId} />} />
          <Route
            path="/cart"
            element={
              <Cart
                userId={userId}
              />
            }
          />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/ts" element={<Ts />} />
          <Route
            path="/admin-login"
            element={<AdminLogin onAdminLogin={handleAdminLogin} />}
          />
          <Route element={<AdminRoute />}>
            <Route
              path="/admin-dashboard"
              element={<AdminDashboard user={user} onLogout={handleLogout} />}
            />
            <Route
              path="/admin-addPizza"
              element={<AddPizza user={user} onLogout={handleLogout} />}
            />
          </Route>
        </Routes>
      </div>
    </>
  );
}

export default App;