const EPS = 0.0001;
const NEAR_CLIPPING_PLANE = 1;
const FOV = Math.PI * 0.5;

class vec2 {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  static zero(): vec2 {
    return new vec2(0, 0);
  }
  static fromAngle(angle: number): vec2 {
    return new vec2(Math.cos(angle), Math.sin(angle));
  }
  array(): [number, number] {
    return [this.x, this.y];
  }
  add(second: vec2): vec2 {
   return new vec2(this.x + second.x, this.y + second.y);
  }
  div(second: vec2): vec2 {
    return new vec2(this.x / second.x, this.y / second.y);
  }
  mul(second: vec2): vec2 {
    return new vec2(this.x * second.x, this.y * second.y);
  }
  sub(second: vec2): vec2 {
    return new vec2(this.x - second.x, this.y - second.y);
  }
  dx(second: vec2): number {
    return second.x - this.x;
  }
  dy(second: vec2): number {
    return second.y - this.y;
  }
  length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  norm(): vec2 {
    const length = this.length();
    if (length === 0) {
      return new vec2(0, 0);
    }
    return new vec2(this.x / length, this.y / length);
  }
  scale(value: number): vec2 {
    return new vec2(this.x * value, this.y * value);
  }
  distanceTo(second: vec2): number {
    return this.sub(second).length();
  }
}

function canvasSize(ctx: CanvasRenderingContext2D): vec2 {  
  return new vec2(ctx.canvas.width, ctx.canvas.height);
}
function createdot(ctx: CanvasRenderingContext2D, p: vec2) {
  ctx.beginPath();
  ctx.arc(...p.array(), 0.2, 0, 2 * Math.PI);
  ctx.fillStyle = "blue";
  ctx.fill();
}

function strokeline(ctx: CanvasRenderingContext2D, p1: vec2, p2: vec2) {
  ctx.beginPath();
  ctx.moveTo(...p1.array());
  ctx.lineTo(...p2.array());
  ctx.stroke();
}

function snap(x: number, dx: number): number {
  if (dx > 0) {
    return Math.ceil(x + Math.sign(dx) * EPS);
  }
  if (dx < 0) {
    return Math.floor(x + Math.sign(dx) * EPS);
  }
  return x;
}

function hitcell(p1: vec2, p2: vec2): vec2 {
  const d = p2.sub(p1);
  return new vec2(
    Math.floor(p2.x + Math.sign(d.x) * EPS),
    Math.floor(p2.y + Math.sign(d.y) * EPS)
  );
}
function raypath(p1: vec2, p2: vec2): vec2 {
  const d = p2.sub(p1);
  let p3 = p2;

  if (d.x !== 0) {
    const k = d.y / d.x;
    const c = p1.y - k * p1.x;
    {
      const x3 = snap(p2.x, d.x);
      const y3 = k * x3 + c;
      p3 = new vec2(x3, y3);
    }
    if (k !== 0) {
      const y3 = snap(p2.y, d.y);
      const x3 = (y3 - c) / k;
      const p3t = new vec2(x3, y3);
      if (p2.distanceTo(p3t) < p2.distanceTo(p3)) {
        p3 = p3t;
      }
    }
  } else {
    const x3 = p2.x;
    const y3 = snap(p2.y, d.y);
    p3 = new vec2(x3, y3);
  }

  return p3;
}

type scene = Array<Array<number>>;

function sceneSize(scene: scene): vec2 {
  const y = scene.length;
  let x = Number.MIN_VALUE;
  for (let row of scene) {
    x = Math.max(x, row.length);
  }
  return new vec2(x, y);
}

function minimap(
  ctx: CanvasRenderingContext2D,
  player: Player,
  position: vec2,
  size: vec2,
  scene: scene
) {
  ctx.save();
  ctx.fillStyle = "gray";
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  const gridSize = sceneSize(scene);

  ctx.translate(...position.array());
  ctx.scale(...size.div(gridSize).array());
  ctx.lineWidth = 0.02;

  for (let i = 0; i < gridSize.y; ++i) {
    for (let j = 0; j < gridSize.x; ++j) {
      if (scene[i][j] !== 0) {
        ctx.fillStyle = "#300";
        ctx.fillRect(j, i, 1, 1);
      }
    }
  }
  ctx.strokeStyle = "black";
  for (let i = 0; i <= gridSize.x; ++i) {
    strokeline(ctx, new vec2(0, i), new vec2(gridSize.y, i));
  }
  for (let i = 0; i <= gridSize.y; ++i) {
    strokeline(ctx, new vec2(i, 0), new vec2(i, gridSize.x));
  }
  
  createdot(ctx, player.postion);
  ctx.strokeStyle = "red";
  ctx.lineWidth = 0.05;
  strokeline(ctx,player.postion,player.postion.add(vec2.fromAngle(player.direction).scale(NEAR_CLIPPING_PLANE)));
  ctx.strokeStyle = "green";
  strokeline(ctx,player.postion,player.postion.add(vec2.fromAngle(player.direction+Math.PI/4).scale(NEAR_CLIPPING_PLANE)));
  strokeline(ctx,player.postion,player.postion.add(vec2.fromAngle(player.direction+7*Math.PI/4).scale(NEAR_CLIPPING_PLANE)));
  ctx.restore();
}

class Player {
  postion: vec2;
  direction: number;
  constructor(position: vec2, direction: number) {
    this.postion = position;
    this.direction = direction;
  }
}
(() => {
  let scene = [
    [0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 1, 1, 0, 0, 0, 0],
    [0, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ];

  const game = document.getElementById("game") as HTMLCanvasElement | null;
  if (game === null) {
    console.error("Game not found");
    return;
  }
  if (game.getContext === undefined) {
    console.error("Canvas not supported");
    return;
  }
  const factor = 70;
  game.width = 16*factor;
  game.height = 9*factor;

  const ctx = game.getContext("2d") as CanvasRenderingContext2D | null;
  
  if (ctx === null) {
    throw new Error("2d context not supported");
  }  
   
  let player = new Player(
    sceneSize(scene).mul(new vec2(0.57, 0.55))
    ,Math.PI);
  let mapPos = vec2.zero().add(canvasSize(ctx).scale(0.05));
  let cellsize = ctx.canvas.width * 0.05 ;
  let msize = sceneSize(scene).scale(cellsize);
  minimap(ctx, player, mapPos, msize, scene);
})();
