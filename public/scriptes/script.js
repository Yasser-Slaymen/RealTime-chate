 let socket;
 const messagesContainer = document.querySelector('.messagesContainer')
 const messageForm = document.querySelector('#messageform')
 const messageInput = document.querySelector('#messageInput')
 const loginForm = document.querySelector('#loginForm')
 const LoginContainer = document.querySelector('.Login-Container')
 const nameInput = document.querySelector('#nameInput')
 let time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})

//  Login bij name
loginForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const name = nameInput.value
    login(name)
    // Remove the login form and
    // show the chat message form
    // loginForm.remove()
    LoginContainer.remove()
    messageForm.classList.remove('hidden')
})

function login(name){
    socket = io()
    socket.emit('login', name)
    // Recieve Message
    socket.on('msg', (data) => {
        if (data.from != name) {
            say(data.from, data.message)
        } else {
            say('You', data.message)
        } 
    })
}

 // Send Message $ Submit Form
 messageForm.addEventListener('submit', function(event) {
    event.preventDefault()
    let message = messageInput.value;
     // I used (IF) if the field is empty , it will not be send
    if(messageInput.value) { 
        messageInput.value = "";
        // Send
        socket.emit('msg',message)
    }
   
    
})


// Outputmeessage to Dom
function say(name, message) {
    const li = document.createElement('li')
    li.classList.add('message')
    li.innerHTML = 
            `<li class="message">
                <p class="meta"><span>${name}</span></p>
                <p class="message-span"><span>${message}</span></p>
                <p class="time"><span>${time}</span></p>
            </li>`
        
    messagesContainer.appendChild(li)
    // Scroll down to last message
    messagesContainer.scrollTop = messagesContainer.scrollHeight
}












