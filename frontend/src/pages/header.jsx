import { NavLink } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import PropTypes from 'prop-types';

const Header = ({ user, onLogout }) => {
  return (
    <>
      <section>
        <header id="main-header">
          <h1 className="header-main">PizzaHub</h1>
          {user && <p>Welcome, {user}!</p>}
          <nav>
            <ul>
              <li className="header-sub">
                <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>Home</NavLink>
                <NavLink to="/menu" className={({ isActive }) => (isActive ? 'active' : '')}>Menu</NavLink>
                <NavLink to="/order" className={({ isActive }) => (isActive ? 'active' : '')}>Orders</NavLink>
                <NavLink to="/payment" className={({ isActive }) => (isActive ? 'active' : '')}>Payment</NavLink>
                <NavLink id="lin" to="/cart" className={({ isActive }) => (isActive ? 'active' : '')}><FaShoppingCart /></NavLink>
                {user ? (
                  <NavLink to="/" onClick={onLogout} className={({ isActive }) => (isActive ? 'active' : '')}>Logout</NavLink>
                ) : (
                  <NavLink to="/login" className={({ isActive }) => (isActive ? 'active' : '')}>Login</NavLink>
                )}
              </li>
            </ul>
          </nav>
        </header>
      </section>
    </>
  );
};

Header.propTypes = {
  user: PropTypes.string,
  onLogout: PropTypes.func.isRequired,
};

export default Header;