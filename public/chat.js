// /public/chat.js
const socket = new WebSocket(
  "wss://real-time-chat-foa3ez6rv-utkarshshanu712s-projects.vercel.app"
);
 // Adjust URL for deployment

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
