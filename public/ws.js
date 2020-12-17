const ws = new WebSocket('ws://localhost:8000');
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