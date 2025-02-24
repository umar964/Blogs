// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// const AdminLogin = () => {
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [error, setError] = useState("");
//     const navigate = useNavigate();

//     const handleLogin = async (e) => {
//         e.preventDefault();
//         setError("");

//         try {
           
//             const response = await axios.post("http://localhost:5000/api/admin/admin-login", { email, password });
            

//             localStorage.setItem("token", response.data.token); // Store token as token
//             localStorage.setItem("isAdmin", "true"); // Store admin status true
//             navigate("/"); // Redirect to homepage after login
//         } catch (err) {
//             setError(err.response?.data?.error || "Login failed");
//         }
//     };

//     return (
//         <div>
//             <h2>Admin Login</h2>
//             {error && <p style={{ color: "red" }}>{error}</p>}
//             <form onSubmit={handleLogin}>
//                 <input
//                     type="email"
//                     placeholder="Enter Email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     required
//                 />
//                 <input
//                     type="password"
//                     placeholder="Enter Password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     required
//                 />
//                 <button type="submit">Login</button>
//             </form>
//         </div>
//     );
// };

// export default AdminLogin;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AdminLogin.css"; // Import CSS file

const AdminLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL


    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await axios.post(`${BACKEND_URL}/api/admin/admin-login`, { email, password });

            localStorage.setItem("token", response.data.token); // Store token
            localStorage.setItem("isAdmin", "true"); // Store admin status
            navigate("/"); // Redirect to homepage after login
        } catch (err) {
            setError(err.response?.data?.error || "Login failed");
        }
    };

    return (
        <div className="admin-login-container">
            <h2>Admins Login</h2>
            {error && <p className="admin-error">{error}</p>}
            <form onSubmit={handleLogin} className="admin-login-form">
                <input
                    type="email"
                    placeholder="Enter Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="admin-input"
                />
                <input
                    type="password"
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="admin-input"
                />
                <button type="submit" className="admin-button">Login</button>
            </form>
        </div>
    );
};

export default AdminLogin;

