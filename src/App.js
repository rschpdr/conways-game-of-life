import { useState, useEffect, useCallback, useRef } from "react";
import useInterval from "./hooks/useInterval";
import Canvas from "./components/Canvas";

function generateEmptyGrid() {
  const rows = [];
  for (let i = 0; i < 41; i++) {
    rows.push(Array.from(Array(78), () => 0));
  }

  return rows;
}

const possibleNeighborPositions = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0],
];

function App() {
  const [grid, setGrid] = useState(generateEmptyGrid());

  const [running, setRunning] = useState(false);
  const runningRef = useRef(running);
  runningRef.current = running;

  const animationHandle = useRef(null);
  const frames = useRef(0);

  function initialPattern() {
    setGrid((prevGrid) => {
      const gridClone = JSON.parse(JSON.stringify(prevGrid));

      gridClone[25][25] = 1;
      gridClone[24][25] = 1;
      gridClone[25][26] = 1;
      gridClone[26][25] = 1;
      gridClone[25][24] = 1;

      return gridClone;
    });
  }

  const gameLoop = useCallback(() => {
    frames.current++;

    // If game is paused do nothing
    if (!runningRef.current) {
      return;
    }

    if (frames.current % 5 === 0) {
      setGrid((prevGrid) => {
        const gridClone = JSON.parse(JSON.stringify(prevGrid));

        for (let i = 0; i < prevGrid.length; i++) {
          for (let j = 0; j < prevGrid[i].length; j++) {
            let neighborCount = 0;

            // Check how many alive neighbors current cell has

            possibleNeighborPositions.forEach(([row, col]) => {
              const targetRow = i + row;
              const targetCol = j + col;

              // Check if we're not at grid extremities
              if (
                targetRow >= 0 &&
                targetRow < prevGrid.length - 1 &&
                targetCol >= 0 &&
                targetCol < prevGrid[i].length - 1
              ) {
                neighborCount += prevGrid[targetRow][targetCol];
              }
            });

            // Any live cell with fewer than two live neighbours dies, as if by underpopulation.
            // Any live cell with more than three live neighbours dies, as if by overpopulation.
            if (neighborCount < 2 || neighborCount > 3) {
              gridClone[i][j] = 0;
            }

            // Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
            if (prevGrid[i][j] === 0 && neighborCount === 3) {
              gridClone[i][j] = 1;
            }

            // Any live cell with two or three live neighbours lives on to the next generation.
          }
        }

        return gridClone;
      });
    }

    animationHandle.current = window.requestAnimationFrame(gameLoop);
  }, []);

  useEffect(() => {
    initialPattern();
  }, []);

  return (
    <div>
      {/* <Canvas /> */}
      <button
        onClick={() => {
          setRunning(true);
          runningRef.current = true;
          gameLoop();
        }}
      >
        Start
      </button>
      <button
        onClick={() => {
          setRunning(false);
        }}
      >
        Stop
      </button>
      <button
        onClick={() => {
          const rows = [];
          for (let i = 0; i < grid.length; i++) {
            rows.push(
              Array.from(Array(grid[i].length), () =>
                Math.random() > 0.7 ? 1 : 0
              )
            );
          }

          setGrid(rows);
        }}
      >
        Random
      </button>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${grid[0].length - 1}, 15px)`,
          border: "1px solid #000",
          backgroundColor: "#000",
          gap: 1,
        }}
      >
        {grid.map((row, i) =>
          row.map((col, j) => (
            <div
              style={{
                width: 15,
                height: 15,
                backgroundColor: col > 0 ? "#000" : "#fff",
              }}
              key={`${i}${j}`}
            ></div>
          ))
        )}
      </div>
      <table>
        <tbody></tbody>
      </table>
    </div>
  );
}

export default App;
