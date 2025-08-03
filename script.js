// Coca-Cola HBC Safety Briefing - Animations and Logic
// ScrollReveal for entrance animations
// QRCode.js already loaded via CDN

// Global state variables
let currentRuleIndex = 0;
let correctAnswersCount = 0;
let currentVisitorId = null; // NEW: To store the ID of the registered visitor

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

// New function to handle visitor registration with proper async handling
function handleVisitorRegistration() {
  const fullname = document.getElementById('fullname').value;
  const nationalid = document.getElementById('nationalid').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  const bloodtype = document.getElementById('bloodtype').value;

  // Input validation
  if (!fullname || !nationalid || !email || !phone || !bloodtype) {
    alert('Please fill in all visitor information fields.');
    return;
  }

  // Disable the button to prevent multiple submissions
  const nextButton = event.target;
  nextButton.disabled = true;
  nextButton.textContent = 'Saving...';

  // Call the async registerVisitor function
  registerVisitor()
    .then(success => {
      if (success) {
        showInstructions(); // Proceed to the next page if registration is successful
      } else {
        alert("Registration failed. Please try again."); // Handle failure
      }
    })
    .catch(error => {
      console.error('Registration failed:', error);
      alert("An error occurred while saving your information. Please try again.");
    })
    .finally(() => {
      // Re-enable the button
      nextButton.disabled = false;
      nextButton.textContent = 'Next';
    });
}


function registerVisitor() {
  console.log('registerVisitor() called');
  
  const fullname = document.getElementById('fullname').value;
  const nationalid = document.getElementById('nationalid').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  const bloodtype = document.getElementById('bloodtype').value;

  console.log('Form data collected:', { fullname, nationalid, email, phone, bloodtype });

  // Check if database is available
  if (typeof database === 'undefined') {
    console.error('Database is not defined!');
    alert('Firebase database not initialized. Please refresh and try again.');
    return Promise.resolve(false);
  }

  console.log('Database is available, proceeding with save...');

  // Define visitorData object
  const visitorData = {
    fullname,
    nationalid,
    email,
    phone,
    bloodtype,
    timestamp: new Date().toISOString()
  };

  console.log('Visitor data to save:', visitorData);

  try {
    // Use Firebase v8 syntax for database operations
    const newVisitorRef = database.ref('visitors').push();
    currentVisitorId = newVisitorRef.key; // Capture the unique ID generated by push()
    
    console.log('Generated visitor ID:', currentVisitorId);
    console.log('Attempting to save to Firebase...');

    // Use .set() on the reference to save the data
    return newVisitorRef.set(visitorData)
      .then(() => {
        console.log("✅ Visitor data saved successfully with ID:", currentVisitorId);
        return true; // Return true on successful save
      })
      .catch(error => {
        console.error("❌ Error saving visitor data:", error);
        console.error("Error code:", error.code);
        console.error("Error message:", error.message);
        
        // More specific error messages
        if (error.code === 'PERMISSION_DENIED') {
          alert("Permission denied. Please check Firebase database rules.");
        } else if (error.code === 'NETWORK_ERROR') {
          alert("Network error. Please check your internet connection.");
        } else {
          alert("Error saving data: " + error.message + ". Please try again.");
        }
        return false; // Return false on error
      });
  } catch (error) {
    console.error('Exception in registerVisitor:', error);
    alert('Unexpected error: ' + error.message);
    return Promise.resolve(false);
  }
}

// ... (rest of your script.js code, including showInstructions, etc.) ...
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
      
      // Generate QR code for rule11
      if (currentPageData.id === 'rule11') {
        if (currentVisitorId) {
          // Use the full URL for the hosted page
          const fullURL = `${window.location.origin}${window.location.pathname.replace('index.html', '')}display-info.html?id=${currentVisitorId}`;
          generateQRCode(fullURL, 'rule11-qrcanvas');
        } else {
          console.error("No visitor ID found for QR code generation.");
          generateQRCode("Error: Visitor ID missing.", 'rule11-qrcanvas');
        }
      }
      
      updateProgressBar();
    }
  } else {
    // All rules/questions completed, now explicitly call endQuiz
    // This path is taken if the last item in rulesAndQuestions is a question
    // and the user answers it correctly.
    endQuiz(); 
  }
}

function nextPage() {
  currentRuleIndex++;
  // If we've gone past the last rule/question, call endQuiz
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
    nextPage(); // Move to the next rule/question or end quiz
  } else {
    tryAgainSpan.textContent = 'Try again';
    tryAgainSpan.style.display = 'block';
    // Optional: Clear selection to force re-selection
    selectedOption.checked = false;
  }
}

// MODIFIED: Simplified endQuiz logic
function endQuiz() {
  // Hide the rule/question container
  showPage('rule-section'); 
  if (correctAnswersCount >= 8) { // Assuming 80% pass rate for 10 questions
    showPage('result'); // Always show the result page if passed
    if (currentVisitorId) {
      // Use the full URL for the hosted page
      const fullURL = `${window.location.origin}${window.location.pathname.replace('index.html', '')}display-info.html?id=${currentVisitorId}`;
      generateQRCode(fullURL, 'result-qrcanvas'); // Generate QR on result-qrcanvas
    } else {
      console.error("No visitor ID found for QR code generation.");
      generateQRCode("Error: Visitor ID missing.", 'result-qrcanvas'); // Fallback QR code
    }
  } else {
    showPage('fail'); // Show fail page if not passed
  }
}



// MODIFIED: generateQRCode now targets a specific canvas by ID
function generateQRCode(text, canvasId) {
  const canvas = document.getElementById(canvasId);

  if (!canvas) {
    console.error(`Target canvas with ID '${canvasId}' not found for QR code generation.`);
    return;
  }

  // Clear previous content on the canvas
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



// MODIFIED: downloadQRCode now targets the visible canvas
function downloadQRCode() {
  // Try to find the visible canvas
  const resultCanvas = document.getElementById("result-qrcanvas");
  const rule11Canvas = document.getElementById("rule11-qrcanvas");
  
  // Check which canvas is in a visible container
  let canvas = null;
  if (resultCanvas && resultCanvas.closest('.container:not(.hidden)')) {
    canvas = resultCanvas;
  } else if (rule11Canvas && rule11Canvas.closest('.container:not(.hidden)')) {
    canvas = rule11Canvas;
  }

  if (canvas) {
    const dataURL = canvas.toDataURL("image/png");
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = `CocaCola_HBC_Visitor_Pass_${currentVisitorId || 'unknown'}.png`; // Include ID in filename
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
