"use strict";
(function (){
  $(document).ready(function(){
      let listCollapsible = document.getElementsByClassName("todo-multilist-item");
      let customList = document.getElementsByClassName("todo-list");



      let listBody = document.getElementsByClassName("todo-list");
      let allListItems = document.getElementsByClassName("task");
      let deleteIcons = document.getElementsByClassName("todo-delete");
      let todoInput = document.getElementById("todo-input");
      let addListBtn = document.getElementsByClassName("add-new-todo-list")[0];
      let numTodos = 0;

// TODO: Add multiple to-do lists
// TODO: Add list state to chrome.storage
// TODO: Add Dr. McGregor's list as default list
// TODO: Style Todo to be consistent with overall design

      function renderTodoStatus() {
        let todoStatus = document.getElementsByClassName("todo-status")[0];
        todoStatus.innerText = numTodos + " todos";
      }

      function updateTodoStatus(isDelete) {
        if (!isDelete) {
          numTodos++;
        }
        if (isDelete) {
          numTodos--;
        }
        renderTodoStatus();
      }

      function renderItem(newTask) {
        let newListItem =
            '<li class="task">' +
            '<input type="checkbox">'
            + newTask
            + '<span class="todo-delete hidden">x</span>'
            + '</li>';
        $(listBody).append(newListItem);
        applyDelete($(allListItems).last().find("span"));

      }

      function deleteHover() {

        function handlerIn() {
          $(this).find(deleteIcons).removeClass("hidden");
        }
        function handlerOut() {
          $(this).find(deleteIcons).addClass("hidden");
        }
        $(allListItems).hover(handlerIn, handlerOut);
      }

      function applyDelete(task) {
        console.log("[debug] passed to applyDelete: " + task);
        $(task).on("click", function(e) {
          e.stopPropagation();
          $(e.target).parent().fadeOut();
          updateTodoStatus(true);
        });
        deleteHover();
      }

      $(listCollapsible).on("click", function(){
        $(this).find(customList).slideToggle();
      });

      $(addListBtn).on("click", function(e) {
        addNewList(e.target.value);
      });
      // after newListButton on click
      function addNewList(listName) {
        listBody.prepend(listName);
      }

      function addNewTask() {
        $(todoInput).on("keydown", function(event) {
          if (event.which === 13) {
            let newTask = event.target.value;
            todoInput.value = "";
            renderItem(newTask);
            updateTodoStatus(false);
          }
        });
      }

      addNewTask();

  });
})();


