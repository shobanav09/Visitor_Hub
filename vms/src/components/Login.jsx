import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from '../img/logo.png';

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Hook to navigate to other pages

  // Handle the login submission
  const handleLogin = (e) => {
    e.preventDefault();
    
    // Default credentials
    const defaultUsername = "admin";
    const defaultPassword = "12345";
    
    // Check if the credentials match
    if (username === defaultUsername && password === defaultPassword) {
      // Navigate to another page (e.g., Dashboard)
      navigate("/home");
    } else {
      // Show an alert or error message
      alert("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg flex w-[600px]">
        {/* Left Side */}
        <div className="w-1/2 bg-[var(--color)] text-white flex flex-col items-center justify-center p-6 rounded-l-lg">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-lg font-semibold">WELCOME</h2>
          <p className="text-sm text-center">Login with your username and password to proceed.</p>
        </div>
        
        {/* Right Side */}
        <div className="w-1/2 p-6 flex flex-col justify-center">
          <img src={logo} alt="VIT Logo" className="h-12 mx-auto" />
          <h1 className="text-center font-sans font-bold">Visitor Hub</h1>
          <form onSubmit={handleLogin}>
            <label className="block text-sm font-medium text-gray-700">Login ID</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color)] mb-3"
              value={username}
              onChange={(e) => setUsername(e.target.value)} // Update username state
            />
            
            <label className="block text-sm font-medium text-gray-700">Password <span className="text-red-500">*</span></label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color)] mb-3"
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Update password state
            />
            
            <div className="text-xs text-gray-500 flex justify-between">
              <a href="#" className="hover:text-[var(--color)]">Forgot Password</a>
              <span>|</span>
              <a href="#" className="hover:text-[var(--color)]">Register</a>
            </div>
            
            <div className="flex mt-4 space-x-2">
              <button type="submit" className="w-1/2 bg-[var(--color)] text-white py-2 rounded-lg hover:bg-[var(--hover)]">
                Login
              </button>
              <button type="reset" className="w-1/2 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400">
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
