const gamewindow = document.getElementById('gamewindow');
const canvas = new Pebble.Canvas(
    gamewindow,
    gamewindow.getBoundingClientRect().width,
    gamewindow.getBoundingClientRect().height,
    'none',
    'none'
);

let users = [];

let user;

const stage = new Pebble.Stage(canvas.width, canvas.height);

const assets = new Pebble.AssetLoader();

let leftArrow = Pebble.Keyboard(38, document.body),
    upArrow = Pebble.Keyboard(39, document.body),
    rightArrow = Pebble.Keyboard(40, document.body),
    downArrow = Pebble.Keyboard(41, document.body);

(async() => {
    await assets.load([
        'run.js',
        'ship.js',
        'ws.js',
        'images/ship.png',
        'images/shipfire.png',
        'images/shipfire-1.png',
    ]);
    await assets['ship.js'].execute();
    await assets['ws.js'].execute();
    await assets['run.js'].execute();
})();