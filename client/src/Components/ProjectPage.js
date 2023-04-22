import React, {useState, useEffect} from 'react';
import './ProjectPage.css';
import NavBar from './NavBar';

export default function ProjectPage( {project} ) {
  const [tasks, setTasks] = useState([]);
  const [bugs, setBugs] = useState([]);

  useEffect(() => {
    fetchTasks(project.id);
  }, [])

  const fetchTasks = async function (projectId) {
    try {
      const res = await fetch(`http://localhost:3001/projects/${projectId}/tasks`);
      const data = await res.json();

      if (res.ok) {
        setTasks(data.tasks);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error('Error fetching tasks: ', error);
    }
  }

  // const fetchBugs = async function (taskId) {
  //   try {
  //     const res = await fetch(`http://localhost:3001/tasks/${taskId}/bugs`);
  //     const data = await res.json();

  //     if (res.ok) {
  //       setBugs(data.bugs);
  //     } else {
  //       console.error(data.message);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching bugs', error);
  //   }
  // }


  return (
    <div className='project-page-container'>
      <NavBar></NavBar>
    <div className='main-content-container'>
      <div className='project-details'>
        <h1>Project Name</h1>
        <h2>Project Description</h2>
        <h3>Project Deadline</h3>
        <h2>Project Team Members</h2>
      </div>
      <div className='tasks-container'>
        <div className='tasks-and-btn-container'>
        <h1>Tasks</h1>
        <button className='create-task-btn'>Create Task</button>
        </div>
        <h1>Task Name</h1>
        <h3>Task Description</h3>
        <h3>Task Deadline</h3>
      </div>
      <div>

      </div>
    </div>

    </div>

  )
}