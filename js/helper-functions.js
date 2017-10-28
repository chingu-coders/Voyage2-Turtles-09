function showElement(element) {
  element.classList.remove("hidden");
}

function hideElement(element) {
  element.classList.add("hidden");
}

// This function is based on; 
// https://stackoverflow.com/questions/17928816/how-to-get-and-hide-siblings-in-javascript
function hideAllChildrenButOne(parentId, toRevealId) {
  let children = document.getElementById(parentId).children;
  for (let i = 0; i < children.length; i++) {
    hideElement(children[i]);
  }
  showElement(toRevealId);
}

function addClassToOneChild(parentSelector, toReceiveClass, classToAdd) {
  let children = document.querySelector(parentSelector).children;
  for (let i = 0; i < children.length; i++) {
    children[i].classList.remove(classToAdd);
  }
  toReceiveClass.classList.add(classToAdd);
}
