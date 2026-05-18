import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Upload() {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [generatedCode, setGeneratedCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Fixed: Prevent form submission when pressing Enter in tags
  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();        // ← This is the most important line
      if (tags.length < 10) {
        setTags([...tags, tagInput.trim()]);
        setTagInput('');
      }
    }
  };

  const removeTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile || !title || !description || !category) {
      setError("Please fill all required fields");
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('tags', tags.join(','));
    if (generatedCode.trim()) {
      formData.append('generatedCode', generatedCode.trim());
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('https://ai-gen-server-l4fb.onrender.com/api/upload', formData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        alert('Design uploaded successfully!');
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-page">
      <div className="upload-container">
        <button className="back-button" onClick={() => navigate('/')}>← Back</button>

        <div className="upload-card">
          <h2>Upload Your Design</h2>
          <p className="upload-subtitle">Share your amazing UI design with the community</p>

          <form onSubmit={handleSubmit}>
            {/* Image Upload */}
            <div className="form-group">
              <label>Design Image <span className="required">*</span></label>
              <div className="image-upload-box" onClick={() => document.getElementById('image-upload').click()}>
                {imagePreview ? (
                  <img src={imagePreview} alt="preview" className="preview-image" />
                ) : (
                  <div className="upload-placeholder">
                    <div className="upload-icon">↑</div>
                    <p>Click to upload or drag and drop</p>
                    <p className="file-info">PNG, JPG up to 10MB</p>
                  </div>
                )}
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  hidden
                  onChange={handleImageChange}
                />
              </div>
            </div>

            {/* Title */}
            <div className="form-group">
              <label>Title <span className="required">*</span></label>
              <input
                type="text"
                placeholder="Give your design a title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Description */}
            <div className="form-group">
              <label>Description <span className="required">*</span></label>
              <textarea
                placeholder="Describe your design..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="4"
                required
              />
            </div>

            {/* Category */}
            <div className="form-group">
              <label>Category <span className="required">*</span></label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} required>
                <option value="">Select a category</option>
                <option value="Landing Page">Landing Page</option>
                <option value="Portfolio">Portfolio</option>
                <option value="E-Commerce">E-Commerce</option>
                <option value="Blog">Blog</option>
                <option value="Webpage">Webpage</option>
                <option value="Mobile App">Mobile App</option>
                <option value="Corporate">Corporate</option>
              </select>
            </div>

            {/* Tags - Fixed */}
            <div className="form-group">
              <label>Tags (Optional)</label>
              <input
                type="text"
                placeholder="Type a tag and press Enter (max 10)"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
              />
              <div className="tags-list">
                {tags.map((tag, index) => (
                  <span key={index} className="tag-item">
                    #{tag} <span onClick={() => removeTag(index)}>×</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Optional Source Code */}
            <div className="form-group">
              <label>Source Code (Optional)</label>
              <textarea
                placeholder="Paste your HTML + CSS code here (optional)..."
                value={generatedCode}
                onChange={(e) => setGeneratedCode(e.target.value)}
                rows="10"
              />
            </div>

            <div className="action-buttons">
              <button type="submit" className="publish-button" disabled={loading}>
                {loading ? 'Uploading...' : '↑ Publish Design'}
              </button>
              <button type="button" className="cancel-button" onClick={() => navigate('/')}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Upload;