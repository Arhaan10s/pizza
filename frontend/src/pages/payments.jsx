import { useState, useEffect } from "react";
import PropTypes from "prop-types";

const Payments = ({ userId }) => {
  const [payment, setPayment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:3000/api/getPayment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Fixed string interpolation
      },
      body: JSON.stringify({ userId }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setPayment(data); // Handle array of payments
        } else {
          setError(data.message || "No payment details found.");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Network or server error:", err);
        setError("An error occurred. Please try again.");
        setLoading(false);
      });
  }, [userId]);

  return (
    <div className="payment-container">
      <h1 className="payment-title">Payment Details</h1>
      {loading && <div className="loading">Loading...</div>}
      {error && <div className="error-message">{error}</div>}

      {payment.length > 0 ? (
        payment.map((p) => (
          <div key={p.id} id={`payment-${p.id}`} className="payment-details">
            <p><strong>Payment ID:</strong> {p.id}</p>
            <p><strong>Order ID:</strong> {p.orderId}</p>
            <p><strong>Amount:</strong> ₹{p.amount}</p>
            <p><strong>Payment Status:</strong> {p.paymentStatus}</p>
            <p><strong>Transaction ID:</strong> {p.transactionId}</p>
          </div>
        ))
      ) : (
        !loading && <p className="no-payment">No payment details found.</p>
      )}
    </div>
  );
};

Payments.propTypes = {
  userId: PropTypes.number.isRequired,
};

export default Payments;
