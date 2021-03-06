const socket = io();

var userName = '';
const loginForm = document.getElementById('welcome-form');
const messagesSection = document.getElementById('messages-section');
const messagesList = document.getElementById('messages-list');
const addMessageForm = document.getElementById('add-messages-form');
const userNameInput = document.getElementById('username');
const messageContentInput = document.getElementById('message-content');

socket.on('message', ({ author, content }) => addMessage(author, content))

addMessage = (author, content) => {
  const message = document.createElement('ul');
  message.classList.add('message');
  message.classList.add('message--received')

  if(author === userName) message.classList.add('message--self');
  
  message.innerHTML = `
    <h3 class="message__author">${userName === author ? 'You' : author }</h3>
    <div class="message__content">
    ${author === "Chat Bot" ? `<i>${content}</>` : content}  
    </div>
  `;
  messagesList.appendChild(message);
};

sendMessage = (e) => {
  e.preventDefault();

  if(messageContentInput.value) {
    addMessage(userName, messageContentInput.value);
    socket.emit('message', { author: userName, content: messageContentInput.value });
    addMessageForm.reset();
  }
  else {
    alert('Input cannot be left blank!')
  }

};

addMessageForm.addEventListener('submit', sendMessage);

login = (e) => {
  e.preventDefault();
  if(userNameInput.value) {
    userName = userNameInput.value

    loginForm.classList.remove('show');
    messagesSection.classList.add('show');
    socket.emit('login', { name: userName });
  }
  else {
    alert('You can\'t leave the login input empty!');
  };
};

loginForm.addEventListener('submit', login);
