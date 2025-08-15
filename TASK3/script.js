// Quiz Data
const quizData = [
    {
        question: "What does DOM stand for?",
        options: ["Document Object Model", "Data Object Management", "Digital Ordinance Model"],
        answer: "Document Object Model"
    },
    {
        question: "Which method is used to select an element by ID in JavaScript?",
        options: ["getElementById()", "querySelectorAll()", "getElementsByClassName()"],
        answer: "getElementById()"
    }
];

// Display Quiz
const quizContainer = document.getElementById("quiz");
quizData.forEach((q, index) => {
    const div = document.createElement("div");
    div.innerHTML = `
        <p>${q.question}</p>
        ${q.options.map(opt => `
            <label>
                <input type="radio" name="q${index}" value="${opt}"> ${opt}
            </label><br>
        `).join("")}
    `;
    quizContainer.appendChild(div);
});

// Submit Quiz
document.getElementById("submitQuiz").addEventListener("click", () => {
    let score = 0;
    quizData.forEach((q, index) => {
        const selected = document.querySelector(`input[name="q${index}"]:checked`);
        if (selected && selected.value === q.answer) {
            score++;
        }
    });
    document.getElementById("quizResult").textContent = `You scored ${score} out of ${quizData.length}`;
});

// Fetch Joke from API
document.getElementById("getJokeBtn").addEventListener("click", async () => {
    try {
        const res = await fetch("https://official-joke-api.appspot.com/random_joke");
        const data = await res.json();
        document.getElementById("jokeText").textContent = `${data.setup} - ${data.punchline}`;
    } catch (error) {
        document.getElementById("jokeText").textContent = "Failed to fetch joke.";
    }
});

// Image Carousel
const carouselImage = document.getElementById("carouselImage");
let imgIndex = 1;
document.getElementById("prevBtn").addEventListener("click", () => {
    imgIndex = imgIndex > 1 ? imgIndex - 1 : 5;
    carouselImage.src = `https://picsum.photos/500/300?random=${imgIndex}`;
});
document.getElementById("nextBtn").addEventListener("click", () => {
    imgIndex = imgIndex < 5 ? imgIndex + 1 : 1;
    carouselImage.src = `https://picsum.photos/500/300?random=${imgIndex}`;
});
