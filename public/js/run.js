'use strict';

let animator;

function Animate(timestamp) {
    animator = requestAnimationFrame(Animate);

    Pebble.render(
        canvas,
        stage,
        true,
        Pebble.getLagOffset(timestamp, () => {
            if (!(
                    aws.readyState === WebSocket.OPEN &&
                    gws.readyState === WebSocket.OPEN
                ))
                return;

            if (user.alive) {
                user.prep();
                user.update();
            } else if (!user.alive) {
                user.die();
            }

            let hitarr = [];

            users.forEach((u) => {
                if (!u.dis.alive) u.dis.kill();
            });
            users.forEach((u) => {
                let hit = false;

                if (user.laser.visible) hit = true;

                if (hit === true) hitarr.push(u.id);
            });

            // console.log(hitarr.join(' '));

            energymeter.style.height = `${200 - user.energy}px`;

            healthmeter.style.height = `${200 - user.health}px`;

            gws.send(
                gformat([
                    // info - [0]
                    user.id, // client ID

                    // pos - [1, 2, 3]
                    user.x, // client X coord
                    user.y, // client Y coord
                    user.rotation, // client rotation value

                    // visual - [4, 5, 6]
                    user.sprite.exhaust.visible, // exhaust visible or not?
                    user.sprite.trailL.visible, // left thruster visible or not?
                    user.sprite.trailR.visible, // right thruster visible or not?

                    // stats - [7, 8, 9]
                    user.energy, // client energy level
                    user.health, // client hull level
                    user.alive, // client alive or not?

                    // combat - [10, 11]
                    user.laser.visible, // firing laser or not?
                    hitarr.join(' '), // list of clients currently being hit by laser
                ])
            );
        })
    );
}
Animate();

// setTimeout(() => {
//     cancelAnimationFrame(animator);
// }, 300);