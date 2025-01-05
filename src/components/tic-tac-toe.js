import React, { useState, useEffect } from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { useAuth } from './Context';
import { getSocketConnections } from './soketConnection';

const BoardContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '40px',
  height: '100vh',
  backgroundColor: '#2c3e50',
});

const Title = styled(Typography)({
  marginBottom: '40px',
  fontSize: '2.5rem',
  fontWeight: 'bold',
  color: '#ecf0f1',
  textAlign: 'center',
});

const Cell = styled(Button)(({ theme, disabled }) => ({
  width: '100px',
  height: '100px',
  fontSize: '2rem',
  fontWeight: 'bold',
  border: `1px solid ${theme.palette.divider}`,
  color: disabled ? '#7f8c8d' : '#ecf0f1',
  backgroundColor: disabled ? '#7f8c8d' : '#34495e',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '&:hover': {
    backgroundColor: !disabled && '#1abc9c',
  },
}));

const ResetButton = styled(Button)({
  marginTop: '40px',
  fontSize: '1.5rem',
  color: '#ecf0f1',
  backgroundColor: '#e74c3c',
  '&:hover': {
    backgroundColor: '#c0392b',
  },
});

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [winner, setWinner] = useState(null);
  const { user, heads, opponent } = useAuth(); // Assuming user context has user info
  const [myTurn, setMyTurn] = useState(heads);
  const [isXNext, setIsXNext] = useState(heads);

  const socket = getSocketConnections();

  useEffect(() => {
    socket.on('move', ({ index, symbol }) => {
      setBoard((prevBoard) => {
        const newBoard = [...prevBoard];
        newBoard[index] = symbol;
        return newBoard;
      });
      setMyTurn(true);
    });

    socket.on('reset', () => {
      setBoard(Array(9).fill(null));
      setIsXNext(true);
      setWinner(null);
      setMyTurn(true);
    });
  }, [socket]);

  const checkWinner = (newBoard) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ];

    for (let line of lines) {
      const [a, b, c] = line;
      if (newBoard[a] && newBoard[a] === newBoard[b] && newBoard[a] === newBoard[c]) {
        return newBoard[a];
      }
    }
    return null;
  };

  const handleClick = (index) => {
    if (board[index] || winner || !myTurn) return;

    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);

    const result = checkWinner(newBoard);
    if (result) {
      setWinner(result);
      socket.emit('winner', result);
    }

    socket.emit('move', { index, symbol: isXNext ? 'X' : 'O', opponent });
    setIsXNext(!isXNext);
    setMyTurn(false);
  };

  const handleReset = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
    setMyTurn(true);
    socket.emit('reset');
  };

  return (
    <BoardContainer>
      <Title>Tic Tac Toe</Title>
      <Grid container spacing={1} style={{ width: '310px' }}>
        {board.map((cell, index) => (
          <Grid item xs={4} key={index}>
            <Cell
              onClick={() => handleClick(index)}
              disabled={!myTurn || board[index]}
            >
              {cell}
            </Cell>
          </Grid>
        ))}
      </Grid>
      {winner ? (
        <Typography variant="h6" style={{ marginTop: '20px', color: '#ecf0f1' }}>
          Winner: {winner}
        </Typography>
      ) : (
        !myTurn && (
          <Typography variant="h6" style={{ marginTop: '20px', color: '#ecf0f1' }}>
            Waiting for opponent...
          </Typography>
        )
      )}
      <ResetButton variant="contained" onClick={handleReset}>
        Reset Game
      </ResetButton>
    </BoardContainer>
  );
};

export default TicTacToe;
