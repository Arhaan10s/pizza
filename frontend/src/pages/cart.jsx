import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Checkout from "../components/checkOut";

const Cart = ({ userId }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const handleCheckout = () => {
    setIsCheckoutOpen(true);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`http://localhost:3000/api/getCart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id: userId }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.Cart) {
          setCartItems(data.Cart);
        } else {
          console.error("Error fetching cart items:", data.message);
        }
      })
      .catch((err) => console.error("Network or server error:", err));
  }, [userId]);

  const calculateTotalPrice = (item) => item.price * item.quantity;
  const totalCartPrice = cartItems.reduce(
    (total, item) => total + calculateTotalPrice(item),
    0
  );

  const increaseQuantity = (cartId) => {
    const item = cartItems.find((item) => item.cartId === cartId);
    if (item) updateCart(item.cartId, item.quantity + 1);
  };

  const decreaseQuantity = (cartId) => {
    const item = cartItems.find((item) => item.cartId === cartId);
    if (item && item.quantity > 1) updateCart(item.cartId, item.quantity - 1);
  };

  const removeItem = (cartId) => {
    const token = localStorage.getItem("token");
    fetch(`http://localhost:3000/api/removeCart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ cartId, userId }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "Cart removed successfully") {
          setCartItems(cartItems.filter((item) => item.cartId !== cartId));
        } else {
          console.error("Error removing cart item:", data.message);
        }
      })
      .catch((err) => console.error("Network or server error:", err));
  };

  const updateCart = (cartId, quantity) => {
    const item = cartItems.find((item) => item.cartId === cartId);
    if (item) {
      const token = localStorage.getItem("token");
      fetch(`http://localhost:3000/api/updateCart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          cartId,
          userId,
          toppings: item.toppings,
          size: item.size,
          quantity,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message === "Cart updated successfully") {
            setCartItems(
              cartItems.map((item) =>
                item.cartId === cartId
                  ? { ...item, quantity, totalPrice: data.cartUpdate.totalPrice }
                  : item
              )
            );
          } else {
            console.error("Error updating cart item:", data.message);
          }
        })
        .catch((err) => console.error("Network or server error:", err));
    }
  };

  return (
    <div className="cart-container">
      <div className="cart">
        <h1 className="head">Shopping Cart</h1>
        <h2>Total: ₹{totalCartPrice}</h2>
        <button className="checkout-btn" onClick={handleCheckout}>
          Checkout
        </button>
        {cartItems.map((item) => (
          <div key={item.cartId} className="cart-item">
            <img src={item.image} alt={item.pizza} className="cart-item-image" />
            <div className="cart-item-details">
              <h4>{item.pizza}</h4>
              <p>Size: {item.size}</p>
              <p>Toppings: {item.toppings.join(", ")}</p>
              <div className="quantity-controls">
                <button className="quantity-btn minus" onClick={() => decreaseQuantity(item.cartId)}>-</button>
                <span>{item.quantity}</span>
                <button className="quantity-btn plus" onClick={() => increaseQuantity(item.cartId)}>+</button>
              </div>
              <p>Price: ₹{calculateTotalPrice(item)}</p>
              <button className="remove-btn" onClick={() => removeItem(item.cartId)}>Remove</button>
            </div>
          </div>
        ))}
      </div>
      {isCheckoutOpen && <Checkout isCheckoutOpen={isCheckoutOpen} setIsCheckoutOpen={setIsCheckoutOpen} userId={userId} />}
    </div>
  );
};

Cart.propTypes = {
  userId: PropTypes.number.isRequired,
};

export default Cart;