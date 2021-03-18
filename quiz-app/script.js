const QUIZLENGTH = 5;
const AVAILABLEQUESTIONS = 43;
const APIURL = "https://opentdb.com/api.php?amount="+ AVAILABLEQUESTIONS +"&category=21&difficulty=easy&type=multiple";
const OPTIONSCOUNT = 4;

const titleEl = document.getElementById("title");
const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const listEl = document.createElement("ul");
const buttonSectionEl = document.getElementById("button-section");
const submitButtonEl = document.createElement("input");
const restartButtonEl = document.createElement("button");
const finishEl = document.createElement("p");
const scoreEl = document.createElement("p");

const quizData = [];
var questionNumbers = [];
var i = 0; 
var score = 0;

async function getData () {
    const response = await fetch(APIURL);
    const responseData = await response.json();

    return responseData;
}

function getRandomNumbersArray(maxNumber, length) {
    const randomNumbers = [];
    while (randomNumbers.length < length) {
        var randomNumber = Math.floor(Math.random() * maxNumber);
        if(randomNumbers.includes(randomNumber)) {
        } else {
            randomNumbers.push(randomNumber);
        }
    }
    return randomNumbers;
}

async function mainFunction () {
    const fullQuizdata = await getData();
    for(questionNumber of questionNumbers) {
        if(fullQuizdata.results[questionNumber]) {
            quizData.push(fullQuizdata.results[questionNumber]);
        } else {
            quizData.push(fullQuizdata.results[10]);
        } 
    }
    showQuiz(quizData[i]);
}

function showQuiz(quiz) {
    options = [quiz.correct_answer,...quiz.incorrect_answers];
    questionEl.innerText = '';
    questionEl.innerHTML = (i+1) + ' ' + quiz.question.replaceAll("&#039;",`'`).replaceAll("&quot;",`"`);
    listEl.classList.add("list");
    listEl.innerHTML = 
            `<li class="list-item">
                <input type="radio" id="option-a" name="option" value="${options[randomOptions[0]]}" required>
                <label for="option-a">${options[randomOptions[0]]}</label>
            </li>
            <li class="list-item">
                <input type="radio" id="option-b" name="option" value="${options[randomOptions[1]]}" required>
                <label for="option-b">${options[randomOptions[1]]}</label>
            </li>
            <li class="list-item">
                <input type="radio" id="option-c" name="option" value="${options[randomOptions[2]]}" required>
                <label for="option-c">${options[randomOptions[2]]}</label>
            </li>
            <li class="list-item">
                <input type="radio" id="option-d" name="option" value="${options[randomOptions[3]]}" required>
                <label for="option-d">${options[randomOptions[3]]}</label>
            </li>`;
    optionsEl.innerHTML = "";
    optionsEl.appendChild(listEl);
    submitButtonEl.type="submit";
    submitButtonEl.classList.add("submit");
    buttonSectionEl.appendChild(submitButtonEl);
    i++;
}

function showScore () {
    finishEl.innerText = "Your Score";
    finishEl.classList.add("finish");
    titleEl.appendChild(finishEl);
    scoreEl.innerText = score + "/" + QUIZLENGTH;
    scoreEl.classList.add("score");
    titleEl.appendChild(scoreEl);
}

randomOptions = getRandomNumbersArray(OPTIONSCOUNT,OPTIONSCOUNT);
questionNumbers = getRandomNumbersArray(AVAILABLEQUESTIONS+1, QUIZLENGTH);
getRandomNumbersArray()
mainFunction();


submitButtonEl.addEventListener('click', (e) => {
    if (document.querySelector('input[name="option"]:checked')) {
        e.preventDefault();
        let selectedOption = document.querySelector('input[name="option"]:checked').value;
        if(i < 5) {
            if(selectedOption === quizData[i-1].correct_answer) {
                score++;
            }
            showQuiz(quizData[i]);
        } else {
            if(selectedOption === quizData[i-1].correct_answer) {
                score++;
            }
            questionEl.innerHTML = "";
            optionsEl.innerHTML = "";
            buttonSectionEl.innerHTML = "";
            showScore();
            restartButtonEl.innerHTML="Restart";
            restartButtonEl.classList.add("restart");
            buttonSectionEl.appendChild(restartButtonEl);
        }
    } else {

    }
});

restartButtonEl.addEventListener('click', () => {
    location.reload();
});