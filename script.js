// Coca-Cola HBC Safety Briefing - Fixed Page Management
// ScrollReveal for entrance animations
// QRCode.js already loaded via CDN

// Global state variables
let currentRuleIndex = 0;
let correctAnswersCount = 0;
let currentVisitorId = null;
let videoWatched = false;

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
  { type: 'rule', id: 'rule11' }
];

// --- Utility Functions for UI Control ---
function showPage(pageId) {
  // Hide all page sections
  const allSections = document.querySelectorAll('.page-section');
  allSections.forEach(section => {
    section.classList.remove('active');
  });

  // Show only the target section
  const targetSection = document.getElementById(pageId);
  if (targetSection) {
    targetSection.classList.add('active');
    window.scrollTo(0, 0);
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
  // Initialize with welcome page visible
  showPage('welcome');

  if (window.ScrollReveal) {
    ScrollReveal().reveal('.hero', { distance: '60px', duration: 1200, origin: 'top', opacity: 0, delay: 100 });
  }

  // Nav link click handlers
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const sectionId = this.getAttribute('data-section');
      showPage(sectionId);
      
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      this.classList.add('active');
    });
  });

  // Video ended handler
  const safetyVideo = document.getElementById('safety-video');
  if (safetyVideo) {
    safetyVideo.addEventListener('ended', function() {
      videoWatched = true;
      const nextButton = document.querySelector('#next-btn');
      if (nextButton) {
        nextButton.disabled = false;
        nextButton.style.opacity = '1';
      }
    });
  }

  // Add event listeners to radio inputs to toggle 'selected' class on labels
  const radioOptions = document.querySelectorAll('.radio-option input[type="radio"]');
  radioOptions.forEach(radio => {
    radio.addEventListener('change', () => {
      const name = radio.name;
      // Remove 'selected' class from all labels with the same name
      document.querySelectorAll(`input[name="${name}"]`).forEach(input => {
        if (input.parentElement.classList.contains('selected')) {
          input.parentElement.classList.remove('selected');
        }
      });
      // Add 'selected' class to the checked radio's label
      if (radio.checked) {
        radio.parentElement.classList.add('selected');
      }
    });
  });
});

function showVisitorForm() {
  showPage('visitor-form');
}

function handleVisitorRegistration() {
  const fullname = document.getElementById('fullname').value;
  const nationalid = document.getElementById('nationalid').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  const bloodtype = document.getElementById('bloodtype').value;

  if (!fullname || !nationalid || !email || !phone || !bloodtype) {
    alert('Please fill in all visitor information fields.');
    return;
  }

  const nextButton = event.target;
  nextButton.disabled = true;
  nextButton.textContent = 'Saving...';

  registerVisitor()
    .then(success => {
      if (success) {
        showInstructions();
      } else {
        alert("Registration failed. Please try again.");
      }
    })
    .catch(error => {
      console.error('Registration failed:', error);
      alert("An error occurred while saving your information. Please try again.");
    })
    .finally(() => {
      nextButton.disabled = false;
      nextButton.textContent = 'Next';
    });
}

function registerVisitor() {
  const fullname = document.getElementById('fullname').value;
  const nationalid = document.getElementById('nationalid').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  const bloodtype = document.getElementById('bloodtype').value;

  if (typeof database === 'undefined') {
    alert('Firebase database not initialized. Please refresh and try again.');
    return Promise.resolve(false);
  }

  const visitorData = {
    fullname,
    nationalid,
    email,
    phone,
    bloodtype,
    timestamp: new Date().toISOString()
  };

  try {
    const newVisitorRef = database.ref('visitors').push();
    currentVisitorId = newVisitorRef.key;
    
    return newVisitorRef.set(visitorData)
      .then(() => {
        console.log("Visitor data saved successfully with ID:", currentVisitorId);
        return true;
      })
      .catch(error => {
        console.error("Error saving visitor data:", error);
        if (error.code === 'PERMISSION_DENIED') {
          alert("Permission denied. Please check Firebase database rules.");
        } else if (error.code === 'NETWORK_ERROR') {
          alert("Network error. Please check your internet connection.");
        } else {
          alert("Error saving data: " + error.message + ". Please try again.");
        }
        return false;
      });
  } catch (error) {
    console.error('Exception in registerVisitor:', error);
    alert('Unexpected error: ' + error.message);
    return Promise.resolve(false);
  }
}

function showInstructions() {
  showPage('instructions');
  videoWatched = false;
  const nextButton = document.querySelector('#next-btn');
  if (nextButton) {
    nextButton.disabled = true;
    nextButton.style.opacity = '0.5';
  }
}

function startRulesQuestions() {
  if (!videoWatched) {
    alert("Please watch the safety video before proceeding.");
    return;
  }
  
  correctAnswersCount = 0;
  currentRuleIndex = 0;
  displayCurrentRuleOrQuestion();
}

function displayCurrentRuleOrQuestion() {
  if (currentRuleIndex < rulesAndQuestions.length) {
    const currentPageData = rulesAndQuestions[currentRuleIndex];
    
    showPage(currentPageData.id);
      
    // Reset radio buttons for questions
    if (currentPageData.type === 'question') {
      const currentPageElement = document.getElementById(currentPageData.id);
      const form = currentPageElement.querySelector('form');
      if (form) form.reset();
      const tryAgainSpan = currentPageElement.querySelector('.try-again');
      if (tryAgainSpan) tryAgainSpan.style.display = 'none';
    }
      
    // Generate QR code for rule11
    if (currentPageData.id === 'rule11') {
      if (currentVisitorId) {
        const fullURL = `${window.location.origin}${window.location.pathname.replace('index.html', '')}display-info.html?id=${currentVisitorId}`;
        generateQRCode(fullURL, 'rule11-qrcanvas');
      } else {
        console.error("No visitor ID found for QR code generation.");
        generateQRCode("Error: Visitor ID missing.", 'rule11-qrcanvas');
      }
    }
      
    updateProgressBar();
  } else {
    endQuiz();
  }
}

function nextPage() {
  currentRuleIndex++;
  if (currentRuleIndex >= rulesAndQuestions.length) {
    endQuiz();
  } else {
    displayCurrentRuleOrQuestion();
  }
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
    nextPage();
  } else {
    tryAgainSpan.textContent = 'Try again';
    tryAgainSpan.style.display = 'block';
    selectedOption.checked = false;
  }
}

function endQuiz() {
  if (correctAnswersCount >= 8) {
    showPage('result');
    if (currentVisitorId) {
      const fullURL = `${window.location.origin}${window.location.pathname.replace('index.html', '')}display-info.html?id=${currentVisitorId}`;
      generateQRCode(fullURL, 'result-qrcanvas');
    } else {
      console.error("No visitor ID found for QR code generation.");
      generateQRCode("Error: Visitor ID missing.", 'result-qrcanvas');
    }
  } else {
    showPage('fail');
  }
}

function generateQRCode(text, canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) {
    console.error(`Target canvas with ID '${canvasId}' not found for QR code generation.`);
    return;
  }

  const context = canvas.getContext('2d');
  context.clearRect(0, 0, canvas.width, canvas.height);

  if (window.QRCode) {
    QRCode.toCanvas(canvas, text, { width: 200, height: 200 }, function (error) {
      if (error) {
        console.error("Error generating QR code:", error);
      } else {
        console.log("QR code generated successfully.");
      }
    });
  } else {
    console.error("QRCode.js library not loaded.");
  }
}

function downloadQRCode() {
  const resultCanvas = document.getElementById("result-qrcanvas");
  const rule11Canvas = document.getElementById("rule11-qrcanvas");
  
  let canvas = null;
  if (resultCanvas && resultCanvas.parentElement.closest('.page-section.active')) {
    canvas = resultCanvas;
  } else if (rule11Canvas && rule11Canvas.parentElement.closest('.page-section.active')) {
    canvas = rule11Canvas;
  }

  if (canvas) {
    const dataURL = canvas.toDataURL("image/png");
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = `CocaCola_HBC_Visitor_Pass_${currentVisitorId || 'unknown'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    console.error("No visible QR code canvas found to download.");
  }
}

// Expose functions globally
window.showVisitorForm = showVisitorForm;
window.handleVisitorRegistration = handleVisitorRegistration;
window.registerVisitor = registerVisitor;
window.showInstructions = showInstructions;
window.startRulesQuestions = startRulesQuestions;
window.nextPage = nextPage;
window.checkAnswer = checkAnswer;
window.downloadQRCode = downloadQRCode;