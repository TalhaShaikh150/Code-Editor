let userCode = {
  html: "",
  css: "",
  js: "",
};

const codeInput = document.querySelector(".code-input");
const codeOutput = document.querySelector(".code-output");

// Restore saved code from localStorage
function restoreCode() {
  let previousCode = JSON.parse(localStorage.getItem("userCode")) || {
    html: "",
    css: "",
    js: "",
  };
  return previousCode;
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

      if (singleTab.childNodes[3].innerHTML === "index.html") {
        generateHtmlCode();
      } else if (singleTab.childNodes[3].innerHTML === "style.css") {
        generateCssCode();
      } else {
        generateJsCode();
      }
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
      e.preventDefault();
    }
  });

  previewBtn.addEventListener("click", () => {
    previewPage.classList.toggle("hide");
    generateHtmlCode();
  });
}
function openIframeContentInNewTab() {
  const iframe = document.querySelector("iframe.code-output");
  const doc = iframe.contentDocument || iframe.contentWindow.document;
  const html = doc.documentElement.outerHTML;

  const newTab = window.open();
  newTab.document.open();
  newTab.document.write(html);
  newTab.document.close();
}

// Live display code and sync to output
function generateHtmlCode() {
  let previousCode = restoreCode();
  codeInput.placeholder = `Type "!" to insert boilerplate HTML code`;
  codeInput.value = previousCode.html;
  userCode.html = codeInput.value;
  codeOutput.contentDocument.body.innerHTML = codeInput.value;
  codeInput.oninput = () => {
    codeOutput.contentDocument.body.innerHTML = codeInput.value;
    userCode.html = codeInput.value;
    starterCode();
    saveToStorage();
  };
}

function generateCssCode() {
  codeInput.placeholder = `Type "*" to insert boilerplate CSS`;
  let previousCode = restoreCode();
  codeInput.value = previousCode.css;
  userCode.css = codeInput.value;
  codeOutput.contentDocument.head.innerHTML = `<style>${codeInput.value}</style>`;
  codeInput.oninput = () => {
    codeOutput.contentDocument.head.innerHTML = `<style>${codeInput.value}</style>`;
    userCode.css = codeInput.value;
    starterCode();
    saveToStorage();
  };
}

function generateJsCode() {
  const runCodeBtn = document.querySelector(".run-btn");
  runCodeBtn.style.pointerEvents = "auto";
  runCodeBtn.addEventListener("click", () => {
    codeOutput.contentDocument.write(`
  <script>
  ${codeInput.value}
  <\/script>
`);
  });
  codeInput.placeholder = `Write JavaScript Code`;
  let previousCode = restoreCode();
  codeInput.value = previousCode.js;
  userCode.js = codeInput.value;
  codeInput.oninput = () => {
    userCode.js = codeInput.value;
    starterCode();
    saveToStorage();
  };
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
    userCode.html = codeInput.value;
  } else if (codeInput.value == "*") {
    codeInput.value = `* {
   margin: 0;
   padding: 0;
   font-family: "Poppins", sans-serif;
}`;
    userCode.css = codeInput.value;
  }
}

// Save user code to localStorage
function saveToStorage() {
  if (userCode.html === undefined) {
    alert("hello");
  }
  localStorage.setItem("userCode", JSON.stringify(userCode)) || "";
}

document.addEventListener("DOMContentLoaded", () => {
  restoreCode();
  starterCode();
  menuToggle();
  fullScreen();
  generateCssCode();
  generateHtmlCode();
  previewPage();
});
