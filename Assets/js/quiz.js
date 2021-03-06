// setting up the mcq test
var quizArray = [
    {
        q: "Why do JavaScript and Java have similar names?",
        choices: [
            "JavaScript is a stripped-down version of Java",
            "JavaScript's syntax is loosely based on Java's",
            "They both originated on the island of Java",
            "None of the above"
        ],
        answer: "2"
    }, {
        q: "Inside which HTML element do we put the JavaScript?",
        choices: [
            "<javascript>",
            "<scripting>",
            "<script>",
            "<js>"
        ],
        answer: "3"
    }, {
        q: 'What is the correct syntax for referring to an external script called "script.js"?',
        choices: [
            '<script href="script.js">',
            '<script name="script.js">',
            '<script src="script.js">',
            'None of the above'
        ],
        answer: "3"
    }, {
        q: 'Where is the correct place to insert a JavaScript?',
        choices: [
            "the <head> section",
            "The <body> section",
            "Both the <head> section and <body> section",
            "None of the Above"
        ],
        answer: "1"
    }, {
        q: "Arrays in JavaScript can be used to store _______",
        choices: [
            "numbers and strings",
            "other arrays",
            "booleans",
            "all of the above"
        ],
        answer: "4"
    }
];

// other global variables
var timerEl = document.querySelector("#countdown");
var buttonStartEl = document.querySelector("#start-quiz");
var containerEl = document.querySelector(".container");
var indexNb = 0;
var timeLeft = 100;
var userInfo = {
    score: 0
};

// function called to display a new mcq
var displayMCQ = function () {

    // set the timer
    var countdown = setInterval(function () {

        // if there is time left, then proceed with the quiz
        if (timeLeft > 0) {
            containerEl.innerHTML = "";             // delete current content
            containerEl.classList.remove("center");
            timerEl.innerHTML = timeLeft;           // display time left

            // if we have not reached the last questions, then display the next question
            if (indexNb < quizArray.length) {
                // create and display new question
                var questionEl = document.createElement("h1");
                questionEl.textContent = quizArray[indexNb].q;
                containerEl.appendChild(questionEl);
                // create and display new choices
                var choicesListEl = document.createElement("ul");
                var choicesArray = quizArray[indexNb].choices;      // retrieve the array of choices associated with the question
                for (var i = 0; i < choicesArray.length; i++) {     // loop through the array of choices
                    var choicesListItemEl = document.createElement("li");
                    choicesListItemEl.textContent = `${i+1}. ${choicesArray[i]}`;
                    choicesListItemEl.className = "choice";
                    choicesListItemEl.setAttribute("data-choice-nb", i+1);
                    choicesListEl.appendChild(choicesListItemEl);
                }
                containerEl.appendChild(choicesListEl);
                timeLeft--;                                         // decrease time left by 1s
            }
            // otherwise stop the timer and display the final score
            else {
                clearInterval(countdown);           // stop the timer
                timerEl.innerHTML = timeLeft;
                userInfo.score = timeLeft       // display time left (should be 0)
                displayScore();                     // display final score
            }
        }

        // otherwise interrupt the quiz and display the final score
        else { 
            containerEl.innerHTML = "";         // delete current content
            clearInterval(countdown);           // stop the timer
            timerEl.innerHTML = timeLeft;       // display time left (should be 0)
            displayScore();                     // display final score
        }
    }, 1000);
}

var choiceButtonHandler = function (event) {
    // if a choice was clicked, then extract the choice nb and trigger the verifyAnswer() function
    if (event.target.matches(".choice")) {
        var choiceNb = event.target.getAttribute("data-choice-nb");
        verifyAnswer(choiceNb);
    }
}

var verifyAnswer = function (userAnswer) {
    var feedback = document.createElement("p");
    if (userAnswer === quizArray[indexNb].answer) {
        feedback.innerHTML = '<div class="feedback"><hr>Correct!</div>';
    }
    else {
        feedback.innerHTML = '<div class="feedback"><hr>Wrong!</div>';
        timeLeft -= 10;
    }
    containerEl.appendChild(feedback);
    indexNb++; // get index pointing to the next question
    setTimeout(displayMCQ, 1000);
}

var displayScore = function () {
   // create and display end message
   var messageEl = document.createElement("h1");
   messageEl.textContent = "Quiz Complete!";
   containerEl.appendChild(messageEl);

   // create and display final score
   var finalScoreEl = document.createElement("p");
   finalScoreEl.textContent = `Your final score is ${userInfo.score}.`;
   containerEl.appendChild(finalScoreEl);

   // create and display form element
   var formEl = document.createElement("form");
   var initialsEl = document.createElement("div");
   initialsEl.className = "form-item";
   initialsEl.innerHTML = 'Enter initials: <input type="text" name="initials" class="text-input"/>';
   formEl.appendChild(initialsEl);
   var submitButtonEl = document.createElement("div");
   submitButtonEl.className = "form-item";
   submitButtonEl.innerHTML = '<button class="btn" id="save-score" type="submit">Submit</button>';
   formEl.appendChild(submitButtonEl);
   containerEl.appendChild(formEl);
   submitButtonEl.addEventListener("click", submitInitials);
}

var submitInitials = function () {
    event.preventDefault();
    var initialsInput = document.querySelector("input[name='initials']").value;
    if (!initialsInput) {
        alert("Please enter your initials first.");
        return false;
    }
    userInfo.initials = initialsInput;
    saveScore();
    var button = document.querySelector('#save-score');
    button.disabled = true;
}

var saveScore = function () {
    // retrieve from localStorage
    var topFiveSaved = localStorage.getItem("topFive");
    if (!topFiveSaved) {
        var userArr = [];
        userArr.push(userInfo);
        localStorage.setItem("topFive", JSON.stringify(userArr));
        alert('You\'ve been added to the top 5 list! Click on "View high scores" to see the top scores.');
    }
    else {
        topFiveSaved = JSON.parse(topFiveSaved);
        if (topFiveSaved.length < 5) {
            topFiveSaved.push(userInfo);
            alert('You\'ve been added to the top 5 list! Click on "View high scores" to see the top scores.');
        }
        else {
            topFiveSaved = evaluateScore(topFiveSaved);
        }
        topFiveSaved.sort(compare);
        localStorage.setItem("topFive", JSON.stringify(topFiveSaved));
    }
}

var evaluateScore = function (topFive) {
    topFive.sort(compare);
    if (topFive[4].score < userInfo.score) {
        alert('You made it to the Hall of Fame! Click on "View high scores" to see the top scores.');
        topFive.pop();
        topFive.push(userInfo);
    }
    else {
        alert("You did not beat any of the five highest scores. Next time!");
    }
    return topFive;
}

// function to sort the array of top five users in descending order
var compare = function (userA, userB) {
    var scoreA = userA.score;
    var scoreB = userB.score;
    var comparison = 0;
    if (scoreA > scoreB) {
        comparison = -1;
    }
    else if (scoreA < scoreB) {
        comparison = 1;
    }
    return comparison;
}

buttonStartEl.addEventListener("click", displayMCQ);
containerEl.addEventListener("click", choiceButtonHandler);