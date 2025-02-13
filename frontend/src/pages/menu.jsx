import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import PizzaCard from "../components/PizzaCard";

const Menu = ({ addToCart, userId }) => {
  const [pizzas, setPizzas] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/user/getPizza', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => res.json())
    .then(data => {
      console.log("API Response:", data); // Log the entire response
      if (data && Array.isArray(data.pizza)) {
        console.log("pizza", data.pizza);
        setPizzas(data.pizza);
      } else {
        console.log(data.message);
      }
    })
    .catch(err => {
      console.log(err);
    });
  }, []);

  const categories = [
    { name: "Featured Items", count: 6 },
    { name: "Party Offer", count: 2 },
    { name: "Garlic Bread", count: 4 },
  ];

  return (
    <div className="app">
      <header className="header">
        <div className="search-and-filters">
          <input type="text" placeholder="Search Menu" />
          <div className="filters">
            <button className="veg">Veg</button>
            <button className="non-veg">Non-Veg</button>
          </div>
        </div>
      </header>

      <div className="main-content">
        <aside className="sidebar">
          <h3>Categories</h3>
          <ul>
            {categories.map((category, index) => (
              <li key={index}>
                <span>{category.name}</span>
                <span>{category.count}</span>
              </li>
            ))}
          </ul>
        </aside>
        <div className="content">
          <div className="featured-items">
            {pizzas.map((pizza, index) => (
              <PizzaCard key={index} pizzas={pizza} userId={userId} addToCart={addToCart} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

Menu.propTypes = {
  addToCart: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired, // Add this line
};

export default Menu;
