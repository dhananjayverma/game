// import React, { useState } from 'react';
// import './App.css';
// const initialBoard = Array(9).fill(null);
// const App = () => {
//   const [board, setBoard] = useState(initialBoard);
//   const [isXTurn, setIsXTurn] = useState(true);
//   const [winner, setWinner] = useState(null);
//   const [scores, setScores] = useState({ X: 0, O: 0 });

//   const checkWinner = () => {
//     const winningConditions = [
//       [0, 1, 2],
//       [3, 4, 5],
//       [6, 7, 8],
//       [0, 3, 6],
//       [1, 4, 7],
//       [2, 5, 8],
//       [0, 4, 8],
//       [2, 4, 6],
//     ];

//     for (let condition of winningConditions) {
//       const [a, b, c] = condition;
//       if (board[a] && board[a] === board[b] && board[a] === board[c]) {
//         setWinner(board[a]);
//         setScores(scores => ({ ...scores, [board[a]]: scores[board[a]] + 1 }));
//         return;
//       }
//     }

//     if (board.every(cell => cell !== null)) {
//       setWinner('draw');
//     }
//   };

//   const handleCellClick = index => {
//     if (board[index] || winner) return;

//     const newBoard = [...board];
//     newBoard[index] = isXTurn ? 'X' : 'O';
//     setBoard(newBoard);
//     setIsXTurn(!isXTurn);
//     checkWinner();
//   };

//   const resetGame = () => {
//     setBoard(initialBoard);
//     setWinner(null);
//   };

//   const renderCell = (index) => {
//     return (
//       <div
//         className="cell"
//         onClick={() => handleCellClick(index)}
//       >
//         {board[index]}
//       </div>
//     );
//   };

//   return (
//     <div className="App">
//       <h1>Tic Tac Toe</h1>
//       <div className="board">
//         {board.map((cell, index) => renderCell(index))}
//       </div>
//       {winner && winner !== 'draw' && (
//         <p className="winner">Winner: {winner}</p>
//       )}
//       {winner === 'draw' && <p className="draw">It's a draw!</p>}
//       <p className="turn">Turn: {isXTurn ? 'X' : 'O'}</p>
//       <button onClick={resetGame}>Reset Game</button>
//       <div className="scores">
//         <p>Score:</p>
//         <p>X: {scores.X}</p>
//         <p>O: {scores.O}</p>
//       </div>
//     </div>
//   );
// };

// export default App;




import React, { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './App.css';

const initialState = {
  board: Array(9).fill(null),
  currentPlayer: 'X',
  winner: null,
};

const App = () => {
  const [state, setState] = useState(initialState);

  const handleClick = (index) => {
    if (state.board[index] || state.winner) return;

    const newBoard = [...state.board];
    newBoard[index] = state.currentPlayer;

    setState({
      ...state,
      board: newBoard,
      currentPlayer: state.currentPlayer === 'X' ? 'O' : 'X',
      winner: checkWinner(newBoard),
    });
  };

  const checkWinner = (board) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }

    if (board.every((cell) => cell !== null)) {
      return 'draw';
    }

    return null;
  };

  const resetGame = () => {
    setState(initialState);
  };

  const renderCell = (index) => {
    return (
      <Cell
        key={index}
        index={index}
        value={state.board[index]}
        onClick={() => handleClick(index)}
      />
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="App">
        <h1>Tic Tac Toe</h1>
        <div className="board">
          {state.board.map((cell, index) => (
            <div key={index} className="cell-wrapper">
              {renderCell(index)}
            </div>
          ))}
        </div>
        <div className="status">
          {state.winner ? (
            state.winner === 'draw' ? (
              <p>It's a draw!</p>
            ) : (
              <p>{`Player ${state.winner} wins!`}</p>
            )
          ) : (
            <p>{`Player ${state.currentPlayer}'s turn`}</p>
          )}
          <button onClick={resetGame}>Reset Game</button>
        </div>
      </div>
    </DndProvider>
  );
};

const Cell = ({ index, value, onClick }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'cell',
    item: { index },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'cell',
    drop: () => onClick(index),
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`cell ${isDragging ? 'dragging' : ''}`}
      onClick={onClick}
    >
      {value}
    </div>
  );
};

export default App;
