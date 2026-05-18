import React, { useState } from 'react';
import axios from 'axios';

function Generate() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [generatedCode, setGeneratedCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setGeneratedCode('');
      setError('');
    }
  };

  const handleGenerate = async () => {
    if (!selectedImage) {
      setError("Please upload an image first");
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('image', selectedImage);

    try {
      const response = await axios.post('https://ai-gen-server-l4fb.onrender.com/api/generate', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setGeneratedCode(response.data.code || response.data.html);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (generatedCode) {
      navigator.clipboard.writeText(generatedCode);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  return (
    <div className="generate-page">
      <div className="generate-header">
        <h1>✦ AI Code Generator</h1>
        <p>Upload a website UI image and get clean HTML + CSS instantly</p>
      </div>

      <div className="generate-content">
        {/* Upload Section */}
        <div className="upload-section">
          <h3>Upload Design Image</h3>
          <p className="section-desc">Upload a screenshot or mockup of a website UI</p>

          <div 
            className="upload-box"
            onClick={() => document.getElementById('image-input').click()}
          >
            {previewUrl ? (
              <img src={previewUrl} alt="preview" className="image-preview" />
            ) : (
              <div className="upload-placeholder">
                <div className="upload-icon">↑</div>
                <p>Click to upload or drag & drop</p>
                <p className="file-info">PNG, JPG, GIF up to 10MB</p>
              </div>
            )}
            <input
              type="file"
              id="image-input"
              accept="image/*"
              hidden
              onChange={handleImageChange}
            />
          </div>

          <button 
            className="generate-btn"
            onClick={handleGenerate}
            disabled={!selectedImage || loading}
          >
            {loading ? "Generating Code with AI..." : "Generate HTML & CSS"}
          </button>
        </div>

        {/* Generated Code Section */}
        <div className="code-section">
          <h3>Generated Code</h3>
          <p className="section-desc">Your generated HTML + CSS will appear here</p>

          <div className="code-box">
            {generatedCode ? (
              <>
                <pre className="code-output">{generatedCode}</pre>
                <button className="copy-btn" onClick={copyToClipboard}>
                  {copySuccess ? "Copied!" : "Copy Code"}
                </button>
              </>
            ) : (
              <div className="empty-state">
                <div className="sparkle-icon">✦</div>
                <p>Upload an image and click Generate</p>
                <small>AI will analyze and create clean code for you</small>
              </div>
            )}
          </div>
        </div>
      </div>

      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default Generate;