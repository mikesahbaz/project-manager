import React, { useState } from 'react';
import { auth, signInWithEmailAndPassword } from '../../src/firebase_react';
import './LoginPage.css';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();


  const handleLogin = async function (e) {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
      if (auth.currentUser) {
        console.log('Successfully logged in');
      }
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <div className='login-page-container'>
      <div className='left-side-container'>
      </div>

      <div className='right-side-container'>
        <form onSubmit={handleLogin}>
          <input type='text' value={email} onChange={event => setEmail(event.target.value)} placeholder='Email...'></input>
          <input type='password' value={password} onChange={event => setPassword(event.target.value)} placeholder='Password...'></input>
          <button type='submit' className='sign-in-btn'>Log In</button>
        </form>
        {error && <p>{error}</p>}
      </div>
    </div>
  )
}