'use strict';
class Ship {
    constructor(stage, x = 0, y = 0) {
        this._x = x;
        this._y = y;
        this._r = 0;

        this.energy = 200;
        this.health = 100;
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
        this.accelerationX = 0.2;
        this.accelerationY = 0.2;
        this.frictionX = 0.998;
        this.frictionY = 0.998;

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

class User extends Ship {
    constructor() {
        super(stage, 100, 100);

        this.k_u = false;
        this.k_d = false;
        this.k_r = false;
        this.k_l = false;
        this.k_shift = false;

        this.id = '';

        this.turnSpeed = 0.2;
        this.acceleration = 1;

        this.keyDownHandler = window.addEventListener('keydown', (event) => {
            if (event.key === 'a' && this.energy > 0) {
                this.k_l = true;
                this.rotationSpeed = -0.075;
                this.sprite.trailR.visible = true;

                this.k_r = false;
                this.sprite.trailL.visible = false;
            }
            if (event.key === 'd' && this.energy > 0) {
                this.rotationSpeed = 0.075;
                this.k_r = true;
                this.sprite.trailL.visible = true;

                this.k_l = false;
                this.sprite.trailR.visible = false;
            }
            if (event.key === 'w' && this.energy > 0) {
                this.moveForward = true;
                this.sprite.exhaust.visible = true;
            }
            if (event.key === 'Shift') {
                this.k_shift = true;
                // if (this.k_l)
            }
            if (event.key === 's' && this.energy > 0) {}
        });

        this.keyUpHandler = window.addEventListener('keyup', (event) => {
            if (event.key === 'a') {
                this.k_l = false;
                if (!this.k_r) this.rotationSpeed = 0;
                this.sprite.trailR.visible = false;
            }
            if (event.key === 'd') {
                this.k_r = false;
                if (!this.k_l) this.rotationSpeed = 0;
                this.sprite.trailL.visible = false;
            }
            if (event.key === 'w') {
                this.moveForward = false;
                this.sprite.exhaust.visible = false;
            }
            if (event.key === 's') {}
        });
    }
    update() {
        if (this.energy > 0) this.rotation += this.rotationSpeed;
        let cost = -1;

        if (this.moveForward && this.energy > 0) {
            this.vx += this.accelerationX * Math.cos(this.rotation);
            this.vy += this.accelerationY * Math.sin(this.rotation);
        } else {
            this.vx *= this.frictionX;
            this.vy *= this.frictionY;
        }

        if (this.energy <= 0) {
            this.sprite.trailL.visible = false;
            this.sprite.trailR.visible = false;
            this.sprite.exhaust.visible = false;
        }

        if (this.rotationSpeed !== 0) cost += 0.4;
        if (this.moveForward) cost += 1.2;

        this.x += this.vx * 0.3;
        this.y += this.vy * 0.3;

        this.energy -= cost;
        if (this.energy > 200) this.energy = 200;
        if (this.energy < 0) this.energy = 0;

        if (this.sprite.centerX > canvas.width) {
            this.x = -this.sprite.halfWidth;
            this.vx *= 0.7;
        } else if (this.sprite.centerX < 0) {
            this.x = canvas.width - this.sprite.halfWidth;
            this.vx *= 0.7;
        }

        if (this.sprite.centerY > canvas.height) {
            this.y = -this.sprite.halfHeight;
            this.vy *= 0.7;
        } else if (this.sprite.centerY < 0) {
            this.y = canvas.height - this.sprite.halfHeight;
            this.vy *= 0.7;
        }
    }
}

class Remote extends Ship {
    constructor(id) {
        super(stage, 100, 100);
        this.id = id;

        stage.remove(this.sprite);
        delete this.sprite;

        this.sprite = Pebble.Sprite([
            assets['images/ship_remote.png'],
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
        this.sprite.putTop(this.sprite.trailL, 10, 10);
        this.sprite.trailL.visible = false;
        this.sprite.add(this.sprite.trailL);

        this.stage.putCenter(this.sprite);

        this.stage.add(this.sprite);

        this.sprite.mass = 5;
    }
    update(x, y, rotation, exhaust, trailL, trailR) {
        this.x = x;
        this.y = y;
        this.rotation = rotation;
        this.sprite.exhaust.visible = exhaust;
        this.sprite.trailL.visible = trailL;
        this.sprite.trailR.visible = trailR;
    }
    kill() {
        ws.send(
            format('u_up', {
                id: this.id,
                alive: false,
                energy: 0,
                health: 0,
                pos: [
                    this.x,
                    this.y,
                    this.rotation,
                    this.sprite.exhaust.visible,
                    this.sprite.trailL.visible,
                    this.sprite.trailR.visible,
                ],
            })
        );
    }
}