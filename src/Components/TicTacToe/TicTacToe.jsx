import React, { useState } from 'react';
import './TicTacToe.css';

const TicTacToe = () => {
    const [board, setBoard] = useState(Array(9).fill(""));
    const [isXNext, setIsXNext] = useState(true);
    const [winner, setWinner] = useState(null);
    const [scoreX, setScoreX] = useState(0);
    const [scoreO, setScoreO] = useState(0);
    const [gameCount, setGameCount] = useState(0);

    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    const checkWinner = (board) => {
        for (let combination of winningCombinations) {
            const [a, b, c] = combination;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a];
            }
        }
        if (board.every(cell => cell !== "")) {
            return "Draw";
        }
        return null;
    };

    const handleClick = (index) => {
        if (board[index] !== "" || winner) return;

        const newBoard = [...board];
        newBoard[index] = isXNext ? "X" : "O";
        setBoard(newBoard);
        setIsXNext(!isXNext);

        const gameWinner = checkWinner(newBoard);
        if (gameWinner) {
            setWinner(gameWinner);
            if (gameWinner === "X") {
                setScoreX(scoreX + 1);
            } else if (gameWinner === "O") {
                setScoreO(scoreO + 1);
            }
        }
    };

    const handleReset = () => {
        if (board.some(cell => cell !== "")) {
            setGameCount(gameCount + 1);
        }
        setBoard(Array(9).fill(""));
        setIsXNext(true);
        setWinner(null);
    };

    return (
        <div className='container'>
            <h1 className="title">Tic Tac Toe Game <span>by Nechayev Vladislav</span></h1>
            <div className="board">
                <div className="row1">
                    <div className="boxes" onClick={() => handleClick(0)}>{board[0]}</div>
                    <div className="boxes" onClick={() => handleClick(1)}>{board[1]}</div>
                    <div className="boxes" onClick={() => handleClick(2)}>{board[2]}</div>
                </div>
                <div className="row2">
                    <div className="boxes" onClick={() => handleClick(3)}>{board[3]}</div>
                    <div className="boxes" onClick={() => handleClick(4)}>{board[4]}</div>
                    <div className="boxes" onClick={() => handleClick(5)}>{board[5]}</div>
                </div>
                <div className="row2">
                    <div className="boxes" onClick={() => handleClick(6)}>{board[6]}</div>
                    <div className="boxes" onClick={() => handleClick(7)}>{board[7]}</div>
                    <div className="boxes" onClick={() => handleClick(8)}>{board[8]}</div>
                </div>
            </div>
            {winner && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>{winner === "Draw" ? "It's a Draw!" : `Winner: ${winner}`}</h2>
                        <button onClick={handleReset}>Restart</button>
                    </div>
                </div>
            )}
            <div className="scoreboard">
                <div className="score">X win count: {scoreX}</div>
                <div className="score">O win count: {scoreO}</div>
                <div className="score">Games count: {gameCount}</div>
            </div>
            <button className="button" role="button" onClick={handleReset}><span className="text">Restart</span></button>
        </div>
    );
};

export default TicTacToe;