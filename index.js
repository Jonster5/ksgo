// modules

const http = require('http');
const static = require('node-static');
const WebSocket = require('ws');
const url = require('url');

// game stuff

let users = [];

let upos = new Object();

function Update() {
    WSS.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(upos));
        }
    });
}

setInterval(Update, 16);

// server stuff

const port = process.env.PORT;

const file = new static.Server('./public', {
    'cache-control': 'no-store',
});

const server = http.createServer((req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate'); // HTTP 1.1.
    res.setHeader('Pragma', 'no-cache'); // HTTP 1.0.
    res.setHeader('Expires', '0'); // Proxies.
    req.addListener('end', () => {
        file.serve(req, res);
    }).resume();
});

const AWSS = new WebSocket.Server({ noServer: true });
const WSS = new WebSocket.Server({ noServer: true });

const format = (a = '', b) => JSON.stringify({ id: a, content: b });
const parse = (a = '') => JSON.parse(a);

AWSS.on('connection', (ws, req) => {
    ws.on('close', () => {
        let disc = users.find((u) => u.socket === ws);

        AWSS.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(format('remuser', disc.id));
            }
        });

        delete upos[disc.id];
        users.splice(users.indexOf(disc), 1);

        console.clear();
        users.forEach((u) => {
            console.log(u.id);
        });
    });

    ws.on('message', (data) => {
        let message = parse(data);

        if (message.id === 'register') {
            let client = new Object();

            do {
                client.id = Math.floor(Math.random() * 10000);
            } while (
                users.some((u) => parseInt(u.id.split('_')[1]) === client.id)
            );

            client.id = `client_${client.id}`;
            client.socket = ws;

            users.push(client);

            ws.send(
                format('registered', {
                    name: client.id,
                    array: users.map((u) => u.id),
                })
            );

            AWSS.clients.forEach((c) => {
                if (c !== ws && c.readyState === WebSocket.OPEN) {
                    c.send(format('newuser', client.id));
                }
            });

            console.clear();
            users.forEach((u) => {
                console.log(u.id);
            });
        }
    });
});

WSS.on('connection', (ws, req) => {
    ws.on('message', (data) => {
        let id = data.split(',')[0];

        upos[id] = data;
        delete upos[''];
    });
    ws.on('close', (data) => {});
});

server.on('upgrade', (req, soc, head) => {
    const pathname = url.parse(req.url).pathname;

    if (pathname === '/stat') {
        AWSS.handleUpgrade(req, soc, head, (ws) => {
            AWSS.emit('connection', ws, req);
        });
    } else if (pathname === '/game') {
        WSS.handleUpgrade(req, soc, head, (ws) => {
            WSS.emit('connection', ws, req);
        });
    } else {
        soc.destroy();
    }
});

// WSS.on('connection', (ws, req) => {
//     ws.on('open', (data) => {
//         // users.push(ws);
//     });
//     ws.on('close', () => {
//         WSS.clients.forEach((client) => {
//             if (client.readyState === WebSocket.OPEN) {
//                 client.send(
//                     format('remuser', users.find((u) => u.socket === ws).id)
//                 );
//             }
//         });
//         delete upos[users.find((u) => u.socket === ws).id];
//         users.splice(users.findIndex((u) => u.socket === ws));
//         // console.clear();
//         // console.log(users.map((u) => u.id));
//     });
//     ws.on('message', (data) => {
//         let message = parse(data);

//         if (message.id === 'action') {
//             let args = message.content.slice(1);
//             try {
//                 actions[message.content[0]](ws, req, ...args);
//             } catch (err) {
//                 console.log(err);
//             }
//         } else if (message.id === 'register') {
//
//         } else if (message.id === 'u_up') {
//             upos[message.content.id] = message.content;
//             delete upos[''];
//         }
//     });
// });

server.listen(port || 8000, () => {
    console.clear();
    console.log(`listening on port ${port || 8000}`);
});