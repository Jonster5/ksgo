'use strict';
class Ship {
    constructor(stage, x = 0, y = 0) {
        this._x = x;
        this._y = y;
        this._r = 0;

        this.energy = 200;
        this.health = 200;
        this.alive = true;

        this.stage = stage;

        this.sprite = Pebble.Sprite([
            assets['images/ship.png'],
            assets['images/explosion.png'],
        ]);
        // Pebble.addStatePlayer(this.sprite);
        this.sprite.width = 32;
        this.sprite.height = 24;
        this.sprite.pivotX = 0.5;

        this.missiles = [];

        this.sprite.exhaust = Pebble.Sprite([
            assets['images/shipfire.png'],
            assets['images/shipfire-1.png'],
        ]);
        Pebble.addStatePlayer(this.sprite.exhaust);
        this.sprite.exhaust.fps = 12;
        this.sprite.exhaust.play();
        this.sprite.exhaust.width = 32;
        this.sprite.exhaust.height = 24;
        this.sprite.exhaust.rotation = Math.PI * 2 - Math.PI / 2;
        this.sprite.putLeft(this.sprite.exhaust, 9, -4.5);
        this.sprite.exhaust.visible = false;
        this.sprite.add(this.sprite.exhaust);

        this.sprite.trailR = Pebble.Sprite([assets['images/shipfire.png']]);
        this.sprite.trailR.width = 8;
        this.sprite.trailR.height = 12;
        this.sprite.trailR.rotation = Math.PI;
        this.sprite.putBottom(this.sprite.trailR, 10, -10);
        this.sprite.trailR.visible = false;
        this.sprite.add(this.sprite.trailR);

        this.sprite.trailL = Pebble.Sprite([assets['images/shipfire-1.png']]);
        this.sprite.trailL.width = 8;
        this.sprite.trailL.height = 12;
        this.sprite.rotation = 0;
        this.sprite.putTop(this.sprite.trailL, 10, 10);
        this.sprite.trailL.visible = false;
        this.sprite.add(this.sprite.trailL);

        this.stage.putCenter(this.sprite);

        this.stage.add(this.sprite);

        this.vx = 0;
        this.vy = 0;
        this.acceleration = 0.2;
        this.frictionX = 0.999;
        this.frictionY = 0.999;

        this.maxSpeed = 5;

        this.rotationSpeed = 0;
        this.moveForward = false;
    }
    get frame() {
        return this.sprite.currentFrame;
    }
    set frame(value) {
        this.sprite.gotoAndStop(value);

        if (value === 0) {
            this.sprite.width = 32;
            this.sprite.height = 24;
            this.sprite.pivotX = 0.5;
        } else if (value === 1) {
            this.sprite.width = 48;
            this.sprite.height = 48;
            this.sprite.pivotX = 0.5;
        }
    }

    get x() {
        return this.sprite.x;
    }
    set x(value) {
        this.sprite.x = value;
    }
    get y() {
        return this.sprite.y;
    }
    set y(value) {
        this.sprite.y = value;
    }
    get rotation() {
        return this.sprite.rotation;
    }
    set rotation(value) {
        this.sprite.rotation = value;
    }
    get mass() {
        return this.sprite.mass;
    }
    set mass(value) {
        this.sprite.mass = value;
    }
}