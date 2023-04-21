import React, { useState, useEffect } from 'react';
import { auth } from '../../src/firebase_react';
import './Dashboard.css';

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect( () => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setUser(user);
    });
    return unsubscribe;
  }, [])

  return (
    <div>
      <h1>Dashboard</h1>
      {user && (
        <div>
          <h1>Welcome back, {user.email}</h1>
        </div>
      )}
    </div>
  )
}