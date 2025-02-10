import PropTypes from 'prop-types';
import AdminHeader from './adminHeader';
import { useState, useEffect } from 'react';

const AddPizza = ({ user, onLogout }) => {
  const [pizza, setPizza] = useState('');
  const [category, setCategory] = useState('');
  const [basePrice, setBasePrice] = useState('');
  const [toppings, setToppings] = useState([]);
  const [size, setSize] = useState('');
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');
  const [availableToppings, setAvailableToppings] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [availableSizes, setAvailableSizes] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/admin/getAvailableOptions', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => res.json())
    .then(data => {
      setAvailableToppings(data.toppings);
      setAvailableCategories(data.categories);
      setAvailableSizes(data.sizes);
    })
    .catch(err => {
      console.log(err);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const adminData = JSON.parse(localStorage.getItem('adminData'));
    const adminId = adminData?.adminId;

    if (!adminId) {
      setMessage('Admin ID is missing!');
      return;
    }

    const formData = new FormData();
    formData.append('pizza', pizza);
    formData.append('categories', category);
    formData.append('basePrice', basePrice);
    formData.append('toppings', JSON.stringify(toppings));
    formData.append('size', size);
    formData.append('image', image);
    formData.append('adminId', adminId);

    try {
      const response = await fetch('http://localhost:3000/api/admin/addPizza', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        setMessage('Pizza added successfully!');
      } else {
        setMessage(data.message);
      }
    } catch (err) {
      setMessage('Error adding pizza: ' + err.message);
    }
  };

  return (
    <div className="admin-dashboard">
      <AdminHeader user={user} onLogout={onLogout} />
      <main className="dashboard-content">
        <h2 className="section-title">Add Pizza</h2>
        <form onSubmit={handleSubmit} className="add-pizza-form">
          <div className="form-group">
            <label htmlFor="pizza">Pizza Name:</label>
            <input
              type="text"
              id="pizza"
              value={pizza}
              onChange={(e) => setPizza(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="category">Category:</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select Category</option>
              {availableCategories.map((category, index) => (
                <option key={index} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="basePrice">Base Price:</label>
            <input
              type="number"
              id="basePrice"
              value={basePrice}
              onChange={(e) => setBasePrice(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="toppings">Toppings:</label>
            <div className="selected-toppings">
              {toppings.map((topping, index) => (
                <span key={index} className="selected-item">
                  {topping} <button type="button" onClick={() => setToppings(toppings.filter(t => t !== topping))}>×</button>
                </span>
              ))}
            </div>
            <select onChange={(e) => {
              if (!toppings.includes(e.target.value) && e.target.value) {
                setToppings([...toppings, e.target.value]);
              }
            }}>
              <option value="">Select Topping</option>
              {availableToppings.map((topping, index) => (
                <option key={index} value={topping}>{topping}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Size:</label>
            <select value={size} onChange={(e) => setSize(e.target.value)} required>
              <option value="">Select Size</option>
              {availableSizes.map((size, index) => (
                <option key={index} value={size}>{size}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="image">Image:</label>
            <input
              type="file"
              id="image"
              onChange={(e) => setImage(e.target.files[0])}
              required
            />
          </div>
          <button type="submit" className="submit-btn">Add Pizza</button>
        </form>
        {message && <p className="message">{message}</p>}
      </main>
    </div>
  );
};

AddPizza.propTypes = {
  user: PropTypes.string,
  onLogout: PropTypes.func.isRequired,
};

export default AddPizza;