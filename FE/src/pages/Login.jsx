import React from 'react';
import {useNavigate} from "react-router-dom"


const Login = () => {
    const navigate = useNavigate()
    const handleLogin = () =>{
        navigate("/crud")
    }
  return (
    <div className="h-screen flex items-center justify-center bg-white">
      <div className="bg-yellow text-blue p-8 rounded-xl shadow-lg w-full max-w-md font-montserrat">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block mb-1 text-sm">Email</label>
            <input
              type="email"
              id="email"
              placeholder="example@mail.com"
              className="w-full px-4 py-2 rounded-md text-blue border border-blue focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-1 text-sm">Password</label>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              className="w-full px-4 py-2 rounded-md text-blue border border-blue focus:outline-none focus:ring-2 focus:ring-yellow"
            />
          </div>

          <button onClick={handleLogin} className="w-full bg-blue text-yellow font-semibold py-2 rounded-md hover:bg-[#7DBEFF] hover:text-[#DEDAD2] transition cursor-pointer">
            Masuk
          </button>

          <p className="text-sm text-center mt-4">
            Belum punya akun? <span className="underline cursor-pointer hover:text-[#7DBEFF]">Daftar di sini</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
