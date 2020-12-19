'use strict';

let animator;

function Animate(timestamp) {
    animator = requestAnimationFrame(Animate);

    Pebble.render(
        canvas,
        stage,
        true,
        Pebble.getLagOffset(timestamp, () => {
            if (ws.readyState !== ws.OPEN) return;

            if (user.alive) {
                user.prep();
                user.update();
            } else if (!user.alive) {
                user.die();
            }

            users.forEach((u) => {
                if (u.dis.health <= 0 || u.dis.alive === false) u.dis.kill();
            });

            energymeter.style.height = `${200 - user.energy}px`;

            healthmeter.style.height = `${200 - user.health}px`;

            ws.send(
                format('u_up', {
                    id: user.id,
                    alive: user.alive,
                    energy: user.energy,
                    health: user.health,
                    pos: [
                        user.x,
                        user.y,
                        user.rotation,
                        user.sprite.exhaust.visible,
                        user.sprite.trailL.visible,
                        user.sprite.trailR.visible,
                    ],
                })
            );
            // if (users) users.forEach((u) => u.update());
        })
    );
}
Animate();

// setTimeout(() => {
//     cancelAnimationFrame(animator);
// }, 300);