
export async function fetchSudoku(apiUrl: string) {
  const response = await fetch(apiUrl);
  const data = await response.json();
  return data;
}

