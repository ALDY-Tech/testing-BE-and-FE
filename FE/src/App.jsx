import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [msg, setMsg] = useState("");
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/hello")
      .then((res) => setMsg(res.data.message))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="flex justify-center items-center h-screen w-screen text-2xl">
      <h1 className="font-poppins text-yellow"><span className="text-blue">From api/hello:</span> {msg}</h1>
    </div>
  )
}

export default App
