
import Home from "./pages/Home"
import Login from "./pages/Login"
import SignUp from "./pages/SignUp"
import {Routes, Route} from "react-router-dom"

function App() {

  return (
    <div>

    <Routes>

      <Route exact path="/dashboard" element={<Home/>} />
      <Route exact path="/login" element={<Login/>} />
      <Route exact path="/signUp" element={<SignUp/>} />

    </Routes>

    </div>
  )
}

export default App
