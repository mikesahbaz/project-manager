import React, {useState, useEffect} from 'react';
import './CreateProjectPage.css';
import NavBar from './NavBar';
// import { useNavigate } from 'react-router-dom';

export default function CreateProjectPage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [userIds, setUserIds] = useState([]);
  const [error, setError] = useState('');
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  // const navigate = useNavigate();

  const resetForm = () => {
    setName('');
    setDescription('');
    setDeadline('');
    setUserIds('')
    setUsers([]);
    setSearchQuery('');
  }

  const handleUserSelected = (e) => {
    const selectedUserIds = Array.from(
      e.target.selectedOptions,
      (option) => parseInt(option.value)
    );
    setUserIds(selectedUserIds);
  }

  useEffect(() => {
    fetchUsers();
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:3001/users');
      const data = await response.json();
      setUsers(data.users);
    } catch (error) {
      console.error('Error fetching users', error);
    }
  }

  const handleSubmit = async function (e) {
    e.preventDefault();

    try {
      const formData = {
        name,
        description,
        deadline: Date.parse(deadline),
        userIds,
      }
      const response = await fetch('http://localhost:3001/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error('There was an error creating the project', data.message);
      }
      resetForm();
      // navigate('/projectPage'); Navigate to the projects page after creation

    } catch (error) {
      console.error(error);
      setError(error.message);
    }

    const formData = {
      name,
      description,
      deadline,
      userIds
    }

    fetch('http://localhost:3001/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
      .then(response => response.json())
      .then(data => {
        //navigate to project's page
      })
      .catch(error => console.error(error));
  }

  return (
    <div>
      <NavBar />
      <div className='create-project-container'>
        <h1>Create a new project</h1>
        <form onSubmit={handleSubmit}>
          <input type='text' value={name} onChange={event => setName(event.target.value)} placeholder='Project Name' ></input>
          <input type='text' value={description} onChange={event => setDescription(event.target.value)} placeholder='Project Description' ></input>
          <input type='date' value={deadline} onChange={event => setDeadline(event.target.value)} placeholder='Project Due Date' ></input>
          <input type='text' placeholder='Search team members' value={searchQuery} onChange={event => setSearchQuery(event.target.value)}></input>
          <select multiple value={userIds} onChange={handleUserSelected}>{users.filter((user) => `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())).map((user) => (
            <option key={user.id} value={user.id}>{user.firstName} {user.lastName}</option>
          ))}</select>
          <button type='submit' className='submit-project-btn'>Create the Project</button>
        </form>
      </div>
    </div>
  )
}