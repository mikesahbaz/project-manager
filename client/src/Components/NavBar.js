import React from 'react';
import './NavBar.css';
import { useNavigate } from 'react-router-dom';

export default function NavBar() {
  const navigate = useNavigate();

  const handleDashboardClick = function () {
    navigate('/dashboard');
  }

  return (
    <div className='nav-container'>
        <div className='nav-menu'>
          <a href='#' className='nav-link' onClick={handleDashboardClick}>Dashboard</a>
          <a href='#' className='nav-link'>Tasks</a>
          <a href='#' className='nav-link'>Tickets</a>
          <a href='#' className='nav-link'>Milestones</a>
          <a href='#' className='nav-link'>Timesheet</a>
        </div>
    </div>
  )
}