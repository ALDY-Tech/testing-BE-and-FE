
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Homepage from "./pages/Homepage"
import Crud from "./pages/crud"
import Login from "./pages/Login"
import CrudAdd from "./pages/CrudAdd"


function App() {
  return(
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Homepage/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/crud" element={<Crud/>}/>
      <Route path="/crud/add" element={<CrudAdd/>}/>
    </Routes>
    </BrowserRouter>
  )
}
export default App