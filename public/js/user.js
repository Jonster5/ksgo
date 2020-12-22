'use strict';
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

        this.k_space = false;

        this.id = '';

        this.turnSpeed = 0.2;

        // this.test1 = Pebble.Circle(
        //     30,
        //     'none',
        //     'white',
        //     3,
        //     this.laser.a.x,
        //     this.laser.a.y
        // );
        // this.test2 = Pebble.Circle(
        //     30,
        //     'none',
        //     'white',
        //     3,
        //     this.laser.b.x,
        //     this.laser.b.y
        // );

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

            if (event.key === ' ') this.k_space = true;
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

            if (event.key === ' ') this.k_space = false;
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
        this.laser.visible = false;

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
            if (this.k_space) {
                this.laser.visible = true;
                cost += 2.5;
            }
        } else {
            this.k_u = false;
            this.k_d = false;
            this.k_r = false;
            this.k_l = false;
            this.k_shift = false;
            this.k_space = false;
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
        if (this.energy <= 0) {
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
        this.rotation = this.rotation % (Math.PI * 2);

        this.vx *= this.frictionX;
        this.vy *= this.frictionY;

        this.x += this.vx * 0.3;
        this.y += this.vy * 0.3;

        if (this.sprite.centerX > canvas.width) {
            this.x = -this.sprite.halfWidth;
            this.sprite.previousX = -this.sprite.halfWidth;
            this.vx *= 0.5;
            this.vy *= 0.5;
        } else if (this.sprite.centerX < 0) {
            this.x = canvas.width - this.sprite.halfWidth;
            this.sprite.previousX = canvas.width - this.sprite.halfWidth;
            this.vx *= 0.5;
            this.vy *= 0.5;
        }
        if (this.sprite.centerY > canvas.height) {
            this.y = -this.sprite.halfHeight;
            this.sprite.previousY = -this.sprite.halfHeight;
            this.vx *= 0.5;
            this.vy *= 0.5;
        } else if (this.sprite.centerY < 0) {
            this.y = canvas.height - this.sprite.halfHeight;
            this.sprite.previousY = canvas.height - this.sprite.halfHeight;
            this.vx *= 0.5;
            this.vy *= 0.5;
        }

        this.laser.x = this.sprite.centerX + 16;
        this.laser.y = this.sprite.centerY - 2;
        this.laser.rotation = this.sprite.rotation;

        this.laser.a = this.rotatepoint({
            x: this.sprite.centerX,
            y: this.sprite.centerY,
        }, {
            x: this.laser.globalBounds.x,
            y: this.laser.globalBounds.y - 12,
        }, -this.laser.rotation);

        this.laser.b = this.rotatepoint({
            x: this.sprite.centerX,
            y: this.sprite.centerY,
        }, {
            x: this.laser.globalBounds.width,
            y: this.laser.globalBounds.height - 14,
        }, -this.laser.rotation);

        // this.test1.x = this.laser.a.x;
        // this.test1.y = this.laser.a.y;

        // this.test2.x = this.laser.b.x;
        // this.test2.y = this.laser.b.y;
    }
    die() {
        this.frame = 1;
        this.vx *= 0.1;
        this.vy *= 0.1;
        this.alive = false;
    }
    respawn() {}
}