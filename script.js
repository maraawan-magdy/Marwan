// Coca-Cola HBC Safety Briefing - Animations and Logic
// ScrollReveal for entrance animations
// QRCode.js already loaded via CDN

// Global state variables
let currentRuleIndex = 0;
let correctAnswersCount = 0;
const rulesAndQuestions = [
  { type: 'rule', id: 'rule1' },
  { type: 'question', id: 'question1', correctAnswer: 'b' },
  { type: 'rule', id: 'rule2' },
  { type: 'question', id: 'question2', correctAnswer: 'a' },
  { type: 'rule', id: 'rule3' },
  { type: 'question', id: 'question3', correctAnswer: 'b' },
  { type: 'rule', id: 'rule4' },
  { type: 'question', id: 'question4', correctAnswer: 'a' },
  { type: 'rule', id: 'rule5' },
  { type: 'question', id: 'question5', correctAnswer: 'a' },
  { type: 'rule', id: 'rule6' },
  { type: 'question', id: 'question6', correctAnswer: 'b' },
  { type: 'rule', id: 'rule7' },
  { type: 'question', id: 'question7', correctAnswer: 'b' },
  { type: 'rule', id: 'rule8' },
  { type: 'question', id: 'question8', correctAnswer: 'b' },
  { type: 'rule', 'id': 'rule9' },
  { type: 'question', id: 'question9', correctAnswer: 'b' },
  { type: 'rule', id: 'rule10' },
  { type: 'question', id: 'question10', correctAnswer: 'a' },
  { type: 'rule', id: 'rule11' } // Final QR page
];

// --- Utility Functions for UI Control ---
function showPage(pageId) {
  const allPages = document.querySelectorAll('[data-page]');
  allPages.forEach(page => {
    page.classList.remove('visible');
    page.classList.add('hidden');
  });

  const targetPage = document.getElementById(pageId);
  if (targetPage) {
    targetPage.classList.remove('hidden');
    // Trigger reflow to ensure transition plays
    void targetPage.offsetWidth; 
    targetPage.classList.add('visible');
  }
}

function updateProgressBar() {
  const progressBar = document.getElementById('progressBar');
  if (progressBar) {
    const progress = ((currentRuleIndex + 1) / rulesAndQuestions.length) * 100;
    progressBar.style.width = `${progress}%`;
  }
}

// --- App Logic ---

window.addEventListener('DOMContentLoaded', function () {
  if (window.ScrollReveal) {
    ScrollReveal().reveal('.hero', { distance: '60px', duration: 1200, origin: 'top', opacity: 0, delay: 100 });
  }

  // Nav link click: show only the relevant section, highlight active
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const sectionId = this.getAttribute('data-section');
      
      // Hide all main sections and show the selected one
      showPage(sectionId);

      // Set active class
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      this.classList.add('active');

      // Scroll to section (if needed, though showPage handles visibility)
      const target = document.getElementById(sectionId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Highlight nav link as active on scroll (simplified for main sections)
  window.addEventListener('scroll', function() {
    const sections = ['welcome', 'instructions']; // Only these are directly navigable from header
    let current = 'welcome';
    for (const id of sections) {
      const el = document.getElementById(id);
      if (el && el.getBoundingClientRect().top <= 80) {
        current = id;
      }
    }
    document.querySelectorAll('.nav-link').forEach(l => {
      l.classList.toggle('active', l.getAttribute('data-section') === current);
    });
  });
});

function showVisitorForm() {
  showPage('visitor-form');
}

function showInstructions() {
  showPage('instructions');
}

function startRulesQuestions() {
  correctAnswersCount = 0; // Reset score
  currentRuleIndex = 0; // Start from the beginning
  showPage('rule-section'); // Show the container for rules/questions
  displayCurrentRuleOrQuestion();
}

function displayCurrentRuleOrQuestion() {
  const ruleSectionContainer = document.getElementById('rule-section');
  const allRuleQuestionPages = ruleSectionContainer.querySelectorAll('.rule-page, .question-page');
  
  allRuleQuestionPages.forEach(page => {
    page.classList.remove('visible');
    page.classList.add('hidden');
  });

  if (currentRuleIndex < rulesAndQuestions.length) {
    const currentPageData = rulesAndQuestions[currentRuleIndex];
    const currentPageElement = document.getElementById(currentPageData.id);
    
    if (currentPageElement) {
      currentPageElement.classList.remove('hidden');
      void currentPageElement.offsetWidth; // Trigger reflow
      currentPageElement.classList.add('visible');

      // Reset radio buttons for questions
      if (currentPageData.type === 'question') {
        const form = currentPageElement.querySelector('form');
        if (form) form.reset();
        const tryAgainSpan = currentPageElement.querySelector('.try-again');
        if (tryAgainSpan) tryAgainSpan.style.display = 'none';
      }
      updateProgressBar();
    }
  } else {
    // All rules/questions completed
    endQuiz();
  }
}

function nextPage() {
  currentRuleIndex++;
  displayCurrentRuleOrQuestion();
}

function checkAnswer(questionNumber, correctAnswer) {
  const questionPageElement = document.getElementById(`question${questionNumber}`);
  const selectedOption = questionPageElement.querySelector(`input[name="q${questionNumber}"]:checked`);
  const tryAgainSpan = questionPageElement.querySelector(`#try-again-${questionNumber}`);

  if (!selectedOption) {
    tryAgainSpan.textContent = 'Please select an answer.';
    tryAgainSpan.style.display = 'block';
    return;
  }

  if (selectedOption.value === correctAnswer) {
    correctAnswersCount++;
    tryAgainSpan.style.display = 'none';
    nextPage(); // Move to the next rule/question
  } else {
    tryAgainSpan.textContent = 'Try again';
    tryAgainSpan.style.display = 'block';
    // Optional: Clear selection to force re-selection
    selectedOption.checked = false;
  }
}

function endQuiz() {
  showPage('rule-section'); // Hide the rule/question container
  if (correctAnswersCount >= 8) { // Assuming 80% pass rate for 10 questions
    showPage('result');
    generateQRCode("Access Granted - Coca-Cola HBC Visitor Pass");
  } else {
    showPage('fail');
  }
}

function generateQRCode(text) {
  const canvas = document.getElementById("qrcanvas");
  if (window.QRCode && canvas) {
    QRCode.toCanvas(canvas, text, function (error) {
      if (error) console.error(error);
    });
  }
}

function downloadQRCode() {
  const canvas = document.getElementById("qrcanvas");
  if (canvas) {
    const dataURL = canvas.toDataURL("image/png");
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'CocaCola_HBC_Visitor_Pass.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

// Expose functions globally
window.showVisitorForm = showVisitorForm;
window.showInstructions = showInstructions;
window.startRulesQuestions = startRulesQuestions;
window.nextPage = nextPage;
window.checkAnswer = checkAnswer;
window.downloadQRCode = downloadQRCode;
