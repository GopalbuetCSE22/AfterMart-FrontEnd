import React, { useState } from 'react';

function UploadImage() {
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');
  const [url, setUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userid = localStorage.getItem('user_id'); // or 'admin_id' if that's what you use
    console.log('User ID:', userid);
    
    if (!userid) {
      setMessage('User not logged in.');
      return;
    }
    if (!image) {
      setMessage('Please select an image.');
      return;
    }

    const formData = new FormData();
    formData.append('image', image);

    try {
      const res = await fetch(`http://localhost:5000/api/uploadImage/upload/${userid}`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message);
        setUrl(data.url);
      } else {
        setMessage(data.error || 'Upload failed.');
      }
    } catch (err) {
      setMessage('Error uploading image.');
    }
  };

  return (
    <div style={{
      maxWidth: 400,
      margin: '2rem auto',
      padding: 20,
      border: '1px solid #333',
      borderRadius: 8,
      background: '#23272f',
      color: '#f1f1f1'
    }}>
      <h2 style={{ color: '#fff' }}>Photo Upload</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginTop: 10 }}>
          <label style={{ color: '#ccc' }}>Image:</label><br />
          <input
            type="file"
            accept="image/*"
            onChange={e => setImage(e.target.files[0])}
            style={{
              background: '#181a20',
              color: '#f1f1f1',
              border: '1px solid #444',
              borderRadius: 4,
              padding: '6px 10px'
            }}
            required
          />
        </div>
        <button
          type="submit"
          style={{
            marginTop: 15,
            background: '#444',
            color: '#fff',
            border: 'none',
            borderRadius: 4,
            padding: '8px 16px',
            cursor: 'pointer'
          }}
        >
          Upload
        </button>
      </form>
      {message && <p style={{ marginTop: 15, color: '#ffb347' }}>{message}</p>}
      {url && (
        <div>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#4fa3ff', textDecoration: 'underline' }}
          >
            View Uploaded Image
          </a>
        </div>
      )}
    </div>
  );
}

export default UploadImage;