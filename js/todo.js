"use strict";
(function (){

  let listBody = document.getElementById("todo-list");
  let listItems = document.getElementsByClassName("checkbox");
  let deleteIcons = document.getElementsByClassName("delete");
  let todoInput = document.getElementById("todo-input");
  let taskList = [];

  function getTaskList(task) {
    console.log(task);
    taskList.push(task);
    console.log(taskList);
  }

  function renderTask(task) {
    // Build task item html here
    console.log(task);
    listBody.innerHTML += "<li class='checkbox'>" + task + "<span class='delete'>(X)</span></li>";

  }

  function deleteTask(task) {
    event.stopPropagation();
    task.parentElement.remove();
  }


  let todoUtil = {
    applyCheck:
        function () {
          for (let i = 0; i < listItems.length; i++) {
            listItems[i].addEventListener("click", function () {
              listItems[i].classList.toggle("checked");
            }, false);
          }
        },
    applyDelete:
        function () {
          for (let i = 0; i < deleteIcons.length; i++) {
            deleteIcons[i].addEventListener("click", event => {
              deleteTask(event.target);
            }, false);
          }
        }
  };

  todoInput.addEventListener("keydown", event => {
    if (event.keyCode === 13) {

      getTaskList(event.target.value);
      renderTask(event.target.value);

      todoUtil.applyDelete();
      todoUtil.applyCheck();

      todoInput.value = "";
    }
  }, false);

})();


