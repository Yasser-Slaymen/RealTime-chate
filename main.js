const express = require('express')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const path = require('path')
const bodyParser = require('body-parser')
const { name } = require('ejs')
let users= {}
// const formatMessage = require('./utils/messages')
const PORT = process.env.PORT || 6000
http.listen(PORT, () =>{ console.log(`Server running on port ${PORT}`)})

// statics 
app.use(express.static(path.join(__dirname,'public')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// ejs template engine
app.set('view engine', 'ejs')
app.set('views', './views')

// app.use(logger('li'))


// render index
app.get('/', (request, response) =>{
    response.render('pages/index')
})




io.on('connection', function (socket) {

    // Every socket connection has a unique ID
    socket.on('login',function (name) {
        users[socket.id] = name;
        socket.broadcast.emit('msg',{
            from:'Coding the Curbs',
            message:`${name} has joined to chat`
        })


    })

    // Message Recieved
    socket.on('msg', (message) => {
        // Broadcast to everyone else (except the sender)
        socket.broadcast.emit('msg', {
            from: users[socket.id],
            message: message
        })
        // Send back the same message to the sender
        socket.emit('msg', {
            from: users[socket.id],
            message: message
        })
        // You could just do: io.emit('msg', ...)
        // which will send the message to all, including
        // the sender.

    })

    // Disconnected
    socket.on('disconnect', function () {
        // console.log('disconnect: ' + socket.id)
        delete users[socket.id]
        // io.emit('disconnect', socket.id)
    })


})