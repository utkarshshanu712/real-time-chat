const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const path = require("path");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Store connected clients by their unique ID
const clients = {};

app.use(express.static(path.join(__dirname, "public")));

wss.on("connection", (ws) => {
  // Generate a unique user ID for each client
  const userId = `User_${Math.floor(Math.random() * 10000)}`;
  clients[userId] = ws;

  // Send a welcome message
  ws.send(JSON.stringify({ type: "system", message: `Welcome ${userId}!` }));

  // Handle incoming messages
  ws.on("message", (message) => {
    const messageData = JSON.parse(message);

    // Broadcast message to all users
    Object.keys(clients).forEach((clientId) => {
      if (clientId !== userId) {
        // Don't send the message back to the sender
        const response = {
          senderId: userId,
          message: messageData.text,
          status: "sent",
          timestamp: new Date().toLocaleTimeString(),
        };
        clients[clientId].send(JSON.stringify(response));
      }
    });
  });

  // Clean up when the user disconnects
  ws.on("close", () => {
    delete clients[userId];
  });
});

// Serve static files
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start the server
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
