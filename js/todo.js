"use strict";
(function (){
  $(document).ready(function(){
      let listPanel = document.getElementsByClassName("todo-multilist-foundation")[0];
      let listCollapsible = document.getElementsByClassName("todo-multilist-item");
      let customList = document.getElementsByClassName("todo-list");
      let addListInput = document.getElementsByClassName("add-new-todo-list")[0];
      let listTitle = $(listCollapsible).find(".todo-list-title");
      let activeList;


      let listBody = document.getElementsByClassName("todo-list");
      let allTasks = document.getElementsByClassName("task");
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

    function applyDelete(task) {
      $(task).on("click", function(e) {
        e.stopPropagation();
        $(e.target).parent().fadeOut();
        updateTodoStatus(true);
      });
      deleteHover();
    }

    function deleteHover() {

      function handlerIn() {
        console.log("hover");
        $(this).find(deleteIcons).removeClass("hidden");
      }
      function handlerOut() {
        $(this).find(deleteIcons).addClass("hidden");
      }
      $(allTasks).hover(handlerIn, handlerOut);
    }





      function renderNewList(listName) {
        let newList =
            listName +
            '<ul class="todo-multilist-item">' +
            '<li class="todo-list"></li>' +
            '</ul>';
        $(listPanel).append(newList);
      }

    function getActiveList() {
      // The active list is tracked by the selected class
      if(listTitle.hasClass("todo-list-selected")) {
        activeList = $("li").find(".todo-list-selected").next();
        return activeList;
      } else {
        return;
      }
    }

    // Add new lists to panel
    $(addListInput).on("keydown", function(e) {
      if (event.which === 13) {
        renderNewList(e.target.value);
      }
    });

    // Toggle active list
    $(listCollapsible).on("click", function(e){
      // e.stopPropagation();
      // Removing all classes prevents multiple lists from being selected
      $(listPanel).find(".todo-list-title").removeClass("todo-list-selected");
      $(this).find(".todo-list-title").addClass("todo-list-selected");
      $(this).find(customList).slideToggle();
    });

    function renderItem(newItem) {
      let newListItem =
          '<li class="task">' +
          '<input type="checkbox">'
          + newItem
          + '<span class="todo-delete hidden">x</span>'
          + '</li>';
      return newListItem;
    }

    function addToList(list, newItem) {
      $(list).append(renderItem(newItem));
    }

      function addNewTask() {
        $(todoInput).on("keydown", function(event) {
          if (event.which === 13) {

            let newItem = event.target.value;
            todoInput.value = "";

            addToList(getActiveList(), newItem);
            applyDelete($(allTasks).last().find("span"));

            // Increases # tasks
            updateTodoStatus(false);
          }
        });
      }

      addNewTask();




  });
})();


