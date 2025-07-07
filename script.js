// Initial user code setup
let userCode = {
  html: "",
  css: "",
  js: "",
};
const codeInput = document.querySelector(".code-input");

// Load initial setup
loadPage();

// Load page with necessary setups
function loadPage() {
  menuToggle();
  previewPage();
  fullScreen();
  displayCode();
  restoreCode();
}

// Restore saved code from localStorage
function restoreCode() {
  let previousCode = JSON.parse(localStorage.getItem("userCode"));
  codeInput.value = previousCode.html;
  displayCode()
  console.log(previousCode.html);
}
// Handle full screen toggle
function fullScreen() {
  const fullScreenBtn = document.querySelector(".full-btn");
  const mainContainer = document.querySelector("main");
  const mainContent = document.querySelector(".main-content");

  fullScreenBtn.addEventListener("click", () => {
    if (
      fullScreenBtn.classList.contains("fa-up-right-and-down-left-from-center")
    ) {
      fullScreenBtn.classList.remove("fa-up-right-and-down-left-from-center");
      fullScreenBtn.classList.add("fa-compress");
    } else {
      fullScreenBtn.classList.remove("fa-compress");
      fullScreenBtn.classList.add("fa-up-right-and-down-left-from-center");
    }

    mainContainer.classList.toggle("full-screen");
    document.body.classList.toggle("full-screen");

    if (window.innerWidth > 1400) {
      mainContent.classList.add("full-screen");
    }
  });
}

// Tab menu toggler
function menuToggle() {
  const allTabs = document.querySelectorAll(".menu-tab");

  allTabs.forEach((singleTab) => {
    singleTab.addEventListener("click", () => {
      allTabs.forEach((active) => active.classList.remove("active-tab"));

      // Tab-specific logic (commented out for now)
      // if (singleTab.childNodes[3].innerHTML === "index.html") {
      //   generateHtmlCode(codeInput);
      // } else if (singleTab.childNodes[3].innerHTML === "style.css") {
      //   generateCssCode(codeInput);
      // }

      singleTab.classList.add("active-tab");
    });
  });
}

// Preview toggle with Shift + P or button click
function previewPage() {
  const previewBtn = document.querySelector(".preview-btn");
  const previewPage = document.querySelector(".preview-page");

  document.body.addEventListener("keyup", (e) => {
    if ((e.key === "p" && e.shiftKey) || (e.key === "P" && e.shiftKey)) {
      previewPage.classList.toggle("hide");
    }
  });

  previewBtn.addEventListener("click", () => {
    previewPage.classList.toggle("hide");
  });
}

// Live display code and sync to output
function displayCode() {
  const codeInput = document.querySelector(".code-input");
  const codeOutput = document.querySelector(".code-output");

  codeOutput.contentDocument.body.innerHTML = codeInput.value;
  codeInput.addEventListener("input", () => {
    codeOutput.contentDocument.body.innerHTML = codeInput.value;
    userCode.html = codeInput.value;

    starterCode();
    saveToStorage();
  });
}

// Shortcut for inserting basic HTML boilerplate
function starterCode() {
  if (codeInput.value == "!") {
    codeInput.value = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  
</body>
</html>`;
  }
}

// Save user code to localStorage
function saveToStorage() {
  localStorage.setItem("userCode", JSON.stringify(userCode));
}
