import React, { useState } from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import URLShortener from './components/URLShortener.jsx';
import Analytics from './components/Analytics.jsx';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import Dashboard from './components/Dashboard.jsx';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
  };

  return (
    <div className="App">
      <nav>
        <Link to="/">Home</Link> |{' '}
        {token ? (
          <>
            <Link to="/dashboard">Dashboard</Link> | <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
          </>
        )}
      </nav>
      <Routes>
        <Route path="/" element={<URLShortener token={token} />} />
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/register" element={<Register setToken={setToken} />} />
        <Route path="/dashboard" element={token ? <Dashboard token={token} /> : <Navigate to="/login" />} />
        <Route path="/analytics/:shortId" element={<Analytics />} />
      </Routes>
    </div>
  );
}

export default App;