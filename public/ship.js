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
        this.acceleration = 0.2;
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

        this.energycooldown = false;
        this.einteral;

        this.k_u = false;
        this.k_d = false;
        this.k_r = false;
        this.k_l = false;

        this.k_shift = false;
        this.strafeRight = false;
        this.strafeLeft = false;

        this.id = '';

        this.turnSpeed = 0.2;

        this.keyDownHandler = window.addEventListener('keydown', (event) => {
            event.preventDefault();

            if (event.key === 'a') this.k_l = true;
            if (event.key === 'd') this.k_r = true;
            if (event.key === 'w' || event.key === 'W') this.k_u = true;
            if (event.key === 's' || event.key === 'S') this.k_d = true;

            if (event.key === 'A') {
                this.k_shift = true;
                this.k_l = true;
            }
            if (event.key === 'D') {
                this.k_shift = true;
                this.k_r = true;
            }
            if (event.key === 'Shift' && event.location === 1)
                this.k_shift = true;
        });

        this.keyUpHandler = window.addEventListener('keyup', (event) => {
            event.preventDefault();

            if (event.key === 'a') this.k_l = false;
            if (event.key === 'd') this.k_r = false;
            if (event.key === 'w' || event.key === 'W') this.k_u = false;
            if (event.key === 's' || event.key === 'S') this.k_d = false;

            if (event.key === 'A') {
                this.k_l = false;
                if (!this.strafeRight) this.k_shift = false;
            }
            if (event.key === 'D') {
                this.k_r = false;
                if (!this.strafeLeft) this.k_shift = false;
            }

            if (event.key === 'Shift' && event.location === 1)
                this.k_shift = false;
        });
    }
    prep() {
        let cost = -1;

        this.moveForward = false;
        this.rotationSpeed = 0;
        this.strafeLeft = false;
        this.strafeRight = false;

        this.sprite.trailL.visible = false;
        this.sprite.trailR.visible = false;
        this.sprite.exhaust.visible = false;

        if (this.energy > 0 && !this.energycooldown) {
            if (this.k_u) {
                this.moveForward = true;
                this.sprite.exhaust.visible = true;
                cost += 1.5;
            }

            if (this.k_l) {
                if (this.k_shift) {
                    this.strafeLeft = true;
                    this.sprite.trailR.visible = true;
                    cost += 0.5;
                } else {
                    this.rotationSpeed = (3 * -Math.PI) / 180;
                    this.sprite.trailR.visible = true;
                    cost += 0.5;
                    if (this.k_r) this.rotationSpeed = 0;
                }
            }
            if (this.k_r) {
                if (this.k_shift) {
                    this.strafeRight = true;
                    this.sprite.trailL.visible = true;
                    cost += 0.6;
                } else {
                    this.rotationSpeed = (3 * Math.PI) / 180;
                    this.sprite.trailL.visible = true;
                    cost += 0.6;
                    if (this.k_l) this.rotationSpeed = 0;
                }
            }
        } else {
            this.k_u = false;
            this.k_d = false;
            this.k_r = false;
            this.k_l = false;
            this.k_shift = false;
        }

        this.energy -= cost;
        if (this.energy >= 200) {
            this.energy = 200;

            if (this.energycooldown) {
                clearInterval(this.einterval);
                energymeter.parentElement.style.backgroundColor = 'lime';
                setTimeout(() => {
                    energymeter.parentElement.style.backgroundColor = 'gold';
                }, 500);
            }

            this.energycooldown = false;
        }
        if (this.energy < 0) {
            this.energy = 0;
            this.energycooldown = true;
            energymeter.parentElement.style.backgroundColor = 'red';
            this.einterval = setInterval(() => {
                energymeter.parentElement.style.backgroundColor =
                    energymeter.parentElement.style.backgroundColor === 'gold' ?
                    'red' :
                    'gold';
            }, 300);
        }
    }
    update() {
        if (this.moveForward) {
            this.vx += this.acceleration * Math.cos(this.rotation);
            this.vy += this.acceleration * Math.sin(this.rotation);
        }

        if (this.strafeLeft) {
            this.vx +=
                (this.acceleration / 2) * Math.cos(this.rotation - Math.PI / 2);
            this.vy +=
                (this.acceleration / 2) * Math.sin(this.rotation - Math.PI / 2);
        }
        if (this.strafeRight) {
            this.vx +=
                (this.acceleration / 2) * Math.cos(this.rotation + Math.PI / 2);
            this.vy +=
                (this.acceleration / 2) * Math.sin(this.rotation + Math.PI / 2);
        }

        this.rotation += this.rotationSpeed;

        this.vx *= this.frictionX;
        this.vy *= this.frictionY;

        this.x += this.vx * 0.3;
        this.y += this.vy * 0.3;

        if (this.sprite.centerX > canvas.width) {
            this.x = -this.sprite.halfWidth;
            this.sprite.previousX = -this.sprite.halfWidth;
        } else if (this.sprite.centerX < 0) {
            this.x = canvas.width - this.sprite.halfWidth;
            this.sprite.previousX = canvas.width - this.sprite.halfWidth;
        }
        if (this.sprite.centerY > canvas.height) {
            this.y = -this.sprite.halfHeight;
            this.sprite.previousY = -this.sprite.halfHeight;
        } else if (this.sprite.centerY < 0) {
            this.y = canvas.height - this.sprite.halfHeight;
            this.sprite.previousY = canvas.height - this.sprite.halfHeight;
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