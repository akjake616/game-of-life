const { ipcRenderer } = require('electron');

const startGameButton = document.getElementById('startGameButton');
const gridWidthInput = document.getElementById('gridWidth');
const gridHeightInput = document.getElementById('gridHeight');

startGameButton.addEventListener('click', () => {
    const gridWidth = parseInt(gridWidthInput.value, 10);
    const gridHeight = parseInt(gridHeightInput.value, 10);
    ipcRenderer.send('open-game', { width: gridWidth, height: gridHeight });
});
