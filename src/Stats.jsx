import React, { useEffect, useState } from 'react';

function StatsScreen() {
  const [runStats, setRunStats] = useState([]);

  useEffect(() => {
    const savedStats = localStorage.getItem('runStats');
    if (savedStats) {
      setRunStats(JSON.parse(savedStats));
    }
  }, []);

  const calculateAverageSpeed = () => {
    if (runStats.length === 0) return 0;
    return (runStats.reduce((sum, r) => sum + r.speed, 0) / runStats.length).toFixed(2);
  };

  const calculateAveragePace = () => {
    if (runStats.length === 0) return '0:00';
    const avgPaceInMinutes = runStats.reduce((sum, r) => sum + parseFloat(r.time) / r.distance, 0) / runStats.length;
    const minutes = Math.floor(avgPaceInMinutes);
    const seconds = Math.round((avgPaceInMinutes - minutes) * 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const calculateTotalDistance = () => {
    return runStats.reduce((sum, r) => sum + r.distance, 0).toFixed(2);
  };

  const resetStats = () => {
    localStorage.removeItem('runStats');
    setRunStats([]);
  };

  return (
    <div className="StatsScreen">
      <h1>Stats</h1>
      {runStats.length > 0 ? (
        <>
          <h2>Last Run:</h2>
          <p>Distance: {runStats[runStats.length - 1].distance.toFixed(2)} km</p>
          <p>Time: {runStats[runStats.length - 1].time.toFixed(2)} minutes</p>
          <p>Speed: {runStats[runStats.length - 1].speed.toFixed(2)} km/h</p>
          <p>Pace: {runStats[runStats.length - 1].pace}</p>
          <p>Date: {runStats[runStats.length - 1].date}</p>
          <h2>All Runs:</h2>
          <p>Average Speed: {calculateAverageSpeed()} km/h</p>
          <p>Average Pace: {calculateAveragePace()} min/km</p>
          <p>Total Distance: {calculateTotalDistance()} km</p>
          <ul>
            {runStats.map((stat, index) => (
              <li key={index}>
                Date: {stat.date}, Distance: {stat.distance.toFixed(2)} km, Time: {stat.time.toFixed(2)} min, Speed: {stat.speed} km/h, Pace: {stat.pace} min/km
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>No runs recorded yet.</p>
      )}
      <button onClick={resetStats}>Reset Stats</button>
    </div>
  );
}

export default StatsScreen;
