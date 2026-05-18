import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = 'https://ai-gen-server-l4fb.onrender.com/api';

function DesignDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [design, setDesign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Memoized fetch function to avoid ESLint warning
  const fetchDesign = useCallback(async () => {
    try {
      setLoading(true);
      
      // Increment view count
      await axios.put(`${API_BASE_URL}/designs/${id}/view`);
      
      // Get design details
      const res = await axios.get(`${API_BASE_URL}/designs/${id}`);
      
      if (res.data.success) {
        setDesign(res.data.design);
      } else {
        setError("Design not found");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load design");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) fetchDesign();
  }, [id, fetchDesign]);

  const handleLike = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert("Please login to like this design");
        return;
      }

      const res = await axios.put(
        `${API_BASE_URL}/designs/${id}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setDesign(prev => ({ ...prev, likes: res.data.likes }));
      }
    } catch (err) {
      alert("Failed to like design");
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied to clipboard!");
  };

  const handleDownload = () => {
    if (design?.imageUrl) {
      const link = document.createElement('a');
      link.href = design.imageUrl;
      link.download = `${design.title || 'design'}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const copyCode = () => {
    if (design?.generatedCode) {
      navigator.clipboard.writeText(design.generatedCode);
      alert("Code copied to clipboard!");
    }
  };

  if (loading) return <div className="loading-screen">Loading design...</div>;
  if (error) return <div className="error-screen">{error}</div>;
  if (!design) return <div>Design not found</div>;

  return (
    <div className="design-detail-page">
      <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>

      <div className="detail-container">
        {/* Large Image */}
        <div className="detail-image">
          <img src={design.imageUrl} alt={design.title} />
        </div>

        {/* Sidebar */}
        <div className="detail-sidebar">
          <div className="author-card">
            <img 
              src={design.user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(design.user?.fullName || 'User')}`} 
              alt="author" 
              className="author-avatar" 
            />
            <div>
              <strong>{design.user?.fullName || 'Anonymous'}</strong>
              <p>Designer</p>
            </div>
            <button className="follow-btn">Follow</button>
          </div>

          <div className="stats-card">
            <div className="stat-item"><span>Likes</span><strong>❤️ {design.likes || 0}</strong></div>
            <div className="stat-item"><span>Views</span><strong>👁️ {design.views || 0}</strong></div>
            <div className="stat-item"><span>Published</span><strong>{new Date(design.createdAt).toLocaleDateString()}</strong></div>
          </div>

          <div className="action-buttons">
            <button className="like-big-btn" onClick={handleLike}>❤️ Like</button>
            <button className="share-btn" onClick={handleShare}>Share</button>
            <button className="download-btn" onClick={handleDownload}>View Image</button>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="detail-description">
        <h2>{design.title}</h2>
        <p>{design.description}</p>

        {design.tags && design.tags.length > 0 && (
          <div className="detail-tags">
            {design.tags.map((tag, i) => (
              <span key={i} className="detail-tag">#{tag}</span>
            ))}
          </div>
        )}
      </div>

      {/* Source Code Section */}
      {design.generatedCode && (
        <div className="source-code-section">
          <h3>Source Code</h3>
          <p className="code-subtitle">HTML + CSS (Plain Code)</p>

          <div className="code-wrapper">
            <pre className="code-container">
              <code>{design.generatedCode}</code>
            </pre>

            <button className="copy-btn" onClick={copyCode}>
              📋 Copy Code
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DesignDetail;