// quiz-qr.js
// Requires: https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js, https://www.gstatic.com/firebasejs/8.10.0/firebase-database.js, firebase-config.js, qrcode.min.js

function generateQRCodeOnThankYou() {
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
  
  if (!canvas) {
    // Fallback to the old ID if neither new ID is found
    canvas = document.getElementById('thankyou-qr-canvas');
  }
  
  if (window.QRCode && canvas) {
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
  const canvas = document.getElementById(elementId);
  
  if (canvas) {
    QRCode.toCanvas(canvas, url, { width: 200 }, function (error) {
      if (error) console.error(error);
    });
    
    // Update the link if it exists
    const linkElement = document.getElementById(elementId + '-link');
    if (linkElement) {
      linkElement.innerHTML = `<a href="${url}" target="_blank">${url}</a>`;
    }
  } else {
    console.error(`Canvas element with ID '${elementId}' not found.`);
  }
}

// Example usage after quiz is completed:
// saveQuizTakerInfo({ name: ..., email: ... }, score, function(id) {
//   generateQRCode(id, 'qr-code-canvas');
// });
