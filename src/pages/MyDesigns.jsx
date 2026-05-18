import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function MyDesigns() {
  const navigate = useNavigate();
  const [myDesigns, setMyDesigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyDesigns();
  }, []);

  const fetchMyDesigns = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('https://ai-gen-server-l4fb.onrender.com/api/designs/my', {
        headers: { 
          'Authorization': `Bearer ${token}` 
        }
      });
      const data = await res.json();
      if (data.success) {
        setMyDesigns(data.designs);
      }
    } catch (err) {
      console.error('Failed to load your designs', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading-screen">Loading your designs...</div>;
  }

  return (
    <div className="my-designs-page">
      <div className="page-header">
        <h1>My Designs</h1>
        <p>All the beautiful UI designs you've shared with the community</p>
      </div>

      {myDesigns.length === 0 ? (
        <div className="empty-state">
          <h2>You haven't uploaded any designs yet</h2>
          <p>Share your first UI design and get feedback from the community</p>
          <button onClick={() => navigate('/upload')} className="upload-cta">
            Upload Your First Design
          </button>
        </div>
      ) : (
        <div className="gallery-grid">
          {myDesigns.map((design) => (
            <div key={design._id} className="design-card premium-card">
              <div className="card-image">
                <img src={design.imageUrl} alt={design.title} />
              </div>
              <div className="card-content">
                <h3>{design.title}</h3>
                <p>{design.description}</p>
                
                <div className="card-footer">
                  <span className="upload-date">
                    Uploaded on {new Date(design.createdAt).toLocaleDateString()}
                  </span>
                  <span className="likes">❤️ {design.likes || 0}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyDesigns;