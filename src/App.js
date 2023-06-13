import React, { useState, createRef, useRef } from 'react';
import LogicPanel from './logic';
import Draggable from 'react-draggable';

const RobotGrid = () => {
  const gridSize = 5; // Define the grid size here
  const [robotPosition, setRobotPosition] = useState({ x: 0, y: 0 });
  const [targetPosition, setTargetPosition] = useState({ x: 4, y: 4 });
  const [directions, setDirections] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [generatedButtons, setGeneratedButtons] = useState([]);
  const [buttonPositions, setButtonPositions] = useState({});


  const arrowButtons = [
    { id: 1, direction: 'up' },
    { id: 2, direction: 'down' },
    { id: 3, direction: 'left' },
    { id: 4, direction: 'right' },
  ];

  const buttonRefs = arrowButtons.reduce((acc, button) => {
    acc[button.id] = createRef();
    return acc;
  }, {});
  const gridRef = useRef(null); // Create the gridRef using useRef

  const handleDragStop = (buttonId) => (e, data) => {
    const { node } = data;
    const { left, top } = node.getBoundingClientRect();
  
    const cellWidth = node.offsetWidth;
    const cellHeight = node.offsetHeight;
  
    const gridRect = gridRef.current.getBoundingClientRect();
    const gridLeft = gridRect.left;
    const gridTop = gridRect.top;
  
    const cellX = Math.floor((left - gridLeft) / cellWidth);
    const cellY = Math.floor((top - gridTop) / cellHeight);
  
    const newButton = { id: buttonId, direction: buttonId, position: { x: cellX, y: cellY } };
    setGeneratedButtons((prevButtons) => [...prevButtons, newButton]);
    setButtonPositions((prevPositions) => ({ ...prevPositions, [buttonId]: { x: left, y: top } }));
  };

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
      setRobotPosition({ x: 0, y: 0});
      setDirections([]);
      setGeneratedButtons((prevButtons) => {
        const draggedButtons = prevButtons.filter((button) => button.position.x !== 0 || button.position.y !== 0);
        console.log("dragged button " +draggedButtons);
        const updatedButtons = draggedButtons.map((button) => ({
          ...button,
          position: { x: 0, y: 0 },
        }));
        console.log("updated button " + updatedButtons);
        return updatedButtons;
      });
      window.location.reload();
    }
  };
             
  const executeDirections = () => {
    setIsPlaying(true);
  
    let updatedPosition = { ...robotPosition };
  
    for (let i = 0; i < directions.length; i++) {
      const direction = directions[i];
      updatedPosition = moveRobot(updatedPosition, direction);
  
      if (
        updatedPosition.x === targetPosition.x &&
        updatedPosition.y === targetPosition.y
      ) {
        alert('Destination reached!'); // Display the alert
        break;
      }
    }
  
    setRobotPosition(updatedPosition);
    setIsPlaying(false);
  };
  
  
  const moveRobot = (position, direction) => {
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
  
    const newX = position.x + dx;
    const newY = position.y + dy;
  
    if (newX >= 0 && newX < gridSize && newY >= 0 && newY < gridSize) {
      return { x: newX, y: newY };
    }
  
    return position;
  };
  return (
    <div className="robot-container">
      <div className="robot-box">
      <div className="robot-grid" ref={gridRef}>
  {Array.from(Array(gridSize), (_, row) => (
    <div key={row} className="grid-row">
      {Array.from(Array(gridSize), (_, col) => {
        const isRobotPosition = col === robotPosition.x && row === robotPosition.y;
        const isTargetPosition = col === targetPosition.x && row === targetPosition.y;
        const isLastCell = col === gridSize - 1 && row === gridSize - 1;
        const generatedButton = generatedButtons.find(
          (button) => button.position.x === col && button.position.y === row
        );

        return (
          <div
            key={col}
            className={`grid-cell ${isRobotPosition ? 'robot' : ''} ${
              isTargetPosition ? 'target' : ''
            } ${isLastCell ? 'last-cell' : ''}`}
            onClick={() => handleGridClick(col, row)}
          >
            {isRobotPosition && (
              <img
                src="https://w7.pngwing.com/pngs/899/316/png-transparent-internet-bot-desktop-2d-robot-sprites-blue-orange-computer-wallpaper.png"
                alt="Robot Sprite"
                style={{ width: '50px', height: '50px' }}
              />
            )}
            {generatedButton && (
              <div className={`generated-button ${generatedButton.direction}`}>
                {generatedButton.direction}
              </div>
            )}
          </div>
        );
      })}
    </div>
  ))}
</div>

        {/* <h4>Logic Panel</h4> */}
        <div className="logic-panel">
          <div className="arrow-buttons">

{generatedButtons.map((button, index) => (
  <Draggable
    key={button.id}
    defaultPosition={buttonPositions[button.id]}
    onStop={handleDragStop(button.direction)}
  >
    <div
      className={`generated-button arrow-button ${button.direction}`}
      onClick={() => handleArrowClick(button.direction)}
    >
      {button.direction === 'up' && '↑'}
      {button.direction === 'down' && '↓'}
      {button.direction === 'left' && '←'}
      {button.direction === 'right' && '→'}
    </div>
  </Draggable>
))}

      {arrowButtons.map((button) => (
              <Draggable
                key={button.id}
                onStop={handleDragStop(button.direction)}
                nodeRef={buttonRefs[button.id]}
              >
                <div
                  ref={buttonRefs[button.id]}
                  className={`arrow-button ${button.direction}`}
                  onClick={() => handleArrowClick(button.direction)}
                >
                  {button.direction === 'up' && '↑'}
                  {button.direction === 'down' && '↓'}
                  {button.direction === 'left' && '←'}
                  {button.direction === 'right' && '→'}
                </div>
              </Draggable>
            ))}
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
      <LogicPanel />
    </div>
  );
};

export default App;
