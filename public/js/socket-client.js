var roomName = new URLSearchParams(window.location.search).get("name");
var socket = io();

function sendMessage(event){
  event.preventDefault()
  var body = document.getElementById('message').value
  var message = {from:socket.id,body}
  this.socket.emit('newMessage',message)
}

window.onload = () => {
  socket.on("connect", (client) => {
    var status = document.getElementById("connection-status");
    status.className = "text-success";
    status.innerText = "Connected";
    const testUser = {username:'Test'}
    socket.emit("joinRoom", testUser,roomName, (res) => {
      console.log(res);
    });
    socket.on('newMessage',(message) => {})
  });
  
  socket.on("disconnect", () => {
    var status = document.getElementById("connection-status");
    status.className = "text-danger";
    status.innerText = "Disconnected";
  });
}
