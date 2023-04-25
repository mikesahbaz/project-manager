import React, {useState, useEffect} from 'react';
import './ProjectPage.css';
import NavBar from './NavBar';
import { useParams } from 'react-router-dom';
import { AiFillCheckCircle, AiFillCloseCircle} from 'react-icons/ai';
import { BiBug } from 'react-icons/bi';
// change
export default function ProjectPage() {
  const { projectId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [bugs, setBugs] = useState([]);
  const [project, setProject] = useState(null);
  const [taskName, setTaskName] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('');
  const [deadline, setDeadline] = useState('');
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [bugName, setBugName] = useState('');
  const [bugDescription, setBugDescription] = useState('');
  const [bugPriority, setBugPriority] = useState('');
  const [showCreateTicket, setShowCreateTicket] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState(null);
  const [completedTasks, setCompletedTasks] = useState([]);
  

  const resetForm = () => {
    setTaskName('');
    setDescription('');
    setPriority('');
    setDeadline('');
    setShowCreateTask(false);
  }

  const resetBugForm = () => {
    setBugName('');
    setBugDescription('');
    setBugPriority('');
    setShowCreateTicket(false);
  }

  const handleSubmitTask = async function (e) {
    e.preventDefault();
    
    const formData = {
      name: taskName,
      description,
      priority,
      deadline,
    }
    fetch(`http://localhost:3001/projects/${projectId}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
      .then(response => response.json())
      .then(newTask => {
        setTasks([...tasks, newTask]);
        resetForm();
      })
      .catch(error => console.error(error));
  }



  const handleSubmitTicket = async function (e) {
    e.preventDefault();

    const formData = {
      name: bugName,
      description: bugDescription,
      priority: bugPriority,
      taskId: currentTaskId,
    }
    fetch(`http://localhost:3001/bugs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
      .then(response => response.json())
      .then(newTicket => {
        setBugs([...bugs, newTicket]);
        resetBugForm();
        
      })
  }

  const handleTaskDelete = async function (taskId) {
    fetch(`http://localhost:3001/tasks/${taskId}`, {
      method: 'DELETE',
    })
    .then(response => {
      if (response.ok) {
        setTasks(tasks.filter(task => task.id !== taskId));
      } else {
        console.error('Error deleting task');
      }
    })
    .catch(error => console.error('Error deleting task:', error));
  }

  const handleBugDelete = async function (bugId) {
    fetch(`http://localhost:3001/bugs/${bugId}`, {
      method: 'DELETE',
    })
    .then(response => {
      if (response.ok) {
        setBugs(bugs.filter(bug => bug.id !== bugId));
      } else {
        console.error('Error deleting bug');
      }
    })
    .catch(error => console.error('Error deleting bug:', error));
  }


  useEffect(() => {
    fetchProject();
    fetchTasks(projectId);
  }, [])

  useEffect(() => {
    if (tasks.length > 0) {
      fetchTickets(tasks).then((tickets) => {
        setBugs(tickets);
      })
    }
  }, [tasks])

  const fetchProject = async function () {
    try {
      const res = await fetch(`http://localhost:3001/projects/${projectId}`);
      const data = await res.json();
      if (res.ok) {
        setProject(data.project);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error('Error fetching project', error);
    }
  }

  const fetchTasks = async function () {

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

  const fetchTickets = async function (tasks) {
    try {
      const tickets = await Promise.all(tasks.map(async (task) => {
        const res = await fetch(`http://localhost:3001/tasks/${task.id}/bugs`);
        const data = await res.json();
  
        if (res.ok) {
          return data.bugs;
        } else {
          console.error(data.message);
          return [];
        }
      }));

      return tickets.flat();
    } catch (error) {
      console.error('Error fetching tickets: ', error);
      return [];
    }
  }

  const handleTaskComplete = async function (taskId) {
    try {
      const response = await fetch(`http://localhost:3001/tasks/${taskId}/complete`, {
        method: 'PUT',
      });
      if (response.ok) {
        const updatedTask = await response.json();
        console.log(updatedTask);
        console.log(tasks);
        setTasks(tasks.map( (task) => (task.id === taskId ? updatedTask : task )));
        console.log(tasks);
      } else {
        console.error('error completing the task');
      }
    } catch (error) {
      console.error('Error completing the task', error);
    }
  }

  const createTaskForm = (
    <div className='create-task-form'>
      <button className='close-create-task-form' onClick={() => setShowCreateTask(!showCreateTask)}><AiFillCloseCircle></AiFillCloseCircle></button>
      <h2>Create a new Task</h2>
      <form onSubmit={handleSubmitTask}>
        <input type='text' value={taskName} onChange={event => setTaskName(event.target.value)} placeholder='Task Name' ></input>
        <input type='text' value={description} onChange={event => setDescription(event.target.value)} placeholder='Task Description' ></input>
        <label>Task Priority: </label>
        <select className='task-priority-selector' onChange={event => setPriority(event.target.value)}>
          <option value={'Low'}>Low</option>
          <option value={'Medium'}>Medium</option>
          <option value={'High'}>High</option>
        </select>
        <label>Deadline: </label>
        <input type='date' value={deadline} onChange={event => setDeadline(event.target.value)} placeholder='Task Deadline' ></input>
        <button type='submit' className='submit-task-btn'>Create</button>

      </form>
    </div>
  )

  const createTicketForm = (
    <div className='create-ticket-form'>
      <h2>Create a new ticket</h2>
      <form onSubmit={handleSubmitTicket}>
        <input type='text' value={bugName} onChange={event => setBugName(event.target.value)} placeholder='Ticket Name' ></input>
        <input type='text' value={bugDescription} onChange={event => setBugDescription(event.target.value)} placeholder='Enter a description of the bug'></input>
        <label>Task Priority: </label>
        <select className='ticket-priority-selector' onChange={event => setPriority(event.target.value)}>
          <option value={'Low'}>Low</option>
          <option value={'Medium'}>Medium</option>
          <option value={'High'}>High</option>
        </select>
        <button type='submit' className='submit-ticket-btn'>Create</button>
      </form>

    </div>
  )



  return (
    <div className='project-page-container'>
      <NavBar></NavBar>
    <div className='main-content-container'>
      <div className='project-details'>
        <h1>{project?.name || 'Project Name'}</h1>
        <h2>{project?.description || 'Project Description'}</h2>
        <h3>{project?.deadline ? new Date(project.deadline).toLocaleDateString() : 'Project Deadline'}</h3>
        <h2>Project Team Members</h2>
      </div>
      <div className='tasks-and-tickets-container'>

      </div>
      <div className='tasks-container'>
        {showCreateTask && createTaskForm}
        {showCreateTicket && createTicketForm}
        <div className='tasks-and-btn-container'>
        <h1>Tasks</h1>
        <button className='create-task-btn' onClick={() => setShowCreateTask(!showCreateTask)}>Create Task</button>
        </div>
        {tasks.map( (task) => (
          <div key={task.id} className={`task-item ${task.completed ? ' completed-task' : ''}`}>
            <div className='task-details'>
            <h1>{task.name}</h1>
            <h2>{task.priority}</h2>
            <h3>{task.description}</h3>
            <h3>{task.deadline ? new Date(task.deadline).toLocaleDateString() : ''}</h3>
            </div>
            <div className='task-buttons'>
              <button className='btn-complete' onClick={() => handleTaskComplete(task.id)}><AiFillCheckCircle/></button>
              <button className='btn-delete' onClick={() => handleTaskDelete(task.id)}><AiFillCloseCircle/></button>
              <button className='btn-create-ticket' onClick={() => {setShowCreateTicket(!showCreateTicket); setCurrentTaskId(task.id);}}><BiBug/></button>
            </div>
          </div>
        ))}
      </div>

      <div className='tickets-container'>
          <h1>Tickets</h1>
          {bugs.map((ticket) => (
            <div key={ticket.id} className='ticket-item'>
              <h1>{ticket.name}</h1>
              <h2>{ticket.priority}</h2>
              <h3>{ticket.description}</h3>
          <div className='ticket-buttons'>
              <button className='ticket-btn-complete'><AiFillCheckCircle/></button>
              <button className='ticket-btn-delete' onClick={() => handleBugDelete(ticket.id)}><AiFillCloseCircle/></button>
          </div>
            </div>
          ))}
      </div>
    </div>

    </div>

  )
}