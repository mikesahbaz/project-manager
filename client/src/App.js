
import './App.css';
import RegisterPage from './Components/RegisterPage';
import LoginPage from './Components/LoginPage';
import Dashboard from './Components/Dashboard';
import CreateProjectPage from './Components/CreateProjectPage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div>
      <Routes>
        <Route path='/' element={<RegisterPage />} />
        <Route path='/login' element={< LoginPage />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/createProject' element={<CreateProjectPage />}  />
      </Routes>
      </div>

    </Router>
  );
}

export default App;
