var express = require('express');
var app = express();
app.set('view engine', 'ejs');
var OpenTok = require('opentok'),
    opentok = new OpenTok(process.env.api_key, process.env.api_secret ); 

var room_session = {};

app.get('/', function(req, res){
  res.render('index');
});

app.get('/room/:rmname', function(req, res){
  res.render('chatroom', {rmname: req.params.rmname});
});

// app to insert videochat
app.get('/videochat/:rmname', function(req, res){
  if (typeof room_session[req.params.rmname] === "string" && room_session[req.params.rmname] !== ""){
    var session_id = room_session[req.params.rmname];
    var TK = opentok.generateToken(session_id);
    res.send({api_key: process.env.api_key, session_id: session_id, token: TK});
  }
  else {
    opentok.createSession(function(err, session) {
      if (err) return console.log(err);
      var session_id = session.sessionId;
      room_session[req.params.rmname] = session_id;
      var TK = opentok.generateToken(session_id);
      res.send({api_key: process.env.api_key, session_id: session_id, token: TK});
    });
  };
});

var port = process.env.PORT || 8888;
app.listen(port);
