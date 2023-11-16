#include <stdio.h>

int board[9][9] = {
    {5, 3, 0, 0, 7, 0, 0, 0, 0},
    {6, 0, 0, 1, 9, 5, 0, 0, 0},
    {0, 9, 8, 0, 0, 0, 0, 6, 0},
    {8, 0, 0, 0, 6, 0, 0, 0, 3},
    {4, 0, 0, 8, 0, 3, 0, 0, 1},
    {7, 0, 0, 0, 2, 0, 0, 0, 6},
    {0, 6, 0, 0, 0, 0, 2, 8, 0},
    {0, 0, 0, 4, 1, 9, 0, 0, 5},
    {0, 0, 0, 0, 8, 0, 0, 7, 9}};

int is_valid(int board[9][9], int row, int col, int num)
{
  for (int i = 0; i < 9; i++)
  {
    if (board[row][i] == num || board[i][col] == num)
    {
      return 0;
    }
  }

  // check if the number is in the 3x3 square
  int start_row = 3 * (row / 3);
  int start_col = 3 * (col / 3);
  for (int i = start_row; i < start_row + 3; i++)
  {
    for (int j = start_col; j < start_col + 3; j++)
    {
      if (board[i][j] == num)
      {
        return 0;
      }
    }
  }
  return 1;
}

int *find_empty_location(int board[9][9])
{
  static int empty[2];
  empty[0] = -1;
  empty[1] = -1;

  for (int i = 0; i < 9; i++)
  {
    for (int j = 0; j < 9; j++)
    {
      if (board[i][j] == 0)
      {
        empty[0] = i;
        empty[1] = j;
        return empty;
      }
    }
  }

  return empty;
}

int solve(int board[9][9])
{
  int row, col;
  int *empty = find_empty_location(board);
  row = empty[0];
  col = empty[1];

  if (row == -1)
  {
    return 1;
  }

  for (int num = 1; num < 10; num++)
  {
    if (is_valid(board, row, col, num))
    {
      board[row][col] = num;
      if (solve(board))
      {
        return 1;
      }
      board[row][col] = 0;
    }
  }

  return 0;
}

int main(void)
{
  if (solve(board))
  {
    for (int i = 0; i < 9; i++)
    {
      for (int j = 0; j < 9; j++)
      {
        printf("%d ", board[i][j]);
      }
      printf("\n");
    }
  }
  else
  {
    printf("No solution found\n");
    return 1;
  }

  return 0;
}