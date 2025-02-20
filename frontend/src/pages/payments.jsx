import { useState, useEffect } from "react";
import PropTypes from "prop-types";

const Payments = ({ userId }) => {
  const [payment, setPayment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token,setToken] = useState(null);

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
    if(token){
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
    }
  }, [userId]);

  const makePayment = ({ paymentId, transactionId, amount }) => {
    fetch("http://localhost:3000/api/completePayment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ paymentId, transactionId, amount }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          alert(data.message);
          // Update the payment status in the state
          setPayment((prevPayments) =>
            prevPayments.map((payment) =>
              payment.paymentId === paymentId
                ? { ...payment, paymentStatus: data.paymentStatus }
                : payment
            )
          );
        } else {
          setError(data.message || "Payment failed.");
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
            <p><strong>Payment Method:</strong> {p.paymentMethod}</p>
                {p.paymentStatus !== "Completed" && (  
                <button
                className="payment-button"
                onClick={() =>
                  makePayment({
                    paymentId: p.paymentId,
                    transactionId: p.transactionId,
                    amount: p.amount,
                  })
                }
              >
                Pay
              </button>  
              )}      
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
