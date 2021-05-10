const express = require('express'),
    app = express(),
    http = require('http').createServer(app),
    io = require('socket.io')(http),
    { sendMessage, genarateLocationMessage } = require('./utilis/message'),
    { addUser, removeUser, getUser, getUserInRoom } = require('./utilis/users'),
    port = process.env.PORT || 3000
app.use(express.static('public'))

io.on('connection', (socket) => {

    socket.on('join', (option, callback) => {

        const { error, user } = addUser({ id: socket.id, ...option })
        // error to add user
        if (error) {
            return callback(error)
        }
        socket.join(user.room)
        socket.emit('message', sendMessage("Admin", 'Welcome ' + user.username))
        socket.broadcast.to(user.room).emit('message', sendMessage("Admin", `${user.username} has joined the chat!`))
        callback()
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUserInRoom(user.room)
        })
    })
    socket.on('sendBack', (msg, callback) => {
        const user = getUser(socket.id)
        if (user) {

            io.to(user.room).emit('message', sendMessage(user.username, msg))
            callback('Sent!')
        }
    })

    socket.on('sendLocation', (coords, callback) => {
        const user = getUser(socket.id)
        if (user) {
            io.to(user.room).emit('locationMessage', genarateLocationMessage(user.username, `https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
            callback('location shared')
        }

    })


    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        if (user) {
            io.emit('message', sendMessage("Admin", `${user.username} has left the chat room!`))
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUserInRoom(user.room)
            })
        }
    })



})
http.listen(port, () => {
    console.log('server is running on port', port);
})