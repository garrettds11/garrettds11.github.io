function updatePositionDisplay() {
  document.getElementById('position').textContent =
    `Player Position: (${player.x}, ${player.y})`;
}


const canvas = document.getElementById('mazeCanvas');
const ctx = canvas.getContext('2d');

const cols = 20;
const rows = 20;
const cellSize = canvas.width / cols;

// Sample 20x20 maze: 0 = wall, 1 = path
// This is just a basic sample. Feel free to update it with your own layout!
const maze = [
// 0 1 2 3 4 5 6 7 8 910111213141516171819
  [1,0,1,1,1,1,0,0,0,1,1,1,0,1,1,0,1,0,0,1],//0
  [1,0,1,0,0,1,1,1,0,1,0,1,0,1,0,0,1,1,0,1],//1
  [1,1,1,0,1,1,0,1,0,1,0,1,1,1,0,1,1,0,0,1],//2
  [0,0,0,0,1,0,0,1,1,1,0,0,0,0,0,1,0,0,1,1],//3
  [1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,0],//4
  [1,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,1,0],//5
  [1,1,1,1,1,1,0,1,0,0,0,1,1,1,1,1,1,0,1,1],//6
  [0,0,0,0,0,1,0,1,0,1,0,0,0,0,0,0,1,0,0,0],//7
  [1,1,1,1,0,1,1,1,0,1,1,1,1,1,1,0,1,1,1,1],//8
  [1,0,0,1,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,1],//9
  [1,1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,0,1],//10
  [0,1,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,1],//11
  [1,1,1,1,1,1,0,1,1,1,1,0,1,1,1,1,0,1,1,1],//12
  [1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0],//13
  [1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1],//14
  [0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1],//15
  [1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,0,0,1],//16
  [1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,1,1,1],//17
  [1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,0,1,0,0],//18
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,1,1] //19
];

let player = { x: 0, y: 0 };

function drawMaze() {
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      ctx.fillStyle = maze[y][x] === 1 ? '#fff' : '#000';
      ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
    }
  }

  // Draw player
  ctx.fillStyle = 'blue';
  ctx.fillRect(player.x * cellSize, player.y * cellSize, cellSize, cellSize);
}

function movePlayer(dx, dy) {
  const newX = player.x + dx;
  const newY = player.y + dy;
  if (
    newX >= 0 && newX < cols &&
    newY >= 0 && newY < rows &&
    maze[newY][newX] === 1
  ) {
    player.x = newX;
    player.y = newY;
    drawMaze();
    updatePositionDisplay();

    if (player.x === cols - 1 && player.y === rows - 1) {
      setTimeout(() => alert('You made it!'), 100);
    }
  }
}

document.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowUp': movePlayer(0, -1); break;
    case 'ArrowDown': movePlayer(0, 1); break;
    case 'ArrowLeft': movePlayer(-1, 0); break;
    case 'ArrowRight': movePlayer(1, 0); break;
  }
});

drawMaze();
