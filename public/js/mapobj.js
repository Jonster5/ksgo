'use strict';
class Star {
    constructor() {
        this.sprite = Pebble.Circle(
            50,
            'yellow',
            'none',
            0,
            canvas.width / 2,
            canvas.height / 2
        );

        stage.add(this.sprite);
    }
}