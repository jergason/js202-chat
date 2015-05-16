import koa from 'koa'
import body from 'koa-body'
import logger from 'koa-logger'
import cors from 'koa-cors'

import Router from 'koa-router'
import mongoose from 'mongoose'

const CONNECTION_STRING = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/js202'
const PORT = process.env.PORT || 3008

mongoose.connect(CONNECTION_STRING)

const MessageSchema = mongoose.Schema({
  room: {type: String, index: true},
  username: {type: String, index: true},
  message: String,
  date: {type: Number, default: Date.now}
}, {versionKey: false})

MessageSchema.statics.getRooms = function() {
  return this.distinct('room').exec()
}

MessageSchema.statics.findByRoom = function(room, since) {
  if (since) {
    return this.find({room, date: {$gte: since}}).exec()
  } else {
    return this.find({room}).exec()
  }
}

const Message = mongoose.model('Message', MessageSchema)

function validateBody(shape) {
  return function*(next) {
    var body = this.request.body
    if (!body) {
      this.status = 400
      this.body = {error: 'No body supplied'}
      return
    }

    for (let k in shape) {
      if (!body[k]) {
        console.log('body is', body, 'k is', k)
        this.status = 400
        this.body = {error: `Body missing required parameter ${k}`}
        return
      }
    }

    yield next
  }
}


const app = koa()
const router = Router()

function *getMessagesForRoom() {
  var room = this.params.room
  var since = this.query.since

  this.body = yield Message.findByRoom(room, since)
}

function *postMessageToRoom() {
  var room = this.params.room
  var message = this.request.body.message
  var username = this.request.body.username
  var date = this.request.body.date || Date.now()

  this.body = yield Message.create({room, message, username, date})
}

function *getRooms() {
  this.body = yield Message.getRooms()
}

function *return404() {
  this.status = 404
}

router.get('/messages/:room', getMessagesForRoom)
router.post('/messages/:room', validateBody({username: true, message: true}), postMessageToRoom)
router.get('/rooms', getRooms)
router.all('*', return404)

app.use(body())
app.use(logger())
app.use(cors())
app.use(router.routes())

export default function startApp() {
  app.listen(PORT)
}
