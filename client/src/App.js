
import './App.css';
import RegisterPage from './Components/RegisterPage';
import LoginPage from './Components/LoginPage';
import Dashboard from './Components/Dashboard';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<RegisterPage />} />
        <Route path='/login' element={< LoginPage />} />
        <Route path='/dashboard' element={<Dashboard />} />
      </Routes>

    </Router>
  );
}

export default App;
