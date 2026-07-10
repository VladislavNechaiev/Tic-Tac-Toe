import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCcw, User, Cpu, History, ChevronLeft, ChevronRight } from 'lucide-react';

const winningCombinations = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

const checkWinner = (board) => {
  for (let [a, b, c] of winningCombinations) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
  }
  return board.includes(null) ? null : 'Draw';
};

const getBestMove = (board, player) => {
  const opponent = player === 'X' ? 'O' : 'X';
  const minimax = (newBoard, isMaximizing) => {
    const winner = checkWinner(newBoard);
    if (winner === player) return 10;
    if (winner === opponent) return -10;
    if (winner === 'Draw') return 0;

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (!newBoard[i]) {
          newBoard[i] = player;
          let score = minimax(newBoard, false);
          newBoard[i] = null;
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < 9; i++) {
        if (!newBoard[i]) {
          newBoard[i] = opponent;
          let score = minimax(newBoard, true);
          newBoard[i] = null;
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  };

  let bestScore = -Infinity;
  let move;
  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      board[i] = player;
      let score = minimax(board, false);
      board[i] = null;
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return move;
};

export default function TicTacToe() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [stepNumber, setStepNumber] = useState(0);
  const [isXNext, setIsXNext] = useState(true);
  const [gameMode, setGameMode] = useState('pvp'); // 'pvp' or 'pva'
  const [scores, setScores] = useState({ X: 0, O: 0 });

  const currentBoard = history[stepNumber];
  const winner = checkWinner(currentBoard);

  useEffect(() => {
    if (gameMode === 'pva' && !isXNext && !winner) {
      const timer = setTimeout(() => {
        const aiMove = getBestMove([...currentBoard], 'O');
        if (aiMove !== undefined) handleClick(aiMove);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isXNext, currentBoard, gameMode, winner]);

  const handleClick = (index) => {
    if (currentBoard[index] || winner) return;

    const newHistory = history.slice(0, stepNumber + 1);
    const newBoard = [...currentBoard];
    newBoard[index] = isXNext ? 'X' : 'O';

    setHistory([...newHistory, newBoard]);
    setStepNumber(newHistory.length);
    setIsXNext(!isXNext);

    const newWinner = checkWinner(newBoard);
    if (newWinner === 'X') setScores(s => ({ ...s, X: s.X + 1 }));
    else if (newWinner === 'O') setScores(s => ({ ...s, O: s.O + 1 }));
  };

  const jumpTo = (step) => {
    setStepNumber(step);
    setIsXNext(step % 2 === 0);
  };

  const resetGame = () => {
    setHistory([Array(9).fill(null)]);
    setStepNumber(0);
    setIsXNext(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col items-center py-12 px-4 font-sans selection:bg-indigo-500/30">
      <div className="max-w-4xl w-full flex flex-col items-center">
        
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center mb-10">
          <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent mb-3">
            Tic Tac Toe
          </h1>
          <p className="text-slate-400 font-medium tracking-wide">Modern Makeover Edition</p>
        </motion.div>

        <div className="flex bg-slate-900 rounded-xl p-1 mb-10 shadow-lg border border-slate-800">
          <button
            onClick={() => { setGameMode('pvp'); resetGame(); }}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${gameMode === 'pvp' ? 'bg-indigo-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <User size={18} /> PvP
          </button>
          <button
            onClick={() => { setGameMode('pva'); resetGame(); }}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${gameMode === 'pva' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Cpu size={18} /> vs AI
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 w-full max-w-5xl">
          
          <div className="lg:col-span-3 flex flex-col gap-4">
            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 backdrop-blur-sm">
              <h3 className="text-slate-400 text-sm uppercase tracking-widest font-bold mb-4">Scoreboard</h3>
              <div className="flex justify-between items-center mb-2">
                <span className="text-indigo-400 font-black text-xl">Player X</span>
                <span className="text-2xl font-bold">{scores.X}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-cyan-400 font-black text-xl">{gameMode === 'pva' ? 'AI O' : 'Player O'}</span>
                <span className="text-2xl font-bold">{scores.O}</span>
              </div>
            </div>
            
            <button
              onClick={resetGame}
              className="flex items-center justify-center gap-2 w-full py-4 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-2xl font-bold transition-all border border-slate-700 hover:border-slate-600 shadow-md"
            >
              <RefreshCcw size={20} />
              New Game
            </button>
          </div>

          <div className="lg:col-span-6 flex justify-center">
            <div className="relative">
              <div className="grid grid-cols-3 gap-3 bg-slate-800 p-3 rounded-3xl shadow-2xl border border-slate-700">
                {currentBoard.map((cell, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: cell || winner ? 1 : 1.05 }}
                    whileTap={{ scale: cell || winner ? 1 : 0.95 }}
                    onClick={() => handleClick(i)}
                    className="w-24 h-24 sm:w-32 sm:h-32 bg-slate-900 rounded-2xl flex items-center justify-center text-6xl sm:text-7xl font-black shadow-inner border border-slate-800/50 transition-colors hover:bg-slate-800/80"
                    disabled={cell || winner}
                  >
                    <AnimatePresence>
                      {cell && (
                        <motion.span
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className={cell === 'X' ? 'text-indigo-400' : 'text-cyan-400'}
                        >
                          {cell}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                ))}
              </div>

              <AnimatePresence>
                {winner && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute inset-0 z-10 flex items-center justify-center bg-slate-950/80 rounded-3xl backdrop-blur-sm"
                  >
                    <div className="bg-slate-900 border border-slate-700 p-8 rounded-2xl shadow-2xl text-center">
                      <h2 className="text-3xl font-black mb-6">
                        {winner === 'Draw' ? "It's a Draw!" : <span className={winner === 'X' ? 'text-indigo-400' : 'text-cyan-400'}>{winner} Wins!</span>}
                      </h2>
                      <button
                        onClick={resetGame}
                        className="px-8 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-bold transition-colors shadow-lg"
                      >
                        Play Again
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-slate-900/50 rounded-2xl border border-slate-800 backdrop-blur-sm h-full max-h-[420px] flex flex-col overflow-hidden">
              <div className="p-4 border-b border-slate-800 flex items-center gap-2">
                <History size={18} className="text-slate-400" />
                <h3 className="text-slate-400 text-sm uppercase tracking-widest font-bold">Time Travel</h3>
              </div>
              <div className="p-2 overflow-y-auto flex-1 space-y-1">
                {history.map((_, move) => (
                  <button
                    key={move}
                    onClick={() => jumpTo(move)}
                    className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all flex items-center justify-between ${stepNumber === move ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'hover:bg-slate-800 text-slate-400'}`}
                  >
                    <span>{move === 0 ? 'Game Start' : `Move #${move}`}</span>
                    {stepNumber === move && <ChevronLeft size={16} />}
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}