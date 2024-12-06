import { fixButton } from "@amaze/plugins";
import { addEnterKeyEventListener,
  getElementByText,
  getElementsByText,
  trapFocusOnModal,
  dropDownFix,
  fixLinks
} from "./helper/index.js";

export default (() => {
  
  //-----------------------------Dashboard fix--------------------------------

  let pageUrl = window.location.href;

  console.log("Demo Fix Loaded");

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
