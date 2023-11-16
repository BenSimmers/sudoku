import { useEffect, useState } from "react";
import "./App.css";
import { fetchSudoku } from "./data";
const API_URL: string = "https://sudoku-api.vercel.app/api/dosuku";
const LOCAL_STORAGE_KEY = "sudokuBoard";

type Sudoku = {
  newboard: {
    grids: {
      value: number[][];
      solution: number[][];
      difficulty: string;
    }[];
  };
};


function App() {
  const [sudoku, setSudoku] = useState<Sudoku>({} as Sudoku);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const storedSudoku = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedSudoku) {
      setSudoku(JSON.parse(storedSudoku));
      setLoading(false);
    } else {
      fetchSudoku(API_URL)
        .then((data) => {
          setSudoku(data);
          setLoading(false);
          // Save the fetched Sudoku board to local storage
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
        })
        .catch((error) => {
          console.log(error);
          setError(true);
        });
    }
  }, []);

  const updateCell = (row: number, col: number, value: number) => {
    const updatedSudoku = { ...sudoku };
    updatedSudoku.newboard.grids[0].value[row][col] = value;
    setSudoku(updatedSudoku);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    row: number,
    col: number
  ) => {
    if (e.key === "Backspace") {
      updateCell(row, col, 0);
    }
  };

  const checkSudokuIsSolved = () => {
    const solution = sudoku.newboard.grids[0].solution;
    const value = sudoku.newboard.grids[0].value;

    const flatSolution = solution.flat();
    const flatValue = value.flat();

    const isSolved = flatSolution.every(
      (element: number, index: number) => element === flatValue[index]
    );

    if (isSolved) {
      alert("Sudoku is solved");
      // Set a flag in local storage to prevent further refreshing
      localStorage.setItem("sudokuSolved", "true");
    } else {
      alert("Sudoku is not solved");
    }
  };

  // Check if the Sudoku is solved, if so, prevent refreshing
  useEffect(() => {
    if (localStorage.getItem("sudokuSolved") === "true") {
      window.onbeforeunload = () => true; // Prevent refreshing
    } else {
      window.onbeforeunload = null; // Allow refreshing
    }
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error</div>;
  }

  return (
    <div>
      <div className="text-center font-serif">
        <header className="bg-gray-200 p-6 mb-6 flex flex-col items-center justify-center">
          <h1 className="text-4xl">数独 (Sudoku)</h1>
        </header>
        <button
          onClick={checkSudokuIsSolved}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-6"
        >
          Check if Sudoku is solved
        </button>
        <div className="flex flex-col w-96 mx-auto">
          {sudoku.newboard.grids[0].value.map((row: number[], i: number) => (
            <div className="flex flex-row" key={i}>
              {row.map((cell: number, j: number) => (
                <div className="cell" key={j}>
                  <input
                    value={cell === 0 ? "" : cell}
                    type="text"
                    className="cell-input"
                    onChange={(e) => {
                      const newValue = parseInt(e.target.value);
                      if (!isNaN(newValue)) {
                        updateCell(i, j, newValue);
                      }
                    }}
                    onKeyDown={(e) => handleKeyDown(e, i, j)}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
