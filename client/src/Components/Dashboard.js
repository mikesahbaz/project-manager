import React, { useState, useEffect } from 'react';
import { auth } from '../../src/firebase_react';
import NavBar from './NavBar';
import { useNavigate } from 'react-router-dom';
// import { FiBell, FiCalendar, FiSearch  } from 'react-icons/fi';
import './Dashboard.css';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  const fetchProjects = async function (firebaseID) {
    try {
      const res = await fetch(`http://localhost:3001/users/${firebaseID}/projects`);
      const data = await res.json();
      if (res.ok) {
        setProjects(data.projects);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error('Error fetching projects: ', error);
    }
  }

  useEffect( () => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setUser(user);
      if (user) {
        fetchProjects(user.uid);
      }
    });
    return unsubscribe;
  }, [])

  const handleCreateProjectClick = () => {
    navigate('/createProject');
  }

  return (
    <div>
      <NavBar></NavBar>
      <div className='main-content'>
      {user && (
        <div>
          <div className='projects-container'>
            <div className='text-and-btn-container'>
              <h1 className='projects-text'>My Projects </h1>
              <button className='create-project-btn' onClick={handleCreateProjectClick}>Create a new project</button>
            </div>
            {projects.map((project) => (
              <div key={project.id} className='project-item'>
                <h2>{project.name}</h2>
                <h4>{project.description}</h4>
                <h3>{project.deadline}</h3>
              </div>
            ))}
          </div>
        </div>
      )}

      </div>
    </div>
  )
}