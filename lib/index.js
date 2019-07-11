const axios = require('axios')
const io = require('socket.io-client')

class Pushfry {
  constructor (key, secret) {
    this.key = key
    this.secret = secret
    this.socket = {}
    this.listenQueue = []
    this.emitQueue = []
    this.init()
  }
  init () {
    axios.post('http://localhost:8503/auth', { key: this.key, secret: this.secret })
      .then(response => {
        const { data: token } = response
        const socket = io(`http://localhost:8503/${this.key}`, {
          transports: ['websocket'],
          query: { token }
        })
        socket.once('connect', () => {
          this.socket = socket
          this.listenQueue.forEach(listen => {
            this.listener(listen)
          })
          this.emitQueue.forEach(emit => {
            this.emitter(emit)
          })
        })
        socket.once('error', error => console.error(error))
      }).catch(error => console.error(error.response.data.message))
  }
  listener (listen) {
    const { channel, callback } = listen
    this.socket.on(channel, callback)
  }
  emitter (emit) {
    this.socket.emit('emit', emit)
  }
  on (channel, callback) {
    if (this.socket.connected) this.listener({ channel, callback })
    else this.listenQueue.push({ channel, callback })
  }
  emit (channel, data) {
    if (this.socket.connected) this.emitter({ channel, data })
    else this.emitQueue.push({ channel, data })
  }
}

module.exports = Pushfry
