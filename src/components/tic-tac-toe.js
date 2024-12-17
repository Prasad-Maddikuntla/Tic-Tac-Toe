import React, { useState } from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';
import { styled } from '@mui/system';

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
});

const Cell = styled(Button)(({ theme }) => ({
  width: '100px',
  height: '100px',
  fontSize: '2rem',
  fontWeight: 'bold',
  border: `1px solid ${theme.palette.divider}`,
  color: '#ecf0f1',
  backgroundColor: '#34495e',
  '&:hover': {
    backgroundColor: '#1abc9c',
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
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);

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
    if (board[index] || winner) return;

    const newBoard = board.slice();
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);

    const result = checkWinner(newBoard);
    if (result) {
      setWinner(result);
    }
  };

  const handleReset = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
  };

  return (
    <BoardContainer>
      <Title>Tic Tac Toe</Title>
      <Grid container spacing={0} justifyContent="center" style={{ width: '300px' }}>
        {board.map((cell, index) => (
          <Grid item xs={4} key={index}>
            <Cell onClick={() => handleClick(index)}>
              {cell}
            </Cell>
          </Grid>
        ))}
      </Grid>
      {winner && (
        <Typography variant="h6" color="primary" style={{ marginTop: '20px', color: '#ecf0f1' }}>
          Winner: {winner}
        </Typography>
      )}
      <ResetButton variant="contained" onClick={handleReset}>
        Reset Game
      </ResetButton>
    </BoardContainer>
  );
};

export default TicTacToe;
