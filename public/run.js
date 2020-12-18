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

            ws.send(
                format('u_up', {
                    id: user.id,
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