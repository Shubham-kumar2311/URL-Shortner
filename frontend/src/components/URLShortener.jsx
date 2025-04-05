import React, { useState } from 'react';
import axios from 'axios';

function URLShortener({ token }) {
  const [url, setUrl] = useState('');
  const [customId, setCustomId] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [qrCode, setQrCode] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/`, { url, customId, expiresAt }, config);
      setShortUrl(`${process.env.REACT_APP_API_URL}/api/${response.data.id}`);
      setQrCode(response.data.qrCode);
    } catch (error) {
      console.error('Error generating short URL:', error);
      alert('Failed to generate short URL. Please log in if required.');
    }
  };

  return (
    <div>
      <h2>Shorten a URL</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL to shorten"
          required
        />
        <input
          type="text"
          value={customId}
          onChange={(e) => setCustomId(e.target.value)}
          placeholder="Custom short ID (optional)"
        />
        <input
          type="datetime-local"
          value={expiresAt}
          onChange={(e) => setExpiresAt(e.target.value)}
          placeholder="Expiration date (optional)"
        />
        <button type="submit">Shorten</button>
      </form>
      {shortUrl && (
        <div>
          <p>
            Short URL: <a href={shortUrl} target="_blank" rel="noopener noreferrer">{shortUrl}</a>
          </p>
          {qrCode && <img src={qrCode} alt="QR Code" />}
        </div>
      )}
    </div>
  );
}

export default URLShortener;