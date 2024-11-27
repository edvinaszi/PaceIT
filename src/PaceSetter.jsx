import React, { useState, useEffect } from 'react';
import Speedometer from './Speedometer';
import Stopwatch from './Stopwatch';

function PaceSetter() {
  const [distance, setDistance] = useState('');
  const [time, setTime] = useState('');
  const [targetPace, setTargetPace] = useState('');
  const [targetSpeed, setTargetSpeed] = useState(null);
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [currentDistance, setCurrentDistance] = useState(0);
  const [currentPace, setCurrentPace] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [paceIntervalId, setPaceIntervalId] = useState(null);

  useEffect(() => {
    if (distance && time) {
      const totalMinutes = parseFloat(time);
      const distanceKm = parseFloat(distance) / 1000;
      const pacePerKm = totalMinutes / distanceKm;
      const paceMinutes = Math.floor(pacePerKm);
      const paceSeconds = Math.round((pacePerKm - paceMinutes) * 60);
      const speedKmPerH = (distanceKm / (totalMinutes / 60)).toFixed(2);

      setTargetPace(`${paceMinutes}:${paceSeconds < 10 ? '0' : ''}${paceSeconds}`);
      setTargetSpeed(speedKmPerH);
    }
  }, [distance, time]);

  useEffect(() => {
    if (isRunning && !isPaused) {
      const intervalId = setInterval(() => {
        if (currentDistance > 0 && startTime) {
          const elapsedTimeInMinutes = (Date.now() - startTime + elapsedTime) / (1000 * 60);
          const paceInMinutesPerKm = elapsedTimeInMinutes / (currentDistance / 1000);
          const paceMinutes = Math.floor(paceInMinutesPerKm);
          const paceSeconds = Math.round((paceInMinutesPerKm - paceMinutes) * 60);

          setCurrentPace(`${paceMinutes}:${paceSeconds < 10 ? '0' : ''}${paceSeconds}`);

          const paceDifference = targetPace && paceInMinutesPerKm
            ? Math.abs(parseFloat(targetPace.split(':')[0]) + parseFloat(targetPace.split(':')[1]) / 60 - paceInMinutesPerKm)
            : null;

          if (paceDifference !== null) {
            if (paceDifference <= 5 / 60) {
              document.body.style.backgroundColor = 'green';
              document.querySelector('.mainContent').style.backgroundColor = 'green';
            } else if (paceInMinutesPerKm < parseFloat(targetPace.split(':')[0]) + parseFloat(targetPace.split(':')[1]) / 60) {
              document.body.style.backgroundColor = 'orange';
              document.querySelector('.mainContent').style.backgroundColor = 'orange';
            } else {
              document.body.style.backgroundColor = 'red';
              document.querySelector('.mainContent').style.backgroundColor = 'red';
            }
          }
        }
      }, 2000);

      setPaceIntervalId(intervalId);

      return () => clearInterval(intervalId); 
    } else {
      clearInterval(paceIntervalId);
    }
  }, [isRunning, currentDistance, startTime, targetPace, elapsedTime, isPaused]);

  const handleDistanceChange = (e) => setDistance(e.target.value);
  const handleTimeChange = (e) => setTime(e.target.value);

  const startRun = () => {
    setIsRunning(true);
    setCurrentDistance(0);
    setStartTime(Date.now());
    setElapsedTime(0);
    setIsPaused(false);
    resetBackground();
  };

  const pauseRun = () => {
    setIsPaused(true); 
    setElapsedTime(elapsedTime + (Date.now() - startTime)); 
    clearInterval(paceIntervalId); 
  };

  const resumeRun = () => {
    setIsPaused(false); 
    setStartTime(Date.now()); 
    resetBackground();
  };

  const stopRun = () => {
    clearInterval(paceIntervalId); 
    saveRunStats();
    resetBackground();
    setIsRunning(false);
    setCurrentDistance(0);
    setElapsedTime(0);
  };

  const resetBackground = () => {
    document.body.style.backgroundColor = 'transparent';
    document.querySelector('.mainContent').style.backgroundColor = 'transparent';
  };

  const saveRunStats = () => {
    const elapsedTimeInMinutes = elapsedTime / (1000 * 60);
    const newRunStats = {
      distance: currentDistance / 1000,
      time: elapsedTimeInMinutes, 
      speed: currentSpeed,
      pace: currentPace, 
      date: new Date().toLocaleString(),
    };

    const existingStats = JSON.parse(localStorage.getItem('runStats')) || [];
    localStorage.setItem('runStats', JSON.stringify([...existingStats, newRunStats]));
  };

  const handleSpeedChange = (speed) => {
    if (isRunning) {
      setCurrentSpeed(speed);
    }
  };

  const handleDistanceUpdate = (newDistance) => {
    setCurrentDistance((prevDistance) => prevDistance + newDistance);
  };

  useEffect(() => {
    if (!isRunning) {
      resetBackground();
    }
  }, [isRunning]);

  return (
    <div className="PaceSetter">
      {!isRunning ? (
        <>
          <h1>Pace Setter</h1>
          <div>
            <label>
              Distance (meters):
              <input type="number" value={distance} onChange={handleDistanceChange} />
            </label>
          </div>
          <div>
            <label>
              Time (minutes):
              <input type="number" value={time} onChange={handleTimeChange} />
            </label>
          </div>
          <p>Target Pace: {targetPace ? `${targetPace} min/km` : 'N/A'}</p>
          <p>Target Speed: {targetSpeed ? `${targetSpeed} km/h` : 'N/A'}</p>
          <button onClick={startRun}>Start Run</button>
        </>
      ) : (
        <>
          <p>Target Speed: {targetSpeed ? `${targetSpeed} km/h` : 'N/A'}</p>
          <p>Current Speed: {currentSpeed ? `${currentSpeed.toFixed(2)} km/h` : '0 km/h'}</p>
          <p>Distance Covered: {currentDistance.toFixed(2)} km</p>
          <p>Target Pace: {targetPace ? `${targetPace} min/km` : 'N/A'}</p>
          <p>Current Pace: {currentPace ? `${currentPace} min/km` : 'Calculating...'}</p>
          <Stopwatch
            isTracking={isRunning}
            onStop={stopRun}
            onPause={pauseRun}
            onResume={resumeRun}
          />
          <Speedometer
            isTracking={isRunning}
            onDistanceChange={handleDistanceUpdate}
            onSpeedChange={handleSpeedChange}
          />
        </>
      )}
    </div>
  );
}

export default PaceSetter;
