import React, { useEffect, useState } from 'react';

const API_URL = () => {
  const codespace = process.env.REACT_APP_CODESPACE_NAME;
  return codespace
    ? `https://${codespace}-8000.app.github.dev/api/activities/`
    : 'http://localhost:8000/api/activities/';
};


function Activities() {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const url = API_URL();
    fetch(url)
      .then(res => res.json())
      .then(data => {
        const items = data.results || data;
        setActivities(items);
        console.log('Activities API endpoint:', url);
        console.log('Fetched activities:', items);
      })
      .catch(err => {
        console.error('Error fetching activities:', err);
      });
  }, []);

  if (!activities.length) {
    return <div className="text-center mt-5"><div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div></div>;
  }

  // Get all unique keys for table headers
  const allKeys = Array.from(new Set(activities.flatMap(obj => Object.keys(obj))));

  return (
    <div className="card shadow mb-4">
      <div className="card-header bg-primary text-white">
        <h2 className="h4 mb-0">Activities</h2>
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
              {activities.map((activity, idx) => (
                <tr key={activity.id || idx}>
                  {allKeys.map(key => (
                    <td key={key}>{String(activity[key])}</td>
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

export default Activities;
