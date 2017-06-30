const fs = require('fs')
var words = fs.readFileSync("/usr/share/dict/words", "utf-8").toLowerCase().split("\n");


//Turns a chosenWord into an array of letters and blank spaces
//The letters will not be shown until the user guesses everything
//correctly.
function wordToObjArr(string){
  let stringArr = string.split('');
  for(let i = 0; i< stringArr.length; i++){
    let c = ''+ stringArr[i];
    stringArr[i] ={
      'letter' : c,
      'letterGuess' : '_'
    };
  }
  return {stringArr};
}

//This checks to see if you have already guessed that letter
function isNewLetter(letter, string) {
  let allReadyGuessed = false;
  if(string === ''){allReadyGuessed = false; }
  else{
    for(let i = 0; i < string.length; i++){
      if(letter === string.charAt(i)){
        allReadyGuessed = true ;
        break;
      }
    }
  }
  return allReadyGuessed;
}

//Pulls from Mac dictionary and then turns said word into and object array to be displayed on web page.
function pickWord(lowerInt, highInt){
  let correctDifficulty = false;
  let chosenWord = "";
  // console.log(lowerInt + " " + highInt)
  while(correctDifficulty != true ){
    let chosenWordIndex = Math.floor(Math.random()*words.length);
    chosenWord = words[chosenWordIndex];
    if(chosenWord.length >= lowerInt && chosenWord.length <= highInt){
      correctDifficulty = true;
    }
    // console.log("possible word: " + chosenWord);
  }
  return wordToObjArr(chosenWord);
}

//checks difficulty and picks word
function getDifficulty(string){
  if(string === 'easy'){
    return pickWord(4, 6);
  }
  else if (string === 'normal') {
    return pickWord(6, 8);
  }
  else if (string === 'hard'){
    return pickWord(8, 100);
  }
}

//Turns a guess into an object
function letterToObj(string){
  let stringArr = string.split('');
  let str = [];
  for(let i = 0; i< stringArr.length; i++){
    str[i] = {'letter': stringArr[i]};
  }
  return {str};
}

//Checks new letter against letters in word to either populate
//letter array or failed guesses array.
function checkLetter(req, string, wordArray){
  let chosenLetter = string;
  let count = 0;
  if(chosenLetter.length === 1){
    let letterCheck = wordArray.stringArr.find(function(lett){
      if(lett.letter === chosenLetter){
        lett.letterGuess = chosenLetter;
        req.session.failed = false;
      }
      else{
        count = count + 1;
        // console.log("This is the count insid the else block: " + count);
      }
    });
    // console.log("The count going into the bad letter array: " + count);
    if(count === wordArray.stringArr.length){
      req.session.failed = true;
    }
  }
  let countCorrectLetters = 0;
  for(let i = 0; i < wordArray.stringArr.length;i++){
    // console.log(wordArray.stringArr.length);
    if(wordArray.stringArr[i].letter === wordArray.stringArr[i].letterGuess){
      countCorrectLetters = countCorrectLetters + 1;
    }
  }
  if(countCorrectLetters === wordArray.stringArr.length){
    req.session.youWon = true;
  }
  // console.log("The count is: " +countCorrectLetters);
  return req.session
}

//check status of game to display either lose information.
function gameStatus(req, string){
  let status = string.length;
  if(status === 7){
    req.session.gameStatus = true;
  }
  else{
    req.session.gameStatus = false;
  }
  return req.session;
}


module.exports = {
  pWord: pickWord,
  strObjArr: wordToObjArr,
  lettToObj: letterToObj,
  checkLetter: checkLetter,
  getDiff: getDifficulty,
  gameStat: gameStatus,
  isNewLetter: isNewLetter
}
