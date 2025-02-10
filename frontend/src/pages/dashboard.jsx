import { useNavigate } from "react-router-dom";
import pizzaImg from "../assets/pizza-full.png";

const Dashboard = () => {
  const navigate = useNavigate(); 

  const handleShopNowClick = () => {
    navigate("/menu"); 
  };

  return (
    <div id="home-page">
      <section>
        <h2>Eat Pizza Everyday</h2>
        <p>Share Your Love For Pizza</p>
        <button onClick={handleShopNowClick}>Shop Now</button>
      </section>
      <section>
        <img src={pizzaImg} alt="Pizza" />
      </section>
    </div>
  );
};

export default Dashboard;
