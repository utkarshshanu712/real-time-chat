// /public/chat.js
const socket = new WebSocket("ws://localhost:3000"); // Adjust URL for deployment

socket.onmessage = function (event) {
  const message = event.data;
  const chatBox = document.getElementById("chat-box");
  chatBox.innerHTML += `<div>${message}</div>`;
};

function sendMessage() {
  const messageInput = document.getElementById("message");
  const message = messageInput.value;
  socket.send(message);
  messageInput.value = "";
}
