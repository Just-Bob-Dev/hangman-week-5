const express = require('express')
const parseurl = require('parseurl')
const session = require('express-session')
const fs = require('fs')
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const data = require('./data.js')
var mustacheExpress = require('mustache-express');
var words = fs.readFileSync("./words").toLowerCase().split("\n");

var app = express()
//initializes session and makes it so it can be referenced later on in the .js file.

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(expressValidator());

app.engine('mustache', mustacheExpress());
app.set('views', './views');
app.set('view engine', 'mustache');

app.use(express.static('./public'));
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))


var newWord = '';
let guessString = '';
let failedGuesses = '';
var guessLeft = 8;
let guessArr = data.lettToObj(guessString);

//Welcome Page
app.get('/', function(req,res){
  guessString = '';
  failedGuesses = '';
  req.session.destroy();
  guessArr = data.lettToObj(guessString);
  res.render('welcome')
});

//Selection of difficulty and word length
app.post('/', function(req,res){
    let difficulty = req.body.difficulty;
    req.session.newWord = data.getDiff(difficulty);
    newWord = req.session.newWord;
    res.redirect('/hangman');
});

//Hangman Game.
app.get('/hangman', function(req, res, next){
  guessLeft = 8 - failedGuesses.length;
  console.log("you have: " +guessLeft +" guesses left."  )
  console.log(newWord);
  res.render('index', { stringArr: req.session.newWord.stringArr,
  failedGuess: guessArr.str,
  guessesLeft: guessLeft});
});

//Hangman Post
app.post('/hangman', function(req, res, next){
  let guess = req.body.guessInput.toLowerCase();
  req.checkBody('guessInput', "Sorry you need to only enter one letter").isLength({min:1, max:1}).isAlpha();
  let guessBool = data.isNewLetter(guess, guessString);
  var errors = req.validationErrors();
  if(errors || guessBool){
    // res.send('Im sorry your guess was invalid please try again.')
    res.redirect('/hangman');
  }
  else{
    guessString += guess;
    let check = data.checkLetter(req, guess, req.session.newWord);
    let status = data.gameStat(req, failedGuesses);
    // console.log(req.session);
    if(req.session.youWon){
      res.redirect('/hangman/youWon');
    }
    else{
      if(req.session.gameStatus == true){
        res.redirect('/hangman/youlose');
      }
      else if (req.session.failed != false){
        failedGuesses = failedGuesses + guess;
      }
    }
    guessArr = data.lettToObj(guessString);
    res.redirect('/hangman');
  }
});

//Get page for losers
app.get('/hangman/youlose', function(req, res){
  res.render('youlose',{stringArr: req.session.newWord.stringArr, failedGuess: guessArr.str,
  guessesLeft: guessLeft});
});

//Post incase loser wants to play again.
app.post('/hangman/youlose', function(req, res){
  req.session.destroy();
  res.redirect('/');
});

//grab the you won mustache
app.get('/hangman/youWon', function(req, res){
  res.render('youWon', { stringArr: req.session.newWord.stringArr, failedGuess: guessArr.str,
  guessesLeft: guessLeft});
});

//gets rid of last session and starts new one.
app.post('/hangman/youWon', function(req, res){
  res.redirect('/');
});

app.listen(process.env.PORT || 3000, function(req, res){
  console.log('looks like you made it after all.');
})
