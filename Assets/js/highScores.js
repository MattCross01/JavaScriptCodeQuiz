var buttonClearEl = document.querySelector("#clear");
var highScoresListEl = document.querySelector(".high-scores");

var displayHighScores = function () {
    // retrieve high scores from localStorage
    var highScores = localStorage.getItem("topFive");
    if (!highScores) {
        alert("No high scores yet! Take the quiz and you can be the first one!");
    }
    else {
        highScores = JSON.parse(highScores);
        for (var i = 0; i < highScores.length; i++) {
            var highScoresListItemEl = document.createElement("li");
            highScoresListItemEl.textContent = `${i+1}. ${highScores[i].initials} - ${highScores[i].score}`;
            highScoresListItemEl.className = "score-item";
            highScoresListEl.appendChild(highScoresListItemEl)
        }
    }
}

var clearScores = function () {
    localStorage.removeItem("topFive");
    highScoresListEl.innerHTML = "";
}
displayHighScores();
buttonClearEl.addEventListener("click", clearScores);