// chat.js

const socket = new WebSocket(
  "wss://wss://real-time-chat-b6fs.vercel.app"
); // Replace with your actual Vercel URL

const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");
const messagesContainer = document.getElementById("messagesContainer");

// Send message on button click
sendButton.addEventListener("click", () => {
  const messageText = messageInput.value.trim();
  if (messageText) {
    const messageData = {
      text: messageText, // Only the text is sent, broadcast to everyone
    };
    socket.send(JSON.stringify(messageData)); // Send the message
    messageInput.value = ""; // Clear input field
    addMessageToChat(messageData, "sent");
  }
});

// Listen for messages from the server
socket.addEventListener("message", (event) => {
  const messageData = JSON.parse(event.data);
  if (messageData.type === "system") {
    addMessageToChat(messageData, "system");
  } else {
    addMessageToChat(messageData, "received");
  }
});

// Display messages in the chat
function addMessageToChat(messageData, type) {
  const messageElement = document.createElement("div");
  messageElement.classList.add("message", type);
  messageElement.innerHTML = `
        <div class="text">${messageData.message}</div>
        <div class="timestamp">${messageData.timestamp}</div>
        <div class="status">${messageData.status}</div>
    `;
  messagesContainer.appendChild(messageElement);
  messagesContainer.scrollTop = messagesContainer.scrollHeight; // Scroll to the bottom
}
