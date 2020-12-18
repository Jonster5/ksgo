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

            user.update();

            users.forEach((u) => {
                if (u.dis.health <= 0) {
                    ws.send(
                        format('u_up', {
                            id: u.id,
                            alive: false,
                            energy: 0,
                            health: 0,
                            pos: [
                                u.dis.x,
                                u.dis.y,
                                u.dis.rotation,
                                u.dis.sprite.exhaust.visible,
                                u.dis.sprite.trailL.visible,
                                u.dis.sprite.trailR.visible,
                            ],
                        })
                    );
                }
                // if () {

                // }
            });

            ws.send(
                format('u_up', {
                    id: user.id,
                    alive: true,
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