// Snake game engine. Pure functions: the UI calls `step` on a timer and draws
// whatever state comes back.
export type Point = { x: number; y: number };
export type Direction = "up" | "down" | "left" | "right";

export type SnakeState = {
  size: number;
  snake: Point[]; // head first
  direction: Direction;
  queued: Direction[]; // turns pressed between ticks
  food: Point;
  score: number;
  over: boolean;
};

const VECTORS: Record<Direction, Point> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

const OPPOSITE: Record<Direction, Direction> = { up: "down", down: "up", left: "right", right: "left" };

export function placeFood(size: number, snake: Point[], random: () => number = Math.random): Point {
  const taken = new Set(snake.map((p) => `${p.x},${p.y}`));
  const free: Point[] = [];
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) if (!taken.has(`${x},${y}`)) free.push({ x, y });
  return free.length ? free[Math.floor(random() * free.length)] : { x: -1, y: -1 };
}

export function createGame(size = 18, random: () => number = Math.random): SnakeState {
  const mid = Math.floor(size / 2);
  const snake = [
    { x: mid, y: mid },
    { x: mid - 1, y: mid },
    { x: mid - 2, y: mid },
  ];
  return { size, snake, direction: "right", queued: [], food: placeFood(size, snake, random), score: 0, over: false };
}

/** Queues a turn. Reversing straight into the snake's own body is ignored. */
export function turn(state: SnakeState, dir: Direction): SnakeState {
  const last = state.queued[state.queued.length - 1] ?? state.direction;
  if (dir === last || dir === OPPOSITE[last] || state.queued.length >= 2) return state;
  return { ...state, queued: [...state.queued, dir] };
}

export function step(state: SnakeState, random: () => number = Math.random): SnakeState {
  if (state.over) return state;
  const [nextDir, ...rest] = state.queued;
  const direction = nextDir ?? state.direction;
  const v = VECTORS[direction];
  const head = { x: state.snake[0].x + v.x, y: state.snake[0].y + v.y };
  const eats = head.x === state.food.x && head.y === state.food.y;
  // The tail moves away this tick unless the snake grows, so it is not an obstacle.
  const body = eats ? state.snake : state.snake.slice(0, -1);
  const hitsWall = head.x < 0 || head.y < 0 || head.x >= state.size || head.y >= state.size;
  const hitsSelf = body.some((p) => p.x === head.x && p.y === head.y);
  if (hitsWall || hitsSelf) return { ...state, direction, queued: rest, over: true };

  const snake = [head, ...body];
  return {
    ...state,
    snake,
    direction,
    queued: rest,
    food: eats ? placeFood(state.size, snake, random) : state.food,
    score: state.score + (eats ? 1 : 0),
  };
}

/** Milliseconds per move: starts relaxed and speeds up as the score grows. */
export function tickInterval(score: number): number {
  return Math.max(65, 150 - score * 4);
}

/** Speed level shown to the player, 1 upwards. */
export function speedLevel(score: number): number {
  return Math.floor((150 - tickInterval(score)) / 20) + 1;
}
