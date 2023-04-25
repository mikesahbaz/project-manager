import React from 'react';
import './Timesheet.css';
import NavBar from './NavBar';
import { useState, useEffect } from 'react';
import { auth } from '../../src/firebase_react';

export default function Timesheet() {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [showTimeEntryForm, setShowTimeEntryForm] = useState(false);
  const [timeSpent, setTimeSpent] = useState('');
  const [currentTaskId, setCurrentTaskId] = useState('');
  const [timeLogs, setTimeLogs] = useState([]);

  const resetTimeEntryForm = () => {
    setTimeSpent('');
    setCurrentTaskId('');
    setShowTimeEntryForm(false);
  }


  const fetchTimeLogsForEachTask = async function (taskIds) {
    try {
      const timeLogsPromises = taskIds.map(async taskId => {
        const res = await fetch(`http://localhost:3001/timelog/${taskId}`);
        const data = await res.json();
        if (res.ok) {
          return { taskId, logs: data };
        } else {
          console.error(data.message);
          return { taskId, logs: [] };
        }
      });
  
      const timeLogsResults = await Promise.all(timeLogsPromises);
      const timeLogsObject = timeLogsResults.reduce((acc, { taskId, logs }) => {
        acc[taskId] = logs;
        return acc;
      }, {});
      setTimeLogs(timeLogsObject);
  
    } catch (error) {
      console.error('Error fetching time logs for each task', error);
    }
  };

  const calculateTotalTimeForTask = (taskId) => {
    const logs = timeLogs[taskId] || [];
    const totalTimeInMinutes = logs.reduce((acc, log) => acc + log.minutesSpent, 0);
    return (totalTimeInMinutes / 60).toFixed(2);
  };

  const fetchProjects = async function (firebaseID) {
    try {
      const res = await fetch(`http://localhost:3001/users/${firebaseID}/projects`);
      const data = await res.json();
      if (res.ok) {
        setProjects(data.projects);
        const projectIds = data.projects.map(project => project.id);
        fetchTasksForEachProject(projectIds);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error('Error fetching projects: ', error);
    }
  }

  const fetchTasksForEachProject = async function (projectIds) {
    try {
      const tasksPromises = projectIds.map(async projectId => {
        const res = await fetch(`http://localhost:3001/projects/${projectId}/tasks`);
        const data = await res.json();
        if (res.ok) {
          return data.tasks;
        } else {
          console.error(data.message);
          return [];
        }
      });

      const tasksResults = await Promise.all(tasksPromises);
      const allTasks = tasksResults.flat();
      setAllTasks(allTasks);
      
    } catch (error) {
      console.error('Error fetching tasks for each project', error);
    }
  }

  const handleSubmitTimeEntry = async function (e) {
    e.preventDefault();

    const arrayForFetching = [];

    const formData = {
      minutesSpent: timeSpent,
      taskId: currentTaskId
    }
    fetch(`http://localhost:3001/timelog/${currentTaskId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
      .then(response => response.json())
      .then(data => {
        resetTimeEntryForm();
        arrayForFetching.push(currentTaskId);
        fetchTimeLogsForEachTask(arrayForFetching);
      })
      .catch(error => console.error(error));
  }

  useEffect( () => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setUser(user);
      if (user) {
        fetchProjects(user.uid);
        if (allTasks.length > 0) {
          const taskIds = allTasks.map(task => task.id);
          fetchTimeLogsForEachTask(taskIds);
        }
      }
    });
    return unsubscribe;
  }, [])

  const timeEntryForm = (
    <div className='time-entry-form-container'>
      <h2>Time Entry</h2>
      <form onSubmit={handleSubmitTimeEntry}>
        <label>Time Spent in Minutes</label>
        <input type='number' id='timeSpent' value={timeSpent} onChange={event => setTimeSpent(event.target.value)} placeholder='Time Spent in Minutes'></input>
        <button type='submit'>Submit Time Entry</button>
      </form>
    </div>
  )


  return (
    <div className='timesheet-container'>
      <NavBar/>
      <div className='main-content-container'>
        {allTasks.map((task) => (
        <div key={task.id} className="task-item">
        <div className="task-item-name">{task.name}</div>
        <div className="task-item-description">{task.description}</div>
        <div className='task-item-total-time'>{calculateTotalTimeForTask(task.id)} hours spent</div>
        <button className='time-entry-btn' onClick={() => {
          setShowTimeEntryForm(!showTimeEntryForm);
          setCurrentTaskId(task.id);
        }}>Enter Time</button>
      </div>
  ))}
  {showTimeEntryForm && timeEntryForm}
</div>

    </div>
  )
}