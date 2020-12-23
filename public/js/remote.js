'use strict';
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

        this.hitbox = 30;

        this.laser = Pebble.Line(32, 12, 232, 12, 'red', 4);

        this.sprite.add(this.laser);
        this.laser.visible = false;

        this.stage.putCenter(this.sprite);

        this.stage.add(this.sprite);

        this.sprite.mass = 5;
    }
    update(
        [x, y, rotation], [exhaust, trailL, trailR], [energy, health, isAlive = true], [shortlaser]
    ) {
        this.x = x;
        this.y = y;
        this.rotation = rotation;
        this.sprite.exhaust.visible = exhaust;
        this.sprite.trailL.visible = trailL;
        this.sprite.trailR.visible = trailR;

        this.energy = energy;
        this.health = health;
        this.alive = isAlive;

        this.laser.visible = shortlaser;
    }
    kill() {
        this.frame = 1;
        this.width = 40;
        this.height = 40;
        this.vx *= 0.1;
        this.vy *= 0.1;
        this.sprite.exhaust.visible = false;
        this.sprite.trailL.visible = false;
        this.sprite.trailR.visible = false;
        this.laser.visible = false;
    }
}