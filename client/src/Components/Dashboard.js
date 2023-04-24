import React, { useState, useEffect } from 'react';
import { auth } from '../../src/firebase_react';
import NavBar from './NavBar';
import { useNavigate } from 'react-router-dom';
import { AiFillCloseCircle } from 'react-icons/ai';
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

  const handleProjectDelete = async function (projectId) {
    fetch(`http://localhost:3001/projects/${projectId}`, {
      method: 'DELETE',
    })
    .then(response => {
      if (response.ok) {
        setProjects(projects.filter(project => project.id !== projectId));
      } else {
        console.error('Error deleting bug');
      }
    })
    .catch(error => console.error('Error deleting bug: ', error));
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

  const handleProjectClick = (projectId) => {
    navigate(`/projects/${projectId}`)
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
                <div className='project-item-details'>
                <h2 onClick={ () => handleProjectClick(project.id)} style={{cursor: 'pointer'}}>{project.name}</h2>
                <h3>{project.description}</h3>
                </div>
                <div className='project-item-buttons'>
                  <button className='project-delete-btn' onClick={() => handleProjectDelete(project.id)}><AiFillCloseCircle/></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      </div>
    </div>
  )
}