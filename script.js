function fullScreen() {
  const fullScreenBtn = document.querySelector(".full-btn");
  const mainContainer = document.querySelector("main");
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
  });
}
fullScreen();
