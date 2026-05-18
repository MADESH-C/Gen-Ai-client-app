import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Tags from '../components/Tags';
import axios from 'axios';

function Home() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get('search')?.toLowerCase() || '';

  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeSort, setActiveSort] = useState('Trending');

  useEffect(() => {
    fetchDesigns();
  }, []);

  const fetchDesigns = async () => {
    try {
      const res = await fetch('https://ai-gen-server-l4fb.onrender.com/api/designs');
      const data = await res.json();
      if (data.success) {
        setDesigns(data.designs);
      }
    } catch (err) {
      console.error('Failed to fetch designs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (designId, e) => {
    e.stopPropagation();
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert("Please login to like designs");
        return;
      }

      const res = await axios.put(
        `https://ai-gen-server-l4fb.onrender.com/api/designs/${designId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setDesigns(prev =>
          prev.map(d => d._id === designId ? { ...d, likes: res.data.likes } : d)
        );
      }
    } catch (err) {
      alert("Failed to like design");
    }
  };

  const openDetail = (designId) => {
    navigate(`/design/${designId}`);
  };

  // Combined Filter: Category + Search Term
  let filteredDesigns = designs.filter(design => {
    // Category Filter
    if (activeCategory !== 'All') {
      const categoryMatch = design.category && 
        design.category.toLowerCase() === activeCategory.toLowerCase();
      
      const tagMatch = design.tags && design.tags.some(tag => 
        tag.toLowerCase().includes(activeCategory.toLowerCase())
      );

      if (!categoryMatch && !tagMatch) return false;
    }

    // Search Filter
    if (searchTerm) {
      return (
        design.title?.toLowerCase().includes(searchTerm) ||
        design.description?.toLowerCase().includes(searchTerm) ||
        (design.tags && design.tags.some(tag => 
          tag.toLowerCase().includes(searchTerm)
        ))
      );
    }

    return true;
  });

  // Sort
  if (activeSort === 'Trending' || activeSort === 'Popular') {
    filteredDesigns = [...filteredDesigns].sort((a, b) => (b.likes || 0) - (a.likes || 0));
  } else if (activeSort === 'Recent') {
    filteredDesigns = [...filteredDesigns].sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );
  }

  if (loading) {
    return <div className="loading-screen">Discovering amazing designs...</div>;
  }

  return (
    <div className="home-page">
      <div className="hero">
        <h1 className="hero-title">Discover Amazing UI Designs</h1>
        <p className="hero-subtitle">
          Explore thousands of beautiful interfaces created by talented designers from around the world
        </p>
      </div>

      {/* Filters */}
      <div className="filters-container">
        <div className="categories">
          <button className={`category-btn ${activeCategory === 'All' ? 'active' : ''}`} onClick={() => setActiveCategory('All')}>All</button>
          <button className={`category-btn ${activeCategory === 'Landing Page' ? 'active' : ''}`} onClick={() => setActiveCategory('Landing Page')}>Landing Page</button>
          <button className={`category-btn ${activeCategory === 'Portfolio' ? 'active' : ''}`} onClick={() => setActiveCategory('Portfolio')}>Portfolio</button>
          <button className={`category-btn ${activeCategory === 'E-Commerce' ? 'active' : ''}`} onClick={() => setActiveCategory('E-Commerce')}>E-Commerce</button>
          <button className={`category-btn ${activeCategory === 'Blog' ? 'active' : ''}`} onClick={() => setActiveCategory('Blog')}>Blog</button>
          <button className={`category-btn ${activeCategory === 'Corporate' ? 'active' : ''}`} onClick={() => setActiveCategory('Corporate')}>Corporate</button>
        </div>

        <div className="sort-options">
          <button className={`sort-btn ${activeSort === 'Trending' ? 'active' : ''}`} onClick={() => setActiveSort('Trending')}>Trending</button>
          <button className={`sort-btn ${activeSort === 'Recent' ? 'active' : ''}`} onClick={() => setActiveSort('Recent')}>Recent</button>
          <button className={`sort-btn ${activeSort === 'Popular' ? 'active' : ''}`} onClick={() => setActiveSort('Popular')}>Popular</button>
        </div>
      </div>

      {/* Gallery */}
      <div className="gallery-grid">
        {filteredDesigns.length === 0 ? (
          <p className="no-results">
            {searchTerm ? `No designs found for "${searchTerm}"` : "No designs found in this category."}
          </p>
        ) : (
          filteredDesigns.map((design) => (
            <div 
              key={design._id} 
              className="design-card"
              onClick={() => openDetail(design._id)}
            >
              <div className="card-image">
                <img src={design.imageUrl} alt={design.title} />
              </div>

              <div className="card-content">
                <h3>{design.title}</h3>
                <p>{design.description?.length > 110 
                  ? design.description.substring(0, 110) + '...' 
                  : design.description}</p>

                {design.tags && design.tags.length > 0 && <Tags tags={design.tags} />}

                <div className="card-footer">
                  <div className="author">
                    By {design.user?.fullName || 'Anonymous'}
                  </div>

                  <div className="stats">
                    <button 
                      className="like-btn"
                      onClick={(e) => handleLike(design._id, e)}
                    >
                      ❤️ {design.likes || 0}
                    </button>
                    <span className="view-count">👁️ {design.views || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Home;