const axios = require('axios')
const io = require('socket.io-client')

const pushfry = {
  socket: {},
  isAuth: false,
  listenQueue: [],
  emitQueue: [],
  listener (listen) {
    const { channel, callback } = listen
    this.socket.on(channel, callback)
  },
  emitter (emit) {
    this.socket.emit('emit', emit)
  },
  init (apiKey) {
    axios.post('http://localhost:8080/auth', { apiKey })
      .then(response => {
        const { data: token } = response
        const socket = io(`http://localhost:8080/${apiKey}`, {
          transports: ['websocket'],
          query: { token }
        })
        socket.on('connect', () => {
          this.socket = socket
          this.listenQueue.forEach(listen => {
            this.listener(listen)
          })
          this.emitQueue.forEach(emit => {
            this.emitter(emit)
          })
        })
      }).catch(() => {})
  },
  on (channel, callback) {
    if (this.socket.connected) this.listener({ channel, callback })
    else this.listenQueue.push({ channel, callback })
  },
  emit (channel, data) {
    if (this.socket.connected) this.emitter({ channel, data })
    else this.emitQueue.push({ channel, data })
  }
}

module.exports = pushfry