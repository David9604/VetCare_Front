import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import Login from './pages/login';
import Register from './pages/register';
import RecoverPassword from './pages/recoverpassword';
import ResetPassword from './pages/resetpassword';
import Navbar from './components/navbar';
import './App.css';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/recuperar-password" element={<RecoverPassword />} />
        <Route path="/restablecer-password" element={<ResetPassword />} />
        {/* Agrega más rutas aquí según sea necesario */}
      </Routes>
    </Router>
  );
}

export default App;