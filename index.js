'use strict';
const express = require('express');
const WebSocket = require('ws');

const port = process.env.PORT;

const app = express();

app.use(express.static('public'));

let server = app.listen(port || 8000, () => {
    console.log(`listening on port ${port || 8000}`);
});

const WSS = new WebSocket.Server({ server });

const format = (name = '', data) => JSON.stringify({ id: name, content: data });
const parse = (message = '') => JSON.parse(message);

let users = [];

let actions = {
    log: (ws, req) => console.log(users),
};

WSS.on('connection', (ws, req) => {
    ws.on('open', (data) => {
        // users.push(ws);
    });
    ws.on('close', (data) => {
        // console.log(`shot ${users.find((u) => u.socket === ws).id}`);
        users.splice(users.findIndex((u) => u.socket === ws));
        WSS.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(
                    format(
                        'userarray',
                        users.map((i) => i.id)
                    )
                );
            }
        });

        console.clear();
        console.log(users.map((u) => u.id));
    });
    ws.on('message', (data) => {
        let message = parse(data);

        if (message.id === 'action') {
            let args = message.content.slice(1);
            try {
                actions[message.content[0]](ws, req, ...args);
            } catch (err) {
                console.log(err);
            }
        } else if (message.id === 'register') {
            let client = new Object();

            let hash = Math.floor(Math.random() * 1000);

            users.forEach((user) => {
                if (user.id === `${hash}`)
                    hash += Math.floor(Math.random() * 13);
            });

            client.id = `client_${hash}`;
            client.socket = ws;

            users.push(client);

            ws.send(
                format('registered', {
                    name: client.id,
                    array: users.map((u) => u.id),
                })
            );

            WSS.clients.forEach((c) => {
                if (c !== ws && c.readyState === WebSocket.OPEN) {
                    c.send(format('newuser', client.id));
                }
            });

            console.clear();
            console.log(users.map((u) => u.id));
        } else if (message.id === 'u_up') {
            WSS.clients.forEach((client) => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(format('u_up', message.content));
                }
            });
        }
    });
});