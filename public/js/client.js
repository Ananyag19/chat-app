const socket = io('http://localhost:8000');
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container");
const audio = new Audio('ting.mp3');

// Append function to display messages
const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message', position);
    messageContainer.append(messageElement);
    if (position === 'left') {
        audio.play();
    }
};

// Prompt user for name
const name = prompt("Enter your name");
if (name) {
    socket.emit('new-user-joined', name);
}

// Send message
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value.trim();
    if (message !== "") {
        append(`You: ${message}`, 'right');
        socket.emit('send', message);
        messageInput.value = '';
    }
});

// Listeners
socket.on('user-joined', name => {
    append(`${name} joined the chat`, 'right');
});

socket.on('receive', data => {
    append(`${data.name}: ${data.message}`, 'left');
});

socket.on('left', name => {
    append(`${name} left the chat`, 'right');
});
