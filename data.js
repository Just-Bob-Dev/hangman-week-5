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

//Pulls from Mac dictionary and then turns said word into and object array to be displayed on web page.
function pickWord(){
  var chosenWordIndex = Math.floor(Math.random()*words.length);
  var chosenWord = words[chosenWordIndex];
  return wordToObjArr(chosenWord);
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
function checkLetter(req, string, wordArray, failedGuessString){
  let chosenLetter = string;
  let fgs = failedGuessString;
  let count = 0;
  if(chosenLetter.length === 1){
    let letterCheck = wordArray.stringArr.find(function(lett){
      if(lett.letter === chosenLetter){
        lett.letterGuess = chosenLetter;
        count = count - 1;
        req.session.failed = false;
      }
      else{count = count + 1;}
    });
  }
  if(count == wordArray.stringArr.length){
    console.log("this is true man");
    req.session.failed = true;
  }
  console.log("The count is: " + count);
  return req.session
}





module.exports = {
  pWord: pickWord,
  strObjArr: wordToObjArr,
  lettToObj: letterToObj,
  checkLetter: checkLetter
}
