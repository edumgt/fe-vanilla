export class DiceEngine {
  public static roll(): { dice1: number; dice2: number; total: number; isDouble: boolean } {
    const dice1 = Math.floor(Math.random() * 6) + 1;
    const dice2 = Math.floor(Math.random() * 6) + 1;
    return {
      dice1,
      dice2,
      total: dice1 + dice2,
      isDouble: dice1 === dice2,
    };
  }

  public static calculateNewPosition(currentPos: number, step: number, boardSize: number = 36): { newPos: number; passedStart: boolean } {
    const rawPos = currentPos + step;
    const newPos = rawPos % boardSize;
    const passedStart = rawPos >= boardSize;
    return { newPos, passedStart };
  }
}
