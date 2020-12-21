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

        this.laserpoints = [{
                x: 16,
                y: 12,
            },
            {
                x: 36,
                y: 12,
            },
            {
                x: 56,
                y: 12,
            },
            {
                x: 76,
                y: 12,
            },
            {
                x: 96,
                y: 12,
            },
            {
                x: 116,
                y: 12,
            },
            {
                x: 136,
                y: 12,
            },
            {
                x: 156,
                y: 12,
            },
            {
                x: 176,
                y: 12,
            },
            {
                x: 196,
                y: 12,
            },
        ];

        this.laserpoints = this.laserpoints
            .map((p) => {
                return {
                    x: p.x + this.x,
                    y: p.y + this.y,
                };
            })
            .map((p) => {
                return {
                    x: Math.cos(this.rotation) * (p.x - this.x + 16) +
                        Math.sin(this.rotation) * (p.y - this.y) +
                        this.x,
                    y: Math.cos(this.rotation) * (p.y - this.y) -
                        Math.sin(this.rotation) * (p.x - this.x + 16) +
                        this.y,
                };
            });

        this.laser = Pebble.Line(
            this.laserpoints[0].x,
            this.laserpoints[0].y,
            this.laserpoints[this.laserpoints.length - 1].x,
            this.laserpoints[this.laserpoints.length - 1].y,
            'red',
            4
        );
        this.laser.visible = false;

        this.sprite.add(this.laser);

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