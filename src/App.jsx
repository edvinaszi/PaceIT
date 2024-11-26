import React, { useState } from 'react';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import Home from './Home.jsx';
import Stats from './Stats.jsx';
import PaceSetter from './PaceSetter.jsx';
import StopwatchScreen from './StopwatchScreen.jsx';

function App() {
  const [screen, setScreen] = useState("home");

  function renderScreen() {
    switch(screen) {
      case "home":
        return <Home />;
      case "stats":
        return <Stats />;
      case "paceSetter":
        return <PaceSetter />;
      case "stopwatch":
        return <StopwatchScreen />;
      default:
        return <Home />;
    }
  }

  return (
    <div className="appContainer">
      <Header />
      <main className="mainContent">
        {renderScreen()}
      </main>
      <Footer setScreen={setScreen} />
    </div>
  );
}

export default App;