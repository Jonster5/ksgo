'use strict';

// const ws = new WebSocket('wss://ksgo.herokuapp.com');
const ws = new WebSocket('ws://localhost:8000');

const format = (name = '', data) => JSON.stringify({ id: name, content: data });
const parse = (message = '') => JSON.parse(message);

ws.onopen = () => {
    user = new User();
    ws.send(format('register'));
};
ws.onmessage = ({ data }) => {
    let message = parse(data);

    if (message.id === 'registered') {
        user.id = message.content;
        document.title = `KSGO - ${user.id}`;
    } else if (message.id === 'userarray') {
        users = message.content
            .filter((u) => u !== user.id)
            .map((u) => {
                return {
                    id: u,
                    dis: null,
                };
            });
        console.log(users);
    }
};
ws.onerror = (error) => {
    console.error(error);
};
ws.onclose = () => {
    ws.send(format('unregister', user.id));
};