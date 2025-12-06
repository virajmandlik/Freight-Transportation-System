import { useState } from "react";
import "./Login.css"; // Create this CSS file

const Login = ({ connectToMetamask }) => {
  const [role, setRole] = useState("Producer");

  return (
    <div className="login-container">
      <div className="decorative-circle blue"></div>
      <div className="decorative-circle orange"></div>
      
      <div className="login-box">
        <h2 className="login-title">
          <span>Login</span>
        </h2>

        <div className="form-group">
          <label>Select Role:</label>
          <select 
            value={role} 
            onChange={(e) => setRole(e.target.value)}
            className="role-select"
          >
            <option value="Producer">Producer</option>
            <option value="Shipper">Shipper</option>
            <option value="Receiver">Receiver</option>
          </select>
        </div>

        <button 
          onClick={() => connectToMetamask(role)} 
          className="login-button"
        >
          Connect with MetaMask
        </button>
      </div>
    </div>
  );
};

export default Login;