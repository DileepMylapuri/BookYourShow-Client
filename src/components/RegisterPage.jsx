import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContent";
import API_BASE_URL from "../config";

export default function RegisterPage() {
  const [isLogin, setIsLogin] = useState(false); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [username, setUsername] = useState("");

  const navigate = useNavigate();
  const {login} = useAuth();

useEffect(() => {
    if (success || error) {
        const timer = setTimeout(() => {
        setError("");
        setSuccess("");
        }, 3000);
        return () => clearTimeout(timer);
    }
}, [success, error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!username || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }   

    // Basic email format validation
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      setError("Invalid email format.");
      return;
    }

     try {
    // Call backend API
    const response = await fetch(`${API_BASE_URL}/api/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, username, password }), // here using email as username or you can add username input
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.message || "Registration failed.");
    } else {
      setSuccess("Registration successful! You can now log in.");
      setEmail("");
      setUsername("");
      setPassword("");
      setConfirmPassword("");
      setIsLogin(true);
    }
    } catch (apiError) {
    setError(apiError.message || "Registration failed. Please try again.");
    }
};

const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email && !username) {
      setError("Please enter email or username.");
      return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
            emailOrUsername: email || username,
            password,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            setError(data.message || "Login failed.");
        } else {
            login(data.user);
            navigate(`/`);
        }
        } catch (apiError) {
        setError(apiError.message || "Login failed. Please try again.");
        }
    };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-900 p-4">
      <div className="bg-gray-800 text-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">{isLogin ? "Login" : "Register"}</h2>
          {error && <div className="text-red-800 p-2 rounded">{typeof error === "string" ? error : String(error)}</div>}
          {success && <div className="bg-green-600 text-white p-2 rounded">{success}</div>}

        <form onSubmit={isLogin? handleLogin : handleSubmit} className="flex flex-col gap-4">
        {!isLogin && (
            <input
            type="text"
            placeholder="Username"
            className="p-3 rounded bg-gray-700 border border-gray-600"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            />
        )}
          <input
            type="email"
            placeholder="Email"
            className="p-3 rounded bg-gray-700 border border-gray-600"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="p-3 rounded bg-gray-700 border border-gray-600"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        {!isLogin && (
          <input
            type="password"
            placeholder="Confirm Password"
            className="p-3 rounded bg-gray-700 border border-gray-600"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
          />
        )}
          <button
            type="submit"
            className="bg-pink-600 hover:bg-pink-700 transition rounded py-3 font-bold text-lg shadow"
          >
            {isLogin? "Login" : "Register"}
          </button>
        </form>
         <div className="text-center mt-4">
          {isLogin ? (
            <p>
              Don’t have an account?{" "}
              <button
                className="text-pink-400 underline"
                onClick={() => setIsLogin(false)}
              >
                Register
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <button
                className="text-pink-400 underline"
                onClick={() => setIsLogin(true)}
              >
                Login
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
