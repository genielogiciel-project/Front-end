import AuthRegister from "./pages/authForms/AuthRegister";
import Login from "./pages/login/Login";
import {BrowserRouter as Router,Route,Routes} from "react-router-dom" ;
import Register from "./pages/register/Register";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Add more routes here as needed */}
      </Routes>
    </Router>
  );
}

export default App;
