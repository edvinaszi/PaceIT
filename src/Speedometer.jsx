import React, { useState, useEffect } from 'react';

function Speedometer({ isTracking, onDistanceChange }) {
  const [speed, setSpeed] = useState(0);
  const [lastPosition, setLastPosition] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation || !isTracking) {
      return;
    }

    const handleLocationError = (error) => {
      if (error.code === 1) {
        setError('Permission Denied');
      } else if (error.code === 2) {
        setError('Position Unavailable');
      } else if (error.code === 3) {
        setError('Timeout');
      } else {
        setError('Unknown Error');
      }
    };

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, speed: currentSpeed } = position.coords;

        if (lastPosition) {
          const earthRadius = 6371;
          const dLat = ((latitude - lastPosition.latitude) * Math.PI) / 180;
          const dLon = ((longitude - lastPosition.longitude) * Math.PI) / 180;
          const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((lastPosition.latitude * Math.PI) / 180) *
              Math.cos((latitude * Math.PI) / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          const distance = earthRadius * c;

          onDistanceChange(distance);
        }

        setLastPosition({ latitude, longitude });
        setSpeed(currentSpeed != null ? (currentSpeed * 3.6).toFixed(2) : 0);
      },
      handleLocationError,
      {
        enableHighAccuracy: true,
        maximumAge: 1000,
        timeout: 5000,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [isTracking, lastPosition, onDistanceChange]);

  return (
    <div className="speedometer">
      <p>Current speed: {speed} km/h</p>
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default Speedometer;