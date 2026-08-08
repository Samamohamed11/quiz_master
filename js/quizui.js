export default class QuizUI {

    constructor(container) {
        this.container = container;
    }

    showQuestion(question, current, total, category, difficulty) {

        const progress = (current / total) * 100;

        this.container.innerHTML = `
            <div class="game-card question-card">

                <div class="xp-bar-container">

                    <div class="xp-bar-header">
                        <span class="xp-label">
                            <i class="fa-solid fa-bolt"></i>
                            Progress
                        </span>

                        <span class="xp-value">
                            Question ${current}/${total}
                        </span>
                    </div>

                    <div class="xp-bar">
                        <div 
                            class="xp-bar-fill"
                            style="width: ${progress}%">
                        </div>
                    </div>

                </div>

                <div class="stats-row">

                    <div class="stat-badge category">
                        <i class="fa-solid fa-bookmark"></i>
                        <span>${category}</span>
                    </div>

                    <div class="stat-badge difficulty">
                        <i class="fa-solid fa-gauge-high"></i>
                        <span>${difficulty}</span>
                    </div>

                    <div class="stat-badge counter">
                        <i class="fa-solid fa-gamepad"></i>
                        <span>${current}/${total}</span>
                    </div>

                </div>

                <h2 class="question-text">
                    ${question.question}
                </h2>

                <div class="answers-grid">

                    ${question.answers.map((answer, index) => `

                        <button 
                            class="answer-btn"
                            data-answer="${answer}">

                            <span class="answer-key">
                                ${index + 1}
                            </span>

                            <span class="answer-text">
                                ${answer}
                            </span>

                        </button>

                    `).join("")}

                </div>

                <div class="score-panel">
                    <div class="score-item">
                        <div class="score-item-label">Score</div>
                        <div class="score-item-value">0</div>
                    </div>
                </div>

            </div>
        `;
    }


    showAnswerResult(selectedAnswer, correctAnswer) {

        const answerButtons =
            this.container.querySelectorAll(".answer-btn");

        answerButtons.forEach(button => {

            const answer = button.dataset.answer;

            if (answer === selectedAnswer) {

                if (answer === correctAnswer) {
                    button.classList.add("correct");
                } else {
                    button.classList.add("wrong");
                }

            } else if (answer === correctAnswer) {

                button.classList.add("correct-reveal");

            } else {

                button.classList.add("disabled");

            }

        });
    }


    disableAnswers() {

        const answerButtons =
            this.container.querySelectorAll(".answer-btn");

        answerButtons.forEach(button => {
            button.disabled = true;
        });
    }


    updateScore(score) {

        const scoreElement =
            this.container.querySelector(".score-item-value");

        if (scoreElement) {
            scoreElement.textContent = score;
        }
    }


    updateTimer(time) {

    const timerElement =
        this.container.querySelector(".timer-badge");

    const timerValue =
        this.container.querySelector(".timer-value");

    if (!timerElement || !timerValue) return;

    timerValue.textContent = `${time}s`;

    if (time <= 5) {
        timerElement.classList.add("warning");
    } else {
        timerElement.classList.remove("warning");
    }
}


showTimeUp() {

    const answersGrid =
        this.container.querySelector(".answers-grid");

    if (!answersGrid) return;

    answersGrid.innerHTML = `
        <div class="time-up-card">

            <div class="time-up-icon">
                <i class="fa-solid fa-clock"></i>
            </div>

            <h3>TIME'S UP!</h3>

            <p>
                You ran out of time for this question.
            </p>

        </div>
    `;
}


showResults(playerName, score, totalQuestions) {

    const wrong = totalQuestions - score;

    const accuracy = totalQuestions > 0
        ? Math.round((score / totalQuestions) * 100)
        : 0;

    this.container.innerHTML = `
        <div class="game-card results-card">

            <div class="results-header">

                <div class="results-icon">
                    <i class="fa-solid fa-trophy"></i>
                </div>

                <h2>Congratulations!</h2>

                <p>
                    Great job, ${playerName}!
                </p>

            </div>

            <div class="results-score">

                <div class="score-label">
                    Final Score
                </div>

                <div class="score-value">
                    ${score}/${totalQuestions}
                </div>

            </div>

            <div class="results-stats">

                <div class="result-stat correct">
                    <span>Correct</span>
                    <strong>${score}</strong>
                </div>

                <div class="result-stat wrong">
                    <span>Wrong</span>
                    <strong>${wrong}</strong>
                </div>

                <div class="result-stat accuracy">
                    <span>Accuracy</span>
                    <strong>${accuracy}%</strong>
                </div>

            </div>

            <button
                type="button"
                class="play-again-btn"
                id="playAgain">

                <i class="fa-solid fa-rotate-right"></i>
                Play Again

            </button>

        </div>
    `;
}

reset() {
    this.container.innerHTML = "";
}
}