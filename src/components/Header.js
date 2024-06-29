import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/App.css';
import { AuthContext } from '../contexts/AuthContext';

function Header() {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="App-header">
      <h1>Welcome to My Mobile App</h1>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/posts">Posts</Link>
        {user && <Link to="/about">About</Link>}
        {!user ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <Link to="/" onClick={logout}>Logout</Link>
        )}
      </nav>
    </header>
  );
}

export default Header;
