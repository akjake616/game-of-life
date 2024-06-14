const { ipcRenderer } = require('electron');

const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const resetButton = document.getElementById('resetButton');

const cellSize = 10;
let canvasWidth;
let canvasHeight;
let rows;
let cols;
let grid;
let animationId;

ipcRenderer.on('start-game', (event, gridSize) => {
    canvasWidth = gridSize.width * cellSize;
    canvasHeight = gridSize.height * cellSize;
    rows = gridSize.height;
    cols = gridSize.width;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    grid = createGrid(rows, cols);
    drawGrid(grid);
});

function createGrid(rows, cols) {
    return Array.from({ length: rows }, () => Array.from({ length: cols }, () => Math.random() > 0.8 ? 1 : 0));
}

function drawGrid(grid) {
    context.clearRect(0, 0, canvasWidth, canvasHeight);

    // Draw cells
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            context.beginPath();
            context.rect(col * cellSize, row * cellSize, cellSize, cellSize);
            context.fillStyle = grid[row][col] ? '#C46243' : '#FCFAF2';
            context.fill();
            context.strokeStyle = '#D7C4BB';
            context.stroke();
        }
    }
}

function getNextGeneration(grid) {
    const nextGrid = grid.map(arr => [...arr]);
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const neighbors = countNeighbors(grid, row, col);
            if (grid[row][col] === 1 && (neighbors < 2 || neighbors > 3)) {
                nextGrid[row][col] = 0;
            } else if (grid[row][col] === 0 && neighbors === 3) {
                nextGrid[row][col] = 1;
            }
        }
    }
    return nextGrid;
}

function countNeighbors(grid, row, col) {
    let sum = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            const x = row + i;
            const y = col + j;
            if (x >= 0 && x < rows && y >= 0 && y < cols) {
                sum += grid[x][y];
            }
        }
    }
    sum -= grid[row][col];
    return sum;
}

function update() {
    grid = getNextGeneration(grid);
    drawGrid(grid);
    animationId = requestAnimationFrame(update);
}

startButton.addEventListener('click', () => {
    if (!animationId) {
        update();
    }
});

stopButton.addEventListener('click', () => {
    cancelAnimationFrame(animationId);
    animationId = null;
});

resetButton.addEventListener('click', () => {
    cancelAnimationFrame(animationId);
    animationId = null;
    grid = createGrid(rows, cols);
    drawGrid(grid);
});
