let moveCount = 0;
let trail = [];

let timerStarted = false;
let startTime = 0;
let timerInterval = null;

let visitedBonuses = new Set();
let bonusScore = 0;


function updatePositionDisplay() {
  const timeElapsed = timerStarted ? Math.floor((Date.now() - startTime) / 1000) : 0;
  const deductions = (timeElapsed * 5 + moveCount * 10);
  const baseScore = 10000;
  const liveScore = Math.max(0, baseScore - deductions + bonusScore);

  document.getElementById('position').textContent =
    `Player Position: (${player.x}, ${player.y}) | Moves: ${moveCount} | Time: ${timeElapsed}s | Score: ${liveScore}`;
}




const canvas = document.getElementById('mazeCanvas');
const ctx = canvas.getContext('2d');

const cols = 20;
const rows = 20;
const cellSize = canvas.width / cols;

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
  [0,1,0,1,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,1],//11
  [1,1,1,1,1,1,0,1,1,1,1,0,1,1,1,1,0,1,1,1],//12
  [1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0],//13
  [1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,0],//14
  [1,0,0,0,1,0,0,0,1,0,0,1,0,0,0,0,0,0,1,1],//15
  [1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,0,0,1],//16
  [1,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,1,1,1,1],//17
  [1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,0,1,0,0],//18
  [0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,1,1,1] //19
];

let player = { x: 0, y: 0 };

  const specialColors = {
    "4,6": "orange",
    "0,14": "orange",
    "1,17": "orange",
    "0,19": "orange",
    "6,19": "cyan",
    "7,9":  "orange",
    "12,5": "orange",
    "18,2": "orange",
    "18,4": "orange",
    "19,15": "orange",
    "18,17": "cyan",
    "19,19": "lime"
  };
  
function drawMaze() {

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const cellKey = `${y},${x}`;
      ctx.fillStyle = specialColors[cellKey] ?? (maze[y][x] === 1 ? "#000" : "blue");
      ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
    }
  }

  // Draw trail
  ctx.fillStyle = "#888";
  for (const pos of trail) {
    ctx.fillRect(pos.x * cellSize, pos.y * cellSize, cellSize, cellSize);
  }

  // Draw player
  ctx.fillStyle = "#ffe600";
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
    // Step #3: Start the timer only on the first valid move
    if (!timerStarted) {
      timerStarted = true;
      startTime = Date.now();
      timerInterval = setInterval(updatePositionDisplay, 1000);
    }
	
    const startX = player.x;
    const startY = player.y;

    // Add previous position to trail
    trail.push({ x: startX, y: startY });

    let steps = 10;
    let step = 0;

    const animate = () => {
      step++;
      const progress = step / steps;
      const currX = startX + dx * progress;
      const currY = startY + dy * progress;

      drawMaze();

      // Draw animated player
      ctx.fillStyle = "#ffe600";
      ctx.fillRect(currX * cellSize, currY * cellSize, cellSize, cellSize);

      if (step < steps) {
        requestAnimationFrame(animate);
      } else {
//
        player.x = newX;
		player.y = newY;

		const key = `${player.y},${player.x}`;
		const color = specialColors[key];

		if (!visitedBonuses.has(key)) {
		  let bonusAmount = 0;
		  switch (color) {
			case "orange": bonusAmount = 200; break;
			case "cyan": bonusAmount = 300; break;
			case "lime": bonusAmount = 400; break;
		  }

		  if (bonusAmount > 0) {
			bonusScore += bonusAmount;
			visitedBonuses.add(key);

			// Use delayed logs so browser doesn't suppress them
			setTimeout(() => {
			  console.log(`Player stepped on ${key}, color: ${color}`);
			  console.log(`+${bonusAmount} bonus! Total bonus: ${bonusScore}`);
			}, 0);
		  }
		}


//
        moveCount++;
        drawMaze();
        updatePositionDisplay();

        if (player.x === cols - 1 && player.y === rows - 1) {
		  clearInterval(timerInterval);
		  const timeTaken = Math.floor((Date.now() - startTime) / 1000);
		  const liveScore = Math.max(0, 10000 - (timeTaken * 5 + moveCount * 10) + bonusScore);
		  setTimeout(() => {
		    alert(`You made it!\nTime: ${timeTaken}s\nMoves: ${moveCount}\nScore: ${liveScore}`);
		  }, 100);
        }
      }
    };

    animate();
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

function resetMaze() {
  location.reload();
}

drawMaze();
updatePositionDisplay();
