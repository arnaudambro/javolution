---
title: React Native Notifications with Server-Sent Events
date: '2019-11-29'
spoiler: Why ? What ? Wait.. what are you talking about ? And why ?
cover: ./sse.png
cta: 'JavaScript'
tags: 'JavaScript'
---

![Push notifications bells dancing with badges](./sse.png)

_1. Why ? What ? Wait.. what are you talking about ? And why ?_<br/>
_2. Setting-up Server-Sent Events on a Express Node.js server_<br/>
_3. Listening to Server-Sent Events in a React Native App_<br/>

## 1. Why ? What ? Wait.. what are you talking about ? And why ?
I wanted some notifications for my React Native app, but I thought Push Notifications looked very complicated to setup, with no clear method to explain how to do, deprecated libraries, etc. _(now it is clearer for me because [I spent a lot of time digging the subject](https://medium.com/swlh/rn-push-notifications-a-complete-guide-front-back-8c238fc81d28), but... anyway)_

So I was quite depressed, because I built a chat in my app, and a chat without Push Notifications is not a chat.

A chat without Push Notifications is not a chat ? Really ?

Then I realised something : did I really need Push Notifications ? Personally, I don't like them at all. For myself, I turn them off on all the chat apps I have (Messenger, WhatsApp, whatever), for my mails, etc. I keep them only for my SMS, because I receive SMS only for my wife, and for the sake of my marriage, better to keep Push Notifications for my wifey…

So I changed the specifications for my app : what I wanted wasn't Push Notifications strictly speaking. What I wanted was:

* when my app is in background, nothing to happen — as this is the field for Push Notifications.
* when my app is turning from background to foreground, or when it's openend from scratch, to show the new messages as some kind of notifications. That's easy, that's just a GET from my server : problem solved even before having it.
* when my app is in foreground, get the new messages from the other users when there are some. It means, technically speaking : **I need the app to listen to a server, and this server to send data when needed.**

That's what I dig up on my friend Google, and I discovered the magic thing : **Server-Sent Events**, also called SSE. I call them so much SSE that I forgot the meaning of the words, and I often call the technology Server-Side Events, but anyway.

And guess what : it took me 2 to 3 hours to set this up in my app, time including the Google search, the coding part, the failing of the coding part and the final success of it, where Push Notifications took me at least 15 hours.

So let's do it.

## 2. Setting-up Server-Sent Events on a Express Node.js server

Well, there is no better explanation than putting a piece of code there, with comments.

Just to give you the context: my Node.js app is built with Express 4.16.4.

```jsx
const { getUserId } = require('../handlers/getUserId');
const SSE_RESPONSE_HEADER = {
  'Connection': 'keep-alive',
  'Content-Type': 'text/event-stream',
  'Cache-Control': 'no-cache',
  'X-Accel-Buffering': 'no'
};

// We can't store our streams in database as they are response objects
// with javascript functions included
global.usersStreams = {}

exports.setupStream = (req, res, next) => {
  let userId = getUserId(req);
  if (!userId) {
    next({ message: 'stream.no-user' })
    return;
  }
  // Store this connection
  global.usersStreams[userId] = {
    res,
    lastInteraction: null,
  }
  // Writes response header
  res.writeHead(200, SSE_RESPONSE_HEADER);
  // Note: Heatbeat for avoidance of client's request timeout
  // of first time (30 sec, can be fine tuned)
  res.write(`data: ${JSON.stringify({type: 'heartbeat' })}\n\n`);
  global.usersStreams[userId].lastInteraction = Date.now()
  // Interval loop
  const maxInterval = 55000;
  const interval = 3000;
  let intervalId = setInterval(function() {
    const userStream = global.usersStreams[userId]
    if (userStream!) return;
    if (Date.now() - userStream.lastInteraction < maxInterval) return;
    res.write(`data: ${JSON.stringify({type: 'heartbeat'})}\n\n`);
    userStream.lastInteraction = Date.now()
  }, interval);

  function cleanConnection() {
    let userId = getUserId(req);
    clearInterval(intervalId);
    delete global.usersStreams[userId];
  }
  req.on("close", cleanConnection);
  req.on("end", cleanConnection);
};

exports.sendStream = async (userId, data) => {
  if (!userId) return;
  if (!global.usersStreams[userId]) return;
  if (!data) return;
  const { res } = global.usersStreams[userId];
  res.write(`data: ${JSON.stringify(data)}\n\n`);
  global.usersStreams[userId].lastInteraction = Date.now();
};
```
The code above is working well, and [is not so bad if I refer to some experts](https://stackoverflow.com/a/58823176/5225096), but I am sure it should be improved, I am curious about what you have to say about that.

So let's sum-up the important things:

- A `keep-alive` connection needs to be stimulated to be kept alive. Some blogs post can be found on the subject to know how often it should be stimulated, and it seems that for Node.js the connection closes after 2 minutes timeout. I didn't find something precise about that, but I put a 55 seconds timeout (`maxInterval` in the code) and it's working.

- Take care that what you need to store is the `response`, not the `request`. So that you can use `response.write `. Not `request.write`.

- A `response` object can't be stored in a database, because it can't be serialized an re-inflated, so it needs to be stored in a variable. No need of the `global` variable if you don't use it within other files.

Now coming the the content of the stream ( `===` what you send) to be written, it took me some time to understand how to structure it. That's why you only see **`res.write('data:`**` some bullshit`**`\n\n`**`')` because I wrote the code a month ago, and I didn't figure out yet how to make things properly. Now that I write this article, I wanted to unravel the mystery. So I looked up a little bit more, and I did find the trick !

So here is what I learned, and [what the specifications says](https://www.w3.org/TR/2009/WD-eventsource-20090421/#the-eventsource-interface):

```jsx
res.write('id: 12345\n')
res.write(':lines starting with : are comments and will be ignored')
res.write('event: message\n')
res.write('retry: 5000\n')
res.write(`data: ${JSON.stringify(anyDataObject)}\n\n`)
```

- as `Content-Type: text/event-stream` is telling us, our stream is text only. which also mean it can be a stringified JSON. So let's call the text we are sending : the TEXT, so that we actually do `res.write(TEXT)`

- a `response` wait to see the `\n\n` to know that the content has finished to be written, and it can be sent.

- multiple TEXTs can be sent in one time : they need to be split up by `\n`

- lines starting with `:` will be considered as a comment and will be omitted.

- if a line doesn't start with `:` but contains in the middle, then it should be interpreted as a field/value line, with only four available fields

**Event:** The event’s type. It will allow you to use the same stream for different contents. A client can decide to “listen” only to one type of event or to interpret differently each event type.

**Data:** The data field for the message. You can put consecutive “data” lines.

**ID:** ID for each event-stream. Useful to track lost messages.

**Retry:** That's a field that I wouldn't use yet because I don't understand exactly why I would need it, but for your information [I found this explanation](https://apifriends.com/api-streaming/server-sent-events/):

>The time to use before the browser attempts a new connection after all connections are lost (in milliseconds). The reconnection process is automatic and is set by default at 3 seconds. During this reconnection process, the last ID received will be automatically sent to the server … … something you would need to code by yourself with Websockets or Long-polling.

That's it for the the back-end side. Quite easy right ?

## 3. Listening to Server-Sent Events in a React Native App

This part is also quite easy: we need to setup an [EventSource](https://developer.mozilla.org/en-US/docs/Web/API/EventSource). I saw the [`react-native-event-source`](https://github.com/jordanbyron/react-native-event-source) lib doing this job for React Native (it's actually JS only, so it could also be used outside React Native), but it didn't work in my code, I don't know why. So what I did was brutally copy paste the [`RNEventSource` class code](https://github.com/jordanbyron/react-native-event-source/blob/master/index.js) in my code, and also the [`EventSource` polyfill](https://github.com/jordanbyron/react-native-event-source/blob/master/EventSource.js) going along : then it worked like a charm in my code.

So here it is !

```jsx
import React from 'react';
import { AppState } from 'react-native';
import { BACKEND } from '../api';
import RNEventSource from '../event-source';

class Notifications extends React.Component {
  state = {
    appState: AppState.currentState,
  };
  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
    this.startStream();
  }
  _handleAppStateChange = async nextAppState => {
    const { appState } = this.state;
    const inactive = /inactive|background/;
    const active = /active/;
    if (appState.match(inactive) && nextAppState.match(active)) {
      this.startStream();
    }
    if (appState.match(active) && nextAppState.match(inactive)) {
      this.endStream();
    }
    this.setState({ appState: nextAppState });
  };
  requestStreamWithBackend = userId => {
    return new RNEventSource(`${BACKEND}/stream/${userId}`);
  }

  startStream = () => {
    if (this.streamStarted) return;
    try {
      const { userId, catchServerSideEventRequested } = this.props;
      this.eventSource = this.requestStreamWithBackend(userId);
      this.eventSource.addEventListener('message', message => {
        catchServerSideEventRequested(message);
      });
      this.streamStarted = true;
    } catch (e) {
      console.log('startstream error', e);
    }
  };
  endStream = () => {
    if (!this.eventSource) return;
    this.eventSource.removeAllListeners();
    this.eventSource.close();
    this.streamStarted = false;
  };
  componentWillUnmount() {
    this.endStream();
  }
  render() {
    return null;
  }
}

export default Notifications;
```

Looking at this code, you might think : why did I use a React Component if I render null all the time ?

Well,
1. First, I setup `redux` and `redux-saga` in my App, but I am not so comfortable with the `channel` setup of `redux-saga` , which is something I would need to make this work.
2. Second is that the `React.Component` lifecycle is actually great to handle the open/restart/close cycle of the stream : easy to write, easy to understand… perfect for me.
3. And third : I actually ended up displaying the notifications in my App, that's what I render in my final code…

Anyway, there is nothing hard to understand there.

But there is ONE thing that I took soooo much time to understand: the relationship between `res.write('event: an-event-type\n')` and `this.eventSource.addEventListener('message', ...)` . Everytime I set an event in my back-end — like `chat-message` or `test` or `prout` (which is a word I often use when it comes to testing something) - I saw nothing in my front-end. Until [I dig in the EventSource polyfill](https://github.com/jordanbyron/react-native-event-source/blob/98b8730621f4ffeca865354ed7d2d22a8795a6bd/EventSource.js#L108) and found:
```jsx
eventsource.dispatchEvent(eventType || 'message', event);
```

It means that to receive streams with `res.write('event: chat-message\n')`, you need to setup `this.eventSource.addEventListener('chat-message', ...)`.

It may sounds stupid when you here it know — it does to me, but I can tell you : I spent hours trying to understand if the error was coming from the back-end, or from the front-end, or whatever…

## Conclusion
That's it for this article, I think it's quite straight forward, but tell me if I can change it to make it better.

One last thing, coming back to the comparison with the Push Notifications : what we just set-up in our app **_is_** a Push Notifications system, but only when the app is in the foreground. And the Push Notifications system handled by Apple for iOS or Google for Android may not be using SSE strictly, but I guess it is a technology following the same principle : **any push notification needs a server sends to send a stream to a software which is listening to the server.** For Apple/Google Push Notifications, it is Apple/Google server sending the notification through a certain _(unknown to me)_ method to iOS/Android software, listening to their server. For our Local Notification, it is us sending the notification through Server-Sent Events to our app software.

Sur ce, ladys and gentlemen, Mesdames et Messieurs, cheers !

🍻

References

- https://gist.github.com/akirattii/257d7efc8430c7e3fd0b4ec60fc7a768#file-sse-serverside-example-js

- [Stream Updates with Server-Sent Events - HTML5 Rocks](https://www.html5rocks.com/en/tutorials/eventsource/basics/)

- [Server-Sent Events explained with usecases - apifriends.com](https://apifriends.com/api-streaming/server-sent-events/)

- [Server-Sent Events With Node - jasonbutz.info](https://jasonbutz.info/2018/08/server-sent-events-with-node/)

- [EventSource - developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/API/EventSource)

- [jordanbyron/react-native-event-source - github.com](https://github.com/jordanbyron/react-native-event-source)

- [Server-Sent Events - www.w3.org](https://www.w3.org/TR/2009/WD-eventsource-20090421/)
