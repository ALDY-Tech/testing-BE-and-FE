import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../assets/logo.png";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:5000/login", {
        username,
        password,
      });

      console.log("Login response:", response.data); // ✅ Debug

      const { token, userId } = response.data;

      if (!userId) throw new Error("User ID not returned from backend.");

      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);

      navigate("/crud");
    } catch (error) {
      alert("Login gagal. Cek username atau password.");
      console.error("Login error:", error.response?.data || error.message);
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-white">
      <div>
        <img src={logo} height={300} width={300} alt="Logo" />
      </div>
      <div className="bg-white text-blue p-8 rounded-xl shadow-2xl w-full max-w-md font-montserrat">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="username" className="block mb-1 text-sm">
              Username
            </label>
            <input
              type="text"
              id="username"
              placeholder="example@mail.com"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 rounded-md text-blue border border-blue focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-1 text-sm">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-md text-blue border border-blue focus:outline-none focus:ring-2 focus:ring-yellow"
            />
          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-blue text-yellow font-semibold py-2 rounded-md hover:bg-[#7DBEFF] hover:text-[#DEDAD2] transition cursor-pointer"
          >
            Masuk
          </button>

          <p className="text-sm text-center mt-4">
            Belum punya akun?{" "}
            <span className="underline cursor-pointer hover:text-[#7DBEFF]">
              Daftar di sini
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
