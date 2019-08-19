<h1 align="center">Pushfry</h1>
<p align="center">Build Lightning Fast Realtime Applications</p>

<p align="center"><a href="https://vuejs.org"><img width="150" src="https://i.imgur.com/ao99MmS.png"></a></p>
<p align="center">
  <a href="https://github.com/pushfry/pushfry"><img src="https://badgen.net/github/open-issues/pushfry/pushfry"></a>
  <a href="https://www.npmjs.com/package/pushfry"><img src="https://badgen.net/npm/license/pushfry"></a>
  <a href="https://www.npmjs.com/package/pushfry"><img src="https://badgen.net/npm/v/pushfry"></a>
  <a href="https://www.npmjs.com/package/pushfry"><img src="https://badgen.net/npm/dt/pushfry"></a>
  <a href="https://twitter.com/pushfry"><img src="https://badgen.net/twitter/follow/pushfry"></a>
</p>

### Installation
```$ npm i pushfry```

### Initialization
#### Client
```js
const Pushfry = require('pushfry')
const pushfry = new Pushfry('YOUR_API_KEY')
```
Because of the security reason, please don't add your `SECRET_KEY` when initializing pushfry in client. You just have to initialize with `API_KEY`. And make sure you set the initializing `origin` properly from [Pushfry developer console](https://pushfry.com/console).

#### Server
```js
const Pushfry = require('pushfry')
const pushfry = new Pushfry('YOUR_API_KEY', 'YOUR_SECRET_KEY')
```

### Usage
#### Join
```js
const room = pushfry.join('room_name')
```

#### Emit
```js
room.emit('your_channel_name', 'Hello world')
```

#### Listen
```js
room.on('your_channel_name', data => {
  // Handle data
})
```