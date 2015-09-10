function titleCase(str) {
  str = str.toLowerCase();
  var star = str.split(" ");
  var charArray = new Array(); // array to hold characters
  var strArray = new Array(); // array to hold strings
  var newStr, tmpStr; // string variable to hold string
  // two loops
  for (var i=0; i<star.length; i++) { // 1 loops through string array
    for (var j=0; j<star[i].length; j++) { // 2 loops through each character
      charArray[j] = star[i].charAt(j); // stores each character in an array
      if (j===0) { // checks for first letter of the array
        charArray[j] = charArray[j].toUpperCase(); // transforms lowercased char
      }
    }
    for (var k=0; k<star[i].length; k++) { // reverse the work done above
      if (k===0) { // check for first word to avoid adding unnecessary characters
         newStr = charArray[k]; // 
      } else { // if not the first character, then add
         newStr += charArray[k];
      }
    }
    if (i===0) { // to check first word! this removed !Undefined at the beginning
      tmpStr = newStr;
    } else { // concatenate with space with words
      tmpStr += " " + newStr;
    }
  }
str = tmpStr;
  return str;
}

titleCase("I'm a little tea pot");