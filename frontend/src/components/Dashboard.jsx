import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Dashboard({ token }) {
  const [urls, setUrls] = useState([]);

  useEffect(() => {
    const fetchURLs = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/urls`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUrls(response.data);
      } catch (error) {
        console.error('Error fetching URLs:', error);
      }
    };
    fetchURLs();
  }, [token]);

  return (
    <div>
      <h2>Your URLs</h2>
      <ul>
        {urls.map((url) => (
          <li key={url.shortId}>
            <a href={`${process.env.REACT_APP_API_URL}/api/${url.shortId}`} target="_blank" rel="noopener noreferrer">
              {process.env.REACT_APP_API_URL}/api/{url.shortId}
            </a>{' '}
            - {url.redirectURL} - Clicks: {url.visitHistory.length}{' '}
            <Link to={`/analytics/${url.shortId}`}>Analytics</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;