// Theme switching functionality
document.addEventListener("DOMContentLoaded", () => {
      const themeBtn = document.querySelector(".theme-btn");
      const themeOptions = document.querySelector(".theme-options");
      const currentThemeDisplay = document.querySelector(".current-theme");
      const categoryButtons = document.querySelectorAll(".category-btn");

      // Toggle main theme dropdown
      themeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        themeOptions.classList.toggle("show");
      });

      // Toggle category dropdowns
      categoryButtons.forEach(button => {
        button.addEventListener("click", (e) => {
          e.stopPropagation();
          const category = button.parentElement;
          category.classList.toggle("active");
          
          // Close other categories
          document.querySelectorAll(".theme-category").forEach(cat => {
            if (cat !== category) {
              cat.classList.remove("active");
            }
          });
        });
      });

      // Handle theme selection
      document.querySelectorAll(".theme-option").forEach((option) => {
        option.addEventListener("click", (e) => {
          e.stopPropagation();
          const theme = option.dataset.theme;
          const themeName = option.textContent;
          
          // Apply theme
          document.body.className = theme === "default" ? "" : `theme-${theme}`;
          
          // Update UI
          currentThemeDisplay.textContent = themeName;
          themeOptions.classList.remove("show");
          
          // Save to storage
          localStorage.setItem("editorTheme", theme);
          localStorage.setItem("editorThemeName", themeName);
        });
      });

      // Close dropdown when clicking outside
      document.addEventListener("click", () => {
        themeOptions.classList.remove("show");
        document.querySelectorAll(".theme-category").forEach(cat => {
          cat.classList.remove("active");
        });
      });

      // Load saved theme
      const savedTheme = localStorage.getItem("editorTheme") || "default";
      const savedThemeName = localStorage.getItem("editorThemeName") || "Dark";
      
      if (savedTheme !== "default") {
        document.body.classList.add(`theme-${savedTheme}`);
      }
      currentThemeDisplay.textContent = savedThemeName;

      // Keyboard navigation
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          themeOptions.classList.remove("show");
        }
      });
    });
// Automatic line numbering
const codeEditor = document.getElementById("code-editor");
const lineNumbers = document.getElementById("line-numbers");

function updateLineNumbers() {
  const lines = codeEditor.value.split("\n");
  let lineNumbersHTML = "";

  for (let i = 0; i < lines.length; i++) {
    lineNumbersHTML += i + 1 + "<br>";
  }

  // Add extra line if needed
  if (lines[lines.length - 1] === "") {
    lineNumbersHTML += lines.length + 1 + "<br>";
  }

  lineNumbers.innerHTML = lineNumbersHTML || "1<br>";
  updateSyntaxHighlighting();
}

// Update line numbers when content changes
codeEditor.addEventListener("input", () => {
  updateLineNumbers();

  // Update line and column in status bar
  const cursorPosition = codeEditor.selectionStart;
  const textBeforeCursor = codeEditor.value.substring(0, cursorPosition);
  const currentLine = textBeforeCursor.split("\n").length;
  const currentColumn = textBeforeCursor.split("\n").pop().length + 1;

  document.querySelector(
    ".status-item.right:last-child span"
  ).textContent = `Ln ${currentLine}, Col ${currentColumn}`;
});

// Update line numbers when scrolling
codeEditor.addEventListener("scroll", () => {
  lineNumbers.scrollTop = codeEditor.scrollTop;
  document.getElementById("code-highlight").scrollTop = codeEditor.scrollTop;
  document.getElementById("code-highlight").scrollLeft = codeEditor.scrollLeft;
});

// Update line numbers on window resize
window.addEventListener("resize", updateLineNumbers);

// Syntax highlighting functionality
function updateSyntaxHighlighting() {
  const activeTab = document.querySelector(".file.active").dataset.file;
  const code = codeEditor.value;
  const highlightElement = document.getElementById("code-highlight");

  if (activeTab === "html") {
    highlightElement.innerHTML = highlightHTML(code);
  } else if (activeTab === "css") {
    highlightElement.innerHTML = highlightCSS(code);
  } else if (activeTab === "js") {
    highlightElement.innerHTML = highlightJS(code);
  }
}

function highlightHTML(code) {
  // Simple HTML syntax highlighting
  return code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(
      /&lt;!--[\s\S]*?--&gt;/g,
      '<span style="color: var(--syntax-comment)">$&</span>'
    )
    .replace(
      /&lt;(\/?)([a-zA-Z][a-zA-Z0-9-]*)([^&]*)&gt;/g,
      function (match, slash, tag, attrs) {
        let result = `&lt;${slash}<span style="color: var(--syntax-tag)">${tag}</span>`;

        // Highlight attributes
        if (attrs) {
          attrs = attrs.replace(
            /([a-zA-Z-]+)(\s*=\s*)(['"])([^'"]*)\3/g,
            '<span style="color: var(--syntax-attribute)">$1</span>$2<span style="color: var(--syntax-string)">$3$4$3</span>'
          );
          result += attrs;
        }

        result += "&gt;";
        return result;
      }
    );
}

function highlightCSS(code) {
  // Simple CSS syntax highlighting
  return code
    .replace(
      /\/\*[\s\S]*?\*\//g,
      '<span style="color: var(--syntax-comment)">$&</span>'
    ) // comments
    .replace(
      /([a-zA-Z-]+)(?=\s*:)/g,
      '<span style="color: var(--syntax-attribute)">$1</span>'
    ) // properties
    .replace(
      /(:)([^;]+)(;)?/g,
      '$1<span style="color: var(--syntax-value)">$2</span>$3'
    ) // values
    .replace(
      /@[a-zA-Z-]+\b/g,
      '<span style="color: var(--syntax-keyword)">$&</span>'
    ) // at-rules
    .replace(/\.|#/g, '<span style="color: var(--syntax-tag)">$&</span>') // selectors
    .replace(
      /[a-zA-Z-]+(?=\s*{)/g,
      '<span style="color: var(--syntax-tag)">$&</span>'
    ); // tag names
}

function highlightJS(code) {
  // Simple JavaScript syntax highlighting
  const keywords = [
    "function",
    "return",
    "if",
    "else",
    "for",
    "while",
    "do",
    "switch",
    "case",
    "break",
    "continue",
    "try",
    "catch",
    "throw",
    "new",
    "delete",
    "typeof",
    "instanceof",
    "var",
    "let",
    "const",
    "true",
    "false",
    "null",
    "undefined",
    "this",
    "class",
    "extends",
    "super",
    "import",
    "export",
    "async",
    "await",
    "yield",
    "of",
    "in",
  ];

  const keywordRegex = new RegExp(`\\b(${keywords.join("|")})\\b`, "g");

  return code
    .replace(
      /\/\/.*$/gm,
      '<span style="color: var(--syntax-comment)">$&</span>'
    ) // line comments
    .replace(
      /\/\*[\s\S]*?\*\//g,
      '<span style="color: var(--syntax-comment)">$&</span>'
    ) // block comments
    .replace(
      keywordRegex,
      '<span style="color: var(--syntax-keyword)">$1</span>'
    ) // keywords
    .replace(
      /\b(function)\s+([a-zA-Z_$][0-9a-zA-Z_$]*)/g,
      '<span style="color: var(--syntax-keyword)">$1</span> <span style="color: var(--syntax-function)">$2</span>'
    ) // function declarations
    .replace(
      /\b([a-zA-Z_$][0-9a-zA-Z_$]*)\s*(?=\()/g,
      '<span style="color: var(--syntax-function)">$1</span>'
    ) // function calls
    .replace(
      /\b([0-9]+(\.[0-9]+)?)\b/g,
      '<span style="color: var(--syntax-number)">$1</span>'
    ) // numbers
    .replace(
      /(["'`])((?:\\\1|.)*?)\1/g,
      '<span style="color: var(--syntax-string)">$1$2$1</span>'
    ) // strings
    .replace(
      /([+\-*/%&|^~=!<>?:])=?/g,
      '<span style="color: var(--syntax-operator)">$1</span>'
    ) // operators
    .replace(
      /\b(this)\b/g,
      '<span style="color: var(--syntax-variable)">$1</span>'
    ); // this keyword
}

// Your existing JavaScript functionality would go here
let userCode = {
  html: "",
  css: "",
  js: "",
};

const codeOutput = document.querySelector(".preview-frame");
const previewBtn = document.querySelector(".preview-btn");
const fullPreviewBtn = document.querySelector(".full-preview-btn");
const refreshBtn = document.querySelector(".refresh-btn");
const runBtn = document.querySelector(".run-btn");
const copyBtn = document.querySelector(".copy-btn");
const clearBtn = document.querySelector(".clear-btn");
const files = document.querySelectorAll(".file");
const tabs = document.querySelectorAll(".tab");

// Restore saved code from localStorage
function restoreCode() {
  let previousCode = JSON.parse(localStorage.getItem("userCode")) || {
    html: "",
    css: "",
    js: "",
  };
  return previousCode;
}

// Tab menu toggler
function menuToggle() {
  files.forEach((file) => {
    file.addEventListener("click", () => {
      files.forEach((f) => f.classList.remove("active"));
      tabs.forEach((t) => t.classList.remove("active"));

      file.classList.add("active");
      const fileType = file.dataset.file;
      document
        .querySelector(`.tab[data-file="${fileType}"]`)
        .classList.add("active");

      if (fileType === "html") {
        generateHtmlCode();
      } else if (fileType === "css") {
        generateCssCode();
      } else {
        generateJsCode();
      }
    });
  });

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      files.forEach((f) => f.classList.remove("active"));

      tab.classList.add("active");
      const fileType = tab.dataset.file;
      document
        .querySelector(`.file[data-file="${fileType}"]`)
        .classList.add("active");

      if (fileType === "html") {
        generateHtmlCode();
      } else if (fileType === "css") {
        generateCssCode();
      } else {
        generateJsCode();
      }
    });
  });
}

// Preview toggle
function previewPage() {
  document.body.addEventListener("keyup", (e) => {
    if ((e.key === "p" && e.shiftKey) || (e.key === "P" && e.shiftKey)) {
      codeOutput.classList.toggle("hide");
      e.preventDefault();
    }
  });

  previewBtn.addEventListener("click", () => {
    codeOutput.classList.toggle("hide");
    generateHtmlCode();
  });

  refreshBtn.addEventListener("click", () => {
    generateHtmlCode();
  });
}

function openIframeContentInNewTab() {
  const doc = codeOutput.contentDocument || codeOutput.contentWindow.document;
  const html = doc.documentElement.outerHTML;

  const newTab = window.open();
  newTab.document.open();
  newTab.document.write(html);
  newTab.document.close();
}

// Live display code and sync to output
function generateHtmlCode() {
  let previousCode = restoreCode();
  codeEditor.placeholder = `Type "!" to insert boilerplate HTML code`;
  codeEditor.value = previousCode.html;
  userCode.html = codeEditor.value;
  updateLineNumbers();

  if (codeOutput.contentDocument) {
    codeOutput.contentDocument.body.innerHTML = codeEditor.value;
    codeOutput.contentDocument.head.innerHTML = `<style>${userCode.css}</style>`;

    // Inject JS if exists
    if (userCode.js) {
      const script = document.createElement("script");
      script.textContent = userCode.js;
      codeOutput.contentDocument.body.appendChild(script);
    }
  }

  codeEditor.oninput = () => {
    if (codeOutput.contentDocument) {
      codeOutput.contentDocument.body.innerHTML = codeEditor.value;
      codeOutput.contentDocument.head.innerHTML = `<style>${userCode.css}</style>`;

      // Re-inject JS on HTML changes
      if (userCode.js) {
        const oldScripts =
          codeOutput.contentDocument.querySelectorAll("script");
        oldScripts.forEach((script) => script.remove());

        const script = document.createElement("script");
        script.textContent = userCode.js;
        codeOutput.contentDocument.body.appendChild(script);
      }
    }
    userCode.html = codeEditor.value;
    starterCode();
    saveToStorage();
  };
}

function generateCssCode() {
  codeEditor.placeholder = `Type "*" to insert boilerplate CSS`;
  let previousCode = restoreCode();
  codeEditor.value = previousCode.css;
  userCode.css = codeEditor.value;
  updateLineNumbers();

  if (codeOutput.contentDocument) {
    codeOutput.contentDocument.head.innerHTML = `<style>${codeEditor.value}</style>`;
  }

  codeEditor.oninput = () => {
    if (codeOutput.contentDocument) {
      codeOutput.contentDocument.head.innerHTML = `<style>${codeEditor.value}</style>`;
    }
    userCode.css = codeEditor.value;
    starterCode();
    saveToStorage();
  };
}

function generateJsCode() {
  runBtn.addEventListener("click", () => {
    if (codeOutput.contentDocument) {
      // Remove old scripts first
      const oldScripts = codeOutput.contentDocument.querySelectorAll("script");
      oldScripts.forEach((script) => script.remove());

      const script = document.createElement("script");
      script.textContent = codeEditor.value;
      codeOutput.contentDocument.body.appendChild(script);
    }
  });

  codeEditor.placeholder = `Write JavaScript Code`;
  let previousCode = restoreCode();
  codeEditor.value = previousCode.js;
  userCode.js = codeEditor.value;
  updateLineNumbers();

  codeEditor.oninput = () => {
    userCode.js = codeEditor.value;
    starterCode();
    saveToStorage();
  };
}

// Shortcut for inserting basic HTML boilerplate
function starterCode() {
  if (codeEditor.value === "!") {
    codeEditor.value = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
     // Your Css code here
    </style>
</head>
<body>
    <h1>Hello World</h1>
    <p>Start coding here...</p>
    
    <script>
        // Your JavaScript code here
    </script>
</body>
</html>`;
    userCode.html = codeEditor.value;
    updateLineNumbers();
  } else if (codeEditor.value == "*") {
    codeEditor.value = `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
`;
    userCode.css = codeEditor.value;
    updateLineNumbers();
  }
}

// Save user code to localStorage
function saveToStorage() {
  localStorage.setItem("userCode", JSON.stringify(userCode));
}

function copyCode() {
  copyBtn.addEventListener("click", () => {
    let copyOfCode = codeEditor.value;

    navigator.clipboard.writeText(copyOfCode);

    copyBtn.innerHTML = `<i class="fas fa-check"></i>`;
    setTimeout(() => {
      copyBtn.innerHTML = `<i class="fas fa-copy"></i>`;
    }, 1200);
  });
}

function deleteCode() {
  clearBtn.addEventListener("click", () => {
    clearBtn.innerHTML = `<i class="fas fa-check"></i>`;
    setTimeout(() => {
      clearBtn.innerHTML = `<i class="fas fa-trash"></i>`;
    }, 1200);
    codeEditor.value = "";
    userCode.html = "";
    userCode.css = "";
    userCode.js = "";
    updateLineNumbers();
    saveToStorage();

    // Clear preview iframe
    if (codeOutput.contentDocument) {
      codeOutput.contentDocument.body.innerHTML = "";
      codeOutput.contentDocument.head.innerHTML = "";
    }
  });
}

// Full preview functionality
fullPreviewBtn.addEventListener("click", () => {
  openIframeContentInNewTab();
});

document
  .querySelector(".icon-button.full-preview-btn")
  .addEventListener("click", () => {
    openIframeContentInNewTab();
  });

function goFullScreen() {
  const fullscreenBtn = document.querySelector(".full-screen-btn");
  fullscreenBtn.addEventListener("click", () => {
    if (
      !document.fullscreenElement &&
      !document.webkitFullscreenElement &&
      !document.msFullscreenElement
    ) {
      // Enter fullscreen
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        // Safari
        document.documentElement.webkitRequestFullscreen();
      } else if (document.documentElement.msRequestFullscreen) {
        // IE/Edge
        document.documentElement.msRequestFullscreen();
      }
    } else {
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        // Safari
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        // IE/Edge
        document.msExitFullscreen();
      }
    }
  });
}
document.addEventListener("DOMContentLoaded", () => {
  goFullScreen();
  restoreCode();
  starterCode();
  menuToggle();
  generateHtmlCode();
  previewPage();
  copyCode();
  deleteCode();

  // Set HTML as default active tab
  document.querySelector('.file[data-file="html"]').click();

  // Initialize syntax highlighting
  updateSyntaxHighlighting();

  // Update syntax highlighting when tab changes
  document.querySelectorAll(".file, .tab").forEach((el) => {
    el.addEventListener("click", updateSyntaxHighlighting);
  });

  // Update syntax highlighting when code changes
  codeEditor.addEventListener("input", updateSyntaxHighlighting);

  // Make sure the preview iframe has a document
  if (codeOutput.contentDocument) {
    codeOutput.contentDocument.open();
    codeOutput.contentDocument.write(
      "<!DOCTYPE html><html><head></head><body></body></html>"
    );
    codeOutput.contentDocument.close();
  }
});
