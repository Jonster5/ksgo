'use strict';
const gamewindow = document.getElementById('gamewindow');
const energymeter = document.getElementById('energymeter');
const healthmeter = document.getElementById('healthmeter');

const canvas = new Pebble.Canvas(
    gamewindow,
    4000,
    2000,
    'none',
    'url(images/backgr.png)'
);

canvas.domElement.style.width = `${gamewindow.getBoundingClientRect().width}px`;
canvas.domElement.style.height = `auto`;

window.addEventListener('resize', () => {
    canvas.domElement.style.width = `${
		gamewindow.getBoundingClientRect().width
	}px`;
    canvas.domElement.style.height = `auto`;
});

let users = [];

let user;

const stage = new Pebble.Stage(canvas.width, canvas.height);

const assets = new Pebble.AssetLoader();

Pebble.interpolationData.FPS = 60;

(async() => {
    await assets.load([
        'js/run.js',
        'js/ship.js',
        'js/user.js',
        'js/remote.js',
        'js/socket.js',
        'js/mapobj.js',
        'images/ship.png',
        'images/ship_remote.png',
        'images/shipfire.png',
        'images/shipfire-1.png',
        'images/explosion.png',
    ]);
    await assets['js/ship.js'].execute();
    await assets['js/user.js'].execute();
    await assets['js/remote.js'].execute();
    await assets['js/mapobj.js'].execute();
    await assets['js/socket.js'].execute();
    await assets['js/run.js'].execute();
})();