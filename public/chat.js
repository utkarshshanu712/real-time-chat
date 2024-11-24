let ws;
let peerConnection;
let dataChannel;
let messageBox = document.getElementById("messages");

// Connect to WebSocket server
document.getElementById("connectBtn").onclick = () => {
  let userCode = document.getElementById("code").value;
  if (userCode === "") {
    alert("Please enter a code to connect");
    return;
  }

  // Connect to the WebSocket server (use your Heroku URL here)
  ws = new WebSocket("wss://your-app-name.herokuapp.com"); // Replace with your WebSocket server URL

  ws.onopen = () => {
    console.log("Connected to WebSocket server");
    ws.send(JSON.stringify({ type: "connect", code: userCode }));
  };

  ws.onmessage = (event) => {
    const message = JSON.parse(event.data);
    if (message.type === "offer") {
      handleOffer(message.offer);
    } else if (message.type === "answer") {
      handleAnswer(message.answer);
    } else if (message.type === "candidate") {
      handleCandidate(message.candidate);
    } else if (message.type === "message") {
      showMessage(message.content);
    }
  };
};

// Handle Offer
function handleOffer(offer) {
  peerConnection = new RTCPeerConnection();
  dataChannel = peerConnection.createDataChannel("chat");
  dataChannel.onmessage = (event) => {
    showMessage(event.data);
  };

  peerConnection
    .setRemoteDescription(new RTCSessionDescription(offer))
    .then(() => peerConnection.createAnswer())
    .then((answer) => {
      return peerConnection.setLocalDescription(answer);
    })
    .then(() => {
      ws.send(
        JSON.stringify({
          type: "answer",
          answer: peerConnection.localDescription,
        })
      );
    });
}

// Handle Answer
function handleAnswer(answer) {
  peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
}

// Handle ICE Candidate
function handleCandidate(candidate) {
  peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
}

// Send message
document.getElementById("sendBtn").onclick = () => {
  let message = document.getElementById("messageInput").value;
  if (dataChannel) {
    dataChannel.send(message);
    showMessage(`You: ${message}`);
  }
};

// Show messages in the chat window
function showMessage(message) {
  messageBox.innerHTML += `<p>${message}</p>`;
  messageBox.scrollTop = messageBox.scrollHeight;
}
