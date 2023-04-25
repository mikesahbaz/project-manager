
import './App.css';
import RegisterPage from './Components/RegisterPage';
import LoginPage from './Components/LoginPage';
import Dashboard from './Components/Dashboard';
import CreateProjectPage from './Components/CreateProjectPage';
import ProjectPage from './Components/ProjectPage';
import Timesheet from './Components/Timesheet';
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
        <Route path='/projects/:projectId' element={<ProjectPage />} />
        <Route path='/timesheet' element={<Timesheet />} />
      </Routes>
      </div>

    </Router>
  );
}

export default App;
