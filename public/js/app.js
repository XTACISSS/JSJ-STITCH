var txtLoginEmail = document.getElementById('LoginEmail');
var txtLoginPassword = document.getElementById('LoginPassword');
var txtRegisterEmail = document.getElementById('RegisterEmail');
var txtRegisterPassword = document.getElementById('RegisterPassword');
var txtRoomName = document.getElementById("room-name");
var txtJoinRoomName = document.getElementById("join-room-name");

function showResult(target = '', result = ''){
    var textArea = document.querySelector(target);
    textArea.className = 'form-control';
    textArea.value = JSON.stringify(result);
}

async function login(event){
    event.preventDefault();
    const data = {
        email:txtLoginEmail.value,
        password:txtLoginPassword.value
                };
    await fetch('http://localhost:8080/auth/login',{
        headers:{
            "Content-type":"application/json"
        },
        method:"POST",
        body:JSON.stringify(data)
    })
    .then(res => res.json())
    .then(res => showResult('#login-response',res))
    .catch((err) => console.log(err));
}
async function signin(event){
    event.preventDefault();
    const data = {
        email:txtRegisterEmailEmail.value,
        password:txtRegisterPassword.value
                };
    await fetch('http://localhost:8080/auth/register',{
        headers:{
            "Content-type":"application/json"
        },
        method:"POST",
        body:JSON.stringify(data)
    })
    .then(res => res.json())
    .then(res => showResult('#login-response',res))
    .catch((err) => console.error(err));
}

async function createRoom(event){
    event.preventDefault();
    const data = {name:txtRoomName.value};
    await fetch('http://localhost:8080/rooms/newRoom',{
        headers:{
            "Content-type":"application/json"
        },
        method:"POST",
        body:JSON.stringify(data)
    })
    .then(res => res.json())
    .then(res => showResult('#create-response',res))
    .catch((err) => console.error(err));


function joinRoom(){
    window.location = `/chat.html?name=${txtJoinRoomName}`
}
}