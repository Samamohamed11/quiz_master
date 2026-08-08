/**
 * ============================================
 * QUESTION CLASS
 * ============================================
 *
 * Handles:
 * - Rendering a single question
 * - Answer selection
 * - Keyboard controls
 * - Timer
 * - Answer feedback
 * - Moving to the next question
 */

export default class Question {

    constructor(quiz, container, onQuizEnd) {

        // Store references
        this.quiz = quiz;
        this.container = container;
        this.onQuizEnd = onQuizEnd;

        // Get current question data
        this.questionData = quiz.getCurrentQuestion();

        // Current question index
        this.index = quiz.currentQuestionIndex;

        // Decode question data
        this.question = this.decodeHtml(
            this.questionData.question
        );

        this.correctAnswer = this.decodeHtml(
            this.questionData.correct_answer
        );

        this.category = this.decodeHtml(
            this.questionData.category
        );

        // Decode wrong answers
        this.wrongAnswers =
            this.questionData.incorrect_answers.map(
                answer => this.decodeHtml(answer)
            );

        // All answers shuffled
        this.allAnswers = this.shuffleAnswers();

        // Question state
        this.answered = false;

        // Timer
        this.timerInterval = null;
        this.timeRemaining = 30;

        // Keyboard handler reference
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }


    // ============================================
    // DECODE HTML ENTITIES
    // ============================================

    decodeHtml(html) {

        const doc =
            new DOMParser().parseFromString(
                html,
                "text/html"
            );

        return doc.documentElement.textContent;
    }


    // ============================================
    // SHUFFLE ANSWERS
    // ============================================

    shuffleAnswers() {

        const answers = [
            ...this.wrongAnswers,
            this.correctAnswer
        ];

        // Fisher-Yates Shuffle
        for (
            let i = answers.length - 1;
            i > 0;
            i--
        ) {

            const j =
                Math.floor(
                    Math.random() * (i + 1)
                );

            [
                answers[i],
                answers[j]
            ] = [
                answers[j],
                answers[i]
            ];
        }

        return answers;
    }


    // ============================================
    // GET PROGRESS
    // ============================================

    getProgress() {

        const progress =
            (
                (this.index + 1) /
                this.quiz.numberOfQuestions
            ) * 100;

        return Math.round(progress);
    }


    // ============================================
    // DISPLAY QUESTION
    // ============================================

    displayQuestion() {

        const progress =
            this.getProgress();

        const currentQuestion =
            this.index + 1;

        const totalQuestions =
            this.quiz.numberOfQuestions;


        this.container.innerHTML = `

            <div class="game-card question-card">

                <!-- Progress -->

                <div class="xp-bar-container">

                    <div class="xp-bar-header">

                        <span class="xp-label">
                            <i class="fa-solid fa-bolt"></i>
                            Progress
                        </span>

                        <span class="xp-value">
                            Question
                            ${currentQuestion}/${totalQuestions}
                        </span>

                    </div>


                    <div class="xp-bar">

                        <div
                            class="xp-bar-fill"
                            style="width: ${progress}%">
                        </div>

                    </div>

                </div>


                <!-- Question Information -->

                <div class="stats-row">

                    <div class="stat-badge category">

                        <i class="fa-solid fa-bookmark"></i>

                        <span>
                            ${this.category}
                        </span>

                    </div>


                    <div class="stat-badge difficulty">

                        <i class="fa-solid fa-gauge-high"></i>

                        <span>
                            ${this.quiz.difficulty}
                        </span>

                    </div>


                    <!-- Timer -->

                    <div class="timer-badge">

                        <i class="fa-solid fa-clock"></i>

                        <span class="timer-value">
                            ${this.timeRemaining}s
                        </span>

                    </div>


                    <!-- Question Counter -->

                    <div class="stat-badge counter">

                        <i class="fa-solid fa-gamepad"></i>

                        <span>
                            ${currentQuestion}/${totalQuestions}
                        </span>

                    </div>

                </div>


                <!-- Question -->

                <h2 class="question-text">
                    ${this.question}
                </h2>


                <!-- Answers -->

                <div class="answers-grid">

                    ${this.allAnswers.map(
                        (answer, index) => `

                        <button
                            type="button"
                            class="answer-btn"
                            data-answer="${answer}">

                            <span class="answer-key">
                                ${index + 1}
                            </span>

                            <span class="answer-text">
                                ${answer}
                            </span>

                        </button>

                    `
                    ).join("")}

                </div>


                <!-- Score -->

                <div class="score-panel">

                    <div class="score-item">

                        <div class="score-item-label">
                            Score
                        </div>

                        <div class="score-item-value">
                            ${this.quiz.player.score}
                        </div>

                    </div>

                </div>

            </div>
        `;


        // Add events
        this.addEventListeners();

        // Start timer
        this.startTimer();
    }


    // ============================================
    // ADD EVENT LISTENERS
    // ============================================

    addEventListeners() {

        const answerButtons =
            this.container.querySelectorAll(
                ".answer-btn"
            );


        // Mouse / Touch
        answerButtons.forEach(button => {

            button.addEventListener(
                "click",
                () => this.checkAnswer(button)
            );

        });


        // Keyboard
        document.addEventListener(
            "keydown",
            this.handleKeyDown
        );
    }


    // ============================================
    // KEYBOARD HANDLER
    // ============================================

    handleKeyDown(event) {

        const validKeys = [
            "1",
            "2",
            "3",
            "4"
        ];


        if (!validKeys.includes(event.key)) {
            return;
        }


        if (this.answered) {
            return;
        }


        const index =
            Number(event.key) - 1;


        const answerButtons =
            this.container.querySelectorAll(
                ".answer-btn"
            );


        const selectedButton =
            answerButtons[index];


        if (selectedButton) {
            this.checkAnswer(selectedButton);
        }
    }


    // ============================================
    // REMOVE EVENT LISTENERS
    // ============================================

    removeEventListeners() {

        document.removeEventListener(
            "keydown",
            this.handleKeyDown
        );


        const answerButtons =
            this.container.querySelectorAll(
                ".answer-btn"
            );


        answerButtons.forEach(button => {

            button.replaceWith(
                button.cloneNode(true)
            );

        });
    }


    // ============================================
    // START TIMER
    // ============================================

    startTimer() {

        const timerValue =
            this.container.querySelector(
                ".timer-value"
            );


        if (!timerValue) {
            return;
        }


        // Make sure there is no old timer
        this.stopTimer();


        // Reset time
        this.timeRemaining = 30;


        timerValue.textContent =
            `${this.timeRemaining}s`;


        this.timerInterval =
            setInterval(() => {

                this.timeRemaining--;


                timerValue.textContent =
                    `${this.timeRemaining}s`;


                // Warning state
                if (this.timeRemaining <= 10) {

                    const timerBadge =
                        this.container.querySelector(
                            ".timer-badge"
                        );

                    if (timerBadge) {

                        timerBadge.classList.add(
                            "warning"
                        );
                    }
                }


                // Time is up
                if (this.timeRemaining <= 0) {

                    this.stopTimer();

                    this.handleTimeUp();
                }


            }, 1000);
    }


    // ============================================
    // STOP TIMER
    // ============================================

    stopTimer() {

        if (this.timerInterval !== null) {

            clearInterval(
                this.timerInterval
            );

            this.timerInterval = null;
        }
    }


    // ============================================
    // HANDLE TIME UP
    // ============================================

    handleTimeUp() {

        // Prevent another answer
        if (this.answered) {
            return;
        }


        this.answered = true;


        // Remove events
        this.removeEventListeners();


        // Show correct answer
        this.highlightCorrectAnswer();


        // Show TIME'S UP message
        const answersGrid =
            this.container.querySelector(
                ".answers-grid"
            );


        if (answersGrid) {

            const timeUpMessage =
                document.createElement("div");

            timeUpMessage.className =
                "time-up-card";


            timeUpMessage.innerHTML = `

                <div class="time-up-icon">

                    <i class="fa-solid fa-clock"></i>

                </div>

                <h3>
                    TIME'S UP!
                </h3>

                <p>
                    You ran out of time
                    for this question.
                </p>

            `;


            answersGrid.appendChild(
                timeUpMessage
            );
        }


        // Move to next question
        this.animateQuestion(1500);
    }


    // ============================================
    // CHECK ANSWER
    // ============================================

    checkAnswer(choiceElement) {

        // Already answered
        if (this.answered) {
            return;
        }


        // Mark as answered
        this.answered = true;


        // Stop timer
        this.stopTimer();


        // Get selected answer
        const selectedAnswer =
            choiceElement.dataset.answer;


        // Compare answers
        const isCorrect =
            selectedAnswer.trim().toLowerCase() ===
            this.correctAnswer.trim().toLowerCase();


        // Correct answer
        if (isCorrect) {

            choiceElement.classList.add(
                "correct"
            );


            // Increase score
            this.quiz.incrementScore();

        }

        // Wrong answer
        else {

            choiceElement.classList.add(
                "wrong"
            );


            // Show correct answer
            this.highlightCorrectAnswer();
        }


        // Disable all buttons
        const answerButtons =
            this.container.querySelectorAll(
                ".answer-btn"
            );


        answerButtons.forEach(button => {

            button.classList.add(
                "disabled"
            );

            button.disabled = true;

        });


        // Remove keyboard listener
        this.removeEventListeners();


        // Move to next question
        this.animateQuestion(1500);
    }


    // ============================================
    // HIGHLIGHT CORRECT ANSWER
    // ============================================

    highlightCorrectAnswer() {

        const answerButtons =
            this.container.querySelectorAll(
                ".answer-btn"
            );


        answerButtons.forEach(button => {

            const answer =
                button.dataset.answer;


            if (
                answer.trim().toLowerCase() ===
                this.correctAnswer.trim().toLowerCase()
            ) {

                button.classList.remove(
                    "disabled"
                );

                button.classList.add(
                    "correct-reveal"
                );
            }

        });
    }


    // ============================================
    // GET NEXT QUESTION
    // ============================================

    getNextQuestion() {

        // Move to next question
        const hasNextQuestion =
            this.quiz.nextQuestion();


        // There is another question
        if (hasNextQuestion) {

            const nextQuestion =
                new Question(
                    this.quiz,
                    this.container,
                    this.onQuizEnd
                );


            nextQuestion.displayQuestion();

            return;
        }


        // Quiz finished
        this.stopTimer();


        const results =
            this.quiz.endQuiz();


        // If Quiz.endQuiz() returns HTML
        if (typeof results === "string") {

            this.container.innerHTML =
                results;

        }

        // If Quiz.endQuiz() returns an object
        else if (results) {

            this.showResults(results);

        }


        // Play Again
        const playAgainButton =
            this.container.querySelector(
                "#playAgain"
            );


        if (playAgainButton) {

            playAgainButton.addEventListener(
                "click",
                () => {

                    if (this.onQuizEnd) {
                        this.onQuizEnd();
                    }

                }
            );
        }
    }


    // ============================================
    // SHOW RESULTS
    // ============================================

    showResults(results) {

        const playerName =
            results.playerName ||
            this.quiz.player.name ||
            "Player";


        const score =
            results.score ??
            this.quiz.player.score;


        const total =
            results.totalQuestions ||
            this.quiz.numberOfQuestions;


        const wrong =
            total - score;


        const accuracy =
            total > 0
                ? Math.round(
                    (score / total) * 100
                )
                : 0;


        this.container.innerHTML = `

            <div class="game-card results-card">

                <div class="results-header">

                    <div class="results-icon">

                        <i class="fa-solid fa-trophy"></i>

                    </div>


                    <h2>
                        Congratulations!
                    </h2>


                    <p>
                        Great job,
                        ${playerName}!
                    </p>

                </div>


                <div class="results-score">

                    <div class="score-label">
                        Final Score
                    </div>


                    <div class="score-value">
                        ${score}/${total}
                    </div>

                </div>


                <div class="results-stats">

                    <div class="result-stat correct">

                        <span>
                            Correct
                        </span>

                        <strong>
                            ${score}
                        </strong>

                    </div>


                    <div class="result-stat wrong">

                        <span>
                            Wrong
                        </span>

                        <strong>
                            ${wrong}
                        </strong>

                    </div>


                    <div class="result-stat accuracy">

                        <span>
                            Accuracy
                        </span>

                        <strong>
                            ${accuracy}%
                        </strong>

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


    // ============================================
    // ANIMATE QUESTION
    // ============================================

    animateQuestion(duration = 1500) {

        const questionCard =
            this.container.querySelector(
                ".question-card"
            );


        if (questionCard) {

            questionCard.classList.add(
                "exit"
            );
        }


        setTimeout(() => {

            this.getNextQuestion();

        }, duration);
    }

}



















/**
 * ============================================
 * QUESTION CLASS
 * ============================================
 * 
 * This class handles displaying and interacting with a single question.
 * 
 * PROPERTIES TO CREATE:
 * - quiz (Quiz) - Reference to the Quiz instance
 * - container (HTMLElement) - DOM element to render into
 * - onQuizEnd (Function) - Callback when quiz ends
 * - questionData (object) - Current question from quiz.getCurrentQuestion()
 * - index (number) - Current question index
 * - question (string) - The decoded question text
 * - correctAnswer (string) - The decoded correct answer
 * - category (string) - The decoded category name
 * - wrongAnswers (array) - Decoded incorrect answers
 * - allAnswers (array) - Shuffled array of all answers
 * - answered (boolean) - Has user answered? Starts false
 * - timerInterval (number) - The setInterval ID
 * - timeRemaining (number) - Seconds left, starts at 30 seconds
 * 
 * METHODS TO IMPLEMENT:
 * - constructor(quiz, container, onQuizEnd)
 * - decodeHtml(html) - Decode HTML entities like &amp;
 * - shuffleAnswers() - Shuffle answers randomly
 * - getProgress() - Calculate progress percentage
 * - displayQuestion() - Render the question HTML
 * - addEventListeners() - Add click handlers to answers
 * - removeEventListeners() - Cleanup handlers
 * - startTimer() - Start countdown
 * - stopTimer() - Stop countdown
 * - handleTimeUp() - When timer reaches 0
 * - checkAnswer(choiceElement) - Check if answer is correct
 * - highlightCorrectAnswer() - Show correct answer
 * - getNextQuestion() - Load next or show results
 * - animateQuestion(duration) - Transition to next
 * 
 * HTML ENTITIES:
 * The API returns text with HTML entities like:
 * - &amp; should become &
 * - &quot; should become "
 * - &#039; should become '
 * 
 * Use this trick to decode:
 * const doc = new DOMParser().parseFromString(html, 'text/html');
 * return doc.documentElement.textContent;
 * 
 * SHUFFLE ALGORITHM (Fisher-Yates):
 * for (let i = array.length - 1; i > 0; i--) {
 *   const j = Math.floor(Math.random() * (i + 1));
 *   [array[i], array[j]] = [array[j], array[i]];
 * }
 */



// export default class Question {
  
  // TODO: Create constructor(quiz, container, onQuizEnd)
  // 1. Store the three parameters
  // 2. Get question data: this.questionData = quiz.getCurrentQuestion()
  // 3. Store index: this.index = quiz.currentQuestionIndex
  // 4. Decode and store: question, correctAnswer, category
  // 5. Decode wrong answers (use .map())
  // 6. Shuffle all answers
  // 7. Initialize: answered = false, timerInterval = null, timeRemaining
  
  
  // TODO: Create decodeHtml(html) method
  // Use DOMParser to decode HTML entities
  
  
  // TODO: Create shuffleAnswers() method
  // 1. Combine wrongAnswers and correctAnswer into one array
  // 2. Shuffle using Fisher-Yates algorithm
  // 3. Return shuffled array
  
  
  // TODO: Create getProgress() method
  // Calculate: ((index + 1) / quiz.numberOfQuestions) * 100
  // Round to whole number
  
  
  // TODO: Create displayQuestion() method
  // 1. Create HTML string for the question card
  //    (See index.html for the structure to use)
  // 2. Use template literals with ${} for dynamic data
  // 3. Set this.container.innerHTML = yourHTML
  // 4. Call this.addEventListeners()
  // 5. Call this.startTimer()
  
  
  // TODO: Create addEventListeners() method
  // 1. Get all answer buttons: document.querySelectorAll('.answer-btn')
  // 2. Add click event to each: call this.checkAnswer(button)
  // 3. Add keyboard support: listen for keys 1-4
  //    Valid keys are: ['1', '2', '3', '4']
  
  
  // TODO: Create removeEventListeners() method
  // Remove any keyboard listeners you added
  
  
  // TODO: Create startTimer() method
  // 1. Get timer display element
  // 2. Use setInterval to run every 1000ms (1 second)
  // 3. Decrement timeRemaining
  // 4. Update the display
  // 5. If timeRemaining <= 10 seconds, add 'warning' class
  // 6. If timeRemaining <= 0, call stopTimer() and handleTimeUp()
  
  
  // TODO: Create stopTimer() method
  // Use clearInterval(this.timerInterval)
  
  
  // TODO: Create handleTimeUp() method
  // 1. Set answered = true
  // 2. Call removeEventListeners()
  // 3. Show correct answer (add 'correct' class)
  // 4. Show "TIME'S UP!" message
  // 5. Call animateQuestion() after a delay
  
  
  // TODO: Create checkAnswer(choiceElement) method
  // 1. If already answered, return early
  // 2. Set answered = true
  // 3. Stop the timer
  // 4. Get selected answer from data-answer attribute
  // 5. Compare with correctAnswer (case insensitive)
  // 6. If correct: add 'correct' class, call quiz.incrementScore()
  // 7. If wrong: add 'wrong' class, call highlightCorrectAnswer()
  // 8. Disable other buttons (add 'disabled' class)
  // 9. Call animateQuestion()
  
  
  // TODO: Create highlightCorrectAnswer() method
  // Find the button with correct answer and add 'correct-reveal' class
  
  
  // TODO: Create getNextQuestion() method
  // 1. Call quiz.nextQuestion()
  // 2. If returns true: create new Question and display it
  // 3. If returns false: show results using quiz.endQuiz()
  //    Also add click listener to Play Again button
  
  
  // TODO: Create animateQuestion(duration) method
  // 1. Wait for 1500ms (transition delay)
  // 2. Add 'exit' class to question card
  // 3. Wait for duration
  // 4. Call getNextQuestion()
  
// }
