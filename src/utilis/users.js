const users = []

const addUser = ({ id, username, room }) => {

    // check for data
    if (!username || !room) {
        return {
            error: 'Username and Room must be required!'
        }
    }

    // check if the user exist
    const existUser = users.find(user => {
        return user.room === room && user.username === username
    })

    if (existUser) {
        return {
            error: 'The username you entred already taken!'
        }
    }
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()
    users.push({ id, username, room })
    const user = {
        id,
        username,
        room
    }
    return {
        user
    }
}

const removeUser = (id) => {

    // searching for the user index
    const index = users.findIndex(user => id === user.id)
    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}

const getUser = (id) => {
    return users.find(user => user.id === id)
}

const getUserInRoom = (room) => {
    room = room.trim().toLowerCase()
    return users.filter(user => user.room === room)
}

// console.log(addUser({ id: 33, username: "amine", room: "agadir" }))

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUserInRoom
}
