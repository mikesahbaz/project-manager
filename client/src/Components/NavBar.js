import React from 'react';
import './NavBar.css';

export default function NavBar() {
  return (
    <div className='nav-container'>
        <div className='nav-menu'>
          <a href='#' className='nav-link'>Dashboard</a>
          <a href='#' className='nav-link'>Tasks</a>
          <a href='#' className='nav-link'>Tickets</a>
          <a href='#' className='nav-link'>Milestones</a>
          <a href='#' className='nav-link'>Timesheet</a>
        </div>
    </div>
  )
}