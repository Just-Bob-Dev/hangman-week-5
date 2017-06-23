const express = require('express')
var parseurl = require('parseurl')
var session = require('express-session')
var fs = require('fs')
var mustacheExpress = require('mustache-express');
var words = fs.readFileSync("/usr/share/dict/words", "utf-8").toLowerCase().split("\n");

function wordToObjArr(string){
  let stringArr = string.split('');
  for(let i = 0; i< stringArr.length; i++){
    stringArr[0] ={''+i+'': stringArr[i]};
  }
  return stringArr;
}

function pickWord(){
  var chosenWordIndex = Math.floor(Math.random()*words.length);
  var chosenWord = words[chosenWordIndex];
  return chosenWord;
}

var app = express()
//initializes session and makes it so it can be referenced later on in the .js file.

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.engine('mustache', mustacheExpress());
app.set('views', './views');
app.set('view engine', 'mustache');
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))

app.use(function (req, res, next) {

  var views = req.session.views
//checks to see if there are any views and if not sets the base amount.
  if (!views) {
    views = req.session.views = {}
  }
  // get the url pathname
  var pathname = parseurl(req).pathname
  // count the views
  views[pathname] = (views[pathname] || 0) + 1

  next()
})

app.get('/', function(req, res, next){
  let newWord = pickWord();
  console.log(newWord);
  wordToObjArr(newWord);

  res.send('This is your special word: ' + " " + newWord + " ");
})

app.listen(3000, function(req, res){
  console.log('looks like you made it after all.')
})
