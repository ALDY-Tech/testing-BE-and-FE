import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { decodeToken } from "react-jwt";
import logo from "../assets/logo.png";

const Login = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault(); // prevent form refresh
    setError("");
    try {
      const res = await axios.post("http://localhost:5000/login", {
        username,
        password,
      });

      const token = res.data.token;
      localStorage.setItem("token", token);

      const decoded = decodeToken(token);
      localStorage.setItem("userId", decoded.userId);

      navigate("/crud");
    } catch (err) {
      setError(err.response?.data?.msg || "Login gagal");
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-white">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md font-montserrat">
        <div className="flex justify-center pb-2">
          <img src={logo} width={300} alt="Logo" />
        </div>
        <h2 className="text-2xl text-blue font-bold mb-6 text-center">Login</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="username" className="block mb-1 text-sm">
              Username
            </label>
            <input
              type="text"
              id="username"
              placeholder="Input your username"
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
              className="w-full px-4 py-2 rounded-md text-blue border border-blue focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
            />
          </div>

          {error && <p className="text-red-600 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue text-yellow font-semibold py-2 rounded-md hover:bg-[#7DBEFF] hover:text-[#DEDAD2] transition cursor-pointer"
          >
            Masuk
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          Belum punya akun?{" "}
          <a href="/register" className="underline cursor-pointer hover:text-[#7DBEFF]">
            Daftar di sini
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
