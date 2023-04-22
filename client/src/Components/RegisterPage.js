import './RegisterPage.css'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { auth, createUserWithEmailAndPassword } from '../../src/firebase_react';

export default function RegisterPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const resetForm = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setPassword('');
  }

  const handleSubmit = async function (e) {
    e.preventDefault();
    let firebaseUid;

    try {
      await createUserWithEmailAndPassword(auth, email, password)
      const user = auth.currentUser;
      firebaseUid = user.uid;
    } catch (error) {
      console.error(error);
      setError(error.message);
    }

    const formData = {
      firstName,
      lastName,
      email,
      password,
      firebaseUid
    };
    fetch('http://localhost:3001/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
      .then(response => response.json())
      .then(data => {
        resetForm();
        navigate('/login');
        console.log(data.message);
      })
      .catch(error => console.error(error));
  }

  const handleSignIn = () => {
    navigate('/login');
  }


  return (
    <div className='register-page-container'>
      <div className='left-side-container'>

      </div>
      <div className='right-side-container'>
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>
          <input type='text' value={firstName} onChange={event => setFirstName(event.target.value)}  placeholder='First Name'  ></input>
          <input type='text' value={lastName} onChange={event => setLastName(event.target.value)}  placeholder='Last Name'></input>
          <input type='text' value={email} onChange={event => setEmail(event.target.value)}  placeholder='Email'></input>
          <input type='password' value={password} onChange={event => setPassword(event.target.value)}  placeholder='password'></input>
          <button type='submit' className='register-btn'>Register</button>
        </form>
        <h1>OR</h1>
        <p>Already have an account?</p>
        <button className='sign-in-btn' onClick={handleSignIn}>Sign In</button>
        {error && <p>{error}</p>}
      </div>
    </div>
  )
}