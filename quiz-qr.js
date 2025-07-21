// quiz-qr.js
// Requires: https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js, https://www.gstatic.com/firebasejs/8.10.0/firebase-database.js, firebase-config.js, qrcode.min.js

function generateQRCodeOnThankYou() {
  const canvas = document.getElementById('thankyou-qr-canvas');
  if (window.QRCode) {
    // You can replace this with dynamic user info if needed
    const qrText = 'Coca-Cola HBC Visitor Pass';
    QRCode.toCanvas(canvas, qrText, { width: 200 }, function (error) {
      if (error) console.error(error);
    });
  }
}
window.generateQRCodeOnThankYou = generateQRCodeOnThankYou;

function saveQuizTakerInfo(personalInfo, score, callback) {
  // Generate a unique ID
  const id = Date.now().toString(36) + Math.random().toString(36).substring(2,8);
  const data = { ...personalInfo, score };
  firebase.database().ref('quiz-takers/' + id).set(data, function(error) {
    if (error) {
      alert('Failed to save info. Please try again.');
      callback(null);
    } else {
      callback(id);
    }
  });
}

function generateQRCode(id, elementId) {
  const url = window.location.origin + '/display-info.html?id=' + encodeURIComponent(id);
  QRCode.toCanvas(document.getElementById(elementId), url, { width: 200 }, function (error) {
    if (error) console.error(error);
  });
  document.getElementById(elementId + '-link').innerHTML = `<a href="${url}" target="_blank">${url}</a>`;
}

// Example usage after quiz is completed:
// saveQuizTakerInfo({ name: ..., email: ... }, score, function(id) {
//   generateQRCode(id, 'qr-code-canvas');
// });
