import Player from "js/player.js";
import Quiz from "js/quiz.js";
import Question from "js/question.js";


// ============================================
// DOM ELEMENTS
// ============================================

const quizOptionsForm =
    document.getElementById("quizOptions");

const playerNameInput =
    document.getElementById("playerName");

const categoryInput =
    document.getElementById("categoryMenu");

const difficultyOptions =
    document.getElementById("difficultyOptions");

const questionsNumber =
    document.getElementById("questionsNumber");

const startQuizBtn =
    document.getElementById("startQuiz");

const questionsContainer =
    document.querySelector(".questions-container");


// ============================================
// CURRENT QUIZ
// ============================================

let currentQuiz = null;


// ============================================
// SHOW LOADING
// ============================================

function showLoading() {

    questionsContainer.innerHTML = `

        <div class="loading-overlay">

            <div class="loading-spinner">

                <i class="fa-solid fa-spinner fa-spin"></i>

            </div>

            <p>
                Loading questions...
            </p>

        </div>

    `;
}


// ============================================
// HIDE LOADING
// ============================================

function hideLoading() {

    const loading =
        questionsContainer.querySelector(
            ".loading-overlay"
        );

    if (loading) {
        loading.remove();
    }
}


// ============================================
// SHOW ERROR
// ============================================

function showError(message) {

    questionsContainer.innerHTML = `

        <div class="error-card">

            <div class="error-icon">

                <i class="fa-solid fa-triangle-exclamation"></i>

            </div>

            <h2>
                Something went wrong
            </h2>

            <p>
                ${message}
            </p>

            <button
                type="button"
                class="retry-btn"
                id="retryQuiz">

                <i class="fa-solid fa-rotate-right"></i>

                Try Again

            </button>

        </div>

    `;


    const retryBtn =
        document.getElementById(
            "retryQuiz"
        );


    if (retryBtn) {

        retryBtn.addEventListener(
            "click",
            resetToStart
        );

    }
}


// ============================================
// SHOW FORM ERROR
// ============================================

function showFormError(message) {

    const oldError =
        quizOptionsForm.querySelector(
            ".form-error"
        );


    if (oldError) {
        oldError.remove();
    }


    const error =
        document.createElement("div");


    error.className =
        "form-error";


    error.textContent =
        message;


    startQuizBtn.before(error);


    setTimeout(() => {

        error.classList.add(
            "fade-out"
        );


        setTimeout(() => {

            if (error) {
                error.remove();
            }

        }, 300);

    }, 2700);
}


// ============================================
// VALIDATE FORM
// ============================================

function validateForm() {

    const value =
        questionsNumber.value.trim();


    // No value
    if (!value) {

        return {
            isValid: false,
            error:
                "Please enter the number of questions."
        };

    }


    const number =
        Number(value);


    // Minimum
    if (number < 1) {

        return {
            isValid: false,
            error:
                "Minimum number of questions is 1."
        };

    }


    // Maximum
    if (number > 50) {

        return {
            isValid: false,
            error:
                "Maximum number of questions is 50."
        };

    }


    return {
        isValid: true,
        error: null
    };
}


// ============================================
// RESET TO START
// ============================================

function resetToStart() {

    currentQuiz = null;


    questionsContainer.innerHTML =
        "";


    quizOptionsForm.reset();


    quizOptionsForm.classList.remove(
        "hidden"
    );
}


// ============================================
// START QUIZ
// ============================================

async function startQuiz() {

    // Validate form
    const validation =
        validateForm();


    if (!validation.isValid) {

        showFormError(
            validation.error
        );

        return;
    }


    // Get values
    const playerName =
        playerNameInput.value.trim() ||
        "Player";


    const category =
        categoryInput.value;


    const difficulty =
        difficultyOptions.value;


    const numberOfQuestions =
        Number(
            questionsNumber.value
        );


    // ========================================
    // CREATE PLAYER
    // ========================================

    const player =
        new Player(playerName);


    // ========================================
    // CREATE QUIZ
    // ========================================

    currentQuiz =
        new Quiz(
            player,
            category,
            difficulty,
            numberOfQuestions
        );


    // Hide form
    quizOptionsForm.classList.add(
        "hidden"
    );


    // Show loading
    showLoading();


    try {

        // Get questions from API
        await currentQuiz.getQuestions();


        // Hide loading
        hideLoading();


        // Check questions
        if (
            !currentQuiz.questions.length
        ) {

            throw new Error(
                "No questions were found."
            );
        }


        // ====================================
        // CREATE FIRST QUESTION
        // ====================================

        const question =
            new Question(
                currentQuiz,
                questionsContainer,
                resetToStart
            );


        // Display question
        question.displayQuestion();

    }

    catch (error) {

        hideLoading();

        console.error(error);


        showError(
            error.message ||
            "Failed to load quiz."
        );
    }
}


// ============================================
// START BUTTON
// ============================================

startQuizBtn.addEventListener(
    "click",
    startQuiz
);


// ============================================
// ENTER KEY
// ============================================

questionsNumber.addEventListener(
    "keydown",
    (event) => {

        if (event.key === "Enter") {

            startQuiz();

        }

    }
);






/**
 * ============================================
 * MAIN ENTRY POINT (index.js)
 * ============================================
 * 
 * This file is the starting point of your application.
 * It handles:
 * - Getting DOM elements
 * - Form validation
 * - Starting the quiz
 * - Loading/error states
 * 
 * DOM ELEMENTS TO GET:
 * - quizOptionsForm: #quizOptions
 * - playerNameInput: #playerName
 * - categoryInput: #categoryMenu
 * - difficultyOptions: #difficultyOptions
 * - questionsNumber: #questionsNumber
 * - startQuizBtn: #startQuiz
 * - questionsContainer: .questions-container
 * 
 * FUNCTIONS TO IMPLEMENT:
 * - showLoading() - Display loading spinner
 * - hideLoading() - Remove loading spinner
 * - showError(message) - Display error card
 * - validateForm() - Check if form is valid
 * - showFormError(message) - Show error on form
 * - resetToStart() - Reset to initial state
 * - startQuiz() - Main function to start quiz
 */



// ============================================
// TODO: Get DOM Element References
// ============================================
// Use document.getElementById() and document.querySelector()


// ============================================
// TODO: Create variable to store current quiz
// ============================================
// let currentQuiz = null;


// ============================================
// TODO: Create showLoading() function
// ============================================
// Set questionsContainer.innerHTML to loading HTML
// See index.html for the HTML structure


// ============================================
// TODO: Create hideLoading() function
// ============================================
// Find and remove the loading overlay


// ============================================
// TODO: Create showError(message) function
// ============================================
// Set questionsContainer.innerHTML to error HTML
// Include the message parameter in the display
// Add click listener to retry button that calls resetToStart()


// ============================================
// TODO: Create validateForm() function
// ============================================
// Return object: { isValid: boolean, error: string | null }
// Check:
// 1. questionsNumber has a value
// 2. Value is >= 1 (minimum questions)
// 3. Value is <= 50 (maximum questions)


// ============================================
// TODO: Create showFormError(message) function
// ============================================
// Create error div with class 'form-error'
// Insert before the start button
// Remove after 3 seconds with fade effect


// ============================================
// TODO: Create resetToStart() function
// ============================================
// 1. Clear questionsContainer
// 2. Reset form values
// 3. Show the form (remove 'hidden' class)
// 4. Set currentQuiz = null


// ============================================
// TODO: Create async startQuiz() function
// ============================================
// This is the main function, called when Start button is clicked
//
// Steps:
// 1. Validate the form
// 2. If not valid, show error and return
// 3. Get form values:
//    - playerName (use 'Player' if empty)
//    - category
//    - difficulty
//    - numberOfQuestions
// 4. Create new Quiz instance
// 5. Hide the form (add 'hidden' class)
// 6. Show loading spinner
// 7. Try to fetch questions:
//    - await currentQuiz.getQuestions()
//    - Hide loading
//    - Check if questions exist
//    - Create first Question and display it
// 8. Catch any errors:
//    - Hide loading
//    - Show error message


// ============================================
// TODO: Add Event Listeners
// ============================================
// 1. startQuizBtn click -> call startQuiz()
// 2. questionsNumber keydown -> if Enter, call startQuiz()

