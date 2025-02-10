import { NavLink } from "react-router-dom";
import PropTypes from 'prop-types';

const AdminHeader = ({user, onLogout}) =>{
    return(
        <div className="admin-dashboard">
            <header id="main-header">
        <h1 className="header-main">Admin Dashboard</h1>
        {user && <p>Welcome, {user}!</p>}
        <nav>
            <ul>
              <li className="header-sub">
                <NavLink to="/admin-dashboard" className={({ isActive }) => (isActive ? 'active' : '')}>Orders</NavLink>
                <NavLink to="/admin-addPizza" className={({ isActive }) => (isActive ? 'active' : '')}>Add Pizza</NavLink>
                <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>Payments</NavLink>
                <NavLink to="/admin-login" onClick={onLogout} className={({ isActive }) => (isActive ? 'active' : '')}>Logout</NavLink>
              </li>
            </ul>
          </nav>
      </header>
        </div>
        )
}

AdminHeader.propTypes = {
  user: PropTypes.string,
  onLogout: PropTypes.func.isRequired,
};

export default AdminHeader;