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

app.use(express.static('./public'));
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
var newWord = '';
let guessString = '';
var guessLeft = 8;
let guessArr = data.lettToObj(guessString);

//Welcome Page
app.get('/', function(req,res){
  guessString = '';
  res.render('welcome')
});

//Selection of difficulty and word length
app.post('/', function(req,res){
    let difficulty = req.body.difficulty;
    // console.log("difficulty: " + difficulty);
    newWord = data.getDiff(difficulty);
    // console.log('typeof newWord: ')
    // console.log(typeof newWord);
    res.redirect('/hangman');
});
//Hangman Game.
app.get('/hangman', function(req, res, next){
  // let newWord = pickWord();
  // console.log('newWord: ')
  // console.log(newWord);
  // console.log('guessArr: ')
  // console.log(guessArr)
  guessLeft = 8 - guessArr.str.length;
  console.log('guessLeft: ' + guessLeft + " minus " +guessArr.str.length);
  res.render('index', { stringArr: newWord.stringArr,
  failedGuess: guessArr.str,
  guessesLeft: guessLeft});
  // res.send('This is your special word: ' + " " + newWord + " " );
});
//Hangman Post
app.post('/hangman', function(req, res, next){
  let guess = req.body.guessInput;
  let check = data.checkLetter(req, guess, newWord, guessString);
  let status = data.gameStat(req, guessArr.str);
  console.log(req.session);
  if(req.session.gameStatus == true){
    res.redirect('/hangman/youlose');
  }
  else{
    // console.log("req.session: ");
    // console.log(req.session);
    // console.log("newWord.stringArr.length");
    // console.log(newWord.stringArr.length);
    if (req.session.failed){
      guessString = guessString + guess;
      guessArr = data.lettToObj(guessString);
    }
    // console.log('Guess: ' +req.body.guessInput + " This is the current guess String: " + guess);
    // console.log(guessString);
    // console.log("your in post" +newWord);
    res.redirect('/hangman');
  }
});

app.get('/hangman/youlose', function(req, res){
  res.render('youlose');
});

app.post('/hangman/youlose', function(req, res){
  req.session.destroy();
  res.redirect('/');
});

app.listen(3000, function(req, res){
  console.log('looks like you made it after all.');
})
