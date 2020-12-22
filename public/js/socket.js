'use strict';

// const aws = new WebSocket('ws://192.168.1.157:8000/stat');
// const gws = new WebSocket('ws://192.168.1.157:8000/game');
// const aws = new WebSocket('wss://ksgo-c8d37.web.app/stat');
// const gws = new WebSocket('wss://ksgo-c8d37.web.app/game');
const aws = new WebSocket('wss://ksgo.herokuapp.com/stat');
const gws = new WebSocket('wss://ksgo.herokuapp.com/game');

const format = (a = '', b) => JSON.stringify({ id: a, content: b });
const parse = (a = '') => JSON.parse(a);

const gformat = (a) => a.toString(',');
const gparse = (a = '') => a.split(',');

const state = () =>
    aws.readyState === WebSocket.OPEN && gws.readyState === WebSocket.OPEN;

aws.onopen = () => {
    user = new User();
    aws.send(format('register'));
};

aws.onmessage = ({ data }) => {
    let message = parse(data);

    if (message.id === 'registered') {
        // console.log('message recieved');
        user.id = message.content.name;

        users = message.content.array
            .filter((u) => u !== user.id)
            .map((u) => {
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
    }
};

aws.onclose = () => {};

// aws.onerror = () => {};

// gws.onopen = () => {};

gws.onmessage = async({ data }) => {
    const message = JSON.parse(data);

    if (!Object.keys(message).length) return;

    // console.log(Object.keys(message).length);
    users.forEach((u) => {
        let dat = gparse(message[u.id]);

        u.dis.update(
            dat.slice(1, 4).map((x) => parseFloat(x)),
            dat.slice(4, 7).map((x) => (x === 'true' ? true : false)), [
                parseFloat(dat[7]),
                parseFloat(dat[8]),
                dat[9] === 'true' || dat[9] === undefined ? true : false,
            ], [dat[10] === 'true' ? true : false]
        );
        const hit = dat[11] ? dat[11] : ' ';
        if (hit.split(' ').some((x) => x === user.id)) {
            user.health--;
        }
    });
};

gws.onclose = () => {};

// gws.onerror = () => {};