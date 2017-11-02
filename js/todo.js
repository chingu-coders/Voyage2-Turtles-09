"use strict";
(function (){
  $(document).ready(function(){



      let listBody = document.getElementsByClassName("todo-list");
      let allTasks = document.getElementsByClassName("task");
      let deleteIcons = document.getElementsByClassName("todo-delete");
      let todoInput = document.getElementById("todo-input");
      let addListBtn = document.getElementsByClassName("add-new-todo-list")[0];
      let numTodos = 0;

//TODO: Clicking on a task name opens the task list on the right side

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
      // .off() to prevent multiple listeners from being added to a single task
      $(task).off().on("click", function(e) {
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

    // function applyListToggle() {
    //   // Toggle active list
    //   console.log("applyListToggle is running");
    //   // Applying listener to last element only so each elements gets 1 listener only
    //   $(listCollapsible).last().on("click", function(e){
    //     e.stopPropagation();
    //     // Removing all classes prevents multiple lists from being selected
    //     $(listCollapsible).find(".todo-list-title").removeClass("todo-list-selected");
    //     $(this).find(".todo-list-title").addClass("todo-list-selected");
    //     $(this).find(".todo-list").slideToggle();
    //   });
    // }

      // function renderNewList(listName) {
      //   let newList =
      //       '<li class="todo-multilist-item">' +
      //       '<h4 class="todo-list-title">' + listName + '</h4>' +
      //       '<ul class="todo-list"></ul>' +
      //       '</li>';
      //   $(listPanel).append(newList);
      //   applyListToggle();
      // }

    // function getActiveList() {
    //   // The active list is tracked by the selected class
    //     activeList = $(listCollapsible).find(".todo-list-selected");
    //     return activeList;
    // }

    // Add new lists to panel
    $(".list-input").on("keydown", function(e) {
      if (event.which === 13) {
        let list = `<li>${e.target.value}</li>`;
        $(".list-panel").find("ul").append(list);
        // Clear the input after user hits enter
        $(".list-input").val("");
      }
    });


    $(".list-panel").find("li").on("click", function(){
      console.log("click");
      $(".list-panel li").removeClass("list-selected");
      $(this).addClass("list-selected");
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

    // function addToList(list, newItem) {
    //   $(list).append(renderItem(newItem));
    // }

      function addNewTask() {
        $(todoInput).on("keydown", function(event) {
          if (event.which === 13) {

            let newItem = event.target.value;

            todoInput.value = "";








            // addToList(getActiveList(), newItem);
            //
            // applyDelete($(allTasks).find("span"));

            // Increases # tasks
            updateTodoStatus(false);
          }
        });
      }

      addNewTask();




  });
})();


