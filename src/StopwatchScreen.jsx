import React, { useState, useEffect } from 'react';
import Stopwatch from './Stopwatch';
import Speedometer from './Speedometer';

function StopwatchScreen() {
  const [isTracking, setIsTracking] = useState(false);
  const [distance, setDistance] = useState(0);
  const [averagePace, setAveragePace] = useState('0:00');
  const [elapsedTime, setElapsedTime] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [isFinished, setIsFinished] = useState(false);
  const [isReadyForNewRun, setIsReadyForNewRun] = useState(false);
  const [intervalId, setIntervalId] = useState(null);

  const saveRunStats = (newRun) => {
    const savedStats = JSON.parse(localStorage.getItem('runStats')) || [];
    savedStats.push(newRun);
    localStorage.setItem('runStats', JSON.stringify(savedStats));
  };

  const startNewRun = () => {
    setIsTracking(false);
    setDistance(0);
    setAveragePace('0:00');
    setElapsedTime(0);
    setStartTime(null);
    setIsFinished(false);
    setIsReadyForNewRun(true);
  };

  useEffect(() => {
    if (isTracking && distance > 0) {
      const currentElapsedTime = (Date.now() - startTime) / 1000;
      setElapsedTime(currentElapsedTime);

      const distanceInKm = distance / 1000;
      const paceInSecondsPerKm = currentElapsedTime / distanceInKm;

      const paceMinutes = Math.floor(paceInSecondsPerKm / 60);
      const paceSeconds = Math.round(paceInSecondsPerKm % 60);

      setAveragePace(`${paceMinutes}:${paceSeconds < 10 ? '0' : ''}${paceSeconds}`);
    }
  }, [distance, isTracking, startTime]);

  const startRun = () => {
    setIsTracking(true);
    setDistance(0);
    setAveragePace('0:00');
    setElapsedTime(0);
    setIsFinished(false);
    setStartTime(Date.now());
    setIsReadyForNewRun(false);

    const id = setInterval(() => {
      const currentElapsedTime = (Date.now() - startTime) / 1000;
      setElapsedTime(currentElapsedTime);
    }, 1000);

    setIntervalId(id);
  };

  const stopRun = () => {
    setIsTracking(false);
    const totalTime = (Date.now() - startTime) / 1000;
    setElapsedTime(totalTime);

    if (totalTime > 0 && distance > 0) {
      const distanceInKm = distance / 1000;
      const totalSeconds = totalTime / distanceInKm;
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = Math.round(totalSeconds % 60);

      setAveragePace(`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
    }

    const newRun = {
      distance: distance / 1000,
      time: totalTime / 60,
      speed: (distance / 1000) / (totalTime / 3600),
      pace: averagePace,
      date: new Date().toLocaleString(),
    };

    saveRunStats(newRun);
    clearInterval(intervalId);
    setIsFinished(true);
  };

  const handleDistanceChange = (newDistance) => {
    setDistance((prevDistance) => prevDistance + newDistance);
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.round(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="StopwatchScreen">
      {isReadyForNewRun ? (
        <div className="startButton" onClick={startRun}>Start</div>
      ) : (
        <>
          {!isTracking && !isFinished ? (
            <div className="startButton" onClick={startRun}>Start</div>
          ) : (
            <>
              {isTracking && !isFinished && (
                <>
                  <Stopwatch
                    isTracking={isTracking}
                    onStop={stopRun}
                    onElapsedChange={(time) => setElapsedTime(time)}
                  />
                  <Speedometer
                    isTracking={isTracking}
                    onDistanceChange={handleDistanceChange}
                  />
                  <div className="summary">
                    <p>Total Distance: {distance.toFixed(2)} km</p>
                    <p>Average Pace: {averagePace ? averagePace + " min/km" : "0:00 min/km"}</p>
                  </div>
                </>
              )}
            </>
          )}

          {isFinished && (
            <div className="summary">
              <p>Total Distance: {distance.toFixed(2)} km</p>
              <p>Average Pace: {averagePace ? averagePace + " min/km" : "N/A"}</p>
              <p>Elapsed Time: {formatTime(elapsedTime)}</p>
              <div className="newRunButton" onClick={startNewRun}>Start New Run</div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default StopwatchScreen;
