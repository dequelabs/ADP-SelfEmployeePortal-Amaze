//generic add Enter key event listener function on element
function addEnterKeyEventListener(element, callback) {
  element.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      if (callback) {
        callback();
      } else {
        element.click();
      }
    }
  });
}

//generic funtion to run on click on document
function onDocumentClick(ele, callback) {
  document.addEventListener("click", function (event) {
    if (!ele.contains(event.target)) {
      console.log("clicked outside", event.target);
      callback();
    }
  });
}

function getElementByText(selector, text) {
  return Array.from(document.querySelectorAll(selector)).find((element) =>
    element.textContent.includes(text)
  );
}

function getElementsByText(selector, text) {
  return Array.from(document.querySelectorAll(selector)).filter((element) =>
    element.textContent.includes(text)
  );
}

function trapFocusOnModal(modal) {
  if (!modal) return;
  let allPossibleInteractiveElements = Array.from(
    modal.querySelectorAll(
      "button, [href], input, select, textarea, [tabindex]"
    )
  ).filter(
    (el) =>
      !el.hasAttribute("disabled") &&
      el.getAttribute("tabindex") !== "-1" &&
      el.offsetParent !== null
  );
  let firstElement = allPossibleInteractiveElements[0];
  let lastElement =
    allPossibleInteractiveElements[allPossibleInteractiveElements.length - 1];
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
}

function listBoxFix(ID) {
  var listbox = document.querySelector(".vdl-list");
  listbox.setAttribute("role", "listbox");
  listbox.id = ID;
  Array.from(listbox.children).forEach((child, i) => {
    if (i === 0) {
      child.classList.add("active");
    }
    child.setAttribute("id", ID + "-opt-" + i);
  });
}

(function fixLinks () {
    var links = document.querySelectorAll("a");
    links.forEach((link) => {
      if (!link.hasAttribute("href")) {
        link.setAttribute("href", "javascript:void(0)");
      }
      link.addEventListener("click", function () {
        fixLinks();
      });
    });
})();

export {
  addEnterKeyEventListener,
  getElementByText,
  getElementsByText,
  onDocumentClick,
  trapFocusOnModal,
  dropDownFix,
  listBoxFix,
  fixLinks
};
