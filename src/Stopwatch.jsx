import React, { useState, useEffect, useRef } from "react";

function Stopwatch({ isTracking, onStop, onElapsedChange }) {
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const intervalIdRef = useRef(null);
  const startTimeRef = useRef(0);

  useEffect(() => {
    if (isTracking) {
      start(); 
    } else {
      stop(); 
    }
  }, [isTracking]);

  useEffect(() => {
    if (isRunning) {
      intervalIdRef.current = setInterval(() => {
        const newElapsedTime = Date.now() - startTimeRef.current;
        setElapsedTime(newElapsedTime);
        if (onElapsedChange) onElapsedChange(newElapsedTime);
      }, 100);
    } else {
      clearInterval(intervalIdRef.current);
    }

    return () => clearInterval(intervalIdRef.current);
  }, [isRunning]);

  const start = () => {
    setIsRunning(true);
    setIsPaused(false);
    startTimeRef.current = Date.now() - elapsedTime;
  };

  const pause = () => {
    setIsRunning(false);
    setIsPaused(true);
  };

  const resume = () => {
    setIsRunning(true);
    setIsPaused(false);
    startTimeRef.current = Date.now() - elapsedTime;
  };

  const stop = () => {
    setIsRunning(false);
    setIsPaused(false);
    if (onStop) onStop(elapsedTime);
  };

  const formatTime = () => {
    const minutes = Math.floor((elapsedTime / (1000 * 60)) % 60);
    const seconds = Math.floor((elapsedTime / 1000) % 60);
    const milliseconds = Math.floor((elapsedTime % 1000) / 10);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}:${String(milliseconds).padStart(2, "0")}`;
  };

  return (
    <div className="stopwatch">
      <div className="display">{formatTime()}</div>
      <div className="stopwatchButtons">
        {!isRunning && !isPaused && elapsedTime === 0 && (
          <div onClick={start} className="startButton">Start</div>
        )}
        {isRunning && (
          <div onClick={pause} className="pauseButton">Pause</div>
        )}
        {isPaused && (
          <div onClick={resume} className="resumeButton">Resume</div>
        )}
        {isRunning || isPaused ? (
          <div onClick={stop} className="stopButton">Stop</div>
        ) : null}
      </div>
    </div>
  );
}

export default Stopwatch;