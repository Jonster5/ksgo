'use strict';
class Ship {
    constructor(stage, x = 0, y = 0) {
        this._x = x;
        this._y = y;
        this._r = 0;

        this.vel = {
            x: 0,
            y: 0,
            r: 0,
        };

        this.stage = stage;

        this.sprite = Pebble.Sprite(assets['images/ship.png']);
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
        this.sprite.putTop(this.sprite.trailL, 10, 10);
        this.sprite.trailL.visible = false;
        this.sprite.add(this.sprite.trailL);

        this.stage.putCenter(this.sprite);

        this.stage.add(this.sprite);

        this.vx = 0;
        this.vy = 0;
        this.accelerationX = 0.2;
        this.accelerationY = 0.2;
        this.frictionX = 0.998;
        this.frictionY = 0.998;
        this.sprite.mass = 5;
        this.maxSpeed = 5;

        this.rotationSpeed = 0;
        this.moveForward = false;
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

    update() {
        this.rotation += this.rotationSpeed;

        if (this.moveForward) {
            this.vx += this.accelerationX * Math.cos(this.rotation);
            this.vy += this.accelerationY * Math.sin(this.rotation);
        } else {
            this.vx *= this.frictionX;
            this.vy *= this.frictionY;
        }

        this.x += this.vx;
        this.y += this.vy;

        if (this.sprite.centerX > stage.width) {
            this.x = -this.sprite.halfWidth;
            this.vx *= 0.7;
        } else if (this.sprite.centerX < 0) {
            this.x = stage.width - this.sprite.halfWidth;
            this.vx *= 0.7;
        }

        if (this.sprite.centerY > stage.height) {
            this.y = -this.sprite.halfHeight;
            this.vy *= 0.7;
        } else if (this.sprite.centerY < 0) {
            this.y = stage.height - this.sprite.halfHeight;
            this.vy *= 0.7;
        }
    }
}

class User extends Ship {
    constructor() {
        super(stage, 100, 100);

        this.k_u = false;
        this.k_d = false;
        this.k_r = false;
        this.k_l = false;

        this.id = '';

        this.turnSpeed = 0.2;
        this.acceleration = 1;

        this.keyDownHandler = window.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowLeft') {
                this.k_l = true;
                this.rotationSpeed = -0.1;
                this.sprite.trailR.visible = true;
            }
            if (event.key === 'ArrowRight') {
                this.rotationSpeed = 0.1;
                this.k_r = true;
                this.sprite.trailL.visible = true;
            }
            if (event.key === 'ArrowUp') {
                this.moveForward = true;
                this.sprite.exhaust.visible = true;
            }
            if (event.key === 'ArrowDown') {}
        });

        this.keyUpHandler = window.addEventListener('keyup', (event) => {
            if (event.key === 'ArrowLeft') {
                this.k_l = false;
                if (!this.k_r) this.rotationSpeed = 0;
                this.sprite.trailR.visible = false;
            }
            if (event.key === 'ArrowRight') {
                this.k_r = false;
                if (!this.k_l) this.rotationSpeed = 0;
                this.sprite.trailL.visible = false;
            }
            if (event.key === 'ArrowUp') {
                this.moveForward = false;
                this.sprite.exhaust.visible = false;
            }
            if (event.key === 'ArrowDown') {}
        });
    }
}

class Remote extends Ship {
    constructor(id) {
        super(stage, 100, 100);
        this.id = id;
    }
    update(x, y, rotation, exhaust, trailL, trailR) {
        this.x = x;
        this.y = y;
        this.rotation = rotation;
        this.sprite.exhaust.visible = exhaust;
        this.sprite.trailL.visible = trailL;
        this.sprite.trailR.visible = trailR;
    }
}