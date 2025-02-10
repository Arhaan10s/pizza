import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';

const AdminLogin = ({ onAdminLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = {
            email: email,
            password: password
        };
        fetch('http://localhost:3000/api/signInAdmin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(data => {
            if (data) {
                console.log("data", data);
                // Store the data in localStorage
                localStorage.setItem('adminData', JSON.stringify(data));
                onAdminLogin(data);
                navigate("/admin-dashboard");
            } else {
                console.log("Invalid login response", data);
            }
        })
        .catch(err => {
            console.error("Error during login:", err);
        });
    };

    return (
        <div className="login-container">
            <h2>Admin Login</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

AdminLogin.propTypes = {
    onAdminLogin: PropTypes.func.isRequired,
};

export default AdminLogin;
