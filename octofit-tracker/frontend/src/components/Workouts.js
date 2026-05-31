import React, { useEffect, useState } from 'react';

const API_URL = () => {
  const codespace = process.env.REACT_APP_CODESPACE_NAME;
  return codespace
    ? `https://${codespace}-8000.app.github.dev/api/workouts/`
    : 'http://localhost:8000/api/workouts/';
};


function Workouts() {
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    const url = API_URL();
    fetch(url)
      .then(res => res.json())
      .then(data => {
        const items = data.results || data;
        setWorkouts(items);
        console.log('Workouts API endpoint:', url);
        console.log('Fetched workouts:', items);
      })
      .catch(err => {
        console.error('Error fetching workouts:', err);
      });
  }, []);

  if (!workouts.length) {
    return <div className="text-center mt-5"><div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div></div>;
  }

  const allKeys = Array.from(new Set(workouts.flatMap(obj => Object.keys(obj))));

  return (
    <div className="card shadow mb-4">
      <div className="card-header bg-warning text-dark">
        <h2 className="h4 mb-0">Workouts</h2>
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
              {workouts.map((workout, idx) => (
                <tr key={workout.id || idx}>
                  {allKeys.map(key => (
                    <td key={key}>{String(workout[key])}</td>
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

export default Workouts;
