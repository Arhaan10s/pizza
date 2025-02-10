import PropTypes from 'prop-types';

const Cart = ({ cartItems, increaseQuantity, decreaseQuantity, removeItem }) => {

  

  const calculateTotalPrice = (item) => {
    const basePrice = item.totalPrice;
    // const toppingsPrice = item.toppings.length * item.toppingPrice;
    return (basePrice ) * item.quantity;
  };

  const totalCartPrice = cartItems.reduce((total, item) => total + calculateTotalPrice(item), 0);
  
  return (
    <div>
      <div className={`cart  'open'`}>
        <h2>Total Price of the Cart: ₹{totalCartPrice}</h2>
        {cartItems.map((item, id) => (
          <div key={id} className="cart-item">
            <img src={item.image} alt={item.pizza} className="cart-item-image" />
            <div className="cart-item-details">
              <h4>{item.pizza}</h4>
              <p>Size: {item.sizes}</p>
              <p>Toppings: {item.toppings.join(", ")}</p>
              <p>Quantity:</p>
              <div className="quantity-controls">
                <button className="quantity-btn minus" onClick={() => decreaseQuantity(item.id)}>-</button>
                <span className="quantity-value">{item.quantity}</span>
                <button className="quantity-btn plus" onClick={() => increaseQuantity(item.id)}>+</button>
              </div>
              <p>Price: ₹{calculateTotalPrice(item)}</p>
              <button className="remove-btn" onClick={() => removeItem(item.id)}>Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

Cart.propTypes = {
  cartItems: PropTypes.arrayOf(PropTypes.shape({
    pizzaId: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
    pizza: PropTypes.string.isRequired,
    size: PropTypes.string.isRequired,
    toppings: PropTypes.arrayOf(PropTypes.string),
    quantity: PropTypes.number.isRequired,
    totalPrice: PropTypes.number.isRequired,
    // toppingPrice: PropTypes.number.isRequired,
  })).isRequired,
  increaseQuantity: PropTypes.func.isRequired,
  decreaseQuantity: PropTypes.func.isRequired,
  removeItem: PropTypes.func.isRequired,
};

export default Cart;