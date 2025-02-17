import { useState } from "react";
import PropTypes from "prop-types";

const PizzaCard = ({ pizzas, userId }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedToppings, setSelectedToppings] = useState([]);

  const sizeMultipliers = { Regular: 1, Medium: 1.5, Large: 2 }; // Multipliers for sizes
  const calculatedPrices = Object.fromEntries(
    Object.entries(sizeMultipliers).map(([size, multiplier]) => [
      size,
      (pizzas.basePrice * multiplier).toFixed(2), // Calculate size-based prices
    ])
  );

  const toppings = pizzas.toppings || []; // Fallback for toppings

  const openModal = () => setShowModal(true);
  const closeModal = () => {
    setShowModal(false);
    setSelectedSize("");
    setSelectedToppings([]);
  };

  const handleAddToCart = () => {
    const token = localStorage.getItem("token"); // Retrieve the token from localStorage

    if (!token) {
      console.error("No token found. User might not be logged in.");
      return;
    }
    console.log("Add to Cart", token)
    const cartData = {
      userId: userId,
      pizzaId: pizzas.pizzaId,
      toppings: selectedToppings,
      category: pizzas.categories,
      size: selectedSize,
      quantity: 1,
    };

    fetch(`http://localhost:3000/api/addCart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Include the token in the Authorization header
      },
      body: JSON.stringify(cartData),
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log("dataa",data);
        if (data.message === "Pizza added successfully") {
          console.log("Pizza added to cart:", data.cart);
        } else {
          console.error("Error adding pizza to cart:", data.message);
        }
      })
      .catch((err) => {
        console.error("Network or server error:", err);
      });

    closeModal();
  };

  return (
    <div className="pizza-card">
      <img src={pizzas.image} alt={pizzas.pizza} className="pizzas-image" />
      <h4>{pizzas.pizza}</h4>
      <h4>Rs.{pizzas.basePrice}</h4>
      <button className="add-btn" onClick={openModal}>
        Add +
      </button>

      {showModal && (
        <div className="modal">
          <h3>Select Pizza Size</h3>
          {Object.keys(calculatedPrices).map((size) => (
            <button
              key={size}
              className={`modal-btn ${selectedSize === size ? "selected" : ""}`}
              onClick={() => setSelectedSize(size)}
              style={{
                backgroundColor:
                  selectedSize === size
                    ? "rgba(209, 248, 13, 0.84)"
                    : "#4caf50",
              }}
            >
              {size.toUpperCase()} - ₹{calculatedPrices[size]}
            </button>
          ))}
          {selectedSize && (
            <>
              <h3>Select Toppings</h3>
              {toppings.length > 0 ? (
                toppings.map((topping, index) => (
                  <div className="topping-option" key={index}>
                    <input
                      type="checkbox"
                      id={topping}
                      onChange={(e) => {
                        const { checked } = e.target;
                        if (checked) {
                          setSelectedToppings((prev) => [...prev, topping]);
                        } else {
                          setSelectedToppings((prev) =>
                            prev.filter((item) => item !== topping)
                          );
                        }
                      }}
                    />
                    <label htmlFor={topping}>{topping}</label>
                  </div>
                ))
              ) : (
                <p>No toppings available</p>
              )}
              <button className="modal-btn" onClick={handleAddToCart}>
                Add to Cart
              </button>
            </>
          )}
          <button className="modal-close" onClick={closeModal}>
            Close
          </button>
        </div>
      )}
    </div>
  );
};

// Define prop types for PizzaCard
PizzaCard.propTypes = {
  pizzas: PropTypes.shape({
    pizzaId: PropTypes.number.isRequired,
    pizza: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    basePrice: PropTypes.number.isRequired, // Single numeric value
    toppings: PropTypes.arrayOf(PropTypes.string), // Optional
    categories: PropTypes.string.isRequired, // Add this line
  }).isRequired,
  userId: PropTypes.string.isRequired, // Add this line
};

export default PizzaCard;