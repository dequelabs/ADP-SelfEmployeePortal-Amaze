import { fixButton } from "@amaze/plugins";

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

  //-----------------------------Dashboard fix--------------------------------

  let pageUrl = window.location.href;

  console.log("Demo Fix Loaded");
  //generic add Enter key event listener function on element
  function addEnterKeyEventListener(element, callback) {
    element.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        if (callback) {
          callback();
        } else{
          element.click();
        }
      }
    });
  };

  //generic funtion to run on click on document
  function onDocumentClick (ele, callback) {
    document.addEventListener("click", function (event) {
      if (!ele.contains(event.target)) {
        console.log("clicked outside", event.target);
        callback();
      }
    });
  };

  function getElementByText(selector, text) {
    return Array.from(document.querySelectorAll(selector)).find((element) => element.textContent.includes(text));
  }

  function getElementsByText(selector, text) {
    return Array.from(document.querySelectorAll(selector)).filter((element) => element.textContent.includes(text));
  }

  function trapFocusOnModal(modal) {
    if (!modal) return;
    let allPossibleInteractiveElements = Array.from(modal.querySelectorAll("button, [href], input, select, textarea, [tabindex]")).filter((el) => !el.hasAttribute("disabled") && el.getAttribute("tabindex") !== "-1" && el.offsetParent !== null);
    let firstElement = allPossibleInteractiveElements[0];
    let lastElement = allPossibleInteractiveElements[allPossibleInteractiveElements.length - 1];
    console.log("firstElement", firstElement);
    console.log("lastElement", lastElement);
    firstElement.addEventListener("keydown", function (e) {
      if (e.shiftKey && e.key === "Tab") {
        e.preventDefault();
        lastElement.focus();
      }
    });
    lastElement.addEventListener("keydown", function (e) {
      if (!e.shiftKey && e.key === "Tab") {
        console.log("tab pressed"); 
        e.preventDefault();
        firstElement.focus();
      }
    });
  }

  function dropDownFix() {
    let dropdowns = document.querySelectorAll(".vdl-dropdown-list");
    dropdowns.forEach((dropdown, i) => {
      let ddId = "vdl-dd" + i;
      
      //label association
      let label = dropdown.parentElement.previousElementSibling;
      if (label && label.tagName === "LABEL") {
        let id = "vdl-dd-label" + i;
        label.id = id;
        dropdown.setAttribute("aria-labelledby", id);
      }

      dropdown.setAttribute("aria-expanded", "false");
      dropdown.setAttribute("aria-activedescendant", "");
      dropdown.setAttribute("aria-controls", ddId);
      addEnterKeyEventListener(dropdown);
      dropdown.addEventListener("click", function () {
        if (dropdown.getAttribute("aria-expanded") === "true") {
          dropdown.setAttribute("aria-expanded", "false");
        } else {
          dropdown.setAttribute("aria-expanded", "true");
          listBoxFix(ddId);
        }
      });

      onDocumentClick(dropdown, function () {
        dropdown.setAttribute("aria-expanded", "false");
      });
    });
  };

  function listBoxFix (ID) {
    var listbox = document.querySelector(".vdl-list");
    listbox.setAttribute("role", "listbox");
    listbox.setAttribute("aria-label", "Financial Year");
    listbox.id = ID;
    Array.from(listbox.children).forEach((child, i) => {
      if (i === 0) {
        child.classList.add("active");
      }
      child.setAttribute("id", ID + "-opt-" + i);
    });
  }

  function removeZoomMeta() {
    const metaViewport = document.querySelector("meta[name=viewport]");
    if (metaViewport) {
      let content = metaViewport.getAttribute('content');
      content = content.replace(/(user-scalable=[^,]*,?)|(maximum-scale=1\.0,?)/g, "").trim();
      if (content.endsWith(',')) {
        content = content.slice(0, -1);
      }
      metaViewport.setAttribute('content', content);
    } 
  }

  function fixLinks () {
    var links = document.querySelectorAll("a");
    links.forEach((link) => {
      if (!link.hasAttribute("href")) {
        link.setAttribute("href", "javascript:void(0)");
      }
      link.addEventListener("click", function () {
        fixLinks();
      });
    });
  }
  fixLinks();

  function fixNestedFocus () {
    let buttons = document.querySelectorAll("adp-button");
    buttons.forEach((button) => {
      button.removeAttribute("tabindex");
      button.addEventListener("click", function () {
        fixLinks();
      });
    });
  }

  function fixDialogRoles(overlay) {
    overlay.querySelector(".vdl-slidein slidein-title")?.setAttribute("id", "modal-title");
    overlay.querySelector(".vdl-slidein")?.setAttribute("aria-modal", "true");
    overlay.querySelector(".vdl-slidein")?.setAttribute("aria-labelledby", "modal-title");
  }

  function loadPayInfo () {
    dropDownFix();
    payInfoLinks();
    viewBtnsFix();
    removeTablist();
    loadpayInfoBreakdown();

    //place focus on modal
    let overlay = document.querySelector("adp-overlay");
    trapFocusOnModal(overlay);
    overlay.querySelector("slidein-body [tabindex]")?.focus();
    fixDialogRoles(overlay);
  }

  function loadpayInfoBreakdown () {
    let viewBreakDownBtns = getElementsByText("adp-tile a.font-size-small", "View Pay Breakdown");
    let graphViewBtn = Array.from(document.querySelectorAll(".div-list")).filter(btn=>btn.getAttribute("title") === "Graph View");
    viewBreakDownBtns = viewBreakDownBtns.concat(graphViewBtn);
    if (viewBreakDownBtns.length > 0) {
      viewBreakDownBtns.forEach((viewBreakDownBtn) => {
        viewBreakDownBtn.addEventListener("click", function () {
          setTimeout(() => {
            removeTablist();
            tileTitleHeadings();
          }, 300);
        });
      });
    }
  }

  function removeTablist() {
    document.querySelectorAll("adp-accordion .vdl-accordion").forEach((accordion) => {
      accordion?.removeAttribute("role");
    });
  }

  function onGoToPayHistory(){
    let goToPayHistoryBtn = getElementByText("adp-button", "Go to Pay History");
    if (goToPayHistoryBtn) {
      goToPayHistoryBtn.addEventListener("click", function () {
        setTimeout(()=>{
          loadPayInfo();
          tileTitleHeadings();
        }, 300);
      });
    }
  }

  function onViewPaySlip(){
    var viewPaySlipBtn = getElementByText("button", "View Payslip");
    if (viewPaySlipBtn) {
      viewPaySlipBtn.addEventListener("click", function () {
        setTimeout(() => {
          fixLinks();
          onGoToPayHistory();
          tileTitleHeadings();
          let overlay = document.querySelector("adp-overlay");
          trapFocusOnModal(overlay);
          overlay.querySelector("slidein-body button")?.focus();
          fixDialogRoles(overlay);
        }, 300);
      });
    }
  }

  function payInfoLinks(){
    setTimeout(() => {
      fixLinks();
    }, 3000);
  }

  function viewBtnsFix(){
    let viewBtns = document.querySelectorAll(".div-list");
    viewBtns.forEach((viewBtn) => {
      fixButton(viewBtn);
      addEnterKeyEventListener(viewBtn);
    });
  }

  function onPayHistory(){
    var payHistoryBtn = document.querySelector("[skiplocationchange]");
    if (payHistoryBtn) {
      payHistoryBtn.addEventListener("click", function () {
        loadPayInfo();
        tileTitleHeadings();
      });
    }
  }

  function onNewtaxModalLoad() {
    let modal = document.querySelector("adp-modal");
    let title = modal?.querySelector("modal-title");
    if(modal && title){
      let modalCloseBtn = modal.querySelector(".vdl-modal__close");
      if(!title.id) title.id = "modal-title";
      fixButton(modalCloseBtn);
      modalCloseBtn.setAttribute("aria-label", "Close");
      addEnterKeyEventListener(modalCloseBtn);
      modal.setAttribute("role", "dialog");
      modal.setAttribute("aria-labelledby", title.id);
      modal.setAttribute("aria-modal", "true");
      trapFocusOnModal(modal);
      setTimeout(()=>{modalCloseBtn.focus()}, 0);
    }
  }

  function tileTitleHeadings() {
    let tileTitles = document.querySelectorAll(".custom-tile-title, slidein-title");
    tileTitles.forEach((tileTitle) => {
      tileTitle.setAttribute("role", "heading");
      tileTitle.setAttribute("aria-level", "2");
    });

    let tileSubTitles = document.querySelectorAll("tile-title");
    tileSubTitles.forEach((tileSubTitle) => {
      tileSubTitle.setAttribute("role", "heading");
      tileSubTitle.setAttribute("aria-level", "3");
    });
  };

  setTimeout(() => {
    onNewtaxModalLoad();
    onPayHistory();
    removeZoomMeta();
    fixLinks();
    fixNestedFocus();
    onViewPaySlip();
    tileTitleHeadings();
  }, 3000);

  //-----------------------------reports fix--------------------------------

  if(pageUrl.includes("reports")){
    function onTaxPayment(){
      var taxPaymentBtn = getElementByText("button", "Tax Statement");
      if (taxPaymentBtn) {
        taxPaymentBtn.addEventListener("click", function () {
          setTimeout(()=>{
            fixLinks();
            tileTitleHeadings();
            document.querySelector("adp-overlay slidein-body [tabindex]")?.focus();
          }, 300);
        });
      }
    }
    
    setTimeout(() => {
      dropDownFix();
      onTaxPayment();
    }, 3000);
  }

  //-----------------------------change profile fix--------------------------------
  if(pageUrl.includes("changeprofile")){
    function addAltTextToProfileImage() {
      let profileImage = document.querySelector(".profileImg");
      if (profileImage) {
        profileImage.setAttribute("alt", "User Profile Picture");
      }
    }

    function associateLabels() {
      let formElements = document.querySelectorAll("adp-form-group");
      formElements.forEach((formEl, i) => {
        let label = formEl.querySelector("label");
        let input = formEl.querySelector("input");
        if (label && input) {
          let id = "input" + i;
          input.id = id;
          label.setAttribute("for", id);
        }
      });
    }

    function uploadPicFix() {
      let uploadPicBtn = document.querySelector(".fa-upload+span");
      if (uploadPicBtn) {
        uploadPicBtn.setAttribute("tabindex", "0");
        addEnterKeyEventListener(uploadPicBtn);
      }
    }

    setTimeout(() => {
      addAltTextToProfileImage();
      associateLabels();
      uploadPicFix();
    }, 3000);
  }
  
})();
