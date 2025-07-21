// JavaScript for navigating rule and question pages
let currentPage = 0;
const totalPages = 21; // 10 rules + 10 questions + QR page as rule11

function showPage(pageNum) {
  // Hide all rules and questions
  for (let i = 1; i <= 11; i++) {
    const rule = document.getElementById('rule' + i);
    const question = document.getElementById('question' + i);
    if (rule) rule.style.display = 'none';
    if (question) question.style.display = 'none';
  }
  // Show rule or question
  if (pageNum >= 1 && pageNum <= 21) {
    if (pageNum % 2 === 1 && pageNum <= 19) {
      // Odd: rule (1-10)
      const ruleNum = Math.ceil(pageNum / 2);
      document.getElementById('rule' + ruleNum).style.display = 'flex';
    } else if (pageNum % 2 === 0 && pageNum <= 20) {
      // Even: question (1-10)
      const questionNum = pageNum / 2;
      document.getElementById('question' + questionNum).style.display = 'flex';
    } else if (pageNum === 21) {
      // Show QR page as rule11
      document.getElementById('rule11').style.display = 'flex';
      // Optionally trigger QR code generation here
      if (window.generateQRCodeOnThankYou) {
        window.generateQRCodeOnThankYou();
      }
    }
    currentPage = pageNum;
  }
}

function nextPage() {
  if (currentPage < totalPages) {
    showPage(currentPage + 1);
  }
}


function startRulesQuestions() {
  document.getElementById('instructions').classList.add('hidden');
  document.getElementById('rule-section').style.display = 'block';
  showPage(1);
}

window.onload = function() {
  // Do not auto-show rules/questions on load
};

function showQRSection() {
  document.getElementById('result-section').classList.add('hidden');
  document.getElementById('qr-section').classList.remove('hidden');
  document.getElementById('qr-section').scrollIntoView({behavior: 'smooth'});
  // Optionally trigger QR code generation here if needed
}
window.showQRSection = showQRSection;
window.showThankYouSection = function() {
  document.getElementById('rule-section').style.display = 'none';
  document.getElementById('qr-section').classList.add('hidden');
  document.getElementById('result-section')?.classList.add('hidden');
  document.getElementById('result')?.classList.add('hidden');
  document.getElementById('fail')?.classList.add('hidden');
  document.getElementById('thankyou-section').classList.remove('hidden');
  document.getElementById('thankyou-section').scrollIntoView({behavior: 'smooth'});
  if (window.generateQRCodeOnThankYou) {
    window.generateQRCodeOnThankYou();
  }
};
function checkAnswer(questionNum, correctValue) {
  const radios = document.getElementsByName('q' + questionNum);
  let selected = null;
  for (const radio of radios) {
    if (radio.checked) selected = radio.value;
  }
  const tryAgain = document.getElementById('try-again-' + questionNum);
  if (selected === correctValue) {
    tryAgain.style.display = 'none';
    nextPage();
  } else {
    tryAgain.style.display = 'inline';
  }
}