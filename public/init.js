'use strict';
const gamewindow = document.getElementById('gamewindow');
const energymeter = document.getElementById('energymeter');
const canvas = new Pebble.Canvas(gamewindow, 1920, 1080, 'none', 'none');

canvas.domElement.style.width = `${gamewindow.getBoundingClientRect().width}px`;
canvas.domElement.style.height = `auto`;

document.addEventListener('resize', () => {
    canvas.domElement.style.width = `${
		gamewindow.getBoundingClientRect().width
	}px`;
    canvas.domElement.style.height = `auto`;
});

// let scaleX, scaleY, scale;

// scaleX = canvas.domElement.getBoundingClientRect().width / this.width;
// scaleY = canvas.domElement.getBoundingClientRect().height / this.height;

// scale = Math.min(scaleX, scaleY);
// canvas.domElement.style.transformOrigin = '0 0';
// canvas.domElement.style.transform = 'scale(' + scale + ')';

let users = [];

let user;

const stage = new Pebble.Stage(canvas.width, canvas.height);

const assets = new Pebble.AssetLoader();

Pebble.interpolationData.FPS = 60;

(async() => {
    await assets.load([
        'run.js',
        'ship.js',
        'ws.js',
        'images/ship.png',
        'images/ship_remote.png',
        'images/shipfire.png',
        'images/shipfire-1.png',
        'images/explosion.png',
    ]);
    await assets['ship.js'].execute();
    await assets['ws.js'].execute();
    await assets['run.js'].execute();
})();