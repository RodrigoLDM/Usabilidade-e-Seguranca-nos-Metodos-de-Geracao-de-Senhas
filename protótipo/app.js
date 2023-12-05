/*
TCC - Segurança e Usabilidade de Senhas
Funções geradoras de Senha.

- Eduardo Gonçalves
- Guilherme Afonso
- Matheus Chang
- Rodrigo Limongi
*/

import { wordList, special_characters, numbers, letters } from "./words.js";

/*
Função auxiliar para sortear um número dentro do range da lista de palavras (wordList)
*/
function getRandomNumber() {
  const max = wordList.length - 1;
  const min = 0;
  return Math.floor(Math.random() * (max - min) + min);
}

/*
Função auxiliar para um numéro aleatório dentro de um range
Parâmetros:
> Valor mínimo (inclusivo)
> Valor máximo (exclusivo)
*/
function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

/*
Função auxiliar para sortear uma letra.
*/
function getLetter() {
  return letters[randomNumber(0, letters.length)];
}

/*
Função auxiliar para sortear um caracter numérico.
*/
function getAlpha() {
  return numbers[randomNumber(0, numbers.length)];
}

/*
Função auxiliar para sortear um caracter especial.
*/
function getSpecial() {
  return special_characters[randomNumber(0, special_characters.length)];
}

/*
Função geradora de senhas tipo Passphrases.
Parâmetros:
> Número de palavras
> Caracter separador
*/
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

/*
Função geradora de senhas tipo Palavra de Dicionário.
Parâmetros:
> Utilizar Caixa alta
*/
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

/*
Função geradora de senhas tipo Munged Password.
Parâmetros:
> Utilizar Caixa alta
*/
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

/*
Função geradora de Random Passwords.
Parâmetros:
> Quantidade de Caracteres
> Utilizar caixa alta
> Utilizar caracteres numéricos
> Utilizar caracteres especiais
*/
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

/*
Função para medir entropia das senhas.
*/
function entropy(password) {
  const charSet = new Set(password);
  const charSetSize = charSet.size;
  const passwordSize = password.length;
  let count = 0;
  let freq = {};

  // Pegar a frequencia de cada caracter
  charSet.forEach(function (value) {
    for (let i = 0; i < passwordSize; i++) {
      if (value == password[i]) {
        count++;
      }
    }
    freq[value] = (count / passwordSize).toFixed(3);
    count = 0;
  });

  let entropy = 0;

  // Cálculo da entropia a partir da frequencia de cada caracter
  for (let f in freq) {
    entropy += Math.log2(freq[f]) * freq[f];
  }

  return entropy * -1;
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
