export default (() => {
    //-----------------------------header fix--------------------------------
  function headerMenuBtn() {
    // access avatar button inside the shadow-root open
    let avatar = document.querySelector("sfc-shell-app-bar")?.shadowRoot.querySelector(".avatar-button");
    if (avatar) {
      avatar.setAttribute("aria-label", "User Profile");
      avatar.setAttribute("aria-haspopup", "true");
      avatar.setAttribute("aria-expanded", "false");
      avatar.addEventListener("click", function () {
        if (avatar.getAttribute("aria-expanded") === "true") {
          avatar.setAttribute("aria-expanded", "false");
        } else {
          avatar.setAttribute("aria-expanded", "true");
        }
      });
      addEnterKeyEventListener(avatar);
    }
  }

  setTimeout(() => {
    headerMenuBtn();
  }, 3000);
})();