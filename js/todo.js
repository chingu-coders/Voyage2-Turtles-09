"use strict";
(function (){
  $(document).ready(function(){
      let listPanel = document.getElementsByClassName("todo-multilist-foundation")[0];
      let listCollapsible = document.getElementsByClassName("todo-multilist-item");
      let customList = document.getElementsByClassName("todo-list");
      let addListInput = document.getElementsByClassName("add-new-todo-list")[0];



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

      function renderItem(newItem) {
        let newListItem =
            '<li class="task">' +
            '<input type="checkbox">'
            + newItem
            + '<span class="todo-delete hidden">x</span>'
            + '</li>';
        applyDelete($(allListItems).last().find("span"));
        return newListItem;
      }

      function addToList(list, newItem) {
        $(list).append(renderItem(newItem));
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
        $(this).find(".todo-list-title").css("font-weight: bold");
        $(this).find(customList).slideToggle();
      });

      $(addListInput).on("keydown", function(e) {
        if (event.which === 13) {
          renderNewList(e.target.value);
        }
      });

      function renderNewList(listName) {
        let newList =
            listName +
            '<ul class="todo-multilist-item">' +
            '<li class="todo-list"></li>' +
            '</ul>';
        $(listPanel).append(newList);
      }

      function addNewTask() {
        $(todoInput).on("keydown", function(event) {
          if (event.which === 13) {
            let newItem = event.target.value;
            todoInput.value = "";
            addToList(list, newItem);
            renderItem(newItem);
            updateTodoStatus(false);
          }
        });
      }

      addNewTask();

  });
})();


