// Coca-Cola HBC Safety Briefing - Animations and Logic
// ScrollReveal for entrance animations
// QRCode.js already loaded via CDN

// Animate sections on scroll
window.addEventListener('DOMContentLoaded', function () {
  if (window.ScrollReveal) {
    ScrollReveal().reveal('.hero', { distance: '60px', duration: 1200, origin: 'top', opacity: 0, delay: 100 });
    // Do NOT reveal #instructions, #quiz, #result, #fail, or #visitor-form
  }
  // Nav link click: show only the relevant section, highlight active
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
      const section = this.getAttribute('data-section');
      e.preventDefault();
      // Hide all main sections
      document.getElementById('welcome').classList.remove('hidden');
      document.getElementById('visitor-form').classList.add('hidden');
      document.getElementById('instructions').classList.add('hidden');
      document.getElementById('quiz').classList.add('hidden');
      document.getElementById('result').classList.add('hidden');
      document.getElementById('fail').classList.add('hidden');
      // Show the selected section
      if (section === 'welcome') {
        document.getElementById('welcome').classList.remove('hidden');
      } else if (section === 'instructions') {
        document.getElementById('instructions').classList.remove('hidden');
      } else if (section === 'quiz') {
        document.getElementById('quiz').classList.remove('hidden');
      }
      // Scroll to section
      const target = document.getElementById(section);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
      // Set active class
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      this.classList.add('active');
    });
  });

  // Highlight nav link as active on scroll
  window.addEventListener('scroll', function() {
    const sections = ['welcome','instructions','quiz'];
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

// --- App Logic (ported from original) ---
function showVisitorForm() {
  document.getElementById("welcome").classList.add("hidden");
  document.getElementById("visitor-form").classList.remove("hidden");
  // Do NOT use ScrollReveal here
}

function showInstructions() {
  document.getElementById("visitor-form").classList.add("hidden");
  document.getElementById("fail").classList.add("hidden");
  document.getElementById("instructions").classList.remove("hidden");
}

function startQuiz() {
  document.getElementById("instructions").classList.add("hidden");
  document.getElementById("quiz").classList.remove("hidden");
}

function submitQuiz() {
  const correctAnswers = {
    q1: "a", q2: "b", q3: "b", q4: "a", q5: "a",
    q6: "a", q7: "b", q8: "a", q9: "a", q10: "a"
  };
  const form = document.getElementById("quizForm");
  let score = 0;
  for (let key in correctAnswers) {
    const answer = form[key].value;
    if (answer === correctAnswers[key]) score++;
  }
  document.getElementById("quiz").classList.add("hidden");
  if (score >= 8) {
    document.getElementById("result").classList.remove("hidden");
    generateQRCode("Access Granted - Coca-Cola HBC Visitor Pass");
  } else {
    document.getElementById("fail").classList.remove("hidden");
  }
}

function generateQRCode(text) {
  const canvas = document.getElementById("qrcanvas");
  if (window.QRCode) {
    QRCode.toCanvas(canvas, text, function (error) {
      if (error) console.error(error);
    });
  }
}

// Expose functions globally
window.showVisitorForm = showVisitorForm;
window.showInstructions = showInstructions;
window.startQuiz = startQuiz;
window.submitQuiz = submitQuiz;
window.generateQRCode = generateQRCode;
