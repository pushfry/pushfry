const axios = require('axios')
const io = require('socket.io-client')

const pushfry = {
  socket: {},
  endpoint: 'https://socket.pushfry.com',
  roomQueue: [],
  listenQueue: [],
  emitQueue: [],
  validate (params) {
    function rules (value) {
      return {
        channel: {
          allow: typeof value === 'string',
          message: 'Channel name must be a string'
        },
        callback: {
          allow: typeof value === 'function',
          message: 'Listen callback must be a function'
        },
        room: {
          allow: typeof value === 'string',
          message: 'Room name must be a string'
        }
      }
    }
    Object.entries(params).forEach(param => {
      const [key, value] = param
      const validation = rules(value)[key]
      if (!validation.allow) throw Error(validation.message)
    })
  },
  init (key, secret) {
    axios.post(`${this.endpoint}/auth`, { key, secret })
      .then(response => {
        const { data: token } = response
        this.socket = io(`${this.endpoint}/${key}`, {
          transports: ['websocket'],
          query: { token }
        })
        this.socket.once('connect', () => {
          this.joiner()
          this.listener()
          this.emitter()
        })
        this.socket.once('error', error => { throw new Error(error.message) })
      }).catch(error => { throw new Error(error.response.data.message) })
  },
  listener () {
    this.listenQueue.forEach((listen, key) => {
      const { channel, callback } = listen
      this.socket.on(channel, callback)
      delete this.listenQueue[key]
    })
  },
  emitter () {
    this.emitQueue.forEach((emit, key) => {
      const { room, channel, data } = emit
      this.socket.emit('emit', { room, channel, data })
      delete this.emitQueue[key]
    })
  },
  joiner () {
    this.roomQueue.forEach((room, key) => {
      this.socket.emit('join', room)
      delete this.roomQueue[key]
    })
  }
}

class Pushfry {
  constructor (key, secret) {
    pushfry.init(key, secret)
  }
  join (room) {
    pushfry.validate({ room })
    pushfry.roomQueue.push(room)
    if (pushfry.socket.connected) pushfry.joiner()
    return {
      on (channel, callback) {
        pushfry.validate({ channel, callback })
        pushfry.listenQueue.push({ channel, callback })
        if (pushfry.socket.connected) pushfry.listener()
      },
      emit (channel, data) {
        pushfry.validate({ channel })
        pushfry.emitQueue.push({ room, channel, data })
        if (pushfry.socket.connected) pushfry.emitter()
      }
    }
  }
}

module.exports = Pushfry
