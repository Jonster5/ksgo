'use strict';

let animator;

function Animate(timestamp) {
    animator = requestAnimationFrame(Animate);

    Pebble.render(
        canvas,
        stage,
        true,
        Pebble.getLagOffset(timestamp, () => {
            if (!user) return;

            if (user.alive) {
                user.prep();
                user.update();
            }
            if (user.health <= 0) {
                user.die();
                user.health = 0;
            }

            let hitarr = [' '];

            users.forEach((u) => {
                if (!u.dis.alive) u.dis.kill();
            });

            if (user.laser.visible) {
                users.forEach((u) => {
                    let hit = calcIsInsideThickLineSegment(
                        user.laser.a,
                        user.laser.b, {
                            x: u.dis.sprite.centerX,
                            y: u.dis.sprite.centerY,
                        },
                        15
                    );
                    if (hit) hitarr.push(u.id);
                });
            }

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

function calcIsInsideThickLineSegment(line1, line2, pnt, lineThickness) {
    let L2 =
        (line2.x - line1.x) * (line2.x - line1.x) +
        (line2.y - line1.y) * (line2.y - line1.y);
    if (L2 == 0) return false;
    let r =
        ((pnt.x - line1.x) * (line2.x - line1.x) +
            (pnt.y - line1.y) * (line2.y - line1.y)) /
        L2;

    //Assume line thickness is circular
    if (r < 0) {
        //Outside line1
        return (
            Math.sqrt(
                (line1.x - pnt.x) * (line1.x - pnt.x) +
                (line1.y - pnt.y) * (line1.y - pnt.y)
            ) <= lineThickness
        );
    } else if (0 <= r && r <= 1) {
        //On the line segment
        let s =
            ((line1.y - pnt.y) * (line2.x - line1.x) -
                (line1.x - pnt.x) * (line2.y - line1.y)) /
            L2;
        return Math.abs(s) * Math.sqrt(L2) <= lineThickness;
    } else {
        //Outside line2
        return (
            Math.sqrt(
                (line2.x - pnt.x) * (line2.x - pnt.x) +
                (line2.y - pnt.y) * (line2.y - pnt.y)
            ) <= lineThickness
        );
    }
}