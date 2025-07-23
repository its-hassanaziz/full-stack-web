import React, { useEffect, useState } from 'react';

const AdminDashboard: React.FC = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/contact')
      .then(res => res.json())
      .then(data => {
        setMessages(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch contact messages');
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ maxWidth: 800, margin: 'auto', padding: 20 }}>
      <h2>Admin Dashboard</h2>
      {loading && <div>Loading...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <ul>
        {messages.map((msg, idx) => (
          <li key={idx} style={{ marginBottom: 20, borderBottom: '1px solid #ccc', paddingBottom: 10 }}>
            <strong>Name:</strong> {msg.name}<br />
            <strong>Email:</strong> {msg.email}<br />
            <strong>Message:</strong> {msg.message}<br />
            <strong>Date:</strong> {msg.createdAt}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;
