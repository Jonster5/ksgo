'use strict';

const ws = new WebSocket('wss://ksgo.herokuapp.com');
// const ws = new WebSocket('ws://192.168.1.157:8000');

const format = (name = '', data = []) => {
    return JSON.stringify({
        id: name,
        content: data.toLocaleString(),
    });
};
const parse = (message = '') => {
    const t = JSON.parse(message);
    t.content = t.content.split(',');

    t.content[1] = Number(t.content[1]);
    t.content[2] = Number(t.content[2]);
    t.content[3] = Number(t.content[3]);

    t.content[4] = Boolean(t.content[4]);
    t.content[5] = Boolean(t.content[5]);
    t.content[6] = Boolean(t.content[6]);

    t.content[7] = Number(t.content[7]);
    t.content[8] = Number(t.content[8]);

    t.content[9] = Boolean(t.content[9]);

    return t;
};

ws.onopen = () => {
    user = new User();
    ws.send(format('register'));
};

ws.onmessage = ({ data }) => {
    let message = parse(data);

    if (message.id === 'registered') {
        user.id = message.content.name;
        let temp = message.content.array.filter((u) => u !== user.id);
        users = temp.map((u) => {
            return {
                id: u,
                dis: new Remote(u),
            };
        });
        document.title = `KSGO - ${user.id}`;
    } else if (message.id === 'newuser') {
        users.push({
            id: message.content,
            dis: new Remote(message.content),
        });
    } else if (message.id === 'remuser') {
        stage.remove(users.find((u) => u.id === message.content).dis.sprite);
        users.splice(
            users.findIndex((u) => u.id === message.content),
            1
        );
    } else if (message.id === 'u_up') {
        users.forEach((u) => {
            try {
                u.dis.update(...message.content[u.id].pos);
                u.dis.energy = message.content[u.id].energy;
                u.dis.health = message.content[u.id].health;
                u.dis.alive = message.content[u.id].alive;
            } catch (err) {
                // console.error(err);
            }
        });
    }
};

ws.onerror = (error) => {
    console.error(error);
};

ws.onclose = () => {};