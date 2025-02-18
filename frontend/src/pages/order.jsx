import { useState, useEffect } from "react";
import PropTypes from 'prop-types';

const Orders = ({userId}) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:3000/api/getOrder", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({id:userId})
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.Orders) {
          setOrders(data.Orders);
        } else {
          setError(data.message);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Network or server error:", err);
        setError("An error occurred. Please try again.");
        setLoading(false);
      });
  }, [userId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="orders-section">
      <h1 className="section-title">Orders</h1>
      {orders.length === 0 ? (
        <p className="no-orders">No orders found.</p>
      ) : (
        <ul className="orders-list">
          {orders.map((order) => (
            <li key={order.orderId} className="order-card">
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
      )}
    </div>
  );
};

Orders.propTypes = {
  userId: PropTypes.number.isRequired, // Add this line
};

export default Orders;