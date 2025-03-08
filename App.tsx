import React, { useState, useEffect } from 'react';
import { Shuffle } from 'lucide-react';

function App() {
  const [tiles, setTiles] = useState<number[]>([]);
  const [isWon, setIsWon] = useState(false);
  const [moves, setMoves] = useState(0);

  // Initialize and shuffle board
  const initializeBoard = () => {
    const numbers = Array.from({ length: 8 }, (_, i) => i + 1);
    numbers.push(0); // Empty tile represented by 0
    shuffleBoard(numbers);
  };

  const shuffleBoard = (numbers: number[]) => {
    let currentIndex = numbers.length;
    while (currentIndex !== 0) {
      const randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [numbers[currentIndex], numbers[randomIndex]] = [
        numbers[randomIndex],
        numbers[currentIndex],
      ];
    }
    // Ensure puzzle is solvable
    if (isSolvable(numbers)) {
      setTiles(numbers);
    } else {
      shuffleBoard(numbers);
    }
    setIsWon(false);
    setMoves(0);
  };

  // Check if puzzle is solvable
  const isSolvable = (numbers: number[]): boolean => {
    let inversions = 0;
    for (let i = 0; i < numbers.length - 1; i++) {
      for (let j = i + 1; j < numbers.length; j++) {
        if (numbers[i] && numbers[j] && numbers[i] > numbers[j]) {
          inversions++;
        }
      }
    }
    return inversions % 2 === 0;
  };

  // Check if puzzle is solved
  const checkWin = (currentTiles: number[]) => {
    const won = currentTiles.every((tile, index) => 
      index === currentTiles.length - 1 ? tile === 0 : tile === index + 1
    );
    setIsWon(won);
  };

  // Handle tile movement
  const moveTile = (index: number) => {
    if (isWon) return;

    const emptyIndex = tiles.indexOf(0);
    const row = Math.floor(index / 3);
    const emptyRow = Math.floor(emptyIndex / 3);
    const col = index % 3;
    const emptyCol = emptyIndex % 3;

    // Check if tile can move (adjacent to empty space)
    if (
      (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
      (Math.abs(col - emptyCol) === 1 && row === emptyRow)
    ) {
      const newTiles = [...tiles];
      [newTiles[index], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[index]];
      setTiles(newTiles);
      setMoves(moves + 1);
      checkWin(newTiles);
    }
  };

  // Initialize board on first render
  useEffect(() => {
    initializeBoard();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Sliding Puzzle</h1>
          <p className="text-gray-600">Arrange the tiles in order from 1-8</p>
        </div>

        <div className="relative aspect-square mb-6">
          <div className="grid grid-cols-3 gap-2 h-full">
            {tiles.map((tile, index) => (
              <button
                key={index}
                onClick={() => moveTile(index)}
                className={`${
                  tile === 0
                    ? 'bg-transparent'
                    : 'bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold shadow-lg transform hover:scale-105 transition-transform'
                } rounded-lg flex items-center justify-center text-2xl`}
                disabled={isWon}
              >
                {tile !== 0 && tile}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <p className="text-gray-700">Moves: {moves}</p>
          <button
            onClick={() => shuffleBoard([...tiles])}
            className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Shuffle size={20} />
            Shuffle
          </button>
        </div>

        {isWon && (
          <div className="text-center p-4 bg-green-100 rounded-lg">
            <p className="text-green-700 font-bold">
              Congratulations! You solved the puzzle in {moves} moves!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
