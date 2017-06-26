const express = require('express')
const parseurl = require('parseurl')
const session = require('express-session')
const fs = require('fs')
const bodyParser = require('body-parser');
const data = require('./data.js')
var mustacheExpress = require('mustache-express');
var words = fs.readFileSync("/usr/share/dict/words", "utf-8").toLowerCase().split("\n");



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

// app.use(function (req, res, next) {
//
//   var views = req.session.views
// //checks to see if there are any views and if not sets the base amount.
//   if (!views) {
//     views = req.session.views = {}
//   }
//   // get the url pathname
//   var pathname = parseurl(req).pathname
//   // count the views
//   views[pathname] = (views[pathname] || 0) + 1
//
//   next()
// })

let newWord = data.pWord();
let guessString = '';
let guessArr = data.lettToObj(guessString);


app.get('/', function(req, res, next){
  // let newWord = pickWord();
  console.log(newWord);
  console.log(guessArr)
  res.render('index', { stringArr: newWord.stringArr,
  failedGuess: guessArr.str });
  // res.send('This is your special word: ' + " " + newWord + " " );
})

app.post('/', function(req, res, next){
  let guess = req.body.guessInput;
  let check = data.checkLetter(req, guess, newWord, guessString);
  console.log(req.session);
  console.log(newWord.stringArr.length);
  if (req.session.failed){
    guessString = guessString + guess;
    guessArr = data.lettToObj(guessString);
  }
  console.log('Guess: ' +req.body.guessInput + " This is the current guess String: " + guess);
  console.log(guessString);
  res.redirect('/');
})

app.listen(3000, function(req, res){
  console.log('looks like you made it after all.');
})
