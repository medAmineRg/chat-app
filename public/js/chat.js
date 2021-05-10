const socket = io()

// DOM
const $form = document.getElementById('form')
const $inputForm = document.querySelector('input')
const $sendMessage = document.getElementById('send-message')
const $sendLocation = document.getElementById('send-location')
const $messages = document.getElementById('messages')

// template
const messageTemplate = document.getElementById('message-template').innerHTML
const locationTemplate = document.getElementById('location-template').innerHTML
const sideBar = document.getElementById('sidebar-template').innerHTML

// scrool function logic
const autoscrool = () => {

    // grab the last messages that was sent
    const newMessage = $messages.lastElementChild

    // get the height of the new message considred the margin
    const newMessageStyles = getComputedStyle(newMessage)

    // message margin
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)

    // the message height
    const newMessageHeight = newMessage.offsetHeight + newMessageMargin

    // visible height : the amount of space you can see
    const visibleHeight = $messages.offsetHeight

    // the total height of the container
    const containerHeight = $messages.scrollHeight

    // how far we are from the bottom
    const scrollOffset = $messages.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }

}

const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })


socket.on('message', (msg) => {
    var html = Mustache.render(messageTemplate, {
        username: msg.username,
        msg: msg.text,
        createdAt: moment().format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscrool()
})

socket.on('locationMessage', (message) => {
    var html = Mustache.render(locationTemplate, {
        username: message.username,
        url: message.location,
        createdAt: moment().format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscrool()
})

socket.on('roomData', option => {
    var html = Mustache.render(sideBar, {
        room: option.room,
        users: option.users
    })
    document.getElementById('sidebar').innerHTML = ('beforeend', html)
})

$form.addEventListener('submit', (e) => {
    e.preventDefault()
    let message = $inputForm.value
    $sendMessage.setAttribute('disabled', 'disabled')
    socket.emit('sendBack', message, (msg) => {
        if (!msg) {
            return 'something went wrong'
        }
        $sendMessage.removeAttribute('disabled')
        $inputForm.focus()
        $inputForm.value = ''
    })
})

$sendLocation.addEventListener('click', () => {
    $sendLocation.setAttribute('disabled', 'disabled')
    if (!navigator.geolocation) {
        return alert('Your browser doest support gelocation')
    }
    navigator.geolocation.getCurrentPosition((location) => {
        socket.emit('sendLocation', {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude
        }, (info) => {
            if (!info) {
                return console.log('something went wrong');
            }
            $sendLocation.removeAttribute('disabled')
            console.log(info);
        })
    })
})

socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error)
        location.href = "/"
    }
})
