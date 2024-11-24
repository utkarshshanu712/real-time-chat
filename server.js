// server.js
const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const path = require("path");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Serve static files (index.html, styles.css, chat.js) from /public
app.use(express.static(path.join(__dirname, "public")));

// WebSocket connection handling
wss.on("connection", (ws) => {
  const userName = `User_${Math.floor(Math.random() * 1000)}`;

  ws.send(JSON.stringify({ type: "system", message: `Welcome ${userName}!` }));

  ws.on("message", (message) => {
    console.log(`${userName}: ${message}`);
    const messageData = JSON.parse(message);

    // Broadcast message along with the sender and delivery status
    const response = {
      userName: userName,
      message: messageData.text,
      status: "sent", // initially sent, can be updated later
      timestamp: new Date().toLocaleTimeString(),
    };

    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(response));
      }
    });
  });

  ws.on("close", () => {
    console.log(`${userName} disconnected`);
  });
});

// Serve the index.html file on the root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start the server
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
