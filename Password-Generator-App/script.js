const passwordEl = document.getElementById('password');
const copyEl = document.getElementById('copy');
const formEl = document.forms["password-form"];
const lengthEl = formEl[0];
const upperAlphaEl = formEl[1];
const numbersEl = formEl[2];
const symbolsEl = formEl[3];

const lowerAlphaArr = [
    'a','b','c','d','e'
    ,'f','g','h','i','j','k'
    ,'l','m','n','o','p','q'
    ,'r','s','t','u','v','w'
    ,'x','y','z'];

const upperAlphaArr = [
    'A','B','C','D','E'
    ,'F','G','H','I','J','K'
    ,'L','M','N','O','P','Q'
    ,'R','S','T','U','V','W'
    ,'X','Y','Z'];
const numbersArr = [0,1,2,3,4,5,6,7,8,9];
const symbolsArr = ['!','@','#','$','%','^','&','*','(',')','_','-'];

formEl.addEventListener("submit", generatePassword);
copyEl.addEventListener("click", copyPassword);

function generatePassword(e) {
    let password = '';
    e.preventDefault();
    let elementsArr = lowerAlphaArr;
    if(upperAlphaEl.checked) {
        elementsArr = elementsArr.concat(upperAlphaArr);
        password = password.concat(upperAlphaArr[random(0, upperAlphaArr.length)]);
    }
    if(numbersEl.checked) {
        elementsArr = elementsArr.concat(numbersArr);
        password = password.concat(numbersArr[random(0, numbersArr.length)]);
    }
    if(symbolsEl.checked) {
        elementsArr = elementsArr.concat(symbolsArr);
        password = password.concat(symbolsArr[random(0, symbolsArr.length)]);
    }
    for (let i = password.length; i < lengthEl.value; i++) {
        password = password.concat(elementsArr[random(0, elementsArr.length)]);
    }
    passwordEl.value = password;
}

function copyPassword() {
    passwordEl.select();
    passwordEl.setSelectionRange(0, 99999)
    document.execCommand("copy");
}

function random(min, max) {
    return Math.floor(min + Math.random() * (max - min));
}

