import React, { useEffect, useState } from 'react';

const API_URL = () => {
  const codespace = process.env.REACT_APP_CODESPACE_NAME;
  return codespace
    ? `https://${codespace}-8000.app.github.dev/api/users/`
    : 'http://localhost:8000/api/users/';
};


function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const url = API_URL();
    fetch(url)
      .then(res => res.json())
      .then(data => {
        const items = data.results || data;
        setUsers(items);
        console.log('Users API endpoint:', url);
        console.log('Fetched users:', items);
      })
      .catch(err => {
        console.error('Error fetching users:', err);
      });
  }, []);

  if (!users.length) {
    return <div className="text-center mt-5"><div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div></div>;
  }

  const allKeys = Array.from(new Set(users.flatMap(obj => Object.keys(obj))));

  return (
    <div className="card shadow mb-4">
      <div className="card-header bg-secondary text-white">
        <h2 className="h4 mb-0">Users</h2>
      </div>
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-striped table-bordered align-middle">
            <thead className="table-dark">
              <tr>
                {allKeys.map(key => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((user, idx) => (
                <tr key={user.id || idx}>
                  {allKeys.map(key => (
                    <td key={key}>{String(user[key])}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Users;
