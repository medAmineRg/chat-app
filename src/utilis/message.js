const sendMessage = (username, text) => {
    return {
        username,
        text,
        createdAt: new Date().getTime()
    }
}

const genarateLocationMessage = (username, location) => {
    return {
        username,
        location,
        createdAt: new Date().getTime()
    }
}

module.exports = {
    sendMessage,
    genarateLocationMessage
}