import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function Analytics() {
  const { id } = useParams();
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/analytics/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch analytics');
        }
        const data = await response.json();
        console.log('Analytics data:', data);
        setAnalytics(data);
      } catch (err) {
        console.error('Error fetching analytics:', err.message);
        setError(err.message);
      }
    };
    fetchAnalytics();
  }, [id]);

  if (error) return <div>Error: {error}</div>;
  if (!analytics) return <div>Loading...</div>;

  return (
    <div>
      <h2>Analytics for {analytics.shortId}</h2>
      <p>Clicks: {analytics.clicks}</p>
      <p>Created At: {new Date(analytics.createdAt).toLocaleString()}</p>
    </div>
  );
}

export default Analytics;