const WebSocket = require("ws");
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

// Serve static files (like frontend HTML, CSS, JS)
app.use(express.static("public"));

// WebSocket server to manage signaling
const wss = new WebSocket.Server({ noServer: true });

wss.on("connection", (ws) => {
  console.log("User connected");

  // Relay messages between connected users
  ws.on("message", (message) => {
    console.log("Received: " + message);
    ws.send(message); // Echo the message to the other user
  });

  ws.on("close", () => {
    console.log("User disconnected");
  });
});

// Handle WebSocket connection upgrade
app.server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

app.server.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request);
  });
});
