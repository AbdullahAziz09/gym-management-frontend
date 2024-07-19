import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const linkStyle = {
    textDecoration: 'none',
    color: '#ffffff',
    padding: '10px 20px',
    fontSize: '1.2rem',
    borderRadius: '5px',
    transition: 'color 0.3s ease-in-out',
  };

  const handleHover = {
    color: '#cb1a1d',
  };

  const navigate = useNavigate();

  const expireToken = () => {
    localStorage.removeItem('token');
    console.log('Token Expired due to Logout');
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#0d080e', height: '50px' }}>
      <div className="container">
        <h1 className="navbar-brand ms-3" style={{ fontSize: '1.1rem', fontFamily: 'Arial, sans-serif' }}>
          <strong>GYM MANAGEMENT SYSTEM</strong>
        </h1>
        <div className="collapse navbar-collapse justify-content-end">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link
                to="/dashboard"
                className="nav-link"
                style={linkStyle}
                onMouseOver={(e) => (e.target.style.color = handleHover.color)}
                onMouseOut={(e) => (e.target.style.color = linkStyle.color)}
              >
                Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/admin"
                className="nav-link"
                style={linkStyle}
                onMouseOver={(e) => (e.target.style.color = handleHover.color)}
                onMouseOut={(e) => (e.target.style.color = linkStyle.color)}
              >
                Admin
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/trainer"
                className="nav-link"
                style={linkStyle}
                onMouseOver={(e) => (e.target.style.color = handleHover.color)}
                onMouseOut={(e) => (e.target.style.color = linkStyle.color)}
              >
                Trainer
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/trainees"
                className="nav-link"
                style={linkStyle}
                onMouseOver={(e) => (e.target.style.color = handleHover.color)}
                onMouseOut={(e) => (e.target.style.color = linkStyle.color)}
              >
                Trainees
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/packages"
                className="nav-link"
                style={linkStyle}
                onMouseOver={(e) => (e.target.style.color = handleHover.color)}
                onMouseOut={(e) => (e.target.style.color = linkStyle.color)}
              >
                Packages
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/payments" // Add this line for Payments page
                className="nav-link"
                style={linkStyle}
                onMouseOver={(e) => (e.target.style.color = handleHover.color)}
                onMouseOut={(e) => (e.target.style.color = linkStyle.color)}
              >
                Payments
              </Link>
            </li>
            <li className="nav-item">
              <Link
                onClick={expireToken}
                to="/"
                className="nav-link"
                style={linkStyle}
                onMouseOver={(e) => (e.target.style.color = handleHover.color)}
                onMouseOut={(e) => (e.target.style.color = linkStyle.color)}
              >
                Logout
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
