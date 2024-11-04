let socket;

function initializeWebSocket() {
  socket = new WebSocket("ws://localhost:8080/ws");

  socket.onopen = () => {
    console.log("WebSocket connection established");
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);

    if (data.type === "draw" && data.x !== undefined && data.y !== undefined) {
      document.dispatchEvent(new CustomEvent("receiveDrawingData", { detail: data }));
    }
  };

  socket.onclose = () => console.log("WebSocket connection closed");
}

function sendDrawingData(prevX, prevY, x, y) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ type: "draw", prevX, prevY, x, y }));
  }
}

export { initializeWebSocket, sendDrawingData };
