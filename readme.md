# Pushfry
Build Lightning Fast Realtime Applications

#### Installation
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

#### Usage
##### Emit
```js
pushfry.emit('your_channel_name', 'Hello world')
```

##### Listen
```js
pushfry.on('your_channel_name', data => {
  // Handle data
})
```