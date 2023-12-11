
export function manhattanDistance(start: { row: number; col: number }, end: { row: number; col: number }): number {
      return Math.abs(start.row - end.row) + Math.abs(start.col - end.col);
}
