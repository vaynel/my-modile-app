import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/App.css';
import { AuthContext } from '../contexts/AuthContext';

function Header() {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="App-header">
      <h1>PoSn</h1>
      <nav>
        <Link to="/">Main</Link>
        <Link to="/posts">Spoon</Link>
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
