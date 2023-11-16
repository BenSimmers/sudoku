export type Sudoku = {
  newboard: {
    grids: {
      value: number[][];
      solution: number[][];
      difficulty: string;
    }[];
  };
};

