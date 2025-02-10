import "./ts.css";
import delIcon from "../assets/Edumall Checkout Page 4 (1).jpg"
const Ts = () => {
  const products = [
    {
      id: 1,
      image: "https://picsum.photos/200/150?random=1",
      title: "DELL Inspiron 15 With Backlit Keyboard",
      description:
        "Intel Core i5 13th Gen 1334U - (8 GB/512 GB SSD/Windows 11 Home)",
      seller: "Vision Star",
      price: "SAR 40.00",
      originalPrice: "SAR 60.00",
      returnInfo: "14 Days Return Available",
      deliveryDate: "30 Jan 2025",
    },
    {
      id: 2,
      image: "https://picsum.photos/200/150?random=2",
      title: "HP Pavilion 15 With Backlit Keyboard",
      description:
        "Intel Core i7 12th Gen - (16 GB/1 TB SSD/Windows 11 Pro)",
      seller: "Tech World",
      price: "SAR 50.00",
      originalPrice: "SAR 70.00",
      returnInfo: "14 Days Return Available",
      deliveryDate: "1 Feb 2025",
    },
    {
      id: 3,
      image: "https://picsum.photos/200/150?random=3",
      title: "Lenovo IdeaPad Slim 3",
      description:
        "AMD Ryzen 5 - (8 GB/512 GB SSD/Windows 11 Home)",
      seller: "Smart Tech",
      price: "SAR 35.00",
      originalPrice: "SAR 55.00",
      returnInfo: "14 Days Return Available",
      deliveryDate: "2 Feb 2025",
    },
  ];
  

  return (
    <div className="container">
      {products.map((product) => (
        <div className="product-card" key={product.id}>
         
          <img
            src={product.image}
            alt="Product"
            className="product-image"
          />

          
          <div className="product-details">
            <h2 className="product-title">{product.title}</h2>
            <p className="product-description">
              {product.description}
              <br />
              Sold By: {product.seller}
            </p>
            <div className="options">
              <div className="option">
                <label htmlFor={`size-${product.id}`}>Size:</label>
                <select id={`size-${product.id}`} className="dropdown">
                  <option>L</option>
                  <option>M</option>
                  <option>S</option>
                </select>
              </div>
              <div className="option">
                <label htmlFor={`quantity-${product.id}`}>Qty:</label>
                <select id={`quantity-${product.id}`} className="dropdown">
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                </select>
              </div>
            </div>
            <div className="pricing">
              <span className="current-price">{product.price}</span>
              <span className="original-price">{product.originalPrice}</span>
            </div>
            <p className="return-info">{product.returnInfo}</p>
          </div>

          
          <div className="additional-info">
            <p className="delivery-info">
            <img
              src={delIcon}
              alt="Delivery Icon"
              className="icon-delivery"
            />

              Delivery By: <span className="delivery-date">{product.deliveryDate}</span>
            </p>
            <button className="remove-button">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="icon"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Ts;
