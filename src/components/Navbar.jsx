import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [menuOpen, setMenuOpen] = useState(false);

  // Update URL when search term changes
  useEffect(() => {
    if (searchTerm.trim()) {
      setSearchParams({ search: searchTerm });
    } else {
      setSearchParams({});
    }
  }, [searchTerm, setSearchParams]);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/login');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/?search=${encodeURIComponent(searchTerm)}`);
    } else {
      navigate('/');
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Logo */}
        <div className="logo" onClick={() => navigate('/')}>
          <span className="logo-icon">UI</span>
          <span>DesignShare</span>
        </div>

        {/* Search Bar - Functional */}
        <form className="search-bar" onSubmit={handleSearchSubmit}>
          <input 
            type="text" 
            placeholder="Search designs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>

        {/* Desktop Navigation */}
        <div className="nav-right desktop-nav">
          {user ? (
            <>
              <Link to="/" className="nav-link">Home</Link>
              <Link to="/my-designs" className="nav-link">My Designs</Link>
              <button className="nav-btn" onClick={() => navigate('/generate')}>✦ AI Generator</button>
              <button className="upload-btn" onClick={() => navigate('/upload')}>↑ Upload</button>
              <div className="user-info">Hi, {user.fullName?.split(' ')[0]}</div>
              <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link">Register</Link>
            </>
          )}
        </div>

        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="mobile-menu">
          {user ? (
            <>
              <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
              <Link to="/my-designs" onClick={() => setMenuOpen(false)}>My Designs</Link>
              <Link to="/generate" onClick={() => setMenuOpen(false)}>AI Generator</Link>
              <Link to="/upload" onClick={() => setMenuOpen(false)}>Upload</Link>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)}>Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;