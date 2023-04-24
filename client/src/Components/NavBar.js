import React from 'react';
import './NavBar.css';
import { useNavigate } from 'react-router-dom';
import {auth, signOut} from '../firebase_react';

export default function NavBar() {
  const navigate = useNavigate();

  const handleDashboardClick = function () {
    navigate('/dashboard');
  }

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  }

  return (
    <div className='nav-container'>
        <div className='nav-menu'>
          <div className='left-nav-container'>
          <a href='#' className='nav-link' onClick={handleDashboardClick}>Dashboard</a>
          <a href='#' className='nav-link'>Tasks</a>
          <a href='#' className='nav-link'>Tickets</a>
          <a href='#' className='nav-link'>Milestones</a>
          <a href='#' className='nav-link'>Timesheet</a>
          </div>
          <div className='right-nav-container'>
          <button className='logout-btn' onClick={handleLogout}>Logout</button>
          </div>
        </div>
    </div>
  )
}