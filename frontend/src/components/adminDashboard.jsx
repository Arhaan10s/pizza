import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import AdminHeader from './adminHeader';

const AdminDashboard = ({user,onLogout}) => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  // Retrieve admin data from localStorage
  const adminData = JSON.parse(localStorage.getItem('adminData'));
  const adminId = adminData?.adminId;

  useEffect(() => {
    if (!adminId) {
      console.error("Admin ID is missing!");
      return;
    }

    const apiUrl = `http://localhost:3000/api/admin/getOrder?adminId=${adminId}`;

    fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.orders) {
          setOrders(data.orders);
        } else {
          console.error("Error fetching orders:", data.message);
        }
      })
      .catch((err) => {
        console.error("Network or server error:", err);
      });
  }, [adminId]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredOrders = orders.filter(order =>
    order.orderId.toString().includes(searchTerm)
  );

  return (
    <div className="admin-dashboard">
      <header>
        <AdminHeader user={user} onLogout={onLogout}/>
      </header>
      <main className="dashboard-content">
        <section className="orders-section">
          <h2 className="section-title">Orders</h2>
          <input
          style={{padding: "10px", margin: "10px"}}
            type="number"
            placeholder="Search by Order ID"
            value={searchTerm}
            onChange={handleSearchChange}
          />         
          {filteredOrders.length > 0 ? (
            <ul className="orders-list">
              {filteredOrders.map((order) => (
                <li key={order.id} className="order-card">
                  <div className="order-details">
                    <h3>Order Details ----</h3>
                    <p><strong>Order ID:</strong> {order.orderId}</p>
                    <p><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleString()}</p>
                    <p><strong>Status:</strong> {order.status}</p>
                    <p><strong>Total Price:</strong> ₹{order.totalPrice}</p>
                    <p><strong>Payment Method:</strong> {order.payment}</p>
                    <p><strong>Quantity:</strong> {order.quantity}</p>
                    <p><strong>Pizza ID:</strong> {order.pizzaId}</p>
                  </div>
                  <div className="customer-details">
                    <h3>Customer Details ----</h3>
                    <p><strong>Username:</strong> {order.User?.username}</p>
                    <p><strong>Email:</strong> {order.User?.email}</p>
                    <p><strong>Contact Number:</strong> {order.contactNumber}</p>
                  </div>
                  <div className="delivery-details">
                    <h3>Delivery Details ----</h3>
                    <p><strong>Address:</strong> {order.deliveryAddress}</p>
                    <p><strong>Created At:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-orders">No orders available</p>
          )}
        </section>
      </main>
    </div>
  );
};

AdminDashboard.propTypes = {
  user: PropTypes.string,
  onLogout: PropTypes.func.isRequired,
};

export default AdminDashboard;
