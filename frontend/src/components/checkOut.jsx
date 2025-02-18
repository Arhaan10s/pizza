import { useState } from "react";
import PropTypes from "prop-types";

const Checkout = ({ isCheckoutOpen, setIsCheckoutOpen, userId }) => {
  const [address, setAddress] = useState("");
  const [contact, setContact] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [showAlert, setShowAlert] = useState(false);

  const handleConfirmOrder = () => {
    if (!address || !contact) {
      alert("Please enter all details.");
      return;
    }

    const token = localStorage.getItem("token");

    fetch("http://localhost:3000/api/checkoutCart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id: userId,
        paymentMethod,
        deliveryAddress: address,
        contactNumber: contact,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "Checkout completed successfully") {
          setShowAlert(true);
          setTimeout(() => {
            window.location.href = "/payment";
          }, 2000);
        } else {
          alert(data.message);
        }
      })
      .catch((err) => {
        console.error("Network or server error:", err);
        alert("An error occurred. Please try again.");
      });
  };

  return (
    <div>
      {/* Checkout Modal */}
      <div className={`checkout-modal ${isCheckoutOpen ? "show" : ""}`}>
        <div className="modal-content">
          <h2>Enter Delivery Details</h2>
          <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Enter your address" />
          <input type="text" value={contact} onChange={(e) => setContact(e.target.value)} placeholder="Enter your phone number" />
          <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
            <option value="Cash">Cash</option>
            <option value="Card">Card</option>
            <option value="UPI">UPI</option>
          </select>
          <button onClick={handleConfirmOrder}>Confirm Order</button>
          <button className="close-btn" onClick={() => setIsCheckoutOpen(false)}>Close</button>
        </div>
      </div>

      {/* Custom Rotating Alert */}
      {showAlert && (
        <div className="custom-alert">
          <div className="rotating-symbol">✅</div>
          <p>Order Confirmed! Redirecting...</p>
        </div>
      )}
    </div>
  );
};

Checkout.propTypes = {
  isCheckoutOpen: PropTypes.bool.isRequired,
  setIsCheckoutOpen: PropTypes.func.isRequired,
  userId: PropTypes.number.isRequired,
};

export default Checkout;