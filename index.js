const express = require('express');
const WebSocket = require('ws');

const port = process.env.PORT;

const app = express();

app.use(express.static('public'));

let server = app.listen(port || 8000, () => {
    console.log(`listening on port ${port || 8000}`);
});

const WSS = new WebSocket.Server({ server });

let users = [];

WSS.on('connection', (ws, req) => {
    ws.on('open', (data) => {
        users.push(ws);
    });
    ws.on('close', (data) => {
        users.splice(users.indexOf(ws), 1);
    });
    ws.on('message', (data) => {});
});