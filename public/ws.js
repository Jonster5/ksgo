let ws;
try {
    ws = new WebSocket('ws://localhost:8000');
} catch {
    ws = new WebSocket('wss://ksgo.herokuapp.com');
}


ws.onopen = () => {
    user = new User();
};
ws.onmessage = ({ data }) => {};
ws.onerror = (error) => {
    console.error(error);
};
ws.onclose = () => {
    console.log('Connection disrupted');
};