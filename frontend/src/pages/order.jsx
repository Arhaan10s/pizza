import { useState, useEffect } from "react";
import PropTypes from "prop-types";

const Orders = ({ userId }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    } else {
      setError("No token found. Please log in.");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetch("http://localhost:3000/api/getOrder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: userId }),
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
    }
  }, [token, userId]);

  const orderRecieved = ({ orderId }) => {
    fetch("http://localhost:3000/api/received", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId, orderId }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // Show alert
          setShowAlert(true);
          setTimeout(() => setShowAlert(false), 3000); // Hide after 3 seconds

          // Remove the received order from the list
          setOrders((prevOrders) =>
            prevOrders.filter((order) => order.orderId !== orderId)
          );
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
  };

  return (
    <div className="orders-section">
      <h1 className="section-title">Orders</h1>
      {showAlert && (
        <div className="custom-alert-p" role="alert" aria-live="assertive">
          Enjoy your pizza! 🍕
        </div>
      )}
      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}
      {orders.length === 0 ? (
        <p className="no-orders">No orders found.</p>
      ) : (
        <ul className="orders-list">
          {orders.map((order) => (
            <li key={order.orderId} className="order-card">
              <div className="order-details">
                <h3>Order Details ----</h3>
                <p>
                  <strong>Order ID:</strong> {order.orderId}
                </p>
                <p>
                  <strong>Order Date:</strong>{" "}
                  {new Date(order.orderDate).toLocaleString()}
                </p>
                <p>
                  <strong>Status:</strong> {order.status}
                </p>
                <p>
                  <strong>Total Price:</strong> ₹{order.totalPrice}
                </p>
                <p>
                  <strong>Payment Method:</strong> {order.payment}
                </p>
                <p>
                  <strong>Quantity:</strong> {order.quantity}
                </p>
                <p>
                  <strong>Pizza ID:</strong> {order.pizzaId}
                </p>
              </div>
              <div className="customer-details">
                <h3>Customer Details ----</h3>
                <p>
                  <strong>Contact Number:</strong> {order.contactNumber}
                </p>
              </div>
              <div className="delivery-details">
                <h3>Delivery Details ----</h3>
                <p>
                  <strong>Address:</strong> {order.deliveryAddress}
                </p>
                <p>
                  <strong>Created At:</strong>{" "}
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>

              {order.status !== "Recieved" && (
                <button
                  className="received-button"
                  onClick={() => orderRecieved({ orderId: order.orderId })}
                >
                  Received
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

Orders.propTypes = {
  userId: PropTypes.number.isRequired,
};

export default Orders;