const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow;
let gameWindow;

const cellSize = 10;  // Define a constant cell size for calculation

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 250,
        height: 300,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        resizable: false
    });

    mainWindow.loadFile('index.html');
}

function createGameWindow(gridSize, parent) {
    gameWindow = new BrowserWindow({
        width: Math.max(gridSize.width * cellSize + 100, 350),
        height: gridSize.height * cellSize + 150,
        parent: parent ? parent : null,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: false,
        }
    });

    gameWindow.loadFile('game.html');
    gameWindow.webContents.on('did-finish-load', () => {
        gameWindow.webContents.send('start-game', gridSize);
    });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

ipcMain.on('open-game', (event, gridSize) => {
    createGameWindow(gridSize, mainWindow);
});
