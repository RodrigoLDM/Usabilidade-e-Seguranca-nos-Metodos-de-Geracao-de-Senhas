import { wordList, special_characters, numbers, letters } from "./words.js";

function getRandomNumber() {
  const max = wordList.length - 1;
  const min = 0;
  return Math.floor(Math.random() * (max - min) + min);
}

function generatePassPhrase(numWords, separator = "-") {
  var password = "";
  for (let i = 0; i < numWords; i++) {
    password += wordList[getRandomNumber()];
    if (i < numWords - 1) {
      password += separator;
    }
  }
  return password;
}

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function generateDictPassword(hasUpper = false) {
  var pass = wordList[getRandomNumber()];
  if (hasUpper == true) {
    var n = randomNumber(1, pass.length);
    for (let j = 0; j < n; j++) {
      var char = randomNumber(0, pass.length - 1);
      pass =
        pass.substring(0, char) +
        pass[char].toUpperCase() +
        pass.substring(char + 1, pass.length);
    }
  }
  return pass;
}

function mungedPassword(hasUpper = false) {
  var dictionary = {
    a: "4",
    e: "3",
    i: "1",
    o: "0",
    A: "4",
    E: "3",
    I: "1",
    O: "0",
  };
  var pass = generateDictPassword(hasUpper);
  for (let i = 0; i < pass.length; i++) {
    if (Object.keys(dictionary).includes(pass[i])) {
      pass =
        pass.substring(0, i) +
        dictionary[pass[i]] +
        pass.substring(i + 1, pass.length);
    }
  }
  return pass;
}

function entropy(password) {
  const charSet = new Set(password);
  const charSetSize = charSet.size;
  const passwordSize = password.length;
  const entropy = Math.log2(Math.pow(charSetSize, passwordSize));
  return entropy;
}

function getLetter() {
  return letters[randomNumber(0, letters.length)];
}

function getAlpha() {
  return numbers[randomNumber(0, numbers.length)];
}

function getSpecial() {
  return special_characters[randomNumber(0, special_characters.length)];
}

function generateRandomPassword(len, hasUpper, hasAlpha, hasSpecial) {
  var pass = "";
  var changedLetters = [];
  let lock = true;
  for (let i = 0; i < len; i++) {
    pass += getLetter();
  }

  if (hasUpper == true) {
    while (lock) {
      let p = randomNumber(0, pass.length);
      if (!changedLetters.includes(p)) {
        pass =
          pass.substring(0, p) +
          getLetter().toUpperCase() +
          pass.substring(p + 1, pass.length);
        changedLetters.push(p);
        lock = false;
      }
    }

    for (let i = 1; i < pass.length; i++) {
      let r = randomNumber(0, 2);
      if (r % 2 == 0 && !changedLetters.includes(r)) {
        pass =
          pass.substring(0, i) +
          getLetter().toUpperCase() +
          pass.substring(i + 1, pass.length);
      }
    }
  }

  lock = true;

  if (hasAlpha == true) {
    while (lock) {
      let p = randomNumber(0, pass.length);
      if (!changedLetters.includes(p)) {
        pass =
          pass.substring(0, p) +
          getAlpha() +
          pass.substring(p + 1, pass.length);
        changedLetters.push(p);
        lock = false;
      }
    }

    for (let i = 1; i < pass.length; i++) {
      let r = randomNumber(0, 2);
      if (r % 2 == 0 && !changedLetters.includes(r)) {
        pass =
          pass.substring(0, i) +
          getAlpha() +
          pass.substring(i + 1, pass.length);
      }
    }
  }

  lock = true;

  if (hasSpecial == true) {
    while (lock) {
      let p = randomNumber(0, pass.length);
      if (!changedLetters.includes(p)) {
        pass =
          pass.substring(0, p) +
          getSpecial() +
          pass.substring(p + 1, pass.length);
        changedLetters.push(p);
        lock = false;
      }
    }

    for (let i = 1; i < pass.length; i++) {
      let r = randomNumber(0, 2);
      if (r % 2 == 0 && !changedLetters.includes(r)) {
        pass =
          pass.substring(0, i) +
          getSpecial() +
          pass.substring(i + 1, pass.length);
        changedLetters.push(i);
      }
    }
  }

  return pass;
}

// Vê em qual página está ( para verificar qual senha deve ser gerada)
const path = window.location.pathname;
console.log(path);
// Salva elemento de botão de gerar senha
const passwordButton = document.getElementById("generate-password");

// Função para alterar elemento de texto para a entropia calculada
function changeEntropy(password) {
  var el = document.getElementById("entropia");

  el.innerHTML = entropy(password);
}
// Função para alterar elemento de texto para a senha passphrase gerada
function changePasswordPassphrase() {
  var num = document.getElementById("numero").value;
  var sep = document.getElementById("separador").value;
  var el = document.getElementById("senha");

  var password = generatePassPhrase(num, sep);
  el.innerHTML = password;
  changeEntropy(password);
}
// Função para alterar elemento de texto para a senha dicionário gerada
function changePasswordDict() {
  var hasUpper = document.getElementById("hasupper");
  var el = document.getElementById("senha");

  var password = generateDictPassword(hasUpper.checked);
  el.innerHTML = password;
  changeEntropy(password);
}
// Função para alterar elemento de texto para a senha munged gerada
function changePasswordMunged() {
  var hasUpper = document.getElementById("hasupper");
  var el = document.getElementById("senha");

  var password = mungedPassword(hasUpper.checked);
  el.innerHTML = password;
  changeEntropy(password);
}
// Função para alterar elemento de texto para a senha aleatória gerada
function changePasswordRandom() {
  var num = document.getElementById("numero").value;
  var hasUpper = document.getElementById("hasupper");
  var hasAlpha = document.getElementById("hasalpha");
  var hasSpecial = document.getElementById("hasspecial");
  var el = document.getElementById("senha");

  var password = generateRandomPassword(
    num,
    hasUpper.checked,
    hasAlpha.checked,
    hasSpecial.checked
  );
  el.innerHTML = password;
  changeEntropy(password);
}

// Chama função do respectivo método de senha, dependendo de qual página está, e calcula entropia dessa senha
switch (path) {
  case "/passphrase.html":
    passwordButton.addEventListener("click", changePasswordPassphrase);
    break;
  case "/dicionario.html":
    passwordButton.addEventListener("click", changePasswordDict);
    break;
  case "/munged.html":
    passwordButton.addEventListener("click", changePasswordMunged);
    break;
  case "/random.html":
    passwordButton.addEventListener("click", changePasswordRandom);
    break;
}

// Mostra valor do slider na página
var numero = document.getElementById("numero");
if (numero) {
  var slider = document.getElementById("numero");
  var output = document.getElementById("valorNumero");
  output.innerHTML = slider.value;

  slider.oninput = function () {
    output.innerHTML = this.value;
  };
}

//APAGA DPS FI
//N ESQUECE
//APAGA
console.log("Password;type\n");
for (let i = 0; i < 2; i++) {
  let pass = generateRandomPassword(randomNumber(17, 21), true, true, true);
  console.log(pass + ";Random Passwords");
}

for (let i = 0; i < 2; i++) {
  let pass = generatePassPhrase(3);
  console.log(pass + ";Passphrases");
}

for (let i = 0; i < 2; i++) {
  let pass = mungedPassword(true);
  console.log(pass + ";Munged Passwords");
}

for (let i = 0; i < 2; i++) {
  let pass = generateDictPassword(true);
  console.log(pass + ";Dict Passwords");
}
