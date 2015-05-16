# js202-chat

This is a simple chat server used in the js202 class I teach about JSON and AJAX.


## API


* `GET /rooms` - Get an array of room names.

  ```JavaScript
  $.getJSON('/rooms', function(data) {
    console.log(data) // ['foo', 'bar', 'baz', 'qux']
  })
  ```

* `GET /messages/:room?since=[Date]` - get all messages for a room, newest firt.
  `since` is  an optional query param that lets you limit the results to messages
  newer than some timestamp.

  A message looks like this:

  ```JavaScript
  {
    username: 'some name',
    room: 'some room',
    message: 'the text content of the message',
    date: 1431722323447 // timestamp in milliseconds since january 1 1970
  }
  ```


  ```JavaScript
  var tenMinutesAgo = Date.now() - (1000 * 60 * 10)
  $.getJSON(`/rooms/foobar?since=${tenMinutesAgo}`, function(data) {
    console.log(data)
  })
  ```

* `POST /messages/:room` - post a message to a room. Returns the posted message.
  `date` is set by the server, `room` is inferred by the server from the url
  `POST`ed to.

  ```JavaScript
  var message = {
    username: 'Jane Austen',
    message: 'Silly things do cease to be silly if they are done by sensible people in an impudent way.'
  }
  $.post('/messages/foobar', message, function(data) {
    console.log(data) // { usernname: 'Jane Austen', message: '...', date: 1431722323447, room: 'foobar', _id: 'some id'}
  })
  ```
