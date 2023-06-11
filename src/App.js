import React, { useState } from 'react';

const RobotGrid = () => {
  const [robotPosition, setRobotPosition] = useState({ x: 0, y: 0 });
  const [targetPosition, setTargetPosition] = useState({ x: 4, y: 4 });
  const [directions, setDirections] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleGridClick = (x, y) => {
    setTargetPosition({ x, y });
    if (!isPlaying) {
      setRobotPosition({ x, y });
    }
  };

  const handleArrowClick = (direction) => {
    if (!isPlaying) {
      setDirections((prevDirections) => [...prevDirections, direction]);
    }
  };

  const handlePlayClick = () => {
    if (!isPlaying) {
      setIsPlaying(true);
      executeDirections();
    }
  };

  const handleResetClick = () => {
    if (!isPlaying) {
      setRobotPosition({ x: 0, y: 0 });
      setDirections([]);
    }
  };

  const executeDirections = () => {
    let index = 0;
    const interval = setInterval(() => {
      if (index === directions.length) {
        clearInterval(interval);
        setIsPlaying(false);
        return;
      }

      const direction = directions[index];
      moveRobot(direction);
      index++;
    }, 500);
  };

  const moveRobot = (direction) => {
    let dx = 0;
    let dy = 0;

    switch (direction) {
      case 'up':
        dy = -1;
        break;
      case 'down':
        dy = 1;
        break;
      case 'left':
        dx = -1;
        break;
      case 'right':
        dx = 1;
        break;
      default:
        break;
    }

    const newX = robotPosition.x + dx;
    const newY = robotPosition.y + dy;

    if (newX >= 0 && newX < 5 && newY >= 0 && newY < 5) {
      setRobotPosition({ x: newX, y: newY });
    }
  };

  return (
    <div className="robot-container">
      <div className="robot-box">
        <div className="robot-grid">
          {Array.from(Array(5), (_, row) => (
            <div key={row} className="grid-row">
              {Array.from(Array(5), (_, col) => (
                <div
                  key={col}
                  className={`grid-cell ${
                    robotPosition.x === col && robotPosition.y === row
                      ? 'robot'
                      : ''
                  }`}
                  onClick={() => handleGridClick(col, row)}
                ></div>
              ))}
            </div>
          ))}
        </div>
        <div className="logic-panel">
          <div className="arrow-buttons">
            <div
              className="arrow-button up"
              onClick={() => handleArrowClick('up')}
            >
              &#8593;
            </div>
            <div
              className="arrow-button down"
              onClick={() => handleArrowClick('down')}
            >
              &#8595;
            </div>
            <div
              className="arrow-button left"
              onClick={() => handleArrowClick('left')}
            >
              &#8592;
            </div>
            <div
              className="arrow-button right"
              onClick={() => handleArrowClick('right')}
            >
              &#8594;
            </div>
          </div>
          <div className="buttons">
            <button className="play-button" onClick={handlePlayClick}>
              Play
            </button>
            <button className="reset-button" onClick={handleResetClick}>
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <div className="app">
      <h1>Robot Movement</h1>
      <RobotGrid />
    </div>
  );
};

export default App;
