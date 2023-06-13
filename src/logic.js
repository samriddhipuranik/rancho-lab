import React from 'react';
import "./logic.css"

const LogicPanel = () => {
  const renderSquares = () => {
    const squares = [];
    for (let i = 0; i < 14; i++) {
      squares.push(<div className="square" key={i}></div>);
    }
    return squares;
  };

  return (
    <div className="logic-panel">
      <div className="squares-container">{renderSquares()}</div>
      <div className="arrow-buttons">
        {/* Arrow buttons go here */}
      </div>
    </div>
  );
};

export default LogicPanel;
